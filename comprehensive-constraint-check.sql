-- Comprehensive constraint check for seller_profiles table
-- Run this in your Supabase SQL Editor

-- Check all constraints on seller_profiles table
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'seller_profiles';

-- Check all indexes on seller_profiles table
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename = 'seller_profiles';

-- Check if there are any unique constraints on email or phone
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'seller_profiles' 
    AND (kcu.column_name = 'phone' OR kcu.column_name = 'email')
    AND tc.constraint_type = 'UNIQUE';

-- Check current data in seller_profiles
SELECT 
    id,
    invite_id,
    first_name,
    last_name,
    email,
    phone,
    status,
    created_at
FROM seller_profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for duplicate emails
SELECT email, COUNT(*) as count
FROM seller_profiles 
WHERE email IS NOT NULL 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Check for duplicate phone numbers
SELECT phone, COUNT(*) as count
FROM seller_profiles 
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone 
HAVING COUNT(*) > 1;
