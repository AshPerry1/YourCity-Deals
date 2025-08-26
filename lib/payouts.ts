// Payout management system for schools
export interface Payout {
  id: string;
  school_id: string;
  school_name: string;
  amount_cents: number;
  payout_date: Date;
  payment_method: 'bank_transfer' | 'check' | 'digital_wallet';
  reference_number: string;
  status: 'pending' | 'processed' | 'completed' | 'failed';
  description: string;
  period_start: Date;
  period_end: Date;
  sales_count: number;
  gross_sales_cents: number;
  net_payout_cents: number;
  fee_cents: number;
  created_by: string;
  created_at: Date;
  completed_at?: Date;
  notes?: string;
}

export interface PayoutReceipt {
  receipt_number: string;
  school_name: string;
  school_address: string;
  school_contact: string;
  payout_date: Date;
  amount: string;
  payment_method: string;
  reference_number: string;
  period: string;
  sales_summary: {
    total_sales: number;
    gross_amount: string;
    fee_amount: string;
    net_amount: string;
  };
  breakdown: Array<{
    description: string;
    amount: string;
  }>;
  terms: string[];
  contact_info: {
    company_name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface PayoutForm {
  form_id: string;
  school_id: string;
  payout_id: string;
  form_type: 'receipt' | 'statement' | 'tax_document';
  generated_at: Date;
  period: string;
  file_url?: string;
  sent_to_school: boolean;
  sent_date?: Date;
  school_acknowledgment?: boolean;
  acknowledgment_date?: Date;
}

// Payout calculation utilities
export function calculateSchoolPayout(
  grossSalesCents: number,
  pointsRate: number = 0.5, // 50% default
  feeCents: number = 0
): {
  grossPayoutCents: number;
  feeCents: number;
  netPayoutCents: number;
} {
  const grossPayoutCents = Math.round(grossSalesCents * pointsRate);
  const netPayoutCents = grossPayoutCents - feeCents;
  
  return {
    grossPayoutCents,
    feeCents,
    netPayoutCents: Math.max(0, netPayoutCents)
  };
}

// Generate unique reference number
export function generatePayoutReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `PAY-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
}

// Generate receipt number
export function generateReceiptNumber(schoolId: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${schoolId.slice(0, 8)}-${date}-${random}`;
}

// Format currency for display
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}

// Generate payout receipt
export function generatePayoutReceipt(payout: Payout): PayoutReceipt {
  const period = `${payout.period_start.toLocaleDateString()} - ${payout.period_end.toLocaleDateString()}`;
  
  return {
    receipt_number: generateReceiptNumber(payout.school_id),
    school_name: payout.school_name,
    school_address: 'School Address', // Would come from school data
    school_contact: 'School Contact', // Would come from school data
    payout_date: payout.payout_date,
    amount: formatCurrency(payout.amount_cents),
    payment_method: payout.payment_method.replace('_', ' ').toUpperCase(),
    reference_number: payout.reference_number,
    period: period,
    sales_summary: {
      total_sales: payout.sales_count,
      gross_amount: formatCurrency(payout.gross_sales_cents),
      fee_amount: formatCurrency(payout.fee_cents),
      net_amount: formatCurrency(payout.net_payout_cents),
    },
    breakdown: [
      {
        description: 'Gross Sales',
        amount: formatCurrency(payout.gross_sales_cents),
      },
      {
        description: 'Platform Fee',
        amount: `-${formatCurrency(payout.fee_cents)}`,
      },
      {
        description: 'Net Payout',
        amount: formatCurrency(payout.net_payout_cents),
      },
    ],
    terms: [
      'This receipt serves as proof of payment for the specified period.',
      'All sales are subject to verification and may be adjusted for returns or disputes.',
      'Payment processing may take 3-5 business days depending on your bank.',
      'For questions regarding this payout, please contact our support team.',
      'This document is generated automatically and is valid for tax purposes.',
    ],
    contact_info: {
      company_name: 'YourCity Deals, LLC',
      address: '123 Business Street, Your City, ST 12345',
      phone: '(555) 123-4567',
      email: 'payouts@yourcitydeals.com',
      website: 'www.yourcitydeals.com',
    },
  };
}

// Generate payout statement (detailed)
export function generatePayoutStatement(
  payout: Payout,
  salesDetails: Array<{
    date: Date;
    student_name: string;
    book_title: string;
    amount_cents: number;
  }>
): any {
  return {
    statement_number: `STMT-${payout.reference_number}`,
    school_name: payout.school_name,
    period: `${payout.period_start.toLocaleDateString()} - ${payout.period_end.toLocaleDateString()}`,
    payout_date: payout.payout_date,
    summary: {
      total_sales: payout.sales_count,
      gross_sales: formatCurrency(payout.gross_sales_cents),
      points_rate: '50%',
      points_amount: formatCurrency(payout.gross_sales_cents * 0.5),
      platform_fee: formatCurrency(payout.fee_cents),
      net_payout: formatCurrency(payout.net_payout_cents),
    },
    sales_details: salesDetails.map(sale => ({
      date: sale.date.toLocaleDateString(),
      student: sale.student_name,
      book: sale.book_title,
      amount: formatCurrency(sale.amount_cents),
    })),
    payment_info: {
      method: payout.payment_method,
      reference: payout.reference_number,
      status: payout.status,
    },
  };
}

