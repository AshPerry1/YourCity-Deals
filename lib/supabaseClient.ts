import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a mock client for development when environment variables are missing
const createMockClient = () => {
  // Create a promise-like object that resolves to empty data
  const createMockPromise = () => Promise.resolve({ data: [], error: null, count: 0 });
  
  const mockQueryBuilder: any = new Proxy({}, {
    get: (target, prop) => {
      // Special methods that should return promises
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        const promise = createMockPromise();
        const method = promise[prop as keyof Promise<any>];
        if (typeof method === 'function') {
          return method.bind(promise);
        }
        return method;
      }
      
      // Methods that should return promises directly
      if (prop === 'single' || prop === 'maybeSingle') {
        return () => Promise.resolve({ data: null, error: null });
      }
      
      // All other methods return the builder for chaining
      return () => mockQueryBuilder;
    }
  });

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => mockQueryBuilder,
    rpc: () => Promise.resolve({ data: null, error: null }),
    channel: () => {
      const mockChannel: any = {
        on: () => mockChannel,
        subscribe: () => ({ unsubscribe: () => {} }),
      };
      return mockChannel;
    },
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
