import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateApplePass } from '../../../../../lib/apple-wallet';
import { getUserWalletData, getUserWalletDeals } from '../../../../../lib/wallet';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { serial: string } }
) {
  try {
    const { serial } = params;

    if (!serial) {
      return NextResponse.json({ error: 'Serial number is required' }, { status: 400 });
    }

    // Find user by wallet pass serial
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, first_name, last_name, wallet_pass_serial, redemption_code, phone')
      .eq('wallet_pass_serial', serial)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    // Get user's active deals
    const deals = await getUserWalletDeals(userProfile.id);
    
    if (deals.length === 0) {
      return NextResponse.json({ error: 'No active deals found' }, { status: 404 });
    }

    // Create user wallet data object
    const userWalletData = {
      id: userProfile.id,
      first_name: userProfile.first_name || '',
      last_name: userProfile.last_name || '',
      wallet_pass_serial: userProfile.wallet_pass_serial,
      redemption_code: userProfile.redemption_code,
      wallet_platforms: ['apple'],
      phone_e164: userProfile.phone || ''
    };

    // Generate updated pass data
    const updatedPass = await updateApplePass(userWalletData, deals);

    return NextResponse.json(updatedPass);

  } catch (error: any) {
    console.error('Apple PassKit pass update error:', error);
    return NextResponse.json({ error: 'Failed to get pass update' }, { status: 500 });
  }
}
