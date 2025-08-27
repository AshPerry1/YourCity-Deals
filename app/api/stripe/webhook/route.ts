import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, handleCheckoutSessionCompleted } from '@/lib/stripe';
import { withRateLimit, RATE_LIMITS } from '@/lib/rateLimit';

async function webhookHandler(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    console.log('Received Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        // Handle successful payment intent (backup for checkout sessions)
        console.log('Payment intent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment intent failed:', event.data.object.id);
        break;

      case 'invoice.payment_succeeded':
        // Handle subscription payments (if using subscriptions)
        console.log('Invoice payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        // Handle failed subscription payments
        console.log('Invoice payment failed:', event.data.object.id);
        break;

      case 'customer.subscription.created':
        // Handle new subscription creation
        console.log('Subscription created:', event.data.object.id);
        break;

      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data.object.id);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription deleted:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

// Apply rate limiting to webhook endpoint
export const POST = withRateLimit(webhookHandler, RATE_LIMITS.API);
