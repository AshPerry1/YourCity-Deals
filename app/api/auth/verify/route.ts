import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VerificationRequest {
  phone?: string;
  email?: string;
  verificationType: 'phone' | 'email';
}

export async function POST(request: NextRequest) {
  try {
    const { phone, email, verificationType }: VerificationRequest = await request.json();

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone number or email is required' },
        { status: 400 }
      );
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification code in database
    const { error: dbError } = await supabaseAdmin
      .from('verification_codes')
      .insert({
        identifier: phone || email,
        code: verificationCode,
        type: verificationType,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store verification code' },
        { status: 500 }
      );
    }

    // Send verification code via Twilio
    if (verificationType === 'phone' && phone) {
      await sendSMSCode(phone, verificationCode);
    } else if (verificationType === 'email' && email) {
      await sendEmailCode(email, verificationCode);
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${verificationType}`,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

async function sendSMSCode(phone: string, code: string) {
  // In production, use Twilio SDK
  // const twilioClient = require('twilio')(accountSid, authToken);
  
  console.log(`SMS Code ${code} sent to ${phone}`);
  
  // For development, just log the code
  // In production, uncomment this:
  /*
  await twilioClient.messages.create({
    body: `Your YourCity Deals verification code is: ${code}. Valid for 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
  */
}

async function sendEmailCode(email: string, code: string) {
  // In production, use your email service (SendGrid, etc.)
  
  console.log(`Email Code ${code} sent to ${email}`);
  
  // For development, just log the code
  // In production, implement email sending
  /*
  await sendEmail({
    to: email,
    subject: 'YourCity Deals Verification Code',
    html: `
      <h2>Your verification code is: ${code}</h2>
      <p>This code is valid for 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `
  });
  */
}
