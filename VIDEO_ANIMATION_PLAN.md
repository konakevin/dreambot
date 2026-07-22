# Video Animation ("Animate") — Feature Plan

Turn any of a user's own dream images into a ~5-10s AI animation. Status:
**PARKED — not being built (2026-07-22).** Kevin's call: the concept and
economics are sound, but the risk/effort is too high to take on right now
(chief risk: video playback in the virtualized feed; secondary: cost exposure,
App Store scrutiny, egress). This doc is the **complete, self-contained spec +
research** so the feature can be picked up cold later without re-deriving
anything. Companion economics live in `SPARKLE_PRICING_STRATEGY.md`.

> **If you're resuming this:** read §0 (why it was parked + the resume
> checklist) first, then §16 Phase 0 — the ~$3 test renders are the mandatory
> first step; do NOT write feature code before seeing real output on your own
> dreams. Everything below is design; nothing has been built.

Prime directive from the audit hard-rules that this feature must honor:
server-computed cost (never trust the client), all user text through
`_shared/sanitizeUserText.ts`, no unscoped abuse surface, cast-photo content
handled with extra care.

---

## 0. Why this was parked + resume checklist (read first)

**Parked 2026-07-22.** Nothing built — no code, no migrations, no edge fns, no
DB objects. Purely a plan. Safe to ignore indefinitely; safe to resume cold.

**Why parked (Kevin):** too risky/effortful to take on now. The concentrated
risks (detail in §18):
1. **Video in the virtualized feed** — the single biggest build risk. Autoplay
   in a recycling pager needs exactly-one-player discipline or it leaks
   memory / stacks audio / janks. This is where a build would burn the most time.
2. **Cost exposure** — video is ~20-50× an image call ($0.42-0.84/clip); a bug
   or scripted user runs a real Replicate bill fast. Needs a hard spend ceiling.
3. **Egress/storage** — a 10s mp4 is 15-30× heavier than a display image;
   autoplay-on-active streams a clip on every scroll-past.
4. **App Store review** — UGC + AI + video + real faces is Apple's
   highest-scrutiny combination; expect extra review cycles.

