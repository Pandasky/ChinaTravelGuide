import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { PayPalService } from './paypal.service';

@Injectable()
export class PaymentRetryService {
  private readonly logger = new Logger(PaymentRetryService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
  ) {}

  /**
   * Check for pending payments and update their status
   * Runs every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkPendingPayments() {
    this.logger.log('Checking pending payments...');

    const pendingTransactions = await this.prisma.paymentTransaction.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] },
        retryCount: { lt: this.MAX_RETRIES },
        createdAt: {
          // Only check transactions created in the last 24 hours
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        order: true,
      },
    });

    for (const transaction of pendingTransactions) {
      try {
        await this.checkTransactionStatus(transaction);
      } catch (error) {
        this.logger.error(
          `Failed to check transaction ${transaction.id}:`,
          error.message,
        );

        // Increment retry count
        await this.prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            retryCount: { increment: 1 },
            errorMessage: error.message,
          },
        });
      }
    }

    this.logger.log(`Checked ${pendingTransactions.length} pending payments`);
  }

  /**
   * Check and update a single transaction status
   */
  private async checkTransactionStatus(transaction: any) {
    if (transaction.provider === 'STRIPE') {
      if (!transaction.providerId) return;

      const session = await this.stripeService.getSession(transaction.providerId);

      if (session.payment_status === 'paid') {
        await this.completeTransaction(transaction);
      } else if (session.status === 'expired') {
        await this.failTransaction(transaction, 'Session expired');
      }
    } else if (transaction.provider === 'PAYPAL') {
      if (!transaction.providerId) return;

      try {
        const order = await this.paypalService.getOrder(transaction.providerId);

        if (order.status === 'COMPLETED' || order.status === 'APPROVED') {
          await this.completeTransaction(transaction);
        } else if (order.status === 'VOIDED') {
          await this.failTransaction(transaction, 'Order voided');
        }
      } catch (error) {
        // If order not found, it might have expired
        if (error.statusCode === 404) {
          await this.failTransaction(transaction, 'Order not found (expired)');
        } else {
          throw error;
        }
      }
    }
  }

  private async completeTransaction(transaction: any) {
    await this.prisma.$transaction([
      this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' },
      }),
      transaction.orderId
        ? this.prisma.order.update({
            where: { id: transaction.orderId },
            data: { status: 'COMPLETED' },
          })
        : null,
    ].filter(Boolean));

    this.logger.log(`Transaction ${transaction.id} marked as COMPLETED`);
  }

  private async failTransaction(transaction: any, reason: string) {
    await this.prisma.$transaction([
      this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED', errorMessage: reason },
      }),
      transaction.orderId
        ? this.prisma.order.update({
            where: { id: transaction.orderId },
            data: { status: 'FAILED' },
          })
        : null,
    ].filter(Boolean));

    this.logger.log(`Transaction ${transaction.id} marked as FAILED: ${reason}`);
  }

  /**
   * Clean up old pending transactions
   * Runs daily at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldTransactions() {
    this.logger.log('Cleaning up old pending transactions...');

    const oldDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const result = await this.prisma.paymentTransaction.updateMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] },
        createdAt: { lt: oldDate },
      },
      data: {
        status: 'FAILED',
        errorMessage: 'Transaction expired after 7 days',
      },
    });

    this.logger.log(`Cleaned up ${result.count} old transactions`);
  }

  /**
   * Retry a failed payment manually
   */
  async retryPayment(transactionId: string): Promise<boolean> {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'FAILED') {
      throw new Error('Only failed transactions can be retried');
    }

    if (transaction.retryCount >= this.MAX_RETRIES) {
      throw new Error('Maximum retry attempts reached');
    }

    // Reset transaction for retry
    await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'PENDING',
        retryCount: { increment: 1 },
        errorMessage: null,
      },
    });

    return true;
  }
}
