-- Check what data exists in Supabase tables
-- Run this in your Supabase SQL Editor

-- Check seller_invites table
SELECT 
  'seller_invites' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'ready_for_review' THEN 1 END) as ready_count
FROM seller_invites;

-- Show all records in seller_invites
SELECT 
  id,
  token,
  first_name,
  last_name,
  email,
  status,
  created_at,
  updated_at
FROM seller_invites
ORDER BY created_at DESC;

-- Check if table exists and has correct structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'seller_invites'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'seller_invites';
