"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "aim"; text?: string; paras?: string[]; chips?: string[]; run?: { id: number; agent: string; steps: { tool: string; detail: string }[] } | null };

const SUGGESTIONS = [
  "How visible is Wrenfield in AI Search this month?",
  "Which high-volume prompts don't mention us?",
  "Draft a launch brief for the endurance line",
  "Find the media outlets quoting old specs and prep outreach",
];

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
      )}
    </>
  );
}

export function AimChat({ workspace }: { workspace: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/aim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "aim", paras: data.reply, chips: data.chips, run: data.run }]);
    } catch {
      setMsgs((m) => [...m, { role: "aim", paras: ["Something went wrong — please try again."] }]);
    }
    setBusy(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="flex h-[calc(100dvh)] flex-col">
      {msgs.length === 0 ? (
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full border border-zinc-200 px-3 py-1 text-[12.5px] text-zinc-600">Auto · Medium ⌄</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-zinc-900">Where should we start, {workspace.split(" ")[0]}?</h1>
          <p className="mt-2 text-[15px] text-zinc-500">Your AI Marketer knows your brand context. Ask, analyze, or put it to work.</p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl flex-1 space-y-5 overflow-y-auto px-6 py-8">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-[14.5px] text-white">{m.text}</div>
            ) : (
              <div key={i} className="space-y-2">
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400"><span>✦</span> AI Marketer</p>
                {m.chips?.map((c) => (
                  <span key={c} className="mr-1.5 inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 text-[12px] text-zinc-500 ring-1 ring-zinc-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{c}</span>
                ))}
                {m.paras?.map((p, j) => <p key={j} className="text-[14.5px] leading-relaxed text-zinc-700"><Rich text={p} /></p>)}
                {m.run && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                    <p className="text-[12.5px] font-semibold text-zinc-800">{m.run.agent} · Run #{m.run.id} <Link href="/app/agent-runs" className="ml-1 font-normal text-indigo-600 hover:underline">View run →</Link></p>
                    <ol className="mt-2 space-y-1.5">
                      {m.run.steps.map((s, j) => (
                        <li key={j} className="flex gap-2 text-[12.5px] text-zinc-600"><span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" /><span><span className="font-mono text-[11.5px] text-zinc-800">{s.tool}</span> — {s.detail}</span></li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )
          )}
          {busy && (
            <div className="flex items-center gap-2 text-[13px] text-zinc-400">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" /> Working…
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
      <div className="mx-auto w-full max-w-2xl px-6 pb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {(msgs.length === 0 ? SUGGESTIONS : ["Analyze visibility", "Find citation gaps", "Launch an Agent"]).map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[12.5px] text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900">{s}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm focus-within:border-zinc-400">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Aim anything about your AI Search performance…" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14.5px] outline-none placeholder:text-zinc-400" />
          <button type="submit" disabled={busy || !input.trim()} className="rounded-xl bg-zinc-900 px-3.5 py-2 text-[13px] font-medium text-white disabled:opacity-40">↑</button>
        </form>
        <p className="mt-2 text-center text-[11px] text-zinc-400">Aim can make mistakes. Verify important outputs.</p>
      </div>
    </div>
  );
}
