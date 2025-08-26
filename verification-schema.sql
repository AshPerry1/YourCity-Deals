-- Verification Codes Table
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL, -- phone number or email
    code TEXT NOT NULL, -- 6-digit verification code
    type TEXT NOT NULL CHECK (type IN ('phone', 'email')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral Tracking Table
CREATE TABLE IF NOT EXISTS referral_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'converted', 'expired')),
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_identifier ON verification_codes(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_used ON verification_codes(used);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_user_id ON referral_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_code ON referral_tracking(referral_code);

-- RLS Policies for verification_codes
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can read verification codes
CREATE POLICY "Admins can read verification codes" ON verification_codes
    FOR SELECT USING (auth.role() = 'admin');

-- Anyone can insert verification codes (for signup)
CREATE POLICY "Anyone can insert verification codes" ON verification_codes
    FOR INSERT WITH CHECK (true);

-- Only admins can update verification codes
CREATE POLICY "Admins can update verification codes" ON verification_codes
    FOR UPDATE USING (auth.role() = 'admin');

-- RLS Policies for referral_tracking
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- Users can read their own referral tracking
CREATE POLICY "Users can read own referral tracking" ON referral_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all referral tracking
CREATE POLICY "Admins can read all referral tracking" ON referral_tracking
    FOR SELECT USING (auth.role() = 'admin');

-- Anyone can insert referral tracking (for signup)
CREATE POLICY "Anyone can insert referral tracking" ON referral_tracking
    FOR INSERT WITH CHECK (true);

-- Only admins can update referral tracking
CREATE POLICY "Admins can update referral tracking" ON referral_tracking
    FOR UPDATE USING (auth.role() = 'admin');

-- Function to clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM verification_codes 
    WHERE expires_at < NOW() AND used = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to mark verification code as used
CREATE OR REPLACE FUNCTION mark_verification_code_used(code_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE verification_codes 
    SET used = TRUE, updated_at = NOW()
    WHERE id = code_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verification_codes_updated_at
    BEFORE UPDATE ON verification_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_tracking_updated_at
    BEFORE UPDATE ON referral_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO verification_codes (identifier, code, type, expires_at) VALUES
('test@example.com', '123456', 'email', NOW() + INTERVAL '10 minutes'),
('(555) 123-4567', '654321', 'phone', NOW() + INTERVAL '10 minutes')
ON CONFLICT DO NOTHING;
