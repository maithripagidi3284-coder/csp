import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getFundsRaisedMap,
  getPublishedInitiativesForUnit,
  getUnitAncestors,
  getUnitBySlug,
  getUnitChildren
} from "@/lib/queries";
import UnitBreadcrumb from "@/components/UnitBreadcrumb";
import InitiativeCard from "@/components/InitiativeCard";
import { unitLevelLabel } from "@/lib/format";

export const revalidate = 300;

export default async function UnitPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const unit = await getUnitBySlug(supabase, params.slug);
  if (!unit) notFound();

  const [ancestors, children, initiatives] = await Promise.all([
    getUnitAncestors(supabase, unit),
    getUnitChildren(supabase, unit.id),
    getPublishedInitiativesForUnit(supabase, unit.id)
  ]);

  const fundsRaised = await getFundsRaisedMap(
    supabase,
    initiatives.map((i) => i.id)
  );

  return (
    <div className="pb-10">
      <UnitBreadcrumb trail={ancestors} />

      <div className="surface overflow-hidden p-6 sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">{unitLevelLabel(unit.level)}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{unit.name}</h1>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            unit.status === "chapter" ? "bg-accent-soft text-accent" : "bg-line text-ink"
          }`}
        >
          {unit.status === "chapter" ? "Full Chapter" : "Working Group — not yet a full Chapter"}
        </span>
      </div>

      {unit.description && <p className="mt-4 max-w-2xl text-muted">{unit.description}</p>}

      {children.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            {unitLevelLabel(children[0].level)}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/units/${child.slug}`}
                className="surface surface-hover p-4 no-underline"
              >
                <p className="text-sm font-medium text-ink">{child.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {child.status === "chapter" ? "Chapter" : "Working Group"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Initiatives in {unit.name}
        </h2>
        {initiatives.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No published initiatives in this unit yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                initiative={initiative}
                amountRaised={fundsRaised[initiative.id]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
