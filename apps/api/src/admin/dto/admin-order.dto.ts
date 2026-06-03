import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum OrderStatusFilter {
  ALL = 'all',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class OrderFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(OrderStatusFilter)
  @IsOptional()
  status?: OrderStatusFilter;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  guideId?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RefundOrderDto {
  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  amount?: string; // For partial refunds
}
