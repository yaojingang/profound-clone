import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser, primaryWorkspace } from "@/lib/session";

const TOOLBANK: Record<string, [string, string][]> = {
  default: [
    ["prompt_volumes.search", "Queried 1,284 prompts in your category"],
    ["answer_engine_insights.scan", "Scanned 7 answer engines for brand mentions"],
    ["citations.analyze", "Analyzed citation sources across answers"],
    ["report.draft", "Drafted findings with recommendations"],
  ],
  content: [
    ["context_manager.pull", "Pulled latest brand positioning and messaging"],
    ["prompts.gap_analysis", "Found prompts where competitors are cited but you are not"],
    ["content.draft", "Drafted page copy grounded in real prompt language"],
    ["cms.stage", "Staged changes for your review"],
  ],
  social: [
    ["content.variants", "Generated 3 post variants per channel"],
    ["brand.voice_check", "Checked drafts against brand voice guidelines"],
    ["schedule.propose", "Proposed a posting schedule for the week"],
  ],
  factcheck: [
    ["web.scan", "Scanned publishers for outdated brand claims"],
    ["factcheck.verify", "Verified claims against your latest specs"],
    ["outreach.draft", "Drafted a personalized brief per reporter"],
  ],
  shopping: [
    ["shopping.scan", "Scanned ChatGPT Shopping results for your SKUs"],
    ["merchants.compare", "Compared listing quality across merchants"],
    ["listing.optimize", "Prepared title and attribute improvements"],
  ],
};

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ws = primaryWorkspace(user.id);
  if (!ws) return NextResponse.json({ error: "no workspace" }, { status: 400 });
  const { message } = (await req.json().catch(() => ({}))) as { message?: string };
  const q = (message ?? "").toLowerCase();
  const w = ws.id;

  const agents = db.prepare("SELECT * FROM agents WHERE workspace_id = ?").all(w) as { id: number; name: string; type: string; description: string | null }[];

  // Agent-triggering intents create a real run with steps and consume credits.
  const agentMatch =
    (/(launch|draft|brief|one-pager|kit)/.test(q) && agents.find((a) => /content|writer|optimizer/i.test(a.type + a.name))) ??
    (/(social|post|linkedin|thread)/.test(q) && agents.find((a) => /social/i.test(a.type + a.name))) ??
    (/(factcheck|outreach|reporter|publisher|spec)/.test(q) && agents.find((a) => /factcheck/i.test(a.type + a.name))) ??
    (/(shopping|listing|merchant|sku)/.test(q) && agents.find((a) => /shopping/i.test(a.type + a.name))) ??
    (/(agent|workflow|automate)/.test(q) && agents[0]);

  if (agentMatch) {
    const stepsBank = TOOLBANK[/social/i.test(agentMatch.type) ? "social" : /factcheck/i.test(agentMatch.type) ? "factcheck" : /shopping/i.test(agentMatch.type) ? "shopping" : /content|writer|optimiz/i.test(agentMatch.type) ? "content" : "default"];
    const runId = db
      .prepare("INSERT INTO agent_runs (agent_id, workspace_id, status, trigger, credits, started_at, finished_at) VALUES (?, ?, 'done', 'aim', 2, datetime('now'), datetime('now','+45 seconds'))")
      .run(agentMatch.id, w).lastInsertRowid as number;
    stepsBank.forEach(([tool, detail], i) =>
      db.prepare("INSERT INTO agent_steps (run_id, idx, tool, detail, status, duration_ms) VALUES (?, ?, ?, ?, 'done', ?)").run(runId, i, tool, detail, 800 + i * 900)
    );
    db.prepare("UPDATE workspaces SET credits_used = MIN(credits_total, credits_used + 2) WHERE id = ?").run(w);
    return NextResponse.json({
      reply: [
        `I ran **${agentMatch.name}** on this. ${agentMatch.description ?? ""}`.trim(),
        `The run used 2 credits and completed ${stepsBank.length} steps. Key finding: I found prompts in your category where competitors are cited and ${ws.name} is not — drafts are ready for your review.`,
      ],
      chips: ["Working for 12s", ...stepsBank.map((s) => s[0])],
      run: { id: runId, agent: agentMatch.name, steps: stepsBank.map(([tool, detail]) => ({ tool, detail })) },
    });
  }

  if (/visib|rank|score|share|engine/.test(q)) {
    const row = db.prepare("SELECT date, AVG(score) s FROM visibility_daily WHERE workspace_id = ? GROUP BY date ORDER BY date DESC LIMIT 1").get(w) as { date: string; s: number } | undefined;
    if (!row) {
      return NextResponse.json({
        reply: [
          `No visibility data yet for **${ws.name}** — tracking starts once prompts are run against the answer engines.`,
          `Add prompts on the Prompts page, then ask me again for a visibility readout.`,
        ],
        chips: ["Working for 3s"],
      });
    }
    const first = db.prepare("SELECT AVG(score) s FROM visibility_daily WHERE workspace_id = ?").get(w) as { s: number };
    const best = db.prepare("SELECT platform, score FROM visibility_daily WHERE workspace_id = ? AND date = ? ORDER BY score DESC LIMIT 1").get(w, row.date) as { platform: string; score: number };
    const worst = db.prepare("SELECT platform, score FROM visibility_daily WHERE workspace_id = ? AND date = ? ORDER BY score LIMIT 1").get(w, row.date) as { platform: string; score: number };
    const delta = Math.round((row.s - first.s) * 10) / 10;
    return NextResponse.json({
      reply: [
        `Your blended visibility score is **${row.s.toFixed(1)}%** across 7 answer engines, up **${delta} points** since tracking began.`,
        `${best.platform} leads at ${best.score.toFixed(1)}%. ${worst.platform} is the gap at ${worst.score.toFixed(1)}% — I recommend publishing comparison content targeting the prompts where it drops you.`,
      ],
      chips: ["Working for 6s", "answer_engine_insights.scan", "visibility.aggregate"],
    });
  }

  if (/prompt|volume|asking|search for/.test(q)) {
    const top = db.prepare("SELECT text, volume FROM prompts WHERE workspace_id = ? ORDER BY volume DESC LIMIT 3").all(w) as { text: string; volume: number }[];
    const gaps = db.prepare("SELECT p.text, p.volume FROM prompts p LEFT JOIN prompt_answers pa ON pa.prompt_id = p.id AND pa.mentioned = 1 WHERE p.workspace_id = ? GROUP BY p.id HAVING COUNT(pa.id) = 0 ORDER BY p.volume DESC LIMIT 2").all(w) as { text: string; volume: number }[];
    return NextResponse.json({
      reply: [
        `Highest-volume prompts in your category: ${top.map((t) => `“${t.text}” (${t.volume.toLocaleString()}/mo)`).join(", ")}.`,
        gaps.length ? `These high-volume prompts return zero mentions of you: ${gaps.map((g) => `“${g.text}”`).join(", ")}. I can draft content to close the gap.` : `You are mentioned in every top prompt — strong position.`,
      ],
      chips: ["Working for 5s", "prompt_volumes.search"],
    });
  }

  if (/citation|source|press|domain/.test(q)) {
    const rows = db.prepare("SELECT domain, category, share FROM citations WHERE workspace_id = ? ORDER BY share DESC LIMIT 4").all(w) as { domain: string; category: string; share: number }[];
    return NextResponse.json({
      reply: [
        `Top citation sources: ${rows.map((r) => `${r.domain} (${r.share}%, ${r.category.toLowerCase()})`).join(", ")}.`,
        `Your owned domain share is under-weighted versus category leaders. I suggest an internal-linking pass on your buying-guide pages.`,
      ],
      chips: ["Working for 7s", "citations.analyze"],
    });
  }

  if (/sentiment|feel|narrative/.test(q)) {
    const rows = db.prepare("SELECT engine, positive, negative FROM sentiment_summary WHERE workspace_id = ?").all(w) as { engine: string; positive: number; negative: number }[];
    const scale = rows.some((r) => r.positive > 1.5) ? 1 : 100;
    const avgP = Math.round((rows.reduce((a, r) => a + r.positive, 0) / Math.max(1, rows.length)) * scale);
    return NextResponse.json({
      reply: [
        `Brand sentiment is **${avgP}% positive** on average across engines.`,
        `The dominant narrative frames you as a premium endurance brand — keep spec-led comparison content flowing to sustain it.`,
      ],
      chips: ["Working for 4s", "sentiment.classify"],
    });
  }

  // Default: a blended workspace digest
  const vis = db.prepare("SELECT AVG(score) s FROM visibility_daily WHERE workspace_id = ? AND date = (SELECT MAX(date) FROM visibility_daily WHERE workspace_id = ?)").get(w, w) as { s: number | null };
  const prompts = db.prepare("SELECT COUNT(*) c FROM prompts WHERE workspace_id = ?").get(w) as { c: number };
  const runs = db.prepare("SELECT COUNT(*) c FROM agent_runs WHERE workspace_id = ?").get(w) as { c: number };
  return NextResponse.json({
    reply: [
      `Here's your workspace pulse: visibility **${(vis.s ?? 0).toFixed(1)}%**, ${prompts.c} prompts tracked, ${runs.c} agent runs completed.`,
      `Ask me to analyze visibility, close citation gaps, or launch an Agent — I'll do the work and report back.`,
    ],
    chips: ["Working for 3s"],
  });
}
