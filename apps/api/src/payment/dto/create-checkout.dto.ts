import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ProductType {
  GUIDE = 'guide',
  SUBSCRIPTION = 'subscription',
}

export class CreateCheckoutDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  productId: string; // Guide ID or Subscription Plan

  @IsString()
  @IsOptional()
  paymentMethod?: 'stripe' | 'paypal';

  @IsString()
  @IsOptional()
  successUrl?: string;

  @IsString()
  @IsOptional()
  cancelUrl?: string;
}
