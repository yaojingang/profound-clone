import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { db } from "@/lib/db";

export const metadata = { title: "FactCheck | Profound" };

const VERDICT_STYLE: Record<string, string> = {
  False: "bg-rose-50 text-rose-600",
  Partly: "bg-amber-50 text-amber-600",
  True: "bg-emerald-50 text-emerald-600",
};

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const rows = db.prepare("SELECT * FROM factchecks WHERE workspace_id = ? ORDER BY created_at DESC").all(ws.id) as
    { id: number; claim: string; verdict: string; sources: number; status: string; created_at: string }[];

  return (
    <>
      <PageHead title="FactCheck" sub="Combat misinformation about your brand in AI answers">
        <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[12.5px] font-medium text-rose-600">{rows.filter((r) => r.status === "open").length} open</span>
      </PageHead>
      <div className="space-y-3 px-6 py-6 lg:px-8">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 p-5">
            <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${VERDICT_STYLE[r.verdict] ?? "bg-zinc-100 text-zinc-600"}`}>{r.verdict === "Partly" ? "Partly true" : r.verdict}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-snug">“{r.claim}”</p>
              <p className="mt-1 text-[12px] text-zinc-500">{r.sources} sources scanned · detected {r.created_at.slice(0, 10)}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${r.status === "open" ? "bg-zinc-100 text-zinc-600" : "bg-emerald-50 text-emerald-600"}`}>{r.status === "open" ? "Needs outreach" : "Resolved"}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">No factcheck findings yet.</p>}
      </div>
    </>
  );
}

export const instant = false;
