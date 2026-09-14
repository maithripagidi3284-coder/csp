import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-sm text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-muted">That unit, initiative, or page doesn&rsquo;t exist.</p>
      <Link href="/" className="mt-6 inline-block text-accent no-underline">
        Back to home
      </Link>
    </div>
  );
}
