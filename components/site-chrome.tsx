import Link from "next/link";

export function ProfoundLogo({ className = "h-6" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[1.35em] w-[1.35em]" fill="currentColor" aria-hidden>
        <path d="M12 2c.5 3.9 2.6 6.6 7.5 7-4.9.4-7 3.1-7.5 7-.5-3.9-2.6-6.6-7.5-7C9.4 8.6 11.5 5.9 12 2Z" />
        <circle cx="12" cy="9" r="2.1" fill="black" />
        <circle cx="12" cy="9" r="2.1" fill="currentColor" opacity=".85" />
      </svg>
      Profound
    </span>
  );
}

const NAV: { label: string; groups: { title: string; links: [string, string][] }[] }[] = [
  {
    label: "Platform",
    groups: [
      {
        title: "Monitor",
        links: [
          ["Answer Engine Insights", "/features/answer-engine-insights"],
          ["Prompt Volumes", "/features/prompt-volumes"],
          ["Shopping", "/features/shopping"],
          ["Agent Analytics", "/features/agent-analytics"],
        ],
      },
      {
        title: "AI Marketer",
        links: [
          ["Agents", "/features/agents"],
          ["Context Manager", "/features/context-manager"],
          ["AI Marketer", "/features/aim"],
          ["Pages", "/features/pages"],
          ["Documents", "/features/documents"],
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        title: "Discover",
        links: [
          ["AEO Report", "/aeo-guide"],
          ["Profound Index", "/aeo-guide"],
          ["AEO Guide", "/aeo-guide"],
          ["Events", "/aeo-guide"],
          ["Webinars", "/aeo-guide"],
          ["Research hub", "/blog"],
          ["Blog", "/blog"],
          ["Reports and guides", "/blog"],
          ["Newsroom", "/blog"],
        ],
      },
      {
        title: "Marketing Engineer",
        links: [
          ["Marketing Engineer manifesto", "/blog"],
          ["Profound Community", "/blog"],
          ["Become a Marketing Engineer", "/careers"],
          ["Podcast", "/blog"],
          ["Marketing Engineer Job Board", "/careers"],
        ],
      },
      {
        title: "Get Started",
        links: [
          ["Profound University", "/aeo-guide"],
          ["Agent templates", "/agent-templates"],
          ["Integrations", "/integrations"],
          ["Help Center", "/aeo-guide"],
          ["Developer Docs", "/integrations"],
        ],
      },
    ],
  },
  {
    label: "Solutions",
    groups: [
      {
        title: "For Teams",
        links: [
          ["AEO Teams", "/solutions/aeo-teams"],
          ["Content Teams", "/solutions/content-teams"],
          ["PR & Brand Teams", "/solutions/pr-teams"],
        ],
      },
      {
        title: "Partners",
        links: [
          ["Agencies", "/solutions/agencies"],
          ["Profound Partners", "/solutions/agencies"],
          ["Become a Partner", "/solutions/agencies"],
        ],
      },
      {
        title: "Industries",
        links: [
          ["Travel & Hospitality", "/solutions/travel-and-hospitality"],
          ["Retail", "/solutions/retail"],
          ["Pharmaceuticals", "/solutions/pharma"],
        ],
      },
    ],
  },
];

const CHEVRON = (
  <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function SiteHeader() {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
          <Link href="/" className="text-[22px] text-white">
            <ProfoundLogo />
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group relative">
                <button className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] text-zinc-300 transition-colors hover:text-white">
                  {item.label} {CHEVRON}
                </button>
                <div className="invisible absolute left-1/2 top-full z-50 w-max -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex gap-10 rounded-2xl border border-white/10 bg-[#0a0a0a]/97 p-6 shadow-2xl shadow-black/60">
                    {item.groups.map((g) => (
                      <div key={g.title} className="min-w-44">
                        <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">{g.title}</p>
                        <ul className="space-y-0.5">
                          {g.links.map(([label, href]) => (
                            <li key={label}>
                              <Link href={href} className="block rounded-lg px-2 py-1.5 text-[14px] text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Link href="/customers" className="rounded-full px-4 py-2 text-[15px] text-zinc-300 transition-colors hover:text-white">Customers</Link>
            <Link href="/pricing" className="rounded-full px-4 py-2 text-[15px] text-zinc-300 transition-colors hover:text-white">Pricing</Link>
            <Link href="/careers" className="rounded-full px-4 py-2 text-[15px] text-zinc-300 transition-colors hover:text-white">Careers</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="rounded-full px-3 py-2 text-[15px] text-zinc-300 transition-colors hover:text-white">Log in</Link>
            <Link href="/signup" className="rounded-full bg-white px-4 py-2 text-[15px] font-medium text-black transition-opacity hover:opacity-85">Open app</Link>
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 top-16 z-40 border-b border-white/10 bg-black">
        <Link href="/blog" className="flex h-11 items-center justify-center gap-2 text-[14px] text-zinc-300 transition-colors hover:text-white">
          <span className="rounded-md bg-orange-950/60 px-2.5 py-1 font-medium text-orange-400">Zero Click World Tour</span>
          Join us in London, Sydney, and Singapore.
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </>
  );
}

export function SiteFooter() {
  const cols: [string, [string, string][]][] = [
    ["Platform", [["Aim", "/features/aim"], ["Projects", "/features/aim"], ["Agents", "/features/agents"], ["Documents", "/features/documents"], ["Prompt Volumes", "/features/prompt-volumes"], ["Agent Analytics", "/features/agent-analytics"], ["Answer Engine Insights", "/features/answer-engine-insights"], ["Pages", "/features/pages"], ["Context Manager", "/features/context-manager"], ["Shopping", "/features/shopping"], ["Integrations", "/integrations"], ["Pricing", "/pricing"]]],
    ["Resources", [["AEO Guide", "/aeo-guide"], ["Blog", "/blog"], ["Reports and guides", "/blog"], ["Events", "/blog"], ["Newsroom", "/blog"], ["Profound Index", "/aeo-guide"], ["Zero Click", "/aeo-guide"], ["Help Center", "/aeo-guide"], ["Developer Docs", "/integrations"], ["Profound API", "/integrations"]]],
    ["Solutions", [["AEO Teams", "/solutions/aeo-teams"], ["Content Teams", "/solutions/content-teams"], ["PR & Brand Teams", "/solutions/pr-teams"], ["Retail", "/solutions/retail"], ["Travel & Hospitality", "/solutions/travel-and-hospitality"], ["Pharma", "/solutions/pharma"], ["Agencies", "/solutions/agencies"], ["Partners", "/solutions/agencies"]]],
    ["Company", [["Customers", "/customers"], ["Careers", "/careers"], ["Community", "/blog"], ["Newsroom", "/blog"], ["Contact us", "/contact-sales"], ["Affiliate program", "/solutions/agencies"], ["AI instructions", "/aeo-guide"], ["Legal", "/enterprise"]]],
  ];
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="text-[22px] text-white"><ProfoundLogo /></Link>
            <p className="mt-4 max-w-56 text-sm text-zinc-500">The AI marketing platform to win in AI search.</p>
            <div className="mt-6 flex gap-3 text-zinc-500">
              {["X", "in", "YT"].map((s) => (
                <span key={s} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs">{s}</span>
              ))}
            </div>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="mb-3 text-sm font-medium text-zinc-400">{title}</p>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-sm text-zinc-500 transition-colors hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-zinc-600 md:flex-row md:items-center">
          <p>© 2026 Profound clone — educational local replica. Not affiliated with Profound Inc.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span><span>Terms of Service</span><span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
