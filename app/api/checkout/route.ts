import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { withRateLimit, RATE_LIMITS } from '@/lib/rateLimit';

async function checkoutHandler(req: NextRequest) {
  try {
    const { book_id, ref_code, user_id, success_url, cancel_url } = await req.json();

    if (!book_id) {
      return NextResponse.json(
        { error: 'book_id is required' },
        { status: 400 }
      );
    }

    // Validate book exists and is configured for payments
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: book, error: bookError } = await supabase
      .from('coupon_books')
      .select('*')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (!book.stripe_price_id) {
      return NextResponse.json(
        { error: 'Book not configured for payments' },
        { status: 400 }
      );
    }

    // If user_id is provided, verify user exists
    if (user_id) {
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user_id)
        .single();

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    // If ref_code is provided, verify referral exists
    if (ref_code) {
      const { data: referral, error: referralError } = await supabase
        .from('referral_tracking')
        .select('id')
        .eq('ref_code', ref_code)
        .single();

      if (referralError || !referral) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Create checkout session
    const session = await createCheckoutSession({
      book_id,
      ref_code,
      user_id,
      success_url,
      cancel_url
    });

    return NextResponse.json({
      session_id: session.id,
      checkout_url: session.url,
      book: {
        id: book.id,
        title: book.name,
        price_cents: book.price_cents
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to checkout endpoint
export const POST = withRateLimit(checkoutHandler, RATE_LIMITS.PAYMENT);
