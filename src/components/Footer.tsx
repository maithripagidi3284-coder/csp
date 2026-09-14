import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-slate-50/70">
      <div className="mx-auto grid max-w-content gap-8 px-5 py-12 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-black text-white">CS</span><span className="font-bold">Citizens&apos; Sabha</span></div>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">A public-first platform for exploring civic units, initiatives, funding and progress.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
          <Link href="/units/national" className="no-underline hover:text-accent">Units</Link>
          <Link href="/initiatives" className="no-underline hover:text-accent">Initiatives</Link>
          <Link href="/reports" className="no-underline hover:text-accent">Reports</Link>
          <Link href="/dashboard" className="no-underline hover:text-accent">Dashboard</Link>
        </div>
      </div>
      <div className="border-t border-line"><div className="mx-auto max-w-content px-5 py-5 text-xs text-muted sm:px-6">No login required to browse. Donor accounts are separate from JMI membership.</div></div>
    </footer>
  );
}
