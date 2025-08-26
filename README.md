# Digital Coupon Book

A modern, professional digital coupon management system built with Next.js 14, Supabase, and Stripe. This application allows schools to sell digital coupon books, users to purchase and redeem coupons, and merchants to verify coupon codes.

## ✨ Features

- 🔐 **Secure Authentication** - Supabase Auth with email/password
- 💳 **Payment Processing** - Stripe Checkout integration
- 🎫 **Digital Coupons** - Create, purchase, and redeem digital coupons
- 📱 **PWA Support** - Installable as a mobile app
- 🎨 **Modern UI** - Professional design with glass effects and smooth animations
- 🔒 **Security** - Row Level Security (RLS) and webhook verification
- 📊 **Admin Dashboard** - Manage schools, books, and track sales

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom glass effects
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe Checkout
- **PWA**: next-pwa with Workbox
- **Deployment**: Vercel-ready

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd digital-coupon-book

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Create the following tables with RLS enabled:

```sql
-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon books table
CREATE TABLE coupon_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  year TEXT,
  season TEXT,
  stripe_price_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES coupon_books(id),
  title TEXT NOT NULL,
  expires_at DATE,
  max_redemptions INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  book_id UUID REFERENCES coupon_books(id),
  stripe_session_id TEXT,
  paid BOOLEAN DEFAULT false,
  purchase_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  coupon_id UUID REFERENCES coupons(id),
  verify_code TEXT NOT NULL UNIQUE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE
);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📱 PWA Features

The app is configured as a Progressive Web App with:

- Web app manifest
- Service worker for offline support
- Install prompt for mobile devices
- App-like experience

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Stripe webhook signature verification**
- **Secure authentication** with Supabase
- **Environment variable protection**
- **CSRF protection** on forms

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 📊 Admin Features

- Manage schools and organizations
- Create and edit coupon books
- Import coupons via CSV or manual entry
- Track sales and revenue
- Monitor coupon redemptions

## 🔄 API Endpoints

- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/redeem` - Redeem a coupon
- `GET /api/verify` - Verify a redemption code
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 🎨 Customization

### Colors

The app uses a professional color scheme with:
- Primary: Blue tones (`#3b82f6`)
- Accent: Yellow tones (`#eab308`)
- Glass effects with backdrop blur

### Styling

Custom Tailwind classes available:
- `.glassEffect` - Glass morphism effect
- `.glassCard` - Card with glass styling
- `.btn-primary` - Primary button style
- `.btn-accent` - Accent button style

## 🧪 Testing

### Stripe Test Cards

Use these test cards for development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

### Supabase Testing

- Use Supabase's built-in policy tester
- Test RLS policies with different user roles
- Verify authentication flows

## 📚 Next Steps

1. **Connect Supabase** - Replace placeholder data with real database queries
2. **Set up Stripe** - Configure webhooks and test payments
3. **Add Admin UI** - Build management interfaces
4. **Enhance Security** - Add rate limiting and additional validation
5. **Deploy** - Get your app live on Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Stripe integration guides](https://stripe.com/docs)
3. Open an issue in this repository

---

Built with ❤️ using Next.js, Supabase, and Stripe
