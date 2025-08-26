import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ConfirmationRequest {
  identifier: string; // phone or email
  code: string;
  verificationType: 'phone' | 'email';
  referralCode?: string;
  returnUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { identifier, code, verificationType, referralCode, returnUrl }: ConfirmationRequest = await request.json();

    if (!identifier || !code) {
      return NextResponse.json(
        { error: 'Identifier and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code
    const { data: verificationData, error: verifyError } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('identifier', identifier)
      .eq('code', code)
      .eq('type', verificationType)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verificationData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Mark code as used
    await supabaseAdmin
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationData.id);

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, phone')
      .or(`${verificationType}.eq.${identifier}`)
      .single();

    let userId: string;

    if (existingUser) {
      // User exists, return their ID
      userId = existingUser.id;
    } else {
      // Create new user account
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: verificationType === 'email' ? identifier : null,
          phone: verificationType === 'phone' ? identifier : null,
          email_verified: verificationType === 'email',
          phone_verified: verificationType === 'phone',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (createError) {
        console.error('User creation error:', createError);
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      userId = newUser.id;

      // Create user profile
      await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: userId,
          profile_complete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      // Track referral if provided
      if (referralCode) {
        await supabaseAdmin
          .from('referral_tracking')
          .insert({
            user_id: userId,
            referral_code: referralCode,
            status: 'registered',
            created_at: new Date().toISOString()
          });
      }
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = generateSessionToken(userId);

    return NextResponse.json({
      success: true,
      userId,
      sessionToken,
      message: 'Account created successfully',
      profileComplete: false,
      returnUrl: returnUrl || '/student/dashboard'
    });

  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm verification' },
      { status: 500 }
    );
  }
}

function generateSessionToken(userId: string): string {
  // In production, use proper JWT with secret
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  };
  
  // For development, return a simple token
  // In production, use a proper JWT library
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
