import { NextResponse } from "next/server";
import { hashPassword, createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  const { name, email, password, company } = await req.json().catch(() => ({}));
  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  if (String(password).length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  const emailNorm = String(email).toLowerCase();
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(emailNorm))
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const userId = db
    .prepare("INSERT INTO users (email, password_hash, name, role, status, created_at) VALUES (?, ?, ?, 'user', 'active', datetime('now'))")
    .run(emailNorm, hashPassword(String(password)), String(name)).lastInsertRowid as number;

  const wsName = String(company || `${name.split(" ")[0]}'s Workspace`);
  let slug = wsName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  if (db.prepare("SELECT id FROM workspaces WHERE slug = ?").get(slug)) slug = `${slug}-${userId}`;
  const wsId = db
    .prepare("INSERT INTO workspaces (name, slug, plan, credits_total, status, created_at) VALUES (?, ?, 'trial', 100, 'active', datetime('now'))")
    .run(wsName, slug).lastInsertRowid as number;
  db.prepare("INSERT INTO memberships (user_id, workspace_id, role) VALUES (?, ?, 'owner')").run(userId, wsId);

  const token = createSession(userId);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
