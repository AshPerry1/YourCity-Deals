# Role-Based Sales Metrics & Accounting System

## Overview

The YourCity Deals platform now includes a comprehensive role-based sales metrics and accounting system that provides different levels of financial visibility based on user roles. Students and parents see simplified gross sales data, while Admins have access to complete financial statements with double-entry bookkeeping.

## Role-Based Visibility Rules

### Student Dashboard
- **Shows**: Gross sales only (their own sales)
- **Hides**: Net sales, fees, refunds, payouts
- **Purpose**: Simple progress tracking and motivation

### Parent/Teacher Dashboard  
- **Shows**: Gross totals for their student/class/school
- **Hides**: Net sales, fees, refunds, payouts
- **Purpose**: Monitor student progress and class performance

### Merchant Staff Dashboard
- **Shows**: No sales data (only redemption/verification)
- **Purpose**: Focus on coupon verification only

### Merchant Owner Dashboard
- **Shows**: Gross + net redemption value for their business only (optional)
- **Hides**: Platform-wide data, other businesses
- **Purpose**: Business performance insights

### Admin Dashboard
- **Shows**: Full gross + net, complete accounting statements
- **Access**: All financial data across the platform
- **Purpose**: Complete financial management and reporting

## Database Schema

### Core Tables

#### 1. Accounts Table (Chart of Accounts)
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX idx_accounts_code ON accounts(code);
CREATE INDEX idx_accounts_type ON accounts(type);
```

#### 2. Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('purchase', 'refund', 'discount', 'payout', 'fee', 'adjustment')),
  source_id VARCHAR(255),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  total_debits_cents INTEGER NOT NULL,
  total_credits_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure debits equal credits
  CONSTRAINT check_debits_equal_credits CHECK (total_debits_cents = total_credits_cents)
);

-- Indexes for efficient queries
CREATE INDEX idx_journal_entries_occurred_at ON journal_entries(occurred_at);
CREATE INDEX idx_journal_entries_source_type ON journal_entries(source_type);
CREATE INDEX idx_journal_entries_source_id ON journal_entries(source_id);
```

#### 3. Journal Lines Table
```sql
CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  side VARCHAR(10) NOT NULL CHECK (side IN ('debit', 'credit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_journal_lines_entry_id ON journal_lines(entry_id);
CREATE INDEX idx_journal_lines_account_id ON journal_lines(account_id);
CREATE INDEX idx_journal_lines_side ON journal_lines(side);
```

### Enhanced Sales Tracking

#### 4. Sales Metrics Table
```sql
-- Add to existing purchases table or create new table
ALTER TABLE purchases ADD COLUMN gross_sales_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE purchases ADD COLUMN refunds_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE purchases ADD COLUMN discounts_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE purchases ADD COLUMN stripe_fees_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE purchases ADD COLUMN partner_payouts_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE purchases ADD COLUMN net_sales_cents INTEGER GENERATED ALWAYS AS (
  gross_sales_cents - refunds_cents - discounts_cents - stripe_fees_cents - partner_payouts_cents
) STORED;
```

## Chart of Accounts (Seed Data)

```sql
-- Seed the chart of accounts
INSERT INTO accounts (code, name, type, is_active) VALUES
-- Assets
('1000', 'Cash - Stripe Balance', 'asset', true),
('1100', 'Accounts Receivable', 'asset', true),

-- Liabilities  
('2000', 'Deferred Revenue', 'liability', true),
('2100', 'Payouts Payable - Schools', 'liability', true),

-- Revenue
('4000', 'Coupon Book Sales', 'revenue', true),
('4100', 'Discounts (Contra-Revenue)', 'revenue', true),

-- Expenses
('5000', 'Stripe Fees', 'expense', true),
('5100', 'Partner Payouts (COGS)', 'expense', true),
('5200', 'Refunds', 'expense', true);
```

## Role-Based Access Control (RLS)

### Admin-Only Tables
```sql
-- Accounts table - Admin only
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only access to accounts" ON accounts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Journal entries - Admin only  
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only access to journal entries" ON journal_entries
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Journal lines - Admin only
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only access to journal lines" ON journal_lines
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Role-Based Sales Views
```sql
-- Student sales view (gross only, own sales)
CREATE VIEW student_sales_view AS
SELECT 
  s.id,
  s.name,
  s.school_id,
  COALESCE(SUM(p.gross_sales_cents), 0) as total_gross_sales_cents,
  COUNT(p.id) as total_sales_count
FROM students s
LEFT JOIN purchases p ON s.id = p.student_id
WHERE p.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s.id, s.name, s.school_id;

-- Parent/Teacher view (gross only, student/class/school totals)
CREATE VIEW parent_teacher_sales_view AS
SELECT 
  s.school_id,
  s.grade,
  COUNT(DISTINCT s.id) as student_count,
  COALESCE(SUM(p.gross_sales_cents), 0) as total_gross_sales_cents,
  COUNT(p.id) as total_sales_count
