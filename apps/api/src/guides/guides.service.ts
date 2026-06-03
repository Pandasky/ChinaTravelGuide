import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideFilterDto } from './dto/guide-filter.dto';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: GuideFilterDto, userId?: string) {
    const {
      search,
      categorySlug,
      city,
      theme,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      where.categories = {
        some: { slug: categorySlug },
      };
    }

    if (city) {
      where.categories = {
        some: { slug: city, type: 'CITY' },
      };
    }

    if (theme) {
      where.categories = {
        some: { slug: theme, type: 'THEME' },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [guides, total] = await Promise.all([
      this.prisma.guide.findMany({
        where,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.guide.count({ where }),
    ]);

    // Check if user has purchased each guide
    let purchasedGuideIds: string[] = [];
    if (userId) {
      const orders = await this.prisma.order.findMany({
        where: { userId, status: 'COMPLETED' },
        select: { guideId: true },
      });
      purchasedGuideIds = orders.map((o) => o.guideId);
    }

    const guidesWithOwnership = guides.map((guide) => ({
      ...guide,
      isPurchased: purchasedGuideIds.includes(guide.id),
    }));

    return {
      data: guidesWithOwnership,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        categories: true,
        reviews: {
          where: { isVisible: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                country: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Check if user has purchased this guide
    let isPurchased = false;
    if (userId) {
      const order = await this.prisma.order.findFirst({
        where: { userId, guideId: id, status: 'COMPLETED' },
      });
      isPurchased = !!order;
    }

    return {
      ...guide,
      isPurchased,
    };
  }

  async getPreview(id: string) {
    const guide = await this.prisma.guide.findFirst({
      where: { id, isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        pageCount: true,
        price: true,
        isFree: true,
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Return preview URL (first few pages or preview PDF)
    return {
      ...guide,
      previewUrl: guide.isFree ? guide.pdfUrl : null,
    };
  }

  async getDownloadUrl(id: string, userId: string) {
    // Check if user has purchased the guide
    const order = await this.prisma.order.findFirst({
      where: { userId, guideId: id, status: 'COMPLETED' },
    });

    if (!order) {
      throw new ForbiddenException('You must purchase this guide to download it');
    }

    const guide = await this.prisma.guide.findUnique({
      where: { id },
      select: { pdfUrl: true, title: true },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return {
      downloadUrl: guide.pdfUrl,
      filename: `${guide.title.replace(/\s+/g, '_')}.pdf`,
    };
  }

  async create(dto: CreateGuideDto) {
    const { categoryIds, ...guideData } = dto;

    return this.prisma.guide.create({
      data: {
        ...guideData,
        categories: categoryIds
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: true,
      },
    });
  }

  async update(id: string, dto: UpdateGuideDto) {
    const { categoryIds, ...guideData } = dto;

    const guide = await this.prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return this.prisma.guide.update({
      where: { id },
      data: {
        ...guideData,
        categories: categoryIds
          ? { set: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: true,
      },
    });
  }

  async remove(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Check if there are any completed orders
    const ordersCount = await this.prisma.order.count({
      where: { guideId: id, status: 'COMPLETED' },
    });

    if (ordersCount > 0) {
      throw new BadRequestException(
        'Cannot delete guide with existing purchases. Unpublish it instead.',
      );
    }

    await this.prisma.guide.delete({
      where: { id },
    });

    return { message: 'Guide deleted successfully' };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  async createReview(
    guideId: string,
    userId: string,
    rating: number,
    content?: string,
  ) {
    // Check if user has purchased the guide
    const order = await this.prisma.order.findFirst({
      where: { userId, guideId, status: 'COMPLETED' },
    });

    if (!order) {
      throw new ForbiddenException('You must purchase this guide to review it');
    }

    // Check if user already reviewed
    const existingReview = await this.prisma.review.findUnique({
      where: { userId_guideId: { userId, guideId } },
    });

    if (existingReview) {
      // Update existing review
      const review = await this.prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, content },
      });

      await this.updateGuideRating(guideId);
      return review;
    }

    // Create new review
    const review = await this.prisma.review.create({
      data: {
        userId,
        guideId,
        rating,
        content,
      },
    });

    await this.updateGuideRating(guideId);
    return review;
  }

  private async updateGuideRating(guideId: string) {
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
  }
}
