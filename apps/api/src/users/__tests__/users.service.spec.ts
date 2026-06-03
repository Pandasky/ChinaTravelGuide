import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
    },
    subscription: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        country: null,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        avatar: null,
        country: 'CN',
        isAdmin: false,
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.updateProfile('1', {
        name: 'Updated Name',
        country: 'CN',
      });

      expect(result.name).toBe('Updated Name');
      expect(result.country).toBe('CN');
    });

    it('should throw ConflictException for duplicate email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '2', email: 'taken@example.com' });

      await expect(service.updateProfile('1', {
        email: 'taken@example.com',
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('getMyGuides', () => {
    it('should return purchased guides', async () => {
      const mockOrders = [
        {
          id: 'order1',
          createdAt: new Date(),
          guide: {
            id: 'guide1',
            title: 'Beijing Guide',
            subtitle: null,
            coverImage: 'image.jpg',
            pdfUrl: 'guide.pdf',
            pageCount: 30,
            version: '1.0',
            updatedAt: new Date(),
          },
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.getMyGuides('1');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Beijing Guide');
    });
  });

  describe('getMyOrders', () => {
    it('should return user orders', async () => {
      const mockOrders = [
        {
          id: 'order1',
          orderNumber: 'ORD-001',
          amount: 9.99,
          currency: 'USD',
          status: 'COMPLETED',
          guide: {
            id: 'guide1',
            title: 'Beijing Guide',
            coverImage: 'image.jpg',
          },
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.getMyOrders('1');

      expect(result).toHaveLength(1);
      expect(result[0].orderNumber).toBe('ORD-001');
    });
  });

  describe('getCurrentSubscription', () => {
    it('should return active subscription', async () => {
      const mockSubscription = {
        id: 'sub1',
        plan: 'MONTHLY',
        status: 'ACTIVE',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      mockPrismaService.subscription.findFirst.mockResolvedValue(mockSubscription);

      const result = await service.getCurrentSubscription('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('sub1');
    });

    it('should return null when no active subscription', async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);

      const result = await service.getCurrentSubscription('1');

      expect(result).toBeNull();
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel active subscription', async () => {
      const mockSubscription = {
        id: 'sub1',
        status: 'ACTIVE',
      };

      mockPrismaService.subscription.findFirst.mockResolvedValue(mockSubscription);
      mockPrismaService.subscription.update.mockResolvedValue({
        ...mockSubscription,
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      });

      const result = await service.cancelSubscription('1');

      expect(result.message).toContain('canceled');
    });

    it('should throw NotFoundException when no active subscription', async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);

      await expect(service.cancelSubscription('1')).rejects.toThrow(NotFoundException);
    });
  });
});
