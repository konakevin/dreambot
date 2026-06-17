# Queue + Workers Refactor — Plan

**Status:** SHIPPED 2026-06-13 — **create / dlt / restyle now route through the queue** behind `EXPO_PUBLIC_DREAM_QUEUE_ENABLED` (off until ramped). Nightly migrated 2026-05-26. See the "## SHIPPED — user dreams on the queue (2026-06-13)" section at the bottom for the final architecture, the load-test results, and the tuning knobs — that section supersedes Phases 2-5 below (kept for history). (Originally proposed 2026-05-09.)
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

| Problem today                                               | After refactor                                  |
| ----------------------------------------------------------- | ----------------------------------------------- |
| WORKER_RESOURCE_LIMIT on dual swap                          | Worker has no 2s budget; runs at its own pace   |
| User sees 30-60s loading screen with no signal              | <500ms enqueue → realtime push when done        |
| Flaky Replicate cold starts → user-visible errors           | Worker retries 3x with backoff before surfacing |
| Concurrent burst → pool exhaustion                          | Workers serialize at controllable rate          |
| First dream + nightly + Create all build separate pipelines | One generic worker handles all sources          |

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

| Phase | Days | What it delivers                                    |
| ----- | ---- | --------------------------------------------------- |
| 1     | 2    | DB ready, worker shell, cron tick infra             |
| 2     | 3    | First-dream end-to-end via queue, new RevealStep UX |
| 3     | 3    | Nightly + V4 + DLT migrated                         |
| 4     | 2    | Retry/backoff/stale-job/rate-limit hardening        |
| 5     | 1    | Cutover + observability                             |

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

---

## SHIPPED — user dreams on the queue (2026-06-13)

This supersedes Phases 2–5 above. Create / DLT / restyle now route through `dream_queue` exactly like nightly, behind `EXPO_PUBLIC_DREAM_QUEUE_ENABLED` (off until ramped). The synchronous `generate-dream` invoke path stays live when the flag is off; rollback = flip the flag.

### Architecture

```
client → enqueue-dream  (JWT auth → charge[idempotent on job_id] → classify weight
                         → INSERT dream_queue + seed dream_jobs → kick worker)  →  {dream_id} in <500ms
client → subscribe dream_queue realtime(id=dream_id)            [dream_jobs poll = fallback]
dream-queue-worker (pg_cron 1min + per-enqueue kick):
   stale-recovery (in_progress >5min → re-queue)
   per-weight claim: light up to (lightCap − lightInProgress), heavy up to (heavyCap − heavyInProgress)
   FIRE-AND-FORGET dispatch → generate-dream / restyle-photo (x-dream-queue:1)
generate-dream / restyle-photo (x-dream-queue): ack 202 → render in waitUntil →
   completeQueueJob(upload_id) on success / failQueueJob(retry|dead-letter+refund+notify) on failure
client on dream_queue.status=completed → fetch uploads → reveal;  dead_letter → failure card (refunded)
```

One UUID is `dream_queue.id == dream_jobs.id == job_id == sparkle ledger reference_id`.

### The two load-bearing design decisions (and WHY)

1. **The RENDER owns the `dream_queue` terminal state; the worker is FIRE-AND-FORGET.** First attempt had the worker synchronously `await` the render and set the queue row. Under dual-face-swap load the renders ran long, the Supabase gateway **504'd the worker's HTTP call**, and the worker re-queued renders that had **actually succeeded** (`waitUntil` finished them) — re-rendering completed dreams + orphaning uploads (load test: 22/100 completed, ~20 orphans). Fix: render acks 202, finishes in `waitUntil`, and calls `completeQueueJob`/`failQueueJob` itself (`_shared/dreamQueueLifecycle.ts`). Re-test: 30/30, 0 orphans. **NEVER reintroduce a worker that awaits a long render.**

2. **PER-WEIGHT concurrency caps (migration 265), not one global cap.** A global cap throttled fast text dreams to the slow dual path's safe limit. `dream_queue.weight` ('light'|'heavy') is set at enqueue (`enqueue-dream`): heavy = photo `new_scene` / `force_cast_role` / self-referential-prompt-with-cast (i.e. likely a face swap → hits Fly.io); light = plain text + restyle (Kontext, no swap). The worker claims each pool separately (`claim_dream_queue_jobs_by_weight`) up to its own cap. Bias unknown → heavy (never floods the swap service). Mixed load test: **light 150/150 at peak 40, heavy 24/24 at peak 10, fully independent, 0 × 546.**

