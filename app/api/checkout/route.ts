import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { bookId, userId } = await request.json();
    
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Fetch book details from database
    const { data: book, error } = await supabaseAdmin
      .from('coupon_books')
      .select('*')
      .eq('id', bookId)
      .eq('status', 'active')
      .single();

    if (error || !book) {
      return NextResponse.json({ error: 'Book not found or not active' }, { status: 404 });
    }

    // Use existing Stripe price if available, otherwise create checkout with price data
    let lineItems;
    
    if (book.stripe_price_id) {
      // Use existing Stripe price
      lineItems = [
        {
          price: book.stripe_price_id,
          quantity: 1,
        },
      ];
    } else {
      // Create checkout with price data (fallback)
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
              description: book.description || 'Digital coupon book for local savings',
            },
            unit_amount: book.price_cents,
          },
          quantity: 1,
        },
      ];
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/catalog`,
      metadata: {
        book_id: bookId,
        book_title: book.title,
        school_id: book.school_id,
        user_id: userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
