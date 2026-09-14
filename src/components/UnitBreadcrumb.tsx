import Link from "next/link";
import type { Unit } from "@/lib/types";

export default function UnitBreadcrumb({ trail }: { trail: Unit[] }) {
  return (
    <nav aria-label="Unit path" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
      <Link href="/units/national" className="no-underline hover:text-ink">
        National
      </Link>
      {trail.map((unit) => (
        <span key={unit.id} className="flex items-center gap-1">
          <span aria-hidden>/</span>
          <Link href={`/units/${unit.slug}`} className="no-underline hover:text-ink">
            {unit.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
