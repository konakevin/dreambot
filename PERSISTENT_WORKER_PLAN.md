# PERSISTENT_WORKER_PLAN.md — a reliable always-on queue drainer

Status: **proposal for review** (2026-07-11). Companion to `QUEUE_WORKERS_REFACTOR.md`
(the queue status-of-record) and `SCALING_HARDENING.md` (the load audit). **No code
written yet** — this is the design so we can land it deliberately.

---

## 1. Why (the problem this fixes)

The dream engine is a long-running-job workload (a render is 30–90s) running on
**serverless edge isolates**, which are built for short request/response. That mismatch
is the root cause of a pile of fragility:

- The worker relies on `EdgeRuntime.waitUntil` to keep an isolate alive after it acks a
  ping — and the platform **dropped `waitUntil` on 2026-06-17**, silently stalling the
  whole queue.
- To survive that, the engine now leans on **three overlapping drive mechanisms**:
  1. `pg_cron` every minute (fast path, uses `waitUntil`).
  2. a per-enqueue "kick" (fast path, uses `waitUntil`).
  3. a GitHub Actions loop every 5 minutes (`dream-queue-sync.yml`) — the only
     `waitUntil`-independent one, because GitHub's runner **holds the HTTP connection
     open** while the worker drains (an actively-awaited inbound request is the one
     reliable edge keep-alive).
- **When `waitUntil` is degraded, #1 and #2 are no-ops.** The only reliable drainer is the
  5-minute GitHub cron → an interactive "Create a dream" can wait **up to ~5 minutes just
  to be claimed** before rendering even starts.

This is a Rube-Goldberg machine compensating for using the wrong compute model. We're
paying a fragility tax **today**, independent of scale.

### The goal
One **always-on, continuous, `waitUntil`-independent** drainer that reduces worst-case
pickup latency from ~5 min to ~seconds and lets us retire the fragile mechanisms — **without
rewriting the render engine.**

---

## 2. The core insight (why this is small and safe)

**The GitHub Actions sync IS the persistent worker — it just runs on a 5-minute cron
instead of continuously.** It already does the correct thing (`dream-queue-sync.yml`): hold
a connection open and call `dream-queue-worker` in `x-worker-sync` mode in a loop, breaking
when the queue reports `processed: 0`.

So the migration is: **take that exact, battle-tested loop and run it continuously on a tiny
always-on machine.** It:

- **Reuses the entire existing worker** — the claim RPC, per-weight caps, dispatchers,
  render path, lifecycle/refund/notify. **Zero new claim or render logic.** The new machine
  is only a *better driver* for code already in production.
- **Is additive and safe by construction.** The queue claim uses `FOR UPDATE SKIP LOCKED`
  + atomic per-weight caps (migration 275), so adding another drainer cannot double-process
  a job or overshoot a cap — it just becomes one more claimant. It runs *alongside* pg_cron
  + kicks + GH-sync with no coordination needed.
- **Has a zero-risk rollback:** `fly scale count 0` on the worker app → the existing
  mechanisms resume full duty. Nothing else changes.

---

## 3. Architecture

```
 phone ──enqueue──▶ enqueue-dream (edge isolate)
                        │ INSERT dream_queue row
                        ▼
                    Postgres (dream_queue)
                        ▲  claim (SKIP LOCKED + atomic caps)
                        │
   ┌────────────────────┴─────────────────────┐
   │  NEW: dreambot-queue-worker (Fly, tiny)   │   ← always-on, continuous
   │  loop: POST x-worker-sync ─(held conn)─┐  │
   └────────────────────────────────────────┼──┘
                                            ▼
                            dream-queue-worker (edge isolate, sync tick)
                                 claims ≤N jobs → dispatchers →
                                 generate-dream / nightly / first-dream (edge isolates)
                                          │ face swap → face-swap-dual (Fly)
                                          ▼ persist → Storage + uploads + queue=completed
                                          ▼ Realtime → phone
```

**What stays exactly as-is:** the queue, the caps, idempotent charge/refund, the render
path, face-swap-on-Fly, Realtime, observability. This migration changes **only the thing
that drives the worker** — from "flaky cron + waitUntil" to "one always-on loop."

**Scope note (Phase 1):** renders still execute in the **edge isolates** (the Fly worker
drives the *edge* worker, which dispatches to `generate-dream`). We are NOT moving render
logic onto Fly yet — that's a much larger change deferred to §9. This phase fixes the
*driver* reliability, which is the acute pain.

---

## 4. The worker itself

A ~40-line Deno service. Two concurrent parts: (a) the drain loop, (b) a `/healthz`
endpoint so Fly can restart it if it hangs.

