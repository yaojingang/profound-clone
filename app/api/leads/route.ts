import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) return NextResponse.json({ error: "name and email required" }, { status: 400 });
  db.prepare("INSERT INTO leads (name, email, company, size, message, source, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))")
    .run(body.name, body.email, body.company ?? null, body.size ?? null, body.message ?? null, "contact-sales");
  return NextResponse.json({ ok: true });
}
