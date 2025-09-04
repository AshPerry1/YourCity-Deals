-- Simple Seller Database Setup
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- SELLER TABLES ONLY
-- ========================================

-- Seller invites table
CREATE TABLE IF NOT EXISTS seller_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ready_for_review', 'approved', 'rejected')),
  organization_hub TEXT,
  coupon_book TEXT,
  phone TEXT,
  zip_code TEXT,
  profile_picture_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT false,
  link_clicked BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  profile_completed_at TIMESTAMP WITH TIME ZONE,
  edit_request TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID REFERENCES seller_invites(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  zip_code TEXT,
  profile_picture_url TEXT,
  status TEXT DEFAULT 'ready_for_review' CHECK (status IN ('ready_for_review', 'approved', 'rejected')),
  profile_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizational hubs table
CREATE TABLE IF NOT EXISTS organizational_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'school' CHECK (type IN ('school', 'organization', 'business')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin coupon books table
CREATE TABLE IF NOT EXISTS admin_coupon_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER DEFAULT 0,
  cover_image_url TEXT,
  theme_primary TEXT DEFAULT '#8B5CF6',
  theme_secondary TEXT DEFAULT '#A78BFA',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_seller_invites_token ON seller_invites(token);
CREATE INDEX IF NOT EXISTS idx_seller_invites_email ON seller_invites(email);
CREATE INDEX IF NOT EXISTS idx_seller_invites_status ON seller_invites(status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_invite_id ON seller_profiles(invite_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);
CREATE INDEX IF NOT EXISTS idx_organizational_hubs_name ON organizational_hubs(name);
CREATE INDEX IF NOT EXISTS idx_admin_coupon_books_title ON admin_coupon_books(title);

-- ========================================
-- ROW LEVEL SECURITY (DISABLED FOR NOW)
-- ========================================

-- Disable RLS for now to avoid issues
ALTER TABLE seller_invites DISABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_hubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_coupon_books DISABLE ROW LEVEL SECURITY;

-- ========================================
-- TRIGGERS
-- ========================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_seller_invites_updated_at BEFORE UPDATE ON seller_invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizational_hubs_updated_at BEFORE UPDATE ON organizational_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_coupon_books_updated_at BEFORE UPDATE ON admin_coupon_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert sample organizational hubs
INSERT INTO organizational_hubs (name, type, city, state) VALUES
('Mountain Brook High School', 'school', 'Mountain Brook', 'AL'),
('Lincoln High School', 'school', 'Lincoln', 'AL'),
('Washington Middle School', 'school', 'Washington', 'AL')
ON CONFLICT DO NOTHING;

-- Insert sample admin coupon books
INSERT INTO admin_coupon_books (title, description, price_cents) VALUES
('Birmingham Restaurant Deals', 'Amazing deals from local restaurants', 2500),
('Lincoln High School 2025 Coupon Book', 'Supporting Lincoln High School', 2000),
('Washington Middle School Fundraiser', 'Help Washington Middle School', 1500)
ON CONFLICT DO NOTHING;

-- Insert TEST123 invite for testing
INSERT INTO seller_invites (token, first_name, last_name, email, status, organization_hub, coupon_book, sent_at, email_sent) VALUES
('TEST123', 'Ash', 'Perry', 'adperry18@gmail.com', 'pending', 'Mountain Brook High School', 'Birmingham Restaurant Deals', NOW(), true)
ON CONFLICT (token) DO NOTHING;

-- ========================================
-- GENERATE UNIQUE INVITE
-- ========================================

-- Generate a unique token
DO $$
DECLARE
    unique_token TEXT;
    timestamp_part TEXT;
    random_part TEXT;
BEGIN
    -- Generate unique token
    timestamp_part := to_char(EXTRACT(EPOCH FROM NOW())::bigint, 'base36');
    random_part := substr(md5(random()::text), 1, 6);
    unique_token := upper(timestamp_part || random_part);
    
    -- Insert new invite with unique token but same content as TEST123
    INSERT INTO seller_invites (
        token,
        first_name,
        last_name,
        email,
        status,
        organization_hub,
        coupon_book,
        sent_at,
        email_sent,
        link_clicked,
        profile_completed
    ) VALUES (
        unique_token,
        'Ash',
        'Perry',
        'adperry18@gmail.com',
        'pending',
        'Mountain Brook High School',
        'Birmingham Restaurant Deals',
        NOW(),
        true,
        false,
        false
    );
    
    -- Display the generated token
    RAISE NOTICE 'Generated unique token: %', unique_token;
    RAISE NOTICE 'New invite created with token: %', unique_token;
END $$;
