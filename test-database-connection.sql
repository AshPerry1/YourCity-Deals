-- Test database connection and basic operations
-- Run this in your Supabase SQL Editor

-- Test 1: Check if we can insert a test invite
INSERT INTO seller_invites (
    token,
    first_name,
    last_name,
    email,
    status,
    organization_hub,
    coupon_book,
    sent_at,
    email_sent
) VALUES (
    'TEST-DB-CONNECTION',
    'Test',
    'User',
    'test@example.com',
    'pending',
    'Test School',
    'Test Book',
    NOW(),
    true
) ON CONFLICT (token) DO NOTHING;

-- Test 2: Check if the insert worked
SELECT * FROM seller_invites WHERE token = 'TEST-DB-CONNECTION';

-- Test 3: Check table permissions
SELECT 
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'seller_invites';

-- Test 4: Check RLS policies
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
