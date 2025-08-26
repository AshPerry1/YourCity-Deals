import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  AccountingEvent, 
  validateJournalEntry, 
  ACCOUNT_CODES,
  generatePurchaseEvent,
  generateRefundEvent,
  generateDiscountEvent,
  generatePayoutEvent
} from '@/lib/accounting';

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { eventType, payload } = await request.json();

    // Validate required fields
    if (!eventType || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType and payload' },
        { status: 400 }
      );
    }

    let accountingEvent: AccountingEvent;

    // Generate appropriate accounting event based on type
    switch (eventType) {
      case 'purchase_successful':
        accountingEvent = generatePurchaseEvent(
          payload.purchaseId,
          payload.grossAmountCents,
          payload.stripeFeeCents,
          payload.discountCents || 0,
          payload.createdBy
        );
        break;

      case 'refund_processed':
        accountingEvent = generateRefundEvent(
          payload.refundId,
          payload.refundAmountCents,
          payload.stripeFeeRefundCents || 0,
          payload.createdBy
        );
        break;

      case 'discount_applied':
        accountingEvent = generateDiscountEvent(
          payload.discountId,
          payload.discountAmountCents,
          payload.createdBy
        );
        break;

      case 'payout_issued':
        accountingEvent = generatePayoutEvent(
          payload.payoutId,
          payload.payoutAmountCents,
          payload.schoolId,
          payload.createdBy
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported event type: ${eventType}` },
          { status: 400 }
        );
    }

    // Validate that debits equal credits
    const validation = validateJournalEntry(accountingEvent.lines);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get account IDs from codes
    const accountCodes = accountingEvent.lines.map(line => line.account_code);
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('id, code')
      .in('code', accountCodes);

    if (accountsError || !accounts) {
      return NextResponse.json(
        { error: 'Failed to fetch accounts' },
        { status: 500 }
      );
    }

    const accountMap = new Map(accounts.map(acc => [acc.code, acc.id]));

    // Calculate totals for journal entry
    const totalDebits = accountingEvent.lines
      .filter(line => line.side === 'debit')
      .reduce((sum, line) => sum + line.amount_cents, 0);

    const totalCredits = accountingEvent.lines
      .filter(line => line.side === 'credit')
      .reduce((sum, line) => sum + line.amount_cents, 0);

    // Insert journal entry
    const { data: journalEntry, error: entryError } = await supabaseAdmin
      .from('journal_entries')
      .insert({
        occurred_at: accountingEvent.occurred_at.toISOString(),
        description: accountingEvent.description,
        source_type: accountingEvent.type,
        source_id: accountingEvent.source_id,
        created_by: accountingEvent.created_by,
        total_debits_cents: totalDebits,
        total_credits_cents: totalCredits,
      })
      .select()
      .single();

    if (entryError || !journalEntry) {
      return NextResponse.json(
        { error: 'Failed to create journal entry' },
        { status: 500 }
      );
    }

    // Insert journal lines
    const journalLines = accountingEvent.lines.map(line => ({
      entry_id: journalEntry.id,
      account_id: accountMap.get(line.account_code),
      amount_cents: line.amount_cents,
      side: line.side,
    }));

    const { error: linesError } = await supabaseAdmin
      .from('journal_lines')
      .insert(journalLines);

    if (linesError) {
      // Rollback journal entry if lines fail
      await supabaseAdmin
        .from('journal_entries')
        .delete()
        .eq('id', journalEntry.id);

      return NextResponse.json(
        { error: 'Failed to create journal lines' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      journal_entry_id: journalEntry.id,
      message: 'Accounting event recorded successfully',
    });

  } catch (error: any) {
    console.error('Error recording accounting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example usage endpoints for testing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'test-purchase') {
    // Test purchase event
    const testEvent = generatePurchaseEvent(
      'test-purchase-123',
      5000, // $50.00
      150,  // $1.50 Stripe fee
      500,  // $5.00 discount
      'test-admin'
    );

    return NextResponse.json({
      test_event: testEvent,
      validation: validateJournalEntry(testEvent.lines),
    });
  }

  if (action === 'test-refund') {
    // Test refund event
    const testEvent = generateRefundEvent(
      'test-refund-123',
      2500, // $25.00 refund
      75,   // $0.75 fee refund
      'test-admin'
    );

    return NextResponse.json({
      test_event: testEvent,
      validation: validateJournalEntry(testEvent.lines),
    });
  }

  return NextResponse.json({
    message: 'Accounting API - Use POST to record events',
    supported_events: [
      'purchase_successful',
      'refund_processed', 
      'discount_applied',
      'payout_issued'
    ],
  });
}
