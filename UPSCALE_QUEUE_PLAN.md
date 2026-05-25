# On-Demand 4K Upscale (no auto-upscale) — Plan

**Status:** PLAN (2026-05-25). Supersedes the earlier auto-upscale/queue draft.
Builds on UPSCALE_HARDENING_PLAN.md (the endpoint fix, retry, fallback, PNG, smoke test
already shipped).

> **BUILD STATUS (2026-05-25):** Phase A SHIPPED (deployed). Phase B + C CODE-COMPLETE
> (tsc + 475 tests green). NOT YET LIVE — needs, IN ORDER: (1) run migration
> `182_upscale_on_demand.sql`; (2) ship the client (Phase C is JS-only → OTA-able); (3)
> deploy `upscale-image` (async) — **must go live WITH the client, not before** (the new
> async response breaks the old client and vice-versa); (4) enable the
> `upscale-sweep` + `upscale-smoke-test` workflows once on `main`. `send-push` already
> deployed (additive). See "Deploy sequence" at the bottom.
>
> **Model:** Nothing is ever auto-upscaled. The 4K upscale runs **on demand**, the first
> time someone downloads a given post. That first request shows a **dismissable
> "upscaling…" modal** and **notifies the user when it's ready**. The result is cached on
> `uploads.image_url_hq`, so **every download after the first is instant** for everyone.
>
> **Why:** Clarity 4K is ~64s and ~$0.06–0.09/run (GPU-seconds; the `$0.008` comment was
> wrong). Auto-upscaling all ~285 posts/day ≈ **$510–780/mo**, most of it wasted on posts
> nobody downloads. On-demand means we **pay only for the unique posts people actually
> download, once** — the cheapest model that still delivers true 4K + instant-after-first.

**Final config decisions (2026-05-25):**
- **Resolution: 2× → 1536×2688 (4.1 MP), ~17s, ~$0.017–0.024/run.** Marketed as **"HD"**
  (not 4K). 4K/16 MP was overkill for a phone download and ~4× the cost.
- **Monthly cap: 100** (was 500). Caps a heavy user's worst-case at **~$2–3/mo** — keeps
  Pro ($9.99, nets ~$7–8.50) comfortably profitable on the download line even before
  cache-sharing. 500 at 4K would have been ~$35/user and underwater.
- We control cost via *when* (on-demand only) **and** *how big* (2× / HD) **and** *how many*
  (cap 100).

---

## What changes from today

### Remove ALL auto-upscale (Phase A)
- `generate-dream` — delete the `EdgeRuntime.waitUntil(upscaleAndCache(...))` block.
- `nightly-dreams` — same.
- `restyle-photo` — same.
- `dream-queue-worker/dispatchers/firstDream.ts` — same.
- `botEngine.js` — already removed (bots post with `image_url_hq = NULL`).
- Do NOT build the backfill cron.
- `scripts/upscale-smoke-test.js` — KEEP the live per-model submit check (still proves the
  upscaler works); REMOVE the "% recent posts missing HQ" advisory (null HQ is now the
  normal/expected state by design).

Net: `image_url_hq` stays NULL on every post until its first downloader triggers an upscale.

### Config + copy changes (Phase A)

**Resolution → 2× (HD):**
- `scripts/lib/upscaleClarity.js` — clarity `buildInput` `scale_factor: 4` → `2` (and the
  real-esrgan fallback `scale: 4` → `2`).
- `supabase/functions/_shared/upscaleClarity.ts` — same.

**Cap 500 → 100 (lives in TWO places — keep them in sync):**
- `constants/proPlan.ts` — `PRO_HQ_DOWNLOADS_PER_MONTH = 500` → `100`.
- `supabase/functions/upscale-image/index.ts` — hardcoded `HQ_CAP_PER_MONTH = 500` → `100`
  (+ the cap message text "500/month" → "100/month").

