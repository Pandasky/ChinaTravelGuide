import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  purchaseDate: Date;
  companyName: string;
  companyAddress: string;
  companyTaxId?: string;
}

@Injectable()
export class InvoiceService {
  private readonly companyInfo = {
    name: 'ChinaWise Travel Guides',
    address: '123 Travel Street, Suite 100\nBeijing, China 100000',
    taxId: 'CN123456789',
    email: 'billing@chinawise.com',
    website: 'https://chinawise.com',
  };

  constructor(private prisma: PrismaService) {}

  async generateInvoice(orderId: string, userId: string): Promise<InvoiceData> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        guide: true,
        user: true,
        transactions: {
          where: { status: 'COMPLETED' },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const transaction = order.transactions[0];
    const subtotal = Number(order.amount);
    const tax = 0; // Tax calculation can be added here
    const total = subtotal + tax;

    return {
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      customerName: order.user.name || order.user.email,
      customerEmail: order.user.email,
      items: [
        {
          description: order.guide.title,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal,
        },
      ],
      subtotal,
      tax,
      total,
      currency: order.currency,
      paymentMethod: order.paymentMethod?.toUpperCase() || 'CARD',
      transactionId: transaction?.providerId || order.paymentId || '',
      purchaseDate: order.createdAt,
      companyName: this.companyInfo.name,
      companyAddress: this.companyInfo.address,
      companyTaxId: this.companyInfo.taxId,
    };
  }

  async generateHTMLInvoice(invoiceData: InvoiceData): Promise<string> {
    const itemsHtml = invoiceData.items
      .map(
        (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitPrice.toFixed(2)}</td>
          <td>$${item.total.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceData.invoiceNumber}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .company-info h1 {
      color: #E67E22;
      margin: 0 0 10px 0;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-details h2 {
      margin: 0;
      color: #2C3E50;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-weight: 600;
      margin-bottom: 10px;
      color: #2C3E50;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #DEE2E6;
    }
    th {
      background-color: #F8F9FA;
      font-weight: 600;
    }
    .totals {
      text-align: right;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin: 5px 0;
    }
    .grand-total {
      font-size: 1.2em;
      font-weight: 600;
      color: #E67E22;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #2C3E50;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #DEE2E6;
      text-align: center;
      color: #6C757D;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${invoiceData.companyName}</h1>
      <p>${invoiceData.companyAddress.replace(/\n/g, '<br>')}</p>
      <p>Tax ID: ${invoiceData.companyTaxId}</p>
    </div>
    <div class="invoice-details">
      <h2>INVOICE</h2>
      <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
      <p><strong>Order #:</strong> ${invoiceData.orderNumber}</p>
      <p><strong>Date:</strong> ${invoiceData.purchaseDate.toLocaleDateString()}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Bill To:</div>
    <p>
      <strong>${invoiceData.customerName}</strong><br>
      ${invoiceData.customerEmail}
    </p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>$${invoiceData.subtotal.toFixed(2)} ${invoiceData.currency}</span>
    </div>
    <div class="total-row">
      <span>Tax:</span>
      <span>$${invoiceData.tax.toFixed(2)} ${invoiceData.currency}</span>
    </div>
    <div class="total-row grand-total">
      <span>Total:</span>
      <span>$${invoiceData.total.toFixed(2)} ${invoiceData.currency}</span>
    </div>
  </div>

  <div class="section" style="margin-top: 30px;">
    <div class="section-title">Payment Information:</div>
    <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</p>
    <p><strong>Transaction ID:</strong> ${invoiceData.transactionId}</p>
    <p><strong>Status:</strong> PAID</p>
  </div>

  <div class="footer">
    <p>Thank you for your purchase!</p>
    <p>${invoiceData.companyName} | ${this.companyInfo.website} | ${this.companyInfo.email}</p>
  </div>
</body>
</html>
    `;
  }

  async generatePDFInvoice(invoiceData: InvoiceData): Promise<Buffer> {
    // In production, use a library like puppeteer or pdfkit to generate PDF
    // For now, return HTML as a buffer
    const html = await this.generateHTMLInvoice(invoiceData);
    return Buffer.from(html, 'utf-8');
  }

  async getInvoices(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { guide: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      description: order.guide.title,
      amount: order.amount,
      currency: order.currency,
      date: order.createdAt,
      downloadUrl: `/api/payment/invoices/${order.id}/download`,
    }));
  }
}
