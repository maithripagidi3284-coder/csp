import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/format";

export const revalidate = 600;

export default async function ReportsPage() {
  const supabase = createClient();

  const { data: reports } = await supabase
    .from("financial_reports")
    .select("*, units(name, slug)")
    .eq("is_published", true)
    .order("period_start", { ascending: false });

  return (
    <div className="pb-10">
      <section className="rounded-3xl bg-slate-50 p-7 sm:p-10"><p className="eyebrow">Financial transparency</p><h1 className="text-2xl font-semibold tracking-tight">Transparency reports</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Quarterly financials and impact summaries, published per unit.
      </p></section>

      {!reports || reports.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No reports published yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {reports.map((report) => {
            const unit = report.units as unknown as { name: string; slug: string } | null;
            const net = report.total_income - report.total_expenditure;
            return (
              <div key={report.id} className="flex flex-wrap items-start justify-between gap-5 px-5 py-6 transition hover:bg-slate-50">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {unit ? (
                      <Link href={`/units/${unit.slug}`} className="text-accent no-underline">
                        {unit.name}
                      </Link>
                    ) : (
                      "Unit"
                    )}
                    {" · "}
                    {report.period_label}
                  </p>
                  {report.summary && <p className="mt-1 max-w-lg text-sm text-muted">{report.summary}</p>}
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted">Income {formatINR(report.total_income)}</p>
                  <p className="text-muted">Expenditure {formatINR(report.total_expenditure)}</p>
                  <p className={`font-medium ${net >= 0 ? "text-accent" : "text-ink"}`}>
                    Net {formatINR(net)}
                  </p>
                  {report.document_url && (
                    <a
                      href={report.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-accent"
                    >
                      Full report ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
