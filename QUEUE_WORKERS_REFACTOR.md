# Queue + Workers Refactor — Plan

**Status:** proposed (2026-05-09)
**Trigger:** dual face-swap WORKER_RESOURCE_LIMIT errors persist despite Phase 2 fanout
**Goal:** rock-solid dream generation pipeline ready for launch

## Why now

Phase 2 (DUAL_SWAP_FANOUT) split `face-swap-dual` into its own isolate — necessary but not sufficient. Today's smoke confirmed the dual-swap pipeline still blows Supabase's 150MB/2s per-invocation ceiling on standard 1024×1664 renders (HTTP 546 `WORKER_RESOURCE_LIMIT`). Per CLAUDE.md scaling roadmap, this is the signal to refactor.

The current synchronous architecture has 4 root problems:
1. **Hard per-invocation budget** — pixel work busts Supabase's 2s CPU ceiling (no amount of memory hygiene fixes this)
2. **User waits ~30-60s** with no progress signal
3. **No retry on failure** — flaky Replicate cold starts mean transient failures land as user-visible errors
4. **Concurrent users compete for Supabase worker pool** — bursts during signup will throttle each other

## The architecture

```
Client                      Edge Function (enqueue)         dream_queue (DB)              Worker (cron or realtime trigger)
  │                                  │                            │                              │
  │  POST /generate-first-dream      │                            │                              │
  ├─────────────────────────────────►│                            │                              │
  │                                  │  derive persona            │                              │
  │                                  │  pick medium + vibe        │                              │
  │                                  │  build assembleScene brief │                              │
  │                                  │  INSERT row(status=queued) │                              │
  │                                  ├───────────────────────────►│                              │
  │  { dreamId, status: 'queued' }   │                            │                              │
  │◄─────────────────────────────────┤                            │                              │
  │                                  │                            │  cron tick (every 15s)        │
  │  Realtime: subscribe to dreamId  │                            │◄─────────────────────────────┤
  ├─────────────────────────────────────────────────────────────► │  SELECT...FOR UPDATE          │
  │                                  │                            │  SKIP LOCKED LIMIT 1         │
  │                                  │                            ├─────────────────────────────►│
  │                                  │                            │                              │  Sonnet brief → polished prompt
  │                                  │                            │  UPDATE status=in_progress   │  Flux render
  │                                  │                            │◄─────────────────────────────┤  Face swap (single OR dual)
  │  status='in_progress' (push)     │                            │                              │  Persist + write upload row
  │◄─────────────────────────────────────────────────────────────┤                              │  UPDATE status=completed
  │                                  │                            │◄─────────────────────────────┤
  │  status='completed' + upload_id  │                            │                              │
  │◄─────────────────────────────────────────────────────────────┤                              │
  │  reveal animation                │                            │                              │
```

Worker runs in a separate function. Worker has no time pressure (5-min cron tick → process up to N jobs per tick). Memory is per-job so concurrent jobs don't compound budget pressure. Failed jobs retry with exponential backoff. Worst-case: a job fails 5x, lands in dead-letter, user sees "we couldn't render your dream — tap to retry".

## What this fixes

| Problem today | After refactor |
|---|---|
| WORKER_RESOURCE_LIMIT on dual swap | Worker has no 2s budget; runs at its own pace |
| User sees 30-60s loading screen with no signal | <500ms enqueue → realtime push when done |
| Flaky Replicate cold starts → user-visible errors | Worker retries 3x with backoff before surfacing |
| Concurrent burst → pool exhaustion | Workers serialize at controllable rate |
| First dream + nightly + Create all build separate pipelines | One generic worker handles all sources |

## Phases

### Phase 1 — DB schema + worker shell (2 days)

**Goal:** infrastructure ready, no behavior change yet.

