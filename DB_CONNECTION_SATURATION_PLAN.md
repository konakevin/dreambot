# DB Connection Saturation — Incident Analysis & Remediation Plan

**Status:** DRAFT for Kevin's review · **Author:** Claude · **Date:** 2026-08-25
**Severity:** HIGH — intermittently takes the entire app non-responsive.
**Related:** `project_db_unhealthy_connection_saturation` (memory), migrations 372 / 381 / 441,
`scripts/check-db-health.js`, `.github/workflows/db-health-monitor.yml`.

---

## 1. Executive summary

The app periodically goes **non-responsive for a few minutes, then self-recovers.** Root cause is **Postgres
connection-pool headroom exhaustion**, not a code leak and not a Supabase outage. On our **Small compute
instance (`max_connections = 90`)**, Supabase's own internal services already consume **~56 connections at
rest (~62%)**, leaving only **~34 connections of burst headroom**. When a burst of load lands — a busy agent
producing renders + seeding pools, the top-of-hour cron pile-up, the nightly enqueue, real traffic — total
connections cross 90, the pool saturates, every query queues, and the app appears dead until the burst
drains. It has recurred repeatedly and is currently a live problem.

**The fix is a combination of demand throttling (immediate), a real headroom increase (structural), and
closing the mid-incident observability gap.** Details in §7.

---

## 2. Problem statement

- **Symptom:** the app intermittently stops responding (feed won't load, actions hang), for ~5–15 minutes,
  then recovers with no intervention. It keeps happening.
- **Blast radius:** total — all data reads/writes go through Postgres, so a saturated pool freezes the whole
  app. Auth and Storage keep working (separate services), which is a key diagnostic tell.
- **Collateral:** DB-dependent cron jobs fail during the window and email GitHub Actions failures (this is
  what surfaced the 2026-08-25 incident).
- **Why it's been hard to pin:** it self-heals, so by the time anyone looks, the DB is healthy again. And
  when it's saturated, the monitoring/forensics that would explain it **can't run either** (see §6).

---

## 3. Evidence — the 2026-08-25 08:00–08:14 UTC incident

Reconstructed from the `db_health_log` forensics table (migration 372, snapshotted every minute by pg_cron)
and GitHub Actions run logs.

### 3.1 Connection timeline (snapshots, `total/90`)

```
07:43–07:52   25–31/90   postgrest ~4     (quiet, at rest)
07:53         51/90      postgrest 28     ← load burst begins, PostgREST pool scales 4→28
07:53–08:03   49–59/90   postgrest 28     ← sustained high, ~30–40 idle held open
08:00         59/90      postgrest 28, pg_cron 4   ← nightly-cron window, peak measured
08:03         56/90
08:04–08:13   ── SNAPSHOT BLACKOUT ──     ← pg_cron itself could not run: DB refusing connections.
                                             The actual >90 saturation happened HERE, unmeasured.
08:14         41→50→58/90                 ← recovery; backed-up snapshots flush
08:15+        56–58/90                    ← back to the tight baseline
```

### 3.2 What consumes the ~56 baseline (steady state, from the peak snapshot)

| Consumer | Conns | Notes |
|---|---:|---|
| **PostgREST** | **31** | The REST API pool. Serves the app, all scripts, AND edge functions. Scales 4→31+ under load. |
| Realtime (all roles) | ~13 | `realtime_connect`, `_rls`, `_subscription_manager`, replication, etc. |
| Internal / local `(unknown)` | 8 | Unix-socket platform internals. |
| Supabase Storage API | 2–4 | |
| pg_cron + scheduler | 2–4 | Includes the health-snapshot job. |
| postgres_exporter, pg_net | ~2 | Metrics + webhooks. |
| **Total at rest** | **~56/90** | **~34 free.** |

### 3.3 Confirmed NON-causes (ruled out with data)

- **Not a Supabase outage.** status.supabase.com shows Database + Connection Pooler **Operational**; Auth
  (95ms) and Storage (115ms) stayed fast throughout — only Postgres/PostgREST choked.
- **Not a transaction/connection leak.** `idle_in_transaction = 0` in every snapshot; migration 441 already
  set `idle_in_transaction_session_timeout = 5min` on all roles.
- **Not a stuck runaway query.** The one alarming-looking `longest_active ≈ 28h` session is **Realtime's
  logical-replication slot** (`START_REPLICATION SLOT supabase_realtime_messages_...`), which is supposed to
  stay open forever. Benign.
- **Not the idle reaper failing.** Migration 381 set `idle_session_timeout = 10min`; idle counts are held
  connections from live poolers (PostgREST/Realtime keeping warm), not forgotten sessions.

### 3.4 The failed GitHub jobs (the emails)

| Run | Job | 08:xx | Meaning |
|---|---|---|---|
| 32825047377 | **DB Health Monitor** | 08:07:56 | **Worked as designed** — failed loud because its forensics read timed out ("DB may be refusing connections RIGHT NOW"). The alert. |
| 32824837579 | Nightly Coverage Sweep | 08:05:31 | Collateral — DB-dependent job timed out in the window. |
| 32825183540 | Refund Stuck Dream Jobs | 08:09:33 | Collateral — same. |

Also notable: the **Bots Dispatcher run at 07:58 took 16m17s** (normal ~11m) — DB was already slow, and that
long heavy run overlapped the saturation window, compounding it.

---

## 4. Root-cause analysis

### 4.1 The mechanism

1. **Everything routes through PostgREST.** `lib/supabase.ts` (app), every `scripts/*.js` (supabase-js), and
   the edge functions (`createClient(url, serviceKey)`) all hit the REST endpoint. So app traffic + cron
   scripts + a busy agent's seeding + every render's edge-function DB work **share one PostgREST pool**, and
   that pool **scales up its Postgres connections under concurrency** (measured: 4 idle → 31 under load,
   higher during the blackout).
2. **Baseline is chronically high.** Supabase's own services eat ~56/90 at rest. (The 2026-07-18 forensics
   note said PostgREST idled at ~3–4; it now sits pinned at ~31 — the baseline has crept up materially,
   eating the headroom the compute upgrade to 90 was supposed to buy.)
