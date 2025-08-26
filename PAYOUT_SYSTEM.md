# School Payout Management System

## Overview

The YourCity Deals platform now includes a comprehensive payout management system that allows Admins to create, track, and send payment receipts to schools. This system provides proof of payment documentation and integrates with the accounting system for complete financial tracking.

## Database Schema

### Core Tables

#### 1. Payouts Table
```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  school_name VARCHAR(255) NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  payout_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bank_transfer', 'check', 'digital_wallet')),
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed', 'failed')),
  description TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  sales_count INTEGER NOT NULL DEFAULT 0,
  gross_sales_cents INTEGER NOT NULL DEFAULT 0,
  net_payout_cents INTEGER NOT NULL DEFAULT 0,
  fee_cents INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Ensure period end is after period start
  CONSTRAINT check_period_dates CHECK (period_end >= period_start)
);

-- Indexes for efficient queries
CREATE INDEX idx_payouts_school_id ON payouts(school_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_payout_date ON payouts(payout_date);
CREATE INDEX idx_payouts_reference_number ON payouts(reference_number);
CREATE INDEX idx_payouts_period ON payouts(period_start, period_end);
```

#### 2. Payout Forms Table
```sql
CREATE TABLE payout_forms (
  form_id VARCHAR(100) PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id),
  payout_id UUID NOT NULL REFERENCES payouts(id),
  form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('receipt', 'statement', 'tax_document')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period VARCHAR(100) NOT NULL,
  file_url TEXT,
  sent_to_school BOOLEAN DEFAULT false,
  sent_date TIMESTAMP WITH TIME ZONE,
  school_acknowledgment BOOLEAN DEFAULT false,
  acknowledgment_date TIMESTAMP WITH TIME ZONE,
  
  -- Ensure sent_date is after generated_at when sent
  CONSTRAINT check_sent_date CHECK (
    (sent_to_school = false) OR 
    (sent_to_school = true AND sent_date >= generated_at)
  )
);

-- Indexes for efficient queries
CREATE INDEX idx_payout_forms_school_id ON payout_forms(school_id);
CREATE INDEX idx_payout_forms_payout_id ON payout_forms(payout_id);
CREATE INDEX idx_payout_forms_form_type ON payout_forms(form_type);
CREATE INDEX idx_payout_forms_sent_date ON payout_forms(sent_date);
```

### Enhanced Schools Table
```sql
-- Add payout-related fields to schools table
ALTER TABLE schools ADD COLUMN payout_method VARCHAR(50) DEFAULT 'bank_transfer';
ALTER TABLE schools ADD COLUMN bank_account_info JSONB;
ALTER TABLE schools ADD COLUMN points_rate DECIMAL(3,2) DEFAULT 0.50;
ALTER TABLE schools ADD COLUMN minimum_payout_cents INTEGER DEFAULT 5000; -- $50 minimum
ALTER TABLE schools ADD COLUMN payout_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payout_frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly'));
```

## Role-Based Access Control (RLS)

### Admin-Only Tables
```sql
-- Payouts table - Admin only
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only access to payouts" ON payouts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Payout forms table - Admin only
ALTER TABLE payout_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only access to payout forms" ON payout_forms
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### School-Specific Views
```sql
-- School payout summary view (for school admins)
CREATE VIEW school_payout_summary AS
SELECT 
  s.id as school_id,
  s.name as school_name,
  COUNT(p.id) as total_payouts,
  COALESCE(SUM(p.amount_cents), 0) as total_payout_amount_cents,
  COALESCE(SUM(p.gross_sales_cents), 0) as total_gross_sales_cents,
  MAX(p.payout_date) as last_payout_date,
  p.status as latest_status
FROM schools s
LEFT JOIN payouts p ON s.id = p.school_id
GROUP BY s.id, s.name, p.status;

-- School payout history view
CREATE VIEW school_payout_history AS
SELECT 
  p.id,
  p.school_id,
  p.school_name,
  p.amount_cents,
  p.payout_date,
  p.payment_method,
  p.reference_number,
  p.status,
  p.period_start,
  p.period_end,
  p.sales_count,
  p.gross_sales_cents,
  p.net_payout_cents,
  p.fee_cents,
  p.created_at,
  p.completed_at
FROM payouts p
ORDER BY p.payout_date DESC;
```

## Payout Calculation Logic

### Points Structure
```typescript
// Default points rate: 50% of gross sales
const DEFAULT_POINTS_RATE = 0.5;

