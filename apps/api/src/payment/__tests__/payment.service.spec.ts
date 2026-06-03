import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../services/stripe.service';
import { PayPalService } from '../services/paypal.service';
import { ProductType } from '../dto/create-checkout.dto';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockPrismaService = {
    guide: {
      findUnique: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
    },
    paymentTransaction: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-value'),
  };

  const mockStripeService = {
    isConfigured: jest.fn().mockReturnValue(true),
    createCheckoutSession: jest.fn(),
    getSession: jest.fn(),
  };

  const mockPayPalService = {
    isConfigured: jest.fn().mockReturnValue(true),
    createOrder: jest.fn(),
    getOrder: jest.fn(),
    captureOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: StripeService, useValue: mockStripeService },
        { provide: PayPalService, useValue: mockPayPalService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckout', () => {
    it('should create Stripe checkout for guide purchase', async () => {
      const mockGuide = {
        id: 'guide1',
        title: 'Test Guide',
        subtitle: 'Subtitle',
        coverImage: 'image.jpg',
        price: 9.99,
      };

      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/test',
      };

      mockPrismaService.guide.findUnique.mockResolvedValue(mockGuide);
      mockPrismaService.order.findFirst.mockResolvedValue(null);
      mockStripeService.createCheckoutSession.mockResolvedValue(mockSession);
      mockPrismaService.order.create.mockResolvedValue({ id: 'order1' });
      mockPrismaService.paymentTransaction.create.mockResolvedValue({ id: 'trans1' });

      const result = await service.createCheckout('user1', {
        type: ProductType.GUIDE,
        productId: 'guide1',
        paymentMethod: 'stripe',
      });

      expect(result.checkoutUrl).toBe(mockSession.url);
      expect(result.provider).toBe('stripe');
    });

    it('should throw BadRequestException for already purchased guide', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.createCheckout('user1', {
        type: ProductType.GUIDE,
        productId: 'guide1',
        paymentMethod: 'stripe',
      })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid payment method', async () => {
      await expect(service.createCheckout('user1', {
        type: ProductType.GUIDE,
        productId: 'guide1',
        paymentMethod: 'invalid' as any,
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyPayment', () => {
    it('should return completed status for successful Stripe payment', async () => {
      const mockSession = {
        payment_status: 'paid',
        metadata: { guideId: 'guide1' },
        amount_total: 999,
        currency: 'usd',
      };

      mockStripeService.getSession.mockResolvedValue(mockSession);

      const result = await service.verifyPayment('stripe', 'cs_test_123');

      expect(result.status).toBe('completed');
      expect(result.amount).toBe(9.99);
    });

    it('should return pending status for unpaid Stripe session', async () => {
      const mockSession = {
        payment_status: 'unpaid',
      };

      mockStripeService.getSession.mockResolvedValue(mockSession);

      const result = await service.verifyPayment('stripe', 'cs_test_123');

      expect(result.status).toBe('pending');
    });

    it('should handle PayPal order completion', async () => {
      const mockOrder = {
        status: 'APPROVED',
      };

      const mockCapture = {
        status: 'COMPLETED',
        amount: 9.99,
        currency: 'USD',
      };

      mockPayPalService.getOrder.mockResolvedValue(mockOrder);
      mockPayPalService.captureOrder.mockResolvedValue(mockCapture);

      const result = await service.verifyPayment('paypal', 'PAYPAL_ORDER_123');

      expect(result.status).toBe('completed');
    });
  });

  describe('createRefund', () => {
    it('should process refund for eligible order', async () => {
      const mockOrder = {
        id: 'order1',
        status: 'COMPLETED',
        amount: 9.99,
        currency: 'USD',
        paymentMethod: 'stripe',
        paymentId: 'cs_test_123',
        refundedAt: null,
        createdAt: new Date(),
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.createRefund('user1', {
        orderId: 'order1',
        reason: 'Customer request',
      });

      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException for non-existent order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.createRefund('user1', {
        orderId: 'non-existent',
      })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for non-completed order', async () => {
      const mockOrder = {
        id: 'order1',
        status: 'PENDING',
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      await expect(service.createRefund('user1', {
        orderId: 'order1',
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPaymentMethods', () => {
    it('should return available payment methods', () => {
      const result = service.getPaymentMethods();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('stripe');
      expect(result[1].id).toBe('paypal');
    });
  });

  describe('getPaymentStats', () => {
    it('should return payment statistics', async () => {
      mockPrismaService.paymentTransaction.count.mockResolvedValue(100);
      mockPrismaService.paymentTransaction.groupBy.mockResolvedValue([
        { provider: 'STRIPE', _sum: { amount: 500 }, _count: { id: 50 } },
        { provider: 'PAYPAL', _sum: { amount: 300 }, _count: { id: 30 } },
      ]);

      const result = await service.getPaymentStats();

      expect(result.summary.totalTransactions).toBe(100);
      expect(result.byProvider).toHaveLength(2);
    });
  });
});
