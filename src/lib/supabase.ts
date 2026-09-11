import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/** False when .env is missing — the site still renders, forms say so politely. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // needed for the confirm-email and reset links
      },
    })
  : null;

const NOT_CONFIGURED =
  'Supabase is not configured. Copy .env.example to .env, fill in VITE_SUPABASE_URL ' +
  'and VITE_SUPABASE_ANON_KEY, then restart the dev server.';

/** Use this anywhere a missing client should surface as a readable error. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  return supabase;
}

/** Bucket that holds application CVs. Private — read through signed URLs only. */
export const CV_BUCKET = 'applications';
