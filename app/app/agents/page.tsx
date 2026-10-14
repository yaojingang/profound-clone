import Link from "next/link";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { db } from "@/lib/db";

export const metadata = { title: "Agents | Profound" };

const TYPE_COLOR: Record<string, string> = {
  content: "bg-violet-50 text-violet-600",
  seo: "bg-sky-50 text-sky-600",
  pr: "bg-blue-50 text-blue-600",
  ads: "bg-amber-50 text-amber-600",
  social: "bg-fuchsia-50 text-fuchsia-600",
  factcheck: "bg-rose-50 text-rose-600",
  launch: "bg-emerald-50 text-emerald-600",
};

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const agents = db
    .prepare(
      `SELECT a.*, (SELECT COUNT(*) FROM agent_runs r WHERE r.agent_id = a.id) runs,
        (SELECT MAX(r.started_at) FROM agent_runs r WHERE r.agent_id = a.id) last_run
       FROM agents a WHERE a.workspace_id = ? ORDER BY a.id`
    )
    .all(ws.id) as { id: number; name: string; type: string; description: string | null; schedule: string; status: string; runs: number; last_run: string | null }[];

  return (
    <>
      <PageHead title="Agents" sub="Reusable workflows that act on your AI Search data">
        <Link href="/agent-templates" className="rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-zinc-800">Browse templates</Link>
      </PageHead>
      <div className="px-6 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => (
            <Link key={a.id} href={`/app/agents/${a.id}`} className="group flex flex-col rounded-2xl border border-zinc-200 p-5 transition-all hover:border-zinc-400 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${TYPE_COLOR[a.type] ?? "bg-zinc-100 text-zinc-600"}`}>{a.type}</span>
                <span className={`flex items-center gap-1.5 text-[12px] ${a.status === "active" ? "text-emerald-600" : "text-zinc-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${a.status === "active" ? "bg-emerald-500" : "bg-zinc-300"}`} />{a.status}</span>
              </div>
              <p className="mt-3.5 text-[16px] font-semibold text-zinc-900">{a.name}</p>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-zinc-500">{a.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3.5 text-[12px] text-zinc-500">
                <span>{a.runs} runs</span>
                <span>{a.schedule === "manual" ? "Manual" : a.schedule}</span>
                <span>{a.last_run ? a.last_run.slice(0, 10) : "never"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const instant = false;
