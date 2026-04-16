# V2 Face-Swap Medium — Style Collapse Problem

> DreamBot (React Native + Expo) generates AI dream images. A single
> Supabase Edge Function (`generate-dream`) handles generation. Users pick
> a **medium** (watercolor, canvas, pencil, anime, etc.) and a **vibe**
> (cinematic, cozy, etc.). Some mediums support **face swap** via
> Replicate's `codeplugtech/face-swap` — after Flux renders the image,
> the user's real face from their stored selfie is composited onto the
> generated image.
>
> The problem: when the user's prompt triggers **self-insert** (e.g.
> `"put me in a foggy forest"`), the result on face-swap mediums renders
> photo-realistic regardless of the medium. When the user removes "me"
> from the prompt (e.g. `"a figure in a foggy forest"`), the same medium
> renders correctly in style.

---

## 1. Pipeline overview

```
User types prompt in app ──▶ generate-dream Edge Function
                             ├─ detect self-reference ("put me", "I'm", etc.)
                             │  ├─ YES + user has cast photo ──▶ SELF-INSERT path
                             │  └─ NO ─────────────────────────▶ TEXT-DIRECTIVE path
                             │
                             ├─ build Sonnet brief (differs per path)
                             ├─ Sonnet 4.5 writes 60-80 word Flux prompt
                             ├─ Flux Dev generates image (1024x1792)
                             └─ face swap (if medium.faceSwaps === true)
                                └─ Replicate codeplugtech/face-swap
                                   composites real face from stored
                                   selfie onto generated image
```

## 2. The cast description (key ingredient)

When a user onboards, they upload a selfie. The app calls `describe-photo`
(a separate Edge Function using Llama 3.2 Vision) which produces a prose
description of what it sees. Example for the user:

> "Mid-30s athletic male with rectangular face, strong jawline, warm
> hazel-brown eyes, bright smile, sandy brown medium-length hair swept
> back, well-groomed full beard, warm peachy-fair skin..."

This is **photographic prose** — written as if describing a real person
in a real photo. It's stored in `user_recipes.recipe.dream_cast[0].description`
and reused across all dreams.

## 3. The two Sonnet briefs

### SELF-INSERT brief (current)
```
You are a ${mediumStyle} artist. Write a Flux AI prompt (60-80 words, comma-separated).

MEDIUM (start with this EXACTLY): ${medium.fluxFragment}

STYLE GUIDE:
${medium.directive}

SCENE — the user asked for: ${userSubject}

THE MAIN CHARACTER (this is the user — match their description EXACTLY):
${selfDesc}                             ← photographic prose, ~200 chars

CRITICAL: Preserve the character's EXACT sex, age, build, and features...

MOOD: ${vibe.directive}

COMPOSITION:
  [random framing rule: head-and-shoulders / chest-up / waist-up / 3-quarter]
  2. Face must be CLEARLY VISIBLE and well-lit
  3. NEVER use full body / wide / aerial shots
  4. Show the character DOING something
  5. Name specific materials, textures, light sources — but apply them
     through the MEDIUM's rendering (e.g. "thick oil paint strokes
     depicting rough bark" not "photograph of rough bark")
  6. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.
```

### TEXT-DIRECTIVE brief (used when user omits "me")
Different path — no cast description, no face swap. Just medium + vibe
+ user prompt. Produces cleanly styled output.

## 4. Example of what Sonnet produces for self-insert + canvas (oil) + cozy

Input user prompt: `"put me in a foggy forest at dawn, facing the camera"`

Sonnet output sent to Flux Dev:
```
Mid-30s athletic male, rectangular face, strong jawline, warm
hazel-brown eyes, bright smile, waist-up in foggy dawn forest facing
camera, reaching toward misty trees, oil painting style with thick
brushstrokes, chiaroscuro lighting, canvas texture visible, warm
undertones with burnt umbers and raw siennas, cozy intimate mood,
soft golden morning light filtering through fog, warm cream and honey
tones, close enveloping composition, face clearly visible and
well-lit, steam rising from forest mist, chunky knit sweater texture,
no text, no words, no letters, no watermarks, hyper detailed
```

Notice the ordering: **photographic cast description first**, oil
painting tokens later. `medium.fluxFragment` is meant to come first
("start with this EXACTLY") but Sonnet reordered based on the brief's
content ordering.

## 5. The actual rendered image (canvas/cozy)

- Face: 100% photo-real (face swap pasted the real selfie face)
- Skin: photo-real sheen, no oil paint texture
- Hair: photo-real strands, no brushstroke quality
- Sweater: mostly photo-real with faint knit texture
- Forest: slight painterly quality in fog
- Overall: reads as a photograph with a vaguely artistic background

## 6. The empirical finding

