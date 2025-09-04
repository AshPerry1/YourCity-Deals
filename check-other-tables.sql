-- Check if there are any records in seller_profiles at all
SELECT COUNT(*) as total_records FROM seller_profiles;

-- Check if there are any records in user_profiles with phone numbers
SELECT phone, COUNT(*) as count
FROM user_profiles 
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone;

-- Check all tables that might have phone number constraints
SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE kcu.column_name = 'phone' 
    AND tc.constraint_type = 'UNIQUE';
