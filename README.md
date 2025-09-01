# YourCity Deals - Digital Coupon Book Platform

A modern Progressive Web App (PWA) for schools and local businesses to manage digital coupon books, built with Next.js 15, TypeScript, and Supabase.

## 🚀 Features

- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Multi-User Roles** - Students, Merchants, Admins, Parents, Purchasers
- **Stripe Integration** - Secure payment processing
- **Real-time Notifications** - Live updates and alerts
- **Merchant Approval System** - Self-serve and manual approval workflows
- **Referral System** - Track and reward referrals
- **Offline Capability** - Works without internet connection
- **Mobile-First Design** - Optimized for all devices

## 📱 PWA Features

YourCity Deals is a fully-featured Progressive Web App that can be installed on:

- **Android** - Install via Chrome browser
- **iOS** - Add to Home Screen via Safari
- **Desktop** - Install via Chrome/Edge browser

### PWA Capabilities
- ✅ Offline functionality
- ✅ App-like experience (standalone mode)
- ✅ Push notifications (coming soon)
- ✅ Fast loading with service worker caching
- ✅ Responsive design for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe Checkout & Webhooks
- **Deployment**: Vercel (recommended)
- **PWA**: Service Worker, Web App Manifest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yourcity-deals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase and Stripe credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up database**
   ```bash
   # Run the database setup script in Supabase SQL Editor
   # Copy contents of setup-supabase-fixed.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Test PWA functionality**
   - Open http://localhost:3000
   - Check PWA status in top-right corner (dev mode)
   - Test install prompts on mobile devices

## 📱 PWA Testing

### Local Testing
1. **Desktop Chrome**: 
   - Open DevTools → Application → Manifest
   - Check service worker registration
   - Run Lighthouse PWA audit

2. **Mobile Testing**:
   - Use ngrok for HTTPS: `ngrok http 3000`
   - Test on Android Chrome and iOS Safari
   - Verify install prompts work

### Production Testing
1. **Deploy to Vercel**:
   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Set up webhooks**:
   - Configure Stripe webhooks with production URL
   - Test payment flows

See [PWA_TESTING_GUIDE.md](./PWA_TESTING_GUIDE.md) for detailed testing instructions.

## 🏗️ Project Structure

```
app/
├── admin/           # Admin dashboard
├── api/            # API routes
├── components/      # Reusable components
├── merchant/        # Merchant portal
├── student/         # Student dashboard
├── layout.tsx       # Root layout with PWA setup
└── page.tsx         # Homepage

public/
├── icons/          # PWA icons
├── manifest.json    # Web app manifest
├── sw.js           # Service worker
└── screenshots/    # PWA screenshots

lib/
├── supabaseClient.ts
├── stripe.ts
└── types.ts
```

## 🔧 PWA Configuration

### Manifest (`public/manifest.json`)
- App name, icons, and theme colors
- Shortcuts for quick access
- Screenshots for app stores

### Service Worker (`public/sw.js`)
- Caches core assets for offline use
- Handles network requests
- Updates automatically

### Install Prompt (`app/components/PWAInstallPrompt.tsx`)
- Shows install button on Android/Chrome
- Provides iOS instructions
- Detects installed state

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**
4. **Configure custom domain**

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack
- **DigitalOcean**: More control

## 📊 Database Schema

The app uses Supabase with these main tables:
- `user_profiles` - User accounts and roles
- `schools` - School information
- `businesses` - Merchant businesses
- `coupon_books` - Digital coupon books
- `offers` - Individual coupons
- `purchases` - Payment records
- `notifications` - Real-time notifications

## 🔐 Security

- **Row Level Security (RLS)** - Database-level security
- **Authentication** - Supabase Auth with multiple providers
- **Rate Limiting** - API endpoint protection
- **CORS** - Cross-origin request handling
- **HTTPS** - Required for PWA functionality

## 📈 Performance

- **Lighthouse Score**: >90 across all metrics
- **Core Web Vitals**: Optimized for mobile
- **PWA Score**: 100/100 installability
- **Offline Support**: Core functionality works offline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test PWA functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub
- **Discord**: Join our community

---

**Built with ❤️ for schools and local businesses**
# Trigger new deployment
