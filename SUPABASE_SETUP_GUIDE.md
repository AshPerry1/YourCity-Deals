# Supabase Setup Guide for YourCity Deals

## 🚀 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your account
3. **Click "New Project"**
4. **Choose your organization**
5. **Enter project details:**
   - **Name**: `yourcity-deals` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. **Click "Create new project"**

## 🔑 Step 2: Get Your API Keys

Once your project is created:

1. **Go to Settings → API**
2. **Copy these keys:**
   - **Project URL** (starts with `https://`)
   - **Anon Key** (starts with `eyJ`)
   - **Service Role Key** (starts with `eyJ`)

## 📝 Step 3: Update Environment Variables

Edit your `.env.local` file and replace the content with:

```env
# Demo Mode (set to true to bypass authentication for development)
NEXT_PUBLIC_DEMO_MODE=true

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace the placeholder values with your actual Supabase keys.**

## 🗄️ Step 4: Set Up Database Schema

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy the entire content from `setup-supabase.sql`**
4. **Paste it into the SQL Editor**
5. **Click "Run"**

This will create:
- ✅ All necessary tables
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Sample data
- ✅ Storage buckets
- ✅ Database functions

## 🔐 Step 5: Configure Authentication

1. **Go to Authentication → Settings**
2. **Configure your site URL**: `http://localhost:3000`
3. **Add redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`

## 🧪 Step 6: Test Your Connection

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit** `http://localhost:3000`

3. **Check the browser console** for any Supabase connection errors

4. **Test the admin console** at `http://localhost:3000/admin`

## 📊 Step 7: Verify Database Setup

1. **Go to Supabase Dashboard → Table Editor**
2. **Verify these tables exist**:
   - `users`
   - `user_profiles`
   - `schools`
   - `businesses`
   - `coupon_books`
   - `offers`
   - `purchases`
   - `coupons`
   - `redemptions`
   - `referral_links`
   - `referral_clicks`

3. **Check that sample data was inserted**:
   - Schools: Mountain Brook, Vestavia Hills, Homewood
   - Businesses: Local Restaurant, Coffee Shop, Auto Service

## 🔧 Step 8: Create Admin User

1. **Go to Authentication → Users**
2. **Click "Add User"**
3. **Enter admin details**:
   - Email: `admin@yourcitydeals.com`
   - Password: (create a strong password)
4. **Go to SQL Editor** and run:
   ```sql
   INSERT INTO user_profiles (id, first_name, last_name, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'admin@yourcitydeals.com'),
     'Admin',
     'User',
     'admin'
   );
   ```

## 🎯 Step 9: Test Features

### Test Admin Console:
1. **Visit** `http://localhost:3000/admin`
2. **Login** with your admin credentials
3. **Verify you can**:
   - View schools and businesses
   - Access the referral system
   - See the dashboard

### Test Referral System:
1. **Go to** `/admin/referrals`
2. **Generate a test referral link**
3. **Visit the generated link** (e.g., `http://localhost:3000/ref/ABC123`)
4. **Verify the referral page loads**

### Test Purchase Flow:
1. **Visit** `http://localhost:3000/purchase?book=test&ref=ABC123`
2. **Verify the purchase page loads**
3. **Test Stripe integration** (if configured)

## 🚨 Troubleshooting

### Common Issues:

**"Missing Supabase environment variables"**
- Check your `.env.local` file
- Verify all keys are copied correctly
- Restart your development server

**"Table doesn't exist"**
- Run the SQL setup script again
- Check for any SQL errors in the Supabase console

**"RLS policy violation"**
- Verify the user is logged in
- Check that user profiles are created
- Ensure the user has the correct role

**"Authentication errors"**
- Check redirect URLs in Supabase settings
- Verify site URL configuration
- Clear browser cookies and try again

## 📈 Next Steps

After successful setup:

1. **Replace mock data** with real database queries
2. **Test all CRUD operations**
3. **Configure Stripe webhooks**
4. **Set up email notifications**
5. **Deploy to production**

## 🆘 Need Help?

- **Supabase Documentation**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: Create an issue in your repository

---

**Your Supabase setup is complete when you can:**
- ✅ Access the admin console
- ✅ Generate referral links
- ✅ View sample data in tables
- ✅ No connection errors in console
