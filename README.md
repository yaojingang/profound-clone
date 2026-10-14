# Profound Clone

> **仅供学习交流使用** · An educational local replica of [Profound](https://www.tryprofound.com/) (tryprofound.com).
> 非官方项目，与 Profound Inc. 无任何关联。/ Not affiliated with Profound Inc. All product names and trademarks belong to their respective owners.

对 AI Search 可视化平台 **Profound** 的前后台 1:1 学习性复刻：营销官网、产品工作台、平台管理后台三大界面，SQLite 数据层，以及一个可交互的 Agent 模拟引擎。页面与数据基于对公开营销站点的逆向抓取整理（未访问任何需登录的私有页面）。

![stack](https://img.shields.io/badge/Next.js-16.4-black) ![react](https://img.shields.io/badge/React-19-blue) ![db](https://img.shields.io/badge/SQLite-WAL-green) ![ts](https://img.shields.io/badge/TypeScript-5-blue)

## 界面一览

| 层 | 路由 | 主题 | 内容 |
|---|---|---|---|
| 营销官网 | `/` | 黑色 | 首页、Pricing、Customers、Blog、Careers、Enterprise、AEO Guide、Agent Templates、Integrations、9 个 Features 子页、7 个 Solutions 子页 |
| 产品工作台 | `/app` | 浅色 | Answer Engine Insights、Visibility / Citations / Sentiment / FactCheck、Prompt Volumes、Agents & Runs、Aim 对话助手、Pages、Shopping、Dashboards |
| 管理后台 | `/admin` | 深色 | 平台总览、用户、工作区（credits 用量）、Agent 舰队与全平台 Runs、销售线索 |

## 核心功能

- **7 个 AI 引擎可视化**：ChatGPT、Perplexity、Claude、Gemini、Microsoft Copilot、AI Overviews、DeepSeek —— 每日可见度趋势、引用分类（earned / owned / social / competition）、品牌情绪、FactCheck 勘误
- **Aim（AI Marketer）对话助手**：用自然语言提问可见度 / 引用 / 情绪 / 提示词缺口，或直接触发 Agent —— 会真实写入运行记录与步骤 trace、扣减 trial credits
- **Agent 系统**：7 个可复用工作流（内容写作、页面优化、引用追踪、FactCheck、社交、购物、发布套件），带运行历史与逐工具耗时
- **认证与权限**：scrypt 密码哈希、httpOnly session cookie、middleware 预检、owner / admin 双角色
- **示例数据**：虚构品牌 Wrenfield（城市电动自行车）工作区 —— 40 条提示词、90 天可见度数据、引用域名、Agent 模板库、销售线索

## 快速开始

```bash
npm install
npm run seed        # 生成示例数据库（data/profound.db）
npm run build && npm start
# 打开 http://localhost:3000
```

开发模式：`npm run dev`（首次需先 seed）。

### 演示账号

| 角色 | 邮箱 | 密码 |
|---|---|---|
| 工作区 Owner | `demo@profound.local` | `demo1234` |
| 平台管理员 | `admin@profound.local` | `admin1234` |

登录页可勾选 "Log in as platform admin" 直接切换。

## 技术栈

- **Next.js 16.4** — App Router、async params、`cacheComponents`（PPR 部分预渲染）、Turbopack
- **React 19** + server components（数据全部在服务端查询，图表 props 用可序列化枚举）
- **Tailwind CSS v4** — 单应用三套主题
- **better-sqlite3**（WAL 模式）— 单文件数据库，`scripts/seed.mjs` 一键重建

## 项目结构

```
app/
  (site)/          # 营销官网（首页、features、solutions、customers…）
  app/             # 产品工作台（insights、prompts、agents、aim…）
  admin/           # 平台管理后台
  api/             # auth / aim / leads 接口
  login/ signup/   # 认证页
components/        # 图表、双 shell（app/admin）、营销组件、FeatureViz
lib/               # db、auth、session、app-queries、features
scripts/seed.mjs   # 示例数据生成
middleware.ts      # /app /admin cookie 预检
```

## 开发笔记：Next.js 16 `cacheComponents` 的四个坑

1. **渲染期禁用 `new Date()`** —— 会打断 prerender 探测。会话过期判断下推到 SQL：`expires_at > datetime('now')`。
2. **`export const dynamic` 不可用** —— 需要阻塞式动态路由时用 `export const instant = false`。
3. **Server 组件不能传函数 props 给 Client 组件** —— 图表坐标轴格式化用字符串枚举（`yFmt="pct" | "k"`）替代格式化函数。
4. **SQLite 时间戳必须统一格式** —— JS `toISOString()`（`T` 分隔）与 `datetime('now')`（空格分隔）混存时，`ORDER BY` 字典序会错排。统一用 `.toISOString().slice(0, 19).replace("T", " ")`。

## 免责声明 / Disclaimer

本项目**仅供个人学习与研究**，用于了解现代 SaaS 产品的信息架构、Next.js App Router 与数据可视化实践：

- 与 Profound Inc. **无任何隶属、合作或授权关系**；未使用其任何私有代码、私有数据或付费内容；
- 所有品牌名称与商标归各自所有者所有；示例数据均为虚构；
- 请勿将本项目用于商业用途，请勿部署为公开对外服务；
- 如有侵权请联系删除。
