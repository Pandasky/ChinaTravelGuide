import { IsString, IsEnum } from 'class-validator';

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

export class VerifyPaymentDto {
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsString()
  sessionId: string; // Stripe session ID or PayPal order ID
}

export class PaymentStatusDto {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  orderId?: string;
  amount?: number;
  currency?: string;
  paidAt?: Date;
}
