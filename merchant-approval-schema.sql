-- Merchant Self-Serve Toggle and Approval Workflow Schema
-- This implements the complete approval system for merchants

-- 1. Add approval_mode to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS approval_mode VARCHAR(20) DEFAULT 'manual' CHECK (approval_mode IN ('manual', 'self_serve')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 2. Add approval fields to offers table
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Create book_offers junction table with approval status
CREATE TABLE IF NOT EXISTS book_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES coupon_books(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'removed')),
    added_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, offer_id)
);

-- 4. Add requires_admin_approval to coupon_books
ALTER TABLE coupon_books 
ADD COLUMN IF NOT EXISTS requires_admin_approval BOOLEAN DEFAULT true;

-- 5. Create activity_log table for audit trail
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_approval_mode ON businesses(approval_mode);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_merchant_status ON offers(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_book_offers_status ON book_offers(status);
CREATE INDEX IF NOT EXISTS idx_book_offers_book_status ON book_offers(book_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_action ON activity_log(user_id, action);
CREATE INDEX IF NOT EXISTS idx_activity_log_table_record ON activity_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- 7. Enable RLS on new tables
ALTER TABLE book_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for book_offers
-- Merchants can view their own offers in books
CREATE POLICY "Merchants can view their offers in books" ON book_offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM offers 
            WHERE offers.id = book_offers.offer_id 
            AND offers.merchant_id IN (
                SELECT business_id FROM user_profiles 
                WHERE user_profiles.id = auth.uid()
            )
        )
    );

-- Admins can view all book_offers
CREATE POLICY "Admins can view all book_offers" ON book_offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Merchants can add their offers to books (pending approval)
CREATE POLICY "Merchants can add offers to books" ON book_offers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM offers 
            WHERE offers.id = book_offers.offer_id 
            AND offers.merchant_id IN (
                SELECT business_id FROM user_profiles 
                WHERE user_profiles.id = auth.uid()
            )
        )
    );

-- Admins can manage all book_offers
CREATE POLICY "Admins can manage all book_offers" ON book_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 9. Create RLS policies for activity_log
-- Users can view their own activity
CREATE POLICY "Users can view their own activity" ON activity_log
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Admins can view all activity
CREATE POLICY "Admins can view all activity" ON activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON activity_log
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
    );