// Calculate school payout
function calculateSchoolPayout(
  grossSalesCents: number,
  pointsRate: number = DEFAULT_POINTS_RATE,
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
```

### Payout Eligibility Rules
```sql
-- View for schools eligible for payout
CREATE VIEW eligible_schools_for_payout AS
SELECT 
  s.id,
  s.name,
  s.minimum_payout_cents,
  COALESCE(SUM(p.gross_sales_cents), 0) as current_period_sales_cents,
  COALESCE(SUM(p.gross_sales_cents) * s.points_rate, 0) as calculated_payout_cents,
  CASE 
    WHEN COALESCE(SUM(p.gross_sales_cents) * s.points_rate, 0) >= s.minimum_payout_cents 
    THEN true 
    ELSE false 
  END as eligible_for_payout
FROM schools s
LEFT JOIN payouts p ON s.id = p.school_id 
  AND p.period_start >= CURRENT_DATE - INTERVAL '1 month'
  AND p.status IN ('pending', 'processed', 'completed')
GROUP BY s.id, s.name, s.minimum_payout_cents, s.points_rate;
```

## Receipt Generation System

### Receipt Components
```typescript
interface PayoutReceipt {
  receipt_number: string;        // Unique receipt identifier
  school_name: string;           // School receiving payment
  school_address: string;        // School address
  school_contact: string;        // School contact person
  payout_date: Date;             // Date of payment
  amount: string;                // Formatted payment amount
  payment_method: string;        // How payment was made
  reference_number: string;      // Payment reference
  period: string;                // Sales period covered
  sales_summary: {               // Summary of sales
    total_sales: number;
    gross_amount: string;
    fee_amount: string;
    net_amount: string;
  };
  breakdown: Array<{             // Detailed breakdown
    description: string;
    amount: string;
  }>;
  terms: string[];               // Terms and conditions
  contact_info: {                // Company contact info
    company_name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}
```

### Receipt Number Generation
```typescript
function generateReceiptNumber(schoolId: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${schoolId.slice(0, 8)}-${date}-${random}`;
}
```

## Email Templates

### Payout Notification Email
```html
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
    <p>{{school_name}}</p>
  </div>
  
  <div class="content">
    <p>Dear {{school_name}},</p>
    
    <p>We are pleased to inform you that your payout for the period <strong>{{period}}</strong> has been processed.</p>
    
    <div class="details">
      <h3>Payout Details:</h3>
      <ul>
        <li><strong>Receipt Number:</strong> {{receipt_number}}</li>
        <li><strong>Amount:</strong> {{amount}}</li>
        <li><strong>Payment Method:</strong> {{payment_method}}</li>
        <li><strong>Reference Number:</strong> {{reference_number}}</li>
        <li><strong>Period:</strong> {{period}}</li>
      </ul>
    </div>
    
    <div class="summary">
      <h3>Sales Summary:</h3>
      <ul>
        <li><strong>Total Sales:</strong> {{total_sales}}</li>
        <li><strong>Gross Amount:</strong> {{gross_amount}}</li>
        <li><strong>Platform Fee:</strong> {{fee_amount}}</li>
        <li><strong>Net Payout:</strong> {{net_amount}}</li>
      </ul>
    </div>
    
    <p>Please find attached the detailed receipt for your records.</p>
    
    <p>If you have any questions, please contact us at <a href="mailto:{{contact_email}}">{{contact_email}}</a> or {{contact_phone}}.</p>
    
    <p>Best regards,<br>
    <strong>{{company_name}}</strong></p>
  </div>
  
  <div class="footer">
    <p>{{company_address}} | {{contact_phone}} | {{company_website}}</p>
  </div>
</body>
</html>
```

## API Endpoints

### Payout Management
```typescript
// GET /api/payouts - Retrieve payouts with filters
GET /api/payouts?status=completed&school_id=school_1&date_range=30days

// POST /api/payouts - Create new payout
POST /api/payouts
{
  "school_id": "school_1",
  "school_name": "Mountain Brook High School",
  "gross_sales_cents": 1500000,
  "payout_date": "2025-01-15",
  "payment_method": "bank_transfer",
  "description": "Monthly payout for December 2024",
  "period_start": "2024-12-01",
  "period_end": "2024-12-31",
  "sales_count": 150,
  "points_rate": 0.5,
  "fee_cents": 0,
  "created_by": "admin_user_id"
}

// PUT /api/payouts - Update payout status
PUT /api/payouts
{
  "payoutId": "payout_123",
  "status": "completed",
  "notes": "Payment processed successfully"
}
```

### Receipt Generation
```typescript
// GET /api/payouts/receipt - Generate receipt
GET /api/payouts/receipt?payout_id=payout_123

// POST /api/payouts/receipt - Send receipt to school
POST /api/payouts/receipt
{
  "payout_id": "payout_123",
  "email_address": "principal@school.edu",
  "include_pdf": true
}

// PUT /api/payouts/receipt - Mark receipt as acknowledged
PUT /api/payouts/receipt
{
  "form_id": "form_123",
  "acknowledged": true
}
```

## Admin Dashboard Features

### Payout Overview
- **Total Payouts**: All-time payout amount
- **Pending Payouts**: Number of payouts awaiting processing
- **Completed Payouts**: Successfully processed payouts
- **Average Payout**: Average amount per payout

### Payout Management
- **Create Payout**: Generate new payout for schools
- **Payout History**: Complete history of all payouts
- **Status Tracking**: Monitor payout status (pending, processed, completed, failed)
- **Filtering**: Filter by status, school, date range

### Receipt Generation
- **View Receipt**: Preview payout receipt before sending
- **Send Receipt**: Email receipt to school with PDF attachment
- **Receipt History**: Track all sent receipts and acknowledgments
- **Download PDF**: Generate downloadable PDF receipts

### School Communication
- **Email Templates**: Professional email templates for payout notifications
- **Receipt Tracking**: Track which schools have received and acknowledged receipts
- **Contact Management**: Manage school contact information for payouts

## Security Features

### Data Protection
- **Admin-Only Access**: Payout data restricted to admin users
- **RLS Policies**: Database-level access control
- **Audit Trail**: All payout activities tracked with timestamps
- **Reference Numbers**: Unique identifiers for all payouts

### Payment Security
- **Validation**: Payout amounts and data validated before processing
- **Status Tracking**: Clear status progression (pending → processed → completed)
- **Receipt Verification**: Digital receipts with unique numbers
- **Acknowledgment Tracking**: Schools can acknowledge receipt of payments

## Integration with Accounting System

### Automatic Accounting Entries
```typescript
// When payout is created, record accounting event
const accountingEvent = generatePayoutEvent(
  payoutId,
  amountCents,
  schoolId,
  createdBy
);

// Results in:
// Debit 5100 Partner Payouts (COGS) = payout amount
// Credit 1000 Cash = payout amount
```

### Financial Reporting
- **Payout Expenses**: Tracked in accounting system as COGS
- **Cash Flow**: Payouts reflected in cash flow statements
- **School Performance**: Revenue sharing tracked by school
- **Tax Reporting**: Payout data available for tax purposes

## Testing Checklist

### Payout Creation
- [ ] Payout calculation accuracy
- [ ] Reference number generation
- [ ] Status progression validation
- [ ] Data validation and error handling

### Receipt Generation
- [ ] Receipt number uniqueness
- [ ] Receipt content accuracy
- [ ] PDF generation functionality
- [ ] Email template rendering

### School Communication
- [ ] Email delivery to schools
- [ ] Receipt acknowledgment tracking
- [ ] Contact information validation
- [ ] Communication history logging

### Security Testing
- [ ] Admin-only access enforcement
- [ ] Data validation and sanitization
- [ ] Reference number security
- [ ] Audit trail completeness

## Future Enhancements

### Advanced Features
- **Automated Payouts**: Scheduled automatic payouts based on frequency
- **Bulk Payout Processing**: Process multiple school payouts simultaneously
- **Payment Method Management**: Support for multiple payment methods per school
- **Payout Scheduling**: Advanced scheduling with holiday considerations

### Integration Features
- **Bank Integration**: Direct bank transfers and wire payments
- **Tax Document Generation**: Automated 1099-MISC equivalent forms
- **School Portal**: Allow schools to view their payout history
- **Notification System**: SMS and push notifications for payouts

### Analytics Features
- **Payout Analytics**: Detailed analytics on payout patterns
- **School Performance**: Compare payout performance across schools
- **Revenue Forecasting**: Predict future payouts based on sales trends
- **Points Optimization**: Analyze optimal points rates

## Conclusion

The payout management system provides a comprehensive solution for managing school payments with professional receipt generation and tracking. The system integrates seamlessly with the accounting system and provides complete audit trails for all payout activities.
