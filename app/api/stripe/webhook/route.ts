import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing completed checkout session:', session.id);
  
  const bookId = session.metadata?.book_id;
  const userId = session.metadata?.user_id;
  
  if (!bookId) {
    console.error('No book_id in session metadata');
    return;
  }

  try {
    // Update purchase record
    const { error } = await supabaseAdmin
      .from('purchases')
      .update({
        paid: true,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString()
      })
      .eq('book_id', bookId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating purchase:', error);
      return;
    }

    // Create coupon grants for the user
    await createCouponGrants(bookId, userId);
    
    console.log('Successfully processed checkout session:', session.id);
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  // Additional payment success logic can be added here
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);
  // Handle failed payment logic here
}

async function createCouponGrants(bookId: string, userId: string) {
  try {
    // Get all coupons for this book
    const { data: coupons, error: couponsError } = await supabaseAdmin
      .from('coupons')
      .select('id')
      .eq('book_id', bookId);

    if (couponsError || !coupons) {
      console.error('Error fetching coupons:', couponsError);
      return;
    }

    // Create grants for each coupon
    const grants = coupons.map(coupon => ({
      coupon_id: coupon.id,
      user_id: userId,
      grant_type: 'purchased',
      granted_at: new Date().toISOString(),
      used: false
    }));

    const { error: grantsError } = await supabaseAdmin
      .from('coupon_grants')
      .insert(grants);

    if (grantsError) {
      console.error('Error creating coupon grants:', grantsError);
      return;
    }

    console.log(`Created ${grants.length} coupon grants for user ${userId}`);
  } catch (error) {
    console.error('Error creating coupon grants:', error);
  }
}
