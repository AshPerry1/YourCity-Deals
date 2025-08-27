import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface WalletDeal {
  offer_id: string;
  business_name: string;
  offer_title: string;
  offer_description: string;
  discount_type: string;
  discount_value: number;
  hero_image_url: string;
  business_lat: number;
  business_lng: number;
  coupon_id: string;
  redemption_code: string;
  status: string;
}

export interface UserWalletData {
  id: string;
  first_name: string;
  last_name: string;
  wallet_pass_serial: string;
  redemption_code: string;
  wallet_platforms: string[];
  phone_e164: string;
}

export async function getUserWalletData(userId: string): Promise<UserWalletData | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, first_name, last_name, wallet_pass_serial, redemption_code, wallet_platforms, phone_e164')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user wallet data:', error);
    return null;
  }

  return data as UserWalletData;
}

export async function getUserWalletDeals(userId: string): Promise<WalletDeal[]> {
  const { data, error } = await supabaseAdmin.rpc('get_user_wallet_deals', {
    p_user_id: userId
  });

  if (error) {
    console.error('Error fetching user wallet deals:', error);
    return [];
  }

  return data || [];
}

export async function generateWalletPassSerial(): Promise<string> {
  // Generate a unique serial number for the wallet pass
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `YC${timestamp}${random}`.toUpperCase();
}

export async function generateRedemptionCode(): Promise<string> {
  // Generate a unique 8-character redemption code
  const { data, error } = await supabaseAdmin.rpc('generate_redemption_code');
  
  if (error) {
    console.error('Error generating redemption code:', error);
    // Fallback to client-side generation
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  return data;
}

export async function updateUserWalletData(userId: string, updates: Partial<UserWalletData>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user wallet data:', error);
    return false;
  }

  return true;
}

export async function logWalletEvent(userId: string, type: string, platform: string, payload: any): Promise<void> {
  await supabaseAdmin
    .from('wallet_pass_events')
    .insert({
      user_id: userId,
      type,
      platform,
      payload
    });
}

export function getNearbyLocations(deals: WalletDeal[], maxLocations: number = 10): Array<{latitude: number, longitude: number}> {
  return deals
    .filter(deal => deal.business_lat && deal.business_lng)
    .slice(0, maxLocations)
    .map(deal => ({
      latitude: deal.business_lat,
      longitude: deal.business_lng
    }));
}

export function formatDealForWallet(deal: WalletDeal): string {
  const discountText = deal.discount_type === 'percentage' 
    ? `${deal.discount_value}% off`
    : deal.discount_type === 'fixed'
    ? `$${deal.discount_value} off`
    : deal.discount_type === 'bogo'
    ? 'Buy One Get One'
    : 'Special Offer';

  return `${deal.business_name}: ${discountText} - ${deal.offer_title}`;
}

export function getUserDisplayName(user: UserWalletData): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.first_name || 'YourCity Deals User';
}
