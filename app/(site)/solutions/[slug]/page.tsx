import { notFound } from "next/navigation";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/features";
import { PageHero } from "@/components/marketing-kit";

export function generateStaticParams() {
  return Object.keys(SOLUTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTIONS[slug];
  return { title: s ? `${s.title} | Profound` : "Solutions | Profound" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTIONS[slug];
  if (!s) notFound();
  return (
    <>
      <PageHero title={s.title} sub={s.sub} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {s.bullets.map(([t, p]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="text-lg font-medium">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-white/10 py-24 text-center">
        <h2 className="text-3xl font-medium md:text-4xl">Ready to win your category in AI Search?</h2>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Get a demo</Link>
          <Link href="/signup" className="rounded-full border border-white/20 px-6 py-3 text-[15px] font-medium hover:bg-white/5">Get started</Link>
        </div>
      </section>
    </>
  );
}
