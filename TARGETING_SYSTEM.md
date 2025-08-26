# Targeted Coupon Distribution System

## Overview

The YourCity Deals platform now includes a sophisticated targeted coupon distribution system based on real-world merchant strategies. This system enables businesses to automatically grant coupons to users based on geolocation, demographics, behavior, and referral data.

## Merchant Strategies Implemented

### 1. Geolocation / Zip Code Targeting
- **Strategy**: Offer deals to nearby customers to increase foot traffic
- **Implementation**: Target users by zip code or radius-based location
- **Example**: Coffee shop sends BOGO coupons to customers within 1-mile radius

### 2. Demographics & Behavior Targeting
- **Strategy**: Personalize offers based on user data and preferences
- **Implementation**: Target by school, grade, signup date, activity patterns
- **Example**: New user welcome offers, grade-specific promotions

### 3. Referral Program Targeting
- **Strategy**: Provide coupons via referral links to encourage word-of-mouth growth
- **Implementation**: Target users with valid referral codes
- **Example**: Bonus coupons for users who signed up via student referral

### 4. First-Time Buyer Targeting
- **Strategy**: Offer introductory discounts to convert new users
- **Implementation**: Target users by signup date and activity
- **Example**: Welcome coupons for users who signed up in the last 30 days

### 5. Urgency & Personalization
- **Strategy**: Create urgency with limited-time offers and unique codes
- **Implementation**: Time-based targeting and single-use codes
- **Example**: Flash sales for inactive users, personalized loyalty rewards

## Technical Architecture

### Data Models

#### User Profile Extension
```typescript
interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  zip_code?: string;        // Geolocation targeting
  school_id?: string;       // School-based targeting
  grade?: string;           // Grade-level targeting
  referrer_code?: string;   // Referral tracking
  signup_date: string;      // New user targeting
  last_activity: string;    // Activity-based targeting
  preferences?: {
    categories: string[];
    max_distance?: number;
    notification_types: string[];
  };
}
```

#### Targeting Rules
```typescript
interface TargetingRule {
  id: string;
  name: string;
  description?: string;
  conditions: {
    all?: TargetingCondition[];    // AND logic
    any?: TargetingCondition[];    // OR logic
    none?: TargetingCondition[];   // NOT logic
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}
```

#### Coupon Grants
```typescript
interface CouponGrant {
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
```

### Targeting Engine

The `TargetingEngine` class provides the core logic for matching users against targeting rules:

```typescript
class TargetingEngine {
  // Check if user matches a targeting rule
  static matchesRule(user: UserProfile, rule: TargetingRule): boolean
  
  // Check if user matches a single condition
  static matchesCondition(user: UserProfile, condition: TargetingCondition): boolean
  
  // Get users matching a targeting rule
  static getMatchingUsers(rule: TargetingRule, users: UserProfile[]): Promise<UserProfile[]>
  
  // Preview matching user count
  static getMatchingUserCount(rule: TargetingRule, users: UserProfile[]): Promise<number>
}
```

### Supported Targeting Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `zip_code` | string | User's zip code | `"35223"` |
| `school_id` | string | User's school ID | `"school-123"` |
| `grade` | string | User's grade level | `"10"`, `"11"` |
| `referrer_code` | string | Referral code used | `"STU_ABC123"` |
| `signup_date` | date | User's signup date | `"2025-01-15"` |
| `last_activity` | date | Last activity date | `"2025-01-14"` |

### Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `zip_code equals "35223"` |
| `in` | Value in list | `zip_code in ["35223", "35213"]` |
| `not_in` | Value not in list | `grade not_in ["9", "10"]` |
| `contains` | String contains | `referrer_code contains "STU"` |
| `starts_with` | String starts with | `referrer_code starts_with "STU"` |
| `ends_with` | String ends with | `referrer_code ends_with "123"` |
| `greater_than` | Numeric/date comparison | `signup_date greater_than "2025-01-01"` |
| `less_than` | Numeric/date comparison | `last_activity less_than "2025-01-10"` |
| `between` | Range comparison | `signup_date between ["2025-01-01", "2025-01-31"]` |

## Admin Interface

### Targeting Management Dashboard (`/admin/targeting`)

The admin interface provides comprehensive targeting management:

#### 1. Targeting Rules Tab
- View all active and inactive targeting rules
- See grant statistics and performance metrics
- Quick actions: Preview, Run Now, Edit
- Rule status indicators

#### 2. Performance Tab
- Conversion rates by grant type (purchased vs targeted vs gifted)
- Revenue generated from targeted campaigns
- Performance comparison across different strategies

#### 3. User Profiles Tab
- View user data used for targeting
- See referral codes and demographic information
- Monitor user activity patterns

### Condition Builder Component

The `ConditionBuilder` component provides a visual interface for creating complex targeting rules:

