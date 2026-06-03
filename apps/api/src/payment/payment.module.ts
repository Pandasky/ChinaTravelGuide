import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';
import { InvoiceService } from './services/invoice.service';
import { PaymentRetryService } from './services/payment-retry.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    PayPalService,
    InvoiceService,
    PaymentRetryService,
  ],
  exports: [
    PaymentService,
    StripeService,
    PayPalService,
    InvoiceService,
    PaymentRetryService,
  ],
})
export class PaymentModule {}
