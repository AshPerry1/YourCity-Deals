-- Notification System Schema
-- This implements the complete notification system for approval events

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'error', 'warning', 'info')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- 3. Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- System can insert notifications
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
    );

-- 5. Create function to send notification
CREATE OR REPLACE FUNCTION send_notification(
    p_user_id UUID,
    p_type VARCHAR(20),
    p_title VARCHAR(255),
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message, action_url
    ) VALUES (
        p_user_id, p_type, p_title, p_message, p_action_url
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to notify admin of pending item
CREATE OR REPLACE FUNCTION notify_admin_of_pending_item(
    p_type VARCHAR(20),
    p_item_id UUID,
    p_item_name TEXT,
    p_merchant_name TEXT
) RETURNS VOID AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Get admin user IDs
    FOR v_admin_id IN 
        SELECT user_profiles.id 
        FROM user_profiles 
        WHERE user_profiles.role = 'admin'
    LOOP
        PERFORM send_notification(
            v_admin_id,
            'warning',
            'New Pending Item',
            CASE 
                WHEN p_type = 'offer' THEN 
                    'New offer "' || p_item_name || '" from ' || p_merchant_name || ' requires approval.'
                ELSE 
                    'New book placement "' || p_item_name || '" from ' || p_merchant_name || ' requires approval.'
            END,
            '/admin/approvals'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to notify merchant of approval/rejection
CREATE OR REPLACE FUNCTION notify_merchant_of_decision(
    p_merchant_id UUID,
    p_type VARCHAR(20),
    p_item_name TEXT,
    p_approved BOOLEAN,
    p_reason TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_merchant_user_id UUID;
    v_notification_type VARCHAR(20);
    v_title TEXT;
    v_message TEXT;
BEGIN
    -- Get merchant's user ID
    SELECT user_profiles.id INTO v_merchant_user_id
    FROM user_profiles 
    WHERE user_profiles.business_id = p_merchant_id
    LIMIT 1;
    
    IF v_merchant_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Set notification details
    IF p_approved THEN
        v_notification_type := 'success';
        v_title := 'Item Approved';
        v_message := CASE 
            WHEN p_type = 'offer' THEN 
                'Your offer "' || p_item_name || '" has been approved and is now live!'
            ELSE 
                'Your book placement "' || p_item_name || '" has been approved!'
        END;
    ELSE
        v_notification_type := 'error';
        v_title := 'Item Rejected';
        v_message := CASE 
            WHEN p_type = 'offer' THEN 
                'Your offer "' || p_item_name || '" was rejected.'
            ELSE 
                'Your book placement "' || p_item_name || '" was rejected.'
        END;
        
        IF p_reason IS NOT NULL THEN
            v_message := v_message || ' Reason: ' || p_reason;
        END IF;
    END IF;
    
    -- Send notification
    PERFORM send_notification(
        v_merchant_user_id,
        v_notification_type,
        v_title,
        v_message,
        CASE 
            WHEN p_type = 'offer' THEN '/merchant/offers'
            ELSE '/merchant/dashboard'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update the approve_offer function to send notifications
CREATE OR REPLACE FUNCTION approve_offer(
    p_offer_id UUID,
    p_approved BOOLEAN,
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_merchant_id UUID;
    v_offer_title TEXT;
    v_merchant_name TEXT;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can approve/reject offers';
    END IF;
    
    -- Get offer details
    SELECT offers.merchant_id, offers.title, businesses.name
    INTO v_merchant_id, v_offer_title, v_merchant_name
    FROM offers 
    JOIN businesses ON offers.merchant_id = businesses.id
    WHERE offers.id = p_offer_id;
    
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
    
    -- Send notification to merchant
    PERFORM notify_merchant_of_decision(
        v_merchant_id,
        'offer',
        v_offer_title,
        p_approved,
        p_reason
    );
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to notify when offer is submitted for review
CREATE OR REPLACE FUNCTION notify_offer_submitted(
    p_offer_id UUID
) RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_offer_title TEXT;
    v_merchant_name TEXT;
BEGIN
    -- Get offer details
    SELECT offers.merchant_id, offers.title, businesses.name
    INTO v_merchant_id, v_offer_title, v_merchant_name
    FROM offers 
    JOIN businesses ON offers.merchant_id = businesses.id
    WHERE offers.id = p_offer_id;
    
    -- Notify admins
    PERFORM notify_admin_of_pending_item(
        'offer',
        p_offer_id,
        v_offer_title,
        v_merchant_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create function to notify when book placement is submitted
CREATE OR REPLACE FUNCTION notify_book_placement_submitted(
    p_book_placement_id UUID
) RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_item_name TEXT;
    v_merchant_name TEXT;
BEGIN
    -- Get book placement details
    SELECT 
        offers.merchant_id,
        CONCAT(offers.title, ' → ', coupon_books.name),
        businesses.name
    INTO v_merchant_id, v_item_name, v_merchant_name
    FROM book_offers
    JOIN offers ON book_offers.offer_id = offers.id
    JOIN businesses ON offers.merchant_id = businesses.id
    JOIN coupon_books ON book_offers.book_id = coupon_books.id
    WHERE book_offers.id = p_book_placement_id;
    
    -- Notify admins
    PERFORM notify_admin_of_pending_item(
        'book_placement',
        p_book_placement_id,
        v_item_name,
        v_merchant_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications(
    p_days_old INTEGER DEFAULT 30
) RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE timestamp < NOW() - INTERVAL '1 day' * p_days_old
    AND read = TRUE;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to get notification stats
CREATE OR REPLACE FUNCTION get_notification_stats(p_user_id UUID)
RETURNS TABLE(
    total_notifications INTEGER,
    unread_notifications INTEGER,
    recent_notifications INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_notifications,
        COUNT(*) FILTER (WHERE read = FALSE)::INTEGER as unread_notifications,
        COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours')::INTEGER as recent_notifications
    FROM notifications 
    WHERE notifications.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create trigger to notify when offer status changes to pending_review
CREATE OR REPLACE FUNCTION trigger_offer_notification() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pending_review' AND OLD.status != 'pending_review' THEN
        PERFORM notify_offer_submitted(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER offer_notification_trigger
    AFTER UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION trigger_offer_notification();

-- 14. Create trigger to notify when book placement is created
CREATE OR REPLACE FUNCTION trigger_book_placement_notification() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pending' THEN
        PERFORM notify_book_placement_submitted(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_placement_notification_trigger
    AFTER INSERT ON book_offers
    FOR EACH ROW EXECUTE FUNCTION trigger_book_placement_notification();

-- 15. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION send_notification TO authenticated;
GRANT EXECUTE ON FUNCTION get_notification_stats TO authenticated;

-- 16. Sample data for testing
INSERT INTO notifications (user_id, type, title, message, action_url) 
SELECT 
    auth.uid(),
    'info',
    'Welcome to YourCity Deals',
    'Your notification system is now active. You will receive notifications for approval events.',
    '/dashboard'
FROM auth.users 
WHERE auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
)
LIMIT 1;
