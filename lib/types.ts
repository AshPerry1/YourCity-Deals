// User Profile with targeting data
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  zip_code?: string;
  school_id?: string;
  grade?: string;
  referrer_code?: string;
  signup_date: string;
  last_activity: string;
  preferences?: {
    categories: string[];
    max_distance?: number;
    notification_types: string[];
  };
}

// Targeting conditions
export interface TargetingCondition {
  field: 'zip_code' | 'school_id' | 'grade' | 'referrer_code' | 'signup_date' | 'last_activity';
  operator: 'equals' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between';
  value: string | string[] | number | Date;
}

export interface TargetingRule {
  id: string;
  name: string;
  description?: string;
  conditions: {
    all?: TargetingCondition[];
    any?: TargetingCondition[];
    none?: TargetingCondition[];
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Coupon Grant
export interface CouponGrant {
  id: string;
  coupon_id: string;
  user_id: string;
  grant_type: 'purchased' | 'gifted' | 'targeted';
  targeting_rule_id?: string;
  granted_at: string;
  expires_at?: string;
  used: boolean;
  used_at?: string;
  redemption_code?: string;
}

// Targeting Rule with Coupon
export interface CouponTargetingRule extends TargetingRule {
  coupon_id: string;
  max_grants?: number;
  current_grants: number;
  auto_run: boolean;
  run_frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  last_run?: string;
  next_run?: string;
}

// Performance tracking
export interface CouponPerformance {
  coupon_id: string;
  total_grants: number;
  purchased_grants: number;
  gifted_grants: number;
  targeted_grants: number;
  total_redemptions: number;
  purchased_redemptions: number;
  gifted_redemptions: number;
  targeted_redemptions: number;
  conversion_rate: number;
  revenue_generated: number;
}

// Geolocation data
export interface LocationData {
  zip_code: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  radius_miles?: number;
}

// Referral tracking
export interface ReferralData {
  referrer_code: string;
  referrer_id: string;
  referred_users: number;
  successful_referrals: number;
  total_value_generated: number;
  created_at: string;
}
