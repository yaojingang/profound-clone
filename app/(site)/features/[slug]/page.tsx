import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, SectionHead } from "@/components/marketing-kit";
import { FeatureViz } from "@/components/feature-viz";
import { FEATURES } from "@/lib/features";

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURES.find((x) => x.slug === slug);
  return { title: f ? `${f.title} | Profound` : "Profound" };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = FEATURES.find((x) => x.slug === slug);
  if (!def) notFound();

  return (
    <>
      <PageHero title={def.title} sub={def.sub}>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Get a demo</Link>
          <Link href="/signup" className="rounded-full bg-zinc-800/80 px-6 py-3 text-[15px] font-medium ring-1 ring-white/15 hover:bg-zinc-700/80">Get started</Link>
        </div>
      </PageHero>

      <section className="border-b border-white/10 py-14">
        <p className="text-center text-sm text-zinc-500">Used by companies of all sizes</p>
        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-semibold text-zinc-500">
          {["WHOOP", "Clay", "ubank", "MEJURI", "ramp ⤵", "COMCAST", "RBC"].map((l) => <span key={l}>{l}</span>)}
        </div>
      </section>

      {def.sections.map((s, i) => (
        <section key={s.h} className={`border-b border-white/10 py-20 ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
          <div className={`mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2`}>
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{s.h}</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-zinc-400">{s.p}</p>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <FeatureViz kind={s.viz ?? "default"} />
            </div>
          </div>
        </section>
      ))}

      {def.faq && def.faq.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <SectionHead title="Frequently asked questions" center={false} />
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {def.faq.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                  {q}<span className="text-zinc-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-white/10 py-24 text-center">
        <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{def.cta ?? `Ready to see ${def.eyebrow} on your brand?`}</h2>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Get a demo</Link>
          <Link href="/signup" className="rounded-full bg-zinc-800/80 px-6 py-3 text-[15px] font-medium ring-1 ring-white/15 hover:bg-zinc-700/80">Get started</Link>
        </div>
      </section>
    </>
  );
}
