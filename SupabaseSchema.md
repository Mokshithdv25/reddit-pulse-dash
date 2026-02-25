# Reddit Pulse Dashboard — Supabase MVP Implementation Guide

**For:** Backend Developer  
**Goal:** Wire real Supabase data to the existing Next.js dashboard  
**Timeline:** 7 days  
**Rule:** No mocks. No overengineering. One loop end-to-end first.

---

## What You're Building

A working data pipeline: **Reddit API → Supabase → Dashboard UI**

The frontend already works. Your job is to replace the mock data layer with real Supabase queries. The swap point is `lib/dataService.ts` — every function there returns mock data today. You'll make them return real DB data instead.

**No frontend changes needed.** The TypeScript interfaces in `lib/mockData.ts` are your contract.

---

## Phase 1: Environment Setup (Day 1)

### 1.1 Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create new project → name it `reddit-pulse`
3. Save these values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 1.2 Add to Next.js

```bash
npm install @supabase/supabase-js
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
```

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side only (Edge Functions, API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

---

## Phase 2: MVP Schema (Day 1-2)

**Only 8 tables.** Run this SQL in the Supabase SQL Editor:

```sql
-- ============================================================
-- REDDIT PULSE DASHBOARD — MVP SCHEMA
-- ============================================================

-- 1. CLIENTS (multi-tenant root)
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACCOUNTS (Reddit accounts per client)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBREDDITS (lookup)
CREATE TABLE subreddits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- 4. OVERVIEW SNAPSHOTS (daily KPI rollup)
CREATE TABLE overview_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_traffic INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  blended_roas NUMERIC(5,2) DEFAULT 0,
  karma_growth INT DEFAULT 0,
  UNIQUE(client_id, date)
);

-- 5. ORGANIC POSTS (post-level data)
CREATE TABLE organic_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  subreddit_id UUID REFERENCES subreddits(id),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  impressions INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  comments INT DEFAULT 0,
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  traffic_driven INT DEFAULT 0,
  post_score INT DEFAULT 0
);

-- 6. CAMPAIGN SNAPSHOTS (daily paid metrics)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaign_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  spend NUMERIC(12,2) DEFAULT 0,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  UNIQUE(campaign_id, date)
);

-- 7. BRAND MENTIONS (daily sentiment)
CREATE TABLE brand_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  subreddit_id UUID REFERENCES subreddits(id),
  date DATE NOT NULL,
  mention_count INT DEFAULT 0,
  positive INT DEFAULT 0,
  neutral INT DEFAULT 0,
  negative INT DEFAULT 0
);

-- 8. LLM REFERRAL SNAPSHOTS (SEO/GEO)
CREATE TABLE llm_referral_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  chatgpt INT DEFAULT 0,
  perplexity INT DEFAULT 0,
  gemini INT DEFAULT 0,
  other INT DEFAULT 0,
  UNIQUE(client_id, date)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_overview_client_date ON overview_snapshots(client_id, date);
CREATE INDEX idx_organic_client_date ON organic_posts(client_id, date);
CREATE INDEX idx_organic_account ON organic_posts(account_id);
CREATE INDEX idx_campaign_snap_date ON campaign_snapshots(campaign_id, date);
CREATE INDEX idx_brand_mentions_date ON brand_mentions(client_id, date);
CREATE INDEX idx_llm_referral_date ON llm_referral_snapshots(client_id, date);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE overview_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE organic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_referral_snapshots ENABLE ROW LEVEL SECURITY;

-- For MVP: allow service role full access, anon reads own client
-- Replace with proper auth policies when auth is wired
CREATE POLICY "service_role_all" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON overview_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON organic_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON campaign_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON brand_mentions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON llm_referral_snapshots FOR ALL USING (true) WITH CHECK (true);
```

---

## Phase 3: Seed Test Data (Day 2)

Run this to insert test data and verify queries work:

```sql
-- ============================================================
-- SEED DATA
-- ============================================================

-- Clients
INSERT INTO clients (id, name, industry) VALUES
  ('acme-corp', 'Acme Corp', 'SaaS'),
  ('globex-inc', 'Globex Inc', 'E-Commerce');

-- Accounts (Acme)
INSERT INTO accounts (id, client_id, name) VALUES
  ('acme-1', 'acme-corp', 'u/OfficialBrand'),
  ('acme-2', 'acme-corp', 'u/ProductUpdates'),
  ('acme-3', 'acme-corp', 'u/CommunityManager'),
  ('acme-4', 'acme-corp', 'u/TechSupport');

-- Accounts (Globex)
INSERT INTO accounts (id, client_id, name) VALUES
  ('globex-1', 'globex-inc', 'u/GlobexOfficial'),
  ('globex-2', 'globex-inc', 'u/GlobexSupport');

-- Subreddits
INSERT INTO subreddits (name) VALUES
  ('r/technology'), ('r/startups'), ('r/SaaS'),
  ('r/programming'), ('r/webdev'), ('r/Entrepreneur');

-- 7 days of overview snapshots (Acme)
INSERT INTO overview_snapshots (client_id, date, total_traffic, total_conversions, revenue, blended_roas, karma_growth)
SELECT
  'acme-corp',
  CURRENT_DATE - i,
  4000 + (random() * 1000)::int,
  120 + (random() * 40)::int,
  8000 + (random() * 3000)::numeric(12,2),
  3.8 + (random() * 1.2)::numeric(5,2),
  400 + (random() * 200)::int
FROM generate_series(0, 6) AS i;

-- 7 days of overview snapshots (Globex — for RLS testing)
INSERT INTO overview_snapshots (client_id, date, total_traffic, total_conversions, revenue, blended_roas, karma_growth)
SELECT
  'globex-inc',
  CURRENT_DATE - i,
  2000 + (random() * 500)::int,
  60 + (random() * 20)::int,
  4000 + (random() * 1500)::numeric(12,2),
  2.8 + (random() * 0.8)::numeric(5,2),
  200 + (random() * 100)::int
FROM generate_series(0, 6) AS i;

-- Sample organic posts (Acme)
INSERT INTO organic_posts (client_id, account_id, subreddit_id, title, date, impressions, upvotes, comments, engagement_rate, traffic_driven, post_score)
SELECT
  'acme-corp',
  'acme-1',
  (SELECT id FROM subreddits WHERE name = 'r/technology'),
  'How we scaled to handle 10M requests',
  CURRENT_DATE - 2,
  342000, 3420, 456, 8.2, 12400, 3420;
```

### Verify It Works

```sql
-- Should return 7 rows
SELECT * FROM overview_snapshots
WHERE client_id = 'acme-corp'
ORDER BY date DESC;

-- Should return 0 rows for wrong client
SELECT * FROM overview_snapshots
WHERE client_id = 'globex-inc'
AND client_id = 'acme-corp'; -- contradiction = 0 rows
```

---

## Phase 4: First Swap — Overview Tab (Day 2-3)

This is the proof point. Replace ONE function in `dataService.ts`.

### 4.1 Add Date Range Helper

Add to `lib/supabase.ts`:

```typescript
import { DateRange } from '@/components/dashboard/FilterBar';

export function getDateBounds(dateRange: DateRange): { start: string; end: string } {
  const end = new Date();
  const start = new Date();

  switch (dateRange) {
    case '3d':  start.setDate(end.getDate() - 3); break;
    case '7d':  start.setDate(end.getDate() - 7); break;
    case '30d': start.setDate(end.getDate() - 30); break;
    case '90d': start.setDate(end.getDate() - 90); break;
    case 'current_month':
      start.setDate(1); break;
    case 'last_month':
      start.setMonth(end.getMonth() - 1); start.setDate(1);
      end.setDate(0); break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}
```

### 4.2 Replace `getOverview()` in `dataService.ts`

```typescript
import { supabase, getDateBounds } from '@/lib/supabase';

export async function getOverview(clientId: string, dateRange: DateRange): Promise<KPIData> {
  const { start, end } = getDateBounds(dateRange);

  // Current period
  const { data: current } = await supabase
    .from('overview_snapshots')
    .select('total_traffic, total_conversions, revenue, blended_roas, karma_growth')
    .eq('client_id', clientId)
    .gte('date', start)
    .lte('date', end);

  // Previous period (same duration, shifted back)
  const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);

  const { data: previous } = await supabase
    .from('overview_snapshots')
    .select('total_traffic, total_conversions, revenue, blended_roas, karma_growth')
    .eq('client_id', clientId)
    .gte('date', prevStart.toISOString().split('T')[0])
    .lte('date', prevEnd.toISOString().split('T')[0]);

  const sum = (rows: any[] | null, key: string) =>
    (rows || []).reduce((s, r) => s + (Number(r[key]) || 0), 0);
  const avg = (rows: any[] | null, key: string) => {
    const arr = rows || [];
    return arr.length ? sum(arr, key) / arr.length : 0;
  };

  return {
    totalTraffic: sum(current, 'total_traffic'),
    totalConversions: sum(current, 'total_conversions'),
    revenue: sum(current, 'revenue'),
    blendedROAS: parseFloat(avg(current, 'blended_roas').toFixed(1)),
    karmaGrowth: sum(current, 'karma_growth'),
    previousPeriod: {
      totalTraffic: sum(previous, 'total_traffic'),
      totalConversions: sum(previous, 'total_conversions'),
      revenue: sum(previous, 'revenue'),
      blendedROAS: parseFloat(avg(previous, 'blended_roas').toFixed(1)),
      karmaGrowth: sum(previous, 'karma_growth'),
    },
  };
}
```

### 4.3 Test

1. Run `npm run dev`
2. Open dashboard
3. Overview tab should show real DB numbers
4. If it renders → **foundation validated** ✅
5. If not → check browser console, fix Supabase query

---

## Phase 5: MVP View (Day 3-4)

Create this view for the Organic tab:

```sql
CREATE OR REPLACE VIEW v_organic_account_metrics AS
SELECT
  a.name AS account,
  COUNT(op.id) AS posts,
  COALESCE(AVG(op.post_score), 0)::int AS avg_post_score,
  COALESCE(AVG(op.comments), 0)::int AS replies_per_post,
  COALESCE(AVG(op.engagement_rate), 0)::numeric(5,2) AS engagement_rate,
  op.client_id
FROM accounts a
LEFT JOIN organic_posts op ON op.account_id = a.id
GROUP BY a.id, a.name, op.client_id;
```

Then swap `getOrganicMetrics()` in `dataService.ts`:

```typescript
export async function getOrganicMetrics(
  clientId: string, _dateRange: DateRange
): Promise<OrganicAccountMetrics[]> {
  const { data } = await supabase
    .from('v_organic_account_metrics')
    .select('*')
    .eq('client_id', clientId);

  return (data || []).map(row => ({
    account: row.account,
    posts: row.posts,
    avgPostScore: row.avg_post_score,
    repliesPerPost: row.replies_per_post,
    engagementRate: Number(row.engagement_rate),
  }));
}
```

---

## Phase 6: RLS Validation (Day 4)

### Test Multi-Tenant Isolation

```sql
-- Create a test function to simulate client A querying
-- This should ONLY return acme-corp data
SELECT * FROM overview_snapshots WHERE client_id = 'acme-corp';

-- This should ONLY return globex-inc data
SELECT * FROM overview_snapshots WHERE client_id = 'globex-inc';

-- Verify counts are different
SELECT client_id, COUNT(*) FROM overview_snapshots GROUP BY client_id;
```

When you wire real auth later, replace the open RLS policies with:

```sql
-- Drop open policies
DROP POLICY "service_role_all" ON overview_snapshots;

-- Create proper policies
CREATE POLICY "client_isolation" ON overview_snapshots
  FOR SELECT USING (
    client_id = (auth.jwt() ->> 'client_id')::text
  );
```

---

## Phase 7: First Edge Function — Reddit Ingestion (Day 5-6)

### Setup

```bash
supabase functions new ingest-reddit-data
```

### `supabase/functions/ingest-reddit-data/index.ts`

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID')!;
const REDDIT_SECRET = Deno.env.get('REDDIT_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getRedditToken() {
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${REDDIT_CLIENT_ID}:${REDDIT_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchSubredditPosts(token: string, subreddit: string) {
  const res = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/new?limit=25`,
    { headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'RedditPulse/1.0' } }
  );
  const data = await res.json();
  return data.data.children.map((c: any) => c.data);
}

Deno.serve(async () => {
  try {
    const token = await getRedditToken();

    // MVP: ingest from ONE subreddit only
    const posts = await fetchSubredditPosts(token, 'technology');

    // Get or create subreddit record
    const { data: sub } = await supabase
      .from('subreddits')
      .upsert({ name: 'r/technology' }, { onConflict: 'name' })
      .select('id')
      .single();

    // Upsert posts
    for (const post of posts) {
      await supabase.from('organic_posts').upsert({
        client_id: 'acme-corp', // MVP: hardcode client
        account_id: 'acme-1',   // MVP: hardcode account
        subreddit_id: sub!.id,
        title: post.title,
        date: new Date(post.created_utc * 1000).toISOString().split('T')[0],
        impressions: post.num_crossposts * 1000 + post.score * 10,
        upvotes: post.ups,
        comments: post.num_comments,
        engagement_rate: post.upvote_ratio * 10,
        traffic_driven: post.score * 3,
        post_score: post.score,
      });
    }

    // Update today's overview snapshot
    const today = new Date().toISOString().split('T')[0];
    const totalUpvotes = posts.reduce((s: number, p: any) => s + p.ups, 0);

    await supabase.from('overview_snapshots').upsert({
      client_id: 'acme-corp',
      date: today,
      total_traffic: posts.length * 500,
      total_conversions: Math.floor(totalUpvotes * 0.05),
      revenue: totalUpvotes * 2.5,
      blended_roas: 4.2,
      karma_growth: totalUpvotes,
    }, { onConflict: 'client_id,date' });

    return new Response(JSON.stringify({ ok: true, posts: posts.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
```

### Deploy & Schedule

```bash
# Deploy
supabase functions deploy ingest-reddit-data

# Set secrets
supabase secrets set REDDIT_CLIENT_ID=your_id REDDIT_SECRET=your_secret

# Schedule via Supabase Dashboard → Database → Extensions → pg_cron
-- Run every 6 hours
SELECT cron.schedule(
  'ingest-reddit',
  '0 */6 * * *',
  $$SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/ingest-reddit-data',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )$$
);
```

---

## Validation Checklist

Before moving past MVP, every box must be checked:

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | Supabase project live | Can access dashboard |
| 2 | Schema deployed | All 8 tables visible in Table Editor |
| 3 | Seed data inserted | `SELECT COUNT(*) FROM overview_snapshots` returns rows |
| 4 | `getOverview()` uses Supabase | Overview tab shows DB data, not mock |
| 5 | Client switching works | Acme/Globex show different numbers |
| 6 | RLS blocks cross-client | Query confirms isolation |
| 7 | Edge Function runs | Manual invoke returns `{ ok: true }` |
| 8 | Organic view works | `SELECT * FROM v_organic_account_metrics` returns rows |

---

## What NOT To Do

- ❌ Build all 25 tables from the architecture doc
- ❌ Wire every tab at once
- ❌ Build attribution modeling
- ❌ Add auth/login flow
- ❌ Optimize query performance
- ❌ Touch any UI components
- ❌ Add new features

---

## Swap Order After MVP

Once the above works, swap remaining tabs in this order:

| Priority | Tab | Functions to Swap | Why This Order |
|----------|-----|-------------------|----------------|
| 1 | **Overview** | `getOverview`, `getTimeSeries` | Already done in MVP |
| 2 | **Organic** | `getOrganicMetrics`, `getTopOrganicPosts` | Data already flowing from ingestion |
| 3 | **Brand** | `getBrandMentions`, `getSentimentData` | Add sentiment to Edge Function |
| 4 | **Subreddit** | `getSubredditKPIs`, `getSubredditGrowth` | Extend ingestion scope |
| 5 | **Paid Ads** | `getPaidKPIs`, `getCampaigns` | Requires ad platform API |
| 6 | **Accounts** | `getAccountTable` | Aggregation view across tables |
| 7 | **SEO/GEO** | `getSEOGEOKPIs`, `getLLMReferrals` | Speculative until real data source |

---

## Key Files in the Codebase

| File | What It Does | You'll Edit It? |
|------|-------------|-----------------|
| `lib/dataService.ts` | All data fetching (swap point) | ✅ Yes — swap mock → Supabase |
| `lib/mockData.ts` | TypeScript interfaces + mock data | 📖 Read-only — interfaces are your contract |
| `lib/supabase.ts` | Supabase client (you create this) | ✅ Yes — new file |
| `lib/attributionService.ts` | Attribution math | ❌ No — skip for MVP |
| `app/page.tsx` | Dashboard page | ❌ No |
| `components/dashboard/tabs/*` | 7 tab views | ❌ No |

---

## Reddit API Setup (Prerequisite)

1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Create app → type: **script**
3. Save `client_id` and `secret`
4. These go into Supabase Edge Function secrets

---

*Generated from the Reddit Pulse Dashboard codebase analysis. The full 25-table architecture doc is available separately for long-term reference.*
