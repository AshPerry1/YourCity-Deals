-- Seller System Database Schema
-- Run this in your Supabase SQL Editor

-- Seller Invites Table
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

-- Seller Profiles Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller Authentication Table
CREATE TABLE IF NOT EXISTS seller_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizational Hubs Table
CREATE TABLE IF NOT EXISTS organizational_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon Books Table
CREATE TABLE IF NOT EXISTS coupon_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller Assignments Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS seller_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  organization_hub_id UUID REFERENCES organizational_hubs(id) ON DELETE CASCADE,
  coupon_book_id UUID REFERENCES coupon_books(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, organization_hub_id, coupon_book_id)
);

-- Enable Row Level Security
ALTER TABLE seller_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_invites
CREATE POLICY "Anyone can view invites by token" ON seller_invites
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage invites" ON seller_invites
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for seller_profiles
CREATE POLICY "Anyone can view profiles by invite" ON seller_profiles
  FOR SELECT USING (true);

CREATE POLICY "Sellers can update their own profile" ON seller_profiles
  FOR UPDATE USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage profiles" ON seller_profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for seller_auth
CREATE POLICY "Sellers can view their own auth" ON seller_auth
  FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage auth" ON seller_auth
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for organizational_hubs
CREATE POLICY "Anyone can view active hubs" ON organizational_hubs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hubs" ON organizational_hubs
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for coupon_books
CREATE POLICY "Anyone can view active books" ON coupon_books
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage books" ON coupon_books
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for seller_assignments
CREATE POLICY "Admins can manage assignments" ON seller_assignments
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seller_invites_token ON seller_invites(token);
CREATE INDEX IF NOT EXISTS idx_seller_invites_email ON seller_invites(email);
CREATE INDEX IF NOT EXISTS idx_seller_invites_status ON seller_invites(status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_invite_id ON seller_profiles(invite_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);
CREATE INDEX IF NOT EXISTS idx_seller_auth_email ON seller_auth(email);
CREATE INDEX IF NOT EXISTS idx_seller_assignments_seller_id ON seller_assignments(seller_id);

-- Insert sample data
INSERT INTO organizational_hubs (name, description) VALUES
  ('Mountain Brook Schools', 'Mountain Brook School District'),
  ('Vestavia Hills Schools', 'Vestavia Hills School District'),
  ('Homewood Schools', 'Homewood School District'),
  ('Hoover Schools', 'Hoover School District');

INSERT INTO coupon_books (name, description) VALUES
  ('Mountain Brook Coupon Book 2024', 'Digital coupon book for Mountain Brook schools'),
  ('Vestavia Hills Coupon Book 2024', 'Digital coupon book for Vestavia Hills schools'),
  ('Homewood Coupon Book 2024', 'Digital coupon book for Homewood schools'),
  ('Hoover Coupon Book 2024', 'Digital coupon book for Hoover schools');

-- Create function to update updated_at timestamp
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

CREATE TRIGGER update_seller_auth_updated_at BEFORE UPDATE ON seller_auth
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizational_hubs_updated_at BEFORE UPDATE ON organizational_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupon_books_updated_at BEFORE UPDATE ON coupon_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
