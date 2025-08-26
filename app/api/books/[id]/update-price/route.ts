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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookId } = await params;
    const body = await request.json();
    const { price_cents } = body;

    // Validate input
    if (!price_cents) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }

    const newPriceCents = Math.round(parseFloat(price_cents) * 100);
    
    if (newPriceCents <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    }

    // Get current book data
    const { data: book, error: fetchError } = await supabaseAdmin
      .from('coupon_books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (fetchError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const oldPriceCents = book.price_cents;
    
    // If price hasn't changed, return early
    if (newPriceCents === oldPriceCents) {
      return NextResponse.json({ 
        success: true, 
        message: 'Price unchanged',
        book 
      });
    }

    // Log the price change
    const { error: logError } = await supabaseAdmin
      .from('book_price_changes')
      .insert({
        book_id: bookId,
        from_cents: oldPriceCents,
        to_cents: newPriceCents,
        changed_by: (await supabaseAdmin.auth.getUser()).data.user?.id,
      });

    if (logError) {
      console.error('Error logging price change:', logError);
    }

    // Create new Stripe Price (prices are immutable)
    let newPrice = null;
    let newPaymentLink = null;

    if (book.stripe_product_id) {
      try {
        newPrice = await stripe.prices.create({
          unit_amount: newPriceCents,
          currency: 'usd',
          product: book.stripe_product_id,
          metadata: {
            book_title: book.title,
            organizer_type: book.organizer_type || 'school',
            organizer_name: book.organizer_name || '',
            school_id: book.school_id || '',
            updated_at: new Date().toISOString()
          }
        });

        // Create new payment link if the book had one
        if (book.stripe_payment_link_id) {
          try {
            newPaymentLink = await stripe.paymentLinks.create({
              line_items: [{ price: newPrice.id, quantity: 1 }],
              payment_intent_data: {
                metadata: {
                  book_title: book.title,
                  organizer_type: book.organizer_type || 'school',
                  organizer_name: book.organizer_name || '',
                  school_id: book.school_id || ''
                }
              },
              after_completion: {
                type: 'redirect',
                redirect: {
                  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?book_id=${bookId}`
                }
              }
            });
          } catch (linkError) {
            console.warn('Failed to create new payment link:', linkError);
          }
        }
      } catch (stripeError) {
        console.error('Error creating new Stripe price:', stripeError);
        return NextResponse.json({ error: 'Failed to update Stripe price' }, { status: 500 });
      }
    }

    // Update book in database
    const updateData: any = {
      price_cents: newPriceCents,
    };

    if (newPrice) {
      updateData.stripe_price_id = newPrice.id;
    }

    if (newPaymentLink) {
      updateData.stripe_payment_link_id = newPaymentLink.id;
      updateData.stripe_payment_link_url = newPaymentLink.url;
    }

    const { data: updatedBook, error: updateError } = await supabaseAdmin
      .from('coupon_books')
      .update(updateData)
      .eq('id', bookId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ 
      success: true, 
      book: updatedBook,
      price_change: {
        from: oldPriceCents / 100,
        to: newPriceCents / 100,
        difference: (newPriceCents - oldPriceCents) / 100
      },
      stripe: {
        new_price_id: newPrice?.id,
        new_payment_link_id: newPaymentLink?.id,
        new_payment_link_url: newPaymentLink?.url
      }
    });

  } catch (error: any) {
    console.error('Error updating book price:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
