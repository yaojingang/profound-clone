import Link from "next/link";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Agent Runs | Profound" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const runs = db
    .prepare(
      `SELECT r.*, a.name agent_name, a.type agent_type,
        (SELECT COUNT(*) FROM agent_steps s WHERE s.run_id = r.id) steps
       FROM agent_runs r JOIN agents a ON a.id = r.agent_id
       WHERE r.workspace_id = ? ORDER BY r.started_at DESC LIMIT 50`
    )
    .all(ws.id) as { id: number; agent_id: number; agent_name: string; agent_type: string; status: string; trigger: string; credits: number; steps: number; started_at: string; finished_at: string | null }[];
  const done = runs.filter((r) => r.status === "done").length;

  return (
    <>
      <PageHead title="Agent Runs" sub={`${runs.length} recent runs · ${done} completed`}>
        <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">All agents ⌄</span>
      </PageHead>
      <div className="px-6 py-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-3 font-medium">Run</th><th className="px-5 py-3 font-medium">Agent</th><th className="px-5 py-3 font-medium">Steps</th><th className="px-5 py-3 font-medium">Trigger</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Credits</th><th className="px-5 py-3 font-medium">Started</th></tr></thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                  <td className="px-5 py-3 font-mono text-[12.5px] text-zinc-600">#{r.id}</td>
                  <td className="px-5 py-3"><Link href={`/app/agents/${r.agent_id}`} className="font-medium text-zinc-800 hover:underline">{r.agent_name}</Link></td>
                  <td className="px-5 py-3 text-zinc-500">{r.steps}</td>
                  <td className="px-5 py-3 capitalize text-zinc-500">{r.trigger}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11.5px] ${r.status === "done" ? "bg-emerald-50 text-emerald-600" : r.status === "running" ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-500"}`}>{r.status}</span></td>
                  <td className="px-5 py-3">{r.credits}</td>
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
