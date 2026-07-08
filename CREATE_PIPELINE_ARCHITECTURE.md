# Create Dream Pipeline — Architecture Reference

> Full-system trace, 2026-07-07. Every path a text prompt or user image can take through
> Create, verified against code with file:line precision at trace time. Companion docs:
> `QUEUE_WORKERS_REFACTOR.md` (queue reliability), `MEDIUMS_FAQ.md` (medium flags),
> `DLT_FIDELITY_PLAN.md` / `DLT_PUT_ME_IN_SCENE_PLAN.md` (DLT, currently flagged OFF).

## 0. The mental model

There are no named UX modes. Create's mode is **implicit**: what the user provides
(photo / prompt / neither) × two toggles (Engine tab: DreamBot|Direct, shown only
without a photo; Photo tab: New Scene|Restyle, shown only with one). The store's
`mode: 'surprise'|'photo'|'prompt'` is analytics-only. Routing is driven by
`photoBase64`, `photoStyle`, and `useExactPrompt`.

One UUID flows through everything:
`job_id == dream_queue.id == dream_jobs.id == sparkle_transactions.reference_id`.
Client mints it (`useDreamCreate`), all charges/refunds/completions key off it.

**The seven effective paths:**

| # | Inputs | Render fn | Prompt writer | Image model input | Face swap |
|---|---|---|---|---|---|
| 1 | text, DreamBot | generate-dream | Sonnet (compiler brief) | text only | if self-insert detected + medium natural |
| 2 | text, Direct | generate-dream | none (verbatim) | text only | never (cast suppressed) |
| 3 | photo + New Scene, person | generate-dream | Sonnet (self_insert brief) | **text only — pixels dropped** | yes: uploaded photo is the swap source |
| 4 | photo + New Scene, non-person | generate-dream | Sonnet (pure_scene brief) | text only | never |
| 5 | photo + Restyle | **restyle-photo** | none (kontext_directive template) | **true img2img** (edit models) | never |
| 5b | photo + Restyle, pool-managed medium (LEGO/Vinyl) | restyle-photo | Sonnet (flux_dev_prompt_template) | text only (pixels dropped — rebuild) | never |
| 6 | `photo_style:'reimagine'` | generate-dream | **Haiku** | text only | if medium natural |
| 7 | DLT (`dlt_recipe`/`style_prompt`) | generate-dream (or restyle) | Sonnet, recipe-locked | per recipe | per medium |

Legacy/dormant: #6 reimagine is server-supported but the UI never sends it; DLT (#7) is
`DLT_ENABLED=false`; `extract-style` edge fn has **zero callers** (DLT passes raw
`style_prompt` instead).

**The single most important invariant:** in every "photo → new scene" path, the photo's
pixels NEVER feed the image model. The photo is (a) described to text by Haiku vision,
which drives the Sonnet brief, and (b) held back as the FACE-SWAP SOURCE, pasted onto the
finished render. Only Restyle (#5) does true img2img. (`photoOverrideMode='flux-dev'`
forces `effectiveInputImage=undefined` in generate-dream.)

## 1. Client (app/(tabs)/create.tsx + hooks/useDreamCreate.ts)

- Photo attach: consent gate → camera/library → ImageManipulator resize to
  `engine_config.photoPreprocessWidth` (1024) q0.8 JPEG base64. At submit,
  `cropToPortrait` center-crops 9:16. Travels as inline `data:image/jpeg;base64,...`
  in `input_image` — no client-side storage upload for inputs.
- New Scene pre-classifies via **classify-photo** BEFORE any charge:
  Haiku returns pipe-delimited `TYPE|description`
  (person/group/animal/object/scenery/unclear). group/unclear → confirm modal on the
  loading screen; the result rides as `subject_type`+`subject_description` so the server
  skips a second vision call. Restyle skips classification.
- Text prompt → `hint` (trimmed, empty→undefined=surprise). Max length
  `engine_config.promptMaxLength` (2000; DLT screen hardcodes 300). Client
  `moderateText` is a slur-list only; the DB trigger is real enforcement.
- Cast: NOT selectable per-request. The whole VibeProfile (`user_recipes.recipe`) is
  sent as `vibe_profile`; a "face lamp" mirrors the server's self-insert detector
  (`lib/selfInsertDetect.ts`, word lists from engine_config).
