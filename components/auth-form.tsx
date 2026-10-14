"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const field = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push(data.ok && fd.get("as-admin") === "1" ? "/admin" : "/app");
      router.refresh();
    } else {
      setErr(data.error ?? "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      {mode === "signup" && (
        <>
          <input name="name" required placeholder="Full name" className={field} />
          <input name="company" placeholder="Company / workspace name" className={field} />
        </>
      )}
      <input name="email" type="email" required placeholder="Work email" defaultValue={mode === "login" ? "demo@profound.local" : ""} className={field} />
      <input name="password" type="password" required placeholder="Password" defaultValue={mode === "login" ? "demo1234" : ""} className={field} />
      {err && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{err}</p>}
      <button type="submit" disabled={busy} className="mt-2 w-full rounded-xl bg-zinc-900 py-3 text-[15px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60">
        {busy ? "One moment…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      {mode === "login" && (
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          <input type="checkbox" name="as-admin" className="accent-zinc-900" /> Log in as platform admin
        </label>
      )}
    </form>
  );
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#fcfcfc] px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="text-2xl">✦</span>
          <h1 className="text-xl font-medium text-zinc-900">{mode === "login" ? "Log in to Profound" : "Create your Profound account"}</h1>
          <p className="text-sm text-zinc-500">{mode === "login" ? "Win AI Search with your AI Marketer." : "Start tracking your AI Search visibility free."}</p>
        </div>
        <AuthForm mode={mode} />
        <p className="mt-6 text-center text-sm text-zinc-500">
          {mode === "login" ? (
            <>Don&apos;t have an account? <Link href="/signup" className="font-medium text-zinc-900 hover:underline">Sign up</Link></>
          ) : (
            <>Already have an account? <Link href="/login" className="font-medium text-zinc-900 hover:underline">Log in</Link></>
          )}
        </p>
        {mode === "login" && (
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 text-xs leading-relaxed text-zinc-500">
            <p className="mb-1 font-semibold text-zinc-700">Demo accounts</p>
            <p>Workspace owner — demo@profound.local / demo1234</p>
            <p>Platform admin — admin@profound.local / admin1234</p>
          </div>
        )}
      </div>
    </div>
  );
}
