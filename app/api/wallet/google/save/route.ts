import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSaveToWalletJWT, createGoogleWalletClass, createGoogleWalletObject } from '../../../../lib/google-wallet';
import { getUserWalletData, getUserWalletDeals, generateWalletPassSerial, generateRedemptionCode, updateUserWalletData, logWalletEvent } from '../../../../lib/wallet';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get or create user wallet data
    let userWalletData = await getUserWalletData(user.id);
    
    if (!userWalletData) {
      // Create new wallet data for user
      const walletPassSerial = await generateWalletPassSerial();
      const redemptionCode = await generateRedemptionCode();
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, first_name, last_name, phone')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
      }

      userWalletData = {
        id: profileData.id,
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        wallet_pass_serial: walletPassSerial,
        redemption_code: redemptionCode,
        wallet_platforms: [],
        phone_e164: profileData.phone || ''
      };

      // Update user profile with wallet data
      await updateUserWalletData(user.id, {
        wallet_pass_serial: walletPassSerial,
        redemption_code: redemptionCode,
        wallet_platforms: ['google']
      });
    } else if (!userWalletData.wallet_platforms.includes('google')) {
      // Add Google to user's wallet platforms
      await updateUserWalletData(user.id, {
        wallet_platforms: [...userWalletData.wallet_platforms, 'google']
      });
      userWalletData.wallet_platforms = [...userWalletData.wallet_platforms, 'google'];
    }

    // Get user's active deals
    const deals = await getUserWalletDeals(user.id);
    
    if (deals.length === 0) {
      return NextResponse.json({ error: 'No active deals found' }, { status: 404 });
    }

    // Create Google Wallet class (if it doesn't exist)
    await createGoogleWalletClass();

    // Create Google Wallet object
    await createGoogleWalletObject(userWalletData, deals);

    // Create Save-to-Wallet JWT
    const jwt = createSaveToWalletJWT(userWalletData, deals);
    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;

    // Log wallet event
    await logWalletEvent(user.id, 'created', 'google', {
      deals_count: deals.length,
      pass_serial: userWalletData.wallet_pass_serial
    });

    return NextResponse.json({ 
      url: saveUrl,
      jwt: jwt,
      message: 'Google Wallet pass created successfully'
    });

  } catch (error: any) {
    console.error('Google Wallet save error:', error);
    return NextResponse.json({ 
      error: 'Failed to create Google Wallet pass',
      details: error.message 
    }, { status: 500 });
  }
}