### The knobs (all live-tunable in `engine_config`, no deploy)

| Knob | Default | What it does |
| --- | --- | --- |
| `dream_queue_max_concurrent` | 40 | LIGHT (text/restyle) simultaneous renders. Fast + no Fly.io dep → wide. |
| `dream_queue_max_concurrent_heavy` | 10 | HEAVY (face-swap/dual) simultaneous renders. **Bounded by the Fly.io `face-swap-dual` service.** |
| `dream_queue_max_jobs_per_tick` | 10 | Per-tick claim ceiling per pool. |

`_shared/engineConfig.ts` mirrors them with code fallbacks (40 / 10 / 10) so a missing row never breaks the worker.

### The real ceiling + how to scale heavy

The HEAVY cap is the **Fly.io `face-swap-dual` service capacity**, not Supabase. Tested: heavy=10 → all dual swaps succeed; heavy=15 → `dual cast face swap exhausted (face-swap-dual@fly)` under combined load. To support more concurrent interactive dual dreams: **scale the Fly.io service FIRST, then raise `dream_queue_max_concurrent_heavy`.** Beyond the cap, jobs queue + drain (never fail) — concurrency is bounded, throughput/total-users is not. Nightly is `weight='heavy'` (the column default) but non-interactive, so a multi-hour overnight drain is invisible.

**RUNBOOK — scaling the Fly heavy ceiling (do this BEFORE raising the cap):**
`services/face-swap-dual/fly.toml` is currently effectively **one machine** (`min_machines_running=1`, no explicit count, no `[http_service.concurrency]`). The app is stateless (each swap is independent), so it scales horizontally cleanly. Steps, from `services/face-swap-dual/`:
1. `fly scale count 2` (or 3) — pins N machines. Verify: `fly machines list`.
2. Re-run `node scripts/loadtest-dual-swap.js` (or `loadtest-mixed.js --heavy N`) at the new intended concurrency to confirm no `face-swap-dual@fly` exhaustion / no 546.
3. Only then raise `dream_queue_max_concurrent_heavy` in `engine_config` (live, no deploy) to ~`10 × machine_count` and watch `dream-queue-monitor` for dead_letters.
Rule of thumb from the load test: ~10 concurrent dual swaps per 1-vCPU/2GB machine. Never raise the cap past tested Fly capacity — excess just exhausts the swap service.

**Hardening pass 2026-06-17 (this section is the status of record):** (a) the per-weight cap is now enforced ATOMICALLY inside `claim_dream_queue_jobs_by_weight` (migration 275, per-weight advisory lock) so overlapping invokers can't overshoot; (b) the worker has an `x-worker-sync` mode + a GitHub Actions backstop (`.github/workflows/dream-queue-sync.yml`, every 5 min) that drains via a HELD connection — the queue keeps draining even if `EdgeRuntime.waitUntil` is dropped by the platform (which happened 2026-06-17 and stalled the queue); (c) `RENDER_TIMEOUT_MS` lowered to 120s (under the 150s request-idle ceiling); (d) `generateImage` 429 retry is now bounded (3); (e) nightly user fetches are paginated (PostgREST's silent 1000-row cap was dropping users 1001+). See `[[project_waituntil_regression_synchronous_queue_render]]`.

### Validation / tuning tools

- `scripts/loadtest-create-queue.js` — LIGHT burst (`--count N`, `--cleanup`).
- `scripts/loadtest-dual-swap.js` — HEAVY dual burst (needs a dual-ready cast).
- `scripts/loadtest-mixed.js` — both lanes at once (`--light N --heavy M`), asserts each cap holds + no orphans + no 546.
- ⚠️ Each spends real render $ and creates private-draft uploads. `--cleanup` deletes the queue rows **and the storage blobs** (deleting an `uploads` row does NOT remove the file — that orphans it).

### Edge functions touched

`enqueue-dream` (new), `generate-dream` + `restyle-photo` (x-dream-queue path + render-owned lifecycle + Phase-0 deferred display-variant), `dream-queue-worker` (per-weight claim + fire-and-forget create/dlt), `_shared/dreamQueueLifecycle.ts` (new), `_shared/engineConfig.ts`. Migrations 264 (concurrency config) + 265 (weight split + by-weight claim RPC).

### Still TODO before 100% ramp

- Single-face-swap path wasn't load-tested in isolation (it's on Replicate, not Fly.io — lower risk).
- Scale the Fly.io dual-swap service to lift the heavy ceiling for big simultaneous-dual bursts.
