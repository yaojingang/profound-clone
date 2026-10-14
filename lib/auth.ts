import crypto from "crypto";
import { db } from "./db";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

const SESSION_DAYS = 30;

export function createSession(userId: number): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString().slice(0, 19).replace("T", " ");
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, expires);
  return token;
}

export function getSessionUser(token: string | undefined) {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.status
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    )
    .get(token) as
    | { id: number; email: string; name: string; role: string; status: string }
    | undefined;
  if (!row) {
    db.prepare("DELETE FROM sessions WHERE token = ? AND expires_at <= datetime('now')").run(token);
    return null;
  }
  return row;
}

export function destroySession(token: string | undefined) {
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
