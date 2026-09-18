# Nightly fallback chain v2 — design (Kevin, 2026-09-18)

**Status: DESIGN for approval. Nothing built.** Supersedes the chain in `NIGHTLY_FALLBACK_CHAIN_LEDGER.md` §5c.

## The chain (Kevin's words)

One scene per night. Every rung is a FRESH render of that same scene. At most one couple scene or one single
scene is ever rolled; a later rung that needs the other surface composes it from the same scene.

| rung | couple night | single night |
|---|---|---|
| 1 | flux-1.1-pro couple | flux-1.1-pro single |
| 2 | 50/50 single or couple, on a 50/50 gemini-2-image / flux-2-flex roll, same scene | single on the gemini / flex roll, same scene |
| 3 | flux-1.1-pro single, same scene | pure scene, same place, people-free |
| 4 | single on a FRESH gemini / flex roll, same scene | |
| 5 | pure scene, same place, people-free | |

(Revised by Kevin 2026-09-18 ~04:20 UTC from the first table: rung 2 rolls the SURFACE as well as the model, rung 3
resets to a flux single, rung 4 rolls the model again. Every roll is stamped and pinned so a resumed job never
re-rolls a rung it already started.)

A rung = one render + one swap attempt (dual or single) + the checks that exist today (gender + side read,
identity 0.35, composition gate 0.35). No rung re-renders on its own: the pipeline's inner attempts, the
reuse-single, the guard's re-render, the rebuild retries and the floor rescue all go away. The rung table IS
the ladder.

## Same scene across rungs

`runCharacterSlotPipeline` calls Sonnet once (the scene text); everything after it is deterministic assembly
(`reassembleForModel(slots, input, model)` for couples, the solo-from-dual composer for singles, the
scene-only prompt for the pure scene). So the pin is the pipeline's OUTPUT + INPUT, written once, right after
Sonnet, before render 1:

```
dream_queue.payload.chain = {
  v: 1, rung: 1, hops: 0,
  castRole, slots, slotInput,                 // the scene; both already JSON (slotInput is logged today)
  axes: { look, vibe, medium, frame, partnerId, seedSource, holiday },
  roll: null,                                 // set once at the first rolled rung, reused by the next
  stamps: []                                  // every rung's outcome, carried to the final log row
}
```

Sonnet runs once per night. A model change re-assembles the same slots (per-model order, F2 fragment for
flux-2-flex, look refit if the look is rejected on that model, stamped, never a model change).

## Continuing across jobs

Measured tonight: one rung is 35–45 s (render + swap + checks). One job dies at 150 s, so a job runs at most
~3 rungs.

- Before each rung: `remaining = deadline - now`. If `remaining < 45 s` → write `chain.rung = n`,
  `current_stage = 'chain:n'`, put the row back to `queued` with `created_at = now()` (no backoff,
  `attempt_count` untouched) via a new `continueQueueJob()`, kick the worker, return `{ continued: true }`.
  The worker treats `continued` as neither success nor failure. The next pass resumes at rung n, skipping the
  roll and Sonnet.
- Crash mid-rung (isolate killed, network): today's `failQueueJob` retry path runs. The pin survives, so the
  retry resumes at the same rung with the same scene.
- NSFW / bad-scene failure: the pin is CLEARED, so the retry rolls a fresh scene (today's L3 behaviour, kept).
- L4 (safe scene after 3 real failures) unchanged; continuations never touch `attempt_count`.
- Loop guard: `hops ≤ 4`; beyond it the job fails normally.

The notification fires once, at the end, as today. Same `dream_queue.id`, same `dedup_key`.

## The roll

`nightly_model_policy` couple + solo rows: primary = flux-1.1-pro (100), fallback = flux-2-flex 50 /
gemini-2-image 50 (`fallback_weights`, already supported by `resolveModel` for attempt ≥ 2). Rolled once at the
first rolled rung and pinned (`chain.roll`) so the next rung uses the same model. Grok stays out (Kevin 09-16).
`engine_config.solo_rebuild_model` is retired; the roll replaces it. Cast ban list holds flux-2-dev, not
flux-2-flex (verify at build).

## Stamps (forensics reads the chain from one row)

`chain:1:flux-1.1-pro:couple:fail:no_dual_split` · `chain:2:flux-1.1-pro:single:fail:solo_face_too_big` ·
`chain:continued:3` · `chain:3:gemini-2-image:couple:ok` — plus every existing stamp inside the rung.

## Kept from tonight

Composition gate 0.35, big-face tier off, Fly-only dual split, image-ops, identity floor, gender + side checks.

## Build (one day, then a 20-night batch + matrix)

- `_shared/dreamQueueLifecycle.ts`: `continueQueueJob()`; `failQueueJob` clears the pin on NSFW/terminal.
- `_shared/nightlyChain.ts` (pure): rung table for couple / single nights, budget check, resume, stamps.
- `nightly-dreams/index.ts`: pin after Sonnet; resume from `payload.chain`; the rung loop replaces the nested
  ladders; pipeline + guard called with zero inner re-renders.
- `dream-queue-worker/dispatchers/nightly.ts` + worker: handle `{ continued }`.
- Policy rows (2 updates, no deploy). Tests: rung order both nights, checkpoint at the budget, resume, pin
  survives a crash, NSFW clears it, wiring guards. Deploy `nightly-dreams` + `dream-queue-worker`.
