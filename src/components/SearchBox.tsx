"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter(); const [q, setQ] = useState("");
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`); }
  return <form onSubmit={handleSubmit} role="search" className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search units & initiatives" aria-label="Search units and initiatives" className={`${compact ? "py-2" : "py-3.5"} input-ui pl-9`} /></form>;
}
