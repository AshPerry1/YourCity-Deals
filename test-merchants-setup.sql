-- Test Merchants Setup
-- This creates two test merchants to demonstrate Manual vs Self-Serve approval workflows

-- 1. Create test businesses with different approval modes
INSERT INTO businesses (id, name, description, address, phone, email, website, logo_url, approval_mode, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Downtown Coffee Shop',
    'Premium coffee and pastries in the heart of downtown',
    '123 Main St, Downtown, CA 90210',
    '(555) 123-4567',
    'info@downtowncoffee.com',
    'https://downtowncoffee.com',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    'manual',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Tech Startup Hub',
    'Modern workspace and tech services',
    '456 Innovation Ave, Tech District, CA 90211',
    '(555) 987-6543',
    'hello@techhub.com',
    'https://techhub.com',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'self_serve',
    NOW()
);

-- 2. Create test user profiles for merchants
INSERT INTO user_profiles (id, email, first_name, last_name, role, business_id, school_id, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'merchant1@downtowncoffee.com',
    'Sarah',
    'Johnson',
    'merchant',
    '550e8400-e29b-41d4-a716-446655440001',
    NULL,
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'merchant2@techhub.com',
    'Mike',
    'Chen',
    'merchant',
    '550e8400-e29b-41d4-a716-446655440002',
    NULL,
    NOW()
);

-- 3. Create test offers for Downtown Coffee Shop (Manual Mode)
INSERT INTO offers (id, merchant_id, title, description, discount_type, discount_value, original_price, discounted_price, terms_conditions, start_date, end_date, max_redemptions, current_redemptions, status, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440001',
    'Free Pastry with Coffee',
    'Get a complimentary pastry with any coffee purchase',
    'percentage',
    100,
    8.50,
    4.25,
    'Valid for one-time use. Cannot be combined with other offers.',
    NOW(),
    NOW() + INTERVAL '30 days',
    100,
    0,
    'pending_review',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440001',
    'Student Discount - 20% Off',
    '20% discount on all menu items for students',
    'percentage',
    20,
    12.00,
    9.60,
    'Must show valid student ID. Valid Monday-Friday.',
    NOW(),
    NOW() + INTERVAL '90 days',
    200,
    0,
    'draft',
    NOW()
);

-- 4. Create test offers for Tech Startup Hub (Self-Serve Mode)
INSERT INTO offers (id, merchant_id, title, description, discount_type, discount_value, original_price, discounted_price, terms_conditions, start_date, end_date, max_redemptions, current_redemptions, status, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440002',
    'Free Day Pass',
    'Free day pass for new members',
    'percentage',
    100,
    25.00,
    0.00,
    'Valid for first-time visitors only. Must register online.',
    NOW(),
    NOW() + INTERVAL '60 days',
    50,
    0,
    'approved',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440002',
    'Monthly Membership Discount',
    '15% off monthly membership for students',
    'percentage',
    15,
    150.00,
    127.50,
    'Valid student ID required. 3-month minimum commitment.',
    NOW(),
    NOW() + INTERVAL '120 days',
    75,
    0,
    'approved',
    NOW()
);

-- 5. Create test coupon books
INSERT INTO coupon_books (id, name, description, school_id, price, requires_admin_approval, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440009',
    'Downtown Student Deals',
    'Exclusive deals for downtown students',
    '550e8400-e29b-41d4-a716-446655440010',
    15.00,
    true,
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'Tech District Savings',
    'Tech-focused deals and services',
    '550e8400-e29b-41d4-a716-446655440012',
    20.00,
    false,
    NOW()
);

-- 6. Create test schools
INSERT INTO schools (id, name, address, contact_email, contact_phone, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'Downtown University',
    '789 College Blvd, Downtown, CA 90210',
    'admissions@downtown.edu',
    '(555) 111-2222',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'Tech Institute',
    '321 Innovation Way, Tech District, CA 90211',
    'info@techinstitute.edu',
    '(555) 333-4444',
    NOW()
);

-- 7. Add offers to books (some pending approval)
INSERT INTO book_offers (id, book_id, offer_id, status, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440005',
    'pending',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440007',
    'approved',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440008',
    'approved',
    NOW()
);

-- 8. Create test admin user
INSERT INTO user_profiles (id, email, first_name, last_name, role, business_id, school_id, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440016',
    'admin@yourcitydeals.com',
    'Admin',
    'User',
    'admin',
    NULL,
    NULL,
    NOW()
);

-- 9. Add some activity log entries
INSERT INTO activity_log (action, table_name, record_id, user_id, old_values, new_values, created_at) VALUES
(
    'CREATE_BUSINESS',
    'businesses',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440016',
    NULL,
    '{"name": "Downtown Coffee Shop", "approval_mode": "manual"}',
    NOW()
),
(
    'CREATE_BUSINESS',
    'businesses',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440016',
    NULL,
    '{"name": "Tech Startup Hub", "approval_mode": "self_serve"}',
    NOW()
),
(
    'SUBMIT_OFFER',
    'offers',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    NULL,
    '{"status": "pending_review", "title": "Free Pastry with Coffee"}',
    NOW()
);

-- 10. Create test notifications
INSERT INTO notifications (user_id, type, title, message, action_url, created_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440016',
    'warning',
    'New Pending Item',
    'New offer "Free Pastry with Coffee" from Downtown Coffee Shop requires approval.',
    '/admin/approvals',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'info',
    'Offer Submitted for Review',
    'Your offer "Free Pastry with Coffee" has been submitted for admin approval.',
    '/merchant/offers',
    NOW() - INTERVAL '1 hour'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'success',
    'Offer Published',
    'Your offer "Free Day Pass" has been published and is now live!',
    '/merchant/offers',
    NOW() - INTERVAL '2 hours'
);

-- 11. Update the approval mode change history
INSERT INTO activity_log (action, table_name, record_id, user_id, old_values, new_values, created_at) VALUES
(
    'SET_APPROVAL_MODE',
    'businesses',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440016',
    '{"approval_mode": null}',
    '{"approval_mode": "manual"}',
    NOW() - INTERVAL '1 day'
),
(
    'SET_APPROVAL_MODE',
    'businesses',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440016',
    '{"approval_mode": null}',
    '{"approval_mode": "self_serve"}',
    NOW() - INTERVAL '1 day'
);
