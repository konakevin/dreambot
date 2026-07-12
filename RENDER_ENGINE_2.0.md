# RENDER_ENGINE_2.0.md — the durable render engine

Status: **formal implementation plan, for review** (2026-07-11). "Clear the decks and
build it right" scope — a deliberate, multi-week, highest-blast-radius migration done as a
strangler with a live fallback at every step.

**Supersedes** `PERSISTENT_WORKER_PLAN.md` (that plan was a driver band-aid; this fixes the
root). **Subsumes** the open items in `SCALING_HARDENING.md`. **Evolves** the queue described
in `QUEUE_WORKERS_REFACTOR.md` (the queue status-of-record) — the queue seam is kept and
formalized, not replaced.

Locked architectural decisions (see §13): **(1)** durable state machine on **Postgres**, not
Temporal; **(2)** provider progression is **poll-multiplexed now**, webhooks added later for
the video lane; **(3)** persistent compute on **Fly** (the incumbent, already runs
`face-swap-dual`).

---

## 1. Why 2.0

The render pipeline is a long-running-job workload (30–90s today; **minutes** once video and
HD land) running on **serverless edge isolates** built for sub-second request/response. Every
piece of fragility we have is compensation for that mismatch:

- A render is one **linear held function**. If the isolate dies at second 80, the job restarts
  from zero — financially and latency-fatal once a stage costs minutes and dollars.
- The platform **dropped `EdgeRuntime.waitUntil`** on 2026-06-17, so the engine now leans on a
  **three-mechanism drainer** (pg_cron + per-enqueue kick + a 5-min GitHub Actions held-connection
  loop) to keep isolates alive. Only the GitHub loop is `waitUntil`-independent.
- Hard ceilings: **~150s isolate wall**, **256MB per isolate**, held-connection chains across
  three tiers (worker → generate-dream → Fly), budget-abort orphaning under load.

None of this survives contact with video (minute-long jobs), HD (bigger artifacts), or a real
load spike. 2.0 removes the mismatch instead of compensating for it.

### The goal
A pipeline that (a) **does not fall over under load**, (b) **loses nothing and double-charges
nothing** when a machine dies, and (c) makes video / HD / longer renders **drop-in lanes**, not
rewrites — while keeping the parts that already work (the queue, the caps, idempotent
charge/refund, the scene engine, face-swap-on-Fly, Realtime, the monitors).

---

## 2. Principles (design tenets)

1. **The job is a durable state machine, not a function call.** State lives in Postgres; every
   stage is independently retryable and **resumes from its last checkpoint**, never from zero.
2. **The queue is the seam.** Producers (enqueue) and the client are decoupled from compute by
   `render_jobs`. Swapping the consumer's compute changes nothing upstream.
3. **Persistent, stateless, horizontal workers.** Add machines to add throughput. No shared
   state; `FOR UPDATE SKIP LOCKED` + atomic per-lane caps make N workers safe with zero
   coordination.
4. **Async I/O multiplexing.** A provider poll is an awaited fetch (near-zero CPU/mem), so one
   machine holds **many** concurrent in-flight jobs — the efficiency the isolate-per-request
   model can never reach.
5. **Backpressure that never fails a job.** Over a lane's capacity cap, jobs **wait**. Nothing
   is rejected mid-flight; nothing 500s under a spike.
6. **Idempotent everything on the money path.** Charge at enqueue, refund on dead-letter, both
   keyed on the job id. Every stage is safe to re-run.
7. **Capability-agnostic core.** Video / HD / a new provider = a new lane + adapter + cap +
   price. The hard part (tolerating long, expensive, resumable jobs) is solved once.

---

## 3. Target architecture

```
             ┌ enqueue-dream (edge, UNCHANGED): auth · charge · INSERT render_job · realtime ack (<500ms)
 phone ──────┤
             └ nightly / first-dream enqueuers (UNCHANGED)
                         │
                         ▼
            ═══ render_jobs (Postgres) — the durable seam + STATE MACHINE ═══
               stage · stage_state(jsonb checkpoint) · lane · provider · provider_job_id
               attempt · next_run_at · lease_expires_at · idempotency (= id)
               claim: SKIP LOCKED + per-lane capacity caps (generalizes migration 275)
                         │  LISTEN/NOTIFY on insert + stage-advance (kills idle polling)
                         ▼
 ┌──────── render worker fleet (Fly, persistent, autoscaled on queue depth) ────────┐
 │ stateless · async I/O · ONE machine multiplexes MANY in-flight jobs               │
 │ advance(job): brief → submit → await(poll|webhook) → post(swap/upscale) →         │
 │               persist(storage) → complete | fail(resume from checkpoint |         │
 │                                                  dead-letter + refund + notify)    │
 └───────────────────────────────────────────────────────────────────────────────────┘
   │ image models (Replicate/Gemini/GPT)  │ video models (Runway/Pika/Replicate)  │ face-swap-dual (Fly)
                         ▼   Storage/CDN (images · video · thumbnails)   →  Realtime → phone
```

