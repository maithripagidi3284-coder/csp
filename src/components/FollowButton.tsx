"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FollowButton({ initiativeId }: { initiativeId: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!active) return;
      setSignedIn(!!user);
      if (user) {
        const { data } = await supabase
          .from("initiative_follows")
          .select("id")
          .eq("initiative_id", initiativeId)
          .eq("donor_id", user.id)
          .maybeSingle();
        if (active) setFollowing(!!data);
      }
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiativeId]);

  async function toggle() {
    setBusy(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = `/signup?next=/initiatives`;
      return;
    }
    if (following) {
      await supabase
        .from("initiative_follows")
        .delete()
        .eq("initiative_id", initiativeId)
        .eq("donor_id", user.id);
      setFollowing(false);
    } else {
      await supabase.from("initiative_follows").insert({ initiative_id: initiativeId, donor_id: user.id });
      setFollowing(true);
    }
    setBusy(false);
  }

  if (loading) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60 ${
        following ? "border-accent bg-accent-soft text-accent" : "border-line hover:border-accent"
      }`}
    >
      {following ? "Following" : signedIn ? "Follow" : "Follow (sign up)"}
    </button>
  );
}
