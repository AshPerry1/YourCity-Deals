-- Check and create seller_profiles table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Check if seller_profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'seller_profiles'
) as table_exists;

-- Create seller_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  zip_code TEXT,
  profile_picture_url TEXT,
  status TEXT DEFAULT 'pending',
  profile_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_seller_profiles_invite_id ON seller_profiles(invite_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);

-- Add RLS policies (allow all for now)
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on seller_profiles" ON seller_profiles;
CREATE POLICY "Allow all on seller_profiles" ON seller_profiles
  FOR ALL USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_seller_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_seller_profiles_updated_at ON seller_profiles;
CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON seller_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_profiles_updated_at();

-- Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;
