import { requireAdmin } from "@/lib/session";
import { AdminHead } from "@/components/admin-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Admin · Workspaces | Profound" };

export default async function Page() {
  await requireAdmin();
  const rows = db
    .prepare(
      `SELECT w.*,
        (SELECT COUNT(*) FROM memberships m WHERE m.workspace_id = w.id) members,
        (SELECT COUNT(*) FROM prompts p WHERE p.workspace_id = w.id) prompts,
        (SELECT COUNT(*) FROM agents a WHERE a.workspace_id = w.id) agents,
        (SELECT COUNT(*) FROM agent_runs r WHERE r.workspace_id = w.id) runs
       FROM workspaces w ORDER BY w.id`
    )
    .all() as { id: number; name: string; slug: string; plan: string; credits_total: number; credits_used: number; status: string; created_at: string; members: number; prompts: number; agents: number; runs: number }[];

  return (
    <>
      <AdminHead title="Workspaces" sub={`${rows.length} workspaces · ${rows.reduce((a, w) => a + w.credits_used, 0).toLocaleString()} credits consumed`} />
      <div className="px-6 py-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-white/10 text-left text-[12px] text-zinc-400"><th className="px-5 py-3 font-medium">Workspace</th><th className="px-5 py-3 font-medium">Plan</th><th className="px-5 py-3 font-medium">Members</th><th className="px-5 py-3 font-medium">Prompts</th><th className="px-5 py-3 font-medium">Agents</th><th className="px-5 py-3 font-medium">Runs</th><th className="px-5 py-3 font-medium">Credits</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3"><p className="font-medium">{w.name}</p><p className="font-mono text-[11.5px] text-zinc-500">{w.slug}</p></td>
                  <td className="px-5 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[11.5px] capitalize text-zinc-300">{w.plan}</span></td>
                  <td className="px-5 py-3">{w.members}</td>
                  <td className="px-5 py-3">{w.prompts}</td>
                  <td className="px-5 py-3">{w.agents}</td>
                  <td className="px-5 py-3">{w.runs.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-zinc-300">{w.credits_used}/{w.credits_total}</span>
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-violet-400" style={{ width: `${Math.min(100, (w.credits_used / Math.max(1, w.credits_total)) * 100)}%` }} /></span>
                    </span>
                  </td>
                  <td className="px-5 py-3"><span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{w.status}</span></td>
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
