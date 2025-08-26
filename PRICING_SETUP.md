# Configurable Pricing Setup Guide

This guide explains how to set up the configurable pricing feature for coupon books.

## Database Migration

Run the following SQL migration in your Supabase dashboard:

```sql
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
```

## Features Implemented

### 1. Configurable Price Field
- Default price: $15.00 (1500 cents)
- Live preview shows current price as user types
- Validation ensures price >= 0

### 2. Stripe Integration
- **On Create**: Creates Stripe Product + Price + Payment Link
- **On Update**: Creates new Price (immutable) + new Payment Link
- Old Stripe objects remain for history/receipts

### 3. Price Change Safety
- Confirmation dialog for price drops >50%
- All price changes logged in `book_price_changes` table
- Tracks who made the change and when

### 4. Admin UI Updates
- **Add Book Form**: Price field with live preview
- **Edit Book Form**: Price field with validation and confirmation
- **Price History**: View all price changes for a book

### 5. API Endpoints
- `POST /api/books/create` - Creates book with Stripe objects
- `POST /api/books/[id]/update-price` - Updates price with new Stripe objects
- `POST /api/checkout` - Uses current price for checkout

## Usage

### Creating a Book
1. Go to Admin → Books → Add Book
2. Fill in book details including price (defaults to $15.00)
3. Price field shows live preview
4. Submit creates book + Stripe objects

### Updating Price
1. Go to Admin → Books → Edit Book
2. Change price field
3. If price drops >50%, confirmation dialog appears
4. Submit creates new Stripe Price + Payment Link
5. Old objects remain for history

### Viewing Price History
1. Go to Admin → Books → Edit Book
2. Price history component shows all changes
3. Tracks amount, percentage, date, and user

## Environment Variables

Ensure these are set in your `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing

1. **Create Book**: Test with different prices
2. **Update Price**: Test price increases and decreases
3. **Price Drop**: Test >50% price drop confirmation
4. **Checkout**: Verify new buyers use current price
5. **History**: Check price change logging

## Notes

- Stripe prices are immutable, so price updates create new prices
- Old payment links remain active for existing receipts
- Price changes are logged with user attribution
- Default price is $15.00 but can be changed per book
