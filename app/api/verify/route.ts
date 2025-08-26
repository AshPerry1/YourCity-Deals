import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // For now, we'll simulate the verification process
    // In a real app, you would query the redemptions table
    
    // Simulate finding a redemption
    const redemption = {
      id: '1',
      verified: false,
      coupon: {
        title: '50% off at Local Restaurant'
      },
      user: {
        email: 'user@example.com'
      }
    };

    // In real implementation:
    // const { data: redemption, error } = await supabaseAdmin
    //   .from('redemptions')
    //   .select(`
    //     id, 
    //     verified, 
    //     coupon:coupons(title), 
    //     user:users(email)
    //   `)
    //   .eq('verify_code', code)
    //   .single();

    // if (error || !redemption) {
    //   return NextResponse.json({ valid: false });
    // }

    if (!redemption) {
      return NextResponse.json({ valid: false });
    }

    if (redemption.verified) {
      return NextResponse.json({ valid: false });
    }

    // Mark as verified
    // In real implementation:
    // await supabaseAdmin
    //   .from('redemptions')
    //   .update({ 
    //     verified: true, 
    //     verified_at: new Date().toISOString() 
    //   })
    //   .eq('id', redemption.id);

    return NextResponse.json({ 
      valid: true, 
      couponTitle: redemption.coupon.title, 
      userEmail: redemption.user.email 
    });
    
  } catch (err: any) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
