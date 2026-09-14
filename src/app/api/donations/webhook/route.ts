import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReceiptNumber, verifyWebhookSignature } from "@/lib/razorpay";
import { sendDonationReceipt } from "@/lib/email";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const admin = createAdminClient();

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload.payment.entity;
    const orderId: string = payment.order_id;
    const paymentId: string = payment.id;

    const { data: donation } = await admin
      .from("donations")
      .select("*")
      .eq("razorpay_order_id", orderId)
      .maybeSingle();

    // Already processed (webhooks can be delivered more than once) or unknown order.
    if (!donation || donation.status === "paid") {
      return NextResponse.json({ received: true });
    }

    const receiptNumber = generateReceiptNumber();

    await admin
      .from("donations")
      .update({
        status: "paid",
        razorpay_payment_id: paymentId,
        receipt_number: receiptNumber
      })
      .eq("id", donation.id);

    const [{ data: donor }, { data: initiative }] = await Promise.all([
      admin.from("donors").select("*").eq("id", donation.donor_id).single(),
      admin.from("initiatives").select("title").eq("id", donation.initiative_id).single()
    ]);

    if (donor?.email && initiative) {
      try {
        await sendDonationReceipt({
          to: donor.email,
          receiptNumber,
          amount: donation.amount,
          initiativeTitle: initiative.title,
          date: new Date().toISOString()
        });
        await admin
          .from("donations")
          .update({ receipt_sent_at: new Date().toISOString() })
          .eq("id", donation.id);
      } catch {
        // Payment is already marked paid regardless of email delivery —
        // the receipt can be re-sent from the donor dashboard later.
      }
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    await admin
      .from("donations")
      .update({ status: "failed" })
      .eq("razorpay_order_id", payment.order_id);
  }

  return NextResponse.json({ received: true });
}
