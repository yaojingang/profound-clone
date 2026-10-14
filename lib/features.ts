export type FeatureSection = {
  h: string;
  p: string;
  viz: "dashboard" | "traffic" | "chat" | "brief" | "graph" | "docs" | "records" | "gaps" | "scale" | "publish" | "templates" | "impact" | "security" | "benchmark" | "sentiment" | "citations" | "factcheck" | "visibility" | "shopping" | "prompts" | "intent" | "compete" | "trust" | "alert" | "handoff" | "collab" | "cms" | "connect" | "synthesize" | "personal" | "brain" | "how" | null;
};

export type FeatureDef = {
  slug: string;
  eyebrow: string;
  title: string;
  sub: string;
  sections: FeatureSection[];
  faq?: [string, string][];
  cta?: string;
};

export const FEATURES: FeatureDef[] = [
  {
    slug: "answer-engine-insights",
    eyebrow: "Answer Engine Insights",
    title: "Understand how AI is talking about your brand",
    sub: "See your visibility, sentiment, citations, and accuracy across every major answer engine — and fix what's wrong.",
    sections: [
      { h: "See what AI is getting wrong about your brand", p: "FactCheck continuously verifies AI claims about your brand against your source of truth, then traces where the wrong story spreads.", viz: "factcheck" },
      { h: "Understand and control your AI Presence", p: "One workspace for every signal: visibility scores per platform, sentiment trends, and the citations driving your narrative.", viz: "visibility" },
      { h: "Visibility Scores", p: "A daily, platform-by-platform measure of how often you appear in the answers that matter to your category.", viz: "visibility" },
      { h: "Sentiment & Keyword Insights", p: "Understand the words engines attach to your brand, and the narrative shifts week over week.", viz: "sentiment" },
      { h: "Citation Authority", p: "Discover which websites drive AI answers about you — earned, owned, social, or competitor.", viz: "citations" },
    ],
    faq: [
      ["Which engines do you track?", "ChatGPT, Perplexity, Claude, Gemini, Microsoft Copilot, Google AI Overviews, DeepSeek, and more on Enterprise."],
      ["How often do you run prompts?", "Daily by default. Enterprise plans support custom frequency and regions."],
    ],
  },
  {
    slug: "agent-analytics",
    eyebrow: "Agent Analytics",
    title: "Track and Analyze AI Traffic To Your Site",
    sub: "Understand how AI agents crawl, cite, and refer traffic to your domains — and how you rank against the competition.",
    sections: [
      { h: "Understand how you rank against the competition", p: "Benchmark crawl rates, citation share, and referral traffic against industry peers.", viz: "benchmark" },
      { h: "Understand and influence how AI systems interact with your site", p: "GPTBot, ClaudeBot, PerplexityBot and 20+ more agents — see exactly what they read and what they cite.", viz: "traffic" },
      { h: "Seamless Integration. Enterprise-Grade Security.", p: "Deploy via CDN integrations — Cloudflare, Akamai, Fastly, Vercel — with no code changes and SOC 2-grade data handling.", viz: "security" },
    ],
  },
  {
    slug: "aim",
    eyebrow: "Aim",
    title: "Meet your AI Marketer",
    sub: "Aim is the AI marketer trained on what consumers prompt, what agents cite, and the context only your teams have.",
    sections: [
      { h: "Get alerted to the opportunities that matter most to your brand's success", p: "Aim monitors every answer engine for gaps where you should appear — and ranks them by revenue impact.", viz: "alert" },
      { h: "Get data-backed briefs that turn every opportunity into a plan", p: "Each opportunity ships with a brief grounded in prompt volume, citation data, and your positioning.", viz: "brief" },
      { h: "Get one-click handoffs to Profound Agents", p: "Approve a plan and Aim hands the work to the right Agent, with your brand context attached.", viz: "handoff" },
      { h: "Get a system that closes the loop with impact measurement", p: "Every published change is tracked back to visibility movement, so you know what worked.", viz: "impact" },
      { h: "Get an AI marketing expert trained on your data", p: "Context Manager keeps Aim current with your positioning, voice, and product truth.", viz: "brain" },
    ],
    faq: [
      ["Is Aim just a chatbot?", "No. Aim operates inside your workspace with your data, runs Agents, and produces artifacts — briefs, pages, campaigns — for your approval."],
      ["What can Aim access?", "Only what you connect: your Context Manager records, tracked prompts, and analytics. Nothing else."],
    ],
  },
  {
    slug: "agents",
    eyebrow: "Agents",
    title: "Your marketing team, multiplied.",
    sub: "Build and reuse workflows for your team's recurring marketing work. Run one, or run a thousand in Sheets.",
    sections: [
      { h: "Start fast with a library of pre-built Agent templates", p: "AEO content, citation recovery, PR corrections, shopping watchers — install a template and go.", viz: "templates" },
      { h: "Customize with drag and drop ease", p: "Compose steps from retrieval, writing, search, image generation, CMS, and notification tools.", viz: "how" },
      { h: "Execute campaigns optimized for AI Search", p: "Every output is grounded in what answer engines actually cite, not best guesses.", viz: "compete" },
      { h: "Publish campaign-ready content", p: "Drafts land staged in your CMS — nothing goes live without your approval.", viz: "publish" },
      { h: "Deploy Agents at scale with Sheets", p: "Point an Agent at a spreadsheet of products, pages, or markets and let it rip.", viz: "scale" },
      { h: "Agents turn signals into AI-ready marketing campaigns", p: "The loop: monitor signals, draft the work, measure the lift, repeat.", viz: "impact" },
    ],
  },
  {
    slug: "prompt-volumes",
    eyebrow: "Prompt Volumes",
    title: "Uncover the keywords and topics driving AI conversations",
    sub: "Billions of real user conversations, organized into clusters you can act on.",
    sections: [
      { h: "Organize, visualize, and explore keyword relationships", p: "Explore the prompt graph around your category — volumes, growth, and adjacency.", viz: "graph" },
      { h: "Track what real users are asking", p: "Not keyword tools. Real prompts, from real conversations, refreshed continuously.", viz: "prompts" },
      { h: "Understand and meet the intent behind every AI conversation", p: "Commercial, informational, transactional — see the intent mix and target accordingly.", viz: "intent" },
      { h: "See how your brand stacks up against the competition", p: "Compare share of prompt demand against named competitors.", viz: "compete" },
      { h: "Built on real conversations, delivered with enterprise-grade trust", p: "Aggregated, privacy-safe panels. SOC 2 compliant infrastructure.", viz: "trust" },
    ],
  },
  {
    slug: "shopping",
    eyebrow: "Shopping",
    title: "Boost your product visibility in ChatGPT Shopping",
    sub: "Get SKU-level granularity across merchants and retailers as AI becomes the new front door to retail.",
    sections: [
      { h: "Turn insights into action", p: "See which SKUs get cited, which merchants underprice you, and what to fix first.", viz: "shopping" },
      { h: "Discover how AI is impacting commerce", p: "Track the AI shelf: rankings, reviews, and availability across the answers that drive purchases.", viz: "shopping" },
    ],
    faq: [
      ["Which shopping surfaces are covered?", "ChatGPT Shopping today, with more answer-engine commerce surfaces on the roadmap."],
      ["Do I need a product feed?", "A feed improves coverage, but Profound can discover products from your site."],
    ],
  },
  {
    slug: "pages",
    eyebrow: "Pages",
    title: "Understand and control your AI presence, page by page",
    sub: "A complete inventory of how AI systems read, cite, and ignore every page you own.",
    sections: [
      { h: "See every page through the eyes of an AI crawler", p: "Readability, citations earned, and decay signals for each URL — plus the fixes that matter.", viz: "citations" },
      { h: "Catch citation decay before it costs you", p: "Pages that used to win answers and stopped are flagged automatically, with rewrite drafts ready.", viz: "alert" },
      { h: "Open up content AI crawlers cannot read", p: "Find the pages blocked, JS-only, or invisible to GPTBot, ClaudeBot, and PerplexityBot.", viz: "traffic" },
    ],
  },
  {
    slug: "context-manager",
    eyebrow: "Context Manager",
    title: "Real-time context to power marketing Agents you trust",
    sub: "When your positioning shifts, so does your AI Marketer.",
    sections: [
      { h: "Connect to where brand knowledge is scattered today", p: "Docs, decks, PDFs, sites, Slack — bring the scattered truth into one place.", viz: "connect" },
      { h: "Constantly synthesize data into Brand Records", p: "Living records for positioning, voice, products, and proof points — always current.", viz: "synthesize" },
      { h: "Collect Personal Records informed by interactions with your AI Marketer", p: "Aim learns each teammate's preferences and standards as you work together.", viz: "personal" },
      { h: "Give your AI Marketer the brain to be a true teammate", p: "Agents cite the record they used, so you can trust — and audit — every output.", viz: "brain" },
      { h: "Proactively find and fill gaps in stored knowledge", p: "Aim asks for the missing context before it guesses.", viz: "gaps" },
    ],
  },
  {
    slug: "documents",
    eyebrow: "Documents",
    title: "Write, edit, and publish content without leaving Profound",
    sub: "A collaborative editor where your Agents work alongside you.",
    sections: [
      { h: "In-document AI", p: "Highlight, prompt, and rewrite inline — with your brand voice applied.", viz: "docs" },
      { h: "Real-time collaboration", p: "Multiplayer editing with comments, suggestions, and version history.", viz: "collab" },
      { h: "Agent workflows", p: "Send any document to an Agent for expansion, translation, or cutdowns.", viz: "handoff" },
      { h: "CMS publishing", p: "Push finished pieces to Contentful, WordPress, Webflow, and more.", viz: "cms" },
    ],
  },
];

