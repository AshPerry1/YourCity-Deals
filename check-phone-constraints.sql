-- Check for phone number uniqueness constraints
-- Run this in your Supabase SQL Editor

-- Check seller_profiles table constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'seller_profiles' 
    AND kcu.column_name = 'phone';

-- Check user_profiles table constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_profiles' 
    AND kcu.column_name = 'phone';

-- Check if phone number already exists in seller_profiles
SELECT COUNT(*) as existing_phone_count
FROM seller_profiles 
WHERE phone IS NOT NULL AND phone != '';

-- Check if phone number already exists in user_profiles
SELECT COUNT(*) as existing_phone_count
FROM user_profiles 
WHERE phone IS NOT NULL AND phone != '';

-- Check for any unique indexes on phone columns
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE indexdef LIKE '%phone%' AND indexdef LIKE '%UNIQUE%';

-- Check current phone numbers in seller_profiles
SELECT phone, COUNT(*) as count
FROM seller_profiles 
WHERE phone IS NOT NULL 
GROUP BY phone 
HAVING COUNT(*) > 1;
