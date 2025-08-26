-- Migration: Generalize coupon books for any organizer type
-- Date: 2024-12-19

-- Add organizer fields to coupon_books table
ALTER TABLE coupon_books 
ADD COLUMN IF NOT EXISTS organizer_type TEXT 
  CHECK (organizer_type IN ('school','event','neighborhood','nonprofit','business_group','personal')) 
  DEFAULT 'school',
ADD COLUMN IF NOT EXISTS organizer_name TEXT,
ADD COLUMN IF NOT EXISTS organizer_external_id TEXT,
ADD COLUMN IF NOT EXISTS theme_primary TEXT DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS theme_secondary TEXT DEFAULT '#1E40AF',
ADD COLUMN IF NOT EXISTS referrals_enabled BOOLEAN DEFAULT false;

-- Update existing records to have organizer info from school data
UPDATE coupon_books 
SET 
  organizer_name = (SELECT name FROM schools WHERE schools.id = coupon_books.school_id),
  referrals_enabled = true  -- Schools typically want referrals enabled
WHERE organizer_name IS NULL AND school_id IS NOT NULL;

-- Make school_id optional (for non-school organizers)
ALTER TABLE coupon_books 
ALTER COLUMN school_id DROP NOT NULL;

-- Create database views for organizer-specific analytics
CREATE OR REPLACE VIEW v_book_sales AS
SELECT 
  cb.id as book_id,
  cb.organizer_type,
  cb.organizer_name,
  COALESCE(SUM(p.amount_cents), 0) as gross_sales_cents,
  COALESCE(SUM(p.amount_cents - p.fee_cents), 0) as net_sales_cents,
  COUNT(p.id) as units_sold,
  COALESCE(SUM(CASE WHEN p.refunded THEN p.amount_cents ELSE 0 END), 0) as refunds_cents,
  COALESCE(SUM(p.fee_cents), 0) as fees_cents,
  COALESCE(SUM(p.payout_cents), 0) as payouts_cents
FROM coupon_books cb
LEFT JOIN purchases p ON cb.id = p.book_id AND p.paid = true
GROUP BY cb.id, cb.organizer_type, cb.organizer_name;

-- View for promoter/referrer sales (students, volunteers, etc.)
CREATE OR REPLACE VIEW v_promoter_sales AS
SELECT 
  p.book_id,
  p.referrer_id as promoter_id,
  COALESCE(SUM(p.amount_cents), 0) as gross_sales_cents,
  COUNT(p.id) as units_sold
FROM purchases p
WHERE p.paid = true AND p.referrer_id IS NOT NULL
GROUP BY p.book_id, p.referrer_id;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_books_organizer_type ON coupon_books(organizer_type);
CREATE INDEX IF NOT EXISTS idx_coupon_books_organizer_name ON coupon_books(organizer_name);

-- Add sample data for different organizer types (for testing)
INSERT INTO coupon_books (
  title, 
  description, 
  price_cents, 
  organizer_type, 
  organizer_name,
  theme_primary,
  theme_secondary,
  referrals_enabled,
  status
) VALUES 
(
  'SummerFest 2025 Local Deals',
  'Support our annual summer festival while enjoying amazing local business discounts!',
  1500,
  'event',
  'SummerFest 2025',
  '#FF6B35',
  '#D84315',
  true,
  'draft'
),
(
  'Maple Grove Community Savings',
  'Exclusive deals for Maple Grove residents from our trusted local partners.',
  2000,
  'neighborhood',
  'Maple Grove HOA',
  '#4CAF50',
  '#2E7D32',
  false,
  'draft'
),
(
  'Local Business Supporters Pack',
  'Help our nonprofit while discovering great local businesses in your area.',
  1200,
  'nonprofit',
  'Community Care Foundation',
  '#9C27B0',
  '#6A1B9A',
  true,
  'draft'
),
(
  'My Personal Deal Collection',
  'Curated deals I love - invite friends to join and save together!',
  1000,
  'personal',
  'Sarah''s Favorites',
  '#E91E63',
  '#AD1457',
  false,
  'draft'
);

COMMENT ON COLUMN coupon_books.organizer_type IS 'Type of organization creating the coupon book';
COMMENT ON COLUMN coupon_books.organizer_name IS 'Display name for the organizer (e.g., "SummerFest 2025", "Maple Grove HOA")';
COMMENT ON COLUMN coupon_books.organizer_external_id IS 'Optional external system ID for syncing';
COMMENT ON COLUMN coupon_books.theme_primary IS 'Primary brand color for the book';
COMMENT ON COLUMN coupon_books.theme_secondary IS 'Secondary brand color for the book';
COMMENT ON COLUMN coupon_books.referrals_enabled IS 'Whether this book allows referral tracking and leaderboards';
