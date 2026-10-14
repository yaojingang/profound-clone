/* Seed the Profound clone database with realistic sample data. */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, "profound.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = OFF");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

const daysAgo = (n) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 19).replace("T", " ");
const dateDaysAgo = (n) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10);
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

db.exec(`
DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS workspaces; DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS prompts; DROP TABLE IF EXISTS prompt_answers; DROP TABLE IF EXISTS citations;
DROP TABLE IF EXISTS visibility_daily; DROP TABLE IF EXISTS sentiment_summary; DROP TABLE IF EXISTS factchecks;
DROP TABLE IF EXISTS pages; DROP TABLE IF EXISTS agents; DROP TABLE IF EXISTS agent_runs;
DROP TABLE IF EXISTS agent_steps; DROP TABLE IF EXISTS agent_templates; DROP TABLE IF EXISTS shopping_products;
DROP TABLE IF EXISTS agent_traffic; DROP TABLE IF EXISTS dashboards; DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS leads; DROP TABLE IF EXISTS sessions; DROP TABLE IF EXISTS platform_stats;
`);

db.exec(`
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, last_login_at TEXT);
CREATE TABLE workspaces (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, domain TEXT, plan TEXT NOT NULL DEFAULT 'trial', credits_total INTEGER NOT NULL DEFAULT 100, credits_used INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL);
CREATE TABLE memberships (user_id INTEGER NOT NULL REFERENCES users(id), workspace_id INTEGER NOT NULL REFERENCES workspaces(id), role TEXT NOT NULL DEFAULT 'member', PRIMARY KEY (user_id, workspace_id));
CREATE TABLE prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), text TEXT NOT NULL, topic TEXT, intent TEXT DEFAULT 'commercial', volume INTEGER NOT NULL DEFAULT 0, difficulty TEXT DEFAULT 'medium', status TEXT DEFAULT 'tracking', created_at TEXT NOT NULL);
CREATE TABLE prompt_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, prompt_id INTEGER NOT NULL REFERENCES prompts(id), engine TEXT NOT NULL, mentioned INTEGER NOT NULL DEFAULT 0, position INTEGER, sentiment TEXT DEFAULT 'neutral', answered_at TEXT NOT NULL);
CREATE TABLE citations (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), domain TEXT NOT NULL, category TEXT NOT NULL, share REAL NOT NULL, change_pct REAL DEFAULT 0);
CREATE TABLE visibility_daily (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), date TEXT NOT NULL, platform TEXT NOT NULL, score REAL NOT NULL);
CREATE TABLE sentiment_summary (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), engine TEXT NOT NULL, positive REAL NOT NULL, neutral REAL NOT NULL, negative REAL NOT NULL);
CREATE TABLE factchecks (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), claim TEXT NOT NULL, verdict TEXT NOT NULL, sources INTEGER DEFAULT 0, status TEXT DEFAULT 'open', created_at TEXT NOT NULL);
CREATE TABLE pages (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), path TEXT NOT NULL, title TEXT NOT NULL, ai_readable INTEGER NOT NULL DEFAULT 1, citations INTEGER DEFAULT 0, status TEXT DEFAULT 'live', last_audit TEXT);
CREATE TABLE agents (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), name TEXT NOT NULL, type TEXT NOT NULL, description TEXT, schedule TEXT DEFAULT 'manual', status TEXT DEFAULT 'active', created_at TEXT NOT NULL);
CREATE TABLE agent_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, agent_id INTEGER NOT NULL REFERENCES agents(id), workspace_id INTEGER NOT NULL REFERENCES workspaces(id), status TEXT NOT NULL DEFAULT 'done', trigger TEXT DEFAULT 'manual', credits INTEGER DEFAULT 1, started_at TEXT NOT NULL, finished_at TEXT);
CREATE TABLE agent_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, run_id INTEGER NOT NULL REFERENCES agent_runs(id), idx INTEGER NOT NULL, tool TEXT NOT NULL, detail TEXT, status TEXT DEFAULT 'done', duration_ms INTEGER DEFAULT 1200);
CREATE TABLE agent_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT, installs INTEGER DEFAULT 0);
CREATE TABLE shopping_products (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), name TEXT NOT NULL, sku TEXT, merchant TEXT, price REAL, rating REAL, visibility REAL DEFAULT 0, cited_by TEXT);
CREATE TABLE agent_traffic (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), date TEXT NOT NULL, agent_name TEXT NOT NULL, hits INTEGER NOT NULL, citations INTEGER DEFAULT 0, referrals INTEGER DEFAULT 0);
CREATE TABLE dashboards (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), name TEXT NOT NULL, layout TEXT DEFAULT '[]', created_at TEXT NOT NULL);
CREATE TABLE api_keys (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id INTEGER NOT NULL REFERENCES workspaces(id), name TEXT NOT NULL, prefix TEXT NOT NULL, created_at TEXT NOT NULL, last_used TEXT);
CREATE TABLE leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT, size TEXT, message TEXT, source TEXT DEFAULT 'get-a-demo', status TEXT DEFAULT 'new', created_at TEXT NOT NULL);
CREATE TABLE sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at TEXT NOT NULL);
CREATE TABLE platform_stats (date TEXT PRIMARY KEY, signups INTEGER DEFAULT 0, demo_requests INTEGER DEFAULT 0, agent_runs INTEGER DEFAULT 0, prompts_tracked INTEGER DEFAULT 0);
`);

