import Link from "next/link";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { PageHead } from "@/components/app-shell";
import { HBarList } from "@/components/charts";
import { promptsOf } from "@/lib/app-queries";
import { db } from "@/lib/db";

export const metadata = { title: "Prompt Volumes | Profound" };

const DIFF_STYLE: Record<string, string> = { easy: "bg-emerald-50 text-emerald-600", medium: "bg-amber-50 text-amber-600", hard: "bg-rose-50 text-rose-600" };

export default async function Page() {
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) return <div className="p-8 text-zinc-500">No workspace found.</div>;
  const prompts = promptsOf(ws.id);
  const mentionByPrompt = new Map(
    (db.prepare(
      `SELECT pa.prompt_id pid, COUNT(*) total, SUM(pa.mentioned) men FROM prompt_answers pa JOIN prompts p ON p.id = pa.prompt_id WHERE p.workspace_id = ? GROUP BY pa.prompt_id`
    ).all(ws.id) as { pid: number; total: number; men: number | null }[]).map((r) => [r.pid, Math.round(((r.men ?? 0) / r.total) * 100)])
  );
  const totalVol = prompts.reduce((a, p) => a + p.volume, 0);
  const top = prompts.slice(0, 8);
  const maxVol = Math.max(...top.map((p) => p.volume), 1);
  const gaps = prompts.filter((p) => (mentionByPrompt.get(p.id) ?? 0) === 0).length;

  return (
    <>
      <PageHead title="Prompt Volumes" sub={`${prompts.length} prompts tracked · ${totalVol.toLocaleString()} combined monthly searches`}>
        {["All topics", "Battery", "Comparison", "Commuting", "Trail"].map((t, i) => (
          <span key={t} className={`rounded-full px-3 py-1.5 text-[12.5px] ${i === 0 ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-600"}`}>{t}</span>
        ))}
      </PageHead>
      <div className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-[15px] font-semibold">Highest volume prompts</p>
            <p className="mb-4 text-[12.5px] text-zinc-500">Where your category gets asked about most</p>
            <HBarList items={top.map((p) => ({ label: p.text, value: Math.round((p.volume / maxVol) * 100), sub: `${p.volume.toLocaleString()}/mo` }))} suffix="%" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["Total volume", `${totalVol.toLocaleString()}/mo`], ["Prompts with zero mentions", String(gaps)], ["Commercial intent", `${prompts.filter((p) => p.intent === "commercial").length}`], ["Avg difficulty", "Medium"]].map(([l, v]) => (
              <div key={l} className="rounded-2xl border border-zinc-200 p-5"><p className="text-[12.5px] text-zinc-500">{l}</p><p className="mt-1.5 text-[22px] font-semibold">{v}</p></div>
            ))}
            <div className="col-span-2 rounded-2xl bg-zinc-900 p-5 text-white">
              <p className="text-[13px] font-medium">Gap prompts found</p>
              <p className="mt-1 text-[12.5px] text-zinc-400">{gaps} high-volume prompts don't mention {ws.name}. Ask Aim to close the gap.</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-[13.5px]">
            <thead><tr className="border-b border-zinc-200 text-left text-[12px] text-zinc-500"><th className="px-5 py-3 font-medium">Prompt</th><th className="px-5 py-3 font-medium">Topic</th><th className="px-5 py-3 font-medium">Intent</th><th className="px-5 py-3 font-medium">Volume</th><th className="px-5 py-3 font-medium">Difficulty</th><th className="px-5 py-3 font-medium">Mention rate</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {prompts.map((p) => (
                <tr key={p.id} className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50">
                  <td className="max-w-md px-5 py-3"><Link href={`/app/prompts/${p.id}`} className="font-medium text-zinc-800 hover:underline">{p.text}</Link></td>
                  <td className="px-5 py-3 text-zinc-500">{p.topic}</td>
                  <td className="px-5 py-3 capitalize text-zinc-500">{p.intent}</td>
                  <td className="px-5 py-3 font-medium">{p.volume.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11.5px] capitalize ${DIFF_STYLE[p.difficulty] ?? "bg-zinc-100"}`}>{p.difficulty}</span></td>
                  <td className="px-5 py-3">{mentionByPrompt.get(p.id) ?? 0}%</td>
                  <td className="px-5 py-3"><span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{p.status}</span></td>
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