export const SOLUTIONS: Record<string, { title: string; sub: string; bullets: [string, string][] }> = {
  "aeo-teams": {
    title: "AEO platforms for AEO teams",
    sub: "Own your category in every answer engine. Track, benchmark, and act on AI visibility as a team.",
    bullets: [["Daily visibility tracking", "Every engine, every region, every day"], ["Competitor benchmarks", "Know your share of answer"], ["Citation analytics", "Fix the sources that matter"]],
  },
  "content-teams": {
    title: "Content operations, amplified",
    sub: "From insight to brief to published page — with Agents doing the heavy lifting.",
    bullets: [["AI briefs", "Grounded in real prompt data"], ["Agent drafts", "Staged for your approval"], ["CMS publishing", "Contentful, WordPress, Webflow"]],
  },
  "pr-teams": {
    title: "PR & brand teams",
    sub: "Catch the wrong story early and correct it at the source.",
    bullets: [["FactCheck", "Verify AI claims continuously"], ["Publisher tracing", "Find who repeats the error"], ["Correction drafts", "Personalized outreach, ready to send"]],
  },
  agencies: {
    title: "For agencies",
    sub: "Deliver AEO as a service across your whole client roster.",
    bullets: [["Client workspaces", "One login, every client"], ["White-label reports", "Weekly AEO progress reports"], ["Agent templates", "Standardized playbooks at scale"]],
  },
  retail: {
    title: "Retail in the AI shopping era",
    sub: "Win the AI shelf as assistants become the new front door to retail.",
    bullets: [["SKU-level visibility", "Across merchants and retailers"], ["Price & listing monitors", "Catch mislists fast"], ["Shopping prompts", "See the demand forming"]],
  },
  "travel-and-hospitality": {
    title: "Travel & hospitality",
    sub: "Be the answer when travelers ask AI where to stay, eat, and go.",
    bullets: [["Destination prompts", "Track 'best hotel in…' demand"], ["Sentiment by market", "Per city, per property"], ["Citation building", "Own the guides AI cites"]],
  },
  pharma: {
    title: "Pharmaceuticals",
    sub: "Accuracy and compliance in every AI answer about your brands.",
    bullets: [["FactCheck at scale", "Verify claims continuously"], ["Audit trails", "Every correction documented"], ["Governed access", "RBAC and SSO built in"]],
  },
};
