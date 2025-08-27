import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createApplePass } from '../../../../lib/apple-wallet';
import { getUserWalletData, getUserWalletDeals, generateWalletPassSerial, generateRedemptionCode, updateUserWalletData, logWalletEvent } from '../../../../lib/wallet';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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
        wallet_platforms: ['apple']
      });
    } else if (!userWalletData.wallet_platforms.includes('apple')) {
      // Add Apple to user's wallet platforms
      await updateUserWalletData(user.id, {
        wallet_platforms: [...userWalletData.wallet_platforms, 'apple']
      });
      userWalletData.wallet_platforms = [...userWalletData.wallet_platforms, 'apple'];
    }

    // Get user's active deals
    const deals = await getUserWalletDeals(user.id);
    
    if (deals.length === 0) {
      return NextResponse.json({ error: 'No active deals found' }, { status: 404 });
    }

    // Create Apple Wallet pass
    const pkpassBuffer = await createApplePass(userWalletData, deals);

    // Log wallet event
    await logWalletEvent(user.id, 'created', 'apple', {
      deals_count: deals.length,
      pass_serial: userWalletData.wallet_pass_serial
    });

    // Return the .pkpass file
    return new NextResponse(pkpassBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="YourCityDeals-${userWalletData.wallet_pass_serial}.pkpass"`
      }
    });

  } catch (error: any) {
    console.error('Apple Wallet pass generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate Apple Wallet pass',
      details: error.message 
    }, { status: 500 });
  }
}