// ---------- users / workspaces ----------
const insUser = db.prepare("INSERT INTO users (email, password_hash, name, role, status, created_at, last_login_at) VALUES (?,?,?,?,?,?,?)");
const insWs = db.prepare("INSERT INTO workspaces (name, slug, domain, plan, credits_total, credits_used, status, created_at) VALUES (?,?,?,?,?,?,?,?)");
const insMember = db.prepare("INSERT INTO memberships (user_id, workspace_id, role) VALUES (?,?,?)");

const demoId = insUser.run("demo@profound.local", hashPassword("demo1234"), "Dana Chen", "user", "active", daysAgo(90), daysAgo(0)).lastInsertRowid;
const adminId = insUser.run("admin@profound.local", hashPassword("admin1234"), "Platform Admin", "admin", "active", daysAgo(180), daysAgo(1)).lastInsertRowid;
const teamUsers = [
  ["maria@wrenfield.co", "Maria Ruiz"], ["jake@wrenfield.co", "Jake Stone"], ["priya@wrenfield.co", "Priya Nair"],
  ["tom@wrenfield.co", "Tomas Weber"], ["aisha@wrenfield.co", "Aisha Bell"], ["ken@wrenfield.co", "Ken Watanabe"],
  ["sofia@ramp.com", "Sofia Almeida"], ["liam@hoop.co", "Liam O'Brien"], ["emma@clay.com", "Emma Laurent"],
  ["noah@ubank.io", "Noah Kim"], ["ava@mejuri.com", "Ava Thompson"], ["ethan@comcast.com", "Ethan Ross"],
  ["mia@rbc.com", "Mia Campbell"], ["lucas@monster.com", "Lucas Meyer"], ["zoe@walmart.com", "Zoe Anderson"],
];
teamUsers.forEach(([email, name], i) => insUser.run(email, hashPassword("user1234"), name, "user", i === 14 ? "invited" : "active", daysAgo(rnd(1, 150)), daysAgo(rnd(0, 10))));

