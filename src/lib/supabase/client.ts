import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase client — uses the anon key. Safe to call from
 * client components. RLS enforces what it can actually read.
 *
 * Deliberately untyped against the generated Database schema: this
 * project ships hand-written domain types (src/lib/types.ts) instead of
 * running `supabase gen types`, and postgrest-js's newer typed query
 * parser needs the generated shape to do that safely. Swap this for
 * `createBrowserClient<Database>(...)` once you've run codegen against
 * your linked Supabase project.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
