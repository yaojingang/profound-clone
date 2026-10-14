import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const globalForDb = globalThis as unknown as { __profoundDb?: Database.Database };

export const db =
  globalForDb.__profoundDb ??
  (() => {
    const d = new Database(path.join(DATA_DIR, "profound.db"));
    d.pragma("journal_mode = WAL");
    d.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS workspaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  plan TEXT NOT NULL DEFAULT 'trial',
  credits_total INTEGER NOT NULL DEFAULT 100,
  credits_used INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS memberships (
  user_id INTEGER NOT NULL REFERENCES users(id),
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  role TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (user_id, workspace_id)
);
CREATE TABLE IF NOT EXISTS prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  text TEXT NOT NULL,
  topic TEXT,
  intent TEXT DEFAULT 'commercial',
  volume INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'tracking',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS prompt_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt_id INTEGER NOT NULL REFERENCES prompts(id),
  engine TEXT NOT NULL,
  mentioned INTEGER NOT NULL DEFAULT 0,
  position INTEGER,
  sentiment TEXT DEFAULT 'neutral',
  answered_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS citations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  domain TEXT NOT NULL,
  category TEXT NOT NULL,
  share REAL NOT NULL,
  change_pct REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS visibility_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  date TEXT NOT NULL,
  platform TEXT NOT NULL,
  score REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS sentiment_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  engine TEXT NOT NULL,
  positive REAL NOT NULL,
  neutral REAL NOT NULL,
  negative REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS factchecks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  claim TEXT NOT NULL,
  verdict TEXT NOT NULL,
  sources INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  path TEXT NOT NULL,
  title TEXT NOT NULL,
  ai_readable INTEGER NOT NULL DEFAULT 1,
  citations INTEGER DEFAULT 0,
  status TEXT DEFAULT 'live',
  last_audit TEXT
);
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  schedule TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS agent_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  status TEXT NOT NULL DEFAULT 'done',
  trigger TEXT DEFAULT 'manual',
  credits INTEGER DEFAULT 1,
  started_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS agent_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL REFERENCES agent_runs(id),
  idx INTEGER NOT NULL,
  tool TEXT NOT NULL,
  detail TEXT,
  status TEXT DEFAULT 'done',
  duration_ms INTEGER DEFAULT 1200
);
CREATE TABLE IF NOT EXISTS agent_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  installs INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS shopping_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  sku TEXT,
  merchant TEXT,
  price REAL,
  rating REAL,
  visibility REAL DEFAULT 0,
  cited_by TEXT
);
CREATE TABLE IF NOT EXISTS agent_traffic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  date TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  hits INTEGER NOT NULL,
  citations INTEGER DEFAULT 0,
  referrals INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS dashboards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  layout TEXT DEFAULT '[]',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_used TEXT
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  size TEXT,
  message TEXT,
  source TEXT DEFAULT 'get-a-demo',
  status TEXT DEFAULT 'new',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS platform_stats (
  date TEXT PRIMARY KEY,
  signups INTEGER DEFAULT 0,
  demo_requests INTEGER DEFAULT 0,
  agent_runs INTEGER DEFAULT 0,
  prompts_tracked INTEGER DEFAULT 0
);
`);
    return d;
  })();

if (process.env.NODE_ENV !== "production") globalForDb.__profoundDb = db;

export const ENGINES = [
  "ChatGPT",
  "Perplexity",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "AI Overviews",
  "DeepSeek",
] as const;

export const CATEGORIES = ["earned", "owned", "social", "competition", "blog", "other"] as const;
