import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum WebhookProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

export class PaymentWebhookDto {
  @IsEnum(WebhookProvider)
  provider: WebhookProvider;

  @IsString()
  @IsOptional()
  eventType?: string;

  @IsString()
  @IsOptional()
  payload?: string;
}

export class PayPalWebhookDto {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status?: string;
    custom_id?: string;
    amount?: {
      value: string;
      currency_code: string;
    };
  };
  create_time: string;
}
