import Link from "next/link";
import SearchBox from "@/components/SearchBox";

const NAV = [
  { href: "/units/national", label: "Explore Units" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/reports", label: "Transparency" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center gap-5 px-5 py-3.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-sm font-black text-white shadow-sm">CS</span>
          <span className="hidden sm:block">
            <span className="block text-[15px] font-bold tracking-tight text-ink">Citizens&apos; Sabha</span>
            <span className="block text-[11px] font-medium text-muted">Open civic platform</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => <Link key={item.href} href={item.href} className="text-sm font-medium text-muted no-underline transition hover:text-accent">{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="hidden w-64 md:block"><SearchBox compact /></div>
          <Link href="/dashboard" className="rounded-xl px-3 py-2 text-sm font-semibold text-muted no-underline transition hover:bg-accent-soft hover:text-accent">Sign in</Link>
        </div>
      </div>
    </header>
  );
}
