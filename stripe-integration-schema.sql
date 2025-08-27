-- Stripe Integration Schema
-- This implements the complete Stripe integration for coupon book purchases

-- 1. Add Stripe fields to coupon_books table
ALTER TABLE coupon_books 
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_url TEXT;

-- 2. Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    book_id UUID NOT NULL REFERENCES coupon_books(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    amount_cents INTEGER NOT NULL,
    ref_code TEXT,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_books table (tracks which books users own)
CREATE TABLE IF NOT EXISTS user_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES coupon_books(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, book_id)
);

-- 4. Create coupon_grants table (tracks individual coupon grants)
CREATE TABLE IF NOT EXISTS coupon_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES coupon_books(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, offer_id, book_id)
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchases_book_id ON purchases(book_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_ref_code ON purchases(ref_code);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_coupon_grants_user_id ON coupon_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_grants_offer_id ON coupon_grants(offer_id);
CREATE INDEX IF NOT EXISTS idx_coupon_grants_book_id ON coupon_grants(book_id);
CREATE INDEX IF NOT EXISTS idx_coupon_grants_expires ON coupon_grants(expires_at);

-- 6. Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_grants ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for purchases
-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases" ON purchases
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases" ON purchases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- System can insert purchases (via webhook)
CREATE POLICY "System can insert purchases" ON purchases
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
    );

-- System can update purchases
CREATE POLICY "System can update purchases" ON purchases
    FOR UPDATE USING (
        auth.role() = 'service_role'
    );

-- 8. Create RLS policies for user_books
-- Users can view their own books
CREATE POLICY "Users can view their own books" ON user_books
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Admins can view all user books
CREATE POLICY "Admins can view all user books" ON user_books
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- System can manage user books
CREATE POLICY "System can manage user books" ON user_books
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- 9. Create RLS policies for coupon_grants
-- Users can view their own coupon grants
CREATE POLICY "Users can view their own coupon grants" ON coupon_grants
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Users can update their own coupon grants (mark as used)
CREATE POLICY "Users can update their own coupon grants" ON coupon_grants
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Admins can view all coupon grants
CREATE POLICY "Admins can view all coupon grants" ON coupon_grants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- System can manage coupon grants
CREATE POLICY "System can manage coupon grants" ON coupon_grants
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- 10. Create function to award referral points
CREATE OR REPLACE FUNCTION award_referral_points(
    p_user_id UUID,
    p_amount_cents INTEGER,
    p_book_id UUID
) RETURNS VOID AS $$
DECLARE
    v_points_to_award INTEGER;
