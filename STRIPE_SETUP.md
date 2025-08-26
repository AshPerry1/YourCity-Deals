# Stripe Setup Guide

## Step 1: Get Your Stripe API Keys

1. **Go to your Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Developers → API Keys**
3. **Copy your keys**:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Update Your Environment Variables

Edit your `.env.local` file and add your Stripe keys:

```env
# Demo Mode (set to true to bypass authentication for development)
NEXT_PUBLIC_DEMO_MODE=true

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Set Up Stripe Webhooks

1. **Go to Stripe Dashboard → Developers → Webhooks**
2. **Click "Add endpoint"**
3. **Enter your webhook URL**: `https://your-domain.com/api/stripe/webhook`
4. **Select events to listen for**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Copy the webhook secret** and add it to your `.env.local`

## Step 4: Test Your Integration

### Test Cards for Development:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Test the Checkout Flow:
1. Start your dev server: `npm run dev`
2. Navigate to a coupon book purchase page
3. Click "Buy Now" to test the Stripe checkout
4. Use a test card to complete the payment

## Step 5: Production Setup

When ready for production:

1. **Switch to live keys** in your environment variables
2. **Update webhook URL** to your production domain
3. **Test with real cards** (small amounts)
4. **Set up proper error handling** and logging

## Current Stripe Integration Features

Your app already includes:

✅ **Stripe Checkout Integration** - `app/api/checkout/route.ts`
✅ **Payment Processing** - Handles coupon book purchases
✅ **Success/Cancel URLs** - Redirects after payment
✅ **Metadata Tracking** - Links payments to specific books
✅ **Error Handling** - Proper error responses

## Next Steps After Setup

1. **Test the checkout flow** with test cards
2. **Set up webhook handling** for payment confirmations
3. **Add payment success pages** and email notifications
4. **Implement refund handling** if needed
5. **Add payment analytics** and reporting

## Troubleshooting

### Common Issues:
- **"Invalid API key"**: Check your secret key format
- **"Webhook signature verification failed"**: Verify webhook secret
- **"Product not found"**: Ensure Stripe products exist in your account

### Need Help?
- Check Stripe documentation: https://stripe.com/docs
- Review your Stripe dashboard logs
- Test with Stripe's test mode first
