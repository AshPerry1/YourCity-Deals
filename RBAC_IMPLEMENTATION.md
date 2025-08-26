# Role-Based Access Control (RBAC) Implementation

## Overview

This document outlines the comprehensive RBAC system implemented for the YourCity Deals platform, ensuring users only see their own dashboards and relevant data based on their assigned roles.

## User Roles

### 1. Admin
- **Access**: Full CRUD access to all entities
- **Dashboard**: Global analytics and system management
- **Features**:
  - Manage schools, students, coupon books, businesses
  - View global analytics and system health
  - Full administrative control
  - Access to all management systems

### 2. Merchant Owner
- **Access**: Business analytics + staff management
- **Dashboard**: Business intelligence and staff management
- **Features**:
  - View business analytics and revenue data
  - Manage merchant staff and assign PINs
  - Track coupon redemptions
  - Business performance insights

### 3. Merchant Staff
- **Access**: Coupon verification only
- **Dashboard**: Simplified verification interface
- **Features**:
  - Verify customer coupons
  - View recent verifications
  - No access to analytics or staff management

### 4. Student
- **Access**: Personal sales stats + referral management
- **Dashboard**: Simple personal dashboard
- **Features**:
  - Track personal sales progress
  - Manage referral links
  - View goal progress
  - Access to support resources

### 5. Parent/Teacher
- **Access**: Student-level and class-level analytics
- **Dashboard**: Student progress monitoring
- **Features**:
  - View individual student progress
  - Class-level analytics and performance
  - Student comparison and insights
  - Progress tracking and reporting

### 6. Purchaser
- **Access**: Buy and manage coupons
- **Dashboard**: Coupon management and discovery
- **Features**:
  - Browse and purchase coupon books
  - Manage owned coupons
  - Set notification preferences
  - Share individual coupons

## Technical Implementation

### Authentication System (`lib/auth.ts`)

```typescript
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT_OWNER = 'merchant_owner',
  MERCHANT_STAFF = 'merchant_staff',
  STUDENT = 'student',
  PARENT_TEACHER = 'parent_teacher',
  PURCHASER = 'purchaser'
}
```

### Permission System

Each role has specific permissions defined:

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: 'all', action: 'all' }
  ],
  [UserRole.MERCHANT_OWNER]: [
    { resource: 'business', action: 'read', conditions: { business_id: 'own' } },
    { resource: 'analytics', action: 'read', conditions: { business_id: 'own' } },
    { resource: 'staff', action: 'manage', conditions: { business_id: 'own' } },
    // ... more permissions
  ],
  // ... other roles
};
```

### Protected Route Component

The `ProtectedRoute` component enforces access control:

```typescript
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminDashboard />
</ProtectedRoute>
```

### Middleware (`middleware.ts`)

Next.js middleware handles route-level access control:

```typescript
const roleRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/merchant': ['merchant_owner', 'merchant_staff'],
  '/student': ['student'],
  '/parent': ['parent_teacher'],
  '/purchaser': ['purchaser'],
};
```

## Dashboard Features by Role

### Admin Dashboard (`/admin`)
- Global statistics overview
- Management system quick access
- System health monitoring
- Recent activity tracking
- Full CRUD operations for all entities

### Merchant Owner Dashboard (`/merchant`)
- Business analytics with revenue tracking
- Staff management with PIN assignment
- Recent redemption history
- Performance insights

### Merchant Staff Dashboard (`/merchant`)
- Simple coupon verification interface
- Recent verification history
- No analytics or management features

### Student Dashboard (`/student`)
- Personal sales statistics
- Goal progress tracking
- Referral link management
- Quick access to books and support

### Parent/Teacher Dashboard (`/parent`)
- Class overview with student statistics
- Individual student progress tracking
- Performance analytics and insights
- Student comparison tools

### Purchaser Dashboard (`/purchaser`)
- Coupon book discovery
- Personal coupon management
- Notification preferences
- Coupon sharing functionality

## Security Features

### Row-Level Security (RLS)
- Database-level access control
- Users can only access their own data
- School-based data isolation
- Business-based data isolation

### Permission Checking
- Resource-based permissions
- Action-based permissions
- Conditional permissions (e.g., "own" data only)
- Real-time permission validation

### Route Protection
- Middleware-level route protection
- Component-level access control
- Fallback to access denied pages
- Graceful error handling

## UI/UX Considerations

### Consistent Design
- All dashboards follow the same design language
- Role-appropriate color schemes
- Consistent navigation patterns
- Professional, modern interface

### Role-Specific Features
- Simplified interfaces for limited roles
- Comprehensive tools for admin roles
- Contextual information display
- Appropriate feature visibility

### Access Denied Handling
- Clear error messages
- Helpful guidance for users
- Contact information for support
- Graceful fallback options

## Database Schema Considerations

### User Roles Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role UserRole NOT NULL,
  school_id UUID REFERENCES schools(id),
  business_id UUID REFERENCES businesses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS Policies
```sql
-- Example: Students can only see their own data
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

-- Example: Parents can see students in their school
CREATE POLICY "Parents can view school students" ON students
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'parent_teacher'
    )
  );
```

## Testing and Validation

### Role Testing
- Each role has specific test cases
- Permission boundary testing
- Data isolation verification
- Cross-role access prevention

### Security Testing
- Unauthorized access attempts
- Permission escalation attempts
- Data leakage prevention
- Session management testing

## Future Enhancements

### Advanced Permissions
- Granular permission system
- Custom role creation
- Permission inheritance
- Time-based permissions

### Audit Logging
- User action tracking
- Permission usage logging
- Security event monitoring
- Compliance reporting

### Multi-Tenant Support
- Organization-level isolation
- Cross-organization permissions
- Hierarchical access control
- Federated identity support

## Conclusion

The RBAC system provides a secure, scalable foundation for the YourCity Deals platform, ensuring users only access appropriate data and features based on their role. The implementation is designed to be maintainable, extensible, and user-friendly while maintaining strict security controls.
