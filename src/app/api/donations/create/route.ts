import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { initiativeId, amount } = await request.json();

  if (!initiativeId || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "A valid initiativeId and amount are required." }, { status: 400 });
  }

  // Identify the donor from their session cookie — never trust a donor id
  // sent in the request body.
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();

  // Make sure the donor row exists (idempotent).
  await admin
    .from("donors")
    .upsert({ id: user.id, email: user.email ?? null, phone: user.phone ?? null }, { onConflict: "id" });

  // Confirm the initiative is real and published before taking money for it.
  const { data: initiative } = await admin
    .from("initiatives")
    .select("id, is_published")
    .eq("id", initiativeId)
    .eq("is_published", true)
    .maybeSingle();

  if (!initiative) {
    return NextResponse.json({ error: "Initiative not found." }, { status: 404 });
  }

  const amountPaise = Math.round(amount * 100);

  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    notes: { initiativeId, donorId: user.id }
  });

  const { error: insertError } = await admin.from("donations").insert({
    donor_id: user.id,
    initiative_id: initiativeId,
    amount,
    currency: "INR",
    status: "pending",
    razorpay_order_id: order.id
  });

  if (insertError) {
    return NextResponse.json({ error: "Could not record the donation." }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  });
}
