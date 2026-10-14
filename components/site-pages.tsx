import Link from "next/link";
import { db } from "@/lib/db";
import { PageHero, SectionHead } from "@/components/marketing-kit";
import { FeatureViz } from "@/components/feature-viz";

export function CustomersPage() {
  const stories: [string, string, string, string][] = [
    ["Plaid", "50%", "increase in Plaid's AI Search visibility while saving time with Profound Agents", "Hannah Hughes · Chief Marketing Officer"],
    ["MongoDB", "30%", "time saved using Profound Agents", "Fiona Erickson · Organic Acquisition Team Lead"],
    ["Gr0", "100x", "increase in monthly revenue from AI systems for one client", "Kevin Miller · Chief Executive Officer"],
    ["Ramp", "7x", "increase in brand visibility for key topic", "Robert Lipman · Visibility Engineer"],
    ["Zoom", "16", "competitors surpassed in visibility rankings for key topic using suggestions from their AI Marketer", "Marla Davies · Head of Content & Customer Advocacy"],
  ];
  return (
    <>
      <PageHero title="The world's best marketing teams win with Profound" sub="From Fortune 100 brands to fast-moving startups, teams use Profound to win AI Search." />
      <section className="border-b border-white/10 py-14">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-semibold text-zinc-500">
          {["ESTĒE LAUDER", "RBC", "MONSTER", "Walmart ✷", "ramp ⤵", "COMCAST"].map((l) => <span key={l}>{l}</span>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map(([brand, n, q, a]) => (
            <div key={brand} className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="text-sm font-semibold text-zinc-500">{brand}</p>
              <p className="mt-4 text-4xl font-medium">{n}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{q}</p>
              <p className="mt-5 text-xs text-zinc-600">{a}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-white/10 py-24 text-center">
        <h2 className="text-3xl font-medium md:text-4xl">Become our next customer story</h2>
        <Link href="/contact-sales" className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Get a demo</Link>
      </section>
    </>
  );
}

export function BlogPage() {
  const posts: [string, string, string, string][] = [
    ["The AI mention effect", "Nikolas Laskaris", "1 Jul, 2026", "Research"],
    ["Commercial conversations in ChatGPT more than doubled in a year", "Davis McCain", "13 Aug, 2026", "Research"],
    ["Is once a day enough?", "Jennifer Zou", "8 Jul, 2026", "Data Science"],
    ["Does AI keep office hours?", "Jennifer Zou", "16 Jul, 2026", "Data Science"],
    ["Where do AI citations come from?", "Jasman Singh", "30 Jul, 2026", "Research"],
    ["The Parrot Problem: why AI Search has a second dimension", "Jasman Singh", "22 Jul, 2026", "Research"],
    ["The state of AI Search in travel", "Davis McCain", "9 Jul, 2026", "Industry"],
    ["Christmas in July: how retailers win the AI shelf", "Allen Wu", "9 Jul, 2026", "Retail"],
    ["What ChatGPT actually looks for in AI Shopping", "Allen Wu", "2 Jul, 2026", "Retail"],
    ["Profound launches Workflows", "Profound team", "26 Jun, 2026", "Product"],
    ["Profound raises $180M Series D", "Profound team", "12 Jun, 2026", "Company"],
    ["G2 recognizes Profound among the best AI tools of 2026", "Profound team", "3 Jun, 2026", "Company"],
  ];
  return (
    <>
      <PageHero title="Ideas, research, and data from the frontier of AI Search" />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(([t, a, d, c], i) => (
            <article key={t} className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 transition-colors hover:border-white/25">
              <div className="mb-8 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800/60 to-zinc-900 opacity-70"><svg viewBox="0 0 60 28" className="h-7 w-14 opacity-60"><polyline points="2,24 12,18 22,20 32,10 42,13 52,4 58,6" fill="none" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{c}</p>
              <h2 className="mt-2 text-[17px] font-medium leading-snug group-hover:text-zinc-300">{t}</h2>
              <p className="mt-2 text-sm text-zinc-500">By {a} · {d}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function EnterprisePage() {
  return (
    <>
      <PageHero title="The Marketing Engineer era" sub="Profound is building the discipline, the platform, and the team that wins the AI Search decade. Join us — or bring the manifesto to your company." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Own the frontier", "Define the discipline of AI Search optimization before anyone else does."], ["Research-driven", "Every shipped feature is backed by answer-engine data we collect ourselves."], ["Small teams, big surface", "Your work ships to Fortune 100 brands within weeks, not quarters."], ["Remote-friendly", "Hubs in San Francisco and New York, teammates across four time zones."], ["Equity for everyone", "Every full-time role carries meaningful ownership in the company."], ["Learning budget", "Annual budget for conferences, courses, and research time."]].map(([t, p]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="font-medium">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <SectionHead title="Open roles across engineering, research, and go-to-market" sub="Help us define how brands win in the age of AI answers." />
          <div className="mt-10 grid gap-3 text-left">
            {["Staff Engineer, Agent Runtime — San Francisco", "Data Scientist, Answer Engines — New York", "Visibility Engineer — Remote (US)", "Enterprise AE — London", "Design Engineer — San Francisco", "Forward Deployed Engineer — New York"].map((r) => (
              <div key={r} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] px-5 py-4 text-sm">
                <span>{r}</span><span className="text-zinc-500">Apply →</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function AgentTemplatesPage() {
  const templates = db.prepare("SELECT slug, name, category, description, installs FROM agent_templates ORDER BY installs DESC").all() as { slug: string; name: string; category: string; description: string; installs: number }[];
  const cats = ["All", ...new Set(templates.map((t) => t.category))];
  return (
    <>
      <PageHero title="Agent templates" sub="Install a pre-built Agent and customize it with drag-and-drop ease." />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => <span key={c} className="rounded-full bg-white/5 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10 first:bg-white first:text-black">{c}</span>)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.slug} className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <span className="w-fit rounded-full border border-white/15 px-2.5 py-1 text-xs text-zinc-400">{t.category}</span>
              <p className="mt-4 text-lg font-medium">{t.name}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{t.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-zinc-600">{t.installs.toLocaleString()} installs</span>
                <Link href="/signup" className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:opacity-85">Install</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function IntegrationsPage() {
  const groups: [string, string[]][] = [
    ["CDN & Hosting", ["Cloudflare", "Akamai", "Fastly", "AWS CloudFront", "Google Cloud CDN", "Vercel", "Netlify"]],
    ["Analytics", ["Google Analytics", "Adobe Analytics", "Looker", "G2"]],
    ["CMS", ["Contentful", "WordPress", "Webflow", "Sanity", "Payload", "Drupal", "Framer"]],
    ["Collaboration", ["Slack", "Notion", "Microsoft Teams", "Google Drive", "Linear", "Atlassian", "Gmail", "Monday.com"]],
    ["AI & Data", ["OpenAI Ads", "Perplexity", "Exa", "Firecrawl", "DataForSEO", "Parallel"]],
  ];
  return (
    <>
      <PageHero title="200+ integrations" sub="Extend the capability of your existing stack with ease." />
      <section className="mx-auto max-w-6xl px-6 py-16">
        {groups.map(([g, items]) => (
          <div key={g} className="mb-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">{g}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {items.map((i) => (
                <div key={i} className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] px-2 text-center text-xs text-zinc-300">{i}</div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export function AeoGuidePage() {
  return (
    <>
      <PageHero title="The Answer Engine Optimization guide" sub="Everything we know about winning in AI Search — updated continuously from Profound research." />
      <section className="mx-auto max-w-3xl px-6 py-16">
        {[["Chapter 1", "What is Answer Engine Optimization?"], ["Chapter 2", "How answer engines choose their sources"], ["Chapter 3", "Measuring AI visibility that matters"], ["Chapter 4", "Citations: earned, owned, and stolen"], ["Chapter 5", "Agents: acting on AI Search signals"], ["Chapter 6", "The zero-click future"]].map(([c, t], i) => (
          <div key={c} className="flex items-baseline gap-6 border-b border-white/10 py-6">
            <span className="text-sm text-zinc-600">{c}</span>
            <p className="text-xl font-medium md:text-2xl">{t}</p>
            <span className="ml-auto text-sm text-zinc-500">{i < 2 ? "12 min" : "9 min"}</span>
          </div>
        ))}
      </section>
      <section className="border-t border-white/10 py-20 text-center">
        <FeatureViz kind="visibility" />
        <p className="mx-auto mt-8 max-w-xl px-6 text-zinc-400">This guide is generated from Profound's proprietary research across billions of AI conversations.</p>
      </section>
    </>
  );
}
