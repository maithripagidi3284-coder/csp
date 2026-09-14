import "server-only";
import Razorpay from "razorpay";
import crypto from "node:crypto";

export function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  });
}

/** Verifies the `X-Razorpay-Signature` header against the raw webhook body. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  // Constant-time compare — signatures must be equal length for timingSafeEqual.
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function generateReceiptNumber(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `CSP-${stamp}-${random}`;
}