const wrenfieldId = insWs.run("Wrenfield", "wrenfield", "wrenfield.co", "trial", 100, 0, "active", daysAgo(90)).lastInsertRowid;
const rampId = insWs.run("Ramp", "ramp", "ramp.com", "enterprise", 100000, 41230, "active", daysAgo(400)).lastInsertRowid;
const hoistId = insWs.run("Whoop", "whoop", "whoop.com", "enterprise", 100000, 22980, "active", daysAgo(320)).lastInsertRowid;
const clayId = insWs.run("Clay", "clay", "clay.com", "enterprise", 100000, 18455, "active", daysAgo(280)).lastInsertRowid;
insMember.run(demoId, wrenfieldId, "owner");
insMember.run(demoId, rampId, "member");
insMember.run(adminId, wrenfieldId, "admin");
insMember.run(adminId, rampId, "admin");
teamUsers.slice(0, 6).forEach(([, name], i) => insMember.run(i + 3, wrenfieldId, i === 0 ? "admin" : "member"));
teamUsers.slice(6).forEach((_, i) => insMember.run(i + 9, rampId + (i % 3), "member"));

// ---------- prompts ----------
const promptBank = [
  ["best e-bike with long battery life", "Battery", "commercial", 18400, "high"],
  ["best commuter e-bike under $2000", "Commuter", "commercial", 12100, "medium"],
  ["wrenfield vs rad power bikes", "Comparison", "commercial", 5400, "high"],
  ["is wrenfield a good e-bike brand", "Brand", "informational", 8100, "medium"],
  ["e-bike buying guide for beginners", "Buying guide", "informational", 22000, "low"],
  ["most reliable electric bike 2026", "Reliability", "commercial", 9800, "high"],
  ["e-bike with best warranty", "Warranty", "commercial", 4300, "medium"],
  ["lightweight e-bike for city riding", "Commuter", "commercial", 7600, "medium"],
  ["best e-bike for hilly terrain", "Performance", "commercial", 6200, "medium"],
  ["wrenfield arc review", "Product", "commercial", 3300, "low"],
  ["cheapest e-bike with torque sensor", "Price", "commercial", 5100, "medium"],
  ["do e-bikes need insurance", "Legal", "informational", 14000, "low"],
  ["e-bike maintenance schedule", "Maintenance", "informational", 9200, "low"],
  ["best cargo e-bike for family", "Cargo", "commercial", 8800, "high"],
  ["wrenfield discount code", "Deals", "transactional", 2400, "low"],
  ["how long do e-bike batteries last", "Battery", "informational", 26000, "low"],
  ["e-bike vs scooter for commuting", "Comparison", "informational", 11000, "medium"],
  ["best electric bike for seniors", "Demographic", "commercial", 7000, "medium"],
  ["are wrenfield e-bikes waterproof", "Product", "informational", 1900, "low"],
  ["fastest legal e-bike in the US", "Performance", "commercial", 9600, "high"],
  ["e-bike brands made in USA", "Origin", "commercial", 5900, "medium"],
  ["best e-bike apps and displays", "Accessory", "informational", 3100, "low"],
  ["wrenfield battery replacement cost", "Battery", "transactional", 1500, "low"],
  ["best foldable e-bike for travel", "Cargo", "commercial", 6700, "medium"],
  ["e-bike tax credit California", "Legal", "informational", 8300, "low"],
  ["quietest e-bike motor", "Performance", "commercial", 2900, "medium"],
  ["wrenfield vs acre bikes", "Comparison", "commercial", 2100, "high"],
  ["best e-bike for delivery riders", "Commercial use", "commercial", 4700, "medium"],
  ["how to store e-bike in winter", "Maintenance", "informational", 5600, "low"],
  ["e-bike helmet laws by state", "Legal", "informational", 12300, "low"],
  ["best budget e-bike 2026", "Price", "commercial", 31000, "high"],
  ["wrenfield arc vs commuter pro", "Comparison", "commercial", 1800, "low"],
  ["longest range electric bike", "Battery", "commercial", 15800, "high"],
  ["e-bike financing options", "Price", "transactional", 3900, "medium"],
  ["best e-bike for tall riders", "Demographic", "commercial", 2600, "low"],
  ["are e-bikes allowed on bike paths", "Legal", "informational", 10200, "low"],
  ["wrenfield customer service reviews", "Brand", "informational", 1400, "low"],
  ["best e-bike racks for cars", "Accessory", "commercial", 4900, "low"],
  ["electric bike weight limit", "Product", "informational", 7300, "low"],
  ["wrenfield student discount", "Deals", "transactional", 900, "low"],
];
const insPrompt = db.prepare("INSERT INTO prompts (workspace_id, text, topic, intent, volume, difficulty, status, created_at) VALUES (?,?,?,?,?,?,?,?)");
const insAnswer = db.prepare("INSERT INTO prompt_answers (prompt_id, engine, mentioned, position, sentiment, answered_at) VALUES (?,?,?,?,?,?)");
const ENGINES = ["ChatGPT", "Perplexity", "Claude", "Gemini", "Microsoft Copilot", "AI Overviews", "DeepSeek"];
const wrenShare = /wrenfield|arc/i;
promptBank.forEach(([text, topic, intent, volume, difficulty], i) => {
  const pid = insPrompt.run(wrenfieldId, text, topic, intent, volume, difficulty, i < 36 ? "tracking" : "paused", daysAgo(rnd(5, 85))).lastInsertRowid;
  const baseMention = wrenShare.test(text) ? (i % 3 === 0 ? 1 : 0.5) : 0.3;
  ENGINES.forEach((engine, e) => {
    const roll = Math.random();
    const mentioned = roll < baseMention * (engine === "ChatGPT" ? 1.2 : 1) ? 1 : 0;
    const sentiment = mentioned ? (roll < 0.55 ? "positive" : roll < 0.9 ? "neutral" : "negative") : "neutral";
    insAnswer.run(pid, engine, mentioned, mentioned ? rnd(1, 6) : null, sentiment, daysAgo(rnd(0, 6)));
  });
});

