"use client";

import { useState } from "react";

/* A small gallery of product-UI vignettes used across feature pages. */

// Sections across feature pages reuse a shared gallery of vignettes;
// aliases map every viz name used in lib/features.ts onto one of them.
const VIZ_ALIAS: Record<string, string> = {
  brain: "graph",
  personal: "graph",
  synthesize: "graph",
  dashboard: "visibility",
  impact: "visibility",
  intent: "prompts",
  publish: "brief",
  handoff: "brief",
  collab: "brief",
  cms: "brief",
  compete: "benchmark",
  trust: "security",
  connect: "security",
  docs: "templates",
  scale: "templates",
  how: "templates",
  gaps: "alert",
};

export function FeatureViz({ kind }: { kind: string }) {
  const k = VIZ_ALIAS[kind] ?? kind;
  switch (k) {
    case "visibility":
      return (
        <VizShell title="Visibility Score by Platform">
          <div className="flex h-32 items-end gap-2">
            {[42, 36, 21, 29, 17, 33, 44, 39, 47, 52, 49, 58].map((v, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/30 to-emerald-400" style={{ height: `${v * 1.6}%` }} />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-zinc-500"><span>Apr</span><span>Jun</span><span>Sep</span></div>
        </VizShell>
      );
    case "citations":
      return (
        <VizShell title="Citation categories">
          <div className="flex h-9 w-full overflow-hidden rounded-lg">
            {[["Social", 13.2, "#c084fc"], ["Competition", 12.1, "#fb7185"], ["Earned", 10.6, "#60a5fa"], ["Owned", 3.6, "#4ade80"], ["Blog", 1.0, "#fb923c"], ["Other", 59.5, "#52525b"]].map(([l, p, c]) => (
              <div key={l as string} className="flex items-center justify-center text-[10px] text-black/80" style={{ width: `${p as number}%`, background: c as string }}>{p as number >= 3 ? `${p}%` : ""}</div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {[["1", "nerdwallet.com", "Earned", "4.22%"], ["2", "bikeradar.com", "Earned", "3.87%"], ["3", "wrenfield.co", "Owned", "3.41%"]].map(([r, d, c, s]) => (
              <div key={d} className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
                <span className="text-zinc-500">{r}</span><span className="flex-1 text-zinc-200">{d}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-zinc-400">{c}</span>
                <span className="tabular-nums text-zinc-300">{s}</span>
              </div>
            ))}
          </div>
        </VizShell>
      );
    case "sentiment":
      return (
        <VizShell title="Sentiment by engine">
          {[["ChatGPT", 58], ["Perplexity", 51], ["Claude", 62], ["Gemini", 47]].map(([e, v]) => (
            <div key={e as string} className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-zinc-400"><span>{e}</span><span>{v}% positive</span></div>
              <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                <div style={{ width: `${v}%`, background: "#4ade80" }} />
                <div style={{ width: `${88 - (v as number)}%`, background: "#e4e4e7" }} />
                <div style={{ width: `${12}%`, background: "#fb7185" }} />
              </div>
            </div>
          ))}
        </VizShell>
      );
    case "factcheck":
      return (
        <VizShell title="FactCheck">
          {[["“Wrenfield bikes have 30-mile max range”", "Inaccurate", "#fb7185"], ["“Wrenfield went out of business”", "False", "#fb7185"], ["“10-year battery warranty”", "Unverified", "#fbbf24"]].map(([c, v, col]) => (
            <div key={c} className="mb-2 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-xs">
              <span className="text-zinc-300">{c}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${col}22`, color: col as string }}>{v}</span>
            </div>
          ))}
        </VizShell>
      );
    case "traffic":
      return (
        <VizShell title="AI agent traffic · last 30 days">
          <div className="flex h-28 items-end gap-1">
            {[12, 15, 13, 18, 22, 20, 26, 24, 30, 34, 31, 38, 42, 39, 47, 52, 49, 56, 61, 58].map((v, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/30 to-violet-400" style={{ height: `${v * 1.5}%` }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] text-zinc-500">
            {[["GPTBot", "18.2k"], ["ClaudeBot", "10.1k"], ["PerplexityBot", "12.7k"], ["Google-Ext", "16.4k"]].map(([b, v]) => (
              <div key={b} className="rounded-lg bg-white/[0.04] py-2"><p className="text-zinc-300">{v}</p>{b}</div>
            ))}
          </div>
        </VizShell>
      );
    case "benchmark":
      return (
        <VizShell title="Benchmark vs industry peers">
          <div className="space-y-3">
            {[["You", 68, "#4ade80"], ["P40", 42, "#52525b"], ["P60", 55, "#52525b"], ["P80", 71, "#52525b"]].map(([l, v, c]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-xs text-zinc-400"><span>{l}</span><span>{v}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }} /></div>
              </div>
            ))}
          </div>
        </VizShell>
      );
    case "security":
      return (
        <VizShell title="Integrations">
          <div className="flex flex-wrap gap-2">
            {["Cloudflare", "Akamai", "Fastly", "AWS CloudFront", "Vercel", "Netlify", "GCP CDN", "GA4"].map((i) => (
              <span key={i} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">{i}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">One DNS/CDN toggle. No code changes. SOC 2 Type II.</p>
        </VizShell>
      );
    case "templates":
      return (
        <VizShell title="Agent templates">
          <div className="grid grid-cols-2 gap-2">
            {[["AEO Content Engine", "Content"], ["Citation Recovery", "AEO"], ["FactCheck Sentinel", "Monitoring"], ["Prompt Bidder", "Growth"]].map(([n, c]) => (
              <div key={n} className="rounded-lg bg-white/[0.04] p-3 text-xs">
                <p className="text-zinc-200">{n}</p><p className="mt-0.5 text-[10px] text-zinc-500">{c}</p>
              </div>
            ))}
          </div>
        </VizShell>
      );
    case "prompts":
      return (
        <VizShell title="Real prompt volume">
          {[["best e-bike with long battery life", "18.4k"], ["do e-bikes need insurance", "14k"], ["longest range electric bike", "15.8k"], ["wrenfield vs rad power", "5.4k"]].map(([p, v]) => (
            <div key={p} className="mb-2 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className="text-zinc-300">{p}</span><span className="tabular-nums text-zinc-500">{v}/mo</span>
            </div>
          ))}
        </VizShell>
      );
    case "graph":
      return (
        <div className="relative flex h-full min-h-56 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] p-4">
          <svg viewBox="0 0 300 200" className="w-full">
            {(() => {
              const nodes = [[150, 100, "e-bike", 34], [70, 55, "commuter", 22], [230, 50, "battery", 26], [80, 150, "cargo", 18], [225, 150, "range", 24], [150, 30, "city", 16]];
              const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [2, 4]];
              return (
                <>
                  {edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="white" strokeOpacity="0.15" />)}
                  {nodes.map(([x, y, label, r], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r={r as number / 2} fill={i === 0 ? "#a78bfa" : "#71717a"} fillOpacity={i === 0 ? 0.9 : 0.5} />
                      <text x={x} y={(y as number) + (r as number) / 2 + 10} textAnchor="middle" fill="#d4d4d8" style={{ fontSize: 9 }}>{label}</text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      );
    case "shopping":
      return (
        <VizShell title="ChatGPT Shopping shelf">
          {[["Wrenfield Arc", "61%", "wrenfield.co"], ["Commuter Pro", "57%", "wrenfield.co"], ["Commuter Lite", "38%", "bestbuy.com"], ["Trailhead GT", "33%", "wrenfield.co"]].map(([n, v, m]) => (
            <div key={n} className="mb-2 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className="text-zinc-200">{n}</span>
              <span className="flex items-center gap-2 text-zinc-500"><span>{m}</span><span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-300">{v}</span></span>
            </div>
          ))}
        </VizShell>
      );
    case "alert":
      return (
        <VizShell title="Opportunities">
          {[["high", "“e-bike with best battery life” — 18.4k/mo, not cited"], ["medium", "Citation decay on /guides/best-e-bikes-2026"], ["high", "Sentiment drop on Copilot after pricing change"]].map(([p, t]) => (
            <div key={t} className="mb-2 flex items-start gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${p === "high" ? "bg-rose-400" : "bg-amber-400"}`} />
              <span className="text-zinc-300">{t}</span>
            </div>
          ))}
        </VizShell>
      );
    case "brief":
      return (
        <VizShell title="Opportunity brief">
          <div className="space-y-2 text-xs text-zinc-300">
            <p className="text-sm font-medium text-zinc-100">Brief: win “best e-bike battery life”</p>
            <p className="text-zinc-500">Volume 18.4k/mo · 3 competitors cited · intent: commercial</p>
            <div className="rounded-lg bg-white/[0.04] p-3 leading-relaxed">Draft a comparison pillar targeting the 6 sub-questions engines pull from. Cite range test data from our 2026 battery study. Target domains: nerdwallet, bikeradar.</div>
            <span className="inline-block rounded-lg bg-white px-3 py-1.5 font-medium text-black">Hand off to Agent →</span>
          </div>
        </VizShell>
      );
    default:
      return (
        <VizShell title="Profound">
          <div className="flex h-24 items-center justify-center text-3xl opacity-40">✦</div>
        </VizShell>
      );
  }
}

function VizShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4">
      <p className="mb-3 text-xs font-medium text-zinc-400">{title}</p>
      {children}
    </div>
  );
}
