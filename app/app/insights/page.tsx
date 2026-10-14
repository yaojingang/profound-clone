import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead, EnginePills } from "@/components/app-shell";
import { LineChart, StackedShareBar, HBarList, Donut } from "@/components/charts";
import { visibilitySeries, overallScore, citationsByCat, catColor, sentimentRows, mentionRate, promptsOf, colorForEngine } from "@/lib/app-queries";
import { db, ENGINES } from "@/lib/db";

export const metadata = { title: "Answer Engine Insights | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const { labels, series } = visibilitySeries(ws.id);
  const overall = labels.map((_, i) => Math.round((series.reduce((a, s) => a + s.points[i], 0) / series.length) * 10) / 10);
  const score = overallScore(ws.id);
  const first = overall[0] ?? 0;
  const delta = Math.round((score - first) * 10) / 10;
  const cats = citationsByCat(ws.id);
  const sentiment = sentimentRows(ws.id);
  const posAvg = Math.round((sentiment.reduce((a, r) => a + r.positive, 0) / Math.max(1, sentiment.length)) * 100);
  const runs = db.prepare("SELECT COUNT(*) c FROM agent_runs WHERE workspace_id = ?").get(ws.id) as { c: number };
  const topPrompts = promptsOf(ws.id, 6);
  const maxVol = Math.max(...topPrompts.map((p) => p.volume), 1);
  const owned = db.prepare("SELECT share FROM citations WHERE workspace_id = ? AND LOWER(category) = 'owned'").get(ws.id) as { share: number } | undefined;

  const kpis = [
    { label: "Visibility score", value: `${score}%`, sub: `${delta >= 0 ? "+" : ""}${delta} pts since start` },
    { label: "Mention rate", value: `${mentionRate(ws.id)}%`, sub: "across tracked prompts" },
    { label: "Owned citation share", value: `${owned?.share ?? 0}%`, sub: "your domain in answers" },
    { label: "Agent runs", value: String(runs.c), sub: "all time" },
  ];

  return (
    <>
      <PageHead title="Answer Engine Insights" sub={`${ws.name} · Last 90 days`}>
        <EnginePills engines={ENGINES.slice(0, 4)} />
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">Last 90 days ⌄</span>
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-[12.5px] text-zinc-500">{k.label}</p>
              <p className="mt-1.5 text-[26px] font-semibold tracking-tight">{k.value}</p>
              <p className="mt-0.5 text-[12px] text-zinc-400">{k.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-[15px] font-semibold">Visibility Score by Platform</p><p className="text-[12.5px] text-zinc-500">Daily share of answers mentioning {ws.name}</p></div>
            <div className="flex flex-wrap gap-3">
              {series.map((s) => <span key={s.name} className="flex items-center gap-1.5 text-[11.5px] text-zinc-500"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</span>)}
            </div>
          </div>
          <LineChart series={series} labels={labels} yMax={100} yFmt="pct" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-5 xl:col-span-2">
            <p className="text-[15px] font-semibold">Citation Analytics</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Sources cited across answers, by category</p>
            <StackedShareBar items={cats.map((c) => ({ label: c.category, pct: Math.round(c.share), color: catColor(c.category) }))} />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cats.map((c) => (
                <div key={c.category} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[13px]">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: catColor(c.category) }} />{c.category}</span>
                  <span className="font-medium">{Math.round(c.share)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 p-5">
            <p className="self-start text-[15px] font-semibold">Brand Sentiment</p>
            <p className="self-start text-[12.5px] text-zinc-500">Avg across engines</p>
            <div className="py-6"><Donut value={posAvg} label={`${posAvg}%`} /></div>
            <div className="grid w-full grid-cols-3 gap-2 text-center text-[12px]">
              {[["Positive", "text-emerald-600"], ["Neutral", "text-zinc-500"], ["Negative", "text-rose-500"]].map(([l, c]) => <div key={l} className={`rounded-lg bg-zinc-50 py-2 ${c}`}>{l}</div>)}
            </div>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-[15px] font-semibold">Top prompts by volume</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Monthly search volume in your category</p>
            <HBarList items={topPrompts.map((p) => ({ label: p.text, value: Math.round((p.volume / maxVol) * 100), sub: `${p.volume.toLocaleString()}/mo` }))} suffix="%" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <div className="border-b border-zinc-200 p-5"><p className="text-[15px] font-semibold">Engine breakdown</p><p className="text-[12.5px] text-zinc-500">Latest visibility and sentiment per engine</p></div>
            <table className="w-full text-[13.5px]">
              <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-2.5 font-medium">Engine</th><th className="px-5 py-2.5 font-medium">Visibility</th><th className="px-5 py-2.5 font-medium">Change</th><th className="px-5 py-2.5 font-medium">Positive</th></tr></thead>
              <tbody>
                {series.map((s, i) => {
                  const d = Math.round((s.points[s.points.length - 1] - s.points[0]) * 10) / 10;
                  const sent = sentiment.find((r) => r.engine === s.name);
                  return (
                    <tr key={s.name} className="border-b border-zinc-100 last:border-0">
                      <td className="px-5 py-3"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colorForEngine(s.name) }} />{s.name}</span></td>
                      <td className="px-5 py-3 font-medium">{overall[i]}%</td>
                      <td className={`px-5 py-3 ${d >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{d >= 0 ? "+" : ""}{d}</td>
                      <td className="px-5 py-3">{sent ? `${Math.round(sent.positive * 100)}%` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export const instant = false;
