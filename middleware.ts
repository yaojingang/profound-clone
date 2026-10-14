import { NextRequest, NextResponse } from "next/server";

// Cookie-presence gate only: avoids the PPR error-shell flash on authed routes.
// Role checks stay in layouts (better-sqlite3 is unavailable in the edge runtime).
export function middleware(req: NextRequest) {
  if (!req.cookies.get("pf_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
