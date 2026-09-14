import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUnitAncestors } from "@/lib/queries";
import UnitBreadcrumb from "@/components/UnitBreadcrumb";
import ProgressBar from "@/components/ProgressBar";
import FollowButton from "@/components/FollowButton";
import { formatDate, formatINR } from "@/lib/format";

export const revalidate = 120;

export default async function InitiativeDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: initiative } = await supabase
    .from("initiatives")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!initiative) notFound();

  const [{ data: unit }, { data: updates }, { data: fundsRow }] = await Promise.all([
    supabase.from("units").select("*").eq("id", initiative.unit_id).single(),
    supabase
      .from("initiative_updates")
      .select("*")
      .eq("initiative_id", initiative.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabase.from("initiative_funds_raised").select("*").eq("initiative_id", initiative.id).maybeSingle()
  ]);

  const ancestors = unit ? [...(await getUnitAncestors(supabase, unit)), unit] : [];
  const amountRaised = fundsRow?.amount_raised ?? 0;

  return (
    <div className="pb-10">
      <UnitBreadcrumb trail={ancestors} />

      <div className="surface p-6 sm:p-8 lg:p-10"><div className="flex items-center gap-2 text-xs font-semibold text-accent">
        <span className="uppercase tracking-wide">{initiative.type}</span>
        <span aria-hidden>&middot;</span>
        <span>{initiative.justice_pillar}</span>
      </div>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{initiative.title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{initiative.description ?? initiative.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>Started {formatDate(initiative.start_date)}</span>
        {initiative.end_date && <span>&middot; Ends {formatDate(initiative.end_date)}</span>}
        <span className="rounded-full bg-line px-2.5 py-0.5 text-xs capitalize text-ink">
          {initiative.status}
        </span>
      </div></div>

      {initiative.goal_amount && (
        <div className="surface mt-6 p-6 sm:p-7">
          <ProgressBar raised={amountRaised} goal={initiative.goal_amount} />
          <p className="mt-2 text-sm text-ink">
            {formatINR(amountRaised)} raised of {formatINR(initiative.goal_amount)} goal
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={`/donate/${initiative.slug}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white no-underline"
            >
              Donate
            </Link>
            <FollowButton initiativeId={initiative.id} />
          </div>
        </div>
      )}

      {!initiative.goal_amount && (
        <div className="mt-6">
          <FollowButton initiativeId={initiative.id} />
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Update feed</h2>
        {!updates || updates.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No updates posted yet.</p>
        ) : (
          <ul className="mt-4 space-y-5">
            {updates.map((update) => (
              <li key={update.id} className="border-l-2 border-accent/20 pl-5">
                <p className="text-xs text-muted">{formatDate(update.created_at)}</p>
                <p className="mt-1 font-medium text-ink">{update.title}</p>
                <p className="mt-1 text-sm text-muted">{update.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