FROM students s
LEFT JOIN purchases p ON s.id = p.student_id
WHERE p.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s.school_id, s.grade;

-- Merchant owner view (business-specific gross + net)
CREATE VIEW merchant_owner_sales_view AS
SELECT 
  b.id as business_id,
  b.name as business_name,
  COALESCE(SUM(p.gross_sales_cents), 0) as total_gross_sales_cents,
  COALESCE(SUM(p.net_sales_cents), 0) as total_net_sales_cents,
  COALESCE(SUM(p.stripe_fees_cents), 0) as total_stripe_fees_cents,
  COALESCE(SUM(p.refunds_cents), 0) as total_refunds_cents,
  COUNT(p.id) as total_sales_count
FROM businesses b
LEFT JOIN purchases p ON b.id = p.business_id
WHERE p.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY b.id, b.name;
```

## Financial Statement Views

### Income Statement View
```sql
CREATE VIEW income_statement_view AS
WITH period_data AS (
  SELECT 
    je.occurred_at,
    jl.account_id,
    jl.side,
    jl.amount_cents,
    a.code,
    a.type
  FROM journal_entries je
  JOIN journal_lines jl ON je.id = jl.entry_id
  JOIN accounts a ON jl.account_id = a.id
  WHERE je.occurred_at >= $1 AND je.occurred_at <= $2
)
SELECT 
  -- Revenue
  COALESCE(SUM(CASE WHEN code = '4000' AND side = 'credit' THEN amount_cents ELSE 0 END), 0) as gross_sales,
  COALESCE(SUM(CASE WHEN code = '4100' AND side = 'debit' THEN amount_cents ELSE 0 END), 0) as discounts,
  COALESCE(SUM(CASE WHEN code = '4000' AND side = 'credit' THEN amount_cents ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN code = '4100' AND side = 'debit' THEN amount_cents ELSE 0 END), 0) as revenue,
  
  -- Expenses
  COALESCE(SUM(CASE WHEN code = '5000' AND side = 'credit' THEN amount_cents ELSE 0 END), 0) as stripe_fees,
  COALESCE(SUM(CASE WHEN code = '5100' AND side = 'debit' THEN amount_cents ELSE 0 END), 0) as partner_payouts,
  COALESCE(SUM(CASE WHEN code = '5200' AND side = 'debit' THEN amount_cents ELSE 0 END), 0) as refunds,
  
  -- Net Income
  (COALESCE(SUM(CASE WHEN code = '4000' AND side = 'credit' THEN amount_cents ELSE 0 END), 0) - 
   COALESCE(SUM(CASE WHEN code = '4100' AND side = 'debit' THEN amount_cents ELSE 0 END), 0)) -
  (COALESCE(SUM(CASE WHEN code = '5000' AND side = 'credit' THEN amount_cents ELSE 0 END), 0) +
   COALESCE(SUM(CASE WHEN code = '5100' AND side = 'debit' THEN amount_cents ELSE 0 END), 0) +
   COALESCE(SUM(CASE WHEN code = '5200' AND side = 'debit' THEN amount_cents ELSE 0 END), 0)) as net_income
FROM period_data;
```

### Balance Sheet View
```sql
CREATE VIEW balance_sheet_view AS
WITH account_balances AS (
  SELECT 
    a.code,
    a.type,
    COALESCE(SUM(CASE WHEN jl.side = 'debit' THEN jl.amount_cents ELSE -jl.amount_cents END), 0) as balance_cents
  FROM accounts a
  LEFT JOIN journal_lines jl ON a.id = jl.account_id
  LEFT JOIN journal_entries je ON jl.entry_id = je.id
  WHERE je.occurred_at <= $1 OR je.occurred_at IS NULL
  GROUP BY a.code, a.type
)
SELECT 
  -- Assets
  COALESCE(SUM(CASE WHEN type = 'asset' THEN balance_cents ELSE 0 END), 0) as total_assets,
  COALESCE(SUM(CASE WHEN code = '1000' THEN balance_cents ELSE 0 END), 0) as cash,
  
  -- Liabilities
  COALESCE(SUM(CASE WHEN type = 'liability' THEN balance_cents ELSE 0 END), 0) as total_liabilities,
  COALESCE(SUM(CASE WHEN code = '2100' THEN balance_cents ELSE 0 END), 0) as payouts_payable,
  
  -- Equity
  COALESCE(SUM(CASE WHEN type = 'asset' THEN balance_cents ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN type = 'liability' THEN balance_cents ELSE 0 END), 0) as equity
