import { requireAdmin } from "@/lib/session";
import { AdminHead } from "@/components/admin-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Admin · Agents | Profound" };

export default async function Page() {
  await requireAdmin();
  const agents = db
    .prepare(
      `SELECT a.*, w.name ws_name,
        (SELECT COUNT(*) FROM agent_runs r WHERE r.agent_id = a.id) runs,
        (SELECT COUNT(*) FROM agent_steps s JOIN agent_runs r ON r.id = s.run_id WHERE r.agent_id = a.id) steps
       FROM agents a JOIN workspaces w ON w.id = a.workspace_id ORDER BY runs DESC LIMIT 40`
    )
    .all() as { id: number; name: string; type: string; ws_name: string; status: string; runs: number; steps: number }[];
  const runs = db
    .prepare(
      `SELECT r.id, r.status, r.trigger, r.credits, r.started_at, a.name agent_name, w.name ws_name
       FROM agent_runs r JOIN agents a ON a.id = r.agent_id JOIN workspaces w ON w.id = r.workspace_id
       ORDER BY r.started_at DESC LIMIT 25`
    )
    .all() as { id: number; status: string; trigger: string; credits: number; started_at: string; agent_name: string; ws_name: string }[];

  return (
    <>
      <AdminHead title="Agents & Runs" sub="Agent fleet across all workspaces" />
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-5"><p className="text-[15px] font-semibold">Fleet</p><p className="text-[12.5px] text-zinc-500">{agents.length} agents configured</p></div>
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-white/10 text-left text-[12px] text-zinc-400"><th className="px-5 py-3 font-medium">Agent</th><th className="px-5 py-3 font-medium">Workspace</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Runs</th><th className="px-5 py-3 font-medium">Steps</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{a.name}</td>
                  <td className="px-5 py-3 text-zinc-400">{a.ws_name}</td>
                  <td className="px-5 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[11.5px] capitalize text-zinc-300">{a.type}</span></td>
                  <td className="px-5 py-3 font-medium text-violet-300">{a.runs}</td>
                  <td className="px-5 py-3 text-zinc-400">{a.steps}</td>
                  <td className="px-5 py-3"><span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-5"><p className="text-[15px] font-semibold">Latest runs</p><p className="text-[12.5px] text-zinc-500">Most recent 25 across the platform</p></div>
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-white/10 text-left text-[12px] text-zinc-400"><th className="px-5 py-3 font-medium">Run</th><th className="px-5 py-3 font-medium">Agent</th><th className="px-5 py-3 font-medium">Workspace</th><th className="px-5 py-3 font-medium">Trigger</th><th className="px-5 py-3 font-medium">Credits</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Started</th></tr></thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-[12.5px] text-zinc-500">#{r.id}</td>
                  <td className="px-5 py-3 font-medium">{r.agent_name}</td>
                  <td className="px-5 py-3 text-zinc-400">{r.ws_name}</td>
                  <td className="px-5 py-3 capitalize text-zinc-400">{r.trigger}</td>
                  <td className="px-5 py-3">{r.credits}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11.5px] ${r.status === "done" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-400"}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-zinc-500">{r.started_at.slice(0, 16).replace("T", " ")}</td>
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
