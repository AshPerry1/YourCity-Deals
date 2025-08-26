import { UserProfile, TargetingCondition, TargetingRule } from './types';

// Targeting engine for matching users against rules
export class TargetingEngine {
  /**
   * Check if a user matches a targeting rule
   */
  static matchesRule(user: UserProfile, rule: TargetingRule): boolean {
    const { conditions } = rule;
    
    // Check 'all' conditions (AND logic)
    if (conditions.all && conditions.all.length > 0) {
      const allMatch = conditions.all.every(condition => 
        this.matchesCondition(user, condition)
      );
      if (!allMatch) return false;
    }
    
    // Check 'any' conditions (OR logic)
    if (conditions.any && conditions.any.length > 0) {
      const anyMatch = conditions.any.some(condition => 
        this.matchesCondition(user, condition)
      );
      if (!anyMatch) return false;
    }
    
    // Check 'none' conditions (NOT logic)
    if (conditions.none && conditions.none.length > 0) {
      const noneMatch = conditions.none.every(condition => 
        !this.matchesCondition(user, condition)
      );
      if (!noneMatch) return false;
    }
    
    return true;
  }
  
  /**
   * Check if a user matches a single condition
   */
  static matchesCondition(user: UserProfile, condition: TargetingCondition): boolean {
    const { field, operator, value } = condition;
    const userValue = user[field];
    
    if (!userValue) return false;
    
    switch (operator) {
      case 'equals':
        return userValue === value;
        
      case 'in':
        return Array.isArray(value) && value.includes(userValue);
        
      case 'not_in':
        return Array.isArray(value) && !value.includes(userValue);
        
      case 'contains':
        return typeof userValue === 'string' && 
               typeof value === 'string' && 
               userValue.includes(value);
        
      case 'starts_with':
        return typeof userValue === 'string' && 
               typeof value === 'string' && 
               userValue.startsWith(value);
        
      case 'ends_with':
        return typeof userValue === 'string' && 
               typeof value === 'string' && 
               userValue.endsWith(value);
        
      case 'greater_than':
        return this.compareValues(userValue, value, 'gt');
        
      case 'less_than':
        return this.compareValues(userValue, value, 'lt');
        
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          return this.compareValues(userValue, value[0], 'gte') && 
                 this.compareValues(userValue, value[1], 'lte');
        }
        return false;
        
      default:
        return false;
    }
  }
  
  /**
   * Compare values for numeric/date comparisons
   */
  private static compareValues(userValue: any, targetValue: any, comparison: 'gt' | 'lt' | 'gte' | 'lte'): boolean {
    // Handle date comparisons
    if (typeof userValue === 'string' && (userValue.includes('-') || userValue.includes('/'))) {
      const userDate = new Date(userValue);
      const targetDate = new Date(targetValue);
      
      if (!isNaN(userDate.getTime()) && !isNaN(targetDate.getTime())) {
        switch (comparison) {
          case 'gt': return userDate > targetDate;
          case 'lt': return userDate < targetDate;
          case 'gte': return userDate >= targetDate;
          case 'lte': return userDate <= targetDate;
        }
      }
    }
    
    // Handle numeric comparisons
    const userNum = Number(userValue);
    const targetNum = Number(targetValue);
    
    if (isNaN(userNum) || isNaN(targetNum)) return false;
    
    switch (comparison) {
      case 'gt': return userNum > targetNum;
      case 'lt': return userNum < targetNum;
      case 'gte': return userNum >= targetNum;
      case 'lte': return userNum <= targetNum;
    }
    
    return false;
  }
  
  /**
   * Get users matching a targeting rule
   */
  static async getMatchingUsers(rule: TargetingRule, users: UserProfile[]): Promise<UserProfile[]> {
    return users.filter(user => this.matchesRule(user, rule));
  }
  
  /**
   * Preview matching user count
   */
  static async getMatchingUserCount(rule: TargetingRule, users: UserProfile[]): Promise<number> {
    const matchingUsers = await this.getMatchingUsers(rule, users);
    return matchingUsers.length;
  }
  
  /**
   * Generate targeting rule from JSON condition
   */
  static parseTargetingRule(jsonCondition: any): TargetingRule {
    return {
      id: '',
      name: 'Generated Rule',
      conditions: jsonCondition,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  /**
   * Validate targeting rule structure
   */
  static validateRule(rule: TargetingRule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!rule.name) {
      errors.push('Rule name is required');
    }
    
    if (!rule.conditions) {
      errors.push('Conditions are required');
    } else {
      const { all, any, none } = rule.conditions;
      
      if (!all && !any && !none) {
        errors.push('At least one condition type (all, any, none) is required');
      }
      
      // Validate individual conditions
      [all, any, none].forEach(conditions => {
        if (conditions) {
          conditions.forEach((condition, index) => {
            if (!this.validateCondition(condition)) {
              errors.push(`Invalid condition at index ${index}`);
            }
          });
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate a single condition
   */
  private static validateCondition(condition: TargetingCondition): boolean {
    const validFields = ['zip_code', 'school_id', 'grade', 'referrer_code', 'signup_date', 'last_activity'];
    const validOperators = ['equals', 'in', 'not_in', 'contains', 'starts_with', 'ends_with', 'greater_than', 'less_than', 'between'];
    
    return validFields.includes(condition.field) && 
           validOperators.includes(condition.operator) &&
           condition.value !== undefined;
  }
}

// Geolocation utilities
export class GeolocationUtils {
  /**
   * Calculate distance between two zip codes (simplified)
   */
  static async getDistance(zip1: string, zip2: string): Promise<number> {
    // In a real implementation, you'd use a geocoding service
    // For demo purposes, return a random distance
    return Math.random() * 50; // 0-50 miles
  }
  
  /**
   * Check if zip code is within radius
   */
  static async isWithinRadius(targetZip: string, centerZip: string, radiusMiles: number): Promise<boolean> {
    const distance = await this.getDistance(targetZip, centerZip);
    return distance <= radiusMiles;
  }
  
  /**
   * Get zip codes within radius
   */
  static async getZipCodesInRadius(centerZip: string, radiusMiles: number): Promise<string[]> {
    // In a real implementation, you'd query a database of zip codes
    // For demo purposes, return some nearby zip codes
    const nearbyZips = [
      '35223', '35213', '35214', '35215', '35216',
      '35217', '35218', '35219', '35220', '35221'
    ];
    return nearbyZips.filter(zip => zip !== centerZip);
  }
}

// Referral utilities
export class ReferralUtils {
  /**
   * Generate referral code
   */
  static generateReferralCode(userId: string, prefix: string = 'STU'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}_${timestamp}${random}`.toUpperCase();
  }
  
  /**
   * Validate referral code format
   */
  static isValidReferralCode(code: string): boolean {
    const pattern = /^[A-Z]{3}_[A-Z0-9]{8,12}$/;
    return pattern.test(code);
  }
  
  /**
   * Track referral usage
   */
  static async trackReferral(referrerCode: string, referredUserId: string): Promise<void> {
    // In a real implementation, you'd update the database
    console.log(`Referral tracked: ${referrerCode} -> ${referredUserId}`);
  }
}
