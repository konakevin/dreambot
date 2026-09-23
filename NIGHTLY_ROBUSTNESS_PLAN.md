# Nightly robustness: couples fail when the swap service is busy

Status: items 1, 2, 3, 6 + 7 LIVE (2026-09-23, migrations 549, 550, 551 + Fly machines warm); items 4, 5 and 6b open. Kevin: "we anticipate eventually getting hundreds of users all
generating their nightly dream at once … can we look into the way the nightly dreams are generated for all
users during the nightly run and see if we can make it more robust and not so damn flakey?"

## What is actually happening (measured, 21 nights 2026-09-03 → 09-23)

1. **Every dual-swap failure happened when 3+ couples started within the same minute.** 1-2 couples
   overlapping: 32 couples, 0 swap errors. 3-4 overlapping: 26 couples, 8 swap errors (31%), 11 degraded to a
   solo (42%). Successful swaps take 20 s median when alone, 41 s when crowded.
2. **The nightly job creates that burst every night.** Users are enqueued at their local 4am, all in ONE
   insert. The 10:17 UTC cohort (America/Denver, 5 users, 4 of them couple-heavy, Kevin included) starts
   together at 10:18. No other hour has more than 1-2 users. Create load tests on 09-21 showed the same
   cliff: 10 couples at once → 10/10 failed; the same 10 spread 3 per minute → 0 failed.
3. **The throttle counts the wrong thing.** The worker caps "heavy" renders (`dream_queue_max_concurrent_heavy`,
   migration 275), but the bottleneck is the Fly `dreambot-face-swap-dual` service: 2 machines,
   `soft_limit 1 / hard_limit 2`, one kept warm, the other auto-started (~9 s cold). The runbook says the heavy
   cap must not exceed ~2× machines; code default is 10; the live value is **3, set by hand during the 09-21
   load test (no migration, no audit)**. Even at 3, 09-22 failed (2 couples + a solo started together).
4. **Nothing coordinates the swap service.** No semaphore, lock or counter anywhere: every render, every
   Create couple, and every solo `/detect` + `/verify` call hits the same 2 machines.
5. **A swap failure is never retried, and it is counted as success.** A `dual_swap_error` (timeout / 503 /
   abort) moves to a full re-render only if the 40 s recover budget still fits inside the `t0+90 s` dual
   deadline, which it almost never does after a 50 s timeout → `recover_budget_exhausted` →
   `dual_degrade_single`. The job is marked `completed` (all 215 nightly jobs "completed"), so it is never
   retried and no monitor alarms (the "Fly saturation" check only logs).
6. **The timeout itself is mostly Replicate, inside Fly.** "Face swap timed out" is Fly's poll loop on the
   Replicate `cdingram` prediction (45 s primary cap). Queued-at-Fly time counts against the edge deadline
   but Fly's own clock restarts at receipt, so the two budgets drift; the swap-model fallbacks need 60 s+ and
   are effectively dead on the dual path. An aborted swap keeps running on Fly.

## Kevin's three recent failures

| night | what failed                                       | cause                                                                                                                                                                                                                     |
| ----- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 09-23 | one face found (`no_dual_split`) → flex re-render | the POSE: "both with arms spread wide and open as if taking in a vast view" (DUAL_ACTIONS_DYNAMIC). Probe: exact replay 3/7 held; same replay with a neutral pose 8/8; same replay with the vibe swapped to peaceful 3/8. |
| 09-22 | Fly timed out after 50 s → solo                   | CAPACITY: 3 swaps in the 10:18 Denver burst.                                                                                                                                                                              |
| 09-19 | the woman's likeness near zero → gemini re-render | chance: the known ~7% one-sided identity miss on soft painted looks. Probe of the same look + vibe: 8/8 held.                                                                                                             |

