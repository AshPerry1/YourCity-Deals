# Twilio Setup Guide for Quick Signup

This guide will help you set up Twilio for SMS and email verification in your YourCity Deals app.

## 🚀 Quick Start

### 1. Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number

### 2. Get Your Credentials
From your Twilio Console, get:
- **Account SID** (starts with `AC...`)
- **Auth Token** (found in Account Info)
- **Phone Number** (for SMS)

### 3. Install Twilio SDK
```bash
npm install twilio
```

### 4. Update Environment Variables
Add to your `.env.local`:
```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Email Service (Optional - for email verification)
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

## 📱 SMS Verification Setup

### 1. Get a Twilio Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number that supports SMS
3. Note down the phone number

### 2. Update SMS Function
In `app/api/auth/verify/route.ts`, uncomment and update:

```typescript
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

async function sendSMSCode(phone: string, code: string) {
  try {
    await twilioClient.messages.create({
      body: `Your YourCity Deals verification code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send SMS');
  }
}
```

## ✉️ Email Verification Setup

### Option 1: SendGrid (Recommended)
1. Create a [SendGrid account](https://sendgrid.com/)
2. Get your API key
3. Install SendGrid: `npm install @sendgrid/mail`

Update email function:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendEmailCode(email: string, code: string) {
  try {
    await sgMail.send({
      to: email,
      from: 'noreply@yourcitydeals.com', // Verify this domain in SendGrid
      subject: 'YourCity Deals Verification Code',
      html: `
        <h2>Your verification code is: ${code}</h2>
        <p>This code is valid for 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
}
```

### Option 2: Twilio SendGrid
Twilio owns SendGrid, so you can use it directly:
1. In Twilio Console, go to **SendGrid**
2. Create a SendGrid account
3. Use the same API key setup as above

## 🗄️ Database Setup

### 1. Run Verification Schema
In your Supabase SQL Editor, run the `verification-schema.sql` file:

```sql
-- This creates the verification_codes and referral_tracking tables
-- Run the full SQL from verification-schema.sql
```

### 2. Test the Tables
```sql
-- Check if tables were created
SELECT * FROM verification_codes LIMIT 5;
SELECT * FROM referral_tracking LIMIT 5;
```

## 🧪 Testing

### 1. Development Mode
In development, codes are logged to console:
```bash
# Check your terminal for messages like:
# SMS Code 123456 sent to (555) 123-4567
# Email Code 654321 sent to test@example.com
```

### 2. Test the Flow
1. Go to `http://localhost:3000/quick-signup`
2. Enter a phone number or email
3. Click "Send Verification Code"
4. Check console for the code
5. Enter the code to create account

### 3. Test with Purchase Flow
1. Go to `http://localhost:3000/purchase?book=1`
2. Click "Quick Signup (Phone/Email)"
3. Complete verification
4. Should redirect back to purchase page

## 🔧 Production Setup

### 1. Environment Variables
Make sure all environment variables are set in production:
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=SG...
```

### 2. Domain Verification
For email sending:
1. Verify your domain in SendGrid
2. Set up proper SPF/DKIM records
3. Use a verified sender email

### 3. Phone Number Verification
For SMS:
1. Verify your Twilio phone number
2. Test with real phone numbers
3. Monitor delivery rates

## 📊 Monitoring

### 1. Twilio Console
- Monitor SMS delivery rates
- Check for failed messages
- View usage statistics

### 2. SendGrid Dashboard
- Track email delivery
- Monitor bounce rates
- View engagement metrics

### 3. Database Monitoring
```sql
-- Check verification code usage
SELECT 
  type,
  COUNT(*) as total_codes,
  COUNT(CASE WHEN used = true THEN 1 END) as used_codes,
  COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_codes
FROM verification_codes 
GROUP BY type;
```

## 🚨 Security Considerations

### 1. Rate Limiting
Add rate limiting to prevent abuse:
```typescript
// Add to your API routes
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/api/auth/verify', limiter);
```

### 2. Code Expiration
Codes expire after 10 minutes by default. You can adjust this in the verification API.

### 3. Phone Number Validation
Add proper phone number validation:
```typescript
import { parsePhoneNumber } from 'libphonenumber-js';

function validatePhone(phone: string): boolean {
  try {
    const phoneNumber = parsePhoneNumber(phone, 'US');
    return phoneNumber.isValid();
  } catch {
    return false;
  }
}
```

## 💰 Cost Considerations

### Twilio SMS Pricing
- **Free tier**: 1,000 SMS/month
- **Paid tier**: ~$0.0075 per SMS
- **Phone numbers**: ~$1/month per number

### SendGrid Email Pricing
- **Free tier**: 100 emails/day
- **Paid tier**: ~$0.0001 per email
- **Domain verification**: Free

## 🎯 Next Steps

1. **Set up Twilio account** and get credentials
2. **Update environment variables** with your keys
3. **Run the database schema** in Supabase
4. **Test the verification flow** in development
5. **Deploy to production** with proper environment variables
6. **Monitor usage** and adjust as needed

Your quick signup system is now ready to provide a seamless user experience! 🚀
