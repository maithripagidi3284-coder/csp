import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { formatINR } from "@/lib/format";
import type { Initiative } from "@/lib/types";
const STATUS_LABEL: Record<string,string> = { planned:"Planned", active:"Active", completed:"Completed", archived:"Archived" };
export default function InitiativeCard({ initiative, amountRaised }: { initiative: Initiative; amountRaised?: number }) {
  return <Link href={`/initiatives/${initiative.slug}`} className="surface surface-hover block p-5 no-underline">
    <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">{STATUS_LABEL[initiative.status]}</span><span className="text-xs font-medium text-muted">{initiative.type}</span></div>
    <h3 className="mt-4 text-lg font-bold leading-snug text-ink">{initiative.title}</h3>
    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{initiative.summary}</p>
    <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-muted"><span>{initiative.justice_pillar}</span><span>•</span><span>View details →</span></div>
    {initiative.goal_amount ? <div className="mt-5 border-t border-line pt-4"><ProgressBar raised={amountRaised ?? 0} goal={initiative.goal_amount}/><p className="mt-1 text-xs text-muted">{formatINR(amountRaised ?? 0)} raised of {formatINR(initiative.goal_amount)}</p></div> : null}
  </Link>;
}
