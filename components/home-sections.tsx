"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ---------------- Hero with rotating engine name ---------------- */
const ENGINES = ["ChatGPT", "Perplexity", "Claude", "Gemini", "Microsoft Copilot", "DeepSeek", "AI Overviews", "AI search platforms"];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx((i) => (i + 1) % ENGINES.length); setFading(false); }, 350);
    }, 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[-20%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.055] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[500px] rounded-full bg-white/[0.03] blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-32">
        <h1 className="text-balance text-5xl font-medium leading-[1.08] tracking-tight md:text-[64px]">
          The AI marketing platform to win in
          <span className={`mt-1 block font-normal text-zinc-100 transition-all duration-300 ${fading ? "translate-y-2 opacity-0 blur-sm" : "translate-y-0 opacity-100 blur-0"}`}>
            {ENGINES[idx]}
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-relaxed text-zinc-400 md:text-[21px]">
          Multiply what you can accomplish with an AI Marketer trained on what consumers prompt, what agents cite, and the context only your teams have.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black transition-opacity hover:opacity-85">Get a demo</Link>
          <Link href="/signup" className="rounded-full bg-zinc-800/80 px-6 py-3 text-[15px] font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-zinc-700/80">Get started</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Wrenfield product demo ---------------- */
const DEMO_RECENTS: Record<string, { prompt: string; reply: string; steps: string[] }> = {
  "AEO content": {
    prompt: "Find an opportunity to improve Wrenfield's visibility in AI answers and create content for it.",
    reply: "Found 3 gaps. Drafted a 1,800-word pillar targeting “e-bike with best battery life.” Staged in CMS.",
    steps: ["Brainstorm capabilities", "Scrubbing YouTube videos"],
  },
  "Paid ads campaign": {
    prompt: "Build a sponsored-answer campaign for prompts we never win organically.",
    reply: "8 prompts selected by volume × intent. Creatives drafted, bid strategy cloned from Q2.",
    steps: ["Ranking prompt volume", "Cloning bid strategy"],
  },
  "Landing page": {
    prompt: "Create a landing page for our e-bike battery campaign.",
    reply: "Landing page drafted with FAQ schema. Conversion copy tested against 10x-research patterns.",
    steps: ["Reading brand context", "Composing landing page"],
  },
};

