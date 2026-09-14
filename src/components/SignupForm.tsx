"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } =
      mode === "email"
        ? await supabase.auth.signInWithOtp({
            email: value,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` }
          })
        : await supabase.auth.signInWithOtp({ phone: value });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "phone") {
      router.push(`/signup/verify?phone=${encodeURIComponent(value)}&next=${next}`);
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up to donate</h1>
      <p className="mt-2 text-sm text-muted">
        Just an email or phone number — this is a lightweight donor profile, not JMI membership.
      </p>

      {sent ? (
        <div className="mt-8 rounded-lg border border-line p-5">
          <p className="text-sm text-ink">
            {mode === "email"
              ? "Check your email for a sign-in link."
              : "Check your phone for a one-time code."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`rounded-md border px-3 py-1.5 ${
                mode === "email" ? "border-accent bg-accent-soft text-accent" : "border-line text-muted"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`rounded-md border px-3 py-1.5 ${
                mode === "phone" ? "border-accent bg-accent-soft text-accent" : "border-line text-muted"
              }`}
            >
              Phone
            </button>
          </div>

          <input
            required
            type={mode === "email" ? "email" : "tel"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === "email" ? "you@example.com" : "+91 90000 00000"}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : mode === "email" ? "Send sign-in link" : "Send code"}
          </button>
        </form>
      )}
    </div>
  );
}

export default SignupForm;
