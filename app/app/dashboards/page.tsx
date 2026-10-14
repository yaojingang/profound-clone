import Link from "next/link";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { LineChart } from "@/components/charts";
import { trafficDaily, trafficByAgent, colorForEngine } from "@/lib/app-queries";

export const metadata = { title: "Dashboards | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const traffic = trafficDaily(ws.id);
  const byAgent = trafficByAgent(ws.id);
  const referrals = byAgent.reduce((a, r) => a + r.referrals, 0);
  const cards = [
    ["Executive summary", "Visibility, citations and sentiment at a glance", "/app/insights"],
    ["Engine visibility", "Daily visibility trend for all 7 engines", "/app/insights/visibility"],
    ["Citation health", "Who gets cited, and where you're missing", "/app/insights/citations"],
    ["Agent performance", "Runs, credits and outcomes by agent", "/app/agent-runs"],
    ["Shopping visibility", "SKU-level share in ChatGPT Shopping", "/app/shopping"],
    ["Brand safety", "FactCheck claims and resolutions", "/app/insights/factcheck"],
  ] as const;

  return (
    <>
      <PageHead title="Dashboards" sub={`Saved views for ${ws.name}`}>
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">+ New dashboard</span>
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map(([t, p, href]) => (
            <Link key={t} href={href} className="group rounded-2xl border border-zinc-200 p-5 transition-all hover:border-zinc-400 hover:shadow-sm">
              <p className="text-[15.5px] font-semibold">{t}</p>
              <p className="mt-1 text-[13px] text-zinc-500">{p}</p>
              <p className="mt-4 text-[12.5px] font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">Open →</p>
            </Link>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-5 xl:col-span-2">
            <p className="text-[15px] font-semibold">AI bot hits on your site</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Daily crawler + referral traffic from answer engines</p>
            <LineChart series={[{ name: "Hits", color: "#18181b", points: traffic.points }]} labels={traffic.labels} yFmt="k" />
          </div>
          <div className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-[15px] font-semibold">Referrals from AI</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">{referrals.toLocaleString()} sessions in 90 days</p>
            <div className="space-y-2.5">
              {byAgent.slice(0, 7).map((r) => {
                const max = Math.max(...byAgent.map((x) => x.referrals), 1);
                return (
                  <div key={r.agent_name}>
                    <div className="mb-1 flex justify-between text-[12.5px]"><span>{r.agent_name}</span><span className="font-medium">{r.referrals.toLocaleString()}</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full" style={{ width: `${(r.referrals / max) * 100}%`, background: colorForEngine(r.agent_name) }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const instant = false;
