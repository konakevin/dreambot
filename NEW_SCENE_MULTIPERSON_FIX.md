# New Scene — Multi-Person Photo Fix

**Status:** proposed, not started · **Author:** investigation 2026-09-07 (session `01WXxrfAGkM9ivzvdxYXb3HE`) · **Owner:** TBD

**One line:** When a user uploads a photo with 2+ people and asks to be put in a new scene, we silently
route to an image-EDIT model (`bytedance/seedream-4`) that barely transforms the photo, so the result
looks like a filtered version of the original. Offline testing shows `google/gemini-2-image` (Nano
Banana) fixes it **at the same 1-sparkle price**. The fix is essentially a one-model swap.

---

## 1. Problem statement

**What the user sees.** A user uploads a casual photo of two (or three) people and types a transformative
scene ("us at a Victorian tea party", "we are hippies with flowers in our hair", "us in regency gowns
dancing"). They expect a real dream — new outfits, new world, their faces in it. Instead they get back
something that looks like their original photo with a light filter: same clothes, same pose, faces
subtly re-rendered and often waxy/melted, especially older faces. It does not read as an AI render.

**Why it matters.** We implicitly sell this as a face-swap-grade experience, but multi-person photos
never touch the real face-swap pipeline. The gap between what the flow promises and what it delivers is
the whole complaint.

**Triggering incident (2026-09-07).** User `michele` (`d3230549-f8fe-49a4-8088-ba6da6992bdc`) posted a
batch of grandmother-and-granddaughter dreams. All were "processed versions of the original." Kevin
flagged them. This doc is the result of investigating that batch. (Her renders were never touched;
diagnosis was read-only, tests were offline.)

---

## 2. How the flow works today

The relevant path is the **New Scene reference route** (see `NEW_SCENE_QUALITY_PLAN.md`).

1. **Upload + classify.** The client uploads the photo (as a base64 data URI in the enqueue payload) and
   `classify-photo` returns structured signals: `num_people`, `num_animals`, `face` ("clean"/…),
   `subject_type`, `subject_description`.

2. **Routing fork** — `_shared/newSceneDirective.ts` → `routeNewSceneSubject(sig)`:
   - `people === 1 && animals === 0 && face === 'clean'` → **`solo_swap`** — the real exact-face swap onto
     a freshly generated scene.
   - **everything else** (including **2+ people**) → **`reference`** mode, kind = `people` /
     `person_pet` / `pet` / `object` / `scene`.

   So a 2-person photo can NEVER get the real swap. It gets the reference path, whose instruction is:
   > "Recompose the people from this photo into the new scene. Keep EACH person's exact face, age, hair,
   > and build…"
   This is an **edit of the uploaded photo**, not a generate-and-swap.

3. **Model selection** — `_shared/newSceneDirective.ts` → `newSceneModel({ stylized, tier })`:
   ```
   if (tier === 'best') return 'google/gemini-3-image-preview';   // Nano Banana Pro (5 spk)
   return stylized ? 'google/gemini-2-image'                       // Nano Banana (1 spk)
                   : 'bytedance/seedream-4';                        // Seedream (1 spk)  ← photoreal standard
   ```
   A **photoreal medium** (e.g. `photography`) is NOT `stylized`, and standard tier is the default, so the
   render uses **`bytedance/seedream-4`**. Invoked in `generate-dream/index.ts` (the New Scene REFERENCE
   block, ~line 810) with `image_input: [inputImage]`, `size: '2K'`, `aspect_ratio: 'match_input_image'`
   via `_shared/generateImage.ts`.

4. **Result.** Seedream is described in our own code as the "photo-faithful budget workhorse" and in the
   app as "stays closest to your original photo, with a lighter artistic touch." It does exactly that:
   keeps the original clothing/pose and lightly repaints. That is the "processed original" look.

---

## 3. Root cause

Two compounding issues:

1. **Wrong model for the intent.** For "put us somewhere new and transform us," the standard-tier
   photoreal reference model is Seedream, which is optimized to stay close to the source. It can't deliver
   a real transformation, and it re-renders faces imperfectly (older faces get waxy).

2. **Structural expectation gap.** 2+ people can't use the real face swap at all (`routeNewSceneSubject`
   requires exactly one clean face). Users don't know they've dropped into a lower-fidelity edit path.