**Component ownership:**
- **enqueue-dream** (edge, kept): auth, per-user in-flight cap, idempotent charge, INSERT the
  job, return `<500ms`. No render logic — it never had any worth moving.
- **render_jobs** (Postgres): the single source of truth for a render's state. The client
  subscribes here (Realtime, unchanged); the worker fleet drives it.
- **render worker fleet** (Fly, new): the persistent async consumer. Claims ready jobs, advances
  their state machine, owns terminal state + refund/notify.
- **provider adapters** (in the worker): image, video, face-swap. Uniform submit/await/collect
  interface so lanes are pluggable.
- **Storage/CDN**: artifacts (images now; video + thumbnails/transcodes later).

---

## 4. The job model — `render_jobs` state machine (the heart)

We **evolve the existing `dream_queue`** into the state machine rather than introduce a parallel
table, preserving the id-equivalence the whole system relies on:
`render_jobs.id == dream_jobs.id == job_id == sparkle_transactions.reference_id`. The client
keeps subscribing to the same row (no client change). During the strangler both consumers read
this table, disambiguated by `render_engine` (§12).

> Naming note: we keep the physical table `dream_queue` (avoids a rename migration + Realtime
> publication churn) and refer to it logically as `render_jobs`. New columns below are additive.

### 4.1 Schema (additive columns)

```sql
ALTER TABLE public.dream_queue
  -- which consumer owns this row (strangler discriminator; disjoint claim WHERE = no double-run)
  ADD COLUMN IF NOT EXISTS render_engine text NOT NULL DEFAULT 'edge',   -- 'edge' | 'fly'
  -- the explicit state machine stage (generalizes current_stage from migration 272)
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'queued',
  -- durable per-stage checkpoint: brief, provider_job_id, intermediate urls, swap result, ...
  ADD COLUMN IF NOT EXISTS stage_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- capacity lane (generalizes weight light/heavy → provider-capacity lanes)
  ADD COLUMN IF NOT EXISTS lane text NOT NULL DEFAULT 'image',           -- 'image' | 'video' | 'face_swap'
  -- external provider handle for poll/webhook resume
  ADD COLUMN IF NOT EXISTS provider text,                                -- 'replicate' | 'gemini' | ...
  ADD COLUMN IF NOT EXISTS provider_job_id text,
  -- explicit schedule (replaces the created_at-in-the-future backoff hack)
  ADD COLUMN IF NOT EXISTS next_run_at timestamptz NOT NULL DEFAULT now(),
  -- lease-based ownership: expiry IS the crash recovery (replaces the 5-min stale sweep)
  ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz;

-- Hot claim path index: ready jobs for a given engine+lane, oldest first.
CREATE INDEX IF NOT EXISTS idx_render_jobs_claimable
  ON public.dream_queue (render_engine, lane, next_run_at)
  WHERE stage NOT IN ('completed','failed','dead_letter');
```

`status` stays for backward-compat with the edge path and the client's coarse view; `stage` is
the fine-grained execution state the fly engine drives. On the fly path `status` is derived from
`stage` (`queued`/`in_progress`/`completed`/`dead_letter`) so Realtime + the client keep working
unchanged.

### 4.2 Stages

```
queued → briefing → submitting → rendering → post_processing → persisting → completed
                                                                              ↘ failed (retry → resume at the failed stage, backoff)
                                                                              ↘ dead_letter (refund + notify)
```

