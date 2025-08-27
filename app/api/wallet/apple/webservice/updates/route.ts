import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceLibraryIdentifier = searchParams.get('deviceLibraryIdentifier');
    const passTypeIdentifier = searchParams.get('passTypeIdentifier');
    const tag = searchParams.get('tag') || '';

    if (!deviceLibraryIdentifier || !passTypeIdentifier) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify the pass type identifier matches our configuration
    if (passTypeIdentifier !== process.env.PASS_TYPE_ID) {
      return NextResponse.json({ error: 'Invalid pass type identifier' }, { status: 400 });
    }

    // Get registrations for this device
    const { data: registrations } = await supabaseAdmin
      .from('apple_pass_registrations')
      .select('serial_number')
      .eq('device_library_identifier', deviceLibraryIdentifier)
      .eq('pass_type_identifier', passTypeIdentifier);

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ serials: [] });
    }

    // Get serial numbers that need updates
    const serialNumbers = registrations.map(reg => reg.serial_number);

    // For now, return all serial numbers (in a real implementation, you'd check for actual updates)
    // This is a simplified version - you might want to implement a more sophisticated update tracking system
    return NextResponse.json({ 
      serials: serialNumbers,
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Apple PassKit updates error:', error);
    return NextResponse.json({ error: 'Failed to get updates' }, { status: 500 });
  }
}
