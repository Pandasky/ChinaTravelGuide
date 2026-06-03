import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const environment = this.configService.get<string>('NODE_ENV') === 'production'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    if (clientId && clientSecret) {
      this.client = new paypal.core.PayPalHttpClient(environment);
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async createOrder(
    amount: number,
    currency: string,
    description: string,
    customId: string,
  ): Promise<{ id: string; approvalUrl: string }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description,
          custom_id: customId,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });

    const response = await this.client.execute(request);
    const order = response.result;

    // Find approval URL
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new BadRequestException('Failed to create PayPal order');
    }

    return {
      id: order.id,
      approvalUrl,
    };
  }

  async captureOrder(orderId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
  }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);
    const capture = response.result;

    const captureAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;

    return {
      id: capture.id,
      status: capture.status,
      amount: parseFloat(captureAmount?.value || '0'),
      currency: captureAmount?.currency_code || 'USD',
    };
  }

  async getOrder(orderId: string): Promise<any> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await this.client.execute(request);
    return response.result;
  }

  async refundPayment(
    captureId: string,
    amount?: number,
    currency?: string,
  ): Promise<{ id: string; status: string }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.payments.CapturesRefundRequest(captureId);

    if (amount && currency) {
      request.requestBody({
        amount: {
          value: amount.toFixed(2),
          currency_code: currency,
        },
      });
    }

    const response = await this.client.execute(request);
    return {
      id: response.result.id,
      status: response.result.status,
    };
  }

  verifyWebhook(payload: string, headers: any): boolean {
    // In production, implement PayPal webhook verification
    // This requires verifying the signature from PayPal
    return true;
  }
}
