import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { HBarList } from "@/components/charts";
import { citationsByCat, citationDomains, catColor } from "@/lib/app-queries";

export const metadata = { title: "Citations | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const cats = citationsByCat(ws.id);
  const domains = citationDomains(ws.id);
  const maxShare = Math.max(...domains.map((d) => d.share), 1);

  return (
    <>
      <PageHead title="Citations" sub="Which sources answer engines cite when talking about your category">
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">All engines ⌄</span>
      </PageHead>
      <div className="grid gap-6 px-6 py-6 xl:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="text-[15px] font-semibold">Share by category</p>
          <p className="mb-4 text-[12.5px] text-zinc-500">Aggregated citation share</p>
          <div className="space-y-2.5">
            {cats.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-[12.5px]"><span>{c.category}</span><span className="font-medium">{Math.round(c.share)}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full" style={{ width: `${Math.min(100, c.share)}%`, background: catColor(c.category) }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-1.5 border-t border-zinc-100 pt-4 text-[12px] text-zinc-500">
            <p><b className="text-zinc-800">Owned</b> — pages on your domain</p>
            <p><b className="text-zinc-800">Earned</b> — press &amp; third-party reviews</p>
            <p><b className="text-zinc-800">Competition</b> — competitor properties</p>
            <p><b className="text-zinc-800">Social</b> — UGC and community platforms</p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5 xl:col-span-2">
          <p className="text-[15px] font-semibold">Top cited domains</p>
          <p className="mb-4 text-[12.5px] text-zinc-500">Share of citations across all tracked answers</p>
          <HBarList items={domains.slice(0, 10).map((d) => ({ label: d.domain, value: Math.round((d.share / maxShare) * 100), sub: `${d.share}% · ${d.category}` }))} suffix="%" />
          <table className="mt-5 w-full text-[13px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="py-2 font-medium">Domain</th><th className="py-2 font-medium">Category</th><th className="py-2 font-medium">Share</th><th className="py-2 font-medium">30d change</th></tr></thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.domain} className="border-b border-zinc-50 last:border-0">
                  <td className="py-2.5 font-medium">{d.domain}</td>
                  <td className="py-2.5"><span className="rounded-full px-2 py-0.5 text-[11.5px]" style={{ background: `${catColor(d.category)}22`, color: catColor(d.category) }}>{d.category}</span></td>
                  <td className="py-2.5">{d.share}%</td>
                  <td className={`py-2.5 ${d.change_pct >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{d.change_pct >= 0 ? "+" : ""}{d.change_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const instant = false;