Files:
- `supabase/migrations/156_dream_queue.sql` — `dream_queue` table:
  ```sql
  CREATE TABLE public.dream_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source text NOT NULL CHECK (source IN ('first_dream', 'nightly', 'create', 'dlt')),
    payload jsonb NOT NULL,
    status text NOT NULL DEFAULT 'queued'
      CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'dead_letter')),
    attempt_count integer NOT NULL DEFAULT 0,
    upload_id uuid REFERENCES public.uploads(id),
    worker_id text,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    completed_at timestamptz
  );
  CREATE INDEX idx_dream_queue_status_created ON dream_queue (status, created_at)
    WHERE status IN ('queued', 'in_progress');
  CREATE INDEX idx_dream_queue_user ON dream_queue (user_id);
  ALTER TABLE dream_queue ENABLE ROW LEVEL SECURITY;
  -- Users can read their own queue rows
  CREATE POLICY "users read own queue" ON dream_queue FOR SELECT
    USING (user_id = auth.uid());
  -- Service role bypasses RLS for inserts/updates
  ```

- `supabase/functions/dream-queue-worker/index.ts` — new worker function:
  - Atomically claims one queued row via `SELECT ... FOR UPDATE SKIP LOCKED`
  - Sets `status='in_progress'`, `worker_id=<isolate-id>`, `started_at=now()`
  - Dispatches based on `source` (first_dream / nightly / create / dlt)
  - Retry envelope: catch all errors, increment `attempt_count`, exponential backoff (`1m, 5m, 30m`); after 5 attempts → `status='dead_letter'`
  - On success: insert into `uploads`, set `upload_id`, `status='completed'`, `completed_at=now()`

