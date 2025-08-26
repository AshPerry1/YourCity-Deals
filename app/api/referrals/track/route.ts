import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code, userAgent, ipAddress, referrer } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Get referral link details
    const { data: referralLink, error: fetchError } = await supabaseAdmin
      .from('referral_links')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (fetchError || !referralLink) {
      return NextResponse.json({ error: 'Invalid or inactive referral code' }, { status: 404 });
    }

    // Update click count
    const { error: updateError } = await supabaseAdmin
      .from('referral_links')
      .update({ 
        clicks: referralLink.clicks + 1,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', referralLink.id);

    if (updateError) {
      console.error('Error updating click count:', updateError);
    }

    // Log the click event
    const { error: logError } = await supabaseAdmin
      .from('referral_clicks')
      .insert({
        referral_link_id: referralLink.id,
        code,
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer: referrer,
        clicked_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging click:', logError);
    }

    // Return referral data for the frontend
    return NextResponse.json({
      success: true,
      referralData: {
        code: referralLink.code,
        studentName: referralLink.student_name,
        schoolName: referralLink.school_name,
        schoolId: referralLink.school_id
      }
    });

  } catch (error: any) {
    console.error('Referral tracking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Get referral link details
    const { data: referralLink, error } = await supabaseAdmin
      .from('referral_links')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (error || !referralLink) {
      return NextResponse.json({ error: 'Invalid or inactive referral code' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      referralData: {
        code: referralLink.code,
        studentName: referralLink.student_name,
        schoolName: referralLink.school_name,
        schoolId: referralLink.school_id,
        clicks: referralLink.clicks,
        conversions: referralLink.conversions,
        totalRevenue: referralLink.total_revenue
      }
    });

  } catch (error: any) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
