-- Check and fix seller_profiles table
-- Run this in your Supabase SQL Editor

-- First, check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'seller_profiles'
) as table_exists;

-- If table doesn't exist, create it
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_seller_profiles_invite_id ON seller_profiles(invite_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);

-- Enable RLS
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy (allow all for now)
CREATE POLICY "Allow all on seller_profiles" ON seller_profiles FOR ALL USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;

-- Check if there are any existing profiles
SELECT COUNT(*) as total_profiles FROM seller_profiles;
