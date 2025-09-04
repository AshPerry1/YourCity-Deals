-- Generate a unique invite with same content as TEST123
-- Run this in your Supabase SQL Editor

-- Generate a unique token
DO $$
DECLARE
    unique_token TEXT;
    timestamp_part TEXT;
    random_part TEXT;
BEGIN
    -- Generate unique token
    timestamp_part := to_char(EXTRACT(EPOCH FROM NOW())::bigint, 'base36');
    random_part := substr(md5(random()::text), 1, 6);
    unique_token := upper(timestamp_part || random_part);
    
    -- Insert new invite with unique token but same content as TEST123
    INSERT INTO seller_invites (
        token,
        first_name,
        last_name,
        email,
        status,
        organization_hub,
        coupon_book,
        sent_at,
        email_sent,
        link_clicked,
        profile_completed
    ) VALUES (
        unique_token,
        'Ash',
        'Perry',
        'adperry18@gmail.com',
        'pending',
        'Mountain Brook High School',
        'Birmingham Restaurant Deals',
        NOW(),
        true,
        false,
        false
    );
    
    -- Display the generated token
    RAISE NOTICE 'Generated unique token: %', unique_token;
    RAISE NOTICE 'New invite created with token: %', unique_token;
END $$;
