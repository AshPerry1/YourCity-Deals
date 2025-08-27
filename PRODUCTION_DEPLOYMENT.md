# Production Deployment Guide
## Merchant Approval Workflow System

## Overview
This guide covers the complete production deployment process for the Merchant Self-Serve Toggle and Approval Workflow system.

## Prerequisites
- [ ] Vercel account (recommended for Next.js)
- [ ] Supabase production project
- [ ] Domain configured
- [ ] SSL certificates ready
- [ ] Environment variables prepared

## Step 1: Environment Setup

### Production Environment Variables
Create `.env.production` with these variables:

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Stripe Production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio Production (if using SMS verification)
TWILIO_ACCOUNT_SID=your-production-account-sid
TWILIO_AUTH_TOKEN=your-production-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid Production (if using email verification)
SENDGRID_API_KEY=your-production-api-key
SENDGRID_FROM_EMAIL=noreply@yourcitydeals.com

# Application Settings
NEXT_PUBLIC_SITE_URL=https://yourcitydeals.com
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=false

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

### Environment Variable Security
- [ ] Use Vercel's environment variable interface
- [ ] Never commit production keys to Git
- [ ] Rotate keys regularly
- [ ] Use different keys for staging/production

## Step 2: Database Migration

### Production Database Setup
Execute these scripts in your production Supabase SQL Editor:

1. **Core Schema Migration**:
```sql
-- Run merchant-approval-schema.sql
-- This creates all tables, functions, and policies
```

2. **Notification System**:
```sql
-- Run notification-schema.sql
-- This sets up the notification infrastructure
```

3. **Initial Data** (if needed):
```sql
-- Run any initial data scripts
-- Create admin users, default settings, etc.
```

### Database Verification Checklist
- [ ] All tables created successfully
- [ ] RLS policies active
- [ ] Functions and triggers working
- [ ] Indexes created for performance
- [ ] Backup strategy configured
- [ ] Monitoring enabled

## Step 3: Vercel Deployment

### Deployment Configuration
Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Build Optimization
Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'your-production-domain.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
```

### Deployment Steps
1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Production**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to Vercel Dashboard
   - Navigate to Project Settings
   - Add all production environment variables

## Step 4: Domain & SSL Setup

### Domain Configuration
1. **Add Custom Domain**:
   - Go to Vercel Project Settings
   - Add your domain (yourcitydeals.com)
   - Update DNS records as instructed

2. **SSL Certificate**:
   - Vercel automatically provisions SSL
   - Verify certificate is active
   - Test HTTPS redirects

### DNS Records
Configure these DNS records:
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: yourcitydeals.com
```

## Step 5: Monitoring & Analytics

### Error Tracking
Set up Sentry for error monitoring:

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
1. **Vercel Analytics**:
   - Enable in Vercel Dashboard
   - Monitor Core Web Vitals
   - Track user interactions

2. **Database Monitoring**:
   - Enable Supabase monitoring
   - Set up query performance alerts
   - Monitor connection limits

### Health Checks
Create `/api/health` endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test database connection
    const { data, error } = await supabase
      .from('businesses')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
}
```

## Step 6: Security Hardening

### Security Headers
Add security middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com;"
  );
  
  return response;
}
```

### Rate Limiting
Implement rate limiting for API endpoints:

```typescript
// lib/rateLimit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function checkRateLimit(req: NextRequest, limit: number = 100, window: number = 60000) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - window;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip).filter((timestamp: number) => timestamp > windowStart);
  requests.push(now);
  rateLimit.set(ip, requests);
  
  return requests.length <= limit;
}
```

## Step 7: Backup & Recovery

### Database Backups
1. **Supabase Backups**:
   - Enable automatic backups
   - Set retention period (30 days recommended)
   - Test restore procedures

2. **Manual Backup Script**:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Recovery Procedures
1. **Database Recovery**:
   - Document recovery steps
   - Test recovery procedures
   - Keep backup verification logs

2. **Application Recovery**:
   - Maintain deployment rollback procedures
   - Document emergency contacts
   - Test disaster recovery

## Step 8: Performance Optimization

### Build Optimization
1. **Bundle Analysis**:
```bash
npm install --save-dev @next/bundle-analyzer
```

2. **Image Optimization**:
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize image formats

3. **Caching Strategy**:
   - Implement Redis caching (if needed)
   - Use CDN for static assets
   - Optimize database queries

### Database Optimization
1. **Query Optimization**:
   - Add database indexes
   - Optimize RLS policies
   - Monitor slow queries

2. **Connection Pooling**:
   - Configure connection limits
   - Monitor connection usage
   - Implement connection pooling

## Step 9: Testing & Validation

### Pre-Deployment Testing
- [ ] Run full test suite
- [ ] Test all approval workflows
- [ ] Verify notification system
- [ ] Test payment integration
- [ ] Validate security measures

### Post-Deployment Validation
- [ ] Verify all endpoints work
- [ ] Test real-time features
- [ ] Check monitoring systems
- [ ] Validate SSL certificates
- [ ] Test backup procedures

## Step 10: Go-Live Checklist

### Final Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrated and tested
- [ ] Domain and SSL configured
- [ ] Monitoring systems active
- [ ] Backup procedures tested
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team trained on new system
- [ ] Rollback procedures ready

### Launch Sequence
1. **Pre-launch** (24 hours before):
   - Final testing completed
   - Monitoring systems active
   - Team notified

2. **Launch** (Go-live):
   - Deploy to production
   - Verify all systems operational
   - Monitor for issues

3. **Post-launch** (24 hours after):
   - Monitor system performance
   - Address any issues
   - Gather user feedback

## Step 11: Maintenance & Updates

### Regular Maintenance
- [ ] Weekly security updates
- [ ] Monthly performance reviews
- [ ] Quarterly backup testing
- [ ] Annual security audits

### Update Procedures
1. **Staging Environment**:
   - Test all updates in staging
   - Validate with test data
   - Get stakeholder approval

2. **Production Updates**:
   - Schedule maintenance windows
   - Communicate with users
   - Monitor post-update performance

## Support & Documentation

### Documentation
- [ ] API documentation updated
- [ ] User guides created
- [ ] Admin procedures documented
- [ ] Troubleshooting guides ready

### Support Channels
- [ ] Help desk system configured
- [ ] Support email addresses active
- [ ] Emergency contact procedures
- [ ] Escalation matrix defined

---

## Quick Deployment Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback if needed
vercel rollback

# Test production build locally
npm run build
npm start
```

**Ready for production deployment!** Follow this guide step-by-step to ensure a smooth launch.
