import { requireAdmin } from "@/lib/session";
import { AdminHead } from "@/components/admin-shell";
import { LineChart, ColumnChart } from "@/components/charts";
import { db } from "@/lib/db";

export const metadata = { title: "Admin Overview | Profound" };

export default async function Page() {
  await requireAdmin();
  const stats = db.prepare("SELECT * FROM platform_stats ORDER BY date").all() as { date: string; signups: number; demo_requests: number; agent_runs: number; prompts_tracked: number }[];
  const labels = stats.map((s) => s.date.slice(5));
  const count = (t: string) => (db.prepare(`SELECT COUNT(*) c FROM ${t}`).get() as { c: number }).c;
  const sum = (t: string, col: string) => (db.prepare(`SELECT COALESCE(SUM(${col}),0) s FROM ${t}`).get() as { s: number }).s;
  const recentLeads = db.prepare("SELECT name, email, company, source, created_at FROM leads ORDER BY created_at DESC LIMIT 6").all() as { name: string; email: string; company: string | null; source: string; created_at: string }[];
  const topWs = db
    .prepare(
      `SELECT w.name, w.plan, (SELECT COUNT(*) FROM prompts p WHERE p.workspace_id = w.id) prompts,
        (SELECT COUNT(*) FROM agent_runs r WHERE r.workspace_id = w.id) runs,
        (SELECT COUNT(*) FROM memberships m WHERE m.workspace_id = w.id) members
       FROM workspaces w ORDER BY runs DESC LIMIT 5`
    )
    .all() as { name: string; plan: string; prompts: number; runs: number; members: number }[];

  const kpis = [
    ["Users", count("users"), "+12 this week"],
    ["Workspaces", count("workspaces"), `${count("memberships")} memberships`],
    ["Prompts tracked", count("prompts"), `${count("prompt_answers")} engine answers`],
    ["Agent runs", count("agent_runs"), `${sum("agent_runs", "credits")} credits spent`],
    ["Leads", count("leads"), `${count("leads")} all time`],
    ["Templates", count("agent_templates"), `${sum("agent_templates", "installs").toLocaleString()} installs`],
  ] as const;

  return (
    <>
      <AdminHead title="Platform Overview" sub="Command Center · all workspaces, last 90 days">
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-zinc-400">Live</span>
      </AdminHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {kpis.map(([l, v, s]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[12px] text-zinc-400">{l}</p>
              <p className="mt-1 text-[24px] font-semibold">{Number(v).toLocaleString()}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{s}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[15px] font-semibold">Agent runs across platform</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Daily total, all workspaces</p>
            <LineChart series={[{ name: "Runs", color: "#a78bfa", points: stats.map((s) => s.agent_runs) }]} labels={labels} yFmt="k" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[15px] font-semibold">Signups & demo requests</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Daily acquisition funnel</p>
            <LineChart series={[{ name: "Signups", color: "#34d399", points: stats.map((s) => s.signups) }, { name: "Demos", color: "#fb7185", points: stats.map((s) => s.demo_requests) }]} labels={labels} />
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[15px] font-semibold">Top workspaces by agent activity</p>
            <div className="mt-4 space-y-3">
              {topWs.map((w) => (
                <div key={w.name} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-[13.5px]">
                  <div><p className="font-medium">{w.name}</p><p className="text-[11.5px] capitalize text-zinc-500">{w.plan} · {w.members} members · {w.prompts} prompts</p></div>
                  <p className="font-semibold text-violet-300">{w.runs.toLocaleString()} runs</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-5"><p className="text-[15px] font-semibold">Latest leads</p><p className="text-[12.5px] text-zinc-500">From contact-sales and get-started forms</p></div>
            <table className="w-full text-[13.5px]">
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={`${l.email}-${l.created_at}`} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3"><p className="font-medium">{l.name}</p><p className="text-[11.5px] text-zinc-500">{l.email}{l.company ? ` · ${l.company}` : ""}</p></td>
                    <td className="px-5 py-3 text-right text-[12px] text-zinc-500">{l.source} · {l.created_at.slice(0, 10)}</td>
                  </tr>
                ))}
                {recentLeads.length === 0 && <tr><td className="px-5 py-6 text-center text-zinc-500">No leads yet — submit the contact-sales form to see one here.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[15px] font-semibold">Prompts tracked on platform</p>
          <p className="mb-4 text-[12.5px] text-zinc-500">Cumulative daily</p>
          <ColumnChart items={labels.slice(-30).map((l, i) => ({ label: l, value: stats[stats.length - 30 + i].prompts_tracked }))} color="#818cf8" height={170} />
        </div>
      </div>
    </>
  );
}

export const instant = false;
