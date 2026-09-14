"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function VerifyPhoneForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const next = searchParams.get("next") ?? "/dashboard";

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      await supabase
        .from("donors")
        .upsert({ id: data.user.id, phone: data.user.phone ?? phone }, { onConflict: "id", ignoreDuplicates: true });
    }

    router.push(next);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Enter the code</h1>
      <p className="mt-2 text-sm text-muted">We sent a one-time code to {phone || "your phone"}.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          inputMode="numeric"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="6-digit code"
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>
    </div>
  );
}

export default VerifyPhoneForm;
