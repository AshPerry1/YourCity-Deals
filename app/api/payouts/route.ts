import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  Payout, 
  PayoutReceipt,
  generatePayoutReference,
  calculateSchoolPayout,
  validatePayoutData,
  generatePayoutReceipt,
  generatePayoutEmailTemplate
} from '@/lib/payouts';
import { generatePayoutEvent } from '@/lib/accounting';

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Retrieve payouts with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const schoolId = searchParams.get('school_id');
    const dateRange = searchParams.get('date_range');

    let query = supabaseAdmin
      .from('payouts')
      .select(`
        *,
        schools (
          id,
          name,
          address,
          contact_email,
          contact_phone
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (schoolId && schoolId !== 'all') {
      query = query.eq('school_id', schoolId);
    }

    if (dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '6months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      query = query.gte('created_at', startDate.toISOString());
    }

    const { data: payouts, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch payouts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ payouts });

  } catch (error: any) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new payout
export async function POST(request: Request) {
  try {
    const payoutData = await request.json();

    // Validate payout data
    const validation = validatePayoutData(payoutData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid payout data', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate reference number if not provided
    if (!payoutData.reference_number) {
      payoutData.reference_number = generatePayoutReference();
    }

    // Calculate payout amounts
    const payoutCalculation = calculateSchoolPayout(
      payoutData.gross_sales_cents,
      payoutData.points_rate || 0.5,
      payoutData.fee_cents || 0
    );

    const payout: Partial<Payout> = {
      school_id: payoutData.school_id,
      school_name: payoutData.school_name,
      amount_cents: payoutCalculation.netPayoutCents,
      payout_date: new Date(payoutData.payout_date),
      payment_method: payoutData.payment_method,
      reference_number: payoutData.reference_number,
      status: 'pending',
      description: payoutData.description,
      period_start: new Date(payoutData.period_start),
      period_end: new Date(payoutData.period_end),
      sales_count: payoutData.sales_count,
      gross_sales_cents: payoutData.gross_sales_cents,
      net_payout_cents: payoutCalculation.netPayoutCents,
      fee_cents: payoutCalculation.feeCents,
      created_by: payoutData.created_by,
      created_at: new Date(),
    };

    // Insert payout record
    const { data: newPayout, error: insertError } = await supabaseAdmin
      .from('payouts')
      .insert(payout)
      .select()
      .single();

    if (insertError || !newPayout) {
      return NextResponse.json(
        { error: 'Failed to create payout' },
        { status: 500 }
      );
    }

    // Record accounting event
    try {
      const accountingEvent = generatePayoutEvent(
        newPayout.id,
        newPayout.amount_cents,
        payoutData.school_id,
        payoutData.created_by
      );

      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/accounting/record-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          eventType: 'payout_issued',
          payload: {
            payoutId: newPayout.id,
            payoutAmountCents: newPayout.amount_cents,
            schoolId: payoutData.school_id,
            createdBy: payoutData.created_by,
          },
        }),
      });
    } catch (accountingError) {
      console.error('Error recording accounting event:', accountingError);
      // Don't fail the payout creation if accounting fails
    }

    return NextResponse.json({
      success: true,
      payout: newPayout,
      message: 'Payout created successfully',
    });

  } catch (error: any) {
    console.error('Error creating payout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update payout status
export async function PUT(request: Request) {
  try {
    const { payoutId, status, notes } = await request.json();

    if (!payoutId || !status) {
      return NextResponse.json(
        { error: 'Payout ID and status are required' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { data: updatedPayout, error } = await supabaseAdmin
      .from('payouts')
      .update(updateData)
      .eq('id', payoutId)
      .select()
      .single();

    if (error || !updatedPayout) {
      return NextResponse.json(
        { error: 'Failed to update payout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payout: updatedPayout,
      message: 'Payout updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating payout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
