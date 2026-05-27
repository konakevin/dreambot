# DreamBot Async Queue + Workers Refactor — Implementation Plan

> **⚠️ SUPERSEDED / DO NOT FOLLOW (2026-05-26).** This plan describes a `dream_jobs`
> table + `enqueue_dream_job` RPC + sparkle-charge-on-enqueue + pg_net-trigger design
> that was **never built**. What actually shipped is a different table (`dream_queue`,
> migration 156) + `claim_dream_queue_job` / `claim_dream_queue_jobs` + a token-auth
> `dream-queue-worker` with fan-out + `EdgeRuntime.waitUntil`. For the REAL architecture
> see CLAUDE.md "Scaling Initiative", `NIGHTLY_DREAM_ENGINE.md`, and
> `QUEUE_WORKERS_REFACTOR.md` (which matches reality). Kept for historical context only.

> **Purpose of this doc.** Next session, you (or another Claude) should be able to read this file top to bottom and start coding. It contains everything needed to ship Phase A without re-deriving anything: context, architecture, schema, RPC signatures, file list, decision points, and verification steps.
>
> **Status:** plan only. Nothing has been built yet. The codebase still uses the synchronous `generate-dream` path.
>
> **Author:** drafted 2026-05-02 after the dual-cast face-swap pipeline started intermittently failing with WORKER_LIMIT_EXCEEDED (HTTP 546) due to wall-clock pressure. See "Why this exists" below.

---

## Quick start (read this first if resuming)