3. **Bursts cross the ceiling.** With only ~34 free, overlapping demand tips it over 90:
   - a **busy agent producing renders** (each render = an edge-function invocation holding DB connections for
     20–150s) **and bulk-seeding pools** (many INSERTs) — the confirmed trigger for the current episodes;
   - the **top-of-hour cron collision** (see §4.2);
   - the **~08:00 nightly enqueue**;
   - organic app traffic.
4. **Saturation → queue → "dead" → self-heal.** Past 90, new connections are refused / queries queue behind
   the pool; the app hangs. When the burst ends, connections free and it recovers. No permanent damage, no
   fix applied — so it recurs.

### 4.2 The cron collision (a compounding, fixable factor)

At **:00 of every hour**, these all fire together, several of them DB-heavy:

```
bots-dispatcher        */15   (:00, :15, :30, :45)   — 11–16 min, heavy (reads schedules, triggers renders)
db-health-monitor      */5
dream-queue-sync       */5
refund-stuck-jobs      */5
display-variant-backfill */10  (:00, :10, :20, …)
upscale-sweep          */10
+ nightly enqueue near 08:00
```

Six-plus jobs converge at :00, led by the 16-minute bots dispatcher, precisely when headroom is already
thin. This is self-inflicted burst amplification and is trivially staggerable.

### 4.3 Why the "busy agent" is the trigger, not the disease

The agent seeding pools + producing renders is doing exactly what saturates a tight pool: **sustained
concurrent DB work + render bursts.** But it's only able to take the app down **because the headroom is so
thin to begin with.** My own earlier QA render burst (firing renders directly at `nightly-dreams`) did the
same thing. **Any** heavy concurrent workload — an agent, a QA sweep, a traffic spike — will keep tripping
this until the structural headroom problem is fixed. The agent is the match; the thin headroom is the
tinder.

---

## 5. What's already in place (and why it's insufficient)

