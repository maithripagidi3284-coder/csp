import type { SupabaseClient } from "@supabase/supabase-js";
import type { Initiative, Unit } from "@/lib/types";

// See the note in src/lib/supabase/client.ts — deliberately untyped
// against the generated Database schema.
type Client = SupabaseClient;

export async function getUnitBySlug(supabase: Client, slug: string): Promise<Unit | null> {
  const { data } = await supabase.from("units").select("*").eq("slug", slug).single();
  return data as Unit | null;
}

export async function getUnitChildren(supabase: Client, unitId: string): Promise<Unit[]> {
  const { data } = await supabase.from("units").select("*").eq("parent_id", unitId).order("name");
  return (data as Unit[]) ?? [];
}

/** Walks parent_id up to the root, returning ancestors ordered [national, ..., parent]. */
export async function getUnitAncestors(supabase: Client, unit: Unit): Promise<Unit[]> {
  const trail: Unit[] = [];
  let current = unit;
  while (current.parent_id) {
    const { data } = await supabase.from("units").select("*").eq("id", current.parent_id).single();
    if (!data) break;
    trail.unshift(data as Unit);
    current = data as Unit;
  }
  return trail;
}

export async function getFundsRaisedMap(
  supabase: Client,
  initiativeIds: string[]
): Promise<Record<string, number>> {
  if (initiativeIds.length === 0) return {};
  const { data } = await supabase
    .from("initiative_funds_raised")
    .select("*")
    .in("initiative_id", initiativeIds);
  const map: Record<string, number> = {};
  for (const row of (data as { initiative_id: string; amount_raised: number }[]) ?? []) {
    map[row.initiative_id] = row.amount_raised;
  }
  return map;
}

export async function getPublishedInitiativesForUnit(supabase: Client, unitId: string): Promise<Initiative[]> {
  const { data } = await supabase
    .from("initiatives")
    .select("*")
    .eq("unit_id", unitId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return (data as Initiative[]) ?? [];
}
