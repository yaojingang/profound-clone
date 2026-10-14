import { NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  const user = db.prepare("SELECT id, password_hash, status FROM users WHERE email = ?").get(String(email).toLowerCase()) as
    | { id: number; password_hash: string; status: string }
    | undefined;
  if (!user || !verifyPassword(password, user.password_hash))
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  if (user.status !== "active") return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
  const token = createSession(user.id);
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
