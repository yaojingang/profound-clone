import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "./auth";
import { db } from "./db";

export const SESSION_COOKIE = "pf_session";

export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/app");
  return user;
}

export function primaryWorkspace(userId: number) {
  return (
    (db
      .prepare(
        `SELECT w.* FROM workspaces w
         JOIN memberships m ON m.workspace_id = w.id
         WHERE m.user_id = ? ORDER BY w.id LIMIT 1`
      )
      .get(userId) as { id: number; name: string; slug: string; plan: string; credits_total: number; credits_used: number } | undefined) ?? null
  );
}
