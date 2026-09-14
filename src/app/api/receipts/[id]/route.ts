import { createClient } from "@/lib/supabase/server";
import { formatDate, formatINR } from "@/lib/format";
import { notFound } from "next/navigation";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) notFound();

  // RLS already scopes this to the signed-in donor's own rows; the
  // explicit .eq is defense in depth, not the only guard.
  const { data: donation } = await supabase
    .from("donations")
    .select("*, initiatives(title)")
    .eq("id", params.id)
    .eq("donor_id", user.id)
    .eq("status", "paid")
    .maybeSingle();

  if (!donation) notFound();

  const initiative = donation.initiatives as unknown as { title: string } | null;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Receipt ${donation.receipt_number}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; color: #14181F; max-width: 32rem; margin: 3rem auto; padding: 0 1.5rem; }
      h1 { font-size: 1.25rem; }
      dl { margin-top: 1.5rem; }
      dt { color: #6B7280; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.02em; margin-top: 1rem; }
      dd { margin: 0.15rem 0 0; font-size: 1rem; }
      @media print { body { margin: 1rem auto; } }
    </style>
  </head>
  <body>
    <h1>Citizens&rsquo; Sabha Platform — Donation Receipt</h1>
    <dl>
      <dt>Receipt number</dt><dd>${donation.receipt_number}</dd>
      <dt>Date</dt><dd>${formatDate(donation.created_at)}</dd>
      <dt>Initiative</dt><dd>${initiative?.title ?? ""}</dd>
      <dt>Amount</dt><dd>${formatINR(donation.amount)}</dd>
      <dt>Payment reference</dt><dd>${donation.razorpay_payment_id ?? ""}</dd>
    </dl>
  </body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