Not the cause: macabre (painted looks + macabre 22/24 held), the painted looks themselves (control 8/8), or the
cast photos (Kevin's median weaker-side likeness 0.68 over 335 swaps vs 0.64 for other users). Why Kevin sees it
every time: he is in the only couple-heavy burst cohort, so he is exposed to the capacity cliff every night.

Probe, 56 forced flux-1.1-pro couples on Kevin's cast, production composer (`narrative_fg`, honest looks):
replay 3/7 (+1 swap-server 504), neutral pose 8/8, peaceful vibe 3/8, canvas+macabre 6/8 (both misses were
poses: a hand dipped into water below, one person climbing above the other), painted fantasy+macabre bold 8/8,
digital painting+macabre 8/8, painted fantasy+peaceful 8/8.

## Plan (proposed — nightly is the restore point, nothing changes without Kevin's word)

**Principle: a nightly dream is not interactive, so it should WAIT for capacity, never fail over because of it.**

1. **Swap-capacity gate (the core fix).** A DB counting semaphore for the Fly swap service
   (`acquire_swap_slot` / `release_swap_slot`, slots = `engine_config.fly_dual_swap_slots`, lease with TTL so a
   crashed render frees its slot). `dualSwapDispatch` acquires before calling Fly and releases after; it waits
   (short polls) inside the render's budget. Create gets priority (reserved slot) because a user is watching.
   Covers Create, nightly and QA in one place.
2. **Capacity errors retry instead of degrading (nightly).** A `dual_swap_error` that is a timeout / 503 /
   abort / no-slot makes the nightly job fail RETRYABLY (the queue's 1 m / 5 m / 30 m backoff) instead of
   shipping a solo; the solo degrade stays as the last resort on the final attempt. Content failures
   (one face, identity) keep today's re-render path.
3. **Smooth the burst.** Nightly jobs get a `not_before` spread within their hour (e.g. one heavy start per
   20-30 s per cohort), and the claim respects it. Invisible to users (the dream is ready by morning either way).
4. **Alarms that see this.** Nightly couple → solo degrade rate and `dual_swap_error` rate per night, alarming
   (fail-loud) with thresholds derived from config, per the house rule.
5. **Config hygiene.** Record the heavy cap in a migration; derive it from the Fly slot count; update the stale
   runbook lines (QUEUE_WORKERS_REFACTOR.md 255/260).
6. **Fly.** Keep both machines warm during nightly windows (no cold start inside a deadline); fix the edge/Fly
   budget drift so swap-model fallbacks can actually run; scale out by the capacity math below as users grow.
7. **The pose pool (separate, quick).** Remove "both with arms spread wide … vast view" from
   `DUAL_ACTIONS_DYNAMIC`; probe the other wide-arm / bend-down / height-offset beats before touching them
   (one variable per round).

**Capacity math for "hundreds of users":** ~26% of nightly dreams are couples. At 300 users with 40% in one US
time zone, a cohort of 120 → ~30 couples. At 2 concurrent swaps x ~25 s that clears in ~6-7 minutes WHEN
gated; ungated it is the 09-21 load test (10 at once → 10 failures). Each extra Fly machine adds ~2-3 swaps a
minute.

## Built (2026-09-23): items 1 + 2

- **Item 7 (pose):** `action_poses` 3508 disabled (live) and removed from `DUAL_ACTIONS_DYNAMIC` (fallback).
- **Item 1 (gate):** `_shared/swapCapacityGate.ts` + migration 549 (`swap_slot_leases`, `acquire_swap_slot` /
  `release_swap_slot`, service role only). `dispatchDualFaceSwap` takes a slot before calling Fly (waits inside
  the render deadline, max `swap_gate_max_wait_ms`), computes its fetch budget AFTER the wait, and always
  releases. Create = `interactive` (may use the reserved slot), nightly = `batch`. Fail-open. Stamp
  `swap_gate:<mode>:<waitedMs>`.
- **Item 2 (retry):** `genderSafeDualSwap` option `capacityFailure: 'retry_later'` throws
  `SwapCapacityRetryError` on a capacity-class swap error (busy gate, 502/503/504, Replicate timeout, abort)
  instead of re-rendering / degrading. Nightly passes it only for a queued, non-first-dream job with
  `attempt_count < nightly_swap_capacity_retries`; the error carries its stamps into the failure log row, skips
  Sentry, and the worker re-queues with backoff (1m / 5m). Content failures keep today's ladder.
- Both ship INERT: `swap_gate_enabled = false`, `nightly_swap_capacity_retries = 0`. Tests: 25 unit
  (`swapCapacityGate.test.ts`), 6 live-DB (`swapSlotLeases.dbspec.ts`), wiring guards.

## Live (2026-09-23 ~21:00 UTC, migration 550): gate on, nightly capacity retry = 2

Verified live before and after the flip:

- **Create burst** (6 couples through the real queue, 3 at a time): 6/6 held first try, 0 swap errors; in each
  wave two swaps took a slot at once and the third waited (35.4 s and 14.4 s) instead of piling onto Fly.
- **Nightly contention** (3 nightly couples fired at the same instant, batch = 1 slot): all 3 held first try,
  0 swap errors; waits 0.1 s / 3.3 s / 28.7 s; every lease released (`swap_slot_leases` empty after).
- **Retry, direct** (placeholder lease holding the batch slot, nightly couple fired at the edge fn): 500
  `nightly_swap_capacity_retry` after a 41.7 s wait, stamps `dual_swap_error:swap_capacity_busy`,
  `swap_capacity_retry_later`, `nightly_error:nightly_swap_capacity_retry`. No solo shipped.
- **Retry, through the worker** (same setup, job enqueued into `dream_queue`): attempt 0 rolled a flux-1.1-pro
  couple, waited 44.6 s for a slot, failed retryably → re-queued `attempt_count = 1` → claimed again ~1.5 min
  later → `completed` on flux-1.1-pro. Unit-locked in `swapDispatchGate.test.ts` (acquire before Fly, release
  on success / 5xx / throw, busy = Fly never called, disabled + gate error = fail-open).
- **Known side effect:** a retry is a fresh nightly roll, so attempt 1 may roll a solo (it did in the worker
  test). The dream is still a full first-choice render, not a degraded one; pinning the rolled cast across a
  capacity retry is a possible follow-up (production-engine change, needs Kevin's word).
- CI db-tests green (`swapSlotLeases.dbspec.ts` on real Postgres).

Watch the next nightly bursts (10:18 UTC Denver) via stamps: `swap_gate:acquired:<ms>`, `swap_capacity_retry_later`,
`nightly_error:nightly_swap_capacity_retry`, and whether `dual_swap_error` / `dual_degrade_single` disappear.
Rollback: `UPDATE engine_config SET swap_gate_enabled = false, nightly_swap_capacity_retries = 0 WHERE id = 1;`

## Live (2026-09-23 ~21:30 UTC, migration 551): item 3, the burst spread

A time zone's users all come due on the same tick and used to land in one insert with one `created_at`; the
worker claims every job whose `created_at` has passed, so they all started at once. Now job i of n gets
`created_at = now + i * step`, `step = min(nightly_enqueue_spacing_s, nightly_enqueue_max_spread_min * 60 / (n - 1))`
(defaults 30 s, 60 min): a 5-user cohort starts over 2 minutes; 200 users never spread wider than an hour. No
new column and no claim change: the claim already skips future `created_at` (the retry backoff uses the same
mechanism, and `check-dream-queue.js` already excludes future-dated rows from "stuck").

- Both enqueue paths apply the same rule: the pg_cron backstop `enqueue_nightly_dreams` (migration 551, the path
  that actually enqueues most nights) and `scripts/nightly-dreams.js` via `scripts/lib/nightlySpread.js`.
- Tests: `__tests__/lib/nightlySpread.test.ts` (the rule + JS/SQL parity guards),
  `__tests__/db/nightlyEnqueueSpread.dbspec.ts` (the real function on Postgres: 30 s steps, the max-spread
  squeeze, spacing 0 = old behaviour, dedup + dry run).
- Verified live after applying: dry run and a real run both clean (11 due users, all already enqueued today →
  `skipped_dedup`, nothing inserted); the script reads 30 / 60 from `engine_config`.
- Rollback (instant, no deploy): `UPDATE engine_config SET nightly_enqueue_spacing_s = 0 WHERE id = 1;`

## Live (2026-09-23 ~21:14 UTC, no deploy): item 6, both Fly swap machines always warm

Before: machine `48e7551f069358` stayed warm (`min_machines_running = 1`) and `0807dd5f9e1198` was stopped by the
Fly proxy a few minutes after going idle, then cold-started on the next request that needed it. Nightly runs every
hour (each time zone at its local 4am), so the second swap of any overlap, or a Create couple taking the gate's
reserved interactive slot during a nightly swap, paid that cold start inside its deadline.

- Both machines: `fly machine update <id> --autostop=off` (config only, same image, no rebuild).
  `services/face-swap-dual/fly.toml` now says `auto_stop_machines = 'off'` so a future `fly deploy` keeps it.
- Gotchas hit doing it: (a) turning auto-stop off on only the standby is not enough, because the proxy may then
  stop the OTHER machine down to `min_machines_running = 1`; (b) the proxy stopped the standby 2 s after the
  update restarted it (it had not picked up the new setting yet), so it needed a `fly machine start`.
- Verified: both machines still `started` 8+ minutes after the change with no stop event (before, the idle one
  was stopped within minutes).
- Cost: performance-1x 2 GB is $32.19/month at Fly's list price when running 24/7; the standby already ran part
  of each day, so the added cost is below that.
- Not done in this pass (item 6b): the edge/Fly budget drift (Fly restarts its own clock on receipt, so the
  swap-model fallbacks cannot fit). That is a Fly service code change plus an image deploy.
- Rollback: `fly machine update 0807dd5f9e1198 --autostop=stop -a dreambot-face-swap-dual` (and set
  `auto_stop_machines` back to `'stop'` in fly.toml).
