# Nightly Dream Guarantee — Hardening Plan

**Status:** SPEC (not built). Authored 2026-08-13 after the "michele" incident.
**Goal (non-negotiable):** every eligible Pro/trial user gets a beautiful nightly
dream, every night. A paid customer NEVER wakes up to nothing.

## The incident (root-caused, real)

User `michele` (d3230549…) — an active Pro — got no dream on the night of 2026-08-13.
Forensics:
- Nightly WAS enqueued (`dream_queue` dedup `nightly:…:2026-08-13`). Eligibility fine.
- The render (Flux 1.1 Pro) generated an image the **safety filter flagged NSFW**.
- `generateImage` retried NSFW **2×** — but each retry re-renders the SAME rolled
  brief, so a scene that trips the filter trips it all 3 times.
- The error `nsfw:NSFW_CONTENT` reached `failQueueJob`, which classifies NSFW as
  **`terminal` → immediate dead-letter, NO retry** (`dreamQueueLifecycle.ts:160,169`).
- Result: dead-letter, **no dream, no failure notification, no goodwill sparkle.**
  Her nights 08-08 → 08-12 all completed fine — this was a one-off bad scene roll.

## The root insight

**Nightly is NOT Create.** The "NSFW is terminal / don't retry" rule exists because
re-running a user's FIXED Create prompt re-fails identically. But a nightly brief is
**procedurally re-rolled every invocation** (`rollDream`, payload `{}`). A fresh roll
= a different place/scene/pose/medium = almost never the same flag. So for nightly,
**retrying (with a re-roll) is exactly the fix** — we're currently throwing away the
one lever that works. The in-render NSFW retry re-renders the SAME brief (useless for
a bad roll); what we never do is roll a NEW scene.

## Design: layered defense, guaranteed delivery

Ordered fastest/cheapest → ultimate backstop. Each layer independently reduces misses;
together they make a miss effectively impossible.

### L1 — In-render RE-ROLL on NSFW (not re-render the same brief) [biggest win, cheap]
`nightly-dreams/index.ts`: when the render comes back NSFW, don't just retry the same
prompt — **roll a fresh dream** (new `rollDream`: new scene/pose/medium) and render
that. Loop ~3-4 fresh rolls within the invocation before giving up. Because each roll
is independent, P(all 3 rolls NSFW) is vanishingly small. Delivers the SAME night, no
backoff delay. (Keep `generateImage`'s 2× same-brief NSFW retry as the inner loop.)

### L2 — Provider failover on NSFW
Different providers have different (and differently trigger-happy) safety filters. On
an NSFW flag, before re-rolling, retry the SAME brief on a **different provider**
(Flux → Gemini / GPT-Image). We already have multi-provider `generateImage`; make NSFW
one of the failover triggers, not just a same-provider retry.

### L3 — Source-aware queue policy: nightly NSFW is NOT terminal
`failQueueJob`: gate the `terminal = isNsfw` default on `source`. For `source==='nightly'`,
NSFW (and recoverable render errors) → **retry path**, not dead-letter. Bump the nightly
attempt cap (e.g. 8) and shorten early backoff so a re-queue re-invokes → fresh roll →
new dream, still overnight. (Create keeps today's terminal-NSFW behavior.)

### L4 — Guaranteed-SAFE fallback dream (never nothing)
If L1-L3 somehow can't produce a clean character dream, fall back to a **pure-scene**
dream of the user's own favorite place — people-free, painterly, inherently SFW. We
ALREADY built this (`_shared/sceneFallbackPrompt.ts`, used for cast-swap failures). A
landscape of their place is guaranteed non-NSFW and still beautiful. The invariant
becomes: **a nightly render ALWAYS ships an image — their character, or their place,
never nothing.** Only a total infra outage (all providers down) can reach L5.

### L5 — Daily guaranteed-delivery SWEEP (the ultimate backstop)
New cron (~2-3h after the nightly window, per-timezone aware): find every eligible
Pro/trial user with **no completed nightly dream for `today`** and **re-enqueue** them.
Catches EVERY failure mode at once — NSFW, infra, worker outage, a missed enqueue, a
dead-letter. This is the coverage guarantee: "by morning, 100% of eligible users have a
completed nightly, or a loud alert fires." Mirror of the existing `queue-smoke-monitor`
pattern but for population coverage. Emits a metric: `nightly_coverage = delivered/eligible`.

### L6 — Never-silent + goodwill (only if L1-L5 all fail — should be ~never)
Fix the failure notification to be **source-aware**: a nightly miss sends
`dream_failed` subtype **`nightly_failed`** ("Tonight's dream slipped away — we added a
sparkle") + the goodwill sparkle credit. (Today the NSFW path builds the Create
'rejected' copy and, per michele, didn't fire at all — audit + fix.) And a monitor:
alert Kevin if `nightly_coverage < 100%` on any run.

### L7 — Lower the base NSFW rate at the source
Reduce how often L1 even engages: audit michele's triggering brief (scene/pose/medium),
add SFW-steering to the nightly prompt assembly (avoid the risky combos, positive SFW
guidance — WITHOUT leaking negation into the render, per the prompt-craft rules), and
track `nsfw_flag_rate` in `ai_generation_log` so we can see if a scene/medium is a
repeat offender.

## Build order

1. **L1 + L3** together (in-render re-roll + nightly-not-terminal) — kills ~all misses,
   small diff, highest impact. Ship first.
2. **L4** (safe-scene fallback) — reuse `sceneFallbackPrompt`; the "never nothing" floor.
3. **L5** (coverage sweep cron) — the population guarantee + `nightly_coverage` metric.
4. **L6** (source-aware notify + goodwill + alert) — dignity + compensation on the rare miss.
5. **L2 + L7** — failover + base-rate reduction (lower how often 1-4 engage).

## Immediate remediation (michele, do now)
- Re-enqueue her missed 08-13 nightly (deliver today) — one fresh roll ≈ certainly clean.
- Credit her a goodwill sparkle for the miss.
- (Optional) a short apology note.

## Key files
- `_shared/dreamQueueLifecycle.ts` (`failQueueJob` terminal logic, MAX_ATTEMPTS, notify).
- `_shared/generateImage.ts` (NSFW retry loop `NSFW_MAX_RETRIES`, provider failover).
- `nightly-dreams/index.ts` (render + `rollDream` re-roll point).
- `_shared/sceneFallbackPrompt.ts` (the safe fallback, already built).
- `scripts/nightly-dreams.js` + a NEW coverage-sweep cron + workflow.
- `_shared/classifyFailure.ts` (nsfw classification).
