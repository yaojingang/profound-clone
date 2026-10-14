import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, primaryWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import { colorForEngine } from "@/lib/app-queries";
import { ENGINES } from "@/lib/db";

export const metadata = { title: "Prompt | Profound" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const ws = primaryWorkspace(user.id);
  if (!ws) notFound();
  const prompt = db.prepare("SELECT * FROM prompts WHERE id = ? AND workspace_id = ?").get(Number(id), ws.id) as
    | { id: number; text: string; topic: string; intent: string; volume: number; difficulty: string; status: string }
    | undefined;
  if (!prompt) notFound();
  const answers = db.prepare("SELECT engine, mentioned, position, sentiment FROM prompt_answers WHERE prompt_id = ?").all(prompt.id) as
    { engine: string; mentioned: number; position: number | null; sentiment: string }[];
  const mentioned = answers.filter((a) => a.mentioned).length;

  const SENT: Record<string, string> = { positive: "text-emerald-600", neutral: "text-zinc-500", negative: "text-rose-500" };

  return (
    <>
      <div className="border-b border-zinc-200 px-6 py-5 lg:px-8">
        <Link href="/app/prompts" className="text-[12.5px] text-zinc-500 hover:text-zinc-800">← Prompt Volumes</Link>
        <h1 className="mt-2 max-w-3xl text-[22px] font-semibold leading-snug tracking-tight">{prompt.text}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-[12.5px] text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1">{prompt.volume.toLocaleString()} searches/mo</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 capitalize">{prompt.difficulty} difficulty</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 capitalize">{prompt.intent} intent</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-600">{mentioned}/{answers.length} engines mention you</span>
        </div>
      </div>
      <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-3 lg:px-8">
        {ENGINES.map((e) => {
          const a = answers.find((x) => x.engine === e);
          return (
            <div key={e} className="rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[14px] font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: colorForEngine(e) }} />{e}</p>
                {a?.mentioned ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-medium text-emerald-600">Mentioned{a.position ? ` · #${a.position}` : ""}</span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11.5px] font-medium text-zinc-500">Not cited</span>
                )}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                {a?.mentioned
                  ? `Recommends ${ws.name} in the first paragraph, citing owned buying-guide content and third-party reviews. Sentiment: ${a.sentiment}.`
                  : `Answer features competitors without referencing ${ws.name}. Opportunity: publish content that directly targets this prompt's language.`}
              </p>
              <p className={`mt-3 text-[12px] font-medium capitalize ${a?.mentioned ? SENT[a.sentiment] ?? "text-zinc-500" : "text-zinc-400"}`}>Sentiment: {a?.sentiment ?? "n/a"}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export const instant = false;