Note: this is **not** a prompt problem. The assembled prompts are fine and explicit ("keep each person's
exact face, age…"). The model is the bottleneck.

---

## 4. Research — offline model comparison

**Method (all offline, read-only).** Pulled Michele's actual source photo from the `dream_queue` payload
data URI, and the exact production prompts she generated (from `uploads.ai_prompt`). Ran the **verbatim
production prompt + source image** through 5 models using the **same input shapes `generateImage.ts`
uses** (Replicate `image_input`/`input_image`; Gemini `inlineData`). Two scenes she actually typed:
"regency gowns at a ball dancing with handsome dandies" and "hippies with flowers in our hair." Outputs
saved to local files only — nothing written to the DB, nothing posted. Harness:
`scratchpad/model_test.mjs`. Comparison strips were shared to Kevin's device (`COMPARE_hippies.jpg`,
`COMPARE_regency.jpg`).

**Results.**

| Model | Cost | Regency ball | Hippies | Verdict |
|---|---|---|---|---|
| **Seedream** `bytedance/seedream-4` (CURRENT default) | 1 spk | Both in gowns but no "dandies"; stays close to source | **Failed the intent** — just added flower crowns to the ORIGINAL puffer vest + zip-up + pose; waxy face | The cause of the complaint |
| **Nano Banana** `google/gemini-2-image` | **1 spk** | Excellent — full ballroom, both cast in period gowns, a dandy, **best likeness** (both clearly themselves, glasses kept, girl still a child) | Excellent — boho outfits, flower crowns, festival, face paint, likeness kept | **Best value — same price as Seedream** |
| **Nano Banana Pro** `google/gemini-3-image-preview` | 5 spk | Excellent — richest scene, musicians, added the dandies she asked for; slight age-up of the grandmother's face | Excellent — forest, boho, likeness good | Best absolute, but 5× cost |
| **Flux 2 Pro** `black-forest-labs/flux-2-pro` | 1 spk | **Dangerous — merged the two people into ONE and dropped the grandmother** | Good | Too inconsistent for multi-person |
| **Flux Kontext Max** `black-forest-labs/flux-kontext-max` | 2 spk | Aged the child into a teenager; grandmother identity drifted | Aged the child again; weak transform | Poor at age/identity for multi-person |

**Headline:** Nano Banana (`google/gemini-2-image`) is **1 sparkle — identical to Seedream** — and was
consistently the best or tied-best on both scenes, including likeness and preserving the child's age. The
fix is cost-neutral.

**Pricing reference** (`_shared/modelPricing.ts`): seedream-4 = 1, gemini-2-image = 1, gemini-3-image =
5, flux-2-pro = 1, flux-kontext-max = 2.

---

## 5. Proposed solution

### 5a. Primary fix (cost-neutral): route multi-person reference renders to Nano Banana

In `_shared/newSceneDirective.ts`, make the standard-tier model depend on the routed **kind**, not just
`stylized`. Multi-subject kinds (`people`, `person_pet`) should use Nano Banana even for photoreal
mediums:

```ts
// sketch — the implementer should confirm the exact signature/threading
export function newSceneModel(opts: { stylized: boolean; tier: NewSceneTier; kind?: NewSceneSubjectKind }): string {
  if (opts.tier === 'best') return NEW_SCENE_MODEL_NANO_BANANA_PRO;
  // Multi-person edits are unreliable on Seedream (stays-close-to-original) and
  // on Flux (merges/drops people). Nano Banana handles them well, same 1-spk cost.
  if (opts.kind === 'people' || opts.kind === 'person_pet') return NEW_SCENE_MODEL_NANO_BANANA;
  return opts.stylized ? NEW_SCENE_MODEL_NANO_BANANA : NEW_SCENE_MODEL_SEEDREAM;
}
```

**Consider going further:** Seedream underperformed even for single-subject transformations (it's built to
stay close to the source). A reasonable stronger move is to make Nano Banana the standard-tier default for
**all** New Scene reference kinds and retire Seedream from this flow. Decide with Kevin (see open
questions).

**Call sites to update (both must pass `kind`):**
- `generate-dream/index.ts` — the New Scene REFERENCE block (~line 810, `newSceneRefModel = newSceneModel(...)`).
- `enqueue-dream/index.ts` — the pre-charge routing (~line 391, same `routeNewSceneSubject` fork) if it
  also derives the model for pricing.

