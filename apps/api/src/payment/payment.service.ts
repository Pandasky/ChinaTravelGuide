import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';
import { CreateCheckoutDto, ProductType } from './dto/create-checkout.dto';
import { CreateRefundDto } from './dto/refund.dto';
import { PaymentProvider, PaymentStatusDto } from './dto/verify-payment.dto';
import { PayPalWebhookDto } from './dto/payment-webhook.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
  ) {}

  // ============ Checkout ============

  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    const { type, productId, paymentMethod = 'stripe' } = dto;

    if (paymentMethod === 'stripe') {
      return this.createStripeCheckout(userId, type, productId, dto.successUrl, dto.cancelUrl);
    } else if (paymentMethod === 'paypal') {
      return this.createPayPalCheckout(userId, type, productId, dto.successUrl, dto.cancelUrl);
    }

    throw new BadRequestException('Invalid payment method');
  }

  private async createStripeCheckout(
    userId: string,
    type: ProductType,
    productId: string,
    successUrl?: string,
    cancelUrl?: string,
  ) {
    if (!this.stripeService.isConfigured()) {
      throw new BadRequestException('Stripe is not configured');
    }

    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (type === ProductType.GUIDE) {
      const guide = await this.prisma.guide.findUnique({ where: { id: productId } });
      if (!guide) throw new NotFoundException('Guide not found');

      // Check if already purchased
      const existingOrder = await this.prisma.order.findFirst({
        where: { userId, guideId: productId, status: 'COMPLETED' },
      });
      if (existingOrder) throw new BadRequestException('You have already purchased this guide');

      // Create Stripe checkout
      const session = await this.stripeService.createCheckoutSession({
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: guide.title,
              description: guide.subtitle || undefined,
              images: guide.coverImage ? [guide.coverImage] : undefined,
            },
            unit_amount: Math.round(Number(guide.price) * 100),
          },
          quantity: 1,
        }],
        metadata: { userId, type: 'guide', guideId: productId },
        successUrl: successUrl || `${baseUrl}/user/guides?success=true`,
        cancelUrl: cancelUrl || `${baseUrl}/guides/${productId}?canceled=true`,
        customerEmail: user?.email,
      });

      // Create order and transaction
      const order = await this.prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          userId,
          guideId: productId,
          amount: guide.price,
          currency: 'USD',
          status: 'PENDING',
          paymentMethod: 'stripe',
          paymentId: session.id,
        },
      });

      await this.createTransaction({
        userId,
        orderId: order.id,
        type: 'GUIDE_PURCHASE',
        provider: 'STRIPE',
        providerId: session.id,
        amount: Number(guide.price),
        currency: 'USD',
      });

      return { checkoutUrl: session.url, sessionId: session.id, provider: 'stripe' };

    } else if (type === ProductType.SUBSCRIPTION) {
      const plan = productId as 'DAILY' | 'WEEKLY' | 'MONTHLY';
      const planPrices = { DAILY: 2.99, WEEKLY: 9.99, MONTHLY: 19.99 };
      const planNames = { DAILY: 'Daily Plan (24 hours)', WEEKLY: 'Weekly Plan (7 days)', MONTHLY: 'Monthly Plan (30 days)' };

      if (!planPrices[plan]) throw new BadRequestException('Invalid subscription plan');

      const session = await this.stripeService.createCheckoutSession({
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ChinaWise AI - ${planNames[plan]}`,
              description: 'Unlimited AI chat access',
            },
            unit_amount: Math.round(planPrices[plan] * 100),
          },
          quantity: 1,
        }],
        metadata: { userId, type: 'subscription', plan },
        successUrl: successUrl || `${baseUrl}/user/subscription?success=true`,
        cancelUrl: cancelUrl || `${baseUrl}/ai-assistant?canceled=true`,
        customerEmail: user?.email,
      });

      await this.createTransaction({
        userId,
        type: 'SUBSCRIPTION',
        provider: 'STRIPE',
        providerId: session.id,
        amount: planPrices[plan],
        currency: 'USD',
      });

      return { checkoutUrl: session.url, sessionId: session.id, provider: 'stripe' };
    }

    throw new BadRequestException('Invalid product type');
  }

  private async createPayPalCheckout(
    userId: string,
    type: ProductType,
    productId: string,
    successUrl?: string,
    cancelUrl?: string,
  ) {
    if (!this.paypalService.isConfigured()) {
      throw new BadRequestException('PayPal is not configured');
    }

    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    if (type === ProductType.GUIDE) {
      const guide = await this.prisma.guide.findUnique({ where: { id: productId } });
      if (!guide) throw new NotFoundException('Guide not found');

      // Check if already purchased
      const existingOrder = await this.prisma.order.findFirst({
        where: { userId, guideId: productId, status: 'COMPLETED' },
      });
      if (existingOrder) throw new BadRequestException('You have already purchased this guide');

      const customId = JSON.stringify({ userId, type: 'guide', guideId: productId });
      const paypalOrder = await this.paypalService.createOrder(
        Number(guide.price),
        'USD',
        guide.title,
        customId,
      );

      // Create pending order
      const order = await this.prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          userId,
          guideId: productId,
          amount: guide.price,
          currency: 'USD',
          status: 'PENDING',
          paymentMethod: 'paypal',
          paymentId: paypalOrder.id,
        },
      });

      await this.createTransaction({
        userId,
        orderId: order.id,
        type: 'GUIDE_PURCHASE',
        provider: 'PAYPAL',
        providerId: paypalOrder.id,
        amount: Number(guide.price),
        currency: 'USD',
      });

      return {
        checkoutUrl: paypalOrder.approvalUrl,
        sessionId: paypalOrder.id,
        provider: 'paypal',
        returnUrl: successUrl || `${baseUrl}/user/guides?success=true`,
        cancelUrl: cancelUrl || `${baseUrl}/guides/${productId}?canceled=true`,
      };

    } else if (type === ProductType.SUBSCRIPTION) {
      const plan = productId as 'DAILY' | 'WEEKLY' | 'MONTHLY';
      const planPrices = { DAILY: 2.99, WEEKLY: 9.99, MONTHLY: 19.99 };
      const planNames = { DAILY: 'Daily Plan', WEEKLY: 'Weekly Plan', MONTHLY: 'Monthly Plan' };

      if (!planPrices[plan]) throw new BadRequestException('Invalid subscription plan');

      const customId = JSON.stringify({ userId, type: 'subscription', plan });
      const paypalOrder = await this.paypalService.createOrder(
        planPrices[plan],
        'USD',
        `ChinaWise AI - ${planNames[plan]}`,
        customId,
      );

      await this.createTransaction({
        userId,
        type: 'SUBSCRIPTION',
        provider: 'PAYPAL',
        providerId: paypalOrder.id,
        amount: planPrices[plan],
        currency: 'USD',
      });

      return {
        checkoutUrl: paypalOrder.approvalUrl,
        sessionId: paypalOrder.id,
        provider: 'paypal',
        returnUrl: successUrl || `${baseUrl}/user/subscription?success=true`,
        cancelUrl: cancelUrl || `${baseUrl}/ai-assistant?canceled=true`,
      };
    }

    throw new BadRequestException('Invalid product type');
  }

  // ============ Payment Verification ============

  async verifyPayment(provider: PaymentProvider, sessionId: string): Promise<PaymentStatusDto> {
    if (provider === PaymentProvider.STRIPE) {
      const session = await this.stripeService.getSession(sessionId);

      if (session.payment_status === 'paid') {
        // Update order status
        await this.prisma.order.updateMany({
          where: { paymentId: sessionId },
          data: { status: 'COMPLETED' },
        });

        // Update transaction
        await this.prisma.paymentTransaction.updateMany({
          where: { providerId: sessionId },
          data: { status: 'COMPLETED' },
        });

        return {
          status: 'completed',
          orderId: session.metadata?.guideId,
          amount: session.amount_total ? session.amount_total / 100 : undefined,
          currency: session.currency?.toUpperCase(),
          paidAt: new Date(),
        };
      }

      return { status: session.payment_status === 'unpaid' ? 'pending' : 'failed' };

    } else if (provider === PaymentProvider.PAYPAL) {
      const order = await this.paypalService.getOrder(sessionId);

      if (order.status === 'APPROVED' || order.status === 'COMPLETED') {
        // Capture the payment
        const capture = await this.paypalService.captureOrder(sessionId);

        if (capture.status === 'COMPLETED') {
          // Update order status
          await this.prisma.order.updateMany({
            where: { paymentId: sessionId },
            data: { status: 'COMPLETED' },
          });

          // Update transaction
          await this.prisma.paymentTransaction.updateMany({
            where: { providerId: sessionId },
            data: { status: 'COMPLETED' },
          });

          return {
            status: 'completed',
            amount: capture.amount,
            currency: capture.currency,
            paidAt: new Date(),
          };
        }
      }

      return { status: order.status === 'PENDING' ? 'pending' : 'failed' };
    }

    throw new BadRequestException('Invalid payment provider');
  }

  // ============ Webhooks ============

  async handleStripeWebhook(payload: Buffer, signature: string) {
    try {
      const event = await this.stripeService.constructEvent(payload, signature);

      this.logger.log(`Processing Stripe webhook: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          await this.handleStripeCheckoutCompleted(session);
          break;
        }
        case 'checkout.session.expired': {
          const session = event.data.object as any;
          await this.handleStripeCheckoutExpired(session);
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as any;
          await this.handleStripePaymentFailed(paymentIntent);
          break;
        }
        case 'charge.refunded': {
          const charge = event.data.object as any;
          await this.handleStripeRefund(charge);
          break;
        }
      }

      return { received: true, type: event.type };
    } catch (error) {
      this.logger.error('Stripe webhook error:', error);
      throw new BadRequestException('Webhook processing failed');
    }
  }

  async handlePayPalWebhook(dto: PayPalWebhookDto) {
    this.logger.log(`Processing PayPal webhook: ${dto.event_type}`);

    switch (dto.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await this.handlePayPalOrderApproved(dto);
        break;
      case 'CHECKOUT.ORDER.COMPLETED':
        await this.handlePayPalOrderCompleted(dto);
        break;
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePayPalCaptureCompleted(dto);
        break;
    }

    return { received: true, type: dto.event_type };
  }

  private async handleStripeCheckoutCompleted(session: any) {
    const { userId, type, guideId, plan } = session.metadata || {};

    if (!userId) return;

    // Update transaction
    await this.prisma.paymentTransaction.updateMany({
      where: { providerId: session.id },
      data: { status: 'COMPLETED' },
    });

    if (type === 'guide' && guideId) {
      await this.prisma.order.updateMany({
        where: { paymentId: session.id },
        data: { status: 'COMPLETED' },
      });
    } else if (type === 'subscription' && plan) {
      await this.activateSubscription(userId, plan, 'STRIPE', session.id);
    }
  }

  private async handleStripeCheckoutExpired(session: any) {
    await this.prisma.order.updateMany({
      where: { paymentId: session.id },
      data: { status: 'FAILED' },
    });

    await this.prisma.paymentTransaction.updateMany({
      where: { providerId: session.id },
      data: { status: 'FAILED' },
    });
  }

  private async handleStripePaymentFailed(paymentIntent: any) {
    await this.prisma.paymentTransaction.updateMany({
      where: { providerId: paymentIntent.id },
      data: {
        status: 'FAILED',
        errorMessage: paymentIntent.last_payment_error?.message,
      },
    });
  }

  private async handleStripeRefund(charge: any) {
    await this.prisma.order.updateMany({
      where: { paymentId: charge.payment_intent },
      data: { status: 'REFUNDED', refundedAt: new Date() },
    });

    await this.prisma.paymentTransaction.updateMany({
      where: { providerId: charge.payment_intent },
      data: { status: 'REFUNDED' },
    });
  }

  private async handlePayPalOrderApproved(dto: PayPalWebhookDto) {
    // Capture the order
    try {
      await this.paypalService.captureOrder(dto.resource.id);
    } catch (error) {
      this.logger.error('Failed to capture PayPal order', error);
    }
  }

  private async handlePayPalOrderCompleted(dto: PayPalWebhookDto) {
    const customData = JSON.parse(dto.resource.custom_id || '{}');
    const { userId, type, guideId, plan } = customData;

    await this.prisma.paymentTransaction.updateMany({
      where: { providerId: dto.resource.id },
      data: { status: 'COMPLETED' },
    });

    if (type === 'guide' && guideId) {
      await this.prisma.order.updateMany({
        where: { paymentId: dto.resource.id },
        data: { status: 'COMPLETED' },
      });
    } else if (type === 'subscription' && plan) {
      await this.activateSubscription(userId, plan, 'PAYPAL', dto.resource.id);
    }
  }

  private async handlePayPalCaptureCompleted(dto: PayPalWebhookDto) {
    // Handle capture completion if needed
  }

  // ============ Refunds ============

  async createRefund(userId: string, dto: CreateRefundDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: { guide: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'COMPLETED') throw new BadRequestException('Can only refund completed orders');
    if (order.refundedAt) throw new BadRequestException('Order already refunded');

    // Check if within refund window (e.g., 30 days)
    const orderDate = new Date(order.createdAt);
    const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceOrder > 30) throw new BadRequestException('Refund window has expired (30 days)');

    let refundResult;

    if (order.paymentMethod === 'stripe') {
      // Get payment intent from session
      const session = await this.stripeService.getSession(order.paymentId || '');
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

      if (!paymentIntentId) throw new BadRequestException('Payment information not found');

      const refund = await this.stripeService.createRefund(
        paymentIntentId,
        dto.amount,
      );

      refundResult = { id: refund.id, status: refund.status };

    } else if (order.paymentMethod === 'paypal') {
      // For PayPal, we need to use the capture ID
      throw new BadRequestException('PayPal refunds are not yet supported');
    }

    // Update order
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
      },
    });

    // Create refund transaction
    await this.createTransaction({
      userId,
      orderId: order.id,
      type: 'REFUND',
      provider: order.paymentMethod === 'stripe' ? 'STRIPE' : 'PAYPAL',
      amount: dto.amount || Number(order.amount),
      currency: order.currency,
      metadata: JSON.stringify({ reason: dto.reason, originalOrderId: order.id }),
    });

    return {
      success: true,
      refundId: refundResult?.id,
      amount: dto.amount || order.amount,
      currency: order.currency,
    };
  }

  // ============ Payment Methods ============

  getPaymentMethods() {
    return [
      {
        id: 'stripe',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, Amex',
        enabled: this.stripeService.isConfigured(),
        icons: ['visa', 'mastercard', 'amex'],
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        enabled: this.paypalService.isConfigured(),
        icons: ['paypal'],
      },
    ];
  }

  // ============ Admin Dashboard ============

  async getPaymentStats(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalTransactions,
      completedTransactions,
      failedTransactions,
      refundedTransactions,
      totalRevenue,
      revenueByProvider,
    ] = await Promise.all([
      this.prisma.paymentTransaction.count({ where }),
      this.prisma.paymentTransaction.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.paymentTransaction.count({ where: { ...where, status: 'FAILED' } }),
      this.prisma.paymentTransaction.count({ where: { ...where, status: 'REFUNDED' } }),
      this.prisma.paymentTransaction.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.paymentTransaction.groupBy({
        by: ['provider'],
        where: { ...where, status: 'COMPLETED' },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    return {
      summary: {
        totalTransactions,
        completedTransactions,
        failedTransactions,
        refundedTransactions,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      byProvider: revenueByProvider.map(p => ({
        provider: p.provider,
        revenue: p._sum.amount || 0,
        count: p._count.id,
      })),
    };
  }

  async getTransactions(filters: {
    userId?: string;
    status?: string;
    provider?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.provider) where.provider = filters.provider;
    if (filters.type) where.type = filters.type;

    const [transactions, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, name: true } },
          order: { select: { id: true, orderNumber: true, guide: { select: { title: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ============ Private Helpers ============

  private async createTransaction(data: {
    userId: string;
    orderId?: string;
    subscriptionId?: string;
    type: 'GUIDE_PURCHASE' | 'SUBSCRIPTION' | 'REFUND';
    provider: 'STRIPE' | 'PAYPAL';
    providerId?: string;
    amount: number;
    currency: string;
    metadata?: string;
  }) {
    return this.prisma.paymentTransaction.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        subscriptionId: data.subscriptionId,
        type: data.type,
        provider: data.provider,
        providerId: data.providerId,
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
        status: 'PENDING',
      },
    });
  }

  private async activateSubscription(
    userId: string,
    plan: string,
    provider: 'STRIPE' | 'PAYPAL',
    externalId: string,
  ) {
    const now = new Date();
    const endDate = new Date();

    switch (plan) {
      case 'DAILY':
        endDate.setDate(now.getDate() + 1);
        break;
      case 'WEEKLY':
        endDate.setDate(now.getDate() + 7);
        break;
      case 'MONTHLY':
        endDate.setDate(now.getDate() + 30);
        break;
    }

    const prices = { DAILY: '2.99', WEEKLY: '9.99', MONTHLY: '19.99' };

    await this.prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: 'ACTIVE',
        price: prices[plan as keyof typeof prices],
        currency: 'USD',
        startDate: now,
        endDate,
        paymentMethod: provider.toLowerCase(),
        externalId,
      },
    });
  }
}
