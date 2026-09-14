export default function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return <div><div className="h-2 overflow-hidden rounded-full bg-accent-soft"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div><p className="mt-2 text-xs font-medium text-muted">{pct}% funded</p></div>;
}
