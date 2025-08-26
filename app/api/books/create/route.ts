import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      school_id, 
      organizer_type, 
      organizer_name, 
      organizer_external_id,
      price_cents, 
      theme_primary,
      theme_secondary,
      referrals_enabled,
      status, 
      start_date, 
      end_date, 
      cover_image_url 
    } = body;

    // Validate required fields
    if (!title || !organizer_type || !organizer_name || !price_cents) {
      return NextResponse.json({ error: 'Missing required fields: title, organizer_type, organizer_name, price_cents' }, { status: 400 });
    }

    // Validate school_id is required when organizer_type is 'school'
    if (organizer_type === 'school' && !school_id) {
      return NextResponse.json({ error: 'school_id is required when organizer_type is school' }, { status: 400 });
    }

    // Convert price to cents
    const priceCents = Math.round(parseFloat(price_cents) * 100);
    
    if (priceCents <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    }

    // Create Stripe Product
    const product = await stripe.products.create({
      name: title,
      description: description || `Digital coupon book for local savings - ${organizer_name}`,
      metadata: {
        type: 'coupon_book',
        organizer_type: organizer_type,
        organizer_name: organizer_name,
        school_id: school_id || '',
        organizer_external_id: organizer_external_id || ''
      }
    });

    // Create Stripe Price
    const price = await stripe.prices.create({
      unit_amount: priceCents,
      currency: 'usd',
      product: product.id,
      metadata: {
        book_title: title,
        organizer_type: organizer_type,
        organizer_name: organizer_name,
        school_id: school_id || ''
      }
    });

    // Create Payment Link (optional - you can create this later if needed)
    let paymentLink = null;
    try {
      paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        payment_intent_data: {
          metadata: {
            book_title: title,
            organizer_type: organizer_type,
            organizer_name: organizer_name,
            school_id: school_id || ''
          }
        },
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?book_id={CHECKOUT_SESSION_ID}`
          }
        }
      });
    } catch (error) {
      console.warn('Failed to create payment link:', error);
      // Continue without payment link - it can be created later
    }

    // Insert book into database
    const { data: book, error } = await supabaseAdmin
      .from('coupon_books')
      .insert({
        title,
        description,
        school_id: organizer_type === 'school' ? school_id : null,
        organizer_type,
        organizer_name,
        organizer_external_id: organizer_external_id || null,
        price_cents: priceCents,
        theme_primary: theme_primary || '#3B82F6',
        theme_secondary: theme_secondary || '#1E40AF',
        referrals_enabled: referrals_enabled || false,
        status,
        start_date: start_date || null,
        end_date: end_date || null,
        cover_image_url: cover_image_url || null,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        stripe_payment_link_id: paymentLink?.id || null,
        stripe_payment_link_url: paymentLink?.url || null,
      })
      .select()
      .single();

    if (error) {
      // Clean up Stripe objects if database insert fails
      try {
        await stripe.prices.update(price.id, { active: false });
        await stripe.products.update(product.id, { active: false });
        if (paymentLink) {
          await stripe.paymentLinks.update(paymentLink.id, { active: false });
        }
      } catch (cleanupError) {
        console.error('Failed to cleanup Stripe objects:', cleanupError);
      }
      
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      book,
      stripe: {
        product_id: product.id,
        price_id: price.id,
        payment_link_id: paymentLink?.id,
        payment_link_url: paymentLink?.url
      }
    });

  } catch (error: any) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
