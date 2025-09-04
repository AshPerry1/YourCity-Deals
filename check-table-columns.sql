-- Check the exact table structure for seller_invites
-- Run this in Supabase SQL Editor

-- Show all columns with their constraints
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN is_nullable = 'NO' AND column_default IS NULL THEN 'REQUIRED'
    ELSE 'OPTIONAL'
  END as requirement
FROM information_schema.columns 
WHERE table_name = 'seller_invites'
ORDER BY ordinal_position;

-- Check if there are any NOT NULL constraints without defaults
SELECT 
  column_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'seller_invites' 
  AND tc.constraint_type = 'NOT NULL';

-- Try a minimal insert to see what the minimum required fields are
INSERT INTO seller_invites (
  token,
  first_name,
  last_name,
  email
) VALUES (
  'MINIMAL_TEST',
  'Minimal',
  'Test',
  'minimal@test.com'
) RETURNING *;
