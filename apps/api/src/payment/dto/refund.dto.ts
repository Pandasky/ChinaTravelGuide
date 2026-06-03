import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateRefundDto {
  @IsString()
  orderId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number; // Partial refund amount (optional for full refund)

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RefundResponseDto {
  id: string;
  status: string;
  amount: number;
  currency: string;
  reason?: string;
  createdAt: Date;
}
