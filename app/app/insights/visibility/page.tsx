import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { LineChart } from "@/components/charts";
import { visibilitySeries, colorForEngine } from "@/lib/app-queries";

export const metadata = { title: "Visibility | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const { labels, series } = visibilitySeries(ws.id);
  const blended = labels.map((_, i) => Math.round((series.reduce((a, s) => a + s.points[i], 0) / series.length) * 10) / 10);

  return (
    <>
      <PageHead title="Visibility" sub="Daily share of answers mentioning your brand, per engine">
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">Last 90 days ⌄</span>
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-[15px] font-semibold">Blended visibility</p><p className="text-[12.5px] text-zinc-500">Average across 7 answer engines</p></div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-600">Live</span>
          </div>
          <LineChart series={[{ name: "Blended", color: "#18181b", points: blended }]} labels={labels} yMax={100} yFmt="pct" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <div className="border-b border-zinc-200 p-5"><p className="text-[15px] font-semibold">By platform</p><p className="text-[12.5px] text-zinc-500">Start, current, and change over the window</p></div>
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-2.5 font-medium">Engine</th><th className="px-5 py-2.5 font-medium">Day 1</th><th className="px-5 py-2.5 font-medium">Today</th><th className="px-5 py-2.5 font-medium">Change</th><th className="px-5 py-2.5 font-medium">Trend</th></tr></thead>
            <tbody>
              {series.map((s) => {
                const cur = s.points[s.points.length - 1];
                const d = Math.round((cur - s.points[0]) * 10) / 10;
                const spark = s.points.slice(-14);
                const min = Math.min(...spark), max = Math.max(...spark, min + 0.1);
                return (
                  <tr key={s.name} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-3 font-medium"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colorForEngine(s.name) }} />{s.name}</span></td>
                    <td className="px-5 py-3 text-zinc-500">{s.points[0]}%</td>
                    <td className="px-5 py-3 font-semibold">{cur}%</td>
                    <td className={`px-5 py-3 ${d >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{d >= 0 ? "+" : ""}{d} pts</td>
                    <td className="px-5 py-3">
                      <svg viewBox="0 0 100 24" className="h-6 w-24">
                        <polyline fill="none" stroke={colorForEngine(s.name)} strokeWidth="2" points={spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${22 - ((v - min) / (max - min)) * 20}`).join(" ")} />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const instant = false;
