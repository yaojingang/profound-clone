import Link from "next/link";
import { Hero, ProductDemo, LogoWall, RoleTabs, ResearchGrid } from "@/components/home-sections";
import { StackedShareBar } from "@/components/charts";

const CHAT_DEMOS = [
  {
    user: "Find the pages we are losing in AI answers and rewrite them. Stage everything, do not publish.",
    ai: "Rewrote 9 pages against what people are actually asking. All staged as drafts, nothing live.",
    artifact: {
      title: "Pages", cta: "Publish",
      rows: [["/guides/best-e-bikes-2026", "2 changes"], ["/guides/buyers-guide-to-sustainability", "10 changes"], ["/blog/sf-commuters-ratings", "5 changes"], ["/blog/popular-e-bike-decal-kits", "8 changes"], ["/blog/updates-to-our-arc-e-bike", "3 changes"], ["/blog/fathers-day-gifts-2026", "3 changes"]],
    },
  },
  {
    user: "Turn our CEO's sustainability keynote into a buyer's guide, plus cutdowns for every channel.",
    ai: "Buyer's Guide is done - 2,400 words. Six channel cutdowns done. Newsletter still drafting.",
    artifact: {
      title: "Deliverables", cta: "Review",
      rows: [["Pillar, 2,400 words", "Draft, ready for review"], ["LinkedIn, 3 posts", "Draft, in your queue"], ["Newsletter", "Writing..."]],
    },
  },
  {
    user: "Write next week's posts in our voice using our Thought Leader Agent. Generate the images too.",
    ai: "Seven posts, three aspect ratios each. Images generated and captions written.",
    artifact: {
      title: "Preview", cta: "Queue",
      rows: [["10,000 riders. That number is still a pinch-me moment.", "Post 1 of 7"], ["When we started, people told us ebikes were a niche product…", "Post 2 of 7"]],
    },
  },
  {
    user: "Where do we show up in sponsored answers today?",
    ai: "I noticed Wrenfield is invisible in AI Search for “e-bike with best battery life.” I built ads targeting those prompts with a bid strategy based on previous campaigns. Ready for you.",
    artifact: {
      title: "“e-bike with best battery life”", cta: "Approve",
      rows: [["18,400 / mo", "Prompt volume"], ["Not cited", "Wrenfield today"], ["3 competitors cited", "Opportunity"]],
    },
  },
];

const CONTEXT_CARDS = [
  {
    h: "Know what people are asking AI",
    p: "Analyze billions of real user conversations and understand intent.",
    a: ["See Prompt Volumes", "/features/prompt-volumes"],
    viz: "prompts" as const,
  },
  {
    h: "Understand what AI says back",
    p: "Uncover how Answer Engines describe your category.",
    a: ["See Answer Engine Insights", "/features/answer-engine-insights"],
    viz: "visibility" as const,
  },
  {
    h: "Real-time brand context to power Agents you trust",
    p: "When your positioning shifts, so does your AI Marketer.",
    a: ["See Context Manager", "/features/context-manager"],
    viz: "context" as const,
  },
];

const QUOTES = [
  ["50%", "increase in Plaid's AI Search visibility while saving time with Profound Agents", "Hannah Hughes · Chief Marketing Officer"],
  ["30%", "Time saved using Profound Agents", "Fiona Erickson · Organic Acquisition Team Lead"],
  ["100x", "Increase in monthly revenue from AI systems for one client", "Kevin Miller · Chief Executive Officer"],
  ["7x", "Increase in brand visibility for key topic", "Robert Lipman · Visibility Engineer"],
  ["16", "competitors surpassed in visibility rankings using suggestions from their AI Marketer", "Marla Davies · Head of Content"],
];

const DATA_CARDS: [string, string, string][] = [
  ["Prove impact on AI-driven traffic", "Understand how bots view, cite, and refer to your pages.", "/features/agent-analytics"],
  ["Benchmark your site against peers", "Understand how your performance compares to industry peers.", "/features/agent-analytics"],
  ["Verify the accuracy of AI claims", "Combat where AI is spreading misinformation about your brand.", "/features/answer-engine-insights"],
  ["Measure your brand's sentiment in Answer Engines", "Understand the narrative and the sources driving it.", "/features/answer-engine-insights"],
  ["Track how visible your products are in ChatGPT Shopping", "Get SKU-level granularity across merchants and retailers.", "/features/shopping"],
];

