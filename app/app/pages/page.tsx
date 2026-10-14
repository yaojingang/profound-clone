import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { ColumnChart } from "@/components/charts";
import { trafficDaily } from "@/lib/app-queries";
import { db } from "@/lib/db";

export const metadata = { title: "Pages | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const rows = db.prepare("SELECT * FROM pages WHERE workspace_id = ? ORDER BY citations DESC").all(ws.id) as
    { id: number; path: string; title: string; ai_readable: number; citations: number; status: string; last_audit: string }[];
  const traffic = trafficDaily(ws.id);
  const totalHits = traffic.points.reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHead title="Pages" sub="How AI crawlers and citations treat your content">
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">{rows.filter((r) => !r.ai_readable).length} need attention</span>
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-baseline justify-between">
            <div><p className="text-[15px] font-semibold">AI bot traffic to your site</p><p className="text-[12.5px] text-zinc-500">GPTBot, ClaudeBot, PerplexityBot and friends</p></div>
            <p className="text-[22px] font-semibold">{totalHits.toLocaleString()}<span className="ml-1 text-[12px] font-normal text-zinc-400">hits / 90d</span></p>
          </div>
          <div className="mt-4">
            <ColumnChart items={traffic.labels.slice(-30).map((l, i) => ({ label: l, value: traffic.points[traffic.points.length - 30 + i] }))} color="#18181b" height={180} fmt="k" />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-3 font-medium">Page</th><th className="px-5 py-3 font-medium">AI readable</th><th className="px-5 py-3 font-medium">Citations</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Last audit</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                  <td className="max-w-md px-5 py-3"><p className="font-medium text-zinc-800">{r.title}</p><p className="font-mono text-[11.5px] text-zinc-400">{r.path}</p></td>
                  <td className="px-5 py-3">{r.ai_readable ? <span className="text-emerald-600">✓ Yes</span> : <span className="text-rose-500">✕ Blocked</span>}</td>
                  <td className="px-5 py-3 font-medium">{r.citations}</td>
                  <td className="px-5 py-3 capitalize text-zinc-500">{r.status}</td>
                  <td className="px-5 py-3 text-zinc-500">{r.last_audit?.slice(0, 10) ?? "—"}</td>
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