**Copy: "4K" / "unlimited" → "HD" / "100 a month":**
- `constants/proPlan.ts:60-61` — title "Unlimited 4K downloads" → **"100 HD downloads / month"**;
  sub "…to your photos in 4K." → "…in HD." Also the `:50` comment.
- `constants/sparklePacks.ts:22` — comment "+ nightly + 4K +" → "+ nightly + HD +".
- `lib/imageLongPress.ts` — "Save in 4K" / "Saved in 4K" / "4K unavailable…" / the
  "Upscale to 4K … 25-35 seconds" alert / "unlimited HQ downloads" upsell → **"HD"** + the
  new dismissable-modal flow copy (no "25-35 seconds" promise — it's async now).
- `components/UpscaleOverlay.tsx` — "Upscaling to 4K…" → "Preparing your HD download…"
  (this component is rebuilt as the dismissable modal anyway).
- Comments mentioning 4K in `generate-dream` / `_shared/upscaleClarity.ts` — tidy to HD.

**External (NOT in the repo — you'll need to update these):** the App Store Connect
subscription description + the RevenueCat / paywall product copy almost certainly say
"unlimited 4K" too. Those are the legally-visible promises — change them to "100 HD
downloads/month" to match.

---

## The on-demand feature

### Sequence

```
Pro user taps Save/Download on a post
  → image_url_hq present?
      YES → save instantly (cache hit)            ← everyone after the first
      NO  → POST request-upscale { upload_id }
            • record an upscale_request (upload_id, user_id)
            • if no upscale already in-flight for this upload → kick it (waitUntil)
            • return { status: 'processing' } immediately
          → client shows DISMISSABLE "Preparing your 4K…" modal
          → (a) user waits  → modal auto-saves the moment image_url_hq lands
            (b) user dismisses → keeps browsing
          → upscale completes → write uploads.image_url_hq
                              → notify ALL requesters of this upload:
                                push + in-app "Your 4K download is ready ✨" (deep-links to post)
          → tap notification → post opens → save instantly (now cached)
```

### Data model — `upscale_requests`

```
upscale_requests(
  id, upload_id (FK uploads), user_id (FK users),
  status: processing | completed | failed,
  created_at, completed_at, last_error
)
```
- Tracks **who to notify** (multiple users can request the same post; the upscale runs
  ONCE, all requesters get notified).
- "In-flight for this upload?" = any row `status='processing'` for that `upload_id` in the
  last few minutes (dedup — only one Replicate run per upload).
- Index on `(upload_id, status)` and `(status, created_at)` for the stuck-sweep.

### `request-upscale` Edge Function (replaces the synchronous `upscale-image`)

1. Auth + Pro gate + monthly cap (reuse existing `is_pro_active` + `pro_hq_downloads_log`,
   cap 500/mo — counts the unique upscales a user triggers).
2. If `image_url_hq` already set → return it (`{ status:'done', image_url_hq }`).
3. Else: insert `upscale_request`. If no in-flight upscale for this upload, kick
   `upscaleAndCache()` via `EdgeRuntime.waitUntil` (immediate start, retry+fallback already
   built in). On completion: write `image_url_hq`, mark all this upload's processing
   requests `completed`, insert a `download:ready` notification per requester + `send-push`.
4. Return `{ status:'processing' }` immediately so the client can show the dismissable modal.

### Reliability — stuck-request sweep (mirror `refund-stuck-jobs`)
- Cron (~every 2–5 min): find `upscale_requests` stuck in `processing` past a timeout
  (isolate died mid-`waitUntil`). Re-kick the upscale, or after N attempts mark `failed` +
  notify "couldn't prepare your 4K — tap to retry." Guarantees the user always hears back.

### Client (`lib/imageLongPress.ts` + a modal + notifications)
- HQ cached → instant save (unchanged).
- No HQ → call `request-upscale`; show a **dismissable** modal ("Preparing your 4K — we'll
  notify you when it's ready"). 
- **Auto-save-on-ready** if the modal is still open: subscribe (Supabase realtime on the
  upload row's `image_url_hq`, or short poll) and save the instant it lands.
- `download:ready` notification → deep-links to the post → instant save.

### Notification
- New type `download:ready` (joins `dream:* / wish:* / welcome:*`), references `upload_id`,
  shows in the inbox + fires a push.

---

## UI & Notifications (detailed)

### A. The dismissable "Upscaling" modal

Today `UpscaleOverlay` is a **blocking** full-screen overlay. It becomes a small,
**dismissable** status modal (bottom card) with a state machine:

```
┌────────────────────────────────┐
│   ✨  Preparing your 4K          │
│   This takes about a minute.     │
│   [spinner ▰▰▰▱▱]                │
│                                  │
│   We'll notify you when it's     │
│   ready — you can keep browsing. │
│            [ Dismiss ]           │
└────────────────────────────────┘
```

States:
- **requesting** → calling `request-upscale` (brief spinner).
- **processing** → server is upscaling. Modal shows the copy above + **Dismiss**. Dismiss
  closes the modal; the upscale keeps running server-side and the push/inbox entry still
  fires on completion.
- **ready** (modal still open) → `image_url_hq` landed → **auto-save to Photos** →
  collapse to a "Saved in 4K ✓" toast → close. (No notification needed in this path,
  though the inbox entry is still written for history.)
- **failed** → "Couldn't prepare your 4K." with **[Retry]** (re-calls `request-upscale`)
  and **[Dismiss]**.

How "ready" is detected while the modal is open: **Supabase realtime** subscription on the
`uploads` row (id = upload_id), watching `image_url_hq` flip non-null. Unsubscribe on
dismiss/close. (Fallback: 5s poll if realtime unavailable.)

Implementation: evolve `components/UpscaleOverlay` → `UpscaleModal` — a global
imperative component like `Toast` (`UpscaleModal.show(uploadId)` / auto-manages state), so
any save entry point can trigger it without prop-drilling.

### B. Save entry point (`lib/imageLongPress.ts`)

```
long-press → Save in 4K
  ├─ not Pro                → existing Pro upsell sheet
  ├─ Pro + image_url_hq set → download + save instantly  (unchanged)
  └─ Pro + no HQ            → request-upscale(upload_id)
                              → UpscaleModal.show(uploadId)   (non-blocking; returns now)
```
No more 60s blocking. The handler fires the request and hands off to the modal.

### C. In-app inbox entry

- `download:ready` row in `notifications` (recipient_id, type, upload_id, body). Renders in
  the existing inbox (`get_inbox` / `app/inbox.tsx`) with: a download/sparkles icon, the
  post thumbnail, copy "Your 4K download is ready", tap → §E deep-link.
- Add the type to the inbox row renderer + `getNotificationIcon`.

### D. Push notification

- The completion step calls the existing **`send-push`** Edge Function with the requester's
  `push_tokens`:
  - title: "Your 4K download is ready ✨"
  - body: "Tap to save it to your photos."
  - data: `{ type: 'download:ready', upload_id, action: 'save' }`
- Only sent to requesters who **dismissed/backgrounded** (if the modal auto-saved while
  open, skip the push — but still write the inbox row). Simplest v1: always write inbox +
  always send push; the modal-open auto-save just makes the push redundant, not wrong.

### E. Deep-link / tap handling

- Push tap + inbox tap both route to the post (`post/[id]` or `photo/[id]`) with an intent
  param, e.g. `?downloadReady=1`.
- On arrival, the post screen sees the param + `image_url_hq` is now set → **auto-initiates
  the save** (instant, cache hit) with a "Saved in 4K ✓" toast. Graceful Photos-permission
  prompt if needed.
- Extend the existing push-response router (the handler that already routes `dream:*` /
  `wish:*` notification taps) with a `download:ready` case.

### F. Edge cases
- **Multiple requesters, one upload:** the upscale runs once; each requester gets their own
  inbox row + push when it lands.
- **Failure after dismiss:** stuck-sweep marks `failed` + sends a "couldn't prepare — tap to
  retry" notification; tapping re-triggers `request-upscale`.
- **Monthly cap hit:** modal shows "You've hit your monthly HQ limit (resets the 1st)"; no
  request enqueued.
- **App killed during processing:** server-side `waitUntil` + stuck-sweep still complete +
  notify; the user gets the push next launch.
- **Non-AI / already-HQ posts:** save path unchanged (instant).

### Components touched
- `components/UpscaleOverlay` → `UpscaleModal` (dismissable, stateful, realtime-aware).
- `lib/imageLongPress.ts` (non-blocking request + modal handoff).
- `app/inbox.tsx` + inbox row renderer + `getNotificationIcon` (`download:ready`).
- push-response router (deep-link `download:ready` → post + auto-save).
- `request-upscale` Edge Function + `send-push` call + `upscale_requests` table.

---

## Cost

At **2× / HD (~$0.017–0.024/run)**: pay **once per unique post anyone downloads**, then free
forever (cached). No spend on the long tail of never-downloaded posts. Worst case for a
single user maxing the **100/mo cap ≈ $2–3**; typical users (a handful of downloads) ≈
cents. Scales with actual download behavior, not post volume, and gets cheaper as Pro users
overlap on popular posts. (Confirm exact per-run $ from the Replicate billing dashboard.)

---

## Phasing

- **Phase A — stop the bleed (quick):** remove all auto-upscale (4 `waitUntil` sites +
  botEngine already done), trim the smoke test's cache-rate advisory. Ship now.
- **Phase B — async on-demand backend:** `upscale_requests` table + `request-upscale`
  (waitUntil kick + dedup + notify-all-requesters) + stuck-sweep cron + `download:ready`
  notification type.
- **Phase C — client:** dismissable modal + auto-save-on-ready (realtime) + notification
  handling + deep-link.

---

## Open decisions (need your call)

1. **Immediate kick (`waitUntil`) + stuck-sweep** *(recommended — lowest latency for the
   waiting user, ~64s)* vs a **cron worker** (simpler retry story, but adds queue latency on
   top of the 64s). Recommend waitUntil + sweep.
2. **Auto-save when the modal is left open** (realtime subscription) — *recommend yes*; it
   makes "wait ~1 min then it just saves" feel great. Costs a small realtime subscription.
3. **Monthly cap** — keep the existing 500/mo per Pro user? (recommend keep.)
4. **De-dupe across requesters** — one Replicate run per upload, notify all who asked
   *(recommend yes)*.
5. **`upscale-image` fate** — rename/replace with `request-upscale`, or keep `upscale-image`
   and change its behavior to async. (recommend: evolve `upscale-image` in place to the
   async contract so the client endpoint name is stable.)

---

## Deploy sequence (DO IN THIS ORDER — avoids a regression window)

1. **Run migration** `supabase/migrations/182_upscale_on_demand.sql` in the Supabase SQL
   editor (creates `upscale_jobs` + `upscale_requests` + `claim_upscale_job` + the
   `download_ready` notification type). Harmless to existing code.
2. **Ship the client** (Phase C: `UpscaleModal`, `imageLongPress`, `savePhoto`, inbox,
   `useInbox`). All JS/TS, no new native modules → can go out as an **Expo OTA update**.
3. **Deploy `upscale-image`** (the async rework) — `supabase functions deploy upscale-image
   --no-verify-jwt`. **Do this right after step 2 goes live**, NOT before: the new async
   `{status}` response and the old client are mutually incompatible. (The currently-deployed
   `upscale-image` is the old sync version and keeps working until you swap it.)
4. **Enable workflows** once this branch is on `main`: `upscale-sweep` (every 10 min) and
   `upscale-smoke-test` (daily). They reference scripts already committed.
5. **External copy:** update App Store Connect subscription description + RevenueCat / paywall
   to "100 HD downloads/month" (was "unlimited 4K").

`send-push` (the `download_ready` push case) is already deployed — additive, safe.