#### Features:
- **Visual Rule Builder**: Drag-and-drop style condition creation
- **Multiple Logic Groups**: AND, OR, NOT logic combinations
- **Field-Specific Inputs**: Appropriate input types for each field
- **JSON Preview**: Real-time JSON representation of rules
- **Validation**: Rule validation with helpful error messages

#### Example Rule Creation:
```json
{
  "any": [
    { "zip_code": ["35223", "35213"] },
    { "school_id": ["school-123"], "grade": ["6", "7", "8"] },
    { "referrer_code": ["STU_AB12"] }
  ]
}
```

## API Endpoints

### POST `/api/targeting/grant`
Grant a coupon to a user based on targeting rules.

**Request:**
```json
{
  "ruleId": "rule-123",
  "userId": "user-456"
}
```

**Response:**
```json
{
  "granted": true,
  "grant": {
    "id": "grant-789",
    "coupon_id": "coupon-123",
    "user_id": "user-456",
    "grant_type": "targeted",
    "targeting_rule_id": "rule-123",
    "granted_at": "2025-01-15T10:30:00Z",
    "expires_at": "2025-02-14T10:30:00Z",
    "used": false,
    "redemption_code": "ABC12345"
  },
  "message": "Coupon granted successfully"
}
```

### GET `/api/targeting/grant?ruleId=rule-123`
Preview matching users for a targeting rule.

**Response:**
```json
{
  "matchingUsers": [
    {
      "id": "1",
      "user_id": "user1",
      "email": "john@email.com",
      "zip_code": "35223"
    }
  ],
  "count": 1,
  "totalUsers": 3
}
```

## Real-World Examples

### Example 1: Local Coffee Shop
**Strategy**: Geolocation targeting for foot traffic
```json
{
  "any": [
    { "zip_code": ["35223", "35213", "35214"] }
  ]
}
```
**Result**: Targets users within 3 nearby zip codes

### Example 2: New User Welcome
**Strategy**: First-time buyer conversion
```json
{
  "any": [
    { "signup_date": "greater_than", "value": "2025-01-01" }
  ]
}
```
**Result**: Targets users who signed up in 2025

### Example 3: Referral Rewards
**Strategy**: Word-of-mouth growth
```json
{
  "all": [
    { "referrer_code": "not_in", "value": [""] },
    { "referrer_code": "not_in", "value": [null] }
  ]
}
```
**Result**: Targets users with valid referral codes

### Example 4: Grade-Specific Promotion
**Strategy**: Demographic targeting
```json
{
  "any": [
    { "grade": ["9", "10"], "school_id": ["school-123"] }
  ]
}
```
**Result**: Targets 9th and 10th graders at specific school

## Performance Tracking

### Grant Type Comparison
The system tracks performance across different grant types:

- **Purchased**: User bought the coupon book
- **Targeted**: Automatically granted based on targeting rules
- **Gifted**: Manually gifted by admin or referral

### Key Metrics
- **Conversion Rate**: Percentage of granted coupons that are redeemed
- **Revenue Generated**: Total revenue from each grant type
- **User Engagement**: Activity levels after receiving targeted coupons
- **Geographic Performance**: Success rates by location

### Analytics Dashboard
The performance tab shows:
- Total targeted grants vs. conversions
- Revenue comparison across grant types
- Geographic performance heatmap
- Time-based performance trends

## Security & Validation

### Data Protection
- User data is anonymized in targeting rules
- Personal information is not exposed in rule conditions
- Access is restricted to admin users only

### Rule Validation
- All targeting rules are validated before activation
- Invalid conditions are flagged with helpful error messages
- Rule complexity is limited to prevent performance issues

### Rate Limiting
- Automatic rule execution is rate-limited
- Manual rule execution requires admin approval
- Grant limits prevent abuse

## Future Enhancements

### Advanced Targeting
- **Machine Learning**: Predictive targeting based on user behavior
- **A/B Testing**: Test different targeting strategies
- **Dynamic Rules**: Rules that adapt based on performance
- **Cross-Platform**: Target users across multiple channels

### Enhanced Analytics
- **Real-time Performance**: Live tracking of targeting effectiveness
- **Predictive Analytics**: Forecast targeting success rates
- **ROI Tracking**: Return on investment for targeting campaigns
- **User Journey Mapping**: Track user behavior after receiving targeted coupons

### Integration Features
- **CRM Integration**: Connect with customer relationship management systems
- **Email Marketing**: Automated email campaigns based on targeting
- **Social Media**: Social media targeting and tracking
- **Mobile Push**: Push notifications for targeted users

## Conclusion

The targeted coupon distribution system provides merchants with powerful tools to reach the right customers at the right time. By implementing real-world merchant strategies like geolocation targeting, demographic segmentation, and referral programs, businesses can increase conversion rates, drive foot traffic, and build customer loyalty.

The system is designed to be scalable, secure, and user-friendly, with comprehensive analytics to measure success and optimize performance over time.
