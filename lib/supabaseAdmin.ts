import { createClient } from '@supabase/supabase-js';

// Safely create Supabase admin client only if environment variables are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseServiceKey !== 'your_supabase_service_role_key') 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Helper function to check if database is configured
export function isDatabaseConfigured(): boolean {
  return supabaseAdmin !== null;
}

// Helper function to return a standard "not configured" response
export function getDatabaseNotConfiguredResponse() {
  return new Response(
    JSON.stringify({ error: 'Database not configured' }), 
    { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