1. **Read sections 1–3** (Why this exists / What's already shipped / Architecture overview). Five minutes.
2. **Read section 13 (Open Questions).** Several questions block code; the answers shape the migration. **Resolve these with Kevin before writing code.**
3. **If unblocked**, start with Phase A (section 9). Migration 145 is the first commit.
4. **Verification commands** are inline in each phase — run them as you go.

**Do NOT skip to the file list and start typing.** The decisions in section 13 change the schema and the worker shape.

---

## 1. Why this exists

The dual-cast face-swap pipeline (two cast members, face-swap eligible medium) intermittently fails with `WORKER_LIMIT_EXCEEDED` (HTTP 546). The orchestrator (`generate-dream` Edge Function) hits Supabase Pro's per-invocation **150 second wall-clock limit** when:

- Sonnet brief: 5–15s
- Flux generation: 8–25s (variable)
- Dual face-swap: 15–43s (very variable — Replicate latency tail)
- Persist + insert: ~1s

Total worst case is ~85s, comfortably under 150s. But under Replicate latency spikes, it goes over. **2026-05-02 user data:** 3 dual-cast attempts in a row hard-failed at face_swap. One ran 143 seconds before the function isolate was killed. Sparkles were correctly auto-refunded (`refund:hard_fail:face_swap`), but the UX is a 2+ minute spinner ending in "lost touch with the dream engine."

This is **not a code bug.** Two earlier dual renders the same hour succeeded in <60s. It's variance-driven — Replicate is the bottleneck, not us.

### What's already been shipped (don't redo)

**Phase 1 — in-place memory hygiene** (committed, in `supabase/functions/_shared/faceSwap.ts`):

1. `perturbSourceImage` uploads to temp storage instead of returning base64 (was 5–7 MB heap hog × 2 swaps in parallel).
2. Sequential post-swap downloads (was `Promise.all`, ~10 MB simultaneous).
3. Eagerly null buffers after last use to give V8 GC hints.

**Phase 2 — function split via `DUAL_SWAP_FANOUT` env flag** (committed, deployed, **flag is ON**):

- New Edge Function `face-swap-dual` (`supabase/functions/face-swap-dual/index.ts`) owns the entire `dualFaceSwap` body.
- New dispatcher `supabase/functions/_shared/dualSwapDispatch.ts` checks the env flag.
- Both `generate-dream` and `nightly-dreams` route through the dispatcher.
- `face-swap-dual` runs in its own isolate with its own 150 MB / 90s budget.

**Critical insight Phase 2 didn't solve:** the orchestrator still `await`s `supabase.functions.invoke('face-swap-dual', ...)`. So total wall-clock is STILL `Sonnet + Flux + worker_invoke`. Phase 2 only isolated **memory**, not **wall clock**. That's why the user is still timing out at 143s — the orchestrator can't deliver the result if it can't hold the connection long enough.

**The durable fix is async**: the user's HTTP request returns in <500ms with a job ID. A separate worker handles the rendering off-clock. The client subscribes for the result.

---

## 2. Architecture overview

```
[ Client: useDreamCreate ]
    │
    │ 1. trySpendSparkle({ jobId, ref=jobId })          // unchanged
    │ 2. enqueueDream({ jobId, payload })                // NEW Edge Function, ~300ms RPC
    ▼
[ Postgres: dream_jobs row inserted, status='queued' ]
    │
    │ 3. AFTER INSERT trigger fires pg_net.http_post → wakes worker
    │
    ▼
[ Edge Function: dream-worker — claims one job, processes, writes result ]
    │
    │  ├─→ runDreamJob(payload)         // NEW shared module — extracted from generate-dream
    │  │     ├─ Sonnet brief
    │  │     ├─ Flux generation
    │  │     ├─ face swap (single in-process; dual via face-swap-dual already)
    │  │     ├─ persistToStorage
    │  │     └─ uploads insert
    │  │
    │  └─→ complete_dream_job RPC       // status='done', upload_id set
    │
    ▼
[ Postgres: dream_jobs row updated → Supabase Realtime broadcasts ]
    │
    │ 4. client subscription fires
    ▼
[ Client: useDreamJob(jobId) hook resolves → reveal screen ]
    │
    │ 5. send-push fan-out for backgrounded users
    ▼
[ Push notification: "Your dream is ready" → deep link to /dream/reveal ]
```

### Worker host decision

**Recommendation: HTTP-triggered Edge Function via Postgres `pg_net` trigger on `INSERT`, with a 30-second cron sweeper as backstop.**

| Option                                                    | Verdict                                                                                                                                                   |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Edge Function HTTP-triggered by `pg_net` AFTER INSERT** | ✅ **v1.** Fresh isolate per job (same memory budget as `face-swap-dual` today). Near-zero queue latency under healthy conditions. Reuses existing infra. |
| Edge Function on cron tick (every 30s)                    | ❌ Adds 30s latency floor. One isolate claims N jobs sequentially → defeats the per-job-isolate gain.                                                     |
| External pool (Fly/Modal/Railway)                         | ❌ Defer. New monthly cost, new deploy story, blows the "single dev" constraint. Reconsider in Phase D+.                                                  |

**Backstop:** `pg_net` is async best-effort. A 30-second cron sweeper polls for `status='queued'` rows older than 30s and re-fires the trigger. Same sweeper handles lease recovery (workers that died mid-job).

### Concurrency

- **Per-user cap: 3 in-flight.** Enforced at the `enqueue_dream_job` RPC. Higher (10) overwhelms our isolate budget; lower (1) kills the multi-tap UX where users queue 3 different vibes.
- **Project-wide:** bounded by Supabase Pro's per-project isolate cap (~75 concurrent). At current scale we're nowhere near it. If we ever cross 200 concurrent users we add a `replicate_inflight` semaphore — Phase E concern.
- **Queue ordering:** FIFO by `created_at`. No priority lanes in v1 (column reserved, defaults to 0).
- **Empty queue:** zero compute spent. No idle workers, no polling cost.

---

## 3. The contract — what changes for users

### Today (sync)

```
Tap Generate → spinner 30–150s → image OR "lost touch with the dream engine"
```

### After Phase B (dual-cast queued)

```
Tap Generate → enqueue (<500ms) → loading screen with realtime status →
image arrives in 30–90s → NEVER times out at 150s
```

### After Phase C (everything queued)

- Median user-perceived latency: ~30–45s (same as today's happy path — no magic)
- **p99: today is "150s timeout + retry". After: "~90s render succeeds."** That's the win.
- Multiple dreams in flight allowed (cap 3) — tap 3 different vibes, see them stream in
- App-backgrounded users get a push: "Your dream is ready"
- Cost: roughly neutral. Edge Function isolates billed by GB-seconds; queue path adds ~100ms `enqueue-dream` overhead.

---

## 4. Database schema — `dream_jobs`

We **already have a `dream_jobs` table** (migration 095, expanded by 134). Today it's used as a passive log — `generate-dream` writes status updates but doesn't read it as a queue. The plan **evolves the existing table** rather than building a parallel one. **No table renames** — additive columns + helper RPCs only, so the legacy synchronous path keeps working unchanged during rollout.

### Existing columns to keep

```
id uuid PK (client-generated)
user_id uuid FK → users(id) ON DELETE CASCADE
status text CHECK (status IN ('queued','processing','done','failed','nsfw','timeout'))
result_image_url text
result_prompt text
result_medium text
result_vibe text
upload_id uuid FK → uploads(id) ON DELETE SET NULL
error text
created_at timestamptz
completed_at timestamptz
```

### New columns to add (migration 145)

```sql
ALTER TABLE public.dream_jobs
  ADD COLUMN payload jsonb,                            -- full request body for runDreamJob
  ADD COLUMN started_at timestamptz,                   -- when worker claimed it
  ADD COLUMN retry_count smallint NOT NULL DEFAULT 0,
  ADD COLUMN max_retries smallint NOT NULL DEFAULT 2,  -- 1 initial + 2 retries = 3 total
  ADD COLUMN priority smallint NOT NULL DEFAULT 0,     -- higher runs first; v1 always 0
  ADD COLUMN worker_id text,                           -- deno isolate id for heartbeat
  ADD COLUMN lease_expires_at timestamptz,             -- claim TTL; default now()+90s
  ADD COLUMN source text NOT NULL DEFAULT 'live'
    CHECK (source IN ('live','nightly','first_dream','retry')),
  ADD COLUMN charge_amount smallint NOT NULL DEFAULT 1,  -- 0 for free generations
  ADD COLUMN idempotency_key text;                     -- client-generated; UNIQUE per user

-- Update status enum
ALTER TABLE public.dream_jobs DROP CONSTRAINT IF EXISTS dream_jobs_status_check;
ALTER TABLE public.dream_jobs ADD CONSTRAINT dream_jobs_status_check
  CHECK (status IN ('queued','processing','done','failed','nsfw','timeout','cancelled','dead'));

-- Indexes
CREATE UNIQUE INDEX idx_dream_jobs_idempotency
  ON public.dream_jobs(user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX idx_dream_jobs_queue_pull
  ON public.dream_jobs(status, priority DESC, created_at ASC)
  WHERE status = 'queued';

CREATE INDEX idx_dream_jobs_lease
  ON public.dream_jobs(lease_expires_at)
  WHERE status = 'processing' AND lease_expires_at IS NOT NULL;

CREATE INDEX idx_dream_jobs_user_recent
  ON public.dream_jobs(user_id, created_at DESC);
```

### RLS

Existing policies on `dream_jobs` already cover the new columns (RLS is row-level, not column-level). The two existing policies — "Users can read own jobs" and "Service role can manage jobs" — remain correct. **Clients never write to `dream_jobs` directly**; all writes go through SECURITY DEFINER RPCs (below).

---

## 5. RPC contracts (all in migration 145)

### `enqueue_dream_job(p_job_id uuid, p_payload jsonb, p_idempotency_key text, p_source text DEFAULT 'live') RETURNS uuid`

- `SECURITY DEFINER`, `SET search_path = ''`
- Runs as `auth.uid()`; rejects if not authenticated
- **Enforces per-user concurrency cap:** `SELECT count(*) FROM dream_jobs WHERE user_id=auth.uid() AND status IN ('queued','processing')` ≤ **3** (constant for v1)
- **Idempotency:** if `(user_id, idempotency_key)` already exists, returns the existing `id` (caller's retry-on-network-error is safe)
- Inserts with `status='queued'`, `payload=p_payload`, `source=p_source`, `id=p_job_id`
- Returns the `id`
- **Does NOT charge sparkles.** The client charges via `spend_sparkles` BEFORE calling enqueue (matches today's pattern). See section 6.

### `claim_dream_job(p_job_id uuid, p_worker_id text, p_lease_seconds int DEFAULT 90) RETURNS dream_jobs`

- Direct claim by ID (used by the `pg_net` push path — worker is told which job to run)
- Row-level lock; errors out if already in `processing|done|failed|cancelled` (race-safe)
- On success: sets `status='processing'`, `worker_id`, `started_at=now()`, `lease_expires_at=now() + lease_seconds`

### `claim_next_dream_job(p_worker_id text, p_lease_seconds int DEFAULT 90) RETURNS dream_jobs`

- Used by the cron backstop sweeper (pull pattern)
- `FOR UPDATE SKIP LOCKED`:
  ```sql
  WITH next AS (
    SELECT id FROM dream_jobs
    WHERE status='queued'
    ORDER BY priority DESC, created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  UPDATE dream_jobs SET status='processing', worker_id=p_worker_id,
    started_at=now(), lease_expires_at=now() + (p_lease_seconds || ' seconds')::interval
  WHERE id = (SELECT id FROM next)
  RETURNING *;
  ```

### `heartbeat_dream_job(p_job_id uuid, p_worker_id text, p_lease_seconds int DEFAULT 90) RETURNS void`

- Worker calls every ~30s during long renders to extend `lease_expires_at`
- Errors if `worker_id` doesn't match (prevents stale workers from stomping live ones)

### `complete_dream_job(p_job_id uuid, p_result_image_url text, p_result_prompt text, p_result_medium text, p_result_vibe text, p_upload_id uuid) RETURNS void`

- `SECURITY DEFINER`, service-role only
- Sets `status='done'`, `completed_at=now()`, clears `lease_expires_at`
- **No-op if status is already terminal** (idempotent retries)

### `fail_dream_job(p_job_id uuid, p_error text, p_should_retry boolean) RETURNS text`

- `SECURITY DEFINER`, service-role only
- Returns the new status: `'queued'` (re-queued for retry) or `'failed'`/`'nsfw'`/`'dead'` (terminal)
- Logic:
  ```
  IF p_should_retry AND retry_count < max_retries:
    SET status='queued', retry_count=retry_count+1,
        lease_expires_at=NULL, worker_id=NULL,
        error = p_error
    RETURN 'queued'
  ELSE:
    SET status = (CASE WHEN p_error LIKE 'NSFW%' THEN 'nsfw' ELSE 'failed' END),
        error=p_error, completed_at=now()
    RETURN <terminal status>
  ```
- **Caller decides retryability.** Postgres just bookkeeps.

### `cancel_dream_job(p_job_id uuid) RETURNS boolean`

- Callable by user (not just service role) — can only cancel own job, only if `status IN ('queued','processing')`
- Sets `status='cancelled'`, returns `true` if cancelled
- Worker checks status at major checkpoints (pre-Sonnet, pre-Flux, pre-face-swap); aborts and returns early if cancelled
- Server-side trigger fires `refund_sparkles(ref=jobId, reason='refund:user_cancelled')`

---

## 6. Sparkle handling (load-bearing)

**Decision: charge on enqueue, refund on terminal failure / cancel.**

Justification: matches today's flow (`useDreamCreate.ts:165`, `trySpendSparkle` then `generateDream`). Switching to "charge on success" would be a behavioral change unrelated to the queue refactor — out of scope, and worse UX (user enqueues 5 dreams thinking they're free, then 5 charges land at once).

| Event                                               | Code path                                                                                                                 | Sparkle              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| User taps Generate (paid)                           | client → `spend_sparkles(amount=1, ref=jobId)`                                                                            | -1 immediately       |
| Network fails before enqueue lands                  | client catch → `refund_sparkles(ref=jobId, reason='refund:enqueue_failed')`                                               | +1 (idempotent)      |
| Worker succeeds                                     | worker → `complete_dream_job`                                                                                             | charge stands        |
| Worker fails after retries                          | worker → `fail_dream_job` returns terminal → worker calls `refund_sparkles(ref=jobId, reason='refund:hard_fail:<class>')` | +1 (idempotent)      |
| Lease expires (worker died), retries exhausted      | sweeper → `fail_dream_job` → sweeper calls `refund_sparkles(ref=jobId, reason='refund:hard_fail:lease_expired')`          | +1 (idempotent)      |
| User cancels mid-flight                             | client → `cancel_dream_job(jobId)` → server trigger refunds                                                               | +1 (idempotent)      |
| **Free generations** (nightly, first_dream, weekly) | `enqueue_dream_job(charge_amount=0, source='nightly')` — client/cron skips `spend_sparkles`                               | no charge, no refund |

**Edge cases:**

- **Retry doesn't double-charge** because the charge happens BEFORE enqueue, keyed to jobId. Re-queuing the same jobId is free.
- **Rapid double-tap** is protected by `busy.current` (existing) PLUS the `UNIQUE(user_id, idempotency_key)` index — even if both clicks slip through, `enqueue_dream_job` returns the existing jobId.
- **`charge_amount=0`** on the row makes the worker's refund logic trivially correct: `IF charge_amount > 0 AND terminal_failure THEN refund(charge_amount)`.

---

## 7. Worker code — `runDreamJob` extraction

The biggest piece of work. Extract the body of `supabase/functions/generate-dream/index.ts` (lines ~150–1230, the whole pipeline from prompt build → generateImage → face swap → persist → uploads insert) into a **pure async function**:

```ts
// supabase/functions/_shared/runDreamJob.ts (~600 LOC, mostly moved)

export interface DreamJobPayload {
  // Same shape as today's generate-dream POST body
  prompt?: string;
  cast?: string;
  medium?: string;
  vibe?: string;
  photoUrl?: string;
  // ... (full list lifted from current generate-dream req body parsing)
}

export interface DreamJobResult {
  uploadId: string;
  imageUrl: string;
  finalPrompt: string;
  resolvedMediumKey: string;
  resolvedVibeKey: string;
  logAxes: Record<string, unknown>;
}

export interface DreamJobContext {
  supabase: SupabaseClient;
  userId: string;
  replicateToken: string;
  anthropicKey: string;
  deadlineMs?: number;
}

export interface DreamJobCallbacks {
  /** Returns false → caller should abort gracefully (user cancelled). */
  onCheckpoint?: (label: 'pre-flux' | 'pre-face-swap' | 'pre-persist') => Promise<boolean>;
}

export async function runDreamJob(
  payload: DreamJobPayload,
  ctx: DreamJobContext,
  callbacks?: DreamJobCallbacks
): Promise<DreamJobResult>;
```

**`onCheckpoint` lets the worker check `dream_jobs.status === 'cancelled'` between major steps and bail.**

Two callers consume it:

- **`generate-dream/index.ts`** (legacy sync path, kept gated by `DREAM_QUEUE_ENABLED` flag during rollout) — slim wrapper that does auth + sparkle bookkeeping + calls `runDreamJob`. **Shrinks 1416 → ~150 LOC.**
- **`dream-worker/index.ts`** (new) — claims job, calls `runDreamJob`, completes/fails.

**Crucially: `runDreamJob` does NOT contain auth, sparkle spend, sparkle refund, or `dream_jobs` row management.** Those stay in the callers. This keeps `runDreamJob` a pure render function, easy to test.

### `dream-worker/index.ts` (~150 LOC)

```ts
// Pseudocode
serve(async (req) => {
  const { jobId } = await req.json();
  const workerId = crypto.randomUUID();

  // Claim — silent return if race lost
  const job = await supabase.rpc('claim_dream_job', {
    p_job_id: jobId,
    p_worker_id: workerId,
    p_lease_seconds: 90,
  });
  if (!job) return new Response(JSON.stringify({ status: 'race_lost' }), { status: 200 });

  // Heartbeat every 30s
  const heartbeat = setInterval(
    () =>
      supabase.rpc('heartbeat_dream_job', {
        p_job_id: jobId,
        p_worker_id: workerId,
        p_lease_seconds: 90,
      }),
    30_000
  );

  try {
    // Run with checkpoint hook
    const result = await runDreamJob(job.payload, ctx, {
      onCheckpoint: async () => {
        const { data } = await supabase
          .from('dream_jobs')
          .select('status')
          .eq('id', jobId)
          .single();
        return data?.status === 'processing'; // false → cancelled, abort
      },
    });

    await supabase.rpc('complete_dream_job', { ...result, p_job_id: jobId });
    return new Response(JSON.stringify({ status: 'done', uploadId: result.uploadId }));
  } catch (err) {
    const errClass = classifyFailure(err); // existing logic, lifted to _shared/classifyFailure.ts
    const shouldRetry = ['flux_gen', 'rate_limit', 'timeout'].includes(errClass);
    const newStatus = await supabase.rpc('fail_dream_job', {
      p_job_id: jobId,
      p_error: errClass,
      p_should_retry: shouldRetry,
    });

    if (newStatus !== 'queued' && job.charge_amount > 0) {
      await supabase.rpc('refund_sparkles', {
        p_user_id: job.user_id,
        p_amount: job.charge_amount,
        p_reason: `refund:hard_fail:${errClass}`,
        p_reference_id: jobId,
      });
      await supabase
        .from('notifications')
        .insert({ recipient_id: job.user_id, type: 'dream_failed', body: '...' });
    }

    return new Response(JSON.stringify({ status: newStatus, error: errClass }), { status: 200 });
  } finally {
    clearInterval(heartbeat);
  }
});
```

### Retry policy

- `max_retries = 2` → 3 total attempts
- **Retryable error classes:** `flux_gen`, `rate_limit`, `timeout`
- **Non-retryable:** `nsfw`, `db_insert`, `storage_upload`, `client_moderation`, `face_swap` (after `dispatchDualFaceSwap`'s own internal 3 retries)
- **Backoff via `lease_expires_at`:** when re-queuing, set `lease_expires_at = now() + backoff` (10s, 30s). The cron sweeper only fires the worker for rows past their backoff. (Simpler alt: re-queue immediately and accept Replicate's tail latency self-paces retries — but explicit backoff helps when Replicate is in a 429 storm.)
- **After max retries:** `status='dead'`, refund, push notification.

### Heartbeat / lease recovery

- Lease default: 90s (3× heartbeat interval — catches one missed beat)
- Sweeper queries `WHERE status='processing' AND lease_expires_at < now()` every 30s
- For each stale: `fail_dream_job(jobId, 'lease_expired', should_retry=true)` → re-queue
- Hard ceiling: `created_at + 10 minutes`. After that, sweeper force-fails.

---

## 8. Trigger + cron sweeper

### Trigger (in migration 145)

```sql
CREATE OR REPLACE FUNCTION public.notify_dream_worker() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.status = 'queued' THEN
    -- Only fire if the worker URL is configured (Phase A ships dormant)
    IF current_setting('app.dream_worker_url', true) IS NOT NULL
       AND current_setting('app.dream_worker_url', true) != '' THEN
      PERFORM net.http_post(
        url := current_setting('app.dream_worker_url'),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.service_role_key')
        ),
        body := jsonb_build_object('jobId', NEW.id)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_dream_worker
  AFTER INSERT OR UPDATE OF status ON public.dream_jobs
  FOR EACH ROW
  WHEN (NEW.status = 'queued')
  EXECUTE FUNCTION public.notify_dream_worker();
```

The trigger fires for both new inserts AND retries (re-set to `queued`). **It's dormant until `app.dream_worker_url` is set** — Phase A ships the trigger but no URL, so it no-ops.

### Cron sweeper — `dream-queue-sweeper` Edge Function (~200 LOC)

Runs every 30s via GitHub Actions (same pattern as existing `refund-stuck-jobs`). Three responsibilities:

1. **Missed-trigger backstop:** find `status='queued'` rows older than 30s, re-fire `pg_net` POST to worker
2. **Lease recovery:** find `status='processing'` rows where `lease_expires_at < now()`, call `fail_dream_job(should_retry=true)`
3. **Archival** (optional in Phase A; required by Phase D): DELETE terminal rows older than 30 days

**Existing `refund-stuck-jobs` sweeper logic merges into this.** They don't conflict — both read `status='processing'`, both call idempotent `refund_sparkles`.

---

## 9. Phased rollout (no flag day)

### Phase A — scaffolding (~2 days, fully dormant)

Ship together, NO behavior change for users. Fully reversible — Phase A is dormant code only.

**Deliverables:**

1. Migration `145_dream_jobs_queue.sql` — additive columns, indexes, all RPCs, trigger (dormant via empty `app.dream_worker_url`)
2. New file `supabase/functions/_shared/runDreamJob.ts` — extracted from `generate-dream/index.ts`. Both callers (legacy sync `generate-dream` and new `dream-worker`) delegate to it. `generate-dream` keeps working identically — verify by re-running existing dual-cast renders.
3. New file `supabase/functions/_shared/classifyFailure.ts` — lift inline classifier to shared module
4. New file `supabase/functions/dream-worker/index.ts` — implemented but never invoked. Manual smoke test by `curl`-ing it directly with a hand-crafted payload.
5. New file `supabase/functions/enqueue-dream/index.ts` — implemented but client doesn't call it yet
6. New file `supabase/functions/dream-queue-sweeper/index.ts` — scaffolded, cron not yet enabled
7. Client unchanged.

**Gate:** env var `DREAM_QUEUE_ENABLED=false` (default). When `false`, the client never calls `enqueue-dream`. Until set to `true`, all jobs flow through the legacy `generate-dream` synchronous path exactly as today.

**Verification commands for Phase A end:**

```bash
# 1. Migration applied cleanly
npx supabase db remote --help  # confirm linked
# Run migration 145 in dashboard SQL editor

# 2. Type regen
supabase gen types typescript --linked > types/database.ts

# 3. Legacy path still works — run a synchronous dual-cast generation from the app
#    If image lands → runDreamJob extraction is correct

# 4. Worker manual smoke test
curl -X POST https://jimftynwrinwenonjrlj.supabase.co/functions/v1/dream-worker \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"<some-test-job-uuid>"}'

# 5. Test
npm run check
```

**Rollback:** nothing to roll back — Phase A is dormant.

### Phase B — DUAL-CAST ONLY through queue (~2 days)

**This is the highest-impact, lowest-risk swap because dual-cast is already failing.**

**Deliverables:**

1. Client change — `lib/dreamRouting.ts` (new helper):
   ```ts
   export function shouldQueue(config: DreamGenConfig): boolean {
     // Phase B: only dual-cast face-swap goes through queue
     return config.castMembers.length === 2 && config.faceSwapEligible;
   }
   ```
2. `hooks/useDreamCreate.ts` — branches on `shouldQueue(...)`. If true → `enqueueDream({ jobId, payload })` then write `activeJobId` to `store/dream`. If false → existing `generateDream(...)`.
3. `hooks/useDreamJob.ts` — TanStack Query + Supabase Realtime on `dream_jobs:id=eq.${jobId}`, 5s polling fallback
4. `app/dream/loading.tsx` — when `activeJobId` set, render via `useDreamJob`. Otherwise existing path
5. Server: enable `pg_net` trigger by setting `app.dream_worker_url` to the deployed worker URL; set `DREAM_QUEUE_ENABLED=true` secret

**Gates (5–7 days of soak before Phase C):**

- Dual-cast `done` rate ≥ 95% (vs today's ~50–75% with 546 errors)
- p99 user-perceived latency (enqueue → result) ≤ 90s
- Refund rate flat or DOWN (we should see the SAME or fewer refunds)
- `dream_jobs.retry_count > 0` rate (informational)

**Rollback:** flip `DREAM_QUEUE_ENABLED=false` in Edge Function env via `supabase secrets set` — zero deploy. Client routing helper falls through to `generateDream()`. No data migration needed; failed/in-flight `dream_jobs` rows are inert log entries.

### Phase C — everything through the queue (~1 day)

After Phase B has soaked clean for 5–7 days:

**Deliverables:**

1. `lib/dreamRouting.ts` — flip default branch: every paid generation goes via `enqueueDream`
2. `scripts/nightly-dreams.js` — instead of looping users and calling the function, calls `enqueue_dream_job` per user with `source='nightly', charge_amount=0`. ~25s total fan-out vs ~50min today.
3. `supabase/functions/generate-first-dream/index.ts` — same: enqueue with `source='first_dream', charge_amount=0`
4. **Restyle (Kontext) stays inline** — different Edge Function, doesn't share `runDreamJob`. Decide separately whether to queue. Recommendation: stay sync v1.

**Gates:** all Phase B gates continue to hold + no regression in single-cast latency (>5s queue overhead = investigate).

### Phase D — deprecate sync path (~1d, after Phase C soaks 2 weeks)

- Delete legacy `generate-dream` body; keep the Edge Function as a redirect that calls `enqueue_dream_job` and polls for completion synchronously (~30s) for old App Store clients
- Remove `DREAM_QUEUE_ENABLED` flag
- Move shared code from `_shared/runDreamJob.ts` into `dream-worker/` if no other caller exists

---

## 10. nightly-dreams interaction

Yes, nightly fans out via the queue too.

**Today:** `scripts/nightly-dreams.js` loops eligible users, awaits each `nightly-dreams` Edge Function call sequentially with concurrency=N. ~500 users × ~30s / concurrency=5 = ~50 min wall-clock. A single hung user blocks a slot.

**After Phase C:**

- Cron makes one pass: for each eligible user, calls `enqueue_dream_job(charge_amount=0, source='nightly', payload={ flavor:'nightly', userId })`
- ~500 enqueues × ~50ms = **~25s total fan-out**
- Workers drain the queue overnight at normal isolate concurrency
- Failures retry automatically; per-user latency goes from "minutes blocking" to "~30s post-enqueue"

**Recommended implementation:** keep `nightly-dreams` Edge Function alive as the renderer for `source='nightly'` jobs. `dream-worker` inspects `payload.flavor === 'nightly'` and calls `supabase.functions.invoke('nightly-dreams', { body: { jobId, payload }})`. Avoids merging 1418 LOC of nightly logic into `runDreamJob`. **Two functions, one queue.**

---

## 11. Failure modes (the full list)

| Failure                                                                | Handling                                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker isolate dies mid-job (HTTP 546, OOM)                            | `lease_expires_at` passes → sweeper fires `fail_dream_job(should_retry=true)` → re-queue. After max retries → refund.                                                                                         |
| `pg_net` trigger drops the POST                                        | Cron sweeper finds `queued` row > 30s old, re-fires the POST.                                                                                                                                                 |
| Replicate hard-down for hours                                          | Worker errors → backoff escalates → after max retries `status='dead'`. Slack alert if any `dead` rows in 1-hour window.                                                                                       |
| Anthropic 429s                                                         | Existing `enhanceViaHaiku` retry handles transient. If exhausted, `runDreamJob` falls through to `fallbackPrompt` (already in code). No queue-level retry.                                                    |
| User deletes account before job completes                              | `dream_jobs.user_id` has `ON DELETE CASCADE`. Row vanishes. Worker's `complete_dream_job` becomes a no-op (row gone) — log warning, return. Storage upload orphaned → cleaned by sweeper's temp-cleanup pass. |
| Same dream submitted twice rapidly                                     | Client has one jobId. `busy.current` blocks 2nd tap. Even if it slips, `UNIQUE(user_id, idempotency_key)` returns existing jobId.                                                                             |
| Job stuck "processing" forever                                         | Lease 90s default. Heartbeat every 30s. Hard ceiling at `created_at + 10 min` — sweeper force-fails.                                                                                                          |
| Database overload (table bloat)                                        | Nightly DELETE of terminal rows older than 30 days (in sweeper). Active rows untouched.                                                                                                                       |
| Realtime channel disconnects on client                                 | `useDreamJob`'s 5s polling fallback covers. On reconnect, cache reconciled by next refetch.                                                                                                                   |
| Two workers race for same jobId                                        | `claim_dream_job` row-level lock. Loser gets "already claimed", returns 200 silently.                                                                                                                         |
| Worker crashes AFTER `complete_dream_job` but BEFORE returning success | Idempotent — job is `done`, upload exists, realtime already broadcast, client got result.                                                                                                                     |
| Storage upload succeeds but `uploads` insert fails                     | `runDreamJob` throws → `fail_dream_job` → refund. Orphaned storage object cleaned by sweeper.                                                                                                                 |
| Client cancels but worker started face-swap                            | `onCheckpoint('pre-face-swap')` returns false → worker aborts + refund. Intermediate output not worth user confusion.                                                                                         |
| Anthropic API key rotated mid-render                                   | Sonnet call fails → fallback prompt path → generation completes. Existing behavior.                                                                                                                           |
| Replicate prediction timeouts at 60s                                   | `runDreamJob`'s deadline param. Throw → retry.                                                                                                                                                                |

---

## 12. Concrete file plan

### New files

| Path                                              | Purpose                                                            | Est. LOC            |
| ------------------------------------------------- | ------------------------------------------------------------------ | ------------------- |
| `supabase/migrations/145_dream_jobs_queue.sql`    | Schema + RPCs + trigger (dormant)                                  | ~250                |
| `supabase/functions/_shared/runDreamJob.ts`       | Pure render function extracted from `generate-dream`               | ~600 (mostly moved) |
| `supabase/functions/_shared/classifyFailure.ts`   | Lift inline classifier to shared                                   | ~30                 |
| `supabase/functions/dream-worker/index.ts`        | HTTP-triggered worker                                              | ~150                |
| `supabase/functions/enqueue-dream/index.ts`       | Thin auth + RPC wrapper called by client                           | ~80                 |
| `supabase/functions/dream-queue-sweeper/index.ts` | Cron sweeper (lease recovery + missed-trigger backstop + archival) | ~200                |
| `lib/dreamRouting.ts`                             | Client-side: should this go through queue?                         | ~40                 |
| `hooks/useDreamJob.ts`                            | Realtime + polling hook                                            | ~100                |
| `hooks/useMyInFlightDreams.ts`                    | Pill on home screen                                                | ~50                 |
| `components/InFlightDreamsPill.tsx`               | UI for pill                                                        | ~80                 |
| `__tests__/lib/dreamRouting.test.ts`              | Unit tests for routing helper                                      | ~80                 |
| `__tests__/lib/runDreamJob.test.ts`               | Unit tests for the render function (mocked Replicate/Anthropic)    | ~150                |

### Modified files

| Path                                             | Change                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `supabase/functions/generate-dream/index.ts`     | Shrink 1416 → ~150 LOC; delegates to `runDreamJob`. Legacy sync path during Phase A/B/C. Phase D deletes the body. |
| `supabase/functions/face-swap-dual/index.ts`     | No change — reused as-is                                                                                           |
| `supabase/functions/_shared/dualSwapDispatch.ts` | No change — `runDreamJob` calls it                                                                                 |
| `supabase/functions/nightly-dreams/index.ts`     | Phase C: accept `{ jobId, payload }` body                                                                          |
| `lib/dreamApi.ts`                                | Add `enqueueDream(opts)`, keep `generateDream(opts)` for legacy callers                                            |
| `hooks/useDreamCreate.ts`                        | Branch on `dreamRouting.shouldQueue(config)`                                                                       |
| `app/dream/loading.tsx`                          | When `activeJobId` set, render via `useDreamJob`                                                                   |
| `store/dream.ts`                                 | Already has `activeJobId` and `activeJobFailure` — minor cleanup                                                   |
| `scripts/nightly-dreams.js`                      | Phase C: replace `fetch(/nightly-dreams)` with `fetch(/enqueue-dream)` per user                                    |
| `.github/workflows/cron-*.yml`                   | Add `dream-queue-sweeper` cron @ 30s (or move to Supabase pg_cron — see open question 7)                           |
| `tsconfig.json`                                  | Add new `__tests__/lib/*.test.ts` files to `exclude` (matches existing pattern for `@engine/*` tests)              |

### Migration number

Next free: **145** (last is 144_uploads_recipe_jsonb.sql — verify with `ls supabase/migrations/ | tail -5` before starting).

If Phase A splits into multiple migrations during build, use 145, 146, 147 in order. Test enforces unique numeric prefixes (`__tests__/lib/migrations.test.ts`).

### LOC delta + time estimate

- New code: ~1,500 LOC
- Modified code: ~300 LOC (mostly slimming `generate-dream` from 1416 → 150)
- **Net add: ~1,200 LOC**
- **Time-to-ship: 8–10 working days** (Phase A: 2d, Phase B: 2d, soak: 5–7d, Phase C: 1d, Phase D: deferred ~2 weeks later, ~1d)

---

## 13. ⚠️ Open questions — RESOLVE BEFORE CODING

These shape the schema and the worker code. Get answers from Kevin in the first 5 minutes of next session.

1. **Worker host:** confirm `pg_net`-triggered Edge Function with cron backstop (recommended). Or spike a Fly/Modal external worker variant for cost/reliability comparison?

2. **Queue UI:** hide it (default — "loading" feels like before) or show position-in-line in v1? Recommendation: hide v1; show in Phase E when queue depth observably grows.

3. **Sparkle charge timing:** charge on enqueue (matches today) or charge on success (cleaner under retries, but a behavior change)? Recommendation: charge on enqueue.

4. **Per-user concurrency cap:** 3 (recommended), 1 (kills multi-tap UX), 10 (overwhelms isolate budget)?

5. **Restyle (Kontext) — queue or stay sync?** Recommendation: stay sync v1.

6. **Nightly merger:** `nightly-dreams` Edge Function stays as the renderer for `source='nightly'` jobs (recommended) or merge into `runDreamJob`?

7. **Cron host:** GitHub Actions (current pattern) or Supabase `pg_cron` (one fewer moving part)? Recommendation: pg_cron for the new sweeper.

8. **First-dream:** queue with `source='first_dream', charge_amount=0` in Phase C? Recommendation: yes.

9. **Push notifications:** every `dream_done` fires push, or only when app backgrounded? Audit `send-push` Edge Function before Phase B (5-min task).

10. **Status enum cleanup:** today's enum has `('queued','processing','done','failed','nsfw','timeout')`. Plan adds `cancelled` and `dead`. Also rename `processing → running` (matches the spec wording) or keep `processing` to avoid call-site churn? Recommendation: keep `processing`.

---

## 14. Test coverage plan

**Unit tests (Jest, mocked):**

- `__tests__/lib/runDreamJob.test.ts` — verify it produces expected upload row for each branch (self-insert, dual cast, photo new-scene, text directive, surprise). Mock Replicate + Anthropic.
- `__tests__/lib/dreamRouting.test.ts` — should-queue logic for all path combinations
- `__tests__/lib/feedHelpers.test.ts` — already exists, no changes
- `__tests__/lib/expressionRule.test.ts` — already exists, no changes

**Manual integration (after Phase A deploy):**

- Hand-craft a `dream_jobs` row, `curl` `dream-worker` directly with `{ jobId }`, verify it claims/runs/completes. `dream-test` skill can drive this.
- Manually update `dream_jobs.lease_expires_at = now() - interval '1 minute'` on a `processing` row → verify sweeper recovers within one tick.
- Call `refund_sparkles` with same `reference_id` twice → verify only one transaction lands. (Already covered by migration 134's behavior, but re-verify.)
- Enqueue, immediately call `cancel_dream_job` → verify worker bails at first checkpoint and refund applies.
- Phone in airplane mode → enqueue via Edge Function curl → re-enable network → verify the home pill picks up the in-flight dream.

**After Phase B deploy:**

- Run 5 dual-cast renders back-to-back → all complete, sparkles correct, push notifications fire
- Run 5 dual-cast renders simultaneously → concurrency cap honored
- Test rapid double-tap on Generate → only one dream job created

---

## 15. Verification commands (cheat sheet)

```bash
# Status of the queue right now
psql -c "SELECT status, count(*), avg(extract(epoch from completed_at - created_at)) AS avg_seconds FROM dream_jobs GROUP BY status;"

# Stuck jobs (lease expired but still processing)
psql -c "SELECT id, user_id, started_at, lease_expires_at FROM dream_jobs WHERE status='processing' AND lease_expires_at < now();"

# Today's failures by class
psql -c "SELECT error, count(*) FROM dream_jobs WHERE status IN ('failed','dead') AND created_at > now() - interval '1 day' GROUP BY error;"

# Refunds today
psql -c "SELECT reason, count(*), sum(amount) FROM sparkle_transactions WHERE created_at > now() - interval '1 day' AND amount > 0 GROUP BY reason;"

# Worker invocation counts (Supabase dashboard → Edge Functions → dream-worker → Logs)

# Realtime channel test
# In a browser console connected to the app:
supabase.channel('test').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dream_jobs' }, console.log).subscribe()
```

---

## 16. Pre-flight checklist before writing the migration

- [ ] All open questions in section 13 answered
- [ ] `ls supabase/migrations/` confirms 145 is the next free number
- [ ] `git status` clean; on a fresh feature branch off `main` (`git checkout -b dream-queue-phase-a`)
- [ ] Read CLAUDE.md "After-Change Checklist" — particularly the migration hygiene rules
- [ ] Confirm Supabase CLI version (`supabase --version`); recommend latest
- [ ] `npm run check` passes baseline (no pre-existing failures)
- [ ] Commit the existing dual-cast brief work (expression + action rules) before starting — clean baseline

---

## 17. Reference — files the reader should know exist

These were touched or examined while writing this plan and may or may not need changes:

- `supabase/functions/generate-dream/index.ts` — the orchestrator that hits the wall today (1416 LOC)
- `supabase/functions/_shared/dualSwapDispatch.ts` — Phase 2 dispatcher with `DUAL_SWAP_FANOUT` flag
- `supabase/functions/face-swap-dual/index.ts` — Phase 2 split worker, reused as-is
- `supabase/functions/_shared/faceSwap.ts` — single + dual face-swap pipeline
- `supabase/functions/nightly-dreams/index.ts` — already cron-triggered; should reuse the same worker
- `supabase/functions/_shared/dualBriefBuilder.ts` — dual-cast brief construction
- `supabase/functions/_shared/promptCompiler.ts` — single-cast brief construction
- `lib/dreamApi.ts` — client-side API surface today (synchronous)
- `app/(tabs)/upload.tsx` — client screen with the spinner
- `app/dream/loading.tsx` — current loading screen
- `lib/dreamPost.ts` — how a finished dream gets inserted into `uploads` and pinned to feed
- `hooks/useDreamCreate.ts` — current sync mutation hook
- `store/dream.ts` — already has `activeJobId` field (lucky)
- `supabase/migrations/095_*` — original `dream_jobs` table
- `supabase/migrations/134_*` — `refund_sparkles` idempotency
- `supabase/migrations/144_uploads_recipe_jsonb.sql` — last migration before 145

---

## 18. CLAUDE.md hooks

These standing rules apply to this work; don't skip them:

- **Always use `--no-verify-jwt`** when deploying Edge Functions
- **Regenerate types** after the migration: `supabase gen types typescript --linked > types/database.ts`
- **Never use `?.` in top-level Edge Function module code** — Deno BOOT_ERROR. Explicit null checks.
- **Never use `as Function`, `as any`, `as unknown as <type>`** — regenerate types instead
- **Migration 145 next free; verify before touching**
- **Never run unscoped deletes on `bot_seeds` or `nightly_seeds`**
- **No fire-and-forget critical RPCs without `.catch`** that logs in dev mode
- **Pre-commit hook will run prettier → lint → tsc → jest.** All must pass.
- **`supabase secrets set` doesn't require redeploy** — secrets are read at invocation time

---

## 19. End-of-doc resume hint

> **If you're a fresh Claude session reading this for the first time:**
>
> 1. Confirm with Kevin that this plan is still the agreed-upon shape (architecture, recommendations, sparkle contract). Things may have changed since 2026-05-02.
> 2. Resolve the open questions in section 13.
> 3. Start with Phase A (section 9). Migration 145 is the first commit.
> 4. Do NOT pre-build the queue UI / position-in-line — Phase A is dormant scaffolding only.
> 5. Don't merge to `main` until the manual smoke test in section 9 passes.
> 6. After Phase A merges, take a break before flipping the Phase B flag — let the dormant code soak in production for ~1 day.

End of plan. Good luck.