// ---------- citations ----------
const insCitation = db.prepare("INSERT INTO citations (workspace_id, domain, category, share, change_pct) VALUES (?,?,?,?,?)");
[
  ["nerdwallet.com", "earned", 4.22, 0.09],
  ["bikeradar.com", "earned", 3.87, 0.21],
  ["wrenfield.co", "owned", 3.41, 0.64],
  ["reddit.com", "social", 3.02, -0.11],
  ["youtube.com", "social", 2.84, 0.35],
  ["cyclingweekly.com", "earned", 2.61, 0.04],
  ["wirecutter.com", "earned", 2.33, -0.08],
  ["radpowerbikes.com", "competition", 2.18, -0.03],
  ["wikipedia.org", "other", 1.97, 0.02],
  ["medium.com", "blog", 1.64, 0.12],
  ["electricbikereview.com", "earned", 1.51, 0.18],
  ["acespring.com", "competition", 1.32, -0.21],
  ["wrenfield.co/blog", "owned", 1.24, 0.41],
  ["trustpilot.com", "social", 1.12, 0.06],
  ["forbes.com", "earned", 0.98, 0.03],
  ["velofleet.io", "blog", 0.71, 0.09],
].forEach(([domain, category, share, change]) => insCitation.run(wrenfieldId, domain, category, share, change));

// ---------- visibility ----------
const insVis = db.prepare("INSERT INTO visibility_daily (workspace_id, date, platform, score) VALUES (?,?,?,?)");
const visTarget = { ChatGPT: 44, Perplexity: 36, Claude: 21, Gemini: 29, "Microsoft Copilot": 17, "AI Overviews": 33, DeepSeek: 9 };
for (let d = 89; d >= 0; d--) {
  Object.entries(visTarget).forEach(([platform, target], pi) => {
    const growth = ((89 - d) / 89) * 14 * (pi % 3 === 0 ? 1.2 : 0.8);
    const noise = Math.sin((d + pi * 7) / 5) * 3 + (Math.random() * 2 - 1);
    insVis.run(wrenfieldId, dateDaysAgo(d), platform, Math.max(1, Math.min(95, target - growth + noise)).toFixed(1));
  });
}

