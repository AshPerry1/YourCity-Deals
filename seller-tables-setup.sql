-- Seller System Tables Setup
-- Run this in your Supabase SQL Editor after the main setup

-- Seller Invites table
CREATE TABLE IF NOT EXISTS seller_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization_hub TEXT,
  coupon_book TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready_for_review', 'edit_requested', 'approved', 'rejected', 'active')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller Profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID REFERENCES seller_invites(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  zip_code TEXT,
  profile_picture_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready_for_review', 'edit_requested', 'approved', 'rejected', 'active')),
  profile_completed_at TIMESTAMP WITH TIME ZONE,
  edit_request TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller Auth table
CREATE TABLE IF NOT EXISTS seller_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizational Hubs table
CREATE TABLE IF NOT EXISTS organizational_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon Books table (for admin management)
CREATE TABLE IF NOT EXISTS admin_coupon_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller Assignments table
CREATE TABLE IF NOT EXISTS seller_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  organization_hub_id UUID REFERENCES organizational_hubs(id),
  coupon_book_id UUID REFERENCES admin_coupon_books(id),
  assigned_by TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE TRIGGER update_seller_invites_updated_at BEFORE UPDATE ON seller_invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_auth_updated_at BEFORE UPDATE ON seller_auth
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizational_hubs_updated_at BEFORE UPDATE ON organizational_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_coupon_books_updated_at BEFORE UPDATE ON admin_coupon_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO organizational_hubs (name, description) VALUES
('Mountain Brook High School', 'Mountain Brook High School fundraising hub'),
('Vestavia Hills High School', 'Vestavia Hills High School fundraising hub'),
('Homewood High School', 'Homewood High School fundraising hub')
ON CONFLICT DO NOTHING;

INSERT INTO admin_coupon_books (title, description) VALUES
('2025 Spring Coupon Book', 'Spring fundraising coupon book with local business deals'),
('Premium Coupon Book', 'Premium deals with exclusive offers'),
('Elementary School Community Book', 'Community-focused deals for elementary schools')
ON CONFLICT DO NOTHING;

-- Insert a test invite for development
INSERT INTO seller_invites (token, first_name, last_name, email, status) VALUES
('TEST123', 'John', 'Seller', 'john@example.com', 'pending')
ON CONFLICT (token) DO NOTHING;
