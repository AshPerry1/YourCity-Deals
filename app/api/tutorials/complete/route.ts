import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TutorialCompletion, OnboardingState } from '@/lib/tutorials';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Mark tutorial as completed or skipped
export async function POST(request: Request) {
  try {
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

    // Parse the request body
    const completion: TutorialCompletion = await request.json();
    
    if (!completion.console || !completion.version || !completion.completed_at) {
      return NextResponse.json(
        { error: 'Invalid completion data' },
        { status: 400 }
      );
    }

    // Fetch current onboarding state
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('onboarding_state')
      .eq('id', user.id)
      .single();

    let currentState: OnboardingState = {};
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (profile?.onboarding_state) {
      currentState = profile.onboarding_state;
    }

    // Update the state for the specific console
    currentState[completion.console] = {
      version: completion.version,
      completed_at: completion.completed_at,
      ...(completion.skipped_at && { skipped_at: completion.skipped_at })
    };

    // Upsert the updated state
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        onboarding_state: currentState,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Tutorial completion status updated',
      state: currentState
    });

  } catch (error: any) {
    console.error('Error updating tutorial completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