FROM account_balances;
```

## API Endpoints

### Record Accounting Event
```typescript
POST /api/accounting/record-event
{
  "eventType": "purchase_successful",
  "payload": {
    "purchaseId": "purchase_123",
    "grossAmountCents": 5000,
    "stripeFeeCents": 150,
    "discountCents": 500,
    "createdBy": "admin_user_id"
  }
}
```

### Get Financial Statements
```typescript
GET /api/accounting/statements?startDate=2025-01-01&endDate=2025-01-31
```

## Event Mapping Examples

### 1. Successful Purchase
```typescript
// When Stripe webhook confirms payment
const purchaseEvent = generatePurchaseEvent(
  'purchase_123',
  5000,    // $50.00 gross
  150,     // $1.50 Stripe fee
  500,     // $5.00 discount
  'admin_user_id'
);

// Results in:
// Debit 1000 Cash = $50.00
// Credit 4000 Sales = $43.50 (net revenue)
// Credit 4100 Discounts = $5.00
// Credit 5000 Stripe Fees = $1.50
```

### 2. Refund Processed
```typescript
// When customer requests refund
const refundEvent = generateRefundEvent(
  'refund_456',
  2500,    // $25.00 refund
  75,      // $0.75 fee refund
  'admin_user_id'
);

// Results in:
// Debit 5200 Refunds = $25.00
// Credit 1000 Cash = $25.00
// Debit 5000 Stripe Fees = $0.75 (reverses fee)
// Credit 1000 Cash = $0.75
```

### 3. School Payout
```typescript
// When paying out to school
const payoutEvent = generatePayoutEvent(
  'payout_789',
  7500,    // $75.00 payout
  'school_123',
  'admin_user_id'
);

// Results in:
// Debit 5100 Partner Payouts = $75.00
// Credit 1000 Cash = $75.00
```

## Admin Dashboard Features

### Financial Overview
- **Gross Sales**: Total sales before deductions
- **Net Sales**: Sales after all deductions
- **Net Income**: Revenue minus expenses
- **Period Selection**: This month, last month, custom range

### Income Statement
- Revenue breakdown (gross sales, discounts)
- Expense breakdown (Stripe fees, partner payouts, refunds)
- Net income calculation

### Balance Sheet
- Assets (cash, accounts receivable)
- Liabilities (payouts payable)
- Equity calculation

### Cash Flow
- Beginning balance
- Cash inflows and outflows
- Ending balance
- Net change

### Chart of Accounts
- Complete account listing
- Account types and status
- Account codes for reference

### Export Functionality
- CSV export of financial statements
- Date range selection
- All key metrics included

## Security Features

### Data Protection
- **RLS Policies**: Enforce role-based access at database level
- **Admin-Only Tables**: Sensitive accounting data restricted to admins
- **Audit Trail**: All journal entries tracked with user and timestamp
- **Validation**: Double-entry validation ensures data integrity

### API Security
- **Service Role**: Admin operations use service role key
- **Input Validation**: All inputs validated before processing
- **Error Handling**: Graceful error handling with rollback
- **Rate Limiting**: Prevent abuse of accounting endpoints

## Testing Checklist

### Unit Tests
- [ ] Debits equal credits validation
- [ ] Net sales calculation (gross - components)
- [ ] Refund reversal logic
- [ ] Account code mapping
- [ ] Financial statement calculations

### Integration Tests
- [ ] Purchase event recording
- [ ] Refund event recording
- [ ] Payout event recording
- [ ] Financial statement generation
- [ ] Role-based access enforcement

### Security Tests
- [ ] Non-admin users cannot access accounting data
- [ ] RLS policies enforce access control
- [ ] API endpoints require proper authentication
- [ ] Data validation prevents injection attacks

## Performance Considerations

### Database Optimization
- **Indexes**: Proper indexing on frequently queried columns
- **Partitioning**: Consider partitioning large journal tables by date
- **Materialized Views**: Cache complex financial calculations
- **Connection Pooling**: Efficient database connection management

### Caching Strategy
- **Financial Statements**: Cache calculated statements for common periods
- **Account Balances**: Cache running balances for quick lookups
- **Sales Metrics**: Cache aggregated sales data by role

## Future Enhancements

### Advanced Features
- **Multi-Currency Support**: Handle different currencies
- **Tax Calculations**: Automated tax calculations and reporting
- **Audit Reports**: Detailed audit trail and compliance reports
- **Budget Tracking**: Compare actual vs budgeted amounts

### Integration Features
- **Bank Reconciliation**: Match transactions with bank statements
- **Tax Filing**: Generate tax reports and filings
- **Payroll Integration**: Connect with payroll systems
- **Inventory Tracking**: Track inventory costs and COGS

## Conclusion

The role-based sales metrics and accounting system provides a secure, scalable foundation for financial management while maintaining appropriate data visibility for different user roles. The double-entry bookkeeping ensures data integrity, while the role-based access control protects sensitive financial information.
