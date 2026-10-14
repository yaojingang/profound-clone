import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({ title, sub, children }: { title: ReactNode; sub?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[-30%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[110px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
        <h1 className="text-balance text-4xl font-medium tracking-tight md:text-[56px] md:leading-[1.06]">{title}</h1>
        {sub && <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-zinc-400">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ title, sub, center = true }: { title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-zinc-400">{sub}</p>}
    </div>
  );
}

const CHECK = (
  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const DIM = <span className="text-zinc-600">—</span>;

function Cell({ v }: { v: string | string[] | boolean }) {
  if (typeof v === "boolean") return v ? CHECK : DIM;
  if (Array.isArray(v))
    return (
      <ul className="space-y-1">
        {v.map((x) => <li key={x} className="text-[13px] text-zinc-300">{x}</li>)}
      </ul>
    );
  return <span className="text-[13px] text-zinc-300">{v}</span>;
}

export function ComparisonTable({ sections }: { sections: { title: string; desc?: string; rows: [string, string | string[] | boolean, string | string[] | boolean][] }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="w-2/5 p-5 text-sm font-medium text-zinc-400">Feature</th>
            <th className="w-3/10 p-5"><p className="text-lg font-medium">Trial</p><p className="text-sm text-zinc-500">Free</p></th>
            <th className="w-3/10 p-5"><p className="text-lg font-medium">Enterprise</p><p className="text-sm text-zinc-500">Custom · Tailored packages</p></th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <>
              <tr key={s.title} className="border-b border-white/10 bg-white/[0.02]">
                <td colSpan={3} className="p-5">
                  <p className="font-medium">{s.title}</p>
                  {s.desc && <p className="mt-0.5 text-sm text-zinc-500">{s.desc}</p>}
                </td>
              </tr>
              {s.rows.map(([label, trial, ent]) => (
                <tr key={label} className="border-b border-white/5 last:border-0">
                  <td className="p-5 pr-8 text-sm text-zinc-400">{label}</td>
                  <td className="p-5"><Cell v={trial} /></td>
                  <td className="p-5"><Cell v={ent} /></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
