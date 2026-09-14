import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DonateForm from "@/components/DonateForm";

export default async function DonatePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: initiative } = await supabase
    .from("initiatives")
    .select("id, title, slug, goal_amount")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!initiative) notFound();

  return (
    <div className="mx-auto max-w-lg pb-10">
      <p className="eyebrow">Donating to</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{initiative.title}</h1>
      <p className="mt-2 text-sm text-muted">
        A one-time payment. You&rsquo;ll get an emailed receipt the moment it&rsquo;s confirmed.
      </p>

      <div className="surface mt-8 p-6 sm:p-8">
        <DonateForm initiativeId={initiative.id} initiativeSlug={initiative.slug} />
      </div>
    </div>
  );
}
