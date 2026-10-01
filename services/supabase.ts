/**
 * Supabase client configuration.
 * Only the URL and anon key are public (EXPO_PUBLIC_).
 * NEVER add GEMINI_API_KEY or any other secret as an EXPO_PUBLIC_ variable.
 */

// TODO Phase 1: Install @supabase/supabase-js, configure with EU project URL and anon key
// import { createClient } from '@supabase/supabase-js';
// import type { Database } from './database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase URL or Anon Key is missing. Copy .env.example to .env and fill in the values.'
  );
}

// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export { SUPABASE_URL, SUPABASE_ANON_KEY };
