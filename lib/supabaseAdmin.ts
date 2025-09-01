import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Lazy initialization of Supabase admin client
let supabaseAdmin: any = null;

function initializeSupabaseAdmin() {
  if (supabaseAdmin !== null) {
    return supabaseAdmin;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey && 
      supabaseUrl !== 'your_supabase_project_url' && 
      supabaseServiceKey !== 'your_supabase_service_role_key') {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  } else {
    supabaseAdmin = null;
  }

  return supabaseAdmin;
}

// Export a getter function instead of the client directly
export function getSupabaseAdmin() {
  return initializeSupabaseAdmin();
}

// Helper function to check if database is configured
export function isDatabaseConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}

// Helper function to return a standard "not configured" response
export function getDatabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: 'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
    { status: 503 }
  );
}
