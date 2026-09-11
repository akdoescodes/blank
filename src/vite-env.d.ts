/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Project URL from Supabase → Settings → API. */
  readonly VITE_SUPABASE_URL?: string;
  /** The anon/publishable key — safe in the browser, RLS is what protects the data. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
