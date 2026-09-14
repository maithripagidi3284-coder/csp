import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatINR } from "@/lib/format";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/signup?next=/dashboard");

  const [{ data: donations }, { data: follows }] = await Promise.all([
    supabase
      .from("donations")
      .select("*, initiatives(title, slug)")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("initiative_follows")
      .select("*, initiatives(title, slug, status)")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false })
  ]);

  const STATUS_LABEL: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded"
  };

  return (
    <div className="pb-10">
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your dashboard</h1>
          <p className="mt-1 text-sm text-muted">{user.email ?? user.phone}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Donation history</h2>
        {!donations || donations.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No donations yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-line border-y border-line">
            {donations.map((donation) => {
              const initiative = donation.initiatives as unknown as { title: string; slug: string } | null;
              return (
                <div key={donation.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 transition hover:bg-slate-50">
                  <div>
                    <Link
                      href={initiative ? `/initiatives/${initiative.slug}` : "#"}
                      className="text-sm font-medium text-ink no-underline hover:text-accent"
                    >
                      {initiative?.title ?? "Initiative"}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{formatDate(donation.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{formatINR(donation.amount)}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        donation.status === "paid"
                          ? "bg-accent-soft text-accent"
                          : donation.status === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-line text-ink"
                      }`}
                    >
                      {STATUS_LABEL[donation.status]}
                    </span>
                    {donation.status === "paid" && (
                      <a
                        href={`/api/receipts/${donation.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent"
                      >
                        Receipt
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Following</h2>
        {!follows || follows.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            You&rsquo;re not following any initiatives yet — follow one to get update notifications
            without donating again.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {follows.map((follow) => {
              const initiative = follow.initiatives as unknown as {
                title: string;
                slug: string;
                status: string;
              } | null;
              if (!initiative) return null;
              return (
                <li key={follow.id}>
                  <Link href={`/initiatives/${initiative.slug}`} className="text-sm text-accent no-underline">
                    {initiative.title}
                  </Link>
                  <span className="ml-2 text-xs capitalize text-muted">{initiative.status}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