**Charge/render lockstep (do not skip).** `newSceneTierCost()` is the single source of truth for the
sparkle charge and is mirrored in THREE places that must change together:
- `_shared/newSceneDirective.ts` (`newSceneTierCost`)
- `lib/newSceneRoute.ts` (RN client mirror)
- `__tests__/lib/newSceneCost.test.ts` (locks the two in lockstep)

Because Nano Banana is **also 1 sparkle**, the standard-tier price does not change — but verify the test
still passes and that no path prices this as "best" by accident.

### 5b. Secondary (optional): set expectations at upload, do NOT block

The reference path regenerates faces, so it will never be pixel-perfect the way a single-person swap is.
With Nano Banana the output is clearly the same people and looks great, so **blocking a 2-person photo
would throw away a feature that plainly works.** Recommendation:
- Keep the existing group-size cap (`engine_config.new_scene_max_people`, currently **3**). 3+ still blocks
  pre-charge.
- Optionally add a light, one-time note when the classifier detects >1 person, e.g. "We'll reimagine both
  of you into the scene" — so nobody expects an exact face swap. Flavor/clarity only, not a paywall
  (see `feedback_delight_pure_joy_not_upsell`).

### 5c. Do NOT

- Do not route multi-person to Flux 2 Pro (merges/drops people) or Kontext Max (ages children).
- Do not "fix" this by hardening the prompt — it's already explicit; the model is the constraint.

---

## 6. Risks & caveats

- **Not pixel-perfect identity.** Recompose regenerates faces. Nano Banana keeps likeness well but it is a
  reimagining, not a paste. This is inherent to any 2-person "new scene" and should be framed as such.
- **Refusal/NSFW fallback.** The New Scene path has a visible-fallback retry (`newSceneFallbackModel`).
  Confirm the fallback for a Nano-Banana-primary render is sensible (today `newSceneFallbackModel` pairs
  Seedream↔Nano Banana Pro; update if the primary changes).
- **Provider availability.** Gemini image models need `GEMINI_API_KEY` present in the edge runtime
  (`isGeminiModel` + creds gating in `generateImage.ts`). Seedream is on Replicate. Switching the default
  moves multi-person load onto Google; confirm quota/availability posture.
- **Cost.** Neutral at standard tier (both 1 spk). If 5b nudges anyone to "best," that's 5 spk — keep the
  default at standard.

---

## 7. Open questions for Kevin

1. Switch **only** multi-person (`people`/`person_pet`) to Nano Banana, or make Nano Banana the
   standard-tier default for **all** New Scene reference kinds (retire Seedream here)?
2. Add the upload-time "we'll reimagine both of you" note, or ship the model swap silently?
3. Keep the 3-person cap, or revisit now that multi-person actually works?

---

## 8. Appendix — reproduce / reference

- **Routing + model + pricing:** `supabase/functions/_shared/newSceneDirective.ts`
  (`routeNewSceneSubject`, `newSceneModel`, `newSceneFallbackModel`, `newSceneTierCost`).
- **Render call:** `supabase/functions/generate-dream/index.ts` (New Scene REFERENCE block ~line 810) →
  `supabase/functions/_shared/generateImage.ts` (per-model input shapes ~line 340-375).
- **Providers:** `_shared/providers/gemini.ts` (Nano Banana family — note the real Gemini ids:
  `gemini-3-image-preview`→`gemini-3-pro-image-preview`, `gemini-2-image`→`gemini-2.5-flash-image`).
- **Pricing:** `_shared/modelPricing.ts`. **Client mirror:** `lib/newSceneRoute.ts`. **Lockstep test:**
  `__tests__/lib/newSceneCost.test.ts`. **Model picker UI (restyle):** `components/RestyleModelPicker.tsx`.
- **Config:** `engine_config.new_scene_max_people` (=3).
- **Test harness (offline):** `scratchpad/model_test.mjs` — feeds a source jpg + a scene prompt through
  the 5 models with production input shapes, writes `test_<scene>_<model>.jpg`. Michele's source and the
  exact prompts were pulled read-only from `dream_queue.payload->>'input_image'` and `uploads.ai_prompt`.
