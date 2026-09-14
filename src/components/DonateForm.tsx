"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PRESETS = [500, 1000, 2500, 5000];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonateForm({
  initiativeId,
  initiativeSlug
}: {
  initiativeId: string;
  initiativeSlug: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [amount, setAmount] = useState<number>(PRESETS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      setCheckingAuth(false);
    });
  }, [supabase]);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handleDonate() {
    setError(null);

    if (!effectiveAmount || effectiveAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Could not load the payment provider. Check your connection and try again.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/donations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initiativeId, amount: effectiveAmount })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not start the payment. Please try again.");
      setLoading(false);
      return;
    }

    const { orderId, amount: amountPaise, currency, keyId } = await res.json();

    const razorpay = new window.Razorpay({
      key: keyId,
      order_id: orderId,
      amount: amountPaise,
      currency,
      name: "Citizens' Sabha Platform",
      description: "One-time donation",
      handler: () => {
        // The order is confirmed server-side by the Razorpay webhook, not here.
        // This just gives the donor immediate feedback and sends them to a
        // status page that reflects the real, verified state.
        router.push(`/donate/${initiativeSlug}/thank-you`);
      },
      modal: {
        ondismiss: () => setLoading(false)
      },
      theme: { color: "#1F5D4C" }
    });

    razorpay.open();
    setLoading(false);
  }

  if (checkingAuth) return null;

  if (!signedIn) {
    return (
      <div className="rounded-lg border border-line p-5 text-sm">
        <p className="text-muted">Sign up first — it only takes an email or phone number.</p>
        <a
          href={`/signup?next=/donate/${initiativeSlug}`}
          className="mt-3 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white no-underline"
        >
          Continue to sign up
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setAmount(preset);
              setCustomAmount("");
            }}
            className={`rounded-md border px-2 py-2 text-sm ${
              !customAmount && amount === preset
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-ink"
            }`}
          >
            ₹{preset}
          </button>
        ))}
      </div>

      <input
        type="number"
        min={1}
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        placeholder="Or enter a custom amount (₹)"
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Starting payment…" : `Donate ₹${effectiveAmount || 0}`}
      </button>
    </div>
  );
}
