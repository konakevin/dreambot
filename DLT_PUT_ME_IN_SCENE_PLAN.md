# DLT Enhancements — "Put Me In This Scene" + Flux Engine Preservation

> **Status:** PLAN ONLY — not built. Captured 2026-05-08 to revisit later.
> Two related Dream Like This (DLT) enhancements bundled in one design pass.

## Why these two together

Both are about **honoring the source post's identity** when a user does a DLT.
Today, DLT inherits medium + vibe but loses other meaningful signals from the
reference render. These two features close that gap:

1. **Preserve the Flux engine** the source was rendered with — so a render that
   landed perfectly on `flux-1.1-pro` doesn't get re-rolled on `flux-dev` and
   come out looking different.
2. **"Put me in this scene"** — let the user face-swap themselves into the
   exact original image, same scene, same pose. The simplest, most magical
   form of "make this dream about me."

---

## Feature 1 — Preserve the source post's Flux engine

### Today's behavior
DLT picks a fresh Flux model at generation time via the model picker
(based on medium's `allowed_models` + random pick). The source post's
`uploads.model_used` is read but only for display, not as a generation lever.

### New behavior
When a user taps Dream Like This on a post:
- Read `source_post.model_used`
- Pass through to `generate-dream` Edge Function as `force_model`
- Edge function honors `force_model` if provided, skipping the model picker
- Falls through to the picker if `force_model` is missing or no longer allowed
  for the chosen medium (defensive)

### Files to touch
- `app/dreamLikeThis.tsx` — load `model_used` when the source post is fetched
- `lib/dreamApi.ts` — add `forceModel?: string` param on the generate request
- `supabase/functions/generate-dream/index.ts` — at the model-picker call site,
  prefer `body.force_model` if present and present in `medium.allowed_models`
- No schema migration needed — `uploads.model_used` already exists (written
  at line 1057 of `generate-dream/index.ts`)

### Cost / risk
- Zero new Sparkle cost — same single render
- Tiny risk: source's model is no longer in `allowed_models` for the medium
  (e.g., we removed it from a medium config). Solution: fall back to picker
  with a soft toast.

---

## Feature 2 — "Put me in this scene"

### What it does
A toggle on the DLT screen. When ON:
- Skip the text-prompt / photo-upload UI (irrelevant)
- Backend uses the **original post's `image_url`** as the face-swap target
- User's stored **self cast photo** (set during onboarding) is the source
- Calls existing single-face `faceSwap()` pipeline
- Result: same scene, same pose, user's face on the character

### Why a toggle (not a catchphrase)
- Single-face only by design (no plus_one) — explicit toggle communicates
  this clearly without users having to discover the catchphrase
- Tap-it-and-go is faster than typing the phrase
- Catchphrase would also work but is harder to gate (e.g., users typing it
  on dual-cast posts where it can't disambiguate)

### Toggle UI rules
- **Greyed out + tooltip** *"Add your photo in onboarding to use this"*
  when user has no `dream_cast.self`
- **Hidden** when source post is dual-cast (two faces — ambiguous which to
  swap; avoid the edge case for v1)
- **Available** when source post has a recognizable character; if face-swap
  fails (e.g., pure landscape), surface a friendly toast: *"This scene has
  no one to swap into — try a post with a character."* No client-side face
  detection needed.

### Cost
- 1 sparkle (matches other dreams), but actual cost ~$0.013 vs $0.025 — a
  bit cheaper since no Flux call
- Decision: still charge 1 sparkle. Simpler economy, no surprise discount.

### Files to touch
- `app/dreamLikeThis.tsx` — new "Put me in this scene" Switch/checkbox UI
  component, branch logic that hides the prompt + photo inputs when ON,
  enabled-state check tied to `dream_cast.self`
- `hooks/useDreamCast.ts` (or equivalent) — read user's stored self cast
  for the toggle's enabled-state
- `lib/dreamApi.ts` — new params: `putMeInScene?: boolean`,
  `sourcePostId?: string`
- `supabase/functions/generate-dream/index.ts` — new `mode === 'put_me_in_scene'`
  branch that:
  - Resolves source post (`uploads` row by id)
  - Loads user's self cast (or fails fast with friendly error)
  - Calls existing `faceSwap()` from `_shared/faceSwap.ts` with
    `target = source.image_url`, `source = user.self_cast_url`
  - Writes the swapped output to storage, inserts `uploads` row,
    pin-to-feed if applicable
- No schema migration — we read existing fields

### Edge cases
- **Source post deleted** between when user taps and submits — fall back
  to "post not found" toast
- **Dual-cast source** — toggle hidden client-side (already covered)
- **Pure landscape source (no detectable face)** — face-swap fails;
  return clean error, refund the sparkle, friendly toast
- **User's self cast photo missing** — toggle disabled with tooltip
- **Cost-side safety** — if the Flux call is skipped but face-swap fails
  AND no upload row was created, refund. Match existing
  `refund-self-moderation` pattern.

---

## Open questions to confirm with Kevin before building

1. **Cost confirmation** — 1 sparkle even though no Flux call? (My recommendation: yes — simpler economy.)
2. **Greyed-vs-hidden when no self cast** — show the toggle as disabled
   with tooltip, or hide it entirely? (My recommendation: greyed + tooltip
   so users know the feature exists and how to enable it.)
3. **Dual-cast source posts** — for v1, just hide the toggle entirely?
   (My recommendation: yes for v1. v2 could let user pick which face to
   swap.)
4. **Eventual catchphrase add-on** — Kevin floated "put me in this scene"
   as a typeable phrase too. Worth considering as v2 once the toggle is
   live and we have telemetry on usage. Keep toggle as primary surface.
5. **Where does the "Put me in this scene" toggle visually live on the
   DLT screen?** Above the prompt/photo area, before the Generate button,
   with a small mascot-voice description like *"Skip the prompt — I'll
   paint your face into this exact scene."*

---

## Implementation order (when we revisit)

**Phase 1 (small, safe):**
- Feature 1 only — flux engine preservation. ~1-2hr. No new UI, just a
  param flow + edge function tweak. Low risk, immediate quality bump.

**Phase 2 (medium):**
- Feature 2 — "Put me in this scene" toggle, full UI + backend mode + edge
  cases. ~3-4hr.

**Phase 3 (optional, later):**
- Catchphrase / natural language detection in Create mode for "put me in
  this" — more polish, telemetry-dependent.

---

## Reference links to existing code

- DLT screen: `app/dreamLikeThis.tsx` (~545 lines)
- Generate API client: `lib/dreamApi.ts`
- Edge function: `supabase/functions/generate-dream/index.ts`
- Face-swap pipeline: `supabase/functions/_shared/faceSwap.ts`
- Schema: `uploads.model_used` exists; `users.dream_cast` already populated
  during onboarding
