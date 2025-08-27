# YourCity Deals — Wallet Integration Deployment Guide

This guide provides step-by-step instructions for deploying Apple Wallet and Google Wallet integration to YourCity Deals.

## Overview

The wallet integration allows users to add their YourCity Deals to Apple Wallet (iOS) and Google Wallet (Android), providing:
- One dynamic wallet card per user that updates automatically
- Location-based lock screen prompts
- Synchronized redemption between wallet and PWA
- Modern, professional wallet experience

## Prerequisites

### Apple Wallet Setup
1. **Apple Developer Account** ($99/year)
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Enroll in the Apple Developer Program

2. **Create Pass Type ID**
   - Go to Certificates, Identifiers & Profiles
   - Create a new Pass Type ID (e.g., `pass.com.yourcitydeals.card`)
   - Download the Pass Type ID certificate (.p12 file)

3. **Download WWDR Certificate**
   - Download Apple's WWDR certificate from [Apple's website](https://developer.apple.com/certificates/)
   - Convert to PEM format if needed

### Google Wallet Setup
1. **Google Cloud Project**
   - Create a project at [console.cloud.google.com](https://console.cloud.google.com)
   - Enable the Google Wallet API

2. **Service Account**
   - Create a service account with Wallet Issuer role
   - Download the JSON key file
   - Note the Issuer ID from Google Wallet console

## Database Setup

1. **Run the wallet schema migration:**
   ```sql
   -- Execute the wallet-integration-schema.sql file
   -- This adds wallet fields to user_profiles and creates wallet tables
   ```

2. **Verify the migration:**
   ```sql
   -- Check that new columns exist
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'user_profiles' 
   AND column_name IN ('wallet_pass_serial', 'redemption_code', 'wallet_platforms');
   ```

## Environment Configuration

1. **Copy environment template:**
   ```bash
   cp env.wallet.example .env.local
   ```

2. **Fill in Apple Wallet variables:**
   ```bash
   # Convert your .p12 certificate to base64
   base64 -i your_certificate.p12 > cert_base64.txt
   
   # Convert WWDR certificate to base64
   base64 -i wwdr.pem > wwdr_base64.txt
   ```

3. **Fill in Google Wallet variables:**
   ```bash
   # Copy your service account JSON to GW_SERVICE_ACCOUNT_JSON
   # Note: Escape newlines with \n in the JSON string
   ```

4. **Set your base URL:**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://yourcitydeals.com
   ```

## Vercel Deployment

1. **Add environment variables to Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from your `.env.local` file

2. **Deploy the application:**
   ```bash
   vercel --prod
   ```

3. **Verify deployment:**
   - Check that all API routes are accessible
   - Test wallet endpoints with authentication

## Testing

### Apple Wallet Testing
1. **Test on iOS device:**
   - Open Safari on iPhone/iPad
   - Navigate to your app
   - Click "Add to Apple Wallet"
   - Verify pass downloads and adds to Wallet

2. **Test PassKit Web Service:**
   - Use Apple's PassKit testing tools
   - Verify device registration works
   - Test pass updates

### Google Wallet Testing
1. **Test on Android device:**
   - Open Chrome on Android
   - Navigate to your app
   - Click "Add to Google Wallet"
   - Verify pass saves to Google Wallet

2. **Test API endpoints:**
   ```bash
   # Test Google Wallet save endpoint
   curl -X POST https://your-app.vercel.app/api/wallet/google/save \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"
   ```

## Integration Points

### Add Wallet Buttons to Your App

1. **Import the component:**
   ```tsx
   import WalletButtons from './components/WalletButtons';
   ```

2. **Add to your pages:**
   ```tsx
   // Show wallet buttons on books page
   <WalletButtons className="mt-6" />
   
   // Show both buttons in settings
   <WalletButtons showBoth={true} />
   ```

### Handle Wallet Redemptions

1. **Update your redemption flow:**
   ```tsx
   // When redeeming from wallet, call the unified endpoint
   const response = await fetch('/api/wallet/redeem', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       couponId: coupon.id,
       platform: 'apple', // or 'google'
       redemptionCode: coupon.redemption_code
     })
   });
   ```

## Security Considerations

1. **Certificate Storage:**
   - Never commit certificates to Git
   - Store as base64 in environment variables
   - Use Vercel's encrypted environment variables

2. **Authentication:**
   - All wallet endpoints require authentication
   - Verify user ownership of coupons
   - Validate redemption codes

3. **Rate Limiting:**
   - Implement rate limiting on wallet endpoints
   - Monitor for abuse

## Monitoring

1. **Set up logging:**
   - Monitor wallet_pass_events table
   - Track redemption success/failure rates
   - Monitor API response times

2. **Error tracking:**
   - Set up error monitoring (e.g., Sentry)
   - Monitor wallet-specific errors
   - Track user feedback

## Troubleshooting

### Common Issues

1. **Apple Wallet pass won't download:**
   - Check certificate validity
   - Verify Pass Type ID matches
   - Ensure proper MIME type headers

2. **Google Wallet save fails:**
   - Verify service account permissions
   - Check Issuer ID format
   - Ensure API is enabled

3. **Pass updates not working:**
   - Check PassKit Web Service endpoints
   - Verify device registrations
   - Monitor push notification delivery

### Debug Commands

```bash
# Check environment variables
vercel env ls

# Test API endpoints locally
npm run dev
curl http://localhost:3000/api/wallet/apple/pass

# Check database tables
psql $DATABASE_URL -c "SELECT * FROM wallet_pass_events LIMIT 5;"
```

## Performance Optimization

1. **Caching:**
   - Cache user wallet data
   - Cache deal information
   - Use CDN for pass assets

2. **Database:**
   - Index wallet-related columns
   - Optimize queries for wallet data
   - Archive old wallet events

## Future Enhancements

1. **Push Notifications:**
   - Implement Apple Push Notification Service
   - Send location-based notifications
   - Notify users of new deals

2. **Analytics:**
   - Track wallet usage patterns
   - Measure redemption rates by platform
   - A/B test wallet features

3. **Advanced Features:**
   - Individual coupon passes
   - Merchant-specific passes
   - Loyalty program integration

## Support

For technical support:
- Check the [Apple Developer Documentation](https://developer.apple.com/documentation/walletpasses)
- Review [Google Wallet API Documentation](https://developers.google.com/wallet)
- Monitor [Vercel Status](https://vercel-status.com)

## License

This wallet integration is part of YourCity Deals and follows the same licensing terms.
