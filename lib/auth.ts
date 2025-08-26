import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT_OWNER = 'merchant_owner',
  MERCHANT_STAFF = 'merchant_staff',
  STUDENT = 'student',
  PARENT_TEACHER = 'parent_teacher',
  PURCHASER = 'purchaser'
}

// User interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  school_id?: string;
  business_id?: string;
  student_id?: string;
  created_at: string;
}

// Permission interface
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: 'all', action: 'all' }
  ],
  [UserRole.MERCHANT_OWNER]: [
    { resource: 'business', action: 'read', conditions: { business_id: 'own' } },
    { resource: 'business', action: 'update', conditions: { business_id: 'own' } },
    { resource: 'analytics', action: 'read', conditions: { business_id: 'own' } },
    { resource: 'staff', action: 'manage', conditions: { business_id: 'own' } },
    { resource: 'coupons', action: 'verify' },
    { resource: 'redemptions', action: 'read', conditions: { business_id: 'own' } }
  ],
  [UserRole.MERCHANT_STAFF]: [
    { resource: 'coupons', action: 'verify' },
    { resource: 'redemptions', action: 'read', conditions: { business_id: 'own' } }
  ],
  [UserRole.STUDENT]: [
    { resource: 'profile', action: 'read', conditions: { student_id: 'own' } },
    { resource: 'profile', action: 'update', conditions: { student_id: 'own' } },
    { resource: 'sales', action: 'read', conditions: { student_id: 'own' } },
    { resource: 'referrals', action: 'manage', conditions: { student_id: 'own' } }
  ],
  [UserRole.PARENT_TEACHER]: [
    { resource: 'students', action: 'read', conditions: { school_id: 'own' } },
    { resource: 'analytics', action: 'read', conditions: { school_id: 'own' } },
    { resource: 'sales', action: 'read', conditions: { school_id: 'own' } }
  ],
  [UserRole.PURCHASER]: [
    { resource: 'profile', action: 'read', conditions: { user_id: 'own' } },
    { resource: 'profile', action: 'update', conditions: { user_id: 'own' } },
    { resource: 'coupons', action: 'read', conditions: { user_id: 'own' } },
    { resource: 'coupons', action: 'redeem', conditions: { user_id: 'own' } },
    { resource: 'coupons', action: 'share', conditions: { user_id: 'own' } },
    { resource: 'books', action: 'purchase' }
  ]
};

// Check if user has permission
export function hasPermission(
  user: User | null,
  resource: string,
  action: string,
  conditions?: Record<string, any>
): boolean {
  if (!user) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role];
  if (!permissions) return false;

  // Check for admin role (full access)
  const adminPermission = permissions.find(p => p.resource === 'all' && p.action === 'all');
  if (adminPermission) return true;

  // Check for specific permission
  const permission = permissions.find(p => p.resource === resource && p.action === action);
  if (!permission) return false;

  // Check conditions if they exist
  if (permission.conditions && conditions) {
    return Object.entries(permission.conditions).every(([key, value]) => {
      if (value === 'own') {
        return conditions[key] === user[key as keyof User];
      }
      return conditions[key] === value;
    });
  }

  return true;
}

// Get user's accessible routes
export function getAccessibleRoutes(user: User | null): string[] {
  if (!user) return ['/login', '/signup'];

  const baseRoutes = {
    [UserRole.ADMIN]: ['/admin'],
    [UserRole.MERCHANT_OWNER]: ['/merchant'],
    [UserRole.MERCHANT_STAFF]: ['/merchant/verify'],
    [UserRole.STUDENT]: ['/student'],
    [UserRole.PARENT_TEACHER]: ['/parent'],
    [UserRole.PURCHASER]: ['/purchaser']
  };

  return baseRoutes[user.role] || [];
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Check if we're in demo mode (no Supabase credentials or explicit demo mode)
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
                      !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url' ||
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key';

    if (isDemoMode) {
      // Return a demo admin user for development
      const demoUser: User = {
        id: 'demo-user-id',
        email: 'admin@demo.com',
        role: UserRole.ADMIN,
        created_at: new Date().toISOString()
      };
      return demoUser;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    // In a real app, you'd fetch user profile from your users table
    // For now, we'll simulate based on email
    const mockUser: User = {
      id: user.id,
      email: user.email!,
      role: UserRole.ADMIN, // Default for demo
      created_at: user.created_at
    };

    return mockUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    
    // If there's an error with Supabase, fall back to demo mode
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'admin@demo.com',
      role: UserRole.ADMIN,
      created_at: new Date().toISOString()
    };
    return demoUser;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
