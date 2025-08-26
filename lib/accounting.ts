// Accounting system for YourCity Deals
export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  is_active: boolean;
}

export interface JournalEntry {
  id: string;
  occurred_at: Date;
  description: string;
  source_type: 'purchase' | 'refund' | 'discount' | 'payout' | 'fee' | 'adjustment';
  source_id?: string;
  created_by: string;
  total_debits_cents: number;
  total_credits_cents: number;
}

export interface JournalLine {
  id: string;
  entry_id: string;
  account_id: string;
  amount_cents: number;
  side: 'debit' | 'credit';
}

export interface SalesMetrics {
  gross_sales_cents: number;
  refunds_cents: number;
  discounts_cents: number;
  stripe_fees_cents: number;
  partner_payouts_cents: number;
  net_sales_cents: number;
}

export interface FinancialStatement {
  period: {
    start_date: Date;
    end_date: Date;
  };
  income_statement: {
    revenue: number;
    expenses: number;
    net_income: number;
    gross_sales: number;
    discounts: number;
    stripe_fees: number;
    partner_payouts: number;
    refunds: number;
  };
  balance_sheet: {
    assets: number;
    liabilities: number;
    equity: number;
    cash: number;
    payouts_payable: number;
  };
  cash_movements: {
    beginning_balance: number;
    ending_balance: number;
    net_change: number;
    inflows: number;
    outflows: number;
  };
}

// Chart of Accounts
export const CHART_OF_ACCOUNTS: Omit<Account, 'id'>[] = [
  // Assets
  { code: '1000', name: 'Cash - Stripe Balance', type: 'asset', is_active: true },
  { code: '1100', name: 'Accounts Receivable', type: 'asset', is_active: true },
  
  // Liabilities
  { code: '2000', name: 'Deferred Revenue', type: 'liability', is_active: true },
  { code: '2100', name: 'Payouts Payable - Schools', type: 'liability', is_active: true },
  
  // Revenue
  { code: '4000', name: 'Coupon Book Sales', type: 'revenue', is_active: true },
  { code: '4100', name: 'Discounts (Contra-Revenue)', type: 'revenue', is_active: true },
  
  // Expenses
  { code: '5000', name: 'Stripe Fees', type: 'expense', is_active: true },
  { code: '5100', name: 'Partner Payouts (COGS)', type: 'expense', is_active: true },
  { code: '5200', name: 'Refunds', type: 'expense', is_active: true },
];

// Account codes for easy reference
export const ACCOUNT_CODES = {
  CASH: '1000',
  ACCOUNTS_RECEIVABLE: '1100',
  DEFERRED_REVENUE: '2000',
  PAYOUTS_PAYABLE: '2100',
  SALES: '4000',
  DISCOUNTS: '4100',
  STRIPE_FEES: '5000',
  PARTNER_PAYOUTS: '5100',
  REFUNDS: '5200',
} as const;

// Event types for accounting entries
export type AccountingEventType = 
  | 'purchase_successful'
  | 'refund_processed'
  | 'discount_applied'
  | 'payout_issued'
  | 'stripe_fee_charged'
  | 'adjustment_made';

export interface AccountingEvent {
  type: AccountingEventType;
  occurred_at: Date;
  description: string;
  source_id?: string;
  created_by: string;
  lines: Array<{
    account_code: string;
    side: 'debit' | 'credit';
    amount_cents: number;
  }>;
}

/**
 * Validate that debits equal credits in a journal entry
 */
export function validateJournalEntry(lines: AccountingEvent['lines']): { valid: boolean; error?: string } {
  const totalDebits = lines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const totalCredits = lines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  if (totalDebits !== totalCredits) {
    return {
      valid: false,
      error: `Debits (${totalDebits}) do not equal credits (${totalCredits})`
    };
  }
  
  return { valid: true };
}

/**
 * Calculate net sales from components
 */
export function calculateNetSales(metrics: Omit<SalesMetrics, 'net_sales_cents'>): number {
  return metrics.gross_sales_cents - 
         metrics.refunds_cents - 
         metrics.discounts_cents - 
         metrics.stripe_fees_cents - 
         metrics.partner_payouts_cents;
}

/**
 * Generate accounting event for successful purchase
 */
export function generatePurchaseEvent(
  purchaseId: string,
  grossAmountCents: number,
  stripeFeeCents: number,
  discountCents: number = 0,
  createdBy: string
): AccountingEvent {
  const netRevenue = grossAmountCents - stripeFeeCents - discountCents;
  
  return {
    type: 'purchase_successful',
    occurred_at: new Date(),
    description: `Coupon book purchase ${purchaseId}`,
    source_id: purchaseId,
    created_by: createdBy,
    lines: [
      // Debit cash for gross amount
      { account_code: ACCOUNT_CODES.CASH, side: 'debit', amount_cents: grossAmountCents },
      
      // Credit sales for net revenue
      { account_code: ACCOUNT_CODES.SALES, side: 'credit', amount_cents: netRevenue },
      
      // Credit discounts if any
      ...(discountCents > 0 ? [{ account_code: ACCOUNT_CODES.DISCOUNTS, side: 'credit', amount_cents: discountCents }] : []),
      
      // Credit stripe fees
      { account_code: ACCOUNT_CODES.STRIPE_FEES, side: 'credit', amount_cents: stripeFeeCents },
    ]
  };
}

/**
 * Generate accounting event for refund
 */