function AgentRunsChart() {
  const pts = [8, 14, 11, 19, 24, 21, 30, 38, 34, 46, 55, 61, 58, 70, 78, 86, 94, 105, 118, 130];
  const max = 150;
  return (
    <div className="flex h-28 items-end gap-1">
      {pts.map((p, i) => (
        <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-indigo-500/40 to-indigo-400" style={{ height: `${(p / max) * 100}%` }} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductDemo />
      <LogoWall />

      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <p className="text-3xl font-light leading-snug text-zinc-500 md:text-4xl">
          <span className="text-white">The rise of AI Search</span> created an impossible amount of work for marketers
        </p>
      </section>

      <RoleTabs />

      {/* chat demos */}
      <section className="mx-auto max-w-6xl space-y-8 px-6 pb-24">
        {CHAT_DEMOS.map((d, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs">You</span>
                  <p className="text-[15px] leading-relaxed text-zinc-200">{d.user}</p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs text-black">✦</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">AI Marketer</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-zinc-300">{d.ai}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">{d.artifact.title}</p>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-black">{d.artifact.cta}</span>
                </div>
                <div className="space-y-2">
                  {d.artifact.rows.map(([a, b]) => (
                    <div key={a} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
                      <span className="truncate pr-2 text-zinc-300">{a}</span>
                      <span className="shrink-0 text-zinc-500">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* context */}
      <section className="border-y border-white/10 bg-gradient-to-b from-transparent via-white/[0.025] to-transparent py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight">Underpinned by the context marketers need</h2>
          <p className="mt-3 text-zinc-400">Every AI Search signal and a living synthesis of your brand's data.</p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <div className="mb-6 space-y-2 text-sm">
                {[["coffee", "74.6M"], ["coffee shop", "4M"], ["minimal coffee shop", "3.5M"], ["local coffee shop", "4M"], ["travertine coffee table", "3.5M"]].map(([t, v]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
                    <span className="text-zinc-300">{t}</span><span className="tabular-nums text-zinc-500">{v}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-medium">Know what people are asking AI</h3>
              <p className="mt-1.5 text-sm text-zinc-400">Analyze billions of real user conversations and understand intent.</p>
              <Link href="/features/prompt-volumes" className="mt-3 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">See Prompt Volumes →</Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <div className="mb-6">
                <StackedShareBar items={[
                  { label: "Social", pct: 13.2, color: "#c084fc" },
                  { label: "Competition", pct: 12.1, color: "#fb7185" },
                  { label: "Earned", pct: 10.6, color: "#60a5fa" },
                  { label: "Owned", pct: 3.6, color: "#4ade80" },
                  { label: "Blog", pct: 1.0, color: "#fb923c" },
                  { label: "Other", pct: 59.5, color: "#52525b" },
                ]} />
                <div className="mt-8 flex h-24 items-end gap-1.5">
                  {[20, 26, 23, 31, 29, 38, 42, 39, 47, 52, 49, 58].map((v, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/30 to-emerald-400" style={{ height: `${v * 1.6}%` }} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Reclaim rank #2 on AI Brand Visibility · Visibility Score by Platform</p>
              </div>
              <h3 className="text-lg font-medium">Understand what AI says back</h3>
              <p className="mt-1.5 text-sm text-zinc-400">Uncover how Answer Engines describe your category.</p>
              <Link href="/features/answer-engine-insights" className="mt-3 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">See Answer Engine Insights →</Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <div className="mb-6 space-y-2.5 text-sm">
                {[["Positioning v3 (live)", "green"], ["Voice & tone guide", "green"], ["Spec sheet 2026-Q3", "amber"], ["Retired: 'SilentDrive' claim", "red"]].map(([t, c]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5">
                    <span className="text-zinc-300">{t}</span>
                    <span className={`h-2 w-2 rounded-full ${c === "green" ? "bg-emerald-400" : c === "amber" ? "bg-amber-400" : "bg-rose-400"}`} />
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-medium">Real-time brand context to power Agents you trust</h3>
              <p className="mt-1.5 text-sm text-zinc-400">When your positioning shifts, so does your AI Marketer.</p>
              <Link href="/features/context-manager" className="mt-3 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">See Context Manager →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* quotes */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-medium tracking-tight">Engineered for marketers with higher standards</h2>
          <p className="mt-3 text-zinc-400">The world's first AI harness for marketing built for masters of their craft.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.slice(0, 3).map(([n, q, a]) => (
            <div key={n} className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="text-4xl font-medium text-white">{n}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{q}</p>
              <p className="mt-5 text-xs text-zinc-500">{a} · <span className="underline underline-offset-4">View story</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* data loop */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-4xl font-medium tracking-tight">Reinforced by every new data point</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">Your AI Marketer learns from what worked, closing the loop between action and result.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DATA_CARDS.map(([t, p, href], i) => (
            <Link key={t} href={href} className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-colors hover:border-white/25">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">{["📊", "📈", "✓", "💬", "🛒"][i]}</div>
              <p className="text-[17px] font-medium leading-snug">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{p}</p>
              <p className="mt-4 text-sm text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100">See module →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* enterprise */}
      <section className="border-y border-white/10 bg-gradient-to-b from-transparent via-white/[0.025] to-transparent py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight">Enterprise capabilities trusted by a third of the Fortune 100</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <h3 className="text-lg font-medium">Track real transformation with Command Center</h3>
              <p className="mt-1.5 text-sm text-zinc-400">See how Agents are being deployed across your marketing team.</p>
              <div className="mt-6 rounded-xl border border-white/10 bg-black/50 p-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm text-zinc-400">Agent Runs</p>
                  <p className="text-xs text-zinc-600">All time</p>
                </div>
                <p className="mt-1 text-3xl font-semibold tabular-nums">263,867</p>
                <div className="mt-4"><AgentRunsChart /></div>
                <div className="mt-2 flex justify-between text-[10px] text-zinc-600"><span>Apr 17</span><span>Sep 7</span></div>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-sm text-zinc-400">Agent Usage by Category</p>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full">
                    {[34, 22, 18, 14, 12].map((w, i) => <div key={i} style={{ width: `${w}%`, background: ["#a78bfa", "#60a5fa", "#4ade80", "#fbbf24", "#fb7185"][i] }} />)}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-zinc-600"><span>P20</span><span>P40</span><span>P60</span><span>P80</span><span>P100</span></div>
                </div>
                <div className="mt-5 flex gap-8 border-t border-white/10 pt-4">
                  <div><p className="text-xs text-zinc-500">Active Users</p><p className="text-xl font-semibold tabular-nums">525</p></div>
                  <div><p className="text-xs text-zinc-500">Power Users</p><p className="text-xl font-semibold tabular-nums">87</p></div>
                </div>
              </div>
              <Link href="/app/dashboards" className="mt-4 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">Explore Command Center →</Link>
            </div>
            <div className="grid gap-5">
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="text-lg font-medium">RBAC, SCIM, SOC 2</h3>
                <p className="mt-1.5 text-sm text-zinc-400">An AI platform that supports your unique governance.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["SOC 2 Type II", "GDPR", "SSO / SAML", "SCIM", "RBAC", "Audit logs"].map((b) => (
                    <span key={b} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">{b}</span>
                  ))}
                </div>
                <Link href="/enterprise" className="mt-4 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">Explore enterprise security →</Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="text-lg font-medium">200+ Integrations</h3>
                <p className="mt-1.5 text-sm text-zinc-400">Extend the capability of your existing stack with ease.</p>
                <div className="mt-4 flex flex-wrap gap-2 opacity-80">
                  {["Slack", "Notion", "Contentful", "WordPress", "GA4", "Looker", "Teams", "Webflow"].map((b) => (
                    <span key={b} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">{b}</span>
                  ))}
                </div>
                <Link href="/integrations" className="mt-4 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">Browse integrations →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ResearchGrid />

      {/* final CTA */}
      <section className="border-y border-white/10 py-28 text-center">
        <h2 className="mx-auto max-w-3xl px-6 text-4xl font-medium tracking-tight md:text-5xl">The frontier marketing platform to win AI Search</h2>
        <p className="mx-auto mt-4 max-w-2xl px-6 text-zinc-400">Reach millions of consumers who are using AI to discover new products and brands.</p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Get a demo</Link>
          <Link href="/signup" className="rounded-full bg-zinc-800/80 px-6 py-3 text-[15px] font-medium ring-1 ring-white/15 hover:bg-zinc-700/80">Get started</Link>
        </div>
      </section>
    </>
  );
}
