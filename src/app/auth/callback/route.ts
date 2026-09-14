import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // First sign-in: create the lightweight donor profile row.
    // Insert is idempotent thanks to the primary key on donors.id.
    if (data.user) {
      await supabase.from("donors").upsert(
        {
          id: data.user.id,
          email: data.user.email ?? null,
          phone: data.user.phone ?? null
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