// ---------- sentiment ----------
const insSent = db.prepare("INSERT INTO sentiment_summary (workspace_id, engine, positive, neutral, negative) VALUES (?,?,?,?,?)");
[["ChatGPT", 58, 32, 10], ["Perplexity", 51, 38, 11], ["Claude", 62, 29, 9], ["Gemini", 47, 40, 13], ["Microsoft Copilot", 44, 42, 14], ["AI Overviews", 49, 39, 12], ["DeepSeek", 38, 47, 15]].forEach(([e, p, n, g]) => insSent.run(wrenfieldId, e, p, n, g));

// ---------- factchecks ----------
const insFc = db.prepare("INSERT INTO factchecks (workspace_id, claim, verdict, sources, status, created_at) VALUES (?,?,?,?,?,?)");
[
  ["Wrenfield e-bikes have a 30-mile maximum range", "inaccurate", 6, "corrected"],
  ["Wrenfield went out of business in 2025", "false", 9, "monitoring"],
  ["Wrenfield Arc weighs 72 lbs", "inaccurate", 4, "corrected"],
  ["Wrenfield offers a 10-year battery warranty", "unverified", 3, "open"],
  ["Wrenfield bikes are manufactured in Ohio", "partially-accurate", 5, "monitoring"],
  ["Wrenfield Arc battery is not user-replaceable", "false", 7, "corrected"],
].forEach(([claim, verdict, sources, status], i) => insFc.run(wrenfieldId, claim, verdict, sources, status, daysAgo(90 - i * 12)));

// ---------- pages ----------
const insPage = db.prepare("INSERT INTO pages (workspace_id, path, title, ai_readable, citations, status, last_audit) VALUES (?,?,?,?,?,?,?)");
[
  ["/", "Wrenfield — Electric bikes built for real cities", 1, 214],
  ["/bikes/arc", "Wrenfield Arc — long-range commuter e-bike", 1, 186],
  ["/bikes/commuter-pro", "Commuter Pro — torque-sensor city e-bike", 1, 132],
  ["/guides/best-e-bikes-2026", "Best e-bikes of 2026: tested and ranked", 1, 98],
  ["/guides/buyers-guide-to-sustainability", "The buyer's guide to sustainable e-bikes", 1, 76],
  ["/blog/sf-commuters-ratings", "We asked 500 SF commuters about e-bikes", 1, 54],
  ["/blog/popular-e-bike-decal-kits", "12 popular e-bike decal kits this year", 0, 12],
  ["/blog/updates-to-our-arc-e-bike", "Updates to the Arc: 2026 refresh", 1, 41],
  ["/blog/fathers-day-gifts-2026", "Father's Day gift guide for riders", 1, 18],
  ["/support/battery-care", "Battery care and replacement", 0, 6],
  ["/dealer-locator", "Find a Wrenfield dealer", 1, 9],
  ["/company/about", "About Wrenfield", 1, 27],
].forEach(([p, t, r, c], i) => insPage.run(wrenfieldId, p, t, r, c, i === 10 ? "staged" : "live", daysAgo(rnd(0, 20))));