- `supabase/migrations/157_dream_queue_realtime.sql` — enable Realtime on `dream_queue`:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.dream_queue;
  ```

### Phase 2 — Worker dispatcher for first-dream (3 days)

**Goal:** first-dream goes through queue + worker. Single source path proven before generalizing.

Files:
- `supabase/functions/dream-queue-worker/dispatchers/firstDream.ts` — extracted Sonnet+Flux+swap logic from current `generate-first-dream/index.ts`
- `supabase/functions/generate-first-dream/index.ts` — gut. Becomes: persona+medium+vibe+brief construction → INSERT into dream_queue → return `{dreamId, status: 'queued'}`. ~150 lines vs current ~600.
- `components/onboarding/RevealStep.tsx` — switch from "POST and wait for image_url" to:
  1. POST → get `dreamId`
  2. Subscribe to `dream_queue` realtime channel filtered by `id=dreamId`
  3. Show `LoadingDreamSheet` with status text ("Picking your medium..." → "Painting your scene..." → "Bringing it to life...")
  4. On `status='completed'` → fetch the `upload_id`'s image_url + reveal animation
  5. On `status='failed'` → graceful error + retry button
- `components/onboarding/LoadingDreamSheet.tsx` — new component for the wait UX

- Cron config: `supabase/functions/_cron/dream-queue-tick.json` (or via Supabase dashboard)
  - Trigger every 15 seconds
  - Calls `dream-queue-worker`
  - Worker processes up to 3 jobs per tick

### Phase 3 — Migrate nightly + V4 + DLT (3 days)

**Goal:** all dream generation routes through the queue.

- `supabase/functions/nightly-dreams/index.ts` (existing):
  - Today: synchronous Sonnet+Flux+swap, blocks the orchestrator
  - After: build `dream_queue.payload` per user → bulk INSERT → return immediately
  - Cron (`scripts/nightly-dreams.js`) becomes a thin orchestrator that just enqueues
  - Workers process at their own pace overnight

- `supabase/functions/generate-dream/index.ts` (existing — V4/Create/DLT):
  - Same pattern: enqueue → return `dreamId`
  - Mobile client subscribes to status

- `dream-queue-worker/dispatchers/nightly.ts` + `dispatchers/create.ts` + `dispatchers/dlt.ts`

### Phase 4 — Reliability hardening (2 days)

- Per-source rate limits (`MAX_CONCURRENT_FIRST_DREAMS=10`, `MAX_CONCURRENT_NIGHTLY=20` — worker checks before claiming)
- Replicate 429 backoff in worker: parse `retry-after` header, push job back to queue with delayed `created_at`
- Anthropic 429 backoff: same pattern
- Stale-job detection: if `status='in_progress'` AND `started_at` more than 5 min ago → reset to `status='queued'`, `attempt_count++` (worker isolate died mid-job)
- Dead-letter monitoring: daily Slack/email summary of dead-letter jobs

### Phase 5 — Cutover + observability (1 day)

- Feature flag `EXPO_PUBLIC_DREAM_QUEUE_ENABLED` (default off)
- A/B: enable for 10% of new signups, monitor error rate + p95 latency
- Ramp to 100% over 2-3 days
- Remove old synchronous path
- Dashboard: queue depth + worker throughput + retry rate + dead-letter count

## Total estimate

**~11 days focused work** = roughly 2 weeks calendar time with normal review/iteration cycles.

| Phase | Days | What it delivers |
|---|---|---|
| 1 | 2 | DB ready, worker shell, cron tick infra |
| 2 | 3 | First-dream end-to-end via queue, new RevealStep UX |
| 3 | 3 | Nightly + V4 + DLT migrated |
| 4 | 2 | Retry/backoff/stale-job/rate-limit hardening |
| 5 | 1 | Cutover + observability |

Phase 1+2 alone (5 days) gets first-dream rock-solid for launch — nightlies + Create can stay on the synchronous path during early launch since their concurrent load is lower.

## Decision points

1. **Worker runtime:** Supabase Edge Function (cron-triggered) vs Vercel Function vs Fly.io worker?
   - **Recommended:** Supabase Edge Function (cron). Same auth + same env. Worker isolate gets 150MB/2s like any other — but the dual-swap pipeline can be reduced (see #2 below) to fit, OR we offload just the pixel step to Vercel (longer per-invocation budget).
   - Alternative: Fly.io / Modal worker for unlimited budget but new infra to manage.

2. **Pixel work:** keep current dualFaceSwap pipeline or change?
   - **Option A:** Reduce target image to 768×1248 before crop/swap/stitch → ~50% less work, fits Supabase budget
   - **Option B:** Move just the `dualFaceSwap()` body to a Vercel Function (Node runtime, 3GB / 60s on Pro) — worker calls it via HTTP
   - **Option C:** Find / commission a Replicate model that does dual face swap natively (one call, no crop/stitch)
   - **Recommended:** A first (cheap experiment, ~1 hour to test), B as fallback if A is too lossy

3. **Realtime vs polling on the client?**
   - **Recommended:** Realtime. Supabase Realtime is already set up + the spec assumes it. Polling is fallback if Realtime ever flakes.

4. **What payload shape?**
   - The `payload` jsonb stores everything the worker needs to render: persona, medium_key, vibe_key, sonnet_brief (already constructed by the enqueuer), composition_mode, cast (URLs only, no description — worker re-describes if needed), userPlace, userThing, etc.
   - Why pre-construct the brief at enqueue time vs at worker time: brief construction is cheap (~50ms, no API calls except locationCard), keeps the worker focused on the heavy stuff.

## What I'd build first (next session if you greenlight)

1. **Phase 1 in full** (DB + worker shell with stub dispatcher, no real generation yet) — 1 day. Get the pipes working.
2. **Vertical slice of Phase 2** — first-dream end-to-end through the queue, with the simplest possible RevealStep loading screen. 2 days.
3. **Real face-swap in the worker** — at this point we test whether the same dualFaceSwap that fails in synchronous mode passes when called from a worker. If yes, Phase 1+2 are sufficient for launch. If no (the resource-limit is per-invocation regardless of context), we add the Phase 4 lower-resolution-input fix.

That's a 3-day vertical slice that proves the architecture before committing to the full 11 days.

## Out of scope for this refactor

- Replacing Replicate (too much risk, current quality bar locked)
- Replacing Sonnet (same)
- Storage migration (Supabase Storage stays)
- New dream features (this is purely reliability work)