BEGIN
    -- Calculate points based on purchase amount (1 point per $1)
    v_points_to_award := p_amount_cents / 100;
    
    -- Award points to the user
    UPDATE user_profiles 
    SET points = COALESCE(points, 0) + v_points_to_award
    WHERE id = p_user_id;
    
    -- Log the points award
    INSERT INTO activity_log (
        action, table_name, record_id, user_id, old_values, new_values
    ) VALUES (
        'AWARD_REFERRAL_POINTS', 
        'user_profiles', 
        p_user_id, 
        p_user_id, 
        jsonb_build_object('points', COALESCE((SELECT points FROM user_profiles WHERE id = p_user_id), 0) - v_points_to_award),
        jsonb_build_object('points', COALESCE((SELECT points FROM user_profiles WHERE id = p_user_id), 0))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to get user's available coupons
CREATE OR REPLACE FUNCTION get_user_coupons(p_user_id UUID)
RETURNS TABLE(
    grant_id UUID,
    offer_id UUID,
    book_id UUID,
    offer_title TEXT,
    book_title TEXT,
    merchant_name TEXT,
    discount_type TEXT,
    discount_value INTEGER,
    original_price INTEGER,
    discounted_price INTEGER,
    terms_conditions TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    used BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cg.id as grant_id,
        cg.offer_id,
        cg.book_id,
        o.title as offer_title,
        cb.name as book_title,
        b.name as merchant_name,
        o.discount_type,
        o.discount_value,
        o.original_price,
        o.discounted_price,
        o.terms_conditions,
        cg.expires_at,
        cg.used
    FROM coupon_grants cg
    JOIN offers o ON cg.offer_id = o.id
    JOIN coupon_books cb ON cg.book_id = cb.id
    JOIN businesses b ON o.merchant_id = b.id
    WHERE cg.user_id = p_user_id
    AND (cg.expires_at IS NULL OR cg.expires_at > NOW())
    AND cg.used = FALSE
    ORDER BY cg.granted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to redeem a coupon
CREATE OR REPLACE FUNCTION redeem_coupon(
    p_grant_id UUID,
    p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_offer_id UUID;
    v_current_redemptions INTEGER;
    v_max_redemptions INTEGER;
BEGIN
    -- Get offer details
    SELECT cg.offer_id, o.current_redemptions, o.max_redemptions
    INTO v_offer_id, v_current_redemptions, v_max_redemptions
    FROM coupon_grants cg
    JOIN offers o ON cg.offer_id = o.id
    WHERE cg.id = p_grant_id
    AND cg.user_id = p_user_id
    AND cg.used = FALSE
    AND (cg.expires_at IS NULL OR cg.expires_at > NOW());
    
    IF v_offer_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if offer has reached max redemptions
    IF v_current_redemptions >= v_max_redemptions THEN
        RETURN FALSE;
    END IF;
    
    -- Mark coupon as used
    UPDATE coupon_grants 
    SET used = TRUE, used_at = NOW()
    WHERE id = p_grant_id;
    
    -- Increment offer redemptions
    UPDATE offers 
    SET current_redemptions = current_redemptions + 1
    WHERE id = v_offer_id;
    
    -- Log the redemption
    INSERT INTO activity_log (
        action, table_name, record_id, user_id, old_values, new_values
    ) VALUES (
        'REDEEM_COUPON', 
        'coupon_grants', 
        p_grant_id, 
        p_user_id, 
        jsonb_build_object('used', FALSE),
        jsonb_build_object('used', TRUE, 'used_at', NOW())
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to get purchase statistics
CREATE OR REPLACE FUNCTION get_purchase_stats(p_book_id UUID DEFAULT NULL)
RETURNS TABLE(
    total_purchases INTEGER,
    total_revenue_cents INTEGER,
    total_referrals INTEGER,
    conversion_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_purchases,
        COALESCE(SUM(amount_cents), 0)::INTEGER as total_revenue_cents,
        COUNT(*) FILTER (WHERE ref_code IS NOT NULL)::INTEGER as total_referrals,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE ref_code IS NOT NULL)::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0
        END as conversion_rate
    FROM purchases p
    WHERE p.paid = TRUE
    AND (p_book_id IS NULL OR p.book_id = p_book_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to sync Stripe product/price when book is created
CREATE OR REPLACE FUNCTION sync_stripe_product_on_book_create()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called by the application layer
    -- to create Stripe products/prices when books are created
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Create trigger to log book creation
CREATE TRIGGER book_created_trigger
    AFTER INSERT ON coupon_books
    FOR EACH ROW EXECUTE FUNCTION log_activity_trigger();

-- 16. Grant permissions
GRANT SELECT, INSERT, UPDATE ON purchases TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_books TO authenticated;
GRANT SELECT, INSERT, UPDATE ON coupon_grants TO authenticated;
GRANT EXECUTE ON FUNCTION award_referral_points TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_coupons TO authenticated;
GRANT EXECUTE ON FUNCTION redeem_coupon TO authenticated;
GRANT EXECUTE ON FUNCTION get_purchase_stats TO authenticated;

-- 17. Sample data for testing
INSERT INTO coupon_books (id, name, description, school_id, price_cents, requires_admin_approval, created_at) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440020',
    'Test Stripe Book',
    'Test book for Stripe integration',
    '550e8400-e29b-41d4-a716-446655440010',
    1500, -- $15.00
    false,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM coupon_books WHERE id = '550e8400-e29b-41d4-a716-446655440020'
);