```ts
// services/queue-worker/worker.ts
// Continuous held-connection drainer. Drives the EXISTING dream-queue-worker edge fn in
// x-worker-sync mode — reuses all claim/dispatch/render/lifecycle logic. Replaces the
// every-5-min GitHub Actions dream-queue-sync with an always-on loop.

const WORKER_URL = `${Deno.env.get('SUPABASE_URL')}/functions/v1/dream-queue-worker`;
const TOKEN = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN')!;
const IDLE_SLEEP_MS = 3000; // poll cadence when the queue is empty
const ERROR_BACKOFF_MS = 5000; // base backoff on a failed tick (jittered)
const TICK_MAX_MS = 135_000; // per-tick hold budget (edge caps its own tick at 120s)

let lastTickOk = Date.now();
let shuttingDown = false;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms: number) => Math.round(ms / 2 + Math.random() * (ms / 2));

// Liveness: Fly's healthcheck hits /healthz; 503 if no successful tick in 60s → Fly
// restarts the machine (catches a hung-but-not-crashed loop).
Deno.serve({ port: 8080 }, (req) => {
  if (new URL(req.url).pathname === '/healthz') {
    const stale = Date.now() - lastTickOk > 60_000;
    return new Response(stale ? 'stale' : 'ok', { status: stale ? 503 : 200 });
  }
  return new Response('not found', { status: 404 });
});

Deno.addSignalListener('SIGTERM', () => {
  shuttingDown = true;
}); // clean deploys

async function tick(): Promise<number> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TICK_MAX_MS);
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'x-worker-sync': '1',
      },
      body: '{}',
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`worker ${res.status}`);
    const { processed } = await res.json();
    lastTickOk = Date.now();
    return typeof processed === 'number' ? processed : 0;
  } finally {
    clearTimeout(t);
  }
}

while (!shuttingDown) {
  try {
    const processed = await tick();
    // 0 = queue drained → brief idle sleep. Anything else (jobs processed, or -1 =
    // hit the tick budget while busy) → loop immediately, there's more to do.
    if (processed === 0) await sleep(IDLE_SLEEP_MS);
  } catch (e) {
    console.error('[queue-worker] tick failed:', (e as Error).message);
    await sleep(jitter(ERROR_BACKOFF_MS));
  }
}
```

Behavior:
- **Actively draining:** as long as a tick reports work (`processed > 0` or `-1` budget-
  capped), it loops immediately → drains at the worker's full capped rate.
- **Idle:** on `processed === 0`, sleep ~3s, then poll again → worst-case pickup ≈ 3s.
- **Errors / worker 5xx / network blips:** jittered backoff, then retry — never spins.
- **Liveness:** `/healthz` 503s if no successful tick in 60s → Fly restarts a wedged worker.
- **Graceful shutdown:** SIGTERM stops the loop after the current tick → clean deploys.

Why drive the *edge* worker instead of claiming from Fly directly: it **reuses the tested
claim + dispatch + render + lifecycle code** (DRY, and the safest possible change). Re-
implementing claim/dispatch on Fly would duplicate load-bearing logic and add risk for no
benefit in this phase.

---

## 5. Infrastructure

**Recommendation: a separate tiny Fly app**, `dreambot-queue-worker` — cleaner than a
process group in `face-swap-dual` because the worker has different sizing, a different
image, and an independent lifecycle. (Process-group alternative noted in §8.)

```
services/queue-worker/
  fly.toml
  Dockerfile
  worker.ts
```

**`fly.toml`:**
```toml
app = 'dreambot-queue-worker'
primary_region = 'iad'          # co-located with the DB + face-swap-dual (low latency)

[build]
  dockerfile = 'Dockerfile'

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false     # MUST stay awake to drain continuously
  min_machines_running = 1
  processes = ['app']
  [[http_service.checks]]
    interval = '15s'
    timeout = '5s'
    grace_period = '20s'
    method = 'get'
    path = '/healthz'

[[vm]]
  size = 'shared-cpu-1x'
  memory = '512mb'               # I/O-bound orchestrator; 512MB is comfortable
```

**`Dockerfile`:**
```dockerfile
FROM denoland/deno:alpine
WORKDIR /app
COPY worker.ts .
RUN deno cache worker.ts
EXPOSE 8080
CMD ["deno", "run", "--allow-net", "--allow-env", "worker.ts"]
```

**Secrets** (set once on the new app):
```
fly secrets set \
  DREAM_QUEUE_WORKER_TOKEN=<same value the edge fn uses> \
  SUPABASE_URL=https://jimftynwrinwenonjrlj.supabase.co \
  --app dreambot-queue-worker
```
The worker auths to the edge fn with `DREAM_QUEUE_WORKER_TOKEN` (the edge fn accepts it or
the service-role key via `timingSafeEqual`). It needs **no** direct DB access in Phase 1 —
it only calls the worker endpoint.

**Cost:** ~**$3/mo** (one always-on `shared-cpu-1x`/512MB). Idle polling adds edge-function
invocations — at a 3s idle cadence that's ≈ **860k/month**, comfortably within the Pro plan's
included 2M (a §9 optimization eliminates even these).