- Model pickers: main ModelPicker (account-sticky `users.pro_mode_flux_model`, default
  flux-1.1-pro) vs RestyleModelPicker (device-sticky, default Flux 2 Pro; Kontext
  Pro/Max, Seedream, Nano Banana Pro=5✦). Either lands in `force_model`.
  Pool-managed restyle mediums (client_meta.restyle_models) hide the picker and send
  `force_model:null`.
- Surprise tiles resolve CLIENT-side at submit: `surprise_me_face`→random
  `face_swaps=true` medium, `surprise_me_art`→false; vibe `surprise_me` resolves
  server-side.
- Submit: Dream button only navigates to `/dream/loading`; the loading screen calls
  `generate()`. Double-submit guard 2.5s. Cost precheck → premium gate.
- Loading screen: realtime on `dream_queue:id` (status/upload_id) + 6s backstop poll +
  `dream_jobs` recovery poller (5s×18, 12s no-job grace). `completed`→reveal;
  `dead_letter`→failure card (already refunded).

## 2. Queue (enqueue-dream → dream_queue → dream-queue-worker)

- enqueue-dream: auth → (first_dream/retry branches) → in-flight cap 5 → idempotent
  `charge_sparkles` (cost = force_model price or baseSparkleCost) → weight classify →
  seed `dream_jobs` (status processing, full payload) → insert `dream_queue`
  (source create|dlt, dedup_key `create:<jobId>`) → kick worker.
- **Weight**: heavy iff photo-swap (`input_image` + style≠restyle) OR `force_cast_role`
  OR (has cast AND (empty hint OR self-insert detected)). Everything else light.
  Heavy=Fly-bound. Caps enforced atomically in `claim_dream_queue_jobs_by_weight`
  (advisory lock; light 40 / heavy 10, engine_config-tunable).
- Worker routes by `payload.photo_style==='restyle' ? restyle-photo : generate-dream`
  (source create/dlt), holds the connection synchronously (120s timeout, waitUntil is
  dead), render owns terminal state. Retry backoff 1m/5m/30m/2h via future
  `created_at`; 5 attempts or permanent error (nsfw:, source unreachable) → dead_letter.
- **Refunds happen ONLY at dead-letter** (`refund:queue_dead_letter:*`, idempotent),
  plus enqueue-insert failure. Transient retries never refund. NSFW = terminal +
  `dream_jobs.status='nsfw'` (retry endpoint refuses those).
- first_dream: free, heavy, tier cascade (dual→self→plus_one/pet→scene), IP-limited,
  one active per user (partial unique index).

## 3. generate-dream internals

Order: sanitizeUserText on all 5 user strings → auth (queue path = service role +
job row lookup) → DLT recipe validate/anchor → charge (idempotent re-charge no-op) →
resolve medium/vibe from DB (unknown → canvas/cinematic fallback + fallback_reason) →
branch (see table) → `sanitizePrompt` (NSFW softening) → model pick → render → swap →
persist.