// ---------- agents ----------
const insAgent = db.prepare("INSERT INTO agents (workspace_id, name, type, description, schedule, status, created_at) VALUES (?,?,?,?,?,?,?)");
const insRun = db.prepare("INSERT INTO agent_runs (agent_id, workspace_id, status, trigger, credits, started_at, finished_at) VALUES (?,?,?,?,?,?,?)");
const insStep = db.prepare("INSERT INTO agent_steps (run_id, idx, tool, detail, status, duration_ms) VALUES (?,?,?,?,?,?)");
const agentDefs = [
  ["AEO Content Writer", "content-creation", "Finds prompts where Wrenfield is invisible and drafts citation-worthy articles.", "daily 06:00"],
  ["Page Optimizer", "content-optimization", "Audited pages for citation decay and staged rewrites in the CMS.", "weekly Mon 08:00"],
  ["Citation Chaser", "outreach", "Traces which publishers repeat outdated specs and drafts correction pitches.", "weekly Fri 09:00"],
  ["Prompt Bid Manager", "growth", "Bids on high-volume commercial prompts for sponsored answers.", "daily 05:30"],
  ["Social Repurposer", "social", "Turns long-form guides into platform-sized threads and posts.", "daily 07:00"],
  ["FactCheck Sentinel", "monitoring", "Monitors AI answers for factual drift about Wrenfield specs.", "every 6h"],
  ["Launch Kit Builder", "product-marketing", "Builds launch one-pagers, FAQs, and talk tracks from product briefs.", "manual"],
];
const agentIds = agentDefs.map(([name, type, desc, schedule], i) =>
  insAgent.run(wrenfieldId, name, type, desc, schedule, i === 6 ? "paused" : "active", daysAgo(80 - i * 3)).lastInsertRowid
);
const stepBank = {
  "AEO Content Writer": [["brainstorm.angles", "Found 4 content gaps against competitor coverage"], ["retrieval.prompts", "Pulled top 40 prompts for 'e-bike battery life'"], ["web.search", "Scrubbed 18 competitor guides and 3 YouTube reviews"], ["write.draft", "Drafted 1,800-word pillar with FAQ schema"], ["cms.stage", "Staged as draft in Contentful"], ["notify.slack", "Posted summary to #aeo-wins"]],
  "Page Optimizer": [["crawl.pages", "Audited 214 pages for citation decay"], ["diff.rank", "Ranked 9 pages losing visibility"], ["rewrite.apply", "Rewrote headings, FAQ blocks, and schema"], ["cms.stage", "Staged 9 drafts, nothing live"], ["report.build", "Attached before/after visibility forecast"]],
  "Citation Chaser": [["factcheck.scan", "Found 6 publishers quoting 2024 range specs"], ["web.search", "Located author + editor for each article"], ["write.pitch", "Drafted 6 personalized correction briefs"], ["mail.draft", "Queued outreach drafts for review"]],
  "Prompt Bid Manager": [["retrieval.prompts", "Scored 214 tracked prompts by volume × intent"], ["budget.optimize", "Reallocated $1,200 to 8 rising prompts"], ["ads.stage", "Staged sponsored answer creatives"], ["report.build", "Weekly pacing report ready"]],
  "Social Repurposer": [["retrieval.docs", "Pulled latest pillar guide"], ["write.thread", "Wrote 7-post thread for X"], ["image.generate", "Generated 3 aspect ratios per post"], ["schedule.queue", "Queued for next week 9:00–9:30"]],
  "FactCheck Sentinel": [["answer.sample", "Sampled 98 AI answers about Wrenfield"], ["claim.extract", "Extracted 14 checkable claims"], ["factcheck.verify", "Flagged 2 claims drifting from spec sheet"], ["alert.create", "Opened alerts with source diffs"]],
  "Launch Kit Builder": [["retrieval.brief", "Read endurance launch brief"], ["write.messaging", "Generated messaging doc + one-pager"], ["write.faq", "Drafted FAQ and rep talk track"], ["doc.package", "Packaged endurance-launch-kit.pdf"]],
};
agentIds.forEach((aid, i) => {
  const def = agentDefs[i];
  const runCount = def[3] === "manual" ? 2 : rnd(4, 9);
  for (let r = 0; r < runCount; r++) {
    const started = daysAgo(rnd(0, 30) + Math.random());
    const status = r === 0 && i === 0 ? "running" : "done";
    const runId = insRun.run(aid, wrenfieldId, status, r % 3 === 0 ? "schedule" : "manual", rnd(1, 4), started, status === "done" ? started : null).lastInsertRowid;
    const steps = stepBank[def[0]];
    steps.forEach(([tool, detail], sIdx) => {
      const isLast = sIdx === steps.length - 1;
      const st = status === "running" && isLast ? "running" : "done";
      insStep.run(runId, sIdx, tool, detail, st, rnd(400, 5200));
    });
  }
});

