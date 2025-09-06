-- Fix seller_profiles table by adding unique constraint
-- Run this in your Supabase SQL Editor

-- Add unique constraint on invite_id
ALTER TABLE seller_profiles 
ADD CONSTRAINT seller_profiles_invite_id_unique UNIQUE (invite_id);

-- Verify the constraint was added
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'seller_profiles' 
AND constraint_type = 'UNIQUE';

-- Test the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;
