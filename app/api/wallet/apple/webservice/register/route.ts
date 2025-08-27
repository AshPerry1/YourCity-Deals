import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber, pushToken, authenticationToken } = await request.json();

    if (!deviceLibraryIdentifier || !passTypeIdentifier || !serialNumber) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify the pass type identifier matches our configuration
    if (passTypeIdentifier !== process.env.PASS_TYPE_ID) {
      return NextResponse.json({ error: 'Invalid pass type identifier' }, { status: 400 });
    }

    // Check if registration already exists
    const { data: existingRegistration } = await supabaseAdmin
      .from('apple_pass_registrations')
      .select('*')
      .eq('device_library_identifier', deviceLibraryIdentifier)
      .eq('pass_type_identifier', passTypeIdentifier)
      .eq('serial_number', serialNumber)
      .single();

    if (existingRegistration) {
      // Update existing registration
      await supabaseAdmin
        .from('apple_pass_registrations')
        .update({
          push_token: pushToken,
          authentication_token: authenticationToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRegistration.id);

      return NextResponse.json({ status: 'updated' });
    } else {
      // Create new registration
      await supabaseAdmin
        .from('apple_pass_registrations')
        .insert({
          device_library_identifier: deviceLibraryIdentifier,
          pass_type_identifier: passTypeIdentifier,
          serial_number: serialNumber,
          push_token: pushToken,
          authentication_token: authenticationToken
        });

      return NextResponse.json({ status: 'created' });
    }

  } catch (error: any) {
    console.error('Apple PassKit registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
