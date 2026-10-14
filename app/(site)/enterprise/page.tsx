import Link from "next/link";
import { PageHero } from "@/components/marketing-kit";

export const metadata = { title: "Enterprise | Profound" };

const CARDS: [string, string][] = [
  ["SOC 2 Type II", "Audited controls across the platform."],
  ["SSO / SAML + SCIM", "Enterprise identity from day one."],
  ["RBAC", "Least-privilege access for every team."],
  ["Audit logs", "Every agent action, recorded."],
  ["Data residency", "Regional storage options."],
  ["DPA", "Enterprise-grade data processing terms."],
];

export default function EnterprisePage() {
  return (
    <>
      <PageHero title="Enterprise-grade AI Search, governed by default" sub="An AI platform that supports your unique governance — from identity to audit to data residency." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {CARDS.map(([t, p]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="font-medium">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-white/10 py-24 text-center">
        <h2 className="text-3xl font-medium md:text-4xl">Roll out Profound across your organization</h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          Workspaces per brand, roles per team, and procurement-ready security documentation.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/contact-sales" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Talk to sales</Link>
          <Link href="/signup" className="rounded-full border border-white/20 px-6 py-3 text-[15px] font-medium text-white hover:bg-white/10">Start free</Link>
        </div>
      </section>
    </>
  );
}