| Stage | Does | Checkpoints into `stage_state` | Idempotency guard |
|---|---|---|---|
| `queued` | initial; claimable | — | — |
| `briefing` | scene engine → Sonnet brief (`_shared` verbatim) | `{ brief, medium, vibe, cast, rolled_axes }` | if brief present, skip |
| `submitting` | submit to provider; store handle | `{ provider, provider_job_id }` | if `provider_job_id` present, skip re-submit |
| `rendering` | await provider (poll now / webhook later) | `{ raw_image_url | raw_video_url }` | poll by `provider_job_id`; safe to re-enter |
| `post_processing` | face-swap (→ Fly) / upscale / transcode | `{ swapped_url, thumbnails }` | keyed on job id + step; re-run overwrites |
| `persisting` | upload to Storage, insert `uploads`, `ai_generation_log`, budget | `{ upload_id }` | `uploads` upsert on job id; if present, skip |
| `completed` | terminal; Realtime → client | — | — |
| `failed` / `dead_letter` | retry-from-stage / refund + notify | `{ last_error }` | refund idempotent on job id |

**Resume semantics (the unlock for video/HD):** a worker claiming a job reads `stage` +
`stage_state` and runs **only the current stage forward**. A crash mid-`rendering` on a 4-minute
video re-enters `rendering` and re-attaches to the same `provider_job_id` — it does **not**
re-submit a $0.40 generation. Restart-from-checkpoint is mandatory once stages cost minutes and
dollars.

### 4.3 Lease-based ownership (replaces the stale-recovery sweep)

On claim, a worker sets `lease_expires_at = now() + lease_ttl` (e.g. 90s) and renews it while the
stage runs. The claim RPC only returns rows whose lease is null/expired. **A dead worker's job is
reclaimable the instant its lease lapses** — no separate 5-minute stale scan, no orphaning. Lease
TTL > the longest single non-awaiting operation; renewal covers long provider waits.

---

## 5. The worker fleet

A persistent Deno service on Fly (`services/render-worker/`). Skeleton:

```ts
// Continuous, async-multiplexed consumer. Reuses the _shared scene/prompt engine verbatim
// as stage bodies. No held-connection dispatch, no waitUntil, no 150s wall.

const MAX_INFLIGHT = 32;          // concurrent jobs this machine multiplexes (I/O-bound; tune to mem)
const LEASE_TTL_MS = 90_000;
const inflight = new Set<string>();

// Wake on: LISTEN 'render_jobs' (insert/stage-advance NOTIFY) + a low-freq safety poll (e.g. 10s).
async function loop() {
  for (;;) {
    if (inflight.size >= MAX_INFLIGHT) { await waitForSlot(); continue; }
    const jobs = await claimRenderJobs({ engine: 'fly', limit: MAX_INFLIGHT - inflight.size });
    if (jobs.length === 0) { await waitForNotifyOrTimeout(10_000); continue; }
    for (const job of jobs) void run(job);   // fire into the async pool; do NOT await serially
  }
}

async function run(job) {
  inflight.add(job.id);
  const renew = setInterval(() => renewLease(job.id, LEASE_TTL_MS), LEASE_TTL_MS / 3);
  try {
    while (isNonTerminal(job.stage)) {
      job = await advanceStage(job);   // runs ONE stage, checkpoints, returns updated job
    }
  } catch (e) {
    await failStage(job, e);           // attempt++ + backoff (resume) OR dead_letter (refund+notify)
  } finally {
    clearInterval(renew);
    inflight.delete(job.id);
  }
}
```

- **Concurrency:** `MAX_INFLIGHT` per machine × machine count = total concurrency, bounded above
  by the per-lane capacity caps in the claim RPC (so provider limits are never exceeded).
- **Autoscale:** Fly machine count scales on queue depth (Fly autoscaling, or a tiny controller
  that watches `oldest-queued-age` / depth and calls `fly scale count`). Start with a fixed floor
  (e.g. 2 for HA), scale up under backlog.
- **Graceful shutdown:** SIGTERM → stop claiming, let in-flight stages checkpoint, release leases,
  exit. And because every stage is checkpointed, even a **hard** kill is safe: leases lapse, jobs
  resume elsewhere. Deploys are safe by construction — unlike the current held-connection model.
- **`/healthz`:** liveness (loop alive) — **not** correctness. The queue-smoke canary remains the
  end-to-end correctness check.

---

## 6. Capacity, lanes & backpressure

**Lanes** = provider-capacity pools, each with a live-tunable cap (engine_config):

