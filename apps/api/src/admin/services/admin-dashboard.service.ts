import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DashboardStatsDto,
  RevenueAnalyticsDto,
  TopSellingGuideDto,
  UserGrowthDto,
  AIUsageStatsDto,
} from '../dto/admin-analytics.dto';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      totalRevenue,
      revenueToday,
      totalGuides,
      publishedGuides,
      activeSubscriptions,
      aiChatsToday,
    ] = await Promise.all([
      // Total users
      this.prisma.user.count(),

      // New users today
      this.prisma.user.count({
        where: { createdAt: { gte: today } },
      }),

      // Total orders
      this.prisma.order.count(),

      // Orders today
      this.prisma.order.count({
        where: { createdAt: { gte: today } },
      }),

      // Total revenue
      this.prisma.order
        .aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),

      // Revenue today
      this.prisma.order
        .aggregate({
          where: {
            status: 'COMPLETED',
            createdAt: { gte: today },
          },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),

      // Total guides
      this.prisma.guide.count(),

      // Published guides
      this.prisma.guide.count({ where: { isPublished: true } }),

      // Active subscriptions
      this.prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
      }),

      // AI chats today
      this.prisma.chatSession.count({
        where: { createdAt: { gte: today } },
      }),
    ]);

    return {
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      totalRevenue: Number(totalRevenue),
      revenueToday: Number(revenueToday),
      totalGuides,
      publishedGuides,
      activeSubscriptions,
      aiChatsToday,
    };
  }

  async getRevenueAnalytics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<RevenueAnalyticsDto> {
    const end = endDate || new Date();
    const start =
      startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Daily analytics
    const dailyOrders = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end },
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    dailyOrders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const current = dailyMap.get(date) || { revenue: 0, orders: 0 };
      dailyMap.set(date, {
        revenue: current.revenue + Number(order.amount),
        orders: current.orders + 1,
      });
    });

    const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // Weekly analytics
    const weeklyMap = new Map<string, { revenue: number; orders: number }>();
    dailyOrders.forEach((order) => {
      const weekStart = new Date(order.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const current = weeklyMap.get(weekKey) || { revenue: 0, orders: 0 };
      weeklyMap.set(weekKey, {
        revenue: current.revenue + Number(order.amount),
        orders: current.orders + 1,
      });
    });

    const weekly = Array.from(weeklyMap.entries()).map(([week, data]) => ({
      week,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // Monthly analytics
    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    dailyOrders.forEach((order) => {
      const month = order.createdAt.toISOString().slice(0, 7);
      const current = monthlyMap.get(month) || { revenue: 0, orders: 0 };
      monthlyMap.set(month, {
        revenue: current.revenue + Number(order.amount),
        orders: current.orders + 1,
      });
    });

    const monthly = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }));

    return { daily, weekly, monthly };
  }

  async getTopSellingGuides(limit: number = 10): Promise<TopSellingGuideDto[]> {
    const guides = await this.prisma.guide.findMany({
      where: { isPublished: true },
      include: {
        orders: {
          where: { status: 'COMPLETED' },
          select: { amount: true },
        },
        _count: {
          select: {
            orders: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
      orderBy: {
        orders: { _count: 'desc' },
      },
      take: limit,
    });

    return guides.map((guide) => ({
      guideId: guide.id,
      title: guide.title,
      coverImage: guide.coverImage,
      totalSales: guide._count.orders,
      revenue: guide.orders.reduce(
        (sum, order) => sum + Number(order.amount),
        0,
      ),
    }));
  }

  async getUserGrowth(
    startDate?: Date,
    endDate?: Date,
  ): Promise<UserGrowthDto> {
    const end = endDate || new Date();
    const start =
      startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, number>();
    users.forEach((user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    // Calculate cumulative totals
    let runningTotal = await this.prisma.user.count({
      where: { createdAt: { lt: start } },
    });

    const daily = Array.from(dailyMap.entries()).map(([date, newUsers]) => {
      runningTotal += newUsers;
      return {
        date,
        newUsers,
        totalUsers: runningTotal,
      };
    });

    return { daily };
  }

  async getAIUsageStats(): Promise<AIUsageStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalChats,
      chatsToday,
      totalMessages,
      messagesToday,
      activeSubscribers,
      subscriptionRevenue,
    ] = await Promise.all([
      this.prisma.chatSession.count(),
      this.prisma.chatSession.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.message.count(),
      this.prisma.message.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
      }),
      this.prisma.subscription
        .aggregate({
          where: { status: 'ACTIVE' },
          _sum: { price: true },
        })
        .then((r) => r._sum.price || 0),
    ]);

    // Get top queries (simplified - in production, use message analysis)
    const recentSessions = await this.prisma.chatSession.findMany({
      take: 100,
      include: {
        messages: {
          where: { role: 'USER' },
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const queryKeywords = [
      'beijing',
      'shanghai',
      'great wall',
      'food',
      'hotel',
      'transport',
      'visa',
      'weather',
    ];

    const queryCounts = new Map<string, number>();
    recentSessions.forEach((session) => {
      const firstMessage = session.messages[0]?.content.toLowerCase() || '';
      queryKeywords.forEach((keyword) => {
        if (firstMessage.includes(keyword)) {
          queryCounts.set(keyword, (queryCounts.get(keyword) || 0) + 1);
        }
      });
    });

    const topQueries = Array.from(queryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));

    return {
      totalChats,
      chatsToday,
      totalMessages,
      messagesToday,
      activeSubscribers,
      subscriptionRevenue: Number(subscriptionRevenue),
      topQueries,
    };
  }
}
