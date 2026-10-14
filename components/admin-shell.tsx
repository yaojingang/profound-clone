"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview", icon: "▦" },
  { href: "/admin/users", label: "Users", icon: "◍" },
  { href: "/admin/workspaces", label: "Workspaces", icon: "◫" },
  { href: "/admin/agents", label: "Agents & Runs", icon: "✦" },
  { href: "/admin/leads", label: "Leads", icon: "✉" },
];

export function AdminShell({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh bg-[#09090b] text-zinc-100">
      <aside className="hidden w-56 shrink-0 border-r border-white/10 md:block">
        <div className="flex h-dvh flex-col p-4">
          <Link href="/" className="mb-8 flex items-center gap-2 px-2 text-[15px] font-semibold"><span className="text-lg">✦</span> Profound<span className="ml-1 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">Admin</span></Link>
          <nav className="space-y-1">
            {NAV.map((it) => (
              <Link key={it.href} href={it.href} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${active(it.href) ? "bg-white/10 font-medium text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                <span className="w-4 text-center text-zinc-500">{it.icon}</span>{it.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-white/10 pt-4">
            <p className="px-2 text-[12.5px] font-medium">{user.name}</p>
            <p className="px-2 text-[11.5px] text-zinc-500">{user.email}</p>
            <div className="mt-3 flex gap-2 px-2">
              <Link href="/app" className="flex-1 rounded-lg border border-white/15 py-1.5 text-center text-[12px] text-zinc-300 hover:bg-white/5">Open app</Link>
              <button onClick={logout} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[12px] text-zinc-300 hover:bg-white/5">⏻</button>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function AdminHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-6 py-5 lg:px-8">
      <div>
        <h1 className="text-[21px] font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-0.5 text-[13px] text-zinc-400">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
