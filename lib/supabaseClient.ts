import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a mock client for development when environment variables are missing
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null }),
          count: 0,
        }),
        count: async () => ({ count: 0, error: null }),
      }),
      insert: (data: any) => ({
        select: async () => ({ data: null, error: null }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: async () => ({ data: null, error: null }),
        }),
      }),
      delete: () => ({
        eq: async (column: string, value: any) => ({ data: null, error: null }),
      }),
    }),
  };
};

// Check if environment variables are valid URLs (not placeholder values)
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return !url.includes('your_supabase_project_url') && !url.includes('your_supabase_anon_key');
  } catch {
    return false;
  }
};

// Use real Supabase client if environment variables are available and valid, otherwise use mock
export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Export createClient for direct use
export { createClient };

// Admin client for server-side operations
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseServiceKey !== 'your_supabase_service_role_key') 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