| Lane | Sized to | Initial cap (engine_config) |
|---|---|---|
| `image` | Replicate/Gemini/GPT account concurrency | `render_cap_image` |
| `video` | video-provider concurrency (scarce, $$$) | `render_cap_video` (small) |
| `face_swap` | face-swap-dual Fly machine count (~10/machine) | `render_cap_face_swap` (= existing heavy rule) |

- **Atomic claim** (`claim_render_jobs`): generalizes migration 275 — per-lane
  `pg_advisory_xact_lock`, `v_limit = LEAST(request, cap − inflight_in_lane)`, `SKIP LOCKED`.
  Over cap → returns 0 → jobs **wait**. No overshoot under concurrent workers.
- **`face_swap` is a sub-lane semaphore:** a job in `post_processing` that needs a dual swap
  acquires a face_swap slot; if none free, it yields (re-queues at `post_processing` with a short
  `next_run_at`) rather than blocking an image slot. Keeps the Fly swap service from being
  overrun independent of image concurrency.
- **Circuit breakers:** per-provider failure counter; on a brownout, trip the lane (hold claims)
  for a cooldown so we don't thundering-herd a struggling provider. Pairs with the existing
  jittered backoff.

---

## 7. Reliability & correctness

- **At-least-once** processing; **every stage idempotent** (job id + stage as the key). Re-running
  any stage from its checkpoint is safe (guards in §4.2).
- **Crash recovery = lease expiry.** No orphaning, no held connection to drop.
- **Retry:** per-stage attempt counter + jittered exponential backoff (keep the
  `[1m,5m,30m,2h]` ladder via `next_run_at`). Permanent errors (NSFW, missing/unreachable cast
  source) → `dead_letter` immediately (no doomed re-render).
