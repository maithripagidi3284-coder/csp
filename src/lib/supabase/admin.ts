import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS entirely — this is what lets
 * donation rows be written server-side only, as the design requires.
 *
 * NEVER import this from a Client Component or expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser. It is only read here,
 * and only used from:
 *   - src/app/api/donations/create/route.ts (create the pending row)
 *   - src/app/api/donations/webhook/route.ts (mark paid/failed)
 *
 * See the note in client.ts on why this isn't typed against Database.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