**What was already DE-RISKED (don't re-investigate):**
- Aspect ratio: dreams are 9:16, Kling/Hailuo output 9:16 → no crop/letterbox.
- Infra: zero new — Replicate runs the GPU; both edge fns are plain Supabase
  Edge Functions (§2). No Fly.io/Modal.
- Moderation: solved — regex (`text_is_blocked`, mig 276) → Haiku ladder (§10).
- Social features (like/comment/repost/post): free, because it's an `uploads`
  row (§12). Only render + download are media-type-aware.
- Sparkle economy + async webhook UX (UpscaleModal pattern): already exist.
- `expo-video ~3.0.16` already installed (unused).
- `REPLICATE_API_TOKEN` present in `.env.local` (verified 2026-07-22).

**Resume checklist (in order):**
1. Confirm Replicate billing is enabled + no low spend cap (video needs it).
2. **Phase 0 (§16): write `scripts/test-video-models.js`, render 4-5 real
   dreams through Kling + Hailuo, both no-prompt and Haiku-prompted, ~$3.**
   Judge quality (is "Surprise Me" good on stylized/face-swapped content?) and
   measure true per-clip cost. This gates everything.
3. Only after Phase 0: lock the model list + cost matrix (§13), decide the Pro
   allotment (§14), then build Phase 1 (§16) starting with the video-in-pager
   spike (§11/§18).
4. Re-verify the model landscape/pricing — this doc's model facts are from
   July 2026 and this category moves monthly.

---

## 1. What we're building (Kevin's spec, 2026-07-22)

- **Animate** a dream image → a short AI video (5s or 10s), model + duration
  chosen by the user, sparkle cost varying by selection and shown live.
- Entry points:
  - A **badge/button on the post** (feed card + detail) that opens the Animate sheet.
  - An **"Animate" row in the long-press sheet** on BOTH the fullscreen dream
    AND the dream-grid tile.
- The finished animation is saved as a **regular, first-class post**: it can be
  posted, reposted, commented on, liked — no different from a single image or
  album post.
- **Download is creator-only**: nobody but the user who made the animation can
  save it (stricter than the account-level `allow_downloads` used for images).
- The Animate sheet: model picker + 5s/10s duration + optional motion prompt.
  Submit button reads **"Surprise Me · N✨"** while the prompt is empty, changes
  to **"Animate · N✨"** once the user types. Prompt placeholder: **"Describe
  your animation"**. Sparkle count updates live with (model × duration).
- Two motion modes, one field:
  - **Surprise Me** (empty prompt) — we AUTO-GENERATE a motion prompt from the
    image via Haiku vision (NOT a bare no-prompt call; see §7). Better default.
  - **Custom** (typed prompt) — the user directs the motion.

---

## 2. The one architectural fact that shapes everything

**Video generation takes 2-6 minutes. The image render pipeline has a hard
~120s ceiling** (`RENDER_TIMEOUT_MS`, under the 150s gateway idle limit), and
the worker holds the render's HTTP connection synchronously. Video **cannot
ride that path** — it would time out and dead-letter every time.

→ Video uses an **async webhook** flow, not the held-connection render. We
already own both halves of this pattern:
- The **UpscaleModal UX** (`upscale-image` → `202 processing` → "Dismiss to be
  notified" → `download_ready` push) — copy this post-submit UX verbatim.
- A **`--no-verify-jwt` webhook receiver** (`revenuecat-webhook`) — the shape
  for the new `replicate-video-webhook`.

**Infrastructure: ZERO new infra — Replicate runs the GPU work, not us.** This
is the key distinction from face swaps. `face-swap-dual` needed **Fly.io**
because that's OUR pixel compute in-process, which blew the Edge 150MB/2s
ceiling (HTTP 546). Video generation is the opposite: the expensive GPU compute
is entirely on **Replicate's** side. Both our functions are plain **Supabase
Edge Functions** (Deno), same as everything else:
- `generate-video` — submits the job, returns instantly (no held connection).
- `replicate-video-webhook` — receives completion, downloads the finished mp4
  (~2-5 MB) from Replicate's URL, persists, notifies. NO in-process pixel work,
  so it stays well under the 150MB/2s ceiling — it's just moving a file
  Replicate already made.
No Fly.io / Modal / new runtime to stand up or manage. All composition on the
Supabase stack we already operate (dream_queue, charge_sparkles, send-push).

Replicate supports webhooks natively: submit the prediction with a `webhook`
URL + `webhook_events_filter: ["completed"]`, get a prediction id back in <1s,
Replicate POSTs us on completion. No polling, no held connection.

---

## 3. Model selection (de-risk BEFORE locking anything)

Candidates (Replicate, verified July 2026 landscape):
| Model | Replicate | 10s cost | Notes |
|---|---|---|---|
| **Kling** (primary) | `kwaivgi/kling-*` | ~$0.84 ($0.07/s) | Best quality/price, 5s+10s, prompt optional |
| **Hailuo/MiniMax** (fallback) | `minimax/video-01` | ~$0.28-0.50 flat | Expressive motion, ~6s |
| Budget (optional) | `wan-*` | ~$0.20/5s | Cheapest; QA before offering |

**GATE: run test renders first.** Before the cost matrix or model list is
locked, render 4-5 real DreamBot dreams through each candidate, BOTH ways
(bare no-prompt vs auto-generated motion prompt), and judge on:
- Is the no-prompt motion actually good on stylized/face-swapped content, or is
  the Haiku auto-prompt required?
- Real per-clip cost (some models bill by resolution — headline price can hide it).
~$3 of spend, de-risks the entire pricing + quality story. Script: a throwaway
`scripts/test-video-models.js` posting results to a scratch dir for review.
Keep the launch list SHORT (2-3 models) — video is expensive to QA.

Cross-provider failover mirrors the image path (`generateImage` flux↔gemini):
Kling submit fails → try Hailuo, submit-phase only.

---

## 4. Data model

Animations are `uploads` rows — first-class posts (Kevin's requirement). The
schema is largely ready: `upload_media` already carries `media_type` and
`duration_ms`.

**Migration (new columns on `uploads`, or reuse where present):**
- `media_type text NOT NULL DEFAULT 'image'` — `'image' | 'video'`.
- `video_url text` — the mp4 in the `uploads` bucket (private path; see §11).
- `video_poster_url text` — a still frame / the source image, shown before play.
- `duration_ms int` — 5000 / 10000.
- `source_upload_id uuid REFERENCES uploads(id)` — the still this was animated
  from (may already exist via the gallery model; reuse if so).
- Column-level GRANTs: per migration 278, `users`/`uploads` use column grants —
  any NEW column needs `GRANT SELECT (col) ... TO anon, authenticated` or it's
  silently client-invisible. Do this in the same migration.
- `get_feed` / `POST_SELECT` / `mapPost` must carry the new columns through
  (same treatment as `face_swap_mode` in migration 386).

**Storage:** the mp4 lands in the existing `uploads` bucket with
`cacheControl: '2592000'` (matches image uploads; the CDN caches it — verified
healthy via GET). ~2-5 MB per 10s clip.

**Feed/type plumbing:** `DreamPostItem` gains `media_type`, `video_url`,
`video_poster_url`, `duration_ms`. Everything downstream (feed, grid, album,
detail, notifications) already flows `DreamPostItem` — adding fields is additive.

---

## 5. Queue integration

- New `dream_queue.source = 'animate'` and **`weight = 'video'`** — its own
  per-weight concurrency cap in `claim_dream_queue_jobs_by_weight` +
  `engine_config.dream_queue_max_concurrent_video` (start ~5). Video jobs must
  NOT share the image/heavy caps — they're long-running and would starve renders.
- **The worker does NOT hold the render.** For `source='animate'` the worker
  (or `enqueue-dream`) calls `generate-video`, which submits to Replicate with a
  webhook and returns immediately. The `dream_queue` row sits in a new
  `awaiting_webhook` state (or reuse `in_progress` with a `current_stage`
  breadcrumb) until the webhook lands.
- **Stuck-job sweep:** a video prediction that never webhooks (Replicate drop)
  needs a reaper — extend `refund-stuck-jobs` to time out `awaiting_webhook`
  video jobs past ~15 min, refund sparkles, notify failure. (Images time out at
  5 min; video needs a longer, separate ceiling.)

---

## 6. Edge functions (2 new)

**`generate-video`** (`--no-verify-jwt`, authenticates the caller itself):
1. Auth the user, re-check they own the source dream (isOwn), re-check sparkle
   balance already charged (idempotent on job_id — charge happens in enqueue).
2. Moderation gate — regex (`text_is_blocked`) THEN Haiku intent classifier,
   fail-closed; cast-source forces Surprise-Me (see §10).
3. Resolve the motion prompt: use the typed prompt (sanitized) OR call Haiku
   vision on the source image to author one (Surprise Me).
4. Submit to Replicate (Kling) with `webhook: <project>/functions/v1/replicate-video-webhook?job=<id>`,
   `webhook_events_filter: ["completed"]`. Store the prediction id on the queue row.
5. Return fast. NO held connection.

**`replicate-video-webhook`** (`--no-verify-jwt`):
1. **Verify the webhook signature** (Replicate signs webhooks — constant-time
   compare a shared secret, like `revenuecat-webhook`). Non-negotiable: this is
   an unauthenticated public endpoint that mints content + could be forged.
2. On `succeeded`: download the mp4 from Replicate, moderate (frame sample,
   §10), persist to storage, INSERT/UPDATE the `uploads` row
   (`media_type='video'`, `video_url`, `duration_ms`, `source_upload_id`), flip
   the `dream_queue` row terminal via `completeQueueJob`, notify the user.
3. On `failed`/`canceled`: `failQueueJob` + refund sparkles + failure notify.
4. Idempotent on job id (Replicate can retry webhook delivery).

---

## 7. The motion prompt (Surprise Me vs Custom)

Base video models do NOT invent a prompt — with empty text they fall back to a
generic "default motion" prior, which is often flat/underwhelming on stylized
content. So "Surprise Me" does NOT send nothing:

- **Surprise Me:** `generate-video` calls Haiku vision on the source image
  ("describe the natural motion for this scene in one short clause") → an
  image-aware motion prompt ("waterfall cascading, mist drifting, slow push-in").
  Costs a fraction of a cent, dramatically better than the bare prior. Reuses
  the `describe-photo` vision pattern.
- **Custom:** the user's typed text. MUST pass `_shared/sanitizeUserText.ts`
  (hard rule — user text to a model) AND the client `moderateText` pre-check
  (`lib/moderation.ts`) before submit, same as a dream prompt.

The final motion prompt (either source) also passes sanitize before hitting
Replicate.

---

## 8. The Animate sheet (UI)

Slides up like the share sheet / EditDescriptionModal (root-level imperative
sheet, `SlideInDown`, backdrop fade — patterns already built 2026-07-21).

Contents top→bottom:
1. **Preview** — the dream thumbnail being animated.
2. **Model picker** — mirror `ModelPicker.tsx` (modal list, per-option cost,
   account-sticky). Persist choice to `users.video_model` (like
   `pro_mode_flux_model`).
3. **Duration** — 5s / 10s segmented control. Persist to `users.video_duration`.
4. **Motion prompt** — `TextInput`, placeholder **"Describe your animation"**,
   optional, sanitized, 500-char cap, multiline.
5. **Dynamic submit button:**
   - prompt empty → **"Surprise Me · N✨"**
   - prompt non-empty → **"Animate · N✨"**
   - N = live `cost(model, duration)` from the client cost table (display only).
6. Insufficient balance → the existing premium gate (`showPremiumGate({kind:'sparkles'})`).

New `constants/videoModels.ts` mirrors `imageModels.ts` (id, label, provider,
description, base sparkleCost). Cost table is `model × duration`.

---

## 9. Entry points (all open the Animate sheet)

1. **Long-press action row** — add an `'animate'` row to `buildPostActionRows`
   (`lib/imageLongPress.ts`), owner-only (`opts.isOwn`), placed near "Save in
   HD" / "Dream this again". This automatically appears on **fullscreen dream
   (DreamCard) AND grid tile (PostTile)** — both render the same sheet. ✅ covers
   Kevin's "long press on either fullscreen or grid" requirement in one change.
2. **Post badge/button** — a visible affordance on the card + photo detail (a
   small "✨ Animate" pill / film-strip icon, owner-only) that opens the sheet
   directly, so it's discoverable without long-press.
3. **Reveal screen** — an "Animate this" affordance right after a dream
   generates (highest-intent moment). Phase 2.

Launch gate: **own dreams only** (`isOwn`). Animating someone else's
face-swapped dream of a real person is the exact moderation risk video models
attract — defer non-owner animation entirely.

---

## 10. Moderation & safety (the prompt gate + layered defense)

You can't NSFW-retry a video the way `generateImage` retries a Flux image, so
the motion prompt is pre-screened BEFORE submit, plus structural defenses. We
REUSE the existing two-layer text-moderation infra — no new system.

**The prompt gate — regex THEN Haiku (both, in that order; each covers the
other's blind spot):**

1. **Regex wordlist (free, instant, pre-submit)** — the existing
   `lib/moderation.ts` `containsBlockedWord` (client) mirrored by the DB-tunable
   `moderation_words` table + `text_is_blocked()` server function (migration
   276, the real bypass-proof gate). Today the table is seeded for slurs/hate;
   **extend it with the violence + sexual-motion vocabulary** this feature needs
   ("strangle", "undress", "thrust", etc.). It's a DB table → dashboard `INSERT`,
   no code change. Catches lazy/obvious attempts at zero cost.
2. **Haiku intent classifier (only if regex passes)** — one cheap call in
   `generate-video`: pass the motion prompt AND whether the source is a cast
   image, ask "Is this requesting violence, sexual content, or degradation of a
   person? BLOCK/ALLOW." ~$0.001, ~300ms. Catches what regex STRUCTURALLY can't:
   - **Euphemism/obfuscation** — "dance seductively and slowly remove the
     jacket" trips no wordlist but is clearly the blocked intent.
   - **Prompt × image context** — "move closer / turn toward each other" is
     innocent on a landscape, loaded on a face-swapped portrait of a real
     person. Regex is blind to the combination; Haiku sees both.

   Reuses the `callSonnet`/Haiku plumbing already in `_shared`. Fail-closed:
   a Haiku error or ambiguous verdict blocks (better a false reject than a bad
   video). The motion prompt still passes `sanitizeUserText` (hard rule) after
   the gate, before it reaches Replicate.

**Structural defenses (not prompt-dependent):**

3. **Source image is already moderated** — it's an existing dream that passed
   render-time NSFW checks. A clean still + a gated clean prompt is very likely
   to stay clean. Primary safety.
4. **Cast-photo animations: Surprise-Me-only at launch.** If the source dream
   used a face swap (`face_swap_mode` non-null), DISABLE the free-text prompt —
   force the AI-authored safe prompt. "Type what this real person's face does in
   a video" is the single highest-risk path; gate it until trust is established.
   (Non-cast dreams get the full prompt field + the gate above.)
5. **Output frame-sampling (phase 2, before scale):** in the webhook, extract
   2-3 frames from the mp4 and run them through the render path's image
   moderation; quarantine (`is_moderated=true, is_approved=null`) on a hit.
   Launch ships with 1-4; add 5 fast.

**Net:** regex kills obvious cases free/instant; Haiku catches euphemism +
image-context intent for ~$0.001; cast-gating removes the worst combination
structurally; frame-sampling is the defense-in-depth backstop. The two prompt
layers reuse infra that already exists (migration 276 + Haiku).

---

## 11. Playback + download

- **Playback:** `expo-video` (~3.0.16, already installed, currently unused).
  **RISK — the biggest client unknown:** video in a virtualized pager
  (FlatList/VerticalPager with cell recycling) is notoriously finicky —
  autoplay-muted-on-active requires EXACTLY ONE player active at a time, pausing
  + releasing off-screen players, or you leak memory / get multiple audio
  tracks / jank. Needs a dedicated spike (a `useActiveVideoPlayer` hook keyed to
  the pager's active index, mirroring how the active-card `isActive` flag
  already works). Do this spike in Phase 1 BEFORE wiring the rest of playback.
  DreamCard/GalleryCarousel render a `VideoView` when `media_type==='video'`,
  else the existing `expo-image`. Show `video_poster_url`
  until play; loop; muted-autoplay-on-active-card is the TikTok/IG convention
  (decide at build — autoplay-on-active vs tap-to-play). The pager's
  active-index logic already exists to drive "play only the visible card."
- **Download = creator only.** In `buildPostActionRows`, the save rows for a
  video appear ONLY when `isOwn`. Server-side: a new download/serve path must
  reject non-owner video saves regardless of `allow_downloads` (which is the
  looser image rule). The mp4 lives at a path the client can play (public-read
  for playback) but the SAVE action is client-gated to owner + server-enforced
  if we add a signed-download path. (Playback ≠ download — the feed streams it;
  only the owner gets a "Save to Photos".)

---

## 12. First-class post behavior (Kevin: no difference from image/album)

Because an animation IS an `uploads` row, everything works for free:
- **Post / repost / comment / like / pin / delete** — all keyed on `upload_id`;
  zero new code (likes/comments/reposts don't care about media_type).
- **Feed ranking** — same `get_feed`; a video post scores like any post.
- **Notifications, share, hashtags, mentions** — all upload-based, all work.
The ONLY media-type-aware code is the **render** (VideoView vs Image) and the
**download gate** (owner-only). Everything social is untouched. This is the
whole reason to model it as an upload, not a separate "animations" table.

---

## 13. Pricing (server-authoritative)

- Cost = `base(model) × duration_multiplier` (10s = 2× 5s). Stored in a
  `video_model_pricing` table (or extend `model_pricing` with a
  `duration_seconds` col) so both are **dashboard-tunable** — Replicate video
  prices move; never hardcode.
- **The server recomputes and charges — the client's displayed cost is
  confirmation only** (audit S2). `enqueue-dream` (animate branch) looks up
  `cost(model, duration)` and calls `charge_sparkles` with that, idempotent on
  job_id. A curl with a spoofed cost gets charged the real amount.
- Launch matrix (anchored to Kling $0.84/10s, ~2.4× markup, ~$0.10/sparkle
  retail — RE-VALIDATE against test-render measured cost):
  | Model | 5s | 10s |
  |---|---|---|
  | Kling | 10✨ | 20✨ |
  | Hailuo | 12✨ | 24✨ |
  | Budget | 5✨ | 10✨ |

## 14. Pro perk economics (decided 2026-07-22)

3 free **10s** clips/mo is NOT safely profitable (+$2.52/mo nearly doubles Pro
cost-to-serve; yearly-typical + all maxed cases go negative). Viable options:
- **3 free 5-second animations/mo** (+$1.26) — marketable "3/month", profitable,
  upsells to 10s for sparkles. **Recommended.**
- **1 free 10s/mo** (+$0.84) — all typical cases stay positive.
Make the free count + duration `engine_config` values. Non-Pro users pay
sparkles per the matrix.

---

## 15. Abuse / rate limiting

- Per-user in-flight cap already exists (`MAX_INFLIGHT_PER_USER` in
  enqueue-dream) — video jobs count against it.
- Add a per-user **video-jobs-per-hour** limit (video is the most expensive
  action; a scripted client could run a real Replicate bill). Server-side.
- The sparkle charge is the primary economic throttle; the webhook signature
  verify is the primary forgery defense.

---

## 16. Phased build

**Phase 0 — de-risk (~$3, do first):** `scripts/test-video-models.js` — render
4-5 real dreams through Kling/Hailuo/(budget), no-prompt vs Haiku-prompt, post
to a scratch dir. Kevin judges quality → picks the launch model(s) → we measure
true cost → lock the matrix.

**Phase 1 — MVP (owner-only, sparkle-gated):**
1. Migration: `uploads` video columns + grants + `video_model_pricing` +
   `get_feed`/`POST_SELECT` carry-through.
2. `generate-video` + `replicate-video-webhook` edge fns (Supabase Edge, NO new
   infra — Replicate runs the GPU): webhook signature verify, Haiku motion
   prompt, moderation gate (regex→Haiku + cast-gate), storage, notify. Extend
   `moderation_words` with violence/sexual-motion vocab in the migration.
3. Queue: `source='animate'`, `weight='video'`, video concurrency cap, stuck
   reaper extension.
4. Client: `videoModels.ts`, the Animate sheet, the long-press `'animate'` row,
   the post badge/button, the UpscaleModal-style "we'll notify you" post-submit,
   `enqueue-dream` animate branch (server cost recompute).
5. Playback: VideoView in DreamCard/GalleryCarousel; owner-only download gate.
6. dbspec: video cost matrix (server-authoritative), webhook idempotency.

**Phase 2:** reveal-screen entry, output frame-sampling moderation, Pro free
allotment, cross-provider failover, autoplay tuning.

---

## 17. Decisions

**Resolved (2026-07-22):**
- **Moderation = regex (`text_is_blocked`, mig 276) THEN Haiku intent
  classifier, fail-closed; extend `moderation_words` with violence/sexual-motion
  vocab; cast-source forces Surprise-Me.** (§10)
- **Infrastructure = zero new — Replicate runs the GPU; both edge fns are plain
  Supabase Edge Functions.** (§2)
- Animation is a NEW first-class post beside its source (not a replace). (§12)

**Still open (need Kevin):**
- **Final launch model(s)** — pending Phase 0 renders.
- **Pro free allotment: 3×5s (recommended) or 1×10s?** — decide after Phase 0.
- **Confirm the source dream still shows in the grid alongside the animation.**

**Resolved (2026-07-22, cont.):**
- **Autoplay muted on the active feed card** (IG/TikTok convention). Requires
  EXACTLY-ONE-PLAYING discipline in the virtualized pager (see §11 risk).

---

## 18. Risks & gotchas (consolidated — the "what could bite you" list)

Everything that could go wrong or surprise a future builder, in rough
severity order. Cross-references to the section with the detail.

**High — the reasons this was parked:**

1. **Video in the virtualized feed (§11).** THE build risk. `expo-video` in a
   recycling FlatList/VerticalPager with autoplay-muted-on-active requires
   exactly one active player at a time + pausing/releasing off-screen players.
   Get it wrong → memory leaks, multiple simultaneous audio tracks, scroll jank.
   Mitigation: a `useActiveVideoPlayer` hook keyed to the pager's active index
   (the `isActive` flag already exists). **Do this spike FIRST in Phase 1**,
   before anything else — it's the highest-uncertainty piece and could invalidate
   the whole autoplay UX if expo-video can't do it cleanly at scale.

2. **Cost runaway (§13, §15).** Video is ~20-50× an image call. A bug or a
   scripted client runs a real Replicate bill fast. Needs BOTH per-user
   video-jobs/hour limits AND a **global daily spend ceiling** — an
   `engine_config` kill-switch that disables new animations once the day's video
   spend crosses $X. Fail-loud, same discipline as the queue monitors. The
   sparkle charge is the primary economic throttle but is not a hard ceiling.

3. **Egress + storage cost (§4, §11).** A 10s mp4 ≈ 2-5 MB vs ~150 KB for a
   display image = 15-30× heavier. Autoplay-on-active streams a clip on every
   scroll-past, multiplying egress. Not a launch blocker but a metric to watch;
   reinforces why creator-only-download + rate caps matter. Confirm the CDN
   caches mp4s on GET (images do — verify, don't assume).

4. **App Store review (§10).** UGC + AI + video + real faces (cast photos) is
   Apple's highest-scrutiny content combination. Cast-gating + moderation help,
   but expect the review to look hard and possibly need an extra cycle / age-
   rating adjustment. Budget schedule for it; don't ship it in a hotfix release.

**Medium — real, but solvable if remembered:**

5. **Webhook signing secret (§6).** `replicate-video-webhook` is a public
   `--no-verify-jwt` endpoint that MINTS content. It MUST verify the Replicate
   webhook signature (constant-time compare, like `revenuecat-webhook`). The
   signing key is issued when you configure the webhook → store in Supabase Edge
   secrets. Skipping this = an unauthenticated content-minting/forgery hole.

6. **Poster / thumbnail frame (§4, §11).** Grid tiles + the pre-play state need
   a still. Cleanest: reuse the SOURCE dream image as the poster (it's the exact
   first frame, already stored). Don't forget `video_poster_url` exists.

7. **Stuck-job reaper (§5).** A video prediction that never webhooks (Replicate
   drop) hangs the queue row forever. `refund-stuck-jobs` must be extended with
   a LONGER ceiling for `awaiting_webhook` video jobs (~15 min vs the image
   5 min) → refund + notify. Don't reuse the 5-min image timeout.

8. **Server-authoritative cost (§13).** The client's displayed sparkle cost is
   confirmation only. `enqueue-dream` MUST recompute `cost(model, duration)`
   from the DB and charge that (idempotent on job_id). A curl with a spoofed
   cheap cost otherwise = free premium video. This is audit hard-rule S2.

9. **Column-level grants (§4).** Per migration 278, new `uploads`/`users`
   columns are silently client-invisible until `GRANT SELECT (col)`. Every new
   video column (media_type, video_url, poster, duration, source_upload_id) needs
   its grant IN THE SAME migration, or the client can't read it.

10. **Video moderation ≠ image moderation (§10).** You can't NSFW-retry a video
    like a Flux image. The prompt gate (regex→Haiku) + already-moderated source
    + cast-gating cover launch; frame-sampling is the phase-2 backstop. Don't
    assume the image NSFW path "just works" for video output.

**Low — nice-to-remember:**

11. **Feed interaction (§12).** Source + animation are two posts from the same
    user, minutes apart. The diversity pass (max 2 consecutive same-author) +
    the impression penalty (mig 388/390) should keep them from stacking, but
    verify the pair behaves in Phase 0/1.

12. **Model landscape is stale-by-months.** This doc's model/price facts are
    July 2026. Re-verify Kling/Hailuo slugs, versions, and per-second pricing at
    resume time — this category changes monthly.

13. **Aspect ratio is NOT a risk** (dreams 9:16 = model output 9:16). Noted here
    only so a future reader doesn't re-open it.
