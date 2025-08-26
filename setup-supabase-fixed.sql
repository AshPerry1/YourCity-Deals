-- YourCity Deals Database Setup Script (Fixed)
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables (in correct order)

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table (create first since user_profiles references it)
CREATE TABLE IF NOT EXISTS schools (
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

-- Businesses table (create before user_profiles references it)
CREATE TABLE IF NOT EXISTS businesses (
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

-- User profiles table (now schools and businesses exist)
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Coupon books table
CREATE TABLE IF NOT EXISTS coupon_books (
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

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
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

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
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

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
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

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id),
  merchant_id UUID REFERENCES users(id),
  merchant_pin TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Referral links table
CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES users(id),
  school_id UUID REFERENCES schools(id),
  student_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_clicked_at TIMESTAMP WITH TIME ZONE
);

-- Referral clicks tracking
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id UUID REFERENCES referral_links(id),
  code TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Targeting rules table
CREATE TABLE IF NOT EXISTS targeting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL,
  coupon_book_id UUID REFERENCES coupon_books(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon grants table
CREATE TABLE IF NOT EXISTS coupon_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  targeting_rule_id UUID REFERENCES targeting_rules(id),
  coupon_book_id UUID REFERENCES coupon_books(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_business_id ON user_profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_coupon_books_school_id ON coupon_books(school_id);
CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);
CREATE INDEX IF NOT EXISTS idx_offers_coupon_book_id ON offers(coupon_book_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_coupon_book_id ON purchases(coupon_book_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_coupons_purchase_id ON coupons(purchase_id);
CREATE INDEX IF NOT EXISTS idx_coupons_redemption_code ON coupons(redemption_code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_coupon_id ON redemptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_merchant_id ON redemptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_links_school_id ON referral_links(school_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE targeting_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_grants ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
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

-- Schools policies
CREATE POLICY "Admins can manage schools" ON schools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view schools" ON schools
  FOR SELECT USING (true);

-- Businesses policies
CREATE POLICY "Admins can manage businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view businesses" ON businesses
  FOR SELECT USING (true);

-- Coupon books policies
CREATE POLICY "Admins can manage books" ON coupon_books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view active books" ON coupon_books
  FOR SELECT USING (is_active = true);

-- Offers policies
CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view offers" ON offers
  FOR SELECT USING (true);

-- Purchases policies
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

-- Coupons policies
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

-- Redemptions policies
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

-- Referral links policies
CREATE POLICY "Admins can manage referral links" ON referral_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view active referral links" ON referral_links
  FOR SELECT USING (status = 'active');

-- Referral clicks policies
CREATE POLICY "Admins can view referral clicks" ON referral_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert referral clicks" ON referral_clicks
  FOR INSERT WITH CHECK (true);

-- Targeting rules policies
CREATE POLICY "Admins can manage targeting rules" ON targeting_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Coupon grants policies
CREATE POLICY "Users can view own grants" ON coupon_grants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage grants" ON coupon_grants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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

-- Generate redemption code function
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'YC' || upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO schools (name, city, state) VALUES
('Mountain Brook High School', 'Mountain Brook', 'AL'),
('Vestavia Hills High School', 'Vestavia Hills', 'AL'),
('Homewood High School', 'Homewood', 'AL')
ON CONFLICT DO NOTHING;

INSERT INTO businesses (name, description, category, city, state) VALUES
('Local Restaurant', 'Amazing local cuisine', 'Restaurant', 'Birmingham', 'AL'),
('Coffee Shop', 'Best coffee in town', 'Food & Beverage', 'Birmingham', 'AL'),
('Auto Service', 'Professional auto care', 'Automotive', 'Birmingham', 'AL')
ON CONFLICT DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('brand-logos', 'brand-logos', true),
('book-covers', 'book-covers', true),
('offer-images', 'offer-images', true),
('tutorial-images', 'tutorial-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies
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
