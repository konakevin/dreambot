# SCALING_HARDENING.md — render engine load audit + plan

Audit date: **2026-07-11**. Trigger: a burst of parallel nightly renders produced a
string of `dream_failed` "sparkle refunded" notifications; owner concerned the engine
tips over under load (10 / 20 / 100 / 1000 concurrent). Method: 5 parallel subsystem
deep-dives (queue/worker, render edge fns, Fly face-swap-dual, providers, enqueue/Postgres)
cross-referenced against live forensics (`dream_queue`, `ai_generation_log`, `notifications`,
`engine_config`). **No code changed — this is the report.**

---

## TL;DR

- **The queue is sound and crash-safe.** `dream_queue` + the atomic per-weight cap
  (`claim_dream_queue_jobs_by_weight`, migration 275) genuinely prevents a concurrency
  stampede: past the cap, jobs **queue and drain, they do not 546/crash**. No double-claim,
  no cap overshoot. Verified.
- **The failures were per-render TIMEOUTS, not a system crash.** Dominant failure signature
  over 72h: `Generation timed out` / `hard_fail:timeout` (**24 of 68 failures**), plus
  **OpenAI "Billing hard limit reached" (13)**, Gemini 5xx (4), one storage-upload, one
  dual-no-split.
- **The live heavy cap is correctly 10** (NOT the mis-documented 15). So the cause was
  **not** a misconfigured cap — it's that **10 is the tested ceiling of ONE underpowered
  Fly machine (2 GB / 1 vCPU), run with zero headroom**, plus several provider-handling
  fragilities that convert any slowdown into timeout clusters.
- **Text (light) dreams scale fine** (40 concurrent, ~6000/hr). **Face-swap (heavy) is the
  bottleneck**: ~10 concurrent, ~480/hr, ~2 h to drain 1000 nightly. That's the whole story.
- **546/OOM does NOT get worse with concurrency** (Supabase edge limits are per-request;
  heavy pixel work runs on Fly or is deferred). Reassuring.

**One-line diagnosis:** the bouncer (queue) caps the club at 10 so it never gets crushed,
but there's one overworked bartender (a single Fly machine). At 10 face-swaps at once, some
orders time out and those customers leave (fail + refund). Fix = more bartenders + don't let
a slow supplier (provider) freeze an order for 90s.

---

## What actually happened (forensics)

- Owner's notification string: **7 consecutive `dream_failed` "couldn't render — sparkle
  refunded"** on 07-10 ~07:37–08:39 UTC, interleaved with successes.
- `ai_generation_log` failures, last 72h (68 total):
  `TIMEOUT 24 · OPENAI_BILLING 13 · other 20 · UNKNOWN 5 · GEMINI_5XX 4 · STORAGE_UPLOAD 1 · DUAL_NO_SPLIT 1`.
- Timeout rows span both light (`flux-krea-dev`, `flux-dev`, `flux-schnell`) and dual
  (`resolved=self+plus_one`) — pointing at the **Replicate poll phase** (below) + Fly CPU
  contention, not a single subsystem.
- Live `engine_config`: `dream_queue_max_concurrent=40`, `..._heavy=10`,
  `dream_queue_max_jobs_per_tick=10`, `nightly_max_jobs=5000`, `nightly_enabled=true`.

---

## What the queue protects — and what it doesn't

**Protects (verified safe):** concurrency overshoot, double-claim, per-isolate 546/OOM under
burst, catastrophic meltdown. Past the cap, jobs queue; a 1000-job nightly burst drains
slowly (~2 h) **without dead-lettering**.

**Does NOT protect:** an individual render from **timing out** while running *at* the cap on
an under-provisioned machine, or from a **provider brownout** (429/5xx/slow) — those surface
as a **wave of refunds**, not a crash. The cap holds you at the Fly machine's tested ceiling
with no margin, so any extra pressure (large Ultra outputs, a slow provider, a cold start)
pushes some of the 10 in-flight renders past their deadline.

---

## Current capacity ceilings (the math)

| Path | Concurrency | ~throughput | 1000-job drain |
|---|---|---|---|
| **Light (text)** | 40 | ~6000/hr | ~25 waves, fast |
| **Heavy (face-swap)** | **10** (1 Fly machine) | **~480/hr** | **~2 hours** |

