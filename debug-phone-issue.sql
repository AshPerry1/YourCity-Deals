-- Run this comprehensive check to see all constraints and current data
-- This will help us identify what's causing the phone number error

-- Check all constraints on seller_profiles table
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'seller_profiles';

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

-- Check for any existing phone numbers
SELECT phone, COUNT(*) as count
FROM seller_profiles 
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone;