// Generate tax document (1099-MISC equivalent)
export function generateTaxDocument(
  schoolId: string,
  year: number,
  payouts: Payout[]
): any {
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount_cents, 0);
  
  return {
    document_type: 'Payout Summary',
    tax_year: year,
    school_id: schoolId,
    school_name: payouts[0]?.school_name || 'School Name',
    total_payouts: formatCurrency(totalPayouts),
    payout_count: payouts.length,
    payouts: payouts.map(payout => ({
      date: payout.payout_date.toLocaleDateString(),
      amount: formatCurrency(payout.amount_cents),
      reference: payout.reference_number,
    })),
    disclaimer: [
      'This document is for informational purposes only.',
      'Please consult with your tax advisor for proper tax reporting.',
      'YourCity Deals is not responsible for tax calculations or filings.',
    ],
  };
}

// Email template for payout notification
export function generatePayoutEmailTemplate(receipt: PayoutReceipt): {
  subject: string;
  body: string;
  html: string;
} {
  const subject = `Payout Receipt - ${receipt.school_name} - ${receipt.period}`;
  
  const body = `
Dear ${receipt.school_name},

We are pleased to inform you that your payout for the period ${receipt.period} has been processed.

Payout Details:
- Receipt Number: ${receipt.receipt_number}
- Amount: ${receipt.amount}
- Payment Method: ${receipt.payment_method}
- Reference Number: ${receipt.reference_number}
- Period: ${receipt.period}

Sales Summary:
- Total Sales: ${receipt.sales_summary.total_sales}
- Gross Amount: ${receipt.sales_summary.gross_amount}
- Platform Fee: ${receipt.sales_summary.fee_amount}
- Net Payout: ${receipt.sales_summary.net_amount}

Please find attached the detailed receipt for your records.

If you have any questions, please contact us at ${receipt.contact_info.email} or ${receipt.contact_info.phone}.

Best regards,
${receipt.contact_info.company_name}
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payout Receipt</h1>
    <p>${receipt.school_name}</p>
  </div>
  
  <div class="content">
    <p>Dear ${receipt.school_name},</p>
    
    <p>We are pleased to inform you that your payout for the period <strong>${receipt.period}</strong> has been processed.</p>
    
    <div class="details">
      <h3>Payout Details:</h3>
      <ul>
        <li><strong>Receipt Number:</strong> ${receipt.receipt_number}</li>
        <li><strong>Amount:</strong> ${receipt.amount}</li>
        <li><strong>Payment Method:</strong> ${receipt.payment_method}</li>
        <li><strong>Reference Number:</strong> ${receipt.reference_number}</li>
        <li><strong>Period:</strong> ${receipt.period}</li>
      </ul>
    </div>
    
    <div class="summary">
      <h3>Sales Summary:</h3>
      <ul>
        <li><strong>Total Sales:</strong> ${receipt.sales_summary.total_sales}</li>
        <li><strong>Gross Amount:</strong> ${receipt.sales_summary.gross_amount}</li>
        <li><strong>Platform Fee:</strong> ${receipt.sales_summary.fee_amount}</li>
        <li><strong>Net Payout:</strong> ${receipt.sales_summary.net_amount}</li>
      </ul>
    </div>
    
    <p>Please find attached the detailed receipt for your records.</p>
    
    <p>If you have any questions, please contact us at <a href="mailto:${receipt.contact_info.email}">${receipt.contact_info.email}</a> or ${receipt.contact_info.phone}.</p>
    
    <p>Best regards,<br>
    <strong>${receipt.contact_info.company_name}</strong></p>
  </div>
  
  <div class="footer">
    <p>${receipt.contact_info.address} | ${receipt.contact_info.phone} | ${receipt.contact_info.website}</p>
  </div>
</body>
</html>
  `;

  return { subject, body, html };
}

// Validate payout data
export function validatePayoutData(payout: Partial<Payout>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payout.school_id) {
    errors.push('School ID is required');
  }

  if (!payout.amount_cents || payout.amount_cents <= 0) {
    errors.push('Payout amount must be greater than 0');
  }

  if (!payout.payout_date) {
    errors.push('Payout date is required');
  }

  if (!payout.payment_method) {
    errors.push('Payment method is required');
  }

  if (!payout.reference_number) {
    errors.push('Reference number is required');
  }

  if (!payout.period_start || !payout.period_end) {
    errors.push('Period start and end dates are required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get payout status color
export function getPayoutStatusColor(status: Payout['status']): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'processed':
      return 'text-blue-600 bg-blue-100';
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'failed':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get payout status label
export function getPayoutStatusLabel(status: Payout['status']): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processed':
      return 'Processed';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
}