- **Dead-letter contract (kept intact):** idempotent `refund_sparkles` (reference_id = job id,
  actual recorded spend only) + flip `dream_jobs` (resolves the client's poll fallback) +
  `dream_failed` notification. All three logged-on-failure, never silent (existing rule).
- **Money is transactional:** charge at enqueue (unchanged), refund on dead-letter (unchanged).
  The state machine never charges — it only refunds on terminal failure.
- **No double-processing during the strangler:** the two consumers claim **disjoint** rows
  (`render_engine='edge'` vs `'fly'`) under `SKIP LOCKED`. Provable non-overlap.

---

## 8. Observability & ops

- **Per-stage timing + provider latency + cost** → extend `ai_generation_log` (stage durations,
  provider, attempt) + structured logs. `dream_forensics` continues to stitch a failure to its
  exact stage/model/error.
- **Fleet metrics** (a `/metrics` endpoint or a periodic writer): queue depth per lane,
  in-flight per lane, **oldest-queued-age**, dead-letter rate, provider-breaker state, worker
  count + saturation.
- **Alerts (fail-loud, GitHub/Sentry):** oldest-queued-age > threshold (backlog forming),
  dead-letter rate spike, breaker tripped, fleet unhealthy, canary failure.
- **Keep the queue-smoke canary** — it now validates the fly engine end-to-end (enqueue → render
  → complete, self-cleaning). This is the real correctness monitor.
- **Success metrics for the migration** (watch during rollout): pickup p50/p99
  (`started_at − created_at`), stage-level p99, resume/retry rate, dead-letter rate, cost/job,
  **and nightly drain-to-empty time** (peak load).

---

## 9. Provider integration

- **Now: poll-multiplexed** (universal). In `rendering`, the worker polls the provider by
  `provider_job_id` on an async timer; because it's I/O-bound the machine holds dozens
  concurrently. Adapters expose `submit()` → handle, `poll(handle)` → {status, artifact}.
- **Later: webhooks for the video lane.** A minute-long video wastes even a cheap slot on a poll
  loop; a provider webhook (Replicate supports it) flips `rendering → post_processing` and
  NOTIFYs the fleet. The worker submits-and-yields (frees the slot), resumes on callback. Add a
  small authenticated webhook receiver (edge fn or a worker route) that only advances the stage +
  NOTIFYs — idempotent on `provider_job_id`. Hybrid: webhook where it pays, poll everywhere else.
- **Provider-agnostic adapters** keep image/video/swap uniform so a new model is a new adapter,
  not a new pipeline.

---

## 10. Client & Realtime

- **Unchanged.** The client subscribes to the same `dream_queue` row via Realtime; `status` is
  derived from `stage` so the loading screen + reveal work as-is.
- **Additive later (video):** a `progress` field (stage %) the client can surface for
  minute-long renders. Small, optional, non-blocking.

---

## 11. What's kept vs deleted

**Kept (ports/reused, not rewritten):** enqueue-dream + charge/refund idempotency; the queue
table + claim + caps (generalized); the `_shared` scene/prompt engine (already Deno — becomes
stage bodies verbatim); face-swap-dual on Fly; Realtime; `ai_generation_log` + forensics; the
monitors + smoke canary.

**Deleted at cutover (Phase 4):** pg_cron worker drive; the per-enqueue kick; `dream-queue-sync.yml`;
`x-worker-sync` mode; the held-connection dispatchers (`dispatchers/create.ts`, `first_dream.ts`);
`RENDER_TIMEOUT_MS`; the edge render entrypoints for the queue path; `waitUntil` dependence; the
5-minute stale-recovery sweep (replaced by lease expiry); the 150s / 256MB ceilings. A large body
of accidental complexity — the proof this is the right cut.

---

## 12. Migration — strangler, safest-first, reversible at every step

The two engines coexist on one table, disambiguated by `render_engine`; enqueue chooses per lane
+ a rollout percentage. Rollback at any phase = flip a lane/percentage back to `edge`.

- **Phase 0 — Foundations (dark, no user traffic).**
  - Schema evolution (§4.1). `claim_render_jobs` RPC (§6). LISTEN/NOTIFY triggers on
    insert/stage-advance. The `render-worker` Fly service skeleton (claim + lease + advance loop,
    stubs for stages). Deploy the fleet at floor size, claiming only synthetic rows.
  - **Exit:** synthetic jobs (`render_engine='fly'`, a test user) traverse the full stage machine
    end-to-end; lease expiry reclaims a killed worker's job; no interaction with live edge traffic.

- **Phase 1 — Port the render into stages.**
  - Lift `_shared` render path into `briefing/submitting/rendering/post_processing/persisting`
    stage bodies. Provider adapters (image + face-swap) in poll-multiplex mode.
  - **Golden-output validation:** run the same input through the edge render and the fly render;
    diff prompt/model/output shape + a human spot-check of images. Must match before any user
    traffic.
  - **Exit:** golden set passes; a test user's real dream renders end-to-end on `fly`.

- **Phase 2 — Route the safest lane (nightly + first-dream).**
  - Free + batch + forgiving. Set `render_engine='fly'` for these at enqueue behind a flag /
    percentage. Edge path stays armed as instant fallback.
  - Watch §8 metrics for several nights (nightly is peak load — this is the real stress test).
  - **Exit:** nightly drains to empty within target; pickup p99, dead-letter rate, resume rate,
    cost all healthy for 3+ nights.

- **Phase 3 — Route paid create/dlt/restyle.**
  - Ramp `render_engine='fly'` percentage on the paid lanes (e.g. 5% → 25% → 100%), watching the
    same metrics + refund correctness. Edge = instant rollback per percentage step.
  - **Exit:** 100% of paid renders on `fly` for 3+ days, clean.

- **Phase 4 — Decommission the old engine.**
  - Delete the edge render queue path + the drainer zoo (§11). Simplify enqueue (no `render_engine`
    branch once edge is gone). Update `QUEUE_WORKERS_REFACTOR.md` to point here.
  - **Exit:** old code paths removed; CI green; canary green on `fly` for a week.

- **Phase 5 — New lanes (the payoff).**
  - **Video lane:** video provider adapter, `video` cap, longer stage tolerances (the state
    machine already handles minutes), webhook progression (§9), transcode/thumbnail in
    `post_processing`, storage/CDN sizing, pricing + cap. **HD:** a model/param on the `image`
    lane. Each is a new lane + adapter + cap + price on a clean base — not a rewrite.

**Rollback:** any phase → set the affected lane's `render_engine` back to `edge`; the old
mechanisms resume. The engines are disjoint, so this is safe mid-flight.

---

## 13. The three locked decisions (rationale + future-swap notes)

1. **State substrate: Postgres durable state machine — NOT Temporal (now).** We own ~80% already
   (queue, claim, caps, breadcrumbs, dead-letter, transactional-with-the-money). Temporal is the
   *canonical* tool for durable long-running workflows and the honest alternative, but it's a
   heavy new dependency + ops surface + programming model for a solo maintainer, and it would slow
   this migration for capability we don't yet need. We keep the stage machine **clean and
   explicit** so a Temporal swap stays a future option if scale demands it. *Trigger to revisit:*
   sustained queue throughput approaching Postgres/`SKIP LOCKED` limits, or workflow complexity
   (fan-out/human-in-the-loop) outgrowing a linear stage machine.
2. **Provider progression: poll-multiplex now, webhooks for video later.** Poll is universal and
   cheap on persistent compute; webhooks are an optimization that pays specifically for
   minute-long video. Start simple + universal; add the webhook receiver with the video lane.
3. **Compute host: Fly.** Incumbent (already runs `face-swap-dual`), clean persistent-machine +
   autoscale + regions, single ops surface. *Alternative considered:* Cloud Run/Fargate — declined
   to avoid a second platform for no benefit at this scale.

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Blast radius = the paid render (money) path.** | Strangler + per-lane `render_engine` flag + percentage ramp + instant fallback; the two engines coexist and claim disjoint rows. |
| **Porting the ~2,500-line render faithfully.** | Reuse `_shared` verbatim as stage bodies; **golden-output diff** (edge vs fly) gates every phase; safest lane first. |
| **New always-on Fly fleet (cost + ops).** | Small floor (HA=2), autoscale on depth; cost modeled per lane; you already operate Fly. |
| **Idempotency bug double-charges/double-renders.** | Charge only at enqueue; stages never charge; every stage idempotent; disjoint claim WHERE + `SKIP LOCKED`. |
| **Postgres as the queue at higher scale.** | `SKIP LOCKED` + LISTEN/NOTIFY scales to thousands/sec; ceiling noted; Temporal is the documented future swap. |
| **Video artifacts (size/cost/CDN).** | Isolated `video` lane with its own cap + pricing + storage/CDN path; can't starve the image lane. |
| **Deploy/restart safety.** | Lease-based ownership + per-stage checkpoints make even hard kills safe (resume, don't restart). |

---

## 15. Open questions to confirm before Phase 0

1. **Fleet floor + autoscale policy:** start HA=2 and autoscale on `oldest-queued-age`, or fixed
   count initially and tune?
2. **`MAX_INFLIGHT` per machine + machine size:** target concurrency per machine (mem-bound by the
   persist step's working set) — start 32 on shared-cpu-1x/1GB and load-test?
3. **Lane cap initial values:** `render_cap_image`, `render_cap_video`, `render_cap_face_swap`
   starting numbers (face_swap inherits the current ~10/Fly-machine rule).
4. **Video provider(s)** to target first (Runway / Pika / Luma / Kling / Replicate-hosted) — drives
   the Phase 5 adapter + webhook shape.
5. **Storage/CDN for video:** stay on Supabase Storage or move large artifacts to R2/S3 + a CDN?
6. **Golden-output tolerance:** exact-match on prompt/model + human image spot-check, or a
   perceptual-diff threshold, as the Phase 1/2 gate?

---

## 16. Appendix — new config knobs (engine_config, live-tunable)

| Knob | Purpose | Initial |
|---|---|---|
| `render_cap_image` | image lane concurrency | tune to provider |
| `render_cap_video` | video lane concurrency | small |
| `render_cap_face_swap` | dual-swap concurrency (Fly) | ~10 × machines |
| `render_worker_max_inflight` | per-machine multiplex ceiling | 32 |
| `render_lease_ttl_ms` | ownership lease | 90_000 |
| `render_engine_rollout` | per-lane edge→fly percentage | 0 → 100 staged |
| `render_provider_breaker_threshold` | failures before a lane trips | tune |

---

## 17. Summary

- **Problem:** minute-scale, expensive, resumable renders on sub-second serverless isolates →
  restart-from-zero, `waitUntil` fragility, a three-mechanism drainer, hard 150s/256MB walls.
- **Fix:** a **durable state machine on Postgres** driven by a **persistent async Fly worker
  fleet** — jobs resume from checkpoints, workers scale horizontally, load is absorbed by the
  queue + per-lane caps, and video/HD become drop-in lanes.
- **How:** strangler migration on one table (`render_engine` discriminator), safest lane first,
  golden-output-gated, instant rollback at every step, then decommission the old engine and add
  the new lanes.
- **Result:** a pipeline that scales horizontally, survives machine death without loss or
  double-charge, and is ready for the "big" tasks — an actual architecture, not a garden of
  isolates.
```
