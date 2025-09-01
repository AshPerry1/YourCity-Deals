import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getDatabaseNotConfiguredResponse } from '@/lib/supabaseAdmin';
import { OnboardingState } from '@/lib/tutorials';

// GET - Retrieve user's tutorial completion status
export async function GET(request: Request) {
  try {
    // Check if database is configured
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return getDatabaseNotConfiguredResponse();
    }

    // Get the current user from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract user ID from the auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user's onboarding state
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('onboarding_state')
      .eq('id', user.id)
      .single();

    if (error) {
      // If no profile exists, return empty state
      if (error.code === 'PGRST116') {
        return NextResponse.json({});
      }
      throw error;
    }

    // Return the onboarding state or empty object
    const onboardingState: OnboardingState = profile?.onboarding_state || {};
    
    return NextResponse.json(onboardingState);

  } catch (error: any) {
    console.error('Error fetching tutorial status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