export function ProductDemo() {
  const [recent, setRecent] = useState("AEO content");
  const demo = DEMO_RECENTS[recent];
  return (
    <section className="border-b border-white/10 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="pt-16 text-center text-2xl font-medium text-zinc-300">See your AI Marketer at work</h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/12 bg-[#070708] shadow-2xl shadow-black">
          <div className="flex min-h-[560px]">
            {/* sidebar */}
            <div className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-black/40 p-3 md:flex">
              <div className="flex items-center justify-between rounded-lg px-2 py-1.5">
                <span className="flex items-center gap-2 text-sm font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-700 text-[10px]">w.</span> Wrenfield</span>
                <span className="text-zinc-500">⌄</span>
              </div>
              <div className="mt-3 grid grid-cols-2 rounded-lg bg-white/5 p-1 text-center text-xs text-zinc-400">
                <span className="rounded-md bg-white/10 py-1.5 text-white">AI Marketer</span>
                <span className="py-1.5">Analytics</span>
              </div>
              <nav className="mt-4 space-y-0.5 text-sm text-zinc-300">
                {[["✦", "AI Marketer"], ["▤", "Projects"], ["❋", "Context Manager"], ["⑃", "Agents"], ["▦", "Sheets"], ["📄", "Documents"]].map(([icon, label]) => (
                  <div key={label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${label === "AI Marketer" ? "bg-white/8 text-white" : ""}`}>
                    <span className="w-4 text-center text-xs opacity-70">{icon}</span> {label}
                  </div>
                ))}
              </nav>
              <p className="mt-6 px-2.5 text-xs text-zinc-500">Recents ⌄</p>
              {Object.keys(DEMO_RECENTS).map((r) => (
                <button key={r} onClick={() => setRecent(r)} className={`mt-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${recent === r ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5"}`}>
                  <span className="text-orange-400">✶</span> {r}
                </button>
              ))}
              <div className="mt-auto flex items-center justify-between px-2 text-zinc-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs">?</span>
                <span className="text-xs">▢</span>
              </div>
            </div>
            {/* chat */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 text-sm text-zinc-300">
                <span>{recent} <span className="ml-1 text-zinc-500">⌄</span></span>
                <span className="text-zinc-500">···</span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-8 md:px-14">
                <div className="ml-auto max-w-md rounded-2xl rounded-br-sm bg-zinc-800/90 px-4 py-3 text-[15px] text-zinc-100">{demo.prompt}</div>
                <div>
                  <p className="mb-2 text-xs text-zinc-500">Working for 9s</p>
                  <div className="flex flex-wrap gap-2">
                    {demo.steps.map((s) => (
                      <span key={s} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="max-w-lg text-[15px] leading-relaxed text-zinc-300">{demo.reply}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-3.5 text-sm text-zinc-500">
                  Ask a question or make a change
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">↑</span>
                </div>
              </div>
            </div>
            {/* preview */}
            <div className="hidden w-[300px] shrink-0 border-l border-white/10 p-3 lg:block">
              <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="rounded bg-white/10 px-1.5 py-0.5">▤</span> Battery landing p… <span className="ml-auto text-zinc-500">×</span></div>
              <div className="mt-3 rounded-xl border border-white/10 bg-[#f5f4ef] p-4 text-black">
                <div className="flex items-center justify-between text-xs font-semibold"><span className="text-sm">wrenfield.</span><span className="rounded-full border border-black/20 px-2 py-0.5">Battery guide ↗</span></div>
                <p className="mt-6 text-[10px] font-semibold tracking-widest text-green-700">• THE EVERYDAY ELECTRIC</p>
                <p className="mt-1 text-2xl font-semibold leading-tight">More rides. <span className="text-zinc-400">Zero range anxiety.</span></p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">The new Arc carries 88 miles of city riding on a single charge — with a battery you can swap in 30 seconds.</p>
                <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-zinc-300 to-zinc-400" />
                <div className="mt-3 space-y-1.5">
                  {[88, 64, 72].map((w, i) => <div key={i} className="h-1.5 rounded bg-zinc-300" style={{ width: `${w}%` }} />)}
                </div>
              </div>
              <div className="mt-2 flex justify-end"><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black">↓ Export</span></div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-zinc-600">An interactive product demonstration. Select a project under Recents to change the content.</p>
      </div>
    </section>
  );
}

/* ---------------- Logo wall ---------------- */
const LOGOS = ["ESTĒE LAUDER", "RBC", "MONSTER", "Walmart ✷", "ramp ⤵", "COMCAST", "WHOOP", "clay", "ubank", "MEJURI"];

export function LogoWall() {
  return (
    <section className="border-b border-white/10 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-400">Powering leading marketing teams</p>
          <Link href="/customers" className="text-sm text-zinc-400 transition-colors hover:text-white">Meet our customers →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-5">
          {LOGOS.map((l) => (
            <div key={l} className="flex h-20 items-center justify-center bg-black text-[15px] font-semibold tracking-wide text-zinc-200">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Role tabs ---------------- */
const ROLES: [string, string, string][] = [
  ["AEO/SEO", "Wins AI answers by creating, optimizing, and influencing the pages behind them", "Rewrites pages with citation decay and stages them in your CMS. Builds the pages for questions you have no answer for. Opens up content AI crawlers cannot currently read."],
  ["Content", "Fills your content calendar without waiting for more copywriting bandwidth", "Goes from insight to brief to finished content with a cutdown for every channel. Produces content worth reading at scale."],
  ["Social", "Runs your social calendar while keeping your unique voice and POV", "Generates posts and images, sized per platform. Turns a long-form piece into a thread that actually reads like one. Drafts replies to the comments worth answering."],
  ["Growth", "Captures the AI search demand you cannot earn organically", "Finds the high-volume prompts where you never show up organically, writes sponsored answer creative for each one, and stages the campaign for your approval."],
  ["PR and Comms", "Chases down the wrong story at the source", "Traces inaccurate claims back to the publishers repeating them, drafts a personalized correction for each one, and tracks which ones actually updated."],
  ["Product Marketing", "Turns a product brief into everything a launch needs", "Generates the messaging, one-pager, FAQ, and enablement assets from a product brief, keeps every version consistent, and packages it for your review."],
  ["Brand", "Keeps the brand consistent everywhere it appears", "Scans every surface you own for retired names, off-brand claims, and stale creative, then rewrites and republishes what it finds."],
];

export function RoleTabs() {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-4xl font-medium tracking-tight md:text-5xl">Your AI Marketer makes it possible</h2>
      <p className="mt-4 text-center text-lg text-zinc-400">It identifies the work worth doing, drafts it, and pings you for approval.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {ROLES.map(([label], i) => (
          <button key={label} onClick={() => setActive(i)} className={`rounded-full px-4 py-2 text-sm transition-colors ${active === i ? "bg-white text-black" : "bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10"}`}>{label}</button>
        ))}
      </div>
      <div key={active} className="pf-fade-up mx-auto mt-12 max-w-3xl text-center">
        <h3 className="text-2xl font-medium leading-snug text-zinc-100 md:text-[28px]">{ROLES[active][1]}</h3>
        <p className="mt-4 leading-relaxed text-zinc-400">{ROLES[active][2]}</p>
      </div>
    </section>
  );
}

/* ---------------- Research tabs ---------------- */
const RESEARCH: Record<string, [string, string, string][]> = {
  Popular: [
    ["The AI mention effect", "Nikolas Laskaris", "1 Jul, 2026"],
    ["Commercial conversations in ChatGPT more than doubled in a year", "Davis McCain", "13 Aug, 2026"],
    ["Is once a day enough?", "Jennifer Zou", "8 Jul, 2026"],
    ["Does AI keep office hours?", "Jennifer Zou", "16 Jul, 2026"],
    ["Where do AI citations come from?", "Jasman Singh", "30 Jul, 2026"],
    ["The Parrot Problem: why AI Search has a second dimension", "Jasman Singh", "22 Jul, 2026"],
  ],
  "Answer Engines": [
    ["The state of AI Search in travel", "Davis McCain", "9 Jul, 2026"],
    ["What ChatGPT actually looks for in AI Shopping", "Allen Wu", "2 Jul, 2026"],
    ["Model choice, privacy, and task allocation", "Research team", "28 Jun, 2026"],
    ["How people use answer engines", "Data science", "14 Jun, 2026"],
  ],
  "Industry verticals": [
    ["Christmas in July: how retailers win the AI shelf", "Allen Wu", "9 Jul, 2026"],
    ["The new rules of AI search for fashion and beauty", "Research team", "1 Jul, 2026"],
    ["What US and UK consumers ask AI about money", "Research team", "18 Jun, 2026"],
    ["Platform choice in the consumer AI assistant market", "Research team", "5 Jun, 2026"],
  ],
};

export function ResearchGrid() {
  const [tab, setTab] = useState("Popular");
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight">Backed by industry-leading research and data science</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">Stay at the frontier of agentic marketing and AI Search with proprietary, bleeding-edge insights.</p>
        </div>
        <Link href="/blog" className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/10">See All ↗</Link>
      </div>
      <div className="mt-8 flex gap-2">
        {Object.keys(RESEARCH).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm transition-colors ${tab === t ? "bg-white text-black" : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"}`}>{t}</button>
        ))}
      </div>
      <div key={tab} className="pf-fade-up mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RESEARCH[tab].map(([title, author, date]) => (
          <Link key={title} href="/blog" className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 transition-colors hover:border-white/25">
            <div className="mb-8 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800/60 to-zinc-900 opacity-70"><svg viewBox="0 0 60 28" className="h-7 w-14"><polyline points="2,24 12,18 22,20 32,10 42,13 52,4 58,6" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <p className="text-[17px] font-medium leading-snug text-zinc-100 group-hover:text-white">{title}</p>
            <p className="mt-2 text-sm text-zinc-500">By {author} · {date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
