"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        company: fd.get("company"),
        size: fd.get("size"),
        message: fd.get("message"),
      }),
    });
    if (res.ok) setSent(true);
    else setErr("Something went wrong. Please try again.");
  }

  if (sent)
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
        <p className="text-2xl font-medium">Thanks — we&apos;ll be in touch shortly.</p>
        <p className="mt-3 text-sm text-zinc-400">A Profound specialist will reach out within one business day.</p>
      </div>
    );

  const field = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-zinc-600 outline-none focus:border-white/30";
  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className={field} />
        <input name="email" type="email" required placeholder="Work email" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="company" required placeholder="Company" className={field} />
        <select name="size" className={`${field} [&>option]:bg-zinc-900`} defaultValue="201-1000">
          {["1-50", "51-200", "201-1000", "1000+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
        </select>
      </div>
      <textarea name="message" rows={4} placeholder="What are you hoping to achieve with AI Search?" className={field} />
      {err && <p className="text-sm text-rose-400">{err}</p>}
      <button type="submit" className="mt-2 w-fit rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black hover:opacity-85">Request a demo</button>
    </form>
  );
}
