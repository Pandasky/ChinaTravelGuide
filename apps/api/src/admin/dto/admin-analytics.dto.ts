import { IsDateString, IsOptional, IsString } from 'class-validator';

export class DateRangeDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class DashboardStatsDto {
  totalUsers: number;
  newUsersToday: number;
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  revenueToday: number;
  totalGuides: number;
  publishedGuides: number;
  activeSubscriptions: number;
  aiChatsToday: number;
}

export class RevenueAnalyticsDto {
  daily: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  weekly: Array<{
    week: string;
    revenue: number;
    orders: number;
  }>;
  monthly: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export class TopSellingGuideDto {
  guideId: string;
  title: string;
  coverImage: string;
  totalSales: number;
  revenue: number;
}

export class UserGrowthDto {
  daily: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
  }>;
}

export class AIUsageStatsDto {
  totalChats: number;
  chatsToday: number;
  totalMessages: number;
  messagesToday: number;
  activeSubscribers: number;
  subscriptionRevenue: number;
  topQueries: Array<{
    query: string;
    count: number;
  }>;
}
