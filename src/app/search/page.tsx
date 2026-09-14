import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SearchBox from "@/components/SearchBox";
import InitiativeCard from "@/components/InitiativeCard";
import { getFundsRaisedMap } from "@/lib/queries";
import { unitLevelLabel } from "@/lib/format";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const supabase = createClient();

  const [unitsResult, initiativesResult] = q
    ? await Promise.all([
        supabase.from("units").select("*").ilike("name", `%${q}%`).limit(10),
        supabase
          .from("initiatives")
          .select("*")
          .eq("is_published", true)
          .or(`title.ilike.%${q}%,summary.ilike.%${q}%,justice_pillar.ilike.%${q}%`)
          .limit(10)
      ])
    : [{ data: [] }, { data: [] }];

  const units = unitsResult.data ?? [];
  const initiatives = initiativesResult.data ?? [];
  const fundsRaised = await getFundsRaisedMap(supabase, initiatives.map((i) => i.id));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
      <div className="mt-4 max-w-md">
        <SearchBox />
      </div>

      {q && (
        <p className="mt-4 text-sm text-muted">
          Results for &ldquo;{q}&rdquo;
        </p>
      )}

      {q && units.length === 0 && initiatives.length === 0 && (
        <p className="mt-8 text-sm text-muted">No units or initiatives match that search.</p>
      )}

      {units.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Units</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {units.map((unit) => (
              <Link
                key={unit.id}
                href={`/units/${unit.slug}`}
                className="rounded-lg border border-line px-4 py-3 no-underline hover:border-accent"
              >
                <p className="text-sm font-medium text-ink">{unit.name}</p>
                <p className="mt-0.5 text-xs text-muted">{unitLevelLabel(unit.level)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {initiatives.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Initiatives</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                initiative={initiative}
                amountRaised={fundsRaised[initiative.id]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
