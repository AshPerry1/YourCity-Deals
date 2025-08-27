-- Wallet Integration Schema for YourCity Deals
-- This adds Apple Wallet and Google Wallet support to the existing database

-- Add wallet-related fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS wallet_pass_serial TEXT,
ADD COLUMN IF NOT EXISTS wallet_platforms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS phone_e164 TEXT,
ADD COLUMN IF NOT EXISTS push_settings JSONB DEFAULT '{"apple": true, "google": true}'::jsonb,
ADD COLUMN IF NOT EXISTS redemption_code TEXT UNIQUE;

-- Create index for wallet pass serial lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_pass_serial ON user_profiles(wallet_pass_serial);

-- Create wallet pass events table for tracking pass lifecycle
CREATE TABLE IF NOT EXISTS wallet_pass_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('created', 'updated', 'pushed', 'redeemed')),
  platform TEXT NOT NULL CHECK (platform IN ('apple', 'google')),
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for wallet pass events
CREATE INDEX IF NOT EXISTS idx_wallet_pass_events_user_id ON wallet_pass_events(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_pass_events_type ON wallet_pass_events(type);
CREATE INDEX IF NOT EXISTS idx_wallet_pass_events_created_at ON wallet_pass_events(created_at);

-- Create Apple PassKit device registrations table
CREATE TABLE IF NOT EXISTS apple_pass_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_library_identifier TEXT NOT NULL,
  pass_type_identifier TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  push_token TEXT,
  authentication_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(device_library_identifier, pass_type_identifier, serial_number)
);

-- Create index for Apple PassKit registrations
CREATE INDEX IF NOT EXISTS idx_apple_pass_registrations_device ON apple_pass_registrations(device_library_identifier);
CREATE INDEX IF NOT EXISTS idx_apple_pass_registrations_serial ON apple_pass_registrations(serial_number);

-- Create Google Wallet objects table
CREATE TABLE IF NOT EXISTS google_wallet_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object_id TEXT NOT NULL UNIQUE,
  class_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'expired', 'inactive')),
  object_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for Google Wallet objects
CREATE INDEX IF NOT EXISTS idx_google_wallet_objects_user_id ON google_wallet_objects(user_id);
CREATE INDEX IF NOT EXISTS idx_google_wallet_objects_object_id ON google_wallet_objects(object_id);

-- Add RLS policies for wallet tables
ALTER TABLE wallet_pass_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE apple_pass_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_wallet_objects ENABLE ROW LEVEL SECURITY;

-- Wallet pass events policies
CREATE POLICY "Users can view own wallet events" ON wallet_pass_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert wallet events" ON wallet_pass_events
  FOR INSERT WITH CHECK (true);

-- Apple PassKit registration policies
CREATE POLICY "System can manage Apple PassKit registrations" ON apple_pass_registrations
  FOR ALL USING (true);

-- Google Wallet objects policies
CREATE POLICY "Users can view own wallet objects" ON google_wallet_objects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage Google Wallet objects" ON google_wallet_objects
  FOR ALL USING (true);

-- Create function to generate unique redemption codes
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE redemption_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to update wallet pass when coupon is redeemed
CREATE OR REPLACE FUNCTION update_wallet_on_redemption()
RETURNS TRIGGER AS $$
BEGIN
  -- If coupon status changed to 'redeemed'
  IF NEW.status = 'redeemed' AND OLD.status != 'redeemed' THEN
    -- Insert wallet pass event for redemption
    INSERT INTO wallet_pass_events (user_id, type, platform, payload)
    SELECT 
      up.id,
      'redeemed',
      'both',
      jsonb_build_object(
        'coupon_id', NEW.id,
        'offer_id', NEW.offer_id,
        'redemption_code', NEW.redemption_code,
        'redeemed_at', NEW.redeemed_at
      )
    FROM user_profiles up
    JOIN purchases p ON p.user_id = up.id
    WHERE p.id = NEW.purchase_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update wallet on coupon redemption
CREATE TRIGGER trigger_update_wallet_on_redemption
  AFTER UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_on_redemption();

-- Create function to get user's active deals for wallet
CREATE OR REPLACE FUNCTION get_user_wallet_deals(p_user_id UUID)
RETURNS TABLE (
  offer_id UUID,
  business_name TEXT,
  offer_title TEXT,
  offer_description TEXT,
  discount_type TEXT,
  discount_value DECIMAL,
  hero_image_url TEXT,
  business_lat DECIMAL,
  business_lng DECIMAL,
  coupon_id UUID,
  redemption_code TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as offer_id,
    b.name as business_name,
    o.title as offer_title,
    o.description as offer_description,
    o.discount_type,
    o.discount_value,
    o.hero_image_url,
    b.lat as business_lat,
    b.lng as business_lng,
    c.id as coupon_id,
    c.redemption_code,
    c.status
  FROM offers o
  JOIN businesses b ON b.id = o.business_id
  JOIN coupons c ON c.offer_id = o.id
  JOIN purchases p ON p.id = c.purchase_id
  WHERE p.user_id = p_user_id
    AND c.status = 'active'
    AND o.coupon_book_id IN (
      SELECT DISTINCT cb.id 
      FROM coupon_books cb 
      JOIN purchases p2 ON p2.coupon_book_id = cb.id 
      WHERE p2.user_id = p_user_id
    )
  ORDER BY b.name, o.title;
END;
$$ LANGUAGE plpgsql;