- Heavy is bounded by **one** `face-swap-dual` machine (`min_machines_running=1`, **no**
  `fly scale count`, so exactly 1). Load test: **heavy=10 clean, heavy=15 exhausts/OOMs it**.
- `auto_start_machines=true` does NOT autoscale — it only starts machines that already exist
  (there's only 1). A burst piles entirely onto machine #1.
- Face detection + pixel work run **single-threaded on 1 vCPU**, so 10 concurrent swaps
  time-share one core → each slows → some cross their 60s swap deadline → timeout.

---

## Prioritized failure points

| # | Sev | Issue | Where | Bites at |
|---|-----|-------|-------|----------|
| P0a | HIGH | **Single Fly machine, heavy cap 10 = zero headroom.** Only lever for real face-swap capacity is more machines. | `services/face-swap-dual/fly.toml` (`min_machines_running=1`, 2 GB/1 vCPU) | ~10 concurrent heavy |
| P0b | HIGH | **Heavy-cap CODE default is 15** (live row is 10, but a reset/fresh env falls to 15 = the exhaust value). Latent landmine. | `_shared/engineConfig.ts:81`, migration `265:31` (DEFAULT 15); `275` COALESCE `,10)` is dead code | On any config reset |
| P1a | HIGH | **Replicate poll phase has no failover + no fail-fast.** A slow/throttled poll ignores `pollRes.ok` and burns the full ~90s, then throws `Generation timed out`. **Prime cause of tonight's timeouts.** | `_shared/generateImage.ts:397-418` | Any provider slowness; worse at 100+ |
| P1b | HIGH | **OpenAI billing hard limit hit** → 13 failures. Provider account cap, not load. | forensics; `dream_queue` dead_letter | Immediately (ops) |
| P1c | HIGH | **Interactive claim latency gated by `waitUntil`.** pg_cron tick + enqueue kick both run in `EdgeRuntime.waitUntil` (dropped 2026-06-17); if degraded, only the 5-min GitHub sync drains → Create waits up to ~5 min to even be claimed. SPOF. | worker `index.ts:462-477`; `enqueue-dream:157,345` | Any load during a waitUntil outage |
| P2a | MED | **No jitter on ANY backoff** → synchronized retry waves re-throttle providers (thundering herd). | `llm.ts:33`, `generateImage.ts:67,351`, worker `index.ts:43` | 100+ |
| P2b | MED | **Vision (Haiku) has zero retry** → one 429 kills dual gender classification → silent degrade-to-solo or fail. Anthropic throttles first. | `_shared/vision.ts:86-90` | Anthropic burst |
| P2c | MED | **No AbortSignal inside render fns** → a hung provider blocks to the 150s gateway → 504 reaps the isolate → queue row orphaned `in_progress`, recovered only by 5-min sweep. | `restyle-photo`, `dispatchers/nightly.ts:64`, `first-dream-render` (none) | Provider slowness |
| P2d | MED | **No per-provider concurrency limiter.** Anthropic (Sonnet briefs + all Haiku vision) share one account bucket; per-*weight* cap can't protect a per-*provider* limit. ~55 concurrent renders → 150+ Anthropic calls/sec. | no limiter anywhere in `_shared/` | 100+ |
| P2e | MED | **Cold-isolate DB read amplification.** Config caches are per-isolate; a spiky burst = mostly cold isolates → each render re-runs ~10–20 SELECTs → 1000 cold isolates = 10k–20k reads on one Postgres. | `engineConfig.ts:100` (no TTL) + per-render reads | 100–1000 |
| P3a | LOW | **No global spend cap / circuit breaker.** Retry storms re-incur provider cost ~5× per failing job (user refunded); the **bots path bypasses the queue caps** entirely. | global; `scripts/run-bot.js`, `iter-bot.js` | Outage / runaway |
| P3b | LOW | **Interactive vs nightly share the same 10 heavy slots.** An overnight nightly drain can starve a daytime Create burst and vice-versa. | caps are global | Overlapping load |
| P3c | LOW | **Queue-path charge fails OPEN** (renders free if `charge_sparkles` throws) — safe only while the enqueue-charge invariant holds. | `generate-dream:552-564`, `restyle-photo:279-290` | If enqueue charge regresses |

---

## The plan (ranked; do top-down)

### Tier 0 — before ANY real load (cheap, high impact)
1. **Align the heavy-cap default 15 → 10** (`engineConfig.ts:81` + migration 265 column
   default) so a config reset can't silently over-admit into the single Fly machine. [P0b]
2. **Replicate poll-phase fail-fast + failover** — check `pollRes.ok`; on repeated poll
   429/5xx, abort early and cross-provider-fallback instead of eating 90s. Directly attacks
   the dominant timeout. [P1a]
3. **Raise / monitor the OpenAI billing cap** (ops) — 13 failures were pure billing-limit. [P1b]
4. **Jitter every backoff** (`delay * (0.5 + random*0.5)`) in `llm.ts`, `generateImage.ts`,
   worker. Kills thundering-herd waves. [P2a]
5. **Give vision its own retry ladder** (mirror `llm.ts`). [P2b]

### Tier 1 — raise the real ceiling (costs $, needed to grow)
6. **`fly scale count 2–3` on `face-swap-dual`, THEN set heavy cap = `10 × machines`.**
   Fly first, cap second (runbook order). This is the ONLY lever that lifts real face-swap
   throughput. Consider **4 GB / 2 vCPU** per machine to absorb Ultra-output spikes + CPU
   contention, and add `[http_service.concurrency] hard_limit=10` so a machine sheds at the
   proxy instead of OOMing (and soft_limit can trigger real autoscaling once N>1). [P0a]
7. **Per-provider concurrency limiter** (token bucket keyed in `engine_config`) — shape
   traffic before it 429s; Anthropic is the shared bottleneck. [P2d]
8. **AbortSignal (~110s hard deadline) inside every render fn** — clean `failQueueJob`
   instead of a 504 orphan waiting 5 min. [P2c]

### Tier 2 — reliability + cost hardening
9. **Reduce the `waitUntil` SPOF** — tighten GH `dream-queue-sync` 5 min → 1–2 min, or add
   a small always-warm drainer (Fly) that long-polls the queue. [P1c]
10. **Cut cold-isolate read amplification** — fold per-render config reads into one RPC / one
    cached blob; give `engineConfig` a short TTL. [P2e]
11. **Global + per-account spend circuit breaker** (rolling provider-spend counter with a
    kill-switch); cap dead-letter re-render spend; bring the bots path under a limiter. [P3a]
12. **Separate interactive vs nightly capacity** (reserved slice or a 3rd weight class). [P3b]
13. **Raise `dream_queue_max_jobs_per_tick` 10 → ~20** so pg_cron alone can near-saturate the
    light cap without depending on `waitUntil`. [P1c]
14. **Assert the enqueue-charge invariant** before the queue-path fail-open render. [P3c]

---

## Reassurances (things that are genuinely fine)
- The queue/cap machinery is correct: no double-claim, no overshoot, clean backpressure,
  bounded wall-time, drains-not-dead-letters under big backlogs.
- 546/OOM is per-request and does **not** worsen with concurrency; base64 is kept out of the
  swap pipeline; the heaviest pixel work is on Fly (2 GB) or deferred off-isolate.
- Users are never double-charged (idempotent charge on `job_id`, idempotent refund on
  `reference_id`).
- Nightly at 1000+ users is architected for an invisible overnight drain (paginated enqueue,
  idempotent `dedup_key`, non-interactive).

## Evidence index
- Live caps: `engine_config` (heavy=10, light=40, per_tick=10). Forensics: `ai_generation_log`
  72h failure histogram; `notifications` (recipient_id) 7× `dream_failed`.
- Queue/claim: `supabase/migrations/275_atomic_claim_cap.sql:19-83`; worker
  `supabase/functions/dream-queue-worker/index.ts:99-165,462-477`.
- Fly: `services/face-swap-dual/fly.toml:20-36`, `src/faceDetect.ts:35-38`,
  `src/faceSwap.ts:849,973,1028-1030`; `QUEUE_WORKERS_REFACTOR.md:250-257`.
- Providers: `_shared/generateImage.ts:343-364,397-418`; `_shared/llm.ts:33,116-123`;
  `_shared/vision.ts:86-90`.
- Render path: `generate-dream/index.ts:1620-2174,2385-2415`; `dispatchers/create.ts:39,60`;
  Supabase edge limits (2s CPU, 250 MB, 150s idle, ~5000 nested calls/min).
- Heavy-cap default landmine: `_shared/engineConfig.ts:81`, `migration 265:31`, `275:44`.
