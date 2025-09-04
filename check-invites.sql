-- Check what invites are actually in the database
-- Run this in your Supabase SQL Editor

-- Check all invites in seller_invites table
SELECT 
    id,
    token,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM seller_invites 
ORDER BY created_at DESC;

-- Check if TEST123 exists
SELECT * FROM seller_invites WHERE token = 'TEST123';

-- Check if any recent invites exist
SELECT 
    token,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM seller_invites 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
