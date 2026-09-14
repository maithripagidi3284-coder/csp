import Link from "next/link";

export default function ThankYouPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-sm text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Payment received</h1>
      <p className="mt-3 text-muted">
        We&rsquo;re confirming it with the payment provider now — your receipt will land in your
        inbox as soon as that&rsquo;s done, usually within a minute or two.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white no-underline"
        >
          View my donations
        </Link>
        <Link
          href={`/initiatives/${params.slug}`}
          className="rounded-md border border-line px-4 py-2 text-sm font-medium no-underline hover:border-accent"
        >
          Back to initiative
        </Link>
      </div>
    </div>
  );
}
