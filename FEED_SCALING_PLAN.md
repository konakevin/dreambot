# Feed Scaling Plan — precomputed candidate pools (Part 2)

**Status: DESIGNED, NOT BUILT.** Build only when a trigger below fires.
Companion to the 2026-07-21 feed-algorithm audit (migrations 388-391; current
design state in the `project_feed_algorithm_v4_state` memory). Part 1
(candidate windowing, migration 391) is live and expected to hold ~150-350ms
per call at current scale.

## Why this exists

`get_feed` is the app's hottest query: every Home page/refresh/launch, the
Explore grid, and a ~19-call burst warming the bots feeds. Pre-391 it scored
the ENTIRE 365-day catalog per request (~1s/call) and drove the recurring
PostgREST pool-saturation episodes. Migration 391 bounds the scored set
(~10x cut), which buys headroom — but per-request cost still grows with the
catalog. The endgame every feed system reaches: split the globally-expensive
work from the per-user work.

## Triggers — build this when ANY of these fires

- forYou p95 latency > ~400ms sustained (measure: timed `get_feed` RPC loop,
  or pg_stat_statements once available) DESPITE 391
- `uploads` catalog passes ~100k rows
- PostgREST pool-saturation ("Unhealthy") episodes recur post-391
- A step change in DAU (10x current)

Do NOT build it while the scoring constants (penalty grades / 72h youth
waiver / 21d recovery / 0.15 jitter / 60d window) are still being actively
tuned — pooling cements the scoring pipeline's shape.

## Architecture

**1. Pool table** — `feed_candidates`, refreshed by pg_cron every ~10-15 min:

```
feed_candidates (
  upload_id   uuid PRIMARY KEY REFERENCES uploads ON DELETE CASCADE,
  band        text NOT NULL,           -- 'fresh' | 'popular' | 'catalog'
  base_score  double precision NOT NULL, -- ALL user-independent score terms
  refreshed_at timestamptz NOT NULL
)
```

Bands (sized to total ~1-2k rows):
- **fresh**: everything < 60 days (or capped top-N by recency)
- **popular**: top-N by weighted engagement over the full catalog
- **catalog**: a rotating random sample of the older catalog (callback supply;
  re-sampled every refresh run so callbacks vary)

The refresh function computes every USER-INDEPENDENT term once per post:
weighted engagement, velocity, engagement rate, absolute popularity, recency
decay, freshness boost, plus the repost aggregation join. Store as
`base_score` (or as separate columns if the per-user blend needs the pieces —
decide at build time; separate columns is more flexible for tuning).

**2. `get_feed` rewrite** — request time does ONLY per-user work, over the
pool instead of `uploads`:
- join `feed_candidates` → uploads (visibility/moderation re-checked live)
- per-user terms: is_following bonus, followed-repost boost, the impression
  penalty (388/390 semantics unchanged), block/report filtering, seed jitter
- sort, cursor-paginate exactly as today (same return shape — NO client change)

**3. Staleness guard** — if `max(refreshed_at)` is older than ~30 min
(pg_cron died), fall back to the direct (391-style) query path inside the
same function so the feed never serves stale-pool-only or fails. Log loudly.

**4. Bots tab** — drop out of the scoring path entirely: it is chronological;
serve straight from the partial index (`posted_at DESC WHERE is_public`)
filtered to bot authors. Cheapest possible.

**5. Monitoring** — add pool age + pool row-count to the existing db-health /
dream-queue-monitor check so a dead refresh job fails loud within the hour.

## Build items (one focused session)

1. Migration: pool table + refresh function + pg_cron schedule (follow the
   existing pg_cron patterns, e.g. the queue worker / log-retention jobs).
2. Migration: `get_feed` rewrite reading the pool (same signature/return
   shape; keep the 391 direct path as the staleness fallback).
3. `feedSeenPenalty.dbspec.ts`: point at the new migration; the penalty locks
   must pass UNCHANGED (they define the per-user semantics). Add: pool-stale
   fallback test + bots-chronological test.
4. Behavioral verify: the timed-RPC loop (see the 2026-07-21 session scripts)
   before/after; expect O(pool) ≈ flat regardless of catalog size.
5. Monitor wiring + a `FEED_SCALING_PLAN.md` status flip to BUILT.

## Invariants that must survive the rewrite

- Impression discounting semantics exactly as dbspec-locked (388/389/390).
- Followed-author content is ALWAYS eligible (never pooled out) — friends'
  history matters more than pool size symmetry; if needed, union followed
  authors' recent posts at request time on top of the pool.
- Same RPC signature + return shape (fielded clients must not care).
- Per-user terms stay at request time — never bake a user into the pool.
