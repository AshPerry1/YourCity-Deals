import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateGoogleWalletObject } from '../../../lib/google-wallet';
import { getUserWalletData, getUserWalletDeals, logWalletEvent } from '../../../lib/wallet';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { couponId, platform, redemptionCode } = await request.json();

    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

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

    // Verify the coupon belongs to the user and is active
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select(`
        *,
        purchases!inner(user_id),
        offers(business_id, title, description)
      `)
      .eq('id', couponId)
      .eq('purchases.user_id', user.id)
      .eq('status', 'active')
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({ error: 'Coupon not found or already redeemed' }, { status: 404 });
    }

    // If redemption code is provided, verify it matches
    if (redemptionCode && coupon.redemption_code !== redemptionCode) {
      return NextResponse.json({ error: 'Invalid redemption code' }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Mark coupon as redeemed
    const { error: updateError } = await supabaseAdmin
      .from('coupons')
      .update({
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
        redeemed_by: user.id
      })
      .eq('id', couponId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to redeem coupon' }, { status: 500 });
    }

    // Create redemption record
    await supabaseAdmin
      .from('redemptions')
      .insert({
        coupon_id: couponId,
        merchant_id: user.id,
        merchant_pin: verificationCode,
        redeemed_at: new Date().toISOString(),
        notes: `Redeemed via ${platform || 'PWA'}`
      });

    // Get user wallet data
    const userWalletData = await getUserWalletData(user.id);
    
    if (userWalletData) {
      // Get updated deals for wallet
      const deals = await getUserWalletDeals(user.id);

      // Update Google Wallet if user has it
      if (userWalletData.wallet_platforms.includes('google')) {
        try {
          await updateGoogleWalletObject(userWalletData, deals);
          await logWalletEvent(user.id, 'updated', 'google', {
            coupon_id: couponId,
            redemption_code: coupon.redemption_code
          });
        } catch (error) {
          console.error('Failed to update Google Wallet:', error);
        }
      }

      // For Apple Wallet, the update will be handled by the PassKit Web Service
      // when the device requests updates
      if (userWalletData.wallet_platforms.includes('apple')) {
        await logWalletEvent(user.id, 'redeemed', 'apple', {
          coupon_id: couponId,
          redemption_code: coupon.redemption_code
        });
      }
    }

    return NextResponse.json({
      success: true,
      verificationCode,
      message: 'Coupon redeemed successfully',
      coupon: {
        id: coupon.id,
        title: coupon.offers?.title,
        business: coupon.offers?.business_id
      }
    });

  } catch (error: any) {
    console.error('Wallet redemption error:', error);
    return NextResponse.json({ 
      error: 'Redemption failed',
      details: error.message 
    }, { status: 500 });
  }
}
