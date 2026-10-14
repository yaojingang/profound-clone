import Link from "next/link";
import { PageHero, SectionHead, ComparisonTable } from "@/components/marketing-kit";

type CmpSection = { title: string; desc?: string; rows: [string, string | string[] | boolean, string | string[] | boolean][] };
const SECTIONS: CmpSection[] = [
  {
    title: "AI Marketer",
    desc: "Your brand's superintelligent teammate",
    rows: [
      ["Credits — AI Marketer runs on credits", "Limited", "Custom"],
      ["Agents — Build and reuse workflows for your team's recurring marketing work", true, true],
      ["Context Manager — Power your AI Marketer with knowledge about your brand", true, true],
      ["Opportunities — AI Marketer proactively identifies opportunities for your brand", "Limited", "Unlimited"],
      ["Projects — Shared spaces to work with your teammates", false, true],
      ["Profound Sheets — Run Agents at scale", true, true],
    ],
  },
  {
    title: "Answer Engine Insights",
    desc: "Analyze how your brand and competitors appear in AI platforms",
    rows: [
      ["Prompts tracked", ["50 unique prompts"], "Custom"],
      ["Prompt Frequency", "Daily for 7 days", "Daily"],
      ["Answer Engines tracked", ["ChatGPT", "Gemini", "Google AI Overviews"], ["Capability for:", "ChatGPT", "Perplexity", "Google AI Mode", "Gemini", "Microsoft Copilot", "DeepSeek", "Anthropic Claude", "Google AI Overviews", "Exa Search"]],
      ["Languages", "1", "Custom"],
      ["Regions", "1", "Custom"],
      ["ChatGPT Shopping", false, true],
    ],
  },
  {
    title: "Agent Analytics",
    desc: "Track AI-sourced traffic and attribution across your domains",
    rows: [
      ["Domains tracked", "Unlimited", "Unlimited"],
      ["Integrations", ["Akamai", "AWS", "Cloudflare", "Fastly", "Google Analytics", "Google Cloud Platform", "Netlify", "Vercel", "Wordpress"], ["Custom with options for:", "Akamai", "AWS", "Cloudflare", "Fastly", "Google Analytics", "Google Cloud Platform", "Netlify", "Vercel", "Wordpress"]],
    ],
  },
  {
    title: "Prompt Volumes",
    desc: "See what users are prompting AI Answer Engines",
    rows: [["Searches", "5", "Custom"]],
  },
  {
    title: "Data",
    desc: "Power your reporting and workflows",
    rows: [
      ["History", "None", "All time"],
      ["Exports", "None", ["CSV", "JSON"]],
      ["API", "None", true],
    ],
  },
  {
    title: "Organization",
    desc: "Services for your team",
    rows: [
      ["Seats", "Unlimited", "Unlimited"],
      ["Support", "None", ["Custom with options for:", "Email", "Dedicated Slack", "Dedicated Specialist with 24 hour SLA"]],
      ["SSO", false, true],
    ],
  },
];

const FAQS: [string, string][] = [
  ["Can I customize the prompts Profound runs?", "Trial plan users receive a recommended prompt set based on their industry and cannot customize their prompts. On Enterprise, you can edit, add, and remove prompts at any time."],
  ["What happens if I exceed my prompt limit?", "More prompts mean more accurate insights. We'll notify you as you approach your limit and help you explore the best expansion options for your team."],
  ["How long does setup take?", "Instant."],
  ["What are credits?", "Credits are the unit of measurement for Agent usage. Each time an Agent runs, it consumes credits relative to its complexity. Simpler agents with fewer steps use fewer credits."],
  ["Do I need a credit card to start a Trial?", "No. The Trial is free and does not require a payment method."],
  ["Can I track competitors?", "Yes. Answer Engine Insights surfaces competitor visibility and citations out of the box."],
  ["What integrations are supported?", "Agent Analytics integrates with major CDNs and analytics stacks: Cloudflare, Akamai, Fastly, AWS, Vercel, Netlify, Google Analytics, and more."],
  ["Is my data used to train models?", "No. Your brand context and workspace data are never used to train third-party models."],
];

export default function PricingPage() {
  return (
    <>
      <PageHero title="Meet your AI Marketer" sub="Research, write, report, and collaborate with a superintelligent teammate who knows your brand.">
        <div className="mt-8 inline-flex rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black">For brands</span>
          <span className="rounded-full px-4 py-1.5 text-sm text-zinc-400">For agencies</span>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
            <h2 className="text-2xl font-medium">Trial</h2>
            <p className="mt-1 text-3xl font-semibold">Free</p>
            <p className="mt-3 text-sm text-zinc-400">For companies who want to trial Profound before getting a demo</p>
            <ul className="mt-7 space-y-3 text-sm text-zinc-300">
              {["Limited AI Marketer credits", "50 prompts run daily for 7 days", "ChatGPT, Gemini, Google AI Overviews"].map((f) => (
                <li key={f} className="flex gap-2.5">{f}</li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8 rounded-full bg-zinc-800 py-3 text-center text-sm font-medium ring-1 ring-white/15 hover:bg-zinc-700">Get Started</Link>
          </div>
          <div className="flex flex-col rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">Enterprise</h2>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">Tailored packages</span>
            </div>
            <p className="mt-1 text-3xl font-semibold">Custom</p>
            <p className="mt-3 text-sm text-zinc-400">For companies operationalizing AI Search insights and running marketing agents at scale</p>
            <ul className="mt-7 space-y-3 text-sm text-zinc-300">
              {["AI Marketer credits for your whole team", "Tailored prompt tracking plan", "Up to 9 Answer Engines tracked", "Dedicated support", "SSO/SAML + SOC 2 compliance"].map((f) => (
                <li key={f} className="flex gap-2.5">{f}</li>
              ))}
            </ul>
            <Link href="/contact-sales" className="mt-8 rounded-full bg-white py-3 text-center text-sm font-medium text-black hover:opacity-85">Get a Demo</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <SectionHead title="The brands we empower" />
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-5">
          {["WHOOP", "clay", "ubank", "MEJURI", "ramp ⤵", "Walmart ✷", "COMCAST", "RBC", "MONSTER", "ESTĒE LAUDER"].map((l) => (
            <div key={l} className="flex h-20 items-center justify-center bg-black text-sm font-semibold text-zinc-200">{l}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ComparisonTable sections={SECTIONS} />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500">STATSIG</p>
          <blockquote className="mx-auto mt-6 max-w-2xl text-pretty text-xl font-light leading-relaxed text-zinc-200">
            "We chose Profound because it seemed like the deepest and most complete tool in the market. We tried the others, and Profound was immediately the obvious choice"
          </blockquote>
          <p className="mt-6 text-sm text-zinc-400">Skye Scofield</p>
          <p className="text-xs text-zinc-600">Marketing Lead at Statsig</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-28">
        <SectionHead title="Frequently asked questions" center={false} />
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-[15px] font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-zinc-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
