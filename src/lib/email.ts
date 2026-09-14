import "server-only";
import { Resend } from "resend";
import { formatDate, formatINR } from "@/lib/format";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDonationReceipt(params: {
  to: string;
  receiptNumber: string;
  amount: number;
  initiativeTitle: string;
  date: string;
}) {
  const { to, receiptNumber, amount, initiativeTitle, date } = params;

  await resend.emails.send({
    from: process.env.RECEIPTS_FROM_EMAIL!,
    to,
    subject: `Receipt ${receiptNumber} — thank you for your donation`,
    html: `
      <p>Thank you for supporting <strong>${initiativeTitle}</strong>.</p>
      <p>
        Receipt number: <strong>${receiptNumber}</strong><br/>
        Amount: <strong>${formatINR(amount)}</strong><br/>
        Date: ${formatDate(date)}
      </p>
      <p>You can view your full donation history any time from your dashboard.</p>
    `
  });
}