export function generateRefundEvent(
  refundId: string,
  refundAmountCents: number,
  stripeFeeRefundCents: number = 0,
  createdBy: string
): AccountingEvent {
  return {
    type: 'refund_processed',
    occurred_at: new Date(),
    description: `Refund processed ${refundId}`,
    source_id: refundId,
    created_by: createdBy,
    lines: [
      // Debit refunds
      { account_code: ACCOUNT_CODES.REFUNDS, side: 'debit', amount_cents: refundAmountCents },
      
      // Credit cash
      { account_code: ACCOUNT_CODES.CASH, side: 'credit', amount_cents: refundAmountCents },
      
      // If stripe fee is refunded, debit stripe fees and credit cash
      ...(stripeFeeRefundCents > 0 ? [
        { account_code: ACCOUNT_CODES.STRIPE_FEES, side: 'debit', amount_cents: stripeFeeRefundCents },
        { account_code: ACCOUNT_CODES.CASH, side: 'credit', amount_cents: stripeFeeRefundCents }
      ] : []),
    ]
  };
}

/**
 * Generate accounting event for discount application
 */
export function generateDiscountEvent(
  discountId: string,
  discountAmountCents: number,
  createdBy: string
): AccountingEvent {
  return {
    type: 'discount_applied',
    occurred_at: new Date(),
    description: `Discount applied ${discountId}`,
    source_id: discountId,
    created_by: createdBy,
    lines: [
      // Debit discounts (contra-revenue)
      { account_code: ACCOUNT_CODES.DISCOUNTS, side: 'debit', amount_cents: discountAmountCents },
      
      // Credit sales
      { account_code: ACCOUNT_CODES.SALES, side: 'credit', amount_cents: discountAmountCents },
    ]
  };
}

/**
 * Generate accounting event for school payout
 */
export function generatePayoutEvent(
  payoutId: string,
  payoutAmountCents: number,
  schoolId: string,
  createdBy: string
): AccountingEvent {
  return {
    type: 'payout_issued',
    occurred_at: new Date(),
    description: `School payout ${payoutId} to school ${schoolId}`,
    source_id: payoutId,
    created_by: createdBy,
    lines: [
      // Debit partner payouts (COGS)
      { account_code: ACCOUNT_CODES.PARTNER_PAYOUTS, side: 'debit', amount_cents: payoutAmountCents },
      
      // Credit cash
      { account_code: ACCOUNT_CODES.CASH, side: 'credit', amount_cents: payoutAmountCents },
    ]
  };
}

/**
 * Calculate financial metrics for a date range
 */
export function calculateFinancialMetrics(
  startDate: Date,
  endDate: Date,
  journalLines: JournalLine[],
  accounts: Account[]
): FinancialStatement {
  const accountMap = new Map(accounts.map(acc => [acc.id, acc]));
  
  // Filter lines by date range
  const periodLines = journalLines.filter(line => {
    // In real implementation, you'd join with journal_entries to get occurred_at
    return true; // Simplified for demo
  });
  
  // Calculate income statement components
  const salesLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.SALES
  );
  const discountLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.DISCOUNTS
  );
  const feeLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.STRIPE_FEES
  );
  const payoutLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.PARTNER_PAYOUTS
  );
  const refundLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.REFUNDS
  );
  
  const grossSales = salesLines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const discounts = discountLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const stripeFees = feeLines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const partnerPayouts = payoutLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const refunds = refundLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
  
  const revenue = grossSales - discounts;
  const expenses = stripeFees + partnerPayouts + refunds;
  const netIncome = revenue - expenses;
  
  // Calculate balance sheet (simplified)
  const cashLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.CASH
  );
  const cash = cashLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0) -
    cashLines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
  
  const payoutsPayableLines = periodLines.filter(line => 
    accountMap.get(line.account_id)?.code === ACCOUNT_CODES.PAYOUTS_PAYABLE
  );
  const payoutsPayable = payoutsPayableLines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0) -
    payoutsPayableLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
  
  const assets = cash;
  const liabilities = payoutsPayable;
  const equity = assets - liabilities;
  
  // Calculate cash movements
  const cashInflows = cashLines
    .filter(line => line.side === 'debit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
    
  const cashOutflows = cashLines
    .filter(line => line.side === 'credit')
    .reduce((sum, line) => sum + line.amount_cents, 0);
  
  return {
    period: { start_date: startDate, end_date: endDate },
    income_statement: {
      revenue,
      expenses,
      net_income: netIncome,
      gross_sales: grossSales,
      discounts,
      stripe_fees: stripeFees,
      partner_payouts: partnerPayouts,
      refunds,
    },
    balance_sheet: {
      assets,
      liabilities,
      equity,
      cash,
      payouts_payable: payoutsPayable,
    },
    cash_movements: {
      beginning_balance: 0, // Would calculate from previous period
      ending_balance: cash,
      net_change: cashInflows - cashOutflows,
      inflows: cashInflows,
      outflows: cashOutflows,
    },
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}

/**
 * Get period options for date selection
 */
export function getPeriodOptions(): Array<{ label: string; startDate: Date; endDate: Date }> {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  return [
    {
      label: 'This Month',
      startDate: currentMonth,
      endDate: now,
    },
    {
      label: 'Last Month',
      startDate: lastMonth,
      endDate: lastMonthEnd,
    },
    {
      label: 'Last 30 Days',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: now,
    },
    {
      label: 'Last 90 Days',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: now,
    },
  ];
}

/**
 * Export financial data to CSV format
 */
export function exportToCSV(data: any[], filename: string): void {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
