import Stripe from 'stripe';
import { createClient } from '@/lib/supabaseClient';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient();

// Types
export interface StripeProduct {
  id: string;
  name: string;
  metadata: Record<string, string>;
}

export interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  product: string;
}

export interface StripePaymentLink {
  id: string;
  url: string;
}

export interface CheckoutSessionData {
  book_id: string;
  ref_code?: string;
  user_id?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

// Configuration
const USE_PAYMENT_LINKS = process.env.STRIPE_USE_PAYMENT_LINKS === 'true';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Create Stripe Product, Price, and optional Payment Link for a coupon book
 */
export async function createStripeProductForBook(book: {
  id: string;
  title: string;
  price_cents: number;
  description?: string;
}) {
  try {
    // 1. Create Stripe Product
    const product = await stripe.products.create({
      name: book.title,
      description: book.description || `Digital coupon book: ${book.title}`,
      metadata: {
        book_id: book.id,
        type: 'coupon_book'
      }
    });

    // 2. Create Stripe Price
    const price = await stripe.prices.create({
      unit_amount: book.price_cents,
      currency: 'usd',
      product: product.id,
      metadata: {
        book_id: book.id
      }
    });

    // 3. Create optional Payment Link
    let paymentLink: StripePaymentLink | null = null;
    
    if (USE_PAYMENT_LINKS) {
      const link = await stripe.paymentLinks.create({
        line_items: [{
          price: price.id,
          quantity: 1,
        }],
        allow_promotion_codes: true,
        payment_intent_data: {
          metadata: {
            book_id: book.id
          }
        },
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${BASE_URL}/success?book_id=${book.id}`
          }
        }
      });
      
      paymentLink = {
        id: link.id,
        url: link.url
      };
    }

    // 4. Update database with Stripe IDs
    const { error } = await supabase
      .from('coupon_books')
      .update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        stripe_payment_link_id: paymentLink?.id || null,
        stripe_payment_link_url: paymentLink?.url || null
      })
      .eq('id', book.id);

    if (error) throw error;

    return {
      product,
      price,
      paymentLink
    };
  } catch (error) {
    console.error('Error creating Stripe product for book:', error);
    throw error;
  }
}

/**
 * Update Stripe Price when book price changes
 */
export async function updateStripePriceForBook(book: {
  id: string;
  stripe_price_id: string;
  price_cents: number;
}) {
  try {
    // Create new price (Stripe prices are immutable)
    const newPrice = await stripe.prices.create({
      unit_amount: book.price_cents,
      currency: 'usd',
      product: book.stripe_price_id.split('_')[0], // Extract product ID from price ID
      metadata: {
        book_id: book.id
      }
    });

    // Update database with new price ID
    const { error } = await supabase
      .from('coupon_books')
      .update({
        stripe_price_id: newPrice.id
      })
      .eq('id', book.id);

    if (error) throw error;

    return newPrice;
  } catch (error) {
    console.error('Error updating Stripe price for book:', error);
    throw error;
  }
}

/**
 * Create Checkout Session with referral metadata
 */
export async function createCheckoutSession(data: CheckoutSessionData) {
  try {
    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('coupon_books')
      .select('*')
      .eq('id', data.book_id)
      .single();

    if (bookError || !book) {
      throw new Error('Book not found');
    }

    if (!book.stripe_price_id) {
      throw new Error('Book not configured for payments');
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: book.stripe_price_id,
        quantity: 1,
      }],
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        book_id: data.book_id,
        ref_code: data.ref_code || '',
        user_id: data.user_id || ''
      },
      success_url: data.success_url || `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancel_url || `${BASE_URL}/books/${data.book_id}`,
      customer_email: data.user_id ? undefined : undefined, // Will be collected during checkout
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Handle webhook fulfillment for completed checkout sessions
 */
export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const { book_id, ref_code, user_id } = session.metadata || {};
    
    if (!book_id) {
      throw new Error('No book_id in session metadata');
    }

    // 1. Record purchase in database
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        book_id,
        user_id: user_id || null,
        amount_cents: session.amount_total || 0,
        ref_code: ref_code || null,
        paid: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // 2. Grant book and distribute coupons
    if (user_id) {
      await grantBookAndFanOutCoupons({
        userId: user_id,
        bookId: book_id
      });
    }

    // 3. Track referral conversion
    if (ref_code) {
      await trackReferralConversion({
        ref_code,
        book_id,
        amount_cents: session.amount_total || 0
      });
    }

    // 4. Send notification to user (if they have an account)
    if (user_id) {
      await supabase.rpc('send_notification', {
        p_user_id: user_id,
        p_type: 'success',
        p_title: 'Purchase Successful',
        p_message: `Your coupon book has been purchased and is now available!`,
        p_action_url: `/student/books/${book_id}`
      });
    }

    return purchase;
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

/**
 * Grant book and distribute coupons to user
 */
async function grantBookAndFanOutCoupons({ userId, bookId }: { userId: string; bookId: string }) {
  try {
    // 1. Grant the book to the user
    const { error: grantError } = await supabase
      .from('user_books')
      .insert({
        user_id: userId,
        book_id: bookId,
        granted_at: new Date().toISOString()
      });

    if (grantError) throw grantError;

    // 2. Get all offers in the book
    const { data: offers, error: offersError } = await supabase
      .from('book_offers')
      .select(`
        offer_id,
        offers (
          id,
          title,
          max_redemptions,
          current_redemptions
        )
      `)
      .eq('book_id', bookId)
      .eq('status', 'approved');

    if (offersError) throw offersError;

    // 3. Create coupon grants for each offer
    const couponGrants = offers?.map(bookOffer => ({
      user_id: userId,
      offer_id: bookOffer.offer_id,
      book_id: bookId,
      granted_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    })) || [];

    if (couponGrants.length > 0) {
      const { error: grantsError } = await supabase
        .from('coupon_grants')
        .insert(couponGrants);

      if (grantsError) throw grantsError;
    }

    return true;
  } catch (error) {
    console.error('Error granting book and coupons:', error);
    throw error;
  }
}

/**
 * Track referral conversion
 */
async function trackReferralConversion({ ref_code, book_id, amount_cents }: {
  ref_code: string;
  book_id: string;
  amount_cents: number;
}) {
  try {
    // 1. Find the referral
    const { data: referral, error: referralError } = await supabase
      .from('referral_tracking')
      .select('*')
      .eq('ref_code', ref_code)
      .single();

    if (referralError || !referral) {
      console.warn('Referral not found for code:', ref_code);
      return;
    }

    // 2. Update referral with conversion
    const { error: updateError } = await supabase
      .from('referral_tracking')
      .update({
        converted: true,
        converted_at: new Date().toISOString(),
        conversion_amount_cents: amount_cents
      })
      .eq('ref_code', ref_code);

    if (updateError) throw updateError;

    // 3. Award points to referrer (if they exist)
    if (referral.referrer_id) {
      const { error: pointsError } = await supabase.rpc('award_referral_points', {
        p_user_id: referral.referrer_id,
        p_amount_cents: amount_cents,
        p_book_id: book_id
      });

      if (pointsError) {
        console.error('Error awarding referral points:', pointsError);
      }
    }

    return true;
  } catch (error) {
    console.error('Error tracking referral conversion:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Get payment link URL for a book
 */
export async function getPaymentLinkUrl(bookId: string) {
  try {
    const { data: book, error } = await supabase
      .from('coupon_books')
      .select('stripe_payment_link_url')
      .eq('id', bookId)
      .single();

    if (error || !book) {
      throw new Error('Book not found');
    }

    return book.stripe_payment_link_url;
  } catch (error) {
    console.error('Error getting payment link URL:', error);
    throw error;
  }
}

/**
 * Get Stripe dashboard URL for a book
 */
export async function getStripeDashboardUrl(bookId: string) {
  try {
    const { data: book, error } = await supabase
      .from('coupon_books')
      .select('stripe_product_id')
      .eq('id', bookId)
      .single();

    if (error || !book?.stripe_product_id) {
      throw new Error('Book not found or not configured for Stripe');
    }

    return `https://dashboard.stripe.com/products/${book.stripe_product_id}`;
  } catch (error) {
    console.error('Error getting Stripe dashboard URL:', error);
    throw error;
  }
}
