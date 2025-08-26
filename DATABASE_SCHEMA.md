# Database Schema Documentation

## Overview
This document outlines the complete database schema for the YourCity Deals platform, including all tables, relationships, and RLS policies.

## Core Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'purchaser' CHECK (role IN ('admin', 'student', 'parent', 'merchant_owner', 'merchant_staff', 'purchaser')),
  school_id UUID REFERENCES schools(id),
  business_id UUID REFERENCES businesses(id),
  zip_code TEXT,
  grade TEXT,
  referrer_code TEXT,
  onboarding_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### schools
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  principal_name TEXT,
  payout_method TEXT DEFAULT 'check',
  bank_account_info JSONB,
  points_rate DECIMAL(5,4) DEFAULT 0.1500,
  minimum_payout_cents INTEGER DEFAULT 5000,
  payout_frequency TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### businesses
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  category TEXT,
  brand_primary TEXT,
  brand_secondary TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### coupon_books
```sql
CREATE TABLE coupon_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  school_id UUID REFERENCES schools(id),
  price_cents INTEGER NOT NULL,
  cover_image_url TEXT,
  theme_primary TEXT,
  theme_secondary TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### offers
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  coupon_book_id UUID REFERENCES coupon_books(id),
  title TEXT NOT NULL,
  description TEXT,
  terms TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'bogo')),
  discount_value DECIMAL(10,2),
  hero_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### purchases
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  coupon_book_id UUID REFERENCES coupon_books(id),
  amount_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  gross_sales_cents INTEGER NOT NULL,
  refunds_cents INTEGER DEFAULT 0,
  discounts_cents INTEGER DEFAULT 0,
  stripe_fees_cents INTEGER DEFAULT 0,
  partner_payouts_cents INTEGER DEFAULT 0,
  net_sales_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### coupons
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases(id),
  offer_id UUID REFERENCES offers(id),
  redemption_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'refunded')),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by UUID REFERENCES users(id),
  redemption_source TEXT DEFAULT 'purchased' CHECK (redemption_source IN ('purchased', 'gifted', 'targeted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### redemptions
```sql
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id),
  merchant_id UUID REFERENCES users(id),
  merchant_pin TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);
```

### targeting_rules
```sql
CREATE TABLE targeting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL,
  coupon_book_id UUID REFERENCES coupon_books(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### coupon_grants
```sql
CREATE TABLE coupon_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  targeting_rule_id UUID REFERENCES targeting_rules(id),
  coupon_book_id UUID REFERENCES coupon_books(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired'))
);
```

## Accounting System Tables

### accounts
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### journal_entries
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  source_type TEXT,
  source_id UUID,
  created_by UUID REFERENCES users(id),
  total_debits_cents INTEGER NOT NULL,
  total_credits_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### journal_lines
```sql
CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  amount_cents INTEGER NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('debit', 'credit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Payout System Tables

### payouts
```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  amount_cents INTEGER NOT NULL,
  payout_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'check',
  reference_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  description TEXT,
  period_start DATE,
  period_end DATE,
  sales_count INTEGER DEFAULT 0,
  gross_sales_cents INTEGER DEFAULT 0,
  net_payout_cents INTEGER DEFAULT 0,
  fee_cents INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);
