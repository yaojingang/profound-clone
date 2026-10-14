import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Contact Sales | Profound" };

export default function Page() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-28 pt-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">Contact sales</p>
          <h1 className="mt-4 text-4xl font-medium leading-tight md:text-5xl">See what AI says about your brand</h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-zinc-400">
            Get a personalized walkthrough of Profound — visibility tracking, Agents, Shopping, and the Command Center — tailored to your industry.
          </p>
          <div className="mt-10 space-y-5 text-sm text-zinc-400">
            {[["Trusted by a third of the Fortune 100", "Enterprise-grade security from day one"], ["Onboarding in days, not months", "Connect your site and see data the same week"], ["A team of Marketing Engineers", "We help you build your AI Search practice"]].map(([t, p]) => (
              <div key={t} className="flex gap-3">
                <span className="mt-0.5 text-white">✦</span>
                <div><p className="font-medium text-white">{t}</p><p>{p}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
