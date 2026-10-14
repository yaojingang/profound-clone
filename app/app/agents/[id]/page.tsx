import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata = { title: "Agent | Profound" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) notFound();
  const agent = db.prepare("SELECT * FROM agents WHERE id = ? AND workspace_id = ?").get(Number(id), ws.id) as
    | { id: number; name: string; type: string; description: string | null; schedule: string; status: string; created_at: string }
    | undefined;
  if (!agent) notFound();
  const runs = db.prepare("SELECT * FROM agent_runs WHERE agent_id = ? ORDER BY started_at DESC LIMIT 10").all(agent.id) as
    { id: number; status: string; trigger: string; credits: number; started_at: string; finished_at: string | null }[];
  const latestSteps = runs[0]
    ? (db.prepare("SELECT * FROM agent_steps WHERE run_id = ? ORDER BY idx").all(runs[0].id) as { id: number; idx: number; tool: string; detail: string | null; status: string; duration_ms: number }[])
    : [];
  const totals = db.prepare("SELECT COUNT(*) n, COALESCE(SUM(credits),0) c FROM agent_runs WHERE agent_id = ?").get(agent.id) as { n: number; c: number };

  return (
    <>
      <div className="border-b border-zinc-200 px-6 py-5 lg:px-8">
        <Link href="/app/agents" className="text-[12.5px] text-zinc-500 hover:text-zinc-800">← Agents</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-[22px] font-semibold tracking-tight">{agent.name}</h1>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11.5px] font-semibold capitalize text-zinc-600">{agent.type}</span>
          <span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{agent.status}</span>
        </div>
        <p className="mt-1.5 max-w-2xl text-[13.5px] text-zinc-500">{agent.description}</p>
      </div>
      <div className="grid gap-6 px-6 py-6 xl:grid-cols-3 lg:px-8">
        <div className="space-y-6 xl:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <div className="border-b border-zinc-200 p-5"><p className="text-[15px] font-semibold">Runs</p><p className="text-[12.5px] text-zinc-500">Most recent 10 executions</p></div>
            <table className="w-full text-[13.5px]">
              <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-2.5 font-medium">Run</th><th className="px-5 py-2.5 font-medium">Trigger</th><th className="px-5 py-2.5 font-medium">Status</th><th className="px-5 py-2.5 font-medium">Credits</th><th className="px-5 py-2.5 font-medium">Started</th></tr></thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-50 last:border-0">
                    <td className="px-5 py-3 font-mono text-[12.5px]">#{r.id}</td>
                    <td className="px-5 py-3 capitalize text-zinc-500">{r.trigger}</td>
                    <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11.5px] ${r.status === "done" ? "bg-emerald-50 text-emerald-600" : r.status === "running" ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-500"}`}>{r.status}</span></td>
                    <td className="px-5 py-3">{r.credits}</td>
                    <td className="px-5 py-3 text-zinc-500">{r.started_at.slice(0, 16).replace("T", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {latestSteps.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-[15px] font-semibold">Latest run · #{runs[0].id}</p>
              <p className="mb-4 text-[12.5px] text-zinc-500">Step-by-step execution trace</p>
              <ol className="relative space-y-4 border-l border-zinc-200 pl-6">
                {latestSteps.map((s) => (
                  <li key={s.id} className="relative">
                    <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-zinc-900" />
                    <p className="font-mono text-[12px] text-zinc-800">{s.tool} <span className="ml-1 font-sans text-[11px] text-zinc-400">{(s.duration_ms / 1000).toFixed(1)}s</span></p>
                    <p className="mt-0.5 text-[13px] text-zinc-600">{s.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {[["Total runs", String(totals.n)], ["Credits used", String(totals.c)], ["Schedule", agent.schedule === "manual" ? "Manual" : agent.schedule], ["Created", agent.created_at.slice(0, 10)]].map(([l, v]) => (
            <div key={l} className="rounded-2xl border border-zinc-200 p-5"><p className="text-[12.5px] text-zinc-500">{l}</p><p className="mt-1 text-[20px] font-semibold capitalize">{v}</p></div>
          ))}
        </div>
      </div>
    </>
  );
}

export const instant = false;
