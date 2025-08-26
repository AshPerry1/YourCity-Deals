import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TargetingEngine } from '@/lib/targeting';
import { CouponTargetingRule, UserProfile, CouponGrant, TargetingRule } from '@/lib/types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { ruleId, userId } = await request.json();
    
    if (!ruleId) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Fetch the targeting rule from database
    // 2. Fetch user profile from database
    // 3. Check if user matches the rule
    // 4. Check if user already has this coupon
    // 5. Check if rule has reached max grants
    // 6. Create the coupon grant

    // Mock implementation for demo
    const mockRule: CouponTargetingRule = {
      id: ruleId,
      name: 'Demo Rule',
      conditions: {
        any: [
          { field: 'zip_code', operator: 'in', value: ['35223', '35213'] }
        ]
      },
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      coupon_id: 'demo-coupon-1',
      max_grants: 100,
      current_grants: 45,
      auto_run: true,
      run_frequency: 'daily'
    };

    const mockUser: UserProfile = {
      id: '1',
      user_id: userId || 'demo-user',
      email: 'demo@email.com',
      zip_code: '35223',
      signup_date: '2025-01-15',
      last_activity: '2025-01-15'
    };

    // Check if user matches the rule
    const matches = TargetingEngine.matchesRule(mockUser, mockRule);
    
    if (!matches) {
      return NextResponse.json({ 
        granted: false, 
        reason: 'User does not match targeting criteria' 
      });
    }

    // Check if user already has this coupon
    const existingGrant = await checkExistingGrant(mockUser.user_id, mockRule.coupon_id);
    if (existingGrant) {
      return NextResponse.json({ 
        granted: false, 
        reason: 'User already has this coupon' 
      });
    }

    // Check if rule has reached max grants
    if (mockRule.max_grants && mockRule.current_grants >= mockRule.max_grants) {
      return NextResponse.json({ 
        granted: false, 
        reason: 'Maximum grants reached for this rule' 
      });
    }

    // Create the coupon grant
    const grant: CouponGrant = {
      id: Math.random().toString(36).substring(2),
      coupon_id: mockRule.coupon_id,
      user_id: mockUser.user_id,
      grant_type: 'targeted',
      targeting_rule_id: ruleId,
      granted_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      used: false,
      redemption_code: generateRedemptionCode()
    };

    // In real implementation, save to database
    // await supabaseAdmin.from('coupon_grants').insert(grant);
    // await supabaseAdmin.from('coupon_targeting_rules').update({
    //   current_grants: mockRule.current_grants + 1
    // }).eq('id', ruleId);

    return NextResponse.json({ 
      granted: true, 
      grant,
      message: 'Coupon granted successfully' 
    });

  } catch (error: any) {
    console.error('Targeting grant error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('ruleId');
    
    if (!ruleId) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    // Get matching users for a rule
    const mockUsers: UserProfile[] = [
      {
        id: '1',
        user_id: 'user1',
        email: 'john@email.com',
        zip_code: '35223',
        signup_date: '2025-01-15',
        last_activity: '2025-01-15'
      },
      {
        id: '2',
        user_id: 'user2',
        email: 'jane@email.com',
        zip_code: '35213',
        signup_date: '2025-01-10',
        last_activity: '2025-01-14'
      },
      {
        id: '3',
        user_id: 'user3',
        email: 'bob@email.com',
        zip_code: '35225',
        signup_date: '2024-12-20',
        last_activity: '2025-01-13'
      }
    ];

    const mockRule: TargetingRule = {
      id: ruleId,
      name: 'Test Rule',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      conditions: {
        any: [
          { field: 'zip_code', operator: 'in', value: ['35223', '35213'] }
        ]
      }
    };

    const matchingUsers = await TargetingEngine.getMatchingUsers(mockRule, mockUsers);
    const count = await TargetingEngine.getMatchingUserCount(mockRule, mockUsers);

    return NextResponse.json({ 
      matchingUsers,
      count,
      totalUsers: mockUsers.length
    });

  } catch (error: any) {
    console.error('Targeting preview error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper functions
async function checkExistingGrant(userId: string, couponId: string): Promise<boolean> {
  // In real implementation, query database
  // const { data } = await supabaseAdmin
  //   .from('coupon_grants')
  //   .select('id')
  //   .eq('user_id', userId)
  //   .eq('coupon_id', couponId)
  //   .single();
  
  // For demo, return false (no existing grant)
  return false;
}

function generateRedemptionCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