| Mechanism | Migration / file | What it does | Gap |
|---|---|---|---|
| Connection forensics | 372, 381 (`capture_db_health`, `admin_db_connections`) | Per-minute snapshot of connections by state/app/client into `db_health_log`. **Excellent** — it's how this whole timeline was reconstructed. | Can't snapshot *during* saturation (pg_cron locked out → the blackout). The peak is unmeasured. |
| Idle-session reaper | 381 | `idle_session_timeout = 10min` | Targets forgotten idle sessions; not the cause (bursts are active, not forgotten). |
| Idle-in-txn guard | 441 | `idle_in_transaction_session_timeout = 5min` all roles | Targets transaction leaks; confirmed not the cause (`idle_in_txn ≈ 0`). |
| DB Health Monitor | `db-health-monitor.yml` (*/5) + `check-db-health.js` | Fails loud at onset (connection %, staleness, leaks). | **Alerts but can't mitigate**, and its own forensics read is locked out mid-incident. |
| Compute | Supabase Small | `max_connections = 90` | The baseline (~56) leaves only ~34 headroom — the core problem. |

**Summary:** we have great *detection and leak-prevention*, but nothing that adds *headroom* or *throttles
demand*, which is what this incident class actually needs.

---

## 6. The observability gap

When the pool saturates, the pg_cron snapshot job **and** the DB Health Monitor's forensics read **both get
locked out** — so the exact moment of failure (what pushed it past 90, which client, which queries) is
**never captured.** We only ever see "healthy at 08:03 → blackout → healthy at 08:14." Closing this gap is
part of the plan (§7, Tier 3): the snapshot writer must be able to get a connection even when the app pool
is exhausted (superuser reserved connections), and/or an out-of-band probe must capture the peak.

---

## 7. Remediation plan

Three tiers. Tier 1 is doable today in-repo with zero infra change; Tier 2 is the real structural fix
(needs your call on infra/cost); Tier 3 makes the next incident fully diagnosable.

### Tier 1 — Demand discipline + guardrails (immediate, in-repo, no infra)

**T1.1 — Throttle heavy agents/scripts (biggest immediate lever).**
Render bursts are the killer. Establish a hard rule and enforce it in the render/QA/seed tooling:
- **Cap concurrent renders at ≤3** (ideally serialize) with small gaps, for any agent/QA/seed workflow.
- **Batch seed writes** (chunked bulk INSERT, not per-row loops).
- Route bulk QA renders through the **`dream_queue`** where possible — it already enforces per-weight
  concurrency caps (heavy=10, light=40), so it bounds connection pressure; direct edge-fn invocation does
  not.

**T1.2 — A pool-headroom guard helper (new).**
Add `scripts/lib/poolHeadroom.js` — reads the latest `db_health_log` row and returns
`{ total, max, headroom }`. Heavy scripts/agents call it before a burst and **back off / sleep when headroom
< threshold** (e.g. < 20). Cheap, self-governing, prevents this class of incident from any future busy
agent (including my QA). Optionally expose it as a one-liner (`node scripts/check-pool-headroom.js`) that
exits non-zero when tight, so it can gate CI/agent steps.

**T1.3 — De-conflict the cron collision.**
Stagger the top-of-hour pile-up so DB-heavy jobs don't all fire at :00 alongside the 16-min bots dispatcher
and the nightly enqueue. Concretely: move `display-variant-backfill`, `upscale-sweep`, and the `*/5` jobs to
offset minutes (e.g. :02, :07), and consider shifting the bots dispatcher off :00. Removes self-inflicted
amplification. (Pure `.yml` edits.)

### Tier 2 — Structural headroom (the real fix; needs your infra decision)

**T2.1 — Bump compute Small → Medium (highest-confidence fix). +$45/mo (~$15 → ~$60).**
Medium: **90 → 120 direct connections** (headroom ~34 → ~64, nearly double), **2 GB → 4 GB RAM**, more CPU
(so renders/queries finish faster → connections release sooner), and pooler clients 400 → 600. Directly
restores burst headroom; simplest and most reliable. **Recommended as the primary structural fix.** (Note:
the direct-connection gain is modest at +30; if the baseline keeps creeping, pair with T2.2/T2.3. But the
+2 GB RAM + CPU is a real capacity bump on its own, and $45/mo is trivial against app-down incidents.)

**T2.2 — Put direct-connection consumers on the Supavisor transaction pooler (port 6543).**
The app + scripts already go through PostgREST (itself a pool), so they're partially insulated — but any
consumer that opens a **direct** Postgres connection (session mode) should move to the **transaction-mode
pooler**, where short queries share a tiny connection set instead of each pinning a backend. Audit which
paths use direct connections (edge functions, any agent using a connection string, `db-direct-probe.js`) and
move them. Reduces the non-PostgREST footprint under load.

