-- Check seller_profiles table structure
-- Run this in Supabase SQL Editor

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;