// ---------- templates ----------
const insTpl = db.prepare("INSERT INTO agent_templates (slug, name, category, description, installs) VALUES (?,?,?,?,?)");
[
  ["aeo-content-engine", "AEO Content Engine", "Content", "Research what answer engines cite for your topic, then draft the pages they'll want to quote.", 4821],
  ["citation-recovery", "Citation Recovery", "AEO", "Find pages losing citations and rebuild them against the prompts they used to win.", 3910],
  ["shopping-shelf-watcher", "Shopping Shelf Watcher", "Retail", "Track your SKUs in ChatGPT Shopping and flag merchants that underprice or mislist you.", 2745],
  ["factcheck-sentinel", "FactCheck Sentinel", "Monitoring", "Continuously verify AI claims about your brand against your source of truth.", 2604],
  ["social-voice", "Social Voice", "Social", "Repurpose pillars into on-brand posts per platform, with your POV intact.", 2388],
  ["prompt-bidder", "Prompt Bidder", "Growth", "Find high-volume prompts you don't earn organically and stage sponsored answers.", 2117],
  ["launch-kit", "Launch Kit Builder", "Product Marketing", "Turn a product brief into messaging, one-pager, FAQ, and enablement assets.", 1993],
  ["brand-consistency-scanner", "Brand Consistency Scanner", "Brand", "Scan owned surfaces for retired names, off-brand claims, and stale creative.", 1642],
  ["agency-client-reporter", "Agency Client Reporter", "Agencies", "Generate monthly AEO progress reports per client with benchmarks.", 1518],
  ["review-miner", "Review Miner", "Insights", "Mine reviews and forums for the language customers actually use.", 1320],
  ["competitor-diff", "Competitor Diff", "AEO", "Weekly diff of competitor visibility, citations, and messaging.", 1187],
  ["pr-correction-writer", "PR Correction Writer", "PR & Comms", "Trace wrong claims to publishers and draft personalized corrections.", 940],
].forEach(([slug, name, cat, desc, installs]) => insTpl.run(slug, name, cat, desc, installs));

// ---------- shopping ----------
const insProd = db.prepare("INSERT INTO shopping_products (workspace_id, name, sku, merchant, price, rating, visibility, cited_by) VALUES (?,?,?,?,?,?,?,?)");
[
  ["Wrenfield Arc", "WF-ARC-52", "wrenfield.co", 1899, 4.7, 61, "ChatGPT"],
  ["Wrenfield Arc (Refurb)", "WF-ARC-RF", "amazon.com", 1499, 4.5, 44, "ChatGPT"],
  ["Commuter Pro", "WF-CPro", "wrenfield.co", 2199, 4.8, 57, "Perplexity"],
  ["Commuter Lite", "WF-CLite", "bestbuy.com", 1599, 4.4, 38, "Gemini"],
  ["Trailhead GT", "WF-Trail-GT", "wrenfield.co", 2799, 4.6, 33, "Claude"],
  ["Arc Battery Pack", "WF-BATT-02", "wrenfield.co", 399, 4.3, 21, "AI Overviews"],
  ["City Pannier Set", "WF-PANNIER", "amazon.com", 129, 4.2, 12, "ChatGPT"],
  ["Kids Cargo Seat", "WF-KIDS", "walmart.com", 179, 4.1, 9, "Microsoft Copilot"],
  ["Commuter Fenders", "WF-FEND", "wrenfield.co", 79, 4.0, 7, "Perplexity"],
  ["Arc Display Upgrade", "WF-DISP", "bestbuy.com", 149, 4.4, 11, "Gemini"],
].forEach(([n, sku, m, p, r, v, cited]) => insProd.run(wrenfieldId, n, sku, m, p, r, v, cited));