-- 10. Create function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_action VARCHAR(100),
    p_table_name VARCHAR(50),
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO activity_log (
        user_id, action, table_name, record_id, 
        old_values, new_values, ip_address, user_agent
    ) VALUES (
        auth.uid(), p_action, p_table_name, p_record_id,
        p_old_values, p_new_values, 
        inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create triggers to automatically log changes
CREATE OR REPLACE FUNCTION log_business_changes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        PERFORM log_activity(
            'UPDATE', 
            'businesses', 
            NEW.id, 
            to_jsonb(OLD), 
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'INSERT' THEN
        PERFORM log_activity(
            'INSERT', 
            'businesses', 
            NEW.id, 
            NULL, 
            to_jsonb(NEW)
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_business_changes_trigger
    AFTER INSERT OR UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION log_business_changes();

-- 12. Create function to set merchant approval mode (admin only)
CREATE OR REPLACE FUNCTION set_merchant_approval_mode(
    p_business_id UUID,
    p_mode VARCHAR(20)
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can change merchant approval mode';
    END IF;
    
    -- Update the business
    UPDATE businesses 
    SET 
        approval_mode = p_mode,
        approved_by = auth.uid(),
        approved_at = NOW()
    WHERE id = p_business_id;
    
    -- Log the action
    PERFORM log_activity(
        'SET_APPROVAL_MODE', 
        'businesses', 
        p_business_id, 
        NULL, 
        jsonb_build_object('approval_mode', p_mode)
    );
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to submit offer for approval
CREATE OR REPLACE FUNCTION submit_offer_for_approval(
    p_offer_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_merchant_id UUID;
    v_approval_mode VARCHAR(20);
BEGIN
    -- Get offer and merchant info
    SELECT offers.merchant_id, businesses.approval_mode 
    INTO v_merchant_id, v_approval_mode
    FROM offers 
    JOIN businesses ON offers.merchant_id = businesses.id
    WHERE offers.id = p_offer_id;
    
    -- Check if user owns this offer
    IF v_merchant_id NOT IN (
        SELECT business_id FROM user_profiles 
        WHERE user_profiles.id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'You can only submit your own offers';
    END IF;
    
    -- Set status based on approval mode
    IF v_approval_mode = 'self_serve' THEN
        UPDATE offers 
        SET 
            status = 'approved',
            approved_by = auth.uid(),
            approved_at = NOW()
        WHERE id = p_offer_id;
    ELSE
        UPDATE offers 
        SET status = 'pending_review'
        WHERE id = p_offer_id;
    END IF;
    
    -- Log the action
    PERFORM log_activity(
        'SUBMIT_OFFER', 
        'offers', 
        p_offer_id, 
        NULL, 
        jsonb_build_object('status', CASE WHEN v_approval_mode = 'self_serve' THEN 'approved' ELSE 'pending_review' END)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to approve/reject offer (admin only)
CREATE OR REPLACE FUNCTION approve_offer(
    p_offer_id UUID,
    p_approved BOOLEAN,
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can approve/reject offers';
    END IF;
    
    -- Update the offer
    UPDATE offers 
    SET 
        status = CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
        approved_by = auth.uid(),
        approved_at = NOW(),
        rejection_reason = CASE WHEN NOT p_approved THEN p_reason ELSE NULL END
    WHERE id = p_offer_id;
    
    -- Log the action
    PERFORM log_activity(
        CASE WHEN p_approved THEN 'APPROVE_OFFER' ELSE 'REJECT_OFFER' END, 
        'offers', 
        p_offer_id, 
        NULL, 
        jsonb_build_object(
            'status', CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
            'reason', p_reason
        )
    );
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create view for pending approvals (admin view)
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
    'offer' as type,
    o.id,
    o.title as item_name,
    b.name as merchant_name,
    o.status,
    o.created_at,
    u.email as submitted_by
FROM offers o
JOIN businesses b ON o.merchant_id = b.id
LEFT JOIN auth.users u ON o.created_by = u.id
WHERE o.status = 'pending_review'

UNION ALL

SELECT 
    'book_placement' as type,
    bo.id,
    CONCAT(o.title, ' → ', cb.name) as item_name,
    b.name as merchant_name,
    bo.status,
    bo.created_at,
    u.email as submitted_by
FROM book_offers bo
JOIN offers o ON bo.offer_id = o.id
JOIN businesses b ON o.merchant_id = b.id
JOIN coupon_books cb ON bo.book_id = cb.id
LEFT JOIN auth.users u ON bo.added_by = u.id
WHERE bo.status = 'pending';

-- Grant permissions
GRANT SELECT ON pending_approvals TO authenticated;

-- 16. Create function to get merchant dashboard stats
CREATE OR REPLACE FUNCTION get_merchant_stats(p_merchant_id UUID)
RETURNS TABLE(
    total_offers INTEGER,
    pending_offers INTEGER,
    approved_offers INTEGER,
    rejected_offers INTEGER,
    total_book_placements INTEGER,
    pending_placements INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_offers,
        COUNT(*) FILTER (WHERE status = 'pending_review')::INTEGER as pending_offers,
        COUNT(*) FILTER (WHERE status = 'approved')::INTEGER as approved_offers,
        COUNT(*) FILTER (WHERE status = 'rejected')::INTEGER as rejected_offers,
        (SELECT COUNT(*) FROM book_offers bo 
         JOIN offers o ON bo.offer_id = o.id 
         WHERE o.merchant_id = p_merchant_id)::INTEGER as total_book_placements,
        (SELECT COUNT(*) FROM book_offers bo 
         JOIN offers o ON bo.offer_id = o.id 
         WHERE o.merchant_id = p_merchant_id AND bo.status = 'pending')::INTEGER as pending_placements
    FROM offers 
    WHERE merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Sample data for testing
INSERT INTO businesses (id, name, approval_mode, approved_by, approved_at) 
VALUES 
    (gen_random_uuid(), 'Test Manual Merchant', 'manual', NULL, NULL),
    (gen_random_uuid(), 'Test Self-Serve Merchant', 'self_serve', NULL, NOW())
ON CONFLICT DO NOTHING;

-- 18. Update existing businesses to have approval_mode
UPDATE businesses 
SET approval_mode = 'manual' 
WHERE approval_mode IS NULL;

-- 19. Update existing offers to have status
UPDATE offers 
SET status = 'approved' 
WHERE status IS NULL;

-- 20. Create notification function (placeholder for future implementation)
CREATE OR REPLACE FUNCTION notify_admin_of_pending_item(
    p_type VARCHAR(20),
    p_item_id UUID
) RETURNS VOID AS $$
BEGIN
    -- This will be implemented with your notification system
    -- For now, just log the notification
    PERFORM log_activity(
        'NOTIFY_ADMIN', 
        p_type, 
        p_item_id, 
        NULL, 
        jsonb_build_object('notification_type', 'pending_approval')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