```

### payout_forms
```sql
CREATE TABLE payout_forms (
  form_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  payout_id UUID REFERENCES payouts(id),
  form_type TEXT NOT NULL CHECK (form_type IN ('receipt', 'statement', 'tax_document')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period TEXT,
  file_url TEXT,
  sent_to_school BOOLEAN DEFAULT false,
  sent_date TIMESTAMP WITH TIME ZONE,
  school_acknowledgment BOOLEAN DEFAULT false,
  acknowledgment_date TIMESTAMP WITH TIME ZONE
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_business_id ON user_profiles(business_id);
CREATE INDEX idx_coupon_books_school_id ON coupon_books(school_id);
CREATE INDEX idx_offers_business_id ON offers(business_id);
CREATE INDEX idx_offers_coupon_book_id ON offers(coupon_book_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_coupon_book_id ON purchases(coupon_book_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_coupons_purchase_id ON coupons(purchase_id);
CREATE INDEX idx_coupons_redemption_code ON coupons(redemption_code);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_redemptions_coupon_id ON redemptions(coupon_id);
CREATE INDEX idx_redemptions_merchant_id ON redemptions(merchant_id);
CREATE INDEX idx_journal_entries_occurred_at ON journal_entries(occurred_at);
CREATE INDEX idx_journal_lines_entry_id ON journal_lines(entry_id);
CREATE INDEX idx_journal_lines_account_id ON journal_lines(account_id);
CREATE INDEX idx_payouts_school_id ON payouts(school_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_payout_date ON payouts(payout_date);
```

## RLS Policies

### users
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### user_profiles
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### schools
```sql
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage schools" ON schools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view schools" ON schools
  FOR SELECT USING (true);
```

### businesses
```sql
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view businesses" ON businesses
  FOR SELECT USING (true);
```

### coupon_books
```sql
ALTER TABLE coupon_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage books" ON coupon_books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view active books" ON coupon_books
  FOR SELECT USING (is_active = true);
```

### offers
```sql
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view offers" ON offers
  FOR SELECT USING (true);
```

### purchases
```sql
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### coupons
```sql
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coupons" ON coupons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchases 
      WHERE id = coupons.purchase_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view coupons for redemption" ON coupons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('merchant_owner', 'merchant_staff')
    )
  );

CREATE POLICY "Admins can view all coupons" ON coupons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### redemptions
```sql
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can create redemptions" ON redemptions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('merchant_owner', 'merchant_staff')
    )
  );

CREATE POLICY "Merchants can view own redemptions" ON redemptions
  FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "Admins can view all redemptions" ON redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### accounts
```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### journal_entries
```sql
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON journal_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### journal_lines
```sql
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON journal_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### payouts
```sql
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON payouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### payout_forms
```sql
ALTER TABLE payout_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON payout_forms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Functions and Triggers

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupon_books_updated_at BEFORE UPDATE ON coupon_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Generate redemption code function
```sql
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'YC' || upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;
```

## Seed Data

### Chart of Accounts
```sql
INSERT INTO accounts (code, name, type, is_active) VALUES
('1000', 'Cash - Stripe Balance', 'asset', true),
('1100', 'Accounts Receivable', 'asset', true),
('2000', 'Deferred Revenue', 'liability', true),
('2100', 'Payouts Payable - Schools', 'liability', true),
('4000', 'Coupon Book Sales', 'revenue', true),
('4100', 'Discounts (Contra-Revenue)', 'revenue', true),
('5000', 'Stripe Fees', 'expense', true),
('5100', 'Partner Payouts (COGS)', 'expense', true),
('5200', 'Refunds', 'expense', true);
```

## Tutorial System Schema

### user_profiles.onboarding_state
The `onboarding_state` column in `user_profiles` stores tutorial completion status as JSONB:

```json
{
  "student": {
    "version": "1.0.0",
    "completed_at": "2025-01-27T12:34:56Z",
    "skipped_at": null
  },
  "admin": {
    "version": "1.0.0",
    "completed_at": null,
    "skipped_at": "2025-01-27T12:34:56Z"
  }
}
```

### Tutorial State Structure
- `version`: Current tutorial version (string)
- `completed_at`: ISO timestamp when tutorial was completed
- `skipped_at`: ISO timestamp when tutorial was skipped (optional)

### RLS for Tutorial State
```sql
-- Users can only read/update their own onboarding state
CREATE POLICY "Users can manage own onboarding state" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own onboarding state" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
```

## Storage Buckets

### Public Read Buckets
```sql
-- Brand logos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true);

-- Book covers bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);

-- Offer images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true);

-- Tutorial images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('tutorial-images', 'tutorial-images', true);
```

### Storage Policies
```sql
-- Admin-only upload policies
CREATE POLICY "Admins can upload brand logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'brand-logos' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can upload book covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'book-covers' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can upload offer images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'offer-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public read policies
CREATE POLICY "Public can view brand logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand-logos');

CREATE POLICY "Public can view book covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'book-covers');

CREATE POLICY "Public can view offer images" ON storage.objects
  FOR SELECT USING (bucket_id = 'offer-images');

CREATE POLICY "Public can view tutorial images" ON storage.objects
  FOR SELECT USING (bucket_id = 'tutorial-images');
```

## Migration Notes

### Adding Tutorial System
To add the tutorial system to an existing database:

```sql
-- Add onboarding_state column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN onboarding_state JSONB DEFAULT '{}'::jsonb;

-- Add tutorial images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tutorial-images', 'tutorial-images', true);

-- Add storage policy for tutorial images
CREATE POLICY "Public can view tutorial images" ON storage.objects
  FOR SELECT USING (bucket_id = 'tutorial-images');
```

### Version Management
When updating tutorials, increment the version in the application code:

```typescript
export const TUTORIAL_VERSION: Record<ConsoleKey, string> = {
  student: "1.1.0", // Increment version
  parent: "1.0.0",
  merchant: "1.0.0",
  merchant_owner: "1.0.0",
  admin: "1.0.0",
} as const;
```

This will automatically show the updated tutorial to users who completed the previous version.
