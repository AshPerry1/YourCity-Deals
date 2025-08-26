import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  Payout, 
  PayoutReceipt,
  generatePayoutReceipt,
  generatePayoutEmailTemplate
} from '@/lib/payouts';

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Generate receipt for a payout
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payoutId = searchParams.get('payout_id');

    if (!payoutId) {
      return NextResponse.json(
        { error: 'Payout ID is required' },
        { status: 400 }
      );
    }

    // Fetch payout with school details
    const { data: payout, error } = await supabaseAdmin
      .from('payouts')
      .select(`
        *,
        schools (
          id,
          name,
          address,
          contact_email,
          contact_phone,
          principal_name
        )
      `)
      .eq('id', payoutId)
      .single();

    if (error || !payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      );
    }

    // Generate receipt
    const receipt = generatePayoutReceipt(payout);

    return NextResponse.json({
      success: true,
      receipt,
      payout,
    });

  } catch (error: any) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send receipt to school
export async function POST(request: Request) {
  try {
    const { payout_id, email_address, include_pdf } = await request.json();

    if (!payout_id) {
      return NextResponse.json(
        { error: 'Payout ID is required' },
        { status: 400 }
      );
    }

    // Fetch payout with school details
    const { data: payout, error } = await supabaseAdmin
      .from('payouts')
      .select(`
        *,
        schools (
          id,
          name,
          address,
          contact_email,
          contact_phone,
          principal_name
        )
      `)
      .eq('id', payout_id)
      .single();

    if (error || !payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      );
    }

    // Generate receipt
    const receipt = generatePayoutReceipt(payout);
    const emailTemplate = generatePayoutEmailTemplate(receipt);

    // Use the provided email address or school's contact email
    const recipientEmail = email_address || payout.schools?.contact_email;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'No email address provided or found for school' },
        { status: 400 }
      );
    }

    // In real implementation, send email using your email service
    // For demo purposes, we'll simulate the email sending
    const emailData = {
      to: recipientEmail,
      subject: emailTemplate.subject,
      text: emailTemplate.body,
      html: emailTemplate.html,
      attachments: include_pdf ? [
        {
          filename: `payout-receipt-${receipt.receipt_number}.pdf`,
          content: 'PDF_CONTENT_HERE', // Would be actual PDF content
          contentType: 'application/pdf'
        }
      ] : []
    };

    // Simulate email sending
    console.log('Sending email:', emailData);

    // Record the receipt sending in database
    const { error: recordError } = await supabaseAdmin
      .from('payout_forms')
      .insert({
        form_id: `form_${Date.now()}`,
        school_id: payout.school_id,
        payout_id: payout.id,
        form_type: 'receipt',
        generated_at: new Date().toISOString(),
        period: `${payout.period_start} - ${payout.period_end}`,
        sent_to_school: true,
        sent_date: new Date().toISOString(),
      });

    if (recordError) {
      console.error('Error recording receipt sending:', recordError);
    }

    return NextResponse.json({
      success: true,
      message: 'Receipt sent successfully',
      email_data: emailData,
      receipt: receipt,
    });

  } catch (error: any) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Mark receipt as acknowledged by school
export async function PUT(request: Request) {
  try {
    const { form_id, acknowledged } = await request.json();

    if (!form_id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      school_acknowledgment: acknowledged,
    };

    if (acknowledged) {
      updateData.acknowledgment_date = new Date().toISOString();
    }

    const { data: updatedForm, error } = await supabaseAdmin
      .from('payout_forms')
      .update(updateData)
      .eq('form_id', form_id)
      .select()
      .single();

    if (error || !updatedForm) {
      return NextResponse.json(
        { error: 'Failed to update form acknowledgment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      form: updatedForm,
      message: 'Form acknowledgment updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating form acknowledgment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
