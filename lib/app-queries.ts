import { db } from "./db";

export const ENGINE_COLORS: Record<string, string> = {
  ChatGPT: "#10a37f",
  Perplexity: "#20808d",
  Claude: "#d97757",
  Gemini: "#4285f4",
  "Microsoft Copilot": "#0078d4",
  "AI Overviews": "#34a853",
  DeepSeek: "#4d6bfe",
};

export const CAT_COLORS: Record<string, string> = {
  Social: "#c084fc",
  Competition: "#fb7185",
  Earned: "#60a5fa",
  Owned: "#4ade80",
  Blog: "#fb923c",
  Other: "#52525b",
};

export function colorForEngine(engine: string) {
  return ENGINE_COLORS[engine] ?? "#a1a1aa";
}

export function visibilitySeries(workspaceId: number) {
  const rows = db
    .prepare("SELECT date, platform, score FROM visibility_daily WHERE workspace_id = ? ORDER BY date")
    .all(workspaceId) as { date: string; platform: string; score: number }[];
  const dates = [...new Set(rows.map((r) => r.date))];
  const labels = dates.map((d) => d.slice(5));
  const series = [...new Set(rows.map((r) => r.platform))].map((p) => ({
    name: p,
    color: colorForEngine(p),
    points: dates.map((d) => {
      const hit = rows.find((r) => r.date === d && r.platform === p);
      return hit ? Math.round(hit.score * 10) / 10 : 0;
    }),
  }));
  return { labels, series };
}

export function overallScore(workspaceId: number, at?: string) {
  const row = at
    ? db.prepare("SELECT AVG(score) s FROM visibility_daily WHERE workspace_id = ? AND date = ?").get(workspaceId, at) as { s: number | null }
    : db.prepare("SELECT AVG(score) s FROM visibility_daily WHERE workspace_id = ? ORDER BY date DESC LIMIT 1").get(workspaceId) as { s: number | null };
  return row.s ? Math.round(row.s * 10) / 10 : 0;
}

export function citationsByCat(workspaceId: number) {
  return db
    .prepare("SELECT category, SUM(share) share FROM citations WHERE workspace_id = ? GROUP BY category ORDER BY share DESC")
    .all(workspaceId) as { category: string; share: number }[];
}

export function citationDomains(workspaceId: number) {
  return db.prepare("SELECT domain, category, share, change_pct FROM citations WHERE workspace_id = ? ORDER BY share DESC").all(workspaceId) as
    { domain: string; category: string; share: number; change_pct: number }[];
}

export function sentimentRows(workspaceId: number) {
  const rows = db.prepare("SELECT engine, positive, neutral, negative FROM sentiment_summary WHERE workspace_id = ?").all(workspaceId) as
    { engine: string; positive: number; neutral: number; negative: number }[];
  const scale = rows.some((r) => r.positive > 1.5) ? 100 : 1;
  return rows.map((r) => ({ engine: r.engine, positive: r.positive / scale, neutral: r.neutral / scale, negative: r.negative / scale }));
}

export function catColor(category: string) {
  const key = Object.keys(CAT_COLORS).find((k) => k.toLowerCase() === category.toLowerCase());
  return CAT_COLORS[key ?? ""] ?? "#a1a1aa";
}

export function trafficByAgent(workspaceId: number) {
  return db
    .prepare("SELECT agent_name, SUM(hits) hits, SUM(citations) citations, SUM(referrals) referrals FROM agent_traffic WHERE workspace_id = ? GROUP BY agent_name ORDER BY hits DESC")
    .all(workspaceId) as { agent_name: string; hits: number; citations: number; referrals: number }[];
}

export function trafficDaily(workspaceId: number) {
  const rows = db
    .prepare("SELECT date, SUM(hits) hits FROM agent_traffic WHERE workspace_id = ? GROUP BY date ORDER BY date")
    .all(workspaceId) as { date: string; hits: number }[];
  return { labels: rows.map((r) => r.date.slice(5)), points: rows.map((r) => r.hits) };
}

export function promptsOf(workspaceId: number, limit = 500) {
  return db.prepare("SELECT id, text, topic, intent, volume, difficulty, status FROM prompts WHERE workspace_id = ? ORDER BY volume DESC LIMIT ?").all(workspaceId, limit) as
    { id: number; text: string; topic: string; intent: string; volume: number; difficulty: string; status: string }[];
}

export function mentionRate(workspaceId: number) {
  const row = db
    .prepare(
      `SELECT COUNT(*) total, SUM(pa.mentioned) mentioned FROM prompt_answers pa
       JOIN prompts p ON p.id = pa.prompt_id WHERE p.workspace_id = ?`
    )
    .get(workspaceId) as { total: number; mentioned: number | null };
  if (!row || !row.total) return 0;
  return Math.round(((row.mentioned ?? 0) / row.total) * 1000) / 10;
}
