import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  destroySession(req.headers.get("cookie")?.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
