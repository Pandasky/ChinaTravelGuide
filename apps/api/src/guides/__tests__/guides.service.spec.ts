import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GuidesService } from '../guides.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GuideFilterDto, SortField, SortOrder } from '../dto/guide-filter.dto';

describe('GuidesService', () => {
  let service: GuidesService;

  const mockPrismaService = {
    guide: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    review: {
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuidesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GuidesService>(GuidesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated guides', async () => {
      const mockGuides = [
        { id: '1', title: 'Guide 1', isPublished: true, categories: [], _count: { reviews: 0 } },
        { id: '2', title: 'Guide 2', isPublished: true, categories: [], _count: { reviews: 0 } },
      ];

      mockPrismaService.guide.findMany.mockResolvedValue(mockGuides);
      mockPrismaService.guide.count.mockResolvedValue(2);
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const filters: GuideFilterDto = {
        page: 1,
        limit: 10,
        sortBy: SortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      };

      const result = await service.findAll(filters);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by search term', async () => {
      const mockGuides = [
        { id: '1', title: 'Beijing Guide', isPublished: true, categories: [], _count: { reviews: 0 } },
      ];

      mockPrismaService.guide.findMany.mockResolvedValue(mockGuides);
      mockPrismaService.guide.count.mockResolvedValue(1);
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const filters: GuideFilterDto = {
        search: 'beijing',
        page: 1,
        limit: 10,
      };

      const result = await service.findAll(filters);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toContain('Beijing');
    });
  });

  describe('findOne', () => {
    it('should return guide with details', async () => {
      const mockGuide = {
        id: '1',
        title: 'Test Guide',
        categories: [],
        reviews: [],
        _count: { reviews: 0 },
      };

      mockPrismaService.guide.findUnique.mockResolvedValue(mockGuide);
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      const result = await service.findOne('1', 'user1');

      expect(result.id).toBe('1');
      expect(result).toHaveProperty('isPurchased');
    });

    it('should throw NotFoundException for non-existent guide', async () => {
      mockPrismaService.guide.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent', 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDownloadUrl', () => {
    it('should return download URL for purchased guide', async () => {
      const mockOrder = { id: '1', status: 'COMPLETED' };
      const mockGuide = { pdfUrl: 'https://example.com/guide.pdf', title: 'Test Guide' };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.guide.findUnique.mockResolvedValue(mockGuide);

      const result = await service.getDownloadUrl('1', 'user1');

      expect(result).toHaveProperty('downloadUrl');
      expect(result).toHaveProperty('filename');
    });

    it('should throw ForbiddenException for unpurchased guide', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.getDownloadUrl('1', 'user1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create a new guide', async () => {
      const mockGuide = {
        id: '1',
        title: 'New Guide',
        categories: [{ id: 'cat1', name: 'Category 1' }],
      };

      mockPrismaService.guide.create.mockResolvedValue(mockGuide);

      const result = await service.create({
        title: 'New Guide',
        description: 'Description',
        price: 9.99,
        categoryIds: ['cat1'],
      });

      expect(result.title).toBe('New Guide');
      expect(result.categories).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update guide', async () => {
      const mockGuide = {
        id: '1',
        title: 'Updated Guide',
        categories: [],
      };

      mockPrismaService.guide.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.guide.update.mockResolvedValue(mockGuide);

      const result = await service.update('1', { title: 'Updated Guide' });

      expect(result.title).toBe('Updated Guide');
    });
  });
});
