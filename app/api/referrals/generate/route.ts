import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { studentId, schoolId } = await request.json();
    
    if (!studentId || !schoolId) {
      return NextResponse.json({ error: 'Student ID and School ID are required' }, { status: 400 });
    }

    // Generate unique referral code
    const code = generateUniqueCode();
    
    // Get student and school details
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('name, email')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Create referral link record
    const { data: referralLink, error: insertError } = await supabaseAdmin
      .from('referral_links')
      .insert({
        code,
        student_id: studentId,
        school_id: schoolId,
        student_name: student.name,
        school_name: school.name,
        status: 'active',
        created_at: new Date().toISOString(),
        clicks: 0,
        conversions: 0,
        total_revenue: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating referral link:', insertError);
      return NextResponse.json({ error: 'Failed to create referral link' }, { status: 500 });
    }

    // Generate the full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourcitydeals.com';
    const url = `${baseUrl}/ref/${code}`;

    return NextResponse.json({
      success: true,
      referralLink: {
        ...referralLink,
        url
      }
    });

  } catch (error: any) {
    console.error('Referral generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateUniqueCode(): string {
  // Generate a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const studentId = searchParams.get('studentId');

    let query = supabaseAdmin
      .from('referral_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data: referralLinks, error } = await query;

    if (error) {
      console.error('Error fetching referral links:', error);
      return NextResponse.json({ error: 'Failed to fetch referral links' }, { status: 500 });
    }

    // Add full URLs to each link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourcitydeals.com';
    const linksWithUrls = referralLinks?.map(link => ({
      ...link,
      url: `${baseUrl}/ref/${link.code}`
    })) || [];

    return NextResponse.json({ referralLinks: linksWithUrls });

  } catch (error: any) {
    console.error('Error fetching referral links:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