// ---------- agent traffic ----------
const insTraffic = db.prepare("INSERT INTO agent_traffic (workspace_id, date, agent_name, hits, citations, referrals) VALUES (?,?,?,?,?,?)");
const agentBots = [["GPTBot", 1.0], ["ClaudeBot", 0.55], ["PerplexityBot", 0.7], ["Google-Extended", 0.9], ["Applebot-Extended", 0.25], ["Meta-ExternalAgent", 0.2], ["Bytespider", 0.35]];
for (let d = 59; d >= 0; d--) {
  agentBots.forEach(([bot, k]) => {
    const base = 320 * k * (1 + (59 - d) / 90);
    const hits = Math.round(base + Math.random() * 60);
    insTraffic.run(wrenfieldId, dateDaysAgo(d), bot, hits, Math.round(hits * 0.06 * Math.random() + 2), Math.round(hits * 0.018 * Math.random() + 1));
  });
}

// ---------- dashboards / keys / leads / platform stats ----------
const insDash = db.prepare("INSERT INTO dashboards (workspace_id, name, layout, created_at) VALUES (?,?,?,?)");
insDash.run(wrenfieldId, "Executive AEO Overview", JSON.stringify(["visibility", "citations", "prompts", "sentiment"]), daysAgo(40));
insDash.run(wrenfieldId, "Agency Weekly Report", JSON.stringify(["visibility", "agent_traffic", "citations"]), daysAgo(22));
insDash.run(wrenfieldId, "Commerce Shelf Tracker", JSON.stringify(["shopping", "prompts"]), daysAgo(9));

const insKey = db.prepare("INSERT INTO api_keys (workspace_id, name, prefix, created_at, last_used) VALUES (?,?,?,?,?)");
insKey.run(wrenfieldId, "Production key", "pf_live_7f3a", daysAgo(60), daysAgo(0));
insKey.run(wrenfieldId, "CI smoke tests", "pf_test_91cd", daysAgo(30), daysAgo(3));

const insLead = db.prepare("INSERT INTO leads (name, email, company, size, message, source, status, created_at) VALUES (?,?,?,?,?,?,?,?)");
[
  ["Rachel Kim", "rachel@fleetbikes.com", "Fleet Bikes", "201-500", "Evaluating AEO platforms for 3 brands.", "contact-sales", "new"],
  ["Omar Haddad", "omar@velocommerce.io", "VeloCommerce", "51-200", "Interested in Shopping module + API.", "pricing", "contacted"],
  ["Grace Liu", "grace@northstar.agency", "Northstar Agency", "11-50", "Agency plan for 12 clients.", "partner-demo", "demo-booked"],
  ["Peter Novak", "peter@summitoutdoor.com", "Summit Outdoor", "501-1000", "Enterprise security questionnaire.", "enterprise", "new"],
  ["Ana Torres", "ana@brightpatrol.co", "BrightPatrol", "1-10", "Trial credits exhausted, pricing?", "get-started", "won"],
].forEach(([n, e, c, s, m, src, st], i) => insLead.run(n, e, c, s, m, src, st, daysAgo(i * 2 + 1)));

const insStat = db.prepare("INSERT INTO platform_stats (date, signups, demo_requests, agent_runs, prompts_tracked) VALUES (?,?,?,?,?)");
for (let d = 89; d >= 0; d--) {
  const trend = 1 + (89 - d) / 60;
  insStat.run(dateDaysAgo(d), Math.round(rnd(18, 42) * trend), Math.round(rnd(4, 12) * trend), Math.round(rnd(900, 1500) * trend), Math.round(38000 + (89 - d) * 210 + rnd(-400, 400)));
}

db.exec(`CREATE INDEX IF NOT EXISTS idx_vis ON visibility_daily(workspace_id, date);
CREATE INDEX IF NOT EXISTS idx_traffic ON agent_traffic(workspace_id, date);
CREATE INDEX IF NOT EXISTS idx_runs ON agent_runs(agent_id);`);

const counts = {};
["users", "workspaces", "prompts", "prompt_answers", "citations", "visibility_daily", "agents", "agent_runs", "agent_steps", "agent_traffic", "pages"].forEach((t) => (counts[t] = db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c));
console.log("Seed complete:", JSON.stringify(counts));
