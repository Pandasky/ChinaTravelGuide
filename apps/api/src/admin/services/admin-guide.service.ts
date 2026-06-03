import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateGuideAdminDto,
  UpdateGuideAdminDto,
  BulkPublishGuidesDto,
} from '../dto/admin-guide.dto';

@Injectable()
export class AdminGuideService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    search?: string;
    isPublished?: boolean;
    isFree?: boolean;
    categoryId?: string;
    page?: string;
    limit?: string;
  }) {
    const {
      search,
      isPublished,
      isFree,
      categoryId,
      page = '1',
      limit = '20',
    } = filters;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (isFree !== undefined) {
      where.isFree = isFree;
    }

    if (categoryId) {
      where.categories = {
        some: { id: categoryId },
      };
    }

    const [guides, total] = await Promise.all([
      this.prisma.guide.findMany({
        where,
        include: {
          categories: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      this.prisma.guide.count({ where }),
    ]);

    return {
      data: guides,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        categories: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            orders: {
              where: { status: 'COMPLETED' },
            },
            reviews: true,
          },
        },
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }

  async create(dto: CreateGuideAdminDto) {
    const { categoryIds, ...guideData } = dto;

    const guide = await this.prisma.guide.create({
      data: {
        ...guideData,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: true,
      },
    });

    return guide;
  }

  async update(id: string, dto: UpdateGuideAdminDto) {
    const existingGuide = await this.prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      throw new NotFoundException('Guide not found');
    }

    const { categoryIds, ...guideData } = dto;

    const guide = await this.prisma.guide.update({
      where: { id },
      data: {
        ...guideData,
        categories: categoryIds?.length
          ? { set: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: true,
      },
    });

    return guide;
  }

  async remove(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: { where: { status: 'COMPLETED' } } },
        },
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    if (guide._count.orders > 0) {
      throw new BadRequestException(
        'Cannot delete guide with completed orders. Unpublish it instead.',
      );
    }

    await this.prisma.guide.delete({
      where: { id },
    });

    return { message: 'Guide deleted successfully' };
  }

  async bulkPublish(dto: BulkPublishGuidesDto) {
    const { guideIds, isPublished } = dto;

    await this.prisma.guide.updateMany({
      where: { id: { in: guideIds } },
      data: { isPublished },
    });

    return {
      message: `${guideIds.length} guides ${isPublished ? 'published' : 'unpublished'}`,
    };
  }

  async getGuideStats() {
    const [
      totalGuides,
      publishedGuides,
      draftGuides,
      freeGuides,
      paidGuides,
      totalSales,
    ] = await Promise.all([
      this.prisma.guide.count(),
      this.prisma.guide.count({ where: { isPublished: true } }),
      this.prisma.guide.count({ where: { isPublished: false } }),
      this.prisma.guide.count({ where: { isFree: true } }),
      this.prisma.guide.count({ where: { isFree: false } }),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      totalGuides,
      publishedGuides,
      draftGuides,
      freeGuides,
      paidGuides,
      totalSales,
      publicationRate:
        totalGuides > 0
          ? ((publishedGuides / totalGuides) * 100).toFixed(2) + '%'
          : '0%',
    };
  }

  async updateRating(guideId: string) {
    const result = await this.prisma.review.aggregate({
      where: { guideId, isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.guide.update({
      where: { id: guideId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });

    return {
      guideId,
      rating: result._avg.rating || 0,
      reviewCount: result._count.rating,
    };
  }
}
