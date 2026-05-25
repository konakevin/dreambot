# 4K Upscale / Pro HQ Download — Architecture Hardening Plan

**Status:** Phases 0–3 **SHIPPED** 2026-05-25. Edge Functions deployed
(`upscale-image`, `generate-dream`, `nightly-dreams`, `restyle-photo`,
`dream-queue-worker`); Node bot twin + smoke-test workflow committed to `main`.
Client honesty fix (`imageLongPress.ts`) ships with the next app build.
Authored after the upscaler was found 404'ing silently.

### Shipped
- **Phase 0:** endpoint fix (`/v1/predictions` + pinned version) + PNG output.
  Verified end-to-end (bot render populated `image_url_hq` as `.png`).
- **Phase 1:** bounded submit-retry with backoff (both twins, time-bounded so the
  on-demand path can't hang); honest client toast (no false "Saved in 4K").
- **Phase 2:** fallback upscaler — clarity → real-esrgan (`runUpscale` tries each
  with retry; both versions pinned + verified to accept our input).
- **Phase 3:** `scripts/upscale-smoke-test.js` + `.github/workflows/upscale-smoke-test.yml`
  (daily). Live per-model submit = hard fail (would have caught the original 404
  instantly); recent-bot-post cache-rate = advisory (lags reality, would false-red
  after any incident).

> This is a PAID feature (Pro 4K HQ downloads). It must be robust, fault-tolerant,
> and have redundancy. The defining failure here was that it broke **silently** and
> nobody knew — that's the thing to fix permanently.

---

## How it works today

**One shared helper** — `upscaleAndCache()` (Clarity Upscaler 4×, `philz1337x/clarity-upscaler`),
with a Node twin (`scripts/lib/upscaleClarity.js`) and a Deno twin
(`supabase/functions/_shared/upscaleClarity.ts`).

**Two ways it's invoked:**

1. **Pre-upscale at post time** (background, fire-and-forget) — caches onto
   `uploads.image_url_hq` so the user later gets an instant cache hit. Call sites:
   - `botEngine.js` (bot posts)
   - `generate-dream` (user creates)
   - `nightly-dreams` (nightly)
   - `restyle-photo` (photo restyle)
   - `dream-queue-worker/dispatchers/firstDream.ts` (first dream)
2. **On-demand** (`upscale-image` Edge Function) — client long-press → Pro gate →
   cache check → monthly cap (500) → `upscaleAndCache` → return HQ URL.

**Client** (`lib/imageLongPress.ts`): cached HQ → instant save; Pro + no cache →
overlay + on-demand call (~25-35s); free user → original-res.

**Cache/state:** `uploads.image_url_hq`, `image_url_hq_generated_at`,
`pro_hq_downloads_log` (cap), `is_pro_active()` RPC.

---

## What was broken (fix coded, not deployed)

1. **Wrong Replicate endpoint → 404 on every upscale.** Both twins POSTed to
   `/v1/models/<owner>/<name>/predictions` (the *official-models* endpoint).
   `clarity-upscaler` is a *community* model and must run via `POST /v1/predictions`
   with a pinned `version`. Result: **every pre-upscale AND every on-demand Pro HQ
   download silently 404'd** — users got original-res, told it was 4K. Verified the
   model exists and the `/v1/predictions` + version call returns a valid prediction.
   **Fix:** both twins now use `/v1/predictions` + pinned version
   `dfad4170…3d5e`.
2. **Lossy output for a quality feature.** Was `output_format: 'jpg'`. Switched to
   `'png'` (lossless; the persist layer already sniffs magic bytes, so it lands as
   `.png`/`image/png`).

---

## Gaps to harden (the actual ask)

| # | Gap | Risk for a paid feature | Fix |
|---|-----|------------------------|-----|
| G1 | **Silent failure, no monitoring** | The 404 ran unnoticed because failures only `console.warn`. THE root problem. | A scheduled smoke test + a "% recent posts missing `image_url_hq`" metric that alerts. Make failure LOUD. |
| G2 | **No retries** | A transient Replicate 429/503/network blip = no HQ, silent degrade. | Backoff retry in `runClarityUpscale` (mirror `styleDistiller`'s RETRYABLE_STATUSES + delays). Both twins. |
| G3 | **No redundancy** | Single model, single provider. If Clarity breaks (it just did), there is NO fallback. | A fallback upscaler model on primary exhaustion (e.g. Real-ESRGAN / alt diffusion upscaler). Quality-aware order: Clarity first (best for illustrated content), fallback second (better than serving original-res). |
| G4 | **Dishonest failure UX** | `imageLongPress.ts:97` shows **"Saved in 4K"** even when the upscale failed and it saved original-res. A paying user is told they got 4K when they didn't. | Track HQ success; toast honestly ("Saved (HD unavailable — try again)"), offer one-tap retry, and never imply 4K on fallback. |
| G5 | **Concurrency waste** | Pre-upscale + on-demand can run the same upload twice (double $, last-write-wins). | Minor: short-circuit if `image_url_hq` already set just before submit; optional "in-progress" guard. |
| G6 | **Version drift** | Pinned version can later be deprecated. | Covered by G1 monitoring — a deprecated version surfaces as a spike in failures. |

---

## Plan (phased)

**Phase 0 — restore the feature (coded; deploy now).**
- Deploy the 404 fix + PNG. Redeploy the 5 functions that bundle the Deno helper:
  `upscale-image`, `generate-dream`, `nightly-dreams`, `restyle-photo`,
  `dream-queue-worker`. Verify with one real on-demand HQ download end-to-end.

**Phase 1 — fault tolerance.**
- G2: backoff retry on submit + transient poll errors (both twins).
- G4: honest client toast + one-tap retry; fix the stale "pipeline produces JPG"
  comment.

**Phase 2 — redundancy.**
- G3: fallback upscaler. `runClarityUpscale` → on exhaustion, `runFallbackUpscale`
  (second model). Return null only if BOTH fail. Pin both versions.

**Phase 3 — monitoring (so silent breakage can NEVER recur — highest long-term value).**
- G1: a tiny scheduled check (GitHub Action or cron Edge Function) that submits one
  upscale and alerts on failure; plus a metric on `% of last-N posts missing
  image_url_hq` (≈100% = upscaler down). Surfaces a broken model/version/endpoint
  within a day instead of "whenever someone notices."

---

## PNG "system-wide" status

- **Originals:** already PNG (`generateImage.ts` default) — **except the
  dual-face-swap path, which intentionally uses JPG** to stay under the worker
  memory budget (2026-05-09 `WORKER_RESOURCE_LIMIT` incident). Leave that JPG.
- **HQ upscale:** now PNG (this change).
- **Legacy/test scripts** (`scripts/test-*.js`, `generate-humanbot/glowbot.js`):
  still JPG, but not in the live pipeline — optional cleanup, low priority.

So "system-wide PNG" is effectively in place after this change; the only remaining
JPG is the deliberate, load-bearing dual-face-swap exception.

---

## Deploy targets (Deno helper change touches all of these)

`upscale-image`, `generate-dream`, `nightly-dreams`, `restyle-photo`,
`dream-queue-worker`. (Node twin change affects bot renders via `botEngine.js` — no
deploy, runs in CI/dispatcher from committed `main`.)

## Recommended sequencing

Ship **Phase 0 now** (restores the broken paid feature). Then **Phase 1 + Phase 3**
(fault tolerance + monitoring — highest value, monitoring ensures we never get
silently-broken again). **Phase 2** (redundancy) when ready.
