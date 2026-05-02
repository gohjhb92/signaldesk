# SignalDesk

SignalDesk is a personal market-intelligence dashboard for traders. It tracks trusted analysts,
researchers, investors, podcasts, blogs, newsletters, YouTube feeds, reports, and alerts, then turns
the stream into a focused research workflow.

The app ships with a public demo mode, so it works immediately without Supabase, OpenAI, or Telegram
credentials. The demo dataset includes 18 analysts, 23 sources, 6 trade theses, and 30 sample market
updates across crypto, equities, ETFs, macro, commodities, and policy.

## Why It Is Useful

Traders rarely need more feeds. They need a cleaner way to answer:

- What changed today?
- Which assets are getting repeated attention?
- Are trusted analysts leaning bullish or bearish?
- What are people saying about BTC liquidity, ETF flows, rates, oil, gold, or QQQ?
- Which new items still need summarization?
- Which original sources should I open before making a decision?
- Which updates support or weaken my existing trades?

SignalDesk is designed around that workflow: collect, summarize, tag, search, filter, alert, and
review.

The current demo is now organized around active trade theses such as crypto/Hyperliquid, psychedelic
therapeutics, nuclear energy, gold, food commodities, and LNG infrastructure.

## Features

- Trader-oriented dashboard with high-priority signals, latest updates, trending themes, asset
  mentions, sentiment split, and unsummarized queue.
- Trade thesis cockpit for status, horizon, conviction, bull case, bear case, catalysts,
  invalidation signals, assets, themes, notes, and matched evidence.
- Semantic search across summarized content using OpenAI embeddings and pgvector.
- Filters for asset, theme, analyst, source type, sentiment, priority, and date range.
- Analysts and sources management screens.
- `/theses` workspace for managing the user's real trades before expanding the source universe.
- Manual RSS ingestion endpoint for RSS-like source types.
- Manual OpenAI summarization endpoint with JSON validation.
- Telegram alert runner for high-importance items, watched assets, keywords, and high-priority
  analysts.
- Public demo mode with clearly marked sample data.
- Supabase/PostgreSQL schema, RLS policies, migrations, and seed data.
- Responsive UI built for portfolio demos.
- Basic utility tests for dashboard filtering and counting logic.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase/PostgreSQL
- pgvector
- OpenAI Responses API
- OpenAI `text-embedding-3-small`
- `rss-parser`
- Telegram Bot API
- Node test runner for lightweight utility tests

## Architecture

```txt
SignalDesk
|-- App Router pages
|   |-- /dashboard          trader workflow dashboard
|   |-- /theses             active trade thesis cockpit
|   |-- /analysts           tracked analyst management
|   |-- /sources            source management + ingestion trigger
|   |-- /search             semantic + keyword search
|   |-- /alerts             Telegram alert rule management
|   `-- /items/[id]         content item detail view
|
|-- API routes
|   |-- POST /api/ingest/rss
|   |   |-- fetch active RSS-like sources
|   |   |-- parse feed entries
|   |   |-- dedupe by URL
|   |   `-- insert content_items
|   |
|   |-- POST /api/summarize
|   |   |-- find unsummarized content_items
|   |   |-- call OpenAI server-side
|   |   |-- validate JSON response
|   |   `-- update summaries, tags, assets, sentiment, score
|   |
|   |-- POST /api/alerts/run
|   |   |-- find unalerted content_items
|   |   |-- evaluate importance, analyst priority, keywords, assets
|   |   |-- send Telegram messages
|   |   `-- write alert_history for dedupe
|   |
|   |-- POST /api/embeddings/generate
|   |   |-- find content_items missing embeddings
|   |   |-- call OpenAI text-embedding-3-small
|   |   `-- store pgvector embeddings
|   |
|   `-- POST /api/search
|       |-- embed the user query
|       |-- call pgvector + full-text search RPC
|       `-- return ranked source-linked results
|
|-- Data layer
|   |-- public demo repository fallback
|   |-- Supabase client helpers
|   `-- typed domain/database models
|
`-- Supabase
    |-- analysts
    |-- sources
    |-- trade_theses
    |-- content_items
    |-- content_tags
    |-- alert_rules
    `-- alert_history
```

## Screenshots

Screenshot placeholders live in:

```txt
docs/screenshots/
```

Suggested capture set before publishing:

- `dashboard.png`
- `filters.png`
- `search.png`
- `sources.png`
- `alerts.png`
- `item-detail.png`

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/dashboard
```

Run checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Environment Variables

Copy `.env.example` to `.env.local` when connecting real services:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=optional-service-role-key-for-server-jobs
OPENAI_API_KEY=sk-your-openai-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

Without Supabase credentials, SignalDesk runs in public demo mode using bundled mock data. OpenAI
and Telegram credentials are only read in server-side code and are never exposed to the browser.

## Database

Migrations:

```txt
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_alert_history.sql
supabase/migrations/003_pgvector_search.sql
supabase/migrations/004_trade_theses.sql
```

Seed data:

```txt
supabase/seed.sql
```

The seed file includes:

- 18 analysts
- 23 sources
- 30 sample content items
- starter alert rules

Tables:

- `analysts`
- `sources`
- `trade_theses`
- `content_items`
- `content_tags`
- `alert_rules`
- `alert_history`

The pgvector migration adds `content_items.embedding` and creates a hybrid keyword/vector search
function. Row Level Security is enabled on all tables. The MVP policies are suitable for a private
single-user app where only the owner can authenticate.

## Roadmap

- Replace demo repository reads with Supabase-backed reads and writes throughout the UI.
- Add scheduled ingestion with Supabase Cron or Vercel Cron.
- Add daily digest generation from summarized items.
- Add email alerts alongside Telegram alerts.
- Add source health monitoring and failed-feed diagnostics.
- Add authentication gate for private deployment.
- Add screenshots and a short demo video for the GitHub portfolio page.

## Notes

SignalDesk is not financial advice. It is a research workflow tool for organizing public market
commentary and personal trading context.
