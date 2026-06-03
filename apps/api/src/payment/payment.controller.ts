import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UseGuards,
  Query,
  RawBody,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InvoiceService } from './services/invoice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateRefundDto } from './dto/refund.dto';
import { VerifyPaymentDto, PaymentStatusDto } from './dto/verify-payment.dto';
import { PayPalWebhookDto } from './dto/payment-webhook.dto';
import { Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly invoiceService: InvoiceService,
  ) {}

  // ============ Checkout ============

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckout(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.paymentService.createCheckout(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyPayment(
    @Body() dto: VerifyPaymentDto,
  ): Promise<PaymentStatusDto> {
    return this.paymentService.verifyPayment(dto.provider, dto.sessionId);
  }

  // ============ Webhooks ============

  @Public()
  @Post('webhooks/stripe')
  async handleStripeWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received Stripe webhook');
    return this.paymentService.handleStripeWebhook(payload, signature);
  }

  @Public()
  @Post('webhooks/paypal')
  async handlePayPalWebhook(@Body() dto: PayPalWebhookDto) {
    this.logger.log('Received PayPal webhook');
    return this.paymentService.handlePayPalWebhook(dto);
  }

  // ============ Refunds ============

  @UseGuards(JwtAuthGuard)
  @Post('refund')
  async createRefund(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRefundDto,
  ) {
    return this.paymentService.createRefund(userId, dto);
  }

  // ============ Payment Methods ============

  @Get('methods')
  async getPaymentMethods() {
    return this.paymentService.getPaymentMethods();
  }

  // ============ Admin Dashboard ============

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/stats')
  async getPaymentStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.paymentService.getPaymentStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/transactions')
  async getTransactions(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('provider') provider?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentService.getTransactions({
      userId,
      status,
      provider,
      type,
      page,
      limit,
    });
  }

  // ============ Invoices ============

  @UseGuards(JwtAuthGuard)
  @Get('invoices')
  async getMyInvoices(@CurrentUser('id') userId: string) {
    return this.invoiceService.getInvoices(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoices/:orderId')
  async getInvoice(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.invoiceService.generateInvoice(orderId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoices/:orderId/download')
  async downloadInvoice(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const invoiceData = await this.invoiceService.generateInvoice(orderId, userId);
    const html = await this.invoiceService.generateHTMLInvoice(invoiceData);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${invoiceData.invoiceNumber}.html"`,
    );
    res.send(html);
  }
}
