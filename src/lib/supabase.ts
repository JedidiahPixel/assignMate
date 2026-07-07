import { createClient } from '@supabase/supabase-js';

// These are read from environment variables at build time.
// Copy .env.example to .env and fill in your Supabase project credentials.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in development so misconfiguration is obvious,
  // rather than silently breaking auth requests later.
  console.warn(
    '[AssignMate] Missing Supabase environment variables. ' +
      'Copy .env.example to .env and add your project URL + anon key.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
