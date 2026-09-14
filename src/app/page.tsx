import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getFundsRaisedMap, getUnitBySlug, getUnitChildren } from "@/lib/queries";
import InitiativeCard from "@/components/InitiativeCard";
export const revalidate = 300;
export default async function HomePage() {
  const supabase = createClient();
  const national = await getUnitBySlug(supabase, "national");
  const states = national ? await getUnitChildren(supabase, national.id) : [];
  const { data: recentInitiatives } = await supabase.from("initiatives").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6);
  const fundsRaised = await getFundsRaisedMap(supabase, (recentInitiatives ?? []).map(i => i.id));
  return <div className="space-y-20 pb-8">
    <section className="relative overflow-hidden rounded-3xl bg-accent px-6 py-14 text-white shadow-xl shadow-accent/10 sm:px-10 lg:px-14 lg:py-20">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"/><div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-200/10 blur-3xl"/>
      <div className="relative max-w-3xl"><span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">PUBLIC BY DEFAULT</span><h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">See the work. Follow the progress. Support what matters.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">Explore civic units, discover initiatives, and understand where funds go — from the national level down to individual local work.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/units/national" className="btn-primary bg-white text-accent hover:bg-white">Explore units →</Link><Link href="/initiatives" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">Browse initiatives</Link></div></div>
    </section>
    <section><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Explore by geography</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Units across the movement</h2><p className="mt-1 text-sm text-muted">Start at national level and drill down into local chapters.</p></div><Link href="/units/national" className="hidden text-sm font-semibold text-accent no-underline sm:block">View national →</Link></div>
      {states.length > 0 ? <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{states.map(state => <Link key={state.id} href={`/units/${state.slug}`} className="surface surface-hover group p-5 no-underline"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-sm font-bold text-accent">{state.name.slice(0,2).toUpperCase()}</span><span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-accent">→</span></div><p className="mt-5 font-bold">{state.name}</p><p className="mt-1 text-xs text-muted">{state.status === "chapter" ? "Full chapter" : "Working group"}</p></Link>)}</div> : <div className="surface mt-7 p-6 text-sm text-muted">No units published yet.</div>}
    </section>
    {recentInitiatives && recentInitiatives.length > 0 && <section><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Latest work</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Recent initiatives</h2></div><Link href="/initiatives" className="text-sm font-semibold text-accent no-underline">See all →</Link></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recentInitiatives.map(i => <InitiativeCard key={i.id} initiative={i} amountRaised={fundsRaised[i.id]}/>)}</div></section>}
    <section className="surface overflow-hidden bg-slate-50"><div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center"><div><p className="eyebrow">Transparency first</p><h2 className="mt-2 text-2xl font-bold">Every update should be easy to follow.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Browse published financial reports and initiative updates without needing an account. Donor accounts are only needed when you choose to contribute or follow an initiative.</p></div><Link href="/reports" className="btn-primary">Read reports →</Link></div></section>
  </div>;
}
