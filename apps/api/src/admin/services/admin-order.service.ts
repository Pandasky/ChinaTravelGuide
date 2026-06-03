import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  OrderFilterDto,
  UpdateOrderStatusDto,
} from '../dto/admin-order.dto';

@Injectable()
export class AdminOrderService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: OrderFilterDto) {
    const {
      search,
      status,
      startDate,
      endDate,
      userId,
      guideId,
      page = '1',
      limit = '20',
    } = filters;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (userId) {
      where.userId = userId;
    }

    if (guideId) {
      where.guideId = guideId;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          guide: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            country: true,
          },
        },
        guide: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            coverImage: true,
            price: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = {
      status: dto.status,
    };

    if (dto.status === 'REFUNDED') {
      updateData.refundedAt = new Date();
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        guide: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async getOrderStats() {
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      refundedOrders,
      totalRevenue,
      todayOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'REFUNDED' } }),
      this.prisma.order
        .aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      refundedOrders,
      totalRevenue: Number(totalRevenue),
      todayOrders,
      conversionRate:
        totalOrders > 0
          ? ((completedOrders / totalOrders) * 100).toFixed(2) + '%'
          : '0%',
    };
  }

  async getRecentOrders(limit: number = 10) {
    return this.prisma.order.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        guide: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