- Brief assembly (user creates): `expandScene` (NOT sceneEngine — that's nightly-only)
  + `rollChaos/applyChaos` (skipped for dual + DLT) + `compilePrompt` with sections
  RENDER FORMAT(DLT) → SCENE(SACRED) → FOCAL ANCHOR → CHARACTER → USER INTENT → CAMERA
  → STYLE → MOOD → NEVER INCLUDE(profile.avoid) → RULES. Sonnet primary, Haiku
  fallback, then compiled fallbackPrompt, then template.
- VibeProfile fields still consumed by render: `dream_cast` + `avoid` ONLY (favorites
  removed 2026-06-02).
- Model pick precedence: force_model → kontext mode → model_overrides table →
  medium.allowed_models pool → flux-1.1-pro. Dual swap clamps ultra→pro
  (`dual_ultra_clamped_to_pro`) and forces jpg output.

### Face-swap decision tree

- Eligibility = `medium.character_render_mode === 'natural'` (NOT the `face_swaps`
  flag — that drives UI/pools).
- Cast selection: force_cast_role ('dual'|'self'|'plus_one'|'pet') → else
  detectSelfInsert referenced roles → clamp to ≤2. Dual = exactly 2 (self+plus_one),
  side order randomized (cast[0]=LEFT drives brief AND sources).
- Dual brief: `runCharacterSlotPipeline` — Sonnet writes ONLY
  scene_description/wardrobe/mood/props; ALL geometry hardcoded; scene_description
  placed AFTER the framing block (hard rule — front-loading it shrank couples →
  no_dual_split → merged faces).
- Dual swap: `genderSafeDualSwap` strict on Create — attempt → rerender ×2 (85s
  budget) → refund. Create NEVER degrades dual→single (nightly does). Transport:
  Fly.io `face-swap-dual` (2GB, YuNet detect + genderage split) via
  dualSwapDispatch; Supabase fallback crops fixed 55/55.
- Single swap: `ensureSoloSwapTarget` probes with `classifyDualGenders` (Haiku
  "N|left|right"); wrong gender/0 faces → rerender with "exactly one person" prefix →
  refund if unsafe. Swap chain cdingram → yan-ops → pikachupichu25, 3 retries,
  source perturbation cache-bust.
- Sources: stored cast = 1h signed URLs from private `cast-photos` bucket (minted per
  render by hydrateCastSources, never persisted); uploaded-photo base64 → temp
  `uploads/temp/` upload first. face_swap_mode ('dual'|'single') on the uploads row
  **blocks HD upscale** (422 hd_unavailable_face_swap).

## 4. restyle-photo internals

- Queue-integrated same as generate-dream (`x-dream-queue`, worker-routed). Client
  always sends mode flux-kontext, NO hint (prompt box hidden in Restyle UI — hint is
  accepted server-side but unused by the live client).
- Three prompt paths: (1) `flux_dev_prompt_template` mediums (LEGO/Vinyl pools) =
  vision describe → Sonnet → flux-dev TEXT rebuild, pixels dropped; (2)
  `kontext_directive` mediums = identity-grammar template + vibe grade + recognizability
  clause, TRUE img2img; (3) generic fluxFragment fallback.
- Restyle model precedence: client_meta.restyle_models pool → client_meta.restyle_model
  → auto pick; force_model overrides all.
- Edit-model input schemas are per-model (seedream `image_input[]` size 2K; flux-2-pro
  `input_images[]`; kontext `input_image` + `prompt_upsampling:false` — identity
  killer, keep off). Gemini (Nano Banana) gets the source image → edits.
- Never face-swaps, never auto-upscales.

## 5. Vision/text functions

- **describe-photo**: Haiku vision, onboarding cast + first-dream kickoff ONLY.
  Output format is sanitizer-safe by design: inline `AGE:`/`TRAITS:` word-boundary
  labels, `Male|Female, build` header (sanitizeUserText strips newlines/braces —
  never build a \n- or JSON-anchored vision parser).
- **classify-photo**: Haiku, pipe format `TYPE|description`, client-called pre-charge
  for New Scene only.
- **extract-style**: DORMANT, zero callers.
- Sanitization layers, in order: `sanitizeUserText` (entry + inside describeWithVision
  + castResolver; injection defense, per-field caps hint 240 / subject 400 / vision
  1200) → `sanitizeUserPrompt` (compiler-level, newlines/brackets, 240) →
  `sanitizePrompt` (NSFW/minor softening, last before the image model).

## 6. Persistence + observability

- persistToStorage → `uploads/<userId>/<ts>.{png|jpg}`; display variant + thumbhash
  built in background. uploads row: ai_prompt=finalPrompt, recipe (buildRecipe: LOOK
  only — model/seed/medium/vibe/prefix/palette blocks + hint; NEVER cast/scene —
  privacy invariant), face_swap_mode, is_public:false, 768×1664.
- ai_generation_log per attempt (brief, raw response, vision description,
  fallback_reasons, cost_cents, timings); dream_jobs flipped done/failed/nsfw with
  result_*; completeQueueJob sets dream_queue completed+upload_id; notification
  `dream_generated·manual` only if notify_on_complete (user backgrounded/queued).
- Stage breadcrumbs: claimed → resolve → sonnet_brief → flux_render → face_swap →
  upload → persist (`dream_queue.current_stage`; forensics via
  `scripts/check-forensics.js` / dream_forensics RPCs).

## 7. Known cruft / watch-outs (as of 2026-07-07)

- `reimagine` photo_style: server alive, UI never sends. `extract-style`: dormant.
  DLT: built end-to-end but `DLT_ENABLED=false`.
- SCENE_ONLY/CHARACTER/NIGHTLY_SKIP hardcoded Sets duplicated in edge + client
  dreamAlgorithm.ts must mirror the DB (MEDIUMS_FAQ tech-debt note).
- `restyle` accepts `hint` server-side but the client hides the prompt box — a future
  "restyle with instructions" feature is one UI toggle away.
- generate-dream rejects photo+restyle (400) — restyle moved to its own function;
  don't re-add.
- Legacy sync path (`DREAM_QUEUE_ENABLED=false`) still exists in the client and calls
  generate-dream/restyle-photo directly.
