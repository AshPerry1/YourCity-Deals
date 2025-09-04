-- Additional tables for seller invite system
-- Run this AFTER the main schema

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
  school_id UUID REFERENCES schools(id),
  price_cents INTEGER DEFAULT 0,
  cover_image_url TEXT,
  theme_primary TEXT DEFAULT '#8B5CF6',
  theme_secondary TEXT DEFAULT '#A78BFA',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller assignments table
CREATE TABLE IF NOT EXISTS seller_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id),
  organization_hub_id UUID REFERENCES organizational_hubs(id),
  coupon_book_id UUID REFERENCES admin_coupon_books(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for seller tables
CREATE INDEX IF NOT EXISTS idx_seller_invites_token ON seller_invites(token);
CREATE INDEX IF NOT EXISTS idx_seller_invites_email ON seller_invites(email);
CREATE INDEX IF NOT EXISTS idx_seller_invites_status ON seller_invites(status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_invite_id ON seller_profiles(invite_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);
CREATE INDEX IF NOT EXISTS idx_organizational_hubs_name ON organizational_hubs(name);
CREATE INDEX IF NOT EXISTS idx_admin_coupon_books_title ON admin_coupon_books(title);

-- Enable RLS for seller tables
ALTER TABLE seller_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_coupon_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller tables
CREATE POLICY "Admins can manage seller invites" ON seller_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view seller invites by token" ON seller_invites
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage seller profiles" ON seller_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view seller profiles by invite" ON seller_profiles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage organizational hubs" ON organizational_hubs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view organizational hubs" ON organizational_hubs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage admin coupon books" ON admin_coupon_books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view admin coupon books" ON admin_coupon_books
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage seller assignments" ON seller_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_seller_invites_updated_at BEFORE UPDATE ON seller_invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizational_hubs_updated_at BEFORE UPDATE ON organizational_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_coupon_books_updated_at BEFORE UPDATE ON admin_coupon_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_assignments_updated_at BEFORE UPDATE ON seller_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO organizational_hubs (name, type, city, state) VALUES
('Mountain Brook High School', 'school', 'Mountain Brook', 'AL'),
('Lincoln High School', 'school', 'Lincoln', 'AL'),
('Washington Middle School', 'school', 'Washington', 'AL')
ON CONFLICT DO NOTHING;

INSERT INTO admin_coupon_books (title, description, price_cents) VALUES
('Birmingham Restaurant Deals', 'Amazing deals from local restaurants', 2500),
('Lincoln High School 2025 Coupon Book', 'Supporting Lincoln High School', 2000),
('Washington Middle School Fundraiser', 'Help Washington Middle School', 1500)
ON CONFLICT DO NOTHING;

-- Insert TEST123 invite for testing
INSERT INTO seller_invites (token, first_name, last_name, email, status, organization_hub, coupon_book, sent_at, email_sent) VALUES
('TEST123', 'Ash', 'Perry', 'adperry18@gmail.com', 'pending', 'Mountain Brook High School', 'Birmingham Restaurant Deals', NOW(), true)
ON CONFLICT (token) DO NOTHING;