---

## 6. Why this is safe (the guarantees)

1. **Additive.** Runs alongside pg_cron + kicks + GH-sync. `SKIP LOCKED` + atomic caps make
   concurrent drainers safe — no double-process, no cap overshoot (locked by
   `generateImage`/queue tests + migration 275's design).
2. **Reuses tested code.** No new render or claim logic; it drives the exact edge worker
   already in production.
3. **Bounded everywhere.** Per-tick abort (135s) < edge idle ceiling; edge caps its own tick
   at 120s; jittered error backoff; can't spin.
4. **Self-healing.** `/healthz` + Fly restart recovers a hung worker; SIGTERM = clean deploys.
5. **Trivially reversible.** `fly scale count 0 --app dreambot-queue-worker` instantly
   reverts to today's behavior. Nothing else touched.

---

## 7. Rollout (staged, reversible at every step)

- **Phase 0 — ship additive.** Create the app, set secrets, deploy 1 machine. Leave pg_cron,
  kicks, and GH-sync **exactly as they are.** Watch for 24–48h:
  - Worker logs (ticks, processed counts, errors).
  - **Pickup latency** = `dream_queue.started_at − created_at` (should fall to seconds).
  - The existing hourly `queue-smoke-monitor` canary continues to validate end-to-end.
- **Phase 1 — demote the GH-sync.** Once the Fly worker is proven the primary drainer, drop
  `dream-queue-sync.yml` from `*/5` to a rare belt (e.g. `*/30`) or disable it. (This also
  retires the risky "tighten the GH cadence" idea from `SCALING_HARDENING.md` — a continuous
  worker makes it moot.)
- **Phase 2 — optional.** Reduce `pg_cron` cadence; keep the per-enqueue kick (harmless, gives
  instant pickup when `waitUntil` is healthy). End-state: the Fly worker is primary; the rest
  are cheap redundant safety nets.
- **Rollback (any phase):** `fly scale count 0` on the worker → old mechanisms resume.

---

## 8. Decisions to confirm

| Decision | Recommendation | Alternative |
|---|---|---|
| Separate app vs process group | **Separate app** `dreambot-queue-worker` (clean sizing/lifecycle/image) | `worker` process group inside `face-swap-dual` (one deploy, but mixes a non-HTTP worker into the HTTP app + per-process VM sizing) |
| RAM | **512 MB** (~$3/mo) | 256 MB (~$2/mo, works but tight for Deno) |
| Idle poll cadence | **3s** (fast pickup, ~860k edge calls/mo) | 5s (~520k/mo, slightly slower pickup) |
| Keep GH-sync? | **Keep as a `*/30` belt** after Phase 1 | Delete it once the worker is proven |
| Redundancy | **1 worker to start** (Fly auto-restarts it) | 2 workers (~$6/mo) for HA — SKIP LOCKED makes this safe |

---

## 9. Future evolution (explicitly OUT of scope here — noted so the path is clear)

These are the natural next steps *after* this lands; none are required now:

1. **Event-driven wakeup (kill idle polling).** Have `enqueue-dream` + the nightly enqueuer
   `NOTIFY` on insert and the Fly worker `LISTEN` — it wakes only when there's work → zero
   idle edge invocations + instant pickup. Or a cheaper interim: the worker does a tiny
   `SELECT EXISTS(... status='queued' ...)` DB precheck and only fires a sync tick when
   there's work.
2. **Webhook-driven provider polling.** Replace the 30–90s in-render Replicate *poll* with a
   provider webhook → the render isolate submits and dies, and resumes when the provider
   calls back. Frees compute during the wait and removes the 150s-ceiling pressure. Pairs
   naturally with the persistent worker (which can own the resume step). This is the true
   scale-correct async pattern.
3. **Move render orchestration onto Fly.** Longer-term, the worker itself runs the render
   (Sonnet + image + persist), fully escaping edge-isolate 256MB/2s-CPU/150s limits. Bigger
   change; only worth it if edge limits become the bottleneck. Face-swap already lives on Fly.

---

## 10. Summary

- **Problem:** long-running renders on serverless → `waitUntil` fragility → a 3-mechanism
  Rube-Goldberg drainer → up to ~5 min pickup latency when the platform flakes.
- **Fix:** run the *already-trusted* GitHub-sync loop continuously on a **tiny ~$3/mo
  always-on Fly machine**. Reuses the entire render engine; additive; trivially reversible.
- **Result:** reliable continuous draining independent of `waitUntil`; ~5 min → ~seconds
  pickup; a clean foundation we can later evolve (webhooks, event-driven wakeup) instead of a
  workaround we fight.
- **Effort:** ~3 small files + a Fly app + 2 secrets + a staged, reversible rollout. No engine
  rewrite.
