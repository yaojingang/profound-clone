import Link from "next/link";
import { PageHero, SectionHead } from "@/components/marketing-kit";

const FEATURE_LINKS: [string, string, string][] = [
  ["Answer Engine Insights", "Visibility, sentiment, citations, and FactCheck across every answer engine.", "/features/answer-engine-insights"],
  ["Agent Analytics", "Track how AI agents crawl, cite, and refer traffic to your site.", "/features/agent-analytics"],
  ["Aim — AI Marketer", "The AI marketer that finds opportunities, drafts the work, and closes the loop.", "/features/aim"],
  ["Agents", "Build and reuse workflows for recurring marketing work.", "/features/agents"],
  ["Prompt Volumes", "Real user prompts, organized into clusters you can act on.", "/features/prompt-volumes"],
  ["Pages", "Every page's AI readability, citations, and decay in one inventory.", "/features/pages"],
  ["Context Manager", "Living brand context so Agents you can trust.", "/features/context-manager"],
  ["Shopping", "SKU-level visibility in ChatGPT Shopping.", "/features/shopping"],
  ["Documents", "Write, edit, and publish with Agents alongside you.", "/features/documents"],
];

export default function FeaturesIndexPage() {
  return (
    <>
      <PageHero title="One platform. Every AI Search signal." sub="Monitor what consumers prompt, what agents cite, and how your brand shows up — then let your AI Marketer act on it." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead title="Explore the platform" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_LINKS.map(([t, p, href]) => (
            <Link key={t} href={href} className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-colors hover:border-white/25">
              <p className="text-lg font-medium">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{p}</p>
              <p className="mt-4 text-sm text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100">Learn more →</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