**T2.3 — Cap PostgREST's pool (`db-pool`) so it can't starve the others.**
PostgREST scales to ~31+ under load; if its `db-pool` max is set high relative to `max_connections` minus
the Realtime/Storage/internal floor, a REST burst alone can saturate. Setting a deliberate `db-pool` ceiling
makes PostgREST **queue requests internally** (slightly slower under burst) instead of exhausting Postgres
(app-wide freeze). A safer failure mode. Needs Supabase project config + load validation.

### Tier 3 — Make the next incident fully diagnosable (observability)

**T3.1 — Guarantee the snapshot writer survives saturation.**
The health-snapshot job must capture the *peak*. Options: run it as a role with access to
`superuser_reserved_connections` (Postgres reserves slots the app pool can't touch), and/or add an
**out-of-band external probe** (a GitHub Action on a tighter cadence that calls the `admin_db_connections`
RPC through a reserved path and logs the result even when the app is frozen). Goal: never have a blackout in
the forensics again.

**T3.2 — Trend + alert on headroom, not just onset.**
We already fail-loud at onset. Add a slow-burn signal: alert when **rest-state baseline** creeps up (e.g.
7-day avg `total_conn` rising) so we catch "the baseline crept from 24 to 56" *before* it becomes incidents.
This is what silently changed since the 2026-07-18 root-cause.

**T3.3 — Auto-mitigation (optional, later).**
A guarded action that, on sustained saturation, terminates the oldest non-critical idle connections (never
Realtime/replication) to buy headroom — only after T1/T2 prove insufficient. Lower priority; T1+T2 should
prevent reaching this.

---

## 8. Recommended sequencing

1. **Today (I can do in-repo, pending your go):** T1.1 (throttle rule + wire it into the QA/seed tooling),
   T1.2 (headroom-guard helper), T1.3 (stagger crons). These stop the bleeding — a busy agent won't be able
   to take the app down.
2. **This week (your infra call):** T2.1 (compute bump — the durable fix) and/or T2.3 (PostgREST db-pool
   cap). T2.1 is the single most effective move.
3. **Follow-up:** T3.1 (kill the forensics blackout) + T3.2 (baseline-creep alert) so the next occurrence is
   fully explained and we see it coming.

**My recommendation if you want the smallest set that actually fixes it:** T1.1 + T1.2 (contain the agents)
**and** T2.1 (compute bump). Those two together eliminate both the trigger and the tinder.

---

## 9. Open questions / to verify before executing

- **Compute cost** of Small → Medium — your call on the tradeoff.
- **Actual PostgREST `db-pool` setting** (Supabase dashboard → Settings → Database) — confirms whether T2.3
  applies and what the safe ceiling is.
- **Does any edge function or agent open a *direct* Postgres connection** (vs REST)? Determines T2.2 scope.
  (App + scripts are REST via supabase-js; edge fns appear to be REST too — needs a confirming grep.)
- **The busy agent's render concurrency knob** — where it fires renders, so we can cap it precisely (T1.1).
- **Why PostgREST baseline crept 4 → 31** since 2026-07-18 — more sustained traffic, more edge-fn load, a
  config change, or more concurrent scripts? Worth understanding so it doesn't creep again after a compute
  bump.

---

## 10. Appendix — key raw data

`max_connections = 90` · baseline `total_conn ≈ 56` · headroom `≈ 34` · `idle_in_transaction ≈ 0` ·
`longest_active` = Realtime replication slot (benign) · snapshot blackout 08:04–08:13 UTC.

Peak by_application (08:00): `postgrest:28, (unknown):8, realtime_*:~13, Storage:4, pg_cron:4, pg_net:1,
exporter:1`.
Peak by_client_addr (08:00): `::1:36 (internal), (local):8, 127.0.0.1:3, 2 external IPv6 clients @ 6 each`.

Forensics source: `db_health_log` (migration 372/381), queried live 2026-08-25. Monitor:
`scripts/check-db-health.js` + `.github/workflows/db-health-monitor.yml`.
