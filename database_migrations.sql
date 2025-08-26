-- Migration: Add configurable pricing fields to coupon_books table
-- Date: 2024-12-19

-- Add new fields to coupon_books table
ALTER TABLE coupon_books 
ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 1500,
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_link_url TEXT;

-- Create book_price_changes table for tracking price history
CREATE TABLE IF NOT EXISTS book_price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES coupon_books(id) ON DELETE CASCADE,
  from_cents INTEGER NOT NULL,
  to_cents INTEGER NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_book_price_changes_book_id ON book_price_changes(book_id);
CREATE INDEX IF NOT EXISTS idx_book_price_changes_changed_at ON book_price_changes(changed_at);

-- Add RLS policies for book_price_changes table
ALTER TABLE book_price_changes ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view price changes
CREATE POLICY "Users can view book price changes" ON book_price_changes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert price changes
CREATE POLICY "Users can insert book price changes" ON book_price_changes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update existing coupon_books to have default price if price_cents is null
UPDATE coupon_books SET price_cents = 1500 WHERE price_cents IS NULL;
