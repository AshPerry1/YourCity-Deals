# Coming Soon Setup

## Overview
The site now displays a "Coming Soon" page to the average user while providing secure admin access for development and testing.

## How It Works

### For Average Users
- Visitors see a beautiful coming soon page with animated deal elements
- The page matches the design from the original `ComingSoon/index.html`
- No access to the full site functionality

### For Admin Access
There are three ways to access the admin area:

1. **Hidden Link**: Hover over the bottom area of the coming soon page to reveal an "Admin Access" link
2. **Keyboard Shortcut**: Press `Ctrl+Shift+A` from anywhere on the site
3. **Direct URL**: Navigate to `/admin-login`

### Admin Login
- **Password**: `admin2025`
- Upon successful login, you'll be redirected to the admin console
- An admin header will appear at the top of all pages showing you're in admin mode
- You can navigate between different sections (Admin, Student Portal, Merchant Console)
- Use the "Logout" button to return to coming soon mode

## Protected Routes
The following routes require admin access:
- `/admin/*` - Admin console
- `/student/*` - Student portal
- `/merchant/*` - Merchant console
- `/purchaser/*` - Purchaser area
- `/parent/*` - Parent/teacher area

## Security Features
- Session-based access control using `sessionStorage`
- Automatic redirect to coming soon page for unauthorized access
- Admin header indicator when in admin mode
- Easy logout functionality

## Deployment Notes
- The coming soon page will be the default landing page for all users
- Admin access is client-side only (for simplicity)
- Consider implementing server-side authentication for production
- The password can be easily changed in `/app/admin-login/page.tsx`

## Customization
- Modify the coming soon page design in `/app/page.tsx`
- Change the admin password in `/app/admin-login/page.tsx`
- Adjust protected routes in `/app/components/AdminAccessGuard.tsx`
- Update the admin header in `/app/components/AdminHeader.tsx`
