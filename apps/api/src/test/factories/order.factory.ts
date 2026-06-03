import { PrismaClient, Order, OrderStatus, Subscription, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export interface CreateOrderInput {
  userId: string;
  guideId: string;
  orderNumber?: string;
  amount?: number;
  currency?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  paymentId?: string;
}

export interface CreateSubscriptionInput {
  userId: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  price?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: string;
  externalId?: string;
}

export class OrderFactory {
  static async create(prisma: PrismaClient, data: CreateOrderInput): Promise<Order> {
    const defaultData = {
      orderNumber: `ORD-${Date.now()}`,
      amount: 9.99,
      currency: 'USD',
      status: OrderStatus.COMPLETED,
      paymentMethod: 'stripe',
      paymentId: `pi_${Date.now()}`,
    };

    return prisma.order.create({
      data: { ...defaultData, ...data },
    });
  }

  static async createPending(prisma: PrismaClient, data: CreateOrderInput): Promise<Order> {
    return this.create(prisma, {
      ...data,
      status: OrderStatus.PENDING,
    });
  }

  static async createRefunded(prisma: PrismaClient, data: CreateOrderInput): Promise<Order> {
    return this.create(prisma, {
      ...data,
      status: OrderStatus.REFUNDED,
    });
  }

  static async cleanup(prisma: PrismaClient): Promise<void> {
    await prisma.order.deleteMany({
      where: {
        orderNumber: {
          startsWith: 'ORD-',
        },
      },
    });
  }
}

export class SubscriptionFactory {
  static async create(prisma: PrismaClient, data: CreateSubscriptionInput): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 30);

    const defaultData = {
      plan: SubscriptionPlan.MONTHLY,
      status: SubscriptionStatus.ACTIVE,
      price: 19.99,
      currency: 'USD',
      startDate: now,
      endDate,
      paymentMethod: 'stripe',
      externalId: `sub_${Date.now()}`,
    };

    return prisma.subscription.create({
      data: { ...defaultData, ...data },
    });
  }

  static async createExpired(prisma: PrismaClient, data: CreateSubscriptionInput): Promise<Subscription> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);

    return this.create(prisma, {
      ...data,
      status: SubscriptionStatus.EXPIRED,
      startDate,
      endDate,
    });
  }

  static async cleanup(prisma: PrismaClient): Promise<void> {
    await prisma.subscription.deleteMany({
      where: {
        externalId: {
          startsWith: 'sub_',
        },
      },
    });
  }
}
