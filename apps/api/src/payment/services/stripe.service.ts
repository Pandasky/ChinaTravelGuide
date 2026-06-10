import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe.default;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2025-06-30.basil' as any,
      });
    }
  }

  isConfigured(): boolean {
    return !!this.stripe;
  }

  async createCheckoutSession(params: {
    lineItems: Stripe.default.Checkout.SessionCreateParams.LineItem[];
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
  }): Promise<Stripe.default.Checkout.Session> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: params.lineItems,
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
        customer_email: params.customerEmail,
      });

      return session;
    } catch (error) {
      this.logger.error('Failed to create Stripe checkout session', error);
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  async getSession(sessionId: string): Promise<Stripe.default.Checkout.Session> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    return this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.default.Refund> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const params: Stripe.default.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      params.amount = Math.round(amount * 100); // Convert to cents
    }

    return this.stripe.refunds.create(params);
  }

  async constructEvent(payload: Buffer, signature: string): Promise<Stripe.default.Event> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret not configured');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.default.PaymentIntent> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
