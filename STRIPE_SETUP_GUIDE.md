# Stripe Integration Setup Guide
## Merchant Approval Workflow System

## Overview
This guide will help you set up Stripe integration for the coupon book system, including checkout sessions, referral tracking, and webhook fulfillment.

## Prerequisites
- [ ] Stripe account (create at https://stripe.com)
- [ ] Supabase database with Stripe schema
- [ ] Environment variables configured
- [ ] Domain configured for webhooks

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete account verification (business details, bank account)
3. Enable the features you need:
   - **Checkout Sessions** (included by default)
   - **Payment Links** (optional)
   - **Tax calculation** (recommended)
   - **Promotion codes** (recommended)

### 1.2 Get API Keys
1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your **Publishable Key** and **Secret Key**
3. For webhooks, you'll need the **Webhook Secret** (created in Step 3)

## Step 2: Environment Variables

### 2.1 Add to .env.local (Development)
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_USE_PAYMENT_LINKS=false

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.2 Add to Production Environment
```bash
# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_USE_PAYMENT_LINKS=false

# Production Settings
NEXT_PUBLIC_SITE_URL=https://yourcitydeals.com
```

## Step 3: Webhook Configuration

### 3.1 Create Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourcitydeals.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded` (if using subscriptions)
   - `invoice.payment_failed` (if using subscriptions)

### 3.2 Get Webhook Secret
1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add it to your environment variables

### 3.3 Test Webhook
1. In the webhook details, click "Send test webhook"
2. Select `checkout.session.completed`
3. Verify your endpoint receives the event

## Step 4: Database Setup

### 4.1 Run Stripe Schema
Execute the SQL script in your Supabase SQL Editor:
```sql
-- Run stripe-integration-schema.sql
-- This creates all necessary tables and functions
```

### 4.2 Verify Tables Created
Check that these tables exist:
- `purchases` (stores payment records)
- `user_books` (tracks user book ownership)
- `coupon_grants` (tracks individual coupon grants)
- `coupon_books` (updated with Stripe fields)

## Step 5: Install Dependencies

### 5.1 Install Stripe SDK
```bash
npm install stripe
```

### 5.2 Verify Installation
Check that Stripe is properly imported in your code:
```typescript
import Stripe from 'stripe';
```

## Step 6: Test Integration

### 6.1 Test Checkout Flow
1. Create a test coupon book in admin panel
2. Navigate to book preview page
3. Click "Purchase" button
4. Complete test payment in Stripe Checkout
5. Verify webhook processes the payment

### 6.2 Test Webhook Processing
1. Check Supabase logs for webhook events
2. Verify purchase record is created
3. Verify user book is granted
4. Verify coupon grants are created
5. Check referral tracking (if applicable)

## Step 7: Production Configuration

### 7.1 Switch to Live Keys
1. Replace test keys with live keys in production environment
2. Update webhook endpoint URL to production domain
3. Test with small real payment

### 7.2 Configure Tax (Optional)
1. Enable Stripe Tax in dashboard
2. Configure tax settings for your region
3. Test tax calculation in checkout

### 7.3 Configure Promotion Codes (Optional)
1. Create promotion codes in Stripe Dashboard
2. Set up discount rules
3. Test promotion code application

## Step 8: Monitoring & Analytics

### 8.1 Stripe Dashboard
Monitor these metrics:
- **Payment success rate**
- **Average order value**
- **Top payment methods**
- **Failed payments**

### 8.2 Webhook Monitoring
1. Check webhook delivery status
2. Monitor webhook response times
3. Set up alerts for webhook failures

### 8.3 Database Monitoring
Track these metrics:
- **Purchase completion rate**
- **Referral conversion rate**
- **Coupon redemption rate**

## Step 9: Security Best Practices

### 9.1 API Key Security
- [ ] Never commit API keys to Git
- [ ] Use environment variables
- [ ] Rotate keys regularly
- [ ] Use different keys for test/production

### 9.2 Webhook Security
- [ ] Verify webhook signatures
- [ ] Use HTTPS endpoints
- [ ] Implement idempotency
- [ ] Handle webhook failures gracefully

### 9.3 PCI Compliance
- [ ] Never handle raw card data
- [ ] Use Stripe Checkout for payments
- [ ] Follow Stripe's security guidelines
- [ ] Regular security audits

## Step 10: Troubleshooting

### 10.1 Common Issues

#### Issue: Webhook not receiving events
**Solution:**
- Check webhook endpoint URL
- Verify webhook secret
- Check server logs for errors
- Test webhook endpoint manually

#### Issue: Payment not processing
**Solution:**
- Check Stripe API keys
- Verify webhook is configured
- Check database connection
- Review error logs

#### Issue: Coupons not granted
**Solution:**
- Check webhook processing
- Verify user exists
- Check database permissions
- Review activity logs

### 10.2 Debug Tools
1. **Stripe CLI**: Test webhooks locally
2. **Stripe Dashboard**: Monitor payments and events
3. **Supabase Logs**: Check database operations
4. **Browser Console**: Debug frontend issues

## Step 11: Advanced Features

### 11.1 Subscription Support
If implementing subscriptions:
1. Configure subscription products in Stripe
2. Update webhook handlers for subscription events
3. Implement subscription management UI
4. Handle subscription lifecycle events

### 11.2 Multi-Currency Support
If supporting multiple currencies:
1. Configure supported currencies in Stripe
2. Update price handling in application
3. Test currency conversion
4. Update UI for currency display

### 11.3 Advanced Tax Configuration
For complex tax requirements:
1. Configure tax rules in Stripe
2. Set up tax calculation for different regions
3. Test tax calculation accuracy
4. Handle tax reporting

## Step 12: Go-Live Checklist

### 12.1 Pre-Launch Verification
- [ ] All test payments working
- [ ] Webhooks processing correctly
- [ ] Database operations successful
- [ ] Error handling implemented
- [ ] Monitoring configured

### 12.2 Launch Day
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoints
- [ ] Test with small real payment
- [ ] Monitor all systems
- [ ] Have rollback plan ready

### 12.3 Post-Launch Monitoring
- [ ] Monitor payment success rate
- [ ] Check webhook delivery
- [ ] Review error logs
- [ ] Monitor user feedback
- [ ] Track key metrics

## Support Resources

### Stripe Documentation
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)

### Application Support
- Check application logs for errors
- Review Stripe Dashboard for payment status
- Contact support if issues persist

---

## Quick Reference

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_USE_PAYMENT_LINKS=false
NEXT_PUBLIC_SITE_URL=https://yourcitydeals.com
```

### Key Endpoints
- **Checkout**: `/api/checkout`
- **Webhook**: `/api/stripe/webhook`
- **Success**: `/success?session_id={CHECKOUT_SESSION_ID}`

### Test Card Numbers
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**Ready to integrate Stripe!** Follow this guide step-by-step for a successful implementation.
