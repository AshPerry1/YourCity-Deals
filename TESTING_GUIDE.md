# Merchant Approval Workflow Testing Guide

## Overview
This guide will help you test the complete Merchant Self-Serve Toggle and Approval Workflow system with real data.

## Prerequisites
- Supabase database set up with all schemas
- Next.js development server running
- Admin access to the system

## Step 1: Database Setup

### Run the Required SQL Scripts
Execute these scripts in your Supabase SQL Editor in order:

1. **Core Schema**: `merchant-approval-schema.sql`
2. **Notification System**: `notification-schema.sql`
3. **Test Data**: `test-merchants-setup.sql`

### Verify Setup
Check that these tables exist and have data:
- `businesses` (with approval_mode column)
- `offers` (with status column)
- `book_offers` (junction table)
- `notifications`
- `activity_log`

## Step 2: Test Merchants Overview

### Manual Mode Merchant
- **Business**: Downtown Coffee Shop
- **Email**: merchant1@downtowncoffee.com
- **Mode**: Manual approval required
- **Test Offer**: "Free Pastry with Coffee" (pending_review)

### Self-Serve Mode Merchant
- **Business**: Tech Startup Hub
- **Email**: merchant2@techhub.com
- **Mode**: Self-serve publishing
- **Test Offers**: "Free Day Pass" and "Monthly Membership Discount" (approved)

## Step 3: Testing Workflows

### A. Manual Approval Workflow

#### 1. View Pending Items
- Navigate to `/admin/approvals`
- You should see "Free Pastry with Coffee" in the pending queue
- Check notification count in admin sidebar

#### 2. Test Approval Process
- Click "Approve" on the pending offer
- Verify notification is sent to merchant
- Check that offer status changes to "approved"

#### 3. Test Rejection Process
- Create a new offer in manual mode
- Go to approvals queue
- Click "Reject" and provide a reason
- Verify merchant receives rejection notification

#### 4. Test Manual Mode Toggle
- Navigate to `/admin/businesses`
- Find "Downtown Coffee Shop"
- Click "Manage Mode"
- Toggle between Manual and Self-Serve modes
- Verify activity log entries

### B. Self-Serve Workflow

#### 1. View Self-Serve Merchant
- Navigate to `/merchant/dashboard`
- Check approval mode banner shows "Self-Serve Mode"
- Verify offers are already approved and live

#### 2. Create New Self-Serve Offer
- Navigate to `/merchant/offers/new`
- Fill out offer form
- Submit offer
- Verify it goes live immediately (no approval needed)

#### 3. Test Mode Switching
- Switch merchant from Self-Serve to Manual
- Create new offer
- Verify it now requires approval

### C. Notification Testing

#### 1. Real-time Notifications
- Open admin panel in one tab
- Create new offer in another tab
- Watch for real-time notification in admin panel

#### 2. Notification Center
- Click notification bell in admin header
- View all notifications
- Test "Mark as read" functionality
- Test notification deletion

#### 3. Toast Notifications
- Create new offers to trigger toast notifications
- Verify notifications appear and auto-dismiss

## Step 4: Test Page

### Access Test Dashboard
Navigate to `/test-merchants` to see:
- Side-by-side comparison of both modes
- Real merchant data
- Interactive workflow explanations
- Quick access to all test actions

## Step 5: Verification Checklist

### Database Verification
- [ ] All tables created successfully
- [ ] RLS policies working correctly
- [ ] Functions and triggers active
- [ ] Test data inserted properly

### Manual Mode Verification
- [ ] Offers require admin approval
- [ ] Admins receive notifications
- [ ] Approval/rejection works correctly
- [ ] Activity logging functions
- [ ] Mode toggle works

### Self-Serve Mode Verification
- [ ] Offers publish immediately
- [ ] No admin approval required
- [ ] Real-time publishing works
- [ ] Mode toggle works

### Notification Verification
- [ ] Real-time notifications work
- [ ] Toast notifications appear
- [ ] Notification center functions
- [ ] Read/unread states work
- [ ] Notification cleanup works

## Step 6: Common Issues & Solutions

### Issue: Notifications not appearing
**Solution**: Check Supabase real-time subscriptions are enabled

### Issue: Approval functions not working
**Solution**: Verify RLS policies and function permissions

### Issue: Mode toggle not working
**Solution**: Check `set_merchant_approval_mode` function exists

### Issue: Test data not loading
**Solution**: Verify UUIDs match between SQL and frontend

## Step 7: Performance Testing

### Load Testing
- Create multiple offers rapidly
- Test notification delivery under load
- Verify database performance

### Mobile Testing
- Test on mobile devices
- Verify responsive design
- Check notification delivery

## Step 8: Security Testing

### RLS Policy Testing
- Test user isolation
- Verify admin access
- Check data protection

### Function Security
- Test function permissions
- Verify SECURITY DEFINER functions
- Check audit logging

## Next Steps

After successful testing:
1. **Production Deployment**: Deploy to production environment
2. **User Training**: Train admins and merchants on new workflows
3. **Monitoring**: Set up monitoring for approval times and volumes
4. **Optimization**: Optimize based on usage patterns

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase logs
3. Test database connections
4. Review RLS policies

---

**Ready to test!** Start with Step 1 and work through each verification point systematically.
