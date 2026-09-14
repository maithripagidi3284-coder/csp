import { createClient } from "@/lib/supabase/server";
import { getFundsRaisedMap } from "@/lib/queries";
import InitiativeCard from "@/components/InitiativeCard";
import Filters from "@/components/Filters";
export const revalidate = 300;
const STATUSES=["planned","active","completed","archived"];
export default async function InitiativesPage({searchParams}:{searchParams:{type?:string;pillar?:string;status?:string}}){
 const supabase=createClient(); let query=supabase.from("initiatives").select("*").eq("is_published",true); if(searchParams.type)query=query.eq("type",searchParams.type); if(searchParams.pillar)query=query.eq("justice_pillar",searchParams.pillar); if(searchParams.status)query=query.eq("status",searchParams.status); const {data:initiatives}=await query.order("created_at",{ascending:false}); const {data:pillarRows}=await supabase.from("initiatives").select("justice_pillar").eq("is_published",true); const pillars=Array.from(new Set((pillarRows??[]).map(r=>r.justice_pillar))).sort(); const fundsRaised=await getFundsRaisedMap(supabase,(initiatives??[]).map(i=>i.id));
 return <div className="pb-10"><section className="rounded-3xl bg-slate-50 p-7 sm:p-10"><p className="eyebrow">Discover the work</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Initiatives</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Projects and campaigns across every unit. Filter by type, justice pillar, or current status.</p></section><div className="mt-7"><Filters pillars={pillars} statuses={STATUSES}/></div>{!initiatives||initiatives.length===0?<div className="surface mt-8 p-8 text-center"><p className="font-semibold">No initiatives match these filters.</p><p className="mt-1 text-sm text-muted">Try clearing one or more filters.</p></div>:<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{initiatives.map(i=><InitiativeCard key={i.id} initiative={i} amountRaised={fundsRaised[i.id]}/>)}</div>}</div>;
}