| Prompt | Path | Cast desc in prompt? | Face swap? | Result |
|---|---|---|---|---|
| `"put me in a foggy forest"` | self-insert | YES | YES | photo-real |
| `"a figure in a foggy forest"` | text-directive | NO | NO | **stylized correctly in medium** |

The style-native output works. The self-insert pipeline is breaking it.

## 7. Two contributing factors

### (a) Cast description is photographic prose
The user's cast description was generated by Llama Vision looking at a
photo. The prose reads like "athletic male, rectangular face, strong
jawline, hazel-brown eyes, full beard, peachy-fair skin." Every phrase is
a real-world feature you'd describe when looking at a photograph.

When Sonnet injects this prose into the Flux prompt, Flux reads ~50-80
words of concrete photographic-subject description. Flux Dev is trained
~80%+ on photographs; when handed rich subject prose, it commits to
photorealism. Style tokens elsewhere in the prompt get under-weighted.

### (b) Face swap replaces the face with a real photo
Even if Flux renders a watercolor/canvas/pencil figure, the face swap
step composites the user's real selfie face onto the generated image.
The face area becomes 100% photographic. The viewer's eye goes to the
face first, and the whole image reads photo-real even if the body is
stylized.

## 8. Historical context

This self-insert + face-swap combination **was working correctly** on
stylized mediums (canvas, watercolor, pencil) around April 10 with an
earlier version of the Sonnet brief. Around that time, the brief
structure was:

```
MEDIUM (start with this EXACTLY): ${medium.fluxFragment}   ← pos 1
STYLE GUIDE: ${medium.directive}                            ← pos 2
SCENE — the user asked for: ${userSubject}                  ← pos 3
THE MAIN CHARACTER: ${selfDesc}                             ← pos 4 (LAST)
```

We just restored that exact ordering. Earlier today the brief had
CHARACTER first (pos 1) which was worse. Restoring the order helped but
didn't fully solve the problem — it's still rendering photo-real for
self-insert on stylized mediums.

It's possible that since April 10, either:
- The cast description became richer/longer/more photographic (check
  describe-photo's prompt and Llama Vision behavior)
- Or Flux Dev's weights shifted (unlikely, but it's an upstream model)
- Or something else changed in the prompt construction we haven't
  spotted

## 9. The current hypothesis

**The cast description shouldn't be passed to Sonnet in the face-swap
self-insert path at all.** In that path:
- Face swap will restore identity post-hoc from the selfie
- So Flux doesn't need to know the subject's facial features
- Flux just needs to render "a figure in the scene, in the medium's style"
- The face swap step paints the real face on at the end

Proposed minimal character block for face-swap mediums:
```
THE MAIN CHARACTER: a ${gender} figure in the scene.
(Identity will be composited from a reference photo — do not describe
the face, skin, or features. Describe only what the body is doing in
the scene. Let the MEDIUM define how the figure is rendered.)
```

**But** — this contradicts the historical behavior where the FULL cast
description was included in the brief on April 10 and the output was
stylized correctly. Something else must have changed.

## 10. Open questions for ChatGPT

1. Given the brief at section 3 and the Sonnet output at section 4,
   why is `medium.fluxFragment` not landing at position 1 of the Flux
   prompt despite the "start with this EXACTLY" instruction?
2. Is the photographic cast description the primary source of
   photorealism, or is face swap's face-paste step the dominant factor?
3. If we remove the cast description from Sonnet's input entirely
   (replace with "a {gender} figure"), will the stylized Flux output
   still be recognizable as the user once face swap composites their
   face?
4. Is there a model change we should consider (e.g. Flux Dev LoRA per
   medium, or SDXL per medium for stylized paths) rather than fighting
   Flux Dev's photo-real prior with prompt tokens?
5. How do we test this cleanly — can we validate via the Flux prompt
   text alone (before face swap) to isolate whether Flux is rendering
   the style, independent of face swap's contribution?

## 11. Relevant files

- `supabase/functions/generate-dream/index.ts` — the orchestrator, all
  briefs and paths
- `supabase/functions/_shared/renderEntity.ts` — embodied trait
  extraction and templates (not used in natural face-swap path)
- `supabase/functions/describe-photo/index.ts` — Llama Vision that
  produces the cast description from a selfie
- `dream_mediums` DB table — columns: `key`, `flux_fragment`,
  `directive`, `character_render_mode` (natural/embodied),
  `face_swaps` (boolean)
- `dream_vibes` DB table — columns: `key`, `directive`
- `user_recipes.recipe.dream_cast[].description` — the stored prose
  that becomes `selfDesc` in the brief

## 12. Mediums in scope

Natural + face-swap (the problematic ones):
`photography, anime, canvas, comics, neon, pencil, shimmer, surreal,
twilight, vaporwave, watercolor, animation, fairytale, storybook, aura,
coquette, gothic`

Embodied + no face-swap (work correctly):
`lego, claymation, vinyl, pixels, handcrafted`
