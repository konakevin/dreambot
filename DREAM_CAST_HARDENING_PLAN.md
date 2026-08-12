# Dream Cast Photo Hardening — Plan

**Status:** SPEC (not built). Authored 2026-08-11 after the "tiffany" incident + two codebase
research passes (cast upload/save flow; the swap detector/identity infra).

## The problem (root-caused, real)

User `tiffany` (84194185) posted nightly dreams with **random strangers instead of her + her
partner**. Forensics (`ai_generation_log.fallback_reasons`):
- Her **partner** cast photo is a phone snapshot of a **faded printed GROUP photo** (4+ faces,
  glare, the intended man small + shadowed under a cap brim). The YuNet detector can't get a clean
  ArcFace embedding of "the partner" → `identity_sim` **0.03–0.14 every attempt** (threshold 0.35).
- Her **self** photo is fine (0.58–0.72). Only the partner fails.
- On the film_noir dual: partner failed the gate → re-render ladder still failed → tried to degrade
  to solo-tiffany → **gender guard refused** (can't put her female face where a man belongs) →
  cascade exhausted → shipped the **raw Flux render with random faces** (`face_swap_mode=null`).

So the **guards worked** (they refused to paste a wrong/low-confidence face). Two gaps remain:
1. **We let an unusable photo become a cast source in the first place.** The only current cast gate
   is a description-length heuristic (`d.description.length < 20`) — `describe-photo` happily
   describes a group photo and passes it. No face/quality gate exists on the cast path.
2. **The failure fallback is terrible** — a render full of random strangers reads as "broken." It
   should be a **pure-scene** dream (a nice landscape, no people).

Scope check: NOT a global outage (Kevin's own nightly swapped fine; ~5–14%/day typical). But **9 of
23 recent swap users hit ≥1 failure**, tiffany fails every time — enough tail to fix hard.

---

## The unlock (from research): reuse the swap's OWN detector

The real ML runs on the **Fly.io `face-swap-dual` service** (`services/face-swap-dual/`, Deno +
onnxruntime WASM), NOT the Supabase edge fn:
- **YuNet** (`yunet.onnx`) detection → `src/faceDetect.ts` (`detectFaces`, score thr 0.6, 5-pt landmarks).
- **ArcFace MobileFaceNet** (`w600k_mbf.onnx`, 512-d) → `src/faceEmbed.ts` (`embedFace`, `cosine`,
  `verifyDualIdentity`/`embedReference`). **This is where `identity_sim` is born.**
- Thresholds in `_shared/dualSwapPipeline.ts`: `IDENTITY_MIN_SIM` **0.35**, `IDENTITY_DEGRADE_FLOOR`
  **0.15**.
- The service already exposes **`POST /detect`** (face count + per-face bbox + gender + score) and
  **`POST /verify`** (`src/index.ts`). An upload-time probe is mostly composition, not new inference.

**Because the score comes from the same YuNet + ArcFace that gate the real swap, "embeddable +
big-enough + frontal at upload" is a direct predictor of clearing 0.35 at render time.** Any
independent detector would drift from the actual gate.

---

## Lever A — REJECT bad cast photos at upload (prevention)

### A1. New `POST /analyze` on the Fly service (`services/face-swap-dual/src/index.ts`)
Sibling to `/detect` + `/verify`, same Bearer auth. Input `{ imageUrl }` (the signed `cast-photos`
URL the client already mints). Internally: `decodeImage` → `detectFaces` (with landmarks) → for the
largest face compute bbox-fraction, `score`, run `embedFace` (confirm a clean embedding extracts),
`classifyFaceGender`, and derive a **frontal score** from the 5-pt landmarks (eye-line level, nose
centered). Output:
```
{ faceCount, primary: { bboxFrac, score, gender, embeddable, frontalScore }, suitable, reason, ms }
```
`suitable` = exactly 1 face AND bboxFrac ≥ floor AND score ≥ ~0.6 AND embeddable AND frontal enough.
Cost ~200–400ms on a warm machine, **$0 marginal** (models already cached). Reasons:
`no_face | multiple_faces | face_too_small | not_frontal | occluded | not_embeddable | low_quality`.

### A2. Server-authoritative gate (edge fn — un-bypassable)
The client can't be trusted. Add the check to the **only** cast-path edge fn, `describe-photo`
(`supabase/functions/describe-photo/index.ts`), OR a thin new `analyze-cast` edge fn: after auth +
rate-limit, call the Fly `/analyze` (mirror the `flyProbe` pattern in `_shared/singleSwapGuard.ts:124`
so the Fly token stays server-side). If `!suitable`, return **HTTP 422 `{ reason }`** and do NOT
return a description. (Belt-and-suspenders: `classify-photo` already returns a `face:
clean|multi|none|unclear` + `num_people` signal we could also fold in — but `/analyze` is the
authoritative predictor because it's the swap's own embedder.)

### A3. Client — block the store write on reject (both paths)
There are **two parallel upload implementations** (must fix both, or unify first):
- `lib/castUpload.ts` (Settings roster) — the reject point is the `description.length < 20` block at
  ~`:118-126`. Replace with the 422/verdict check; on reject `cleanup()` the orphaned upload +
  `throw` a typed error carrying `reason`.
- `components/onboarding/DreamCastStep.tsx` (onboarding + Edit Profile) — mirror block at ~`:456-476`.
  On reject: `removeCastMember(role)` + storage cleanup + reason-specific alert + `return`.
The gate must run **before** the store write (`setCastMember`/`addPartner`/`updatePartner`) so bad
data never enters `recipe` (and thus never `saveVibeProfile` → `user_recipes`). Reason-specific copy:
"That looks like a group photo — pick a solo shot", "Face is turned away", "Too blurry / low light",
"We couldn't find a clear face". Reuse the existing `CastNotRecognizedError` + re-pick alert UX
(`DreamCastRoster.tsx:132-147`).

### A4. Backfill existing cast photos
Run `/analyze` over every stored `cast-photos` object (from `user_recipes.recipe.dream_cast` +
`partner_library`). Flag unsuitable ones; notify those users to re-upload (in-app inbox row +
push). **Tiffany first.** Optionally auto-deactivate a known-bad active partner so her dreams stop
shipping strangers until she re-uploads.

---

## Lever B — PURE-SCENE fallback when a swap fails (graceful failure)

Kevin's call: if the face-swap **scores too low or fails** during a dream, ship a **pure-scene dream
(no people)** instead of random-faced strangers.

**Where:** the render pipeline (`nightly-dreams` / `generate-dream` / the shared engine), at the
point the swap cascade gives up — today that's `dualSwapPipeline.ts` returning a no-usable-swap
state (reasons `identity_below_threshold` after the re-render ladder, `dual_degrade_cascade`,
`dual_degrade_single_refused_gender`, `degrade_solo_swap_unsafe`, `hard_fail:face_swap`).

**Two flavors:**
- **Reactive (the ask):** when the swap cascade fails, **re-render the same dream as `pure_scene`**
  — regenerate the Flux prompt with the character/face-swap framing stripped (scene only, same
  place/medium/mood), and ship that. One extra Flux call, only on the failing minority.
- **Proactive (cheaper, complementary):** at dream time, if the selected cast member is
  known-unusable (from the A1 `/analyze` verdict cached on the cast, or a quick pre-check), route to
  `pure_scene` from the start — no wasted swap attempt. Prevents the "strangers" render entirely for
  users with a bad photo who haven't re-uploaded yet.

Either way the invariant becomes: **a face-swap dream never ships with faces that aren't the user's.**
It's their real place as a beautiful empty scene, or it's them. Never strangers.

**Note:** `epic_tiny` and `embodied` already avoid this (no realistic face swap). This is specifically
the `character` face-swap path.

---

## Rollout

1. **Ship `/analyze`** on the Fly service (+ deploy Fly) and the `analyze-cast` server gate. Dark:
   log the verdict on every upload without blocking, to calibrate thresholds against real photos.
2. **Turn on the upload block** (both client paths) once thresholds are calibrated. Reason-specific UX.
3. **Pure-scene fallback** in the render pipeline (reactive first; proactive after). Behind a flag,
   verified with a forced low-identity render (a QA hook feeding a known-bad cast).
4. **Backfill** — analyze existing cast photos, notify + optionally deactivate bad active partners,
   tiffany first.

## Open questions
1. **Hard block vs strong warn** at upload — reject outright, or allow "use it anyway" with a warning?
   (Recommend hard block for the ACTIVE/self slots; the dreams are only as good as the source.)
2. **`suitable` thresholds** — bboxFrac floor, frontal tolerance, min score. Calibrate in phase 1
   against real cast photos (log-only) before enforcing.
3. **Pure-scene vs skip** on failure — a scene dream, or skip the dream that night? (Recommend scene;
   a dream every night is the promise.)
4. **Re-render cost** — reactive re-render is one extra Flux call per failure; proactive avoids the
   wasted swap. Ship reactive first (simplest), add proactive once `/analyze` verdicts are cached.

## Key files
- Detector/identity: `services/face-swap-dual/src/faceDetect.ts` (YuNet+gender),
  `.../faceEmbed.ts` (ArcFace `identity_sim`), `.../faceDetectMath.ts` (bbox/landmarks),
  `.../index.ts` (`/detect`,`/verify` → add `/analyze`), `.../imageCodec.ts`.
- Thresholds: `_shared/dualSwapPipeline.ts` (0.35 / 0.15), `_shared/singleSwapGuard.ts:124` (`flyProbe`).
- Upload flow: `lib/castUpload.ts:118-126`, `components/onboarding/DreamCastStep.tsx:456-476`,
  `components/DreamCastRoster.tsx`, `store/onboarding.ts`, `lib/saveVibeProfile.ts`,
  `supabase/functions/describe-photo/index.ts`, `supabase/functions/classify-photo/index.ts`
  (reusable `face` signal), `_shared/vision.ts` (prompts + "Never refuse").
- Fallback: `nightly-dreams/index.ts`, `generate-dream/index.ts`, `_shared/dualSwapPipeline.ts`.
