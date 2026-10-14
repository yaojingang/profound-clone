"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export type ShellUser = { name: string; email: string; role: string };
export type ShellWorkspace = { name: string; plan: string; credits_total: number; credits_used: number } | null;

const AI_MARKETER = [
  { href: "/app/insights", label: "Answer Engine Insights", icon: "◎" },
  { href: "/app/insights/visibility", label: "Visibility", icon: "◠", sub: true },
  { href: "/app/insights/citations", label: "Citations", icon: "❞", sub: true },
  { href: "/app/insights/sentiment", label: "Sentiment", icon: "☺", sub: true },
  { href: "/app/insights/factcheck", label: "FactCheck", icon: "✓", sub: true },
  { href: "/app/pages", label: "Pages", icon: "▤" },
  { href: "/app/prompts", label: "Prompt Volumes", icon: "⌕" },
];
const AGENT_ANALYTICS = [
  { href: "/app/agents", label: "Agents", icon: "✦" },
  { href: "/app/agent-runs", label: "Agent Runs", icon: "≡", sub: true },
  { href: "/app/shopping", label: "Shopping", icon: "◫" },
  { href: "/app/dashboards", label: "Dashboards", icon: "▦" },
];

export function AppShell({ user, workspace, recents, children }: { user: ShellUser; workspace: ShellWorkspace; recents: { id: number; text: string }[]; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const home = path === "/app";
  const active = (href: string) => (href === "/app/insights" ? path === href : path.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const credits = workspace ? Math.max(0, workspace.credits_total - workspace.credits_used) : 0;
  const navCls = (it: { href: string; sub?: boolean }) =>
    `flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors ${active(it.href) ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"} ${it.sub ? "pl-8" : ""}`;

  return (
    <div className="flex min-h-dvh bg-white text-zinc-900">
      <aside className={`${open ? "fixed inset-y-0 left-0 z-40 block w-64 overflow-y-auto" : "hidden"} shrink-0 border-r border-zinc-200 bg-[#fafafa] md:sticky md:top-0 md:block md:h-dvh md:w-60`}>
        <div className="flex h-full flex-col p-3">
          <div className="mb-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">{workspace?.name ?? "No workspace"}</p>
              <p className="text-[11px] capitalize text-zinc-500">{workspace?.plan ?? "—"} plan</p>
            </div>
            <span className="text-zinc-400">⌄</span>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 text-[13px] font-medium">
            <Link href="/app" className={`rounded-lg py-1.5 text-center ${home ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"}`}>Workspace</Link>
            <Link href="/app/insights" className={`rounded-lg py-1.5 text-center ${!home ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"}`}>Analyze</Link>
          </div>
          <nav className="space-y-0.5">
            <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">AI Marketer</p>
            {AI_MARKETER.map((it) => (
              <Link key={it.href} href={it.href} className={navCls(it)}>
                <span className="w-4 text-center text-zinc-400">{it.icon}</span>
                {it.label}
              </Link>
            ))}
            <p className="px-2.5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Agent Analytics</p>
            {AGENT_ANALYTICS.map((it) => (
              <Link key={it.href} href={it.href} className={navCls(it)}>
                <span className="w-4 text-center text-zinc-400">{it.icon}</span>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Recents</p>
            {recents.map((r) => (
              <Link key={r.id} href={`/app/prompts/${r.id}`} className="block truncate rounded-lg px-2.5 py-1.5 text-[12.5px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800">{r.text}</Link>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[12px] font-medium">Trial credits</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: workspace ? `${Math.round((credits / Math.max(1, workspace.credits_total)) * 100)}%` : "0%" }} />
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-500">{credits} of {workspace?.credits_total ?? 0} remaining</p>
            <Link href="/contact-sales" className="mt-2.5 block rounded-lg bg-zinc-900 py-1.5 text-center text-[12px] font-medium text-white hover:bg-zinc-800">Book a demo</Link>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-zinc-200 px-1.5 pt-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[12px] font-semibold text-white">{user.name.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium">{user.name}</p>
              <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
            </div>
            <button onClick={logout} title="Log out" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">⏻</button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <button onClick={() => setOpen(!open)} className="fixed bottom-4 right-4 z-50 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg md:hidden">{open ? "Close" : "Menu"}</button>
        {children}
      </main>
    </div>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 px-6 py-5 lg:px-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-0.5 text-[13.5px] text-zinc-500">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function EnginePills({ engines }: { engines: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {engines.map((e) => <span key={e} className="rounded-full border border-zinc-200 px-3 py-1.5 text-[12.5px] text-zinc-600">{e}</span>)}
    </div>
  );
}
