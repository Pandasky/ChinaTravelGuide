import { PrismaClient, Guide, Category, CategoryType } from '@prisma/client';

export interface CreateGuideInput {
  title?: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  pdfUrl?: string;
  price?: number;
  isFree?: boolean;
  isPublished?: boolean;
  pageCount?: number;
  version?: string;
  categoryIds?: string[];
}

export interface CreateCategoryInput {
  name?: string;
  slug?: string;
  type?: CategoryType;
  icon?: string;
}

export class CategoryFactory {
  static async create(prisma: PrismaClient, data: CreateCategoryInput = {}): Promise<Category> {
    const timestamp = Date.now();
    const defaultData = {
      name: `Category ${timestamp}`,
      slug: `category-${timestamp}`,
      type: CategoryType.CITY,
      icon: null,
    };

    return prisma.category.create({
      data: { ...defaultData, ...data },
    });
  }

  static async createMany(prisma: PrismaClient, count: number): Promise<Category[]> {
    const categories: Category[] = [];
    for (let i = 0; i < count; i++) {
      categories.push(await this.create(prisma, {
        name: `Category ${i}`,
        slug: `category-${Date.now()}-${i}`,
      }));
    }
    return categories;
  }

  static async cleanup(prisma: PrismaClient): Promise<void> {
    await prisma.category.deleteMany({
      where: {
        slug: {
          startsWith: 'category-',
        },
      },
    });
  }
}

export class GuideFactory {
  static async create(prisma: PrismaClient, data: CreateGuideInput = {}): Promise<Guide> {
    const timestamp = Date.now();
    const defaultData = {
      title: `Test Guide ${timestamp}`,
      subtitle: 'Test Subtitle',
      description: 'Test description for the guide',
      coverImage: 'https://example.com/image.jpg',
      pdfUrl: 'https://example.com/guide.pdf',
      price: 9.99,
      isFree: false,
      isPublished: true,
      pageCount: 20,
      version: '1.0',
    };

    const merged = { ...defaultData, ...data };
    const { categoryIds, ...guideData } = merged;

    return prisma.guide.create({
      data: {
        ...guideData,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  static async createFree(prisma: PrismaClient, data: CreateGuideInput = {}): Promise<Guide> {
    return this.create(prisma, {
      ...data,
      isFree: true,
      price: 0,
    });
  }

  static async createDraft(prisma: PrismaClient, data: CreateGuideInput = {}): Promise<Guide> {
    return this.create(prisma, {
      ...data,
      isPublished: false,
    });
  }

  static async createMany(prisma: PrismaClient, count: number, data: CreateGuideInput = {}): Promise<Guide[]> {
    const guides: Guide[] = [];
    for (let i = 0; i < count; i++) {
      guides.push(await this.create(prisma, {
        ...data,
        title: `Test Guide ${Date.now()}-${i}`,
      }));
    }
    return guides;
  }

  static async cleanup(prisma: PrismaClient): Promise<void> {
    await prisma.guide.deleteMany({
      where: {
        title: {
          startsWith: 'Test Guide',
        },
      },
    });
  }
}
