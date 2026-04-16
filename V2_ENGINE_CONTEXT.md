# DreamBot V2 Engine — Deep Context for External Review

> A self-contained explanation of DreamBot's V2 image generation engine —
> what it does, what we want from it, and the brittle places that keep
> producing bad output. Written so another agent (with no project context)
> can read and offer meaningful architectural feedback.

---

## 1. What DreamBot is

DreamBot is a React Native + Expo iOS app that generates personalized AI
"dream" images for each user. Users onboard with a **Vibe Profile**
(aesthetics they like, mood sliders, a selfie the app turns into a text
description) and generate dreams either by:
- Tapping a generate button (surprise / Dream Me)
- Typing a short prompt + picking a medium + vibe
- Uploading a photo to restyle or reimagine
- Tapping "Dream Like This" on a feed post (style transfer)

Nightly, a cron generates one dream per active user automatically.

Images are rendered by **Replicate**-hosted **Flux Dev** (text-to-image)
or **Flux Kontext** (image-to-image). An optional **face swap** step
(`codeplugtech/face-swap`) composites the user's real face onto a
generated image when eligible.

Three generative pipelines exist in the same codebase:
- **V2 engine** (this doc): user-initiated dreams via the Create screen
- **Nightly engine**: scheduled, uses a separate template/seed system
- **Photo restyle** (Kontext): image-to-image, separate code path

This document is only about **V2**.

---

## 2. Goal: what V2 is supposed to produce

For a user on the Create screen:

**Input:**
- A medium key (e.g. `watercolor`, `canvas`, `lego`, `photography`)
- A vibe key (e.g. `cinematic`, `cozy`, `dreamy`)
- Optional scene prompt (e.g. `"put me in a foggy forest at dusk"`)
- Their stored Vibe Profile (including a cast photo + AI-generated
  description of that photo)

**Output:**
- A 1024×1792 (portrait 9:16) image rendered in the chosen medium's
  visual style
- If the user said "me" or similar, they should appear in the scene —
  either as themselves (face swap) or as a medium-native avatar of
  themselves (e.g. LEGO minifig version)
- The vibe should shape mood/atmosphere but not override the medium's
  technique

**Success looks like:**
- `watercolor` prompt → looks like a watercolor painting, with paper
  texture, pigment blooms, soft edges
- `lego` prompt → looks like a LEGO minifigure in a LEGO-built scene
- `photography` prompt → looks like a photograph
- The subject is front-facing, face clearly visible, natural anatomy
- The scene the user described is preserved, not invented around

---

## 3. Architecture (generate-dream Edge Function)

```
┌─ User request from app ────────────────────────────────────────────┐
│                                                                    │
│  POST /functions/v1/generate-dream                                 │
│  {                                                                 │
│    mode: 'flux-dev' | 'flux-kontext',                              │
│    medium_key: string,      // e.g. 'watercolor'                   │
│    vibe_key: string,        // e.g. 'cinematic'                    │
│    prompt?: string,         // legacy field name in body           │
│    hint?: string,           // alternate user-prompt field         │
│    input_image?: string,    // photo restyle / reimagine           │
│    photo_style?: 'restyle'|'reimagine',                            │
│    vibe_profile: VibeProfile, // has dream_cast[]                  │
│    style_prompt?: string,   // DLT: source dream's ai_prompt       │
│  }                                                                 │
│                                                                    │
└──────────────────────┬─────────────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Path router         │
            └──────────┬───────────┘
                       │
    ┌──────────────────┼─────────────────────────────────┐
    │                  │                                 │
    ▼                  ▼                                 ▼
┌─────────────┐  ┌──────────────┐                 ┌──────────────┐
│ isPhoto+    │  │ isPhoto+     │                 │ text only    │
│ restyle     │  │ reimagine    │                 │ (this is the │
│ (Kontext,   │  │ (vision→     │                 │  main V2     │
│ separate)   │  │ text→flux)   │                 │  path)       │
└─────────────┘  └──────────────┘                 └──────┬───────┘
                                                         │
                                                         ▼
                                      ┌──────────────────────────────┐
                                      │ userSubject = prompt ?? hint │
                                      │                              │
                                      │ self-reference regex test:   │
                                      │  /\b(put me|place me|me as|  │
                                      │    me in|me on|me at|        │
                                      │    me \w+ing|i am|i'm|       │
                                      │    myself|my face)\b/i       │
                                      │                              │
                                      │ AND user has a self cast     │
                                      │  (dream_cast[0] with photo   │
                                      │   and description)           │
                                      └──────────────┬───────────────┘
                                                     │
                                 ┌───────────────────┼───────────────┐
                                 │                   │               │
                                 ▼                   ▼               ▼
                           ┌───────────┐   ┌───────────────┐  ┌────────────┐
                           │ self-     │   │ style-        │  │ surprise   │
                           │ insert    │   │ transfer      │  │ (no user   │
                           │ (me+ in   │   │ (style_prompt │  │  prompt)   │
                           │  prompt)  │   │  present)     │  │            │
                           └─────┬─────┘   └───────┬───────┘  └─────┬──────┘
                                 │                 │                │
                                 │   ┌─────────────┴─────────┐      │
                                 │   │ or text-directive     │      │
                                 │   │ (prompt, no "me")     │      │
                                 │   └───────────┬───────────┘      │
                                 │               │                  │
                                 ▼               ▼                  ▼
                           ┌─────────────────────────────────────────┐
                           │ Construct Sonnet brief (differs per path)│
                           │ Call Claude Sonnet 4.5, 200 max_tokens   │
                           │ Get 60-80 word Flux prompt               │
                           └──────────────┬───────────────────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────────────────┐
                           │ sanitizePrompt() — word replacements    │
                           │ (baby → character, etc.)                │
                           └──────────────┬──────────────────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────────────────┐
                           │ pickModel(mode, prompt, mediumKey)      │
                           │  - anime, pixels → SDXL                 │
                           │  - everything else → Flux Dev           │
                           └──────────────┬──────────────────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────────────────┐
                           │ Replicate API call                      │
                           │  aspect_ratio: '9:16', num_outputs: 1   │
                           │  output_format: 'jpg'                   │
                           └──────────────┬──────────────────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────────────────┐
                           │ If faceSwapSource set:                  │
                           │   codeplugtech/face-swap                │
                           │   composite real selfie face onto image │
                           └──────────────┬──────────────────────────┘
                                          │
                                          ▼
                           ┌─────────────────────────────────────────┐
                           │ Persist image to Supabase Storage       │
                           │ Insert draft row in `uploads` table     │
                           │ Return { image_url, prompt_used, ... }  │
                           └─────────────────────────────────────────┘
```

---

## 4. The cast description (key variable)

When the user onboards, they upload a selfie. The app calls an Edge
Function (`describe-photo`) that invokes **Llama 3.2 Vision** via
Replicate with a prompt asking for a detailed prose description of the
person. That description is persisted in
`user_recipes.recipe.dream_cast[0].description`.

Example (Kevin's actual stored description — abbreviated):

> Mid-30s athletic male with rectangular face, strong jawline, warm
> hazel-brown eyes, bright smile, sandy brown medium-length hair swept
> back, well-groomed full beard, warm peachy-fair skin, [...continues
> for ~400 more characters with build, clothing notes, etc...]

This prose is **written like someone describing a real photograph** —
because that's what Llama Vision was looking at. Every phrase ("athletic
male", "rectangular face", "hazel-brown eyes", "peachy-fair skin") is a
concrete real-world feature.

The description is reused across every self-insert dream. Kevin's face
never changes — but the description is baked into the Flux prompt each
time.

---

## 5. Medium + vibe data model

Both are DB tables the Edge Function reads at runtime.

### `dream_mediums` columns
| Column | Meaning |
|---|---|
| `key` | e.g. `watercolor`, `lego` |
| `label` | Display name, e.g. `Watercolor`, `LEGO` |
| `flux_fragment` | Curated comma-separated Flux tokens — the style's concrete vocabulary. Example for watercolor: *"traditional watercolor painting, fluid transparent pigment, visible paper texture, soft irregular wet edges, pigment blooms and backruns, spontaneous confident brushwork, preserved paper luminosity, gestural linework in darker tones, fresh immediate feel"* |
| `directive` | Long prose style guide (~600-900 chars) — describes the style's aesthetic in depth. Read by Sonnet for style guidance. |
| `character_render_mode` | `'natural'` or `'embodied'` |
| `face_swaps` | boolean — whether to run face swap after generation |

### `dream_vibes` columns
| Column | Meaning |
|---|---|
| `key` | e.g. `cinematic`, `cozy`, `dreamy` |
| `directive` | Long prose mood guide (~400-900 chars) |

### Natural vs Embodied — critical distinction

**Natural mediums** (photography, anime, watercolor, canvas, pencil,
comics, neon, etc.): rendered as "a human depicted in X style." The
cast description goes in as photographic prose. Face swap can optionally
paste the real face on afterward.

**Embodied mediums** (LEGO, claymation, vinyl, pixels, handcrafted):
rendered as "the user transformed into the medium's native form" — a
LEGO minifig, a clay figure, a pixel sprite. Face swap would look
grotesque so it's disabled. Identity comes from **trait extraction** +
medium-specific templates.

For embodied, a module `renderEntity.ts` extracts traits (gender, hair
color, eye color, facial hair, build) from the cast description via
regex, then fills a per-medium template. Example LEGO template:

```
LEGO minifigure, {hairColor} snap-on hair piece, painted {eyeColor}
dot eyes, {facialHairDetail}, printed {genderTorso} torso, C-shaped
yellow hands, plastic sheen
```

---

## 6. The actual Sonnet briefs (current state)

### A. Self-insert text (the path having the most trouble)

User typed "put me in a foggy forest at dusk, facing the camera and smiling"
with medium=canvas, vibe=cinematic.

The Edge Function builds this brief and sends to Claude Sonnet 4.5:

```
You are a canvas artist. Write a Flux AI prompt (60-80 words, comma-separated).

MEDIUM (start with this EXACTLY): {medium.flux_fragment}

STYLE GUIDE:
{medium.directive}         ← 600-900 chars of prose

SCENE — the user asked for: put me in a foggy forest at dusk, facing the camera and smiling

{characterBlock}           ← one of 3 versions, see below

MOOD: {vibe.directive}     ← 400-900 chars of prose

COMPOSITION — THIS IS CRITICAL:
{random pick from 4 framing rules: head-and-shoulders / chest-up / waist-up / three-quarter body}
2. Face must be CLEARLY VISIBLE and well-lit — no tiny faces, no silhouettes, no faces in shadow
3. NEVER use full body shots, extreme wide shots, aerial views, or show the person tiny in a vast landscape
4. Show the character DOING something — interacting with objects, environment, or props from the scene
5. Name specific materials, textures, light sources — but apply them through the MEDIUM's rendering (e.g. "thick oil paint strokes depicting rough bark" not "photograph of rough bark")
6. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.
```

### Three character block variants

#### Variant 1 — Embodied (LEGO, clay, vinyl, pixels, handcrafted)
```
THE CHARACTER (already transformed into {mediumStyle} style — place them in the scene as-is):
{entity.description}     ← compact template output (~40 words)

KEEP: gender, hair color, eye color, facial hair, build from the description above.
```

`entity.description` is the output of `buildRenderEntity()` — a short
medium-native string like *"LEGO minifigure, sandy brown snap-on hair
piece, painted brown dot eyes, printed beard detail, printed masculine
torso, C-shaped yellow hands, plastic sheen."*

#### Variant 2 — Natural + face_swaps=true (photography, watercolor, canvas, pencil, anime, etc.)
```
THE MAIN CHARACTER: an average-build {male|female} figure in the scene, fully clothed in attire appropriate to the scene.

IMPORTANT — DO NOT describe the character's face, skin tone, pores, eye color, hair color, or facial features. Identity will be composited from a reference photo AFTER rendering. Describe only what the body is doing in the scene — pose, gesture, interaction with the environment. Render the figure entirely in the {mediumStyle} medium's style — maintain the medium's texture and technique across the face and skin just as across the rest of the image. No photoreal skin pores, no photographic realism on the subject; the face is a {mediumStyle} rendering like everything else.

ANATOMY — non-negotiable: natural proportions, NOT a fitness model. No six-pack abs, no exaggerated musculature, no bulging biceps unless the user specifically asked. Two arms, two legs, one head, two hands each with five fingers correctly placed, normal-length limbs, symmetrical features. The figure is clothed — never bare-chested unless the user explicitly asked. Hands should be in natural positions — not distorted, not fused, not extra digits.
```

NOTE: the full cast description is **deliberately omitted** here — it
was pulling Flux toward photorealism. Face swap will restore identity
after render.

#### Variant 3 — Natural + face_swaps=false (edge case, currently no mediums in this bucket)
```
THE MAIN CHARACTER (this is the user — match their description EXACTLY):
{selfDesc}  ← first 250 chars of cleaned cast description

CRITICAL: Preserve the character's EXACT sex, age, build, and features as described above...
```

### B. Text-directive (when user prompt has no self-reference)

Shorter brief. No cast description. Sonnet invents the character from
the user's description. No face swap.

### C. Style-transfer (DLT from feed)

Passes the source dream's `ai_prompt` as reference style. Tells Sonnet
to replicate the style on a new subject.

### D. Surprise (no user prompt)

Asks Sonnet to invent a scene that showcases the chosen medium.

---

## 7. A real example (watercolor/cozy, self-insert)

Input:
```
medium_key: watercolor
vibe_key: cozy
prompt: "put me in a foggy forest at dawn, facing the camera"
vibe_profile: {dream_cast: [{description: "Mid-30s athletic man...", thumb_url: "..."}]}
```

Sonnet output (the Flux prompt):
```
Mid-30s athletic man, rectangular face, strong jawline, warm hazel-brown
eyes, genuine smile, standing waist-up in foggy dawn forest, reaching
toward misty tree branches, traditional watercolor painting with fluid
transparency, organic pigment bleeding, visible paper texture,
spontaneous brushwork, wet-on-wet blooms, soft irregular edges, warm
intimate lighting filtering through fog, golden dawn rays, cozy forest
green and honey tones, chunky bark textures, morning mist rising, close
enveloping composition, face clearly visible and well-lit, no text, no
words, no letters, no watermarks, hyper detailed
```

Note: this was produced at an earlier commit where cast description was
still injected. Notice that the cast description leads the prompt
(position 1), and "traditional watercolor painting" is at position ~25.
Result: Flux rendered a photograph with painterly fog, not a watercolor.

Face swap then composited the user's real face on top. Final image:
reads as a photograph with slight painterly background. No paper
texture. No pigment bleeds.

---

## 8. What we want

For the self-insert path specifically (where most failures happen):

1. **Medium must dominate.** If the user picks `watercolor`, the output
   should look like a watercolor painting — paper texture, pigment
   blooms, soft edges visible throughout the image including on the
   subject.
2. **Identity must be preserved.** The user should be recognizable,
   either through face swap (natural mediums) or medium-native rendering
   (embodied mediums).
3. **Subject composition must be front-facing and visible.** User
   explicitly saying "facing the camera, smiling" should produce a
   front-facing smile — not a back-turned figure.
4. **Anatomy must be correct.** Two hands, five fingers each, clothed,
   natural proportions, no six-pack-abs gym-bro default.
5. **The scene must be honored.** If the user says "foggy forest at
   dusk," we render a foggy forest at dusk — not a lighthouse, not a
   cliff, not a stormy ocean.
6. **Vibe should shape mood only.** Cinematic should mean "dramatic
   lighting, narrative weight" — not "teal-and-orange color grade"
   (which is photographic-specific and clashes with painted mediums).

---

## 9. Failure modes we keep hitting

### Failure A: "Back is turned"
The user prompt says "facing the camera" but Sonnet's output for some
mediums drops it and Flux renders the subject's back. Observed recently
on canvas, watercolor, vinyl.

Hypothesis: Sonnet is paraphrasing `userSubject`. The brief says
"SCENE — the user asked for: {userSubject}" but no rule forces verbatim
preservation.

### Failure B: "Everything is photorealistic"
For self-insert on natural face-swap mediums (watercolor, canvas,
pencil), Flux renders a photograph regardless of the medium's style
tokens.

Hypotheses (compounding):
- Cast description is photographic prose → Flux commits to photo-real
  at its highest-attention tokens
- `medium.flux_fragment` wasn't always at position 1 — brief ordering
  drifted between commits
- Flux Dev's training is ~80%+ photos → default pull to photo-real
- Face swap then paints a real face on top → whole image reads photo

Current mitigation: remove cast description from the brief in the
face-swap natural branch. Identity handled post-hoc by face swap.

### Failure C: "Gym-bro shirtless default"
When cast description has "athletic male" or "athletic build", Flux
defaults to rendering a jacked, often shirtless figure regardless of
scene context.

Current mitigation: explicit "fully clothed, no six-pack, no bulging
biceps, no bare-chested unless user asked" in the anatomy guardrail.

### Failure D: "Embodied mediums lose traits"
If the cast description is truncated to 250 chars, the regex trait
extractor in `renderEntity.ts` misses hair color, beard, and build
(which often appear past char 250 in the stored description). The LEGO
template then renders "LEGO minifigure with DARK snap-on hair piece" by
default instead of "sandy brown."

Current mitigation: split into `fullSelfDesc` (untruncated, fed only to
`buildRenderEntity`) and `selfDesc` (truncated, used everywhere else).

### Failure E: "Vibe imposes a medium"
Several vibe directives contained photography/cinema-specific language
(e.g. cinematic's original "2.39:1 widescreen, three-point lighting,
teal-and-orange color grade") that overpowered non-photo mediums.

Current mitigation: swept all vibes; removed camera/lens/film-specific
terms; added explicit "mood applies to whatever medium is rendering —
technique stays native to the medium" language.

### Failure F: "User prompt dropped entirely"
At one point earlier today, Sonnet output contained zero words from the
user's prompt (`"a castle on a hill at sunset"` → Sonnet rendered
"ancient lighthouse on rocky cliff overlooking stormy ocean"). The user
subject was weak (7 words) vs competing signals from expander / chaos /
medium / vibe.

Mitigation: this was in a V4 refactor attempt that's been reverted.
Current brief includes `SCENE — the user asked for: {userSubject}` but
has no SELF-CHECK enforcing verbatim preservation.

### Failure G: "Bad hands"
Flux Dev renders hands poorly. A recent render had a hand on a tree
with thumb up, fingers wrapped backwards.

Current mitigation: guardrail prefers hiding hands (pockets, behind
back, out of frame, obscured) rather than trying to render them.

---

## 10. Tradeoffs we haven't solved

### Description length vs compression pressure

- **Full description** → embodied trait extraction works, but when the
  description is also injected into the brief as prose, it bloats the
  brief and Sonnet compresses out scene/composition instructions,
  causing "back is turned" and other paraphrase-losses.
- **Truncated description** → brief stays lean, Sonnet honors scene
  directives, but embodied trait extraction misses traits past 250.

Current workaround: two variables (fullSelfDesc + selfDesc). Might
still bite because some paths still use the full description as prose.

### Photorealistic cast description vs stylized medium

- The cast description is photographic by construction (vision AI
  staring at a photo). When injected into any Flux prompt, it pulls
  toward photo-real.
- For face-swap mediums we now skip the description entirely; face
  swap restores identity.
- But: face swap paints a real photo face on top, which also reads
  photo-real regardless of the rest.
- Net: no branch of natural+face-swap truly reads as non-photo.

### Face swap vs style

- Face swap ensures identity fidelity
- But pastes a hard photo onto a potentially stylized body
- Result: "photo face on painted body" → uncanny, reads as photo

No solved path here. The historical claim ("face swap worked fine on
canvas/watercolor/pencil around April 10") hasn't been empirically
reproduced yet at the current commit.

### Brief length vs Sonnet compression

The brief is ~80 lines of instructions + content. Sonnet's job is to
compress to 60-80 words. Every competing instruction is a token Sonnet
can drop when compressing. More rules = more drop surface area.

---

## 11. What we haven't tried yet

1. **LoRAs per medium on Flux Dev.** Train a watercolor LoRA on real
   watercolors; swap in at inference time for watercolor renders. More
   reliable than prompt tokens.
2. **Different models per medium.** SDXL for anime/pixels is already
   wired, but could extend — e.g. Playground v2 for painterly mediums,
   Midjourney for photography.
3. **Rewriting the cast description per-medium.** Instead of photo
   prose, generate a medium-appropriate version on-demand (e.g. for
   watercolor: "a man painted in loose wet-on-wet brushstrokes, sandy
   brown pigment blooms for hair").
4. **Two-pass Sonnet.** First pass produces a draft; second pass audits
   "does every SACRED token appear in the draft" and rewrites if not.
5. **Structured Sonnet output.** Instead of free-form Flux prompt, have
   Sonnet output JSON with labeled slots (subject/scene/style/camera),
   then a deterministic builder assembles the Flux prompt in a fixed
   order. Removes Sonnet's ability to drop/paraphrase.
6. **Negative prompt on Flux.** Flux Dev technically ignores negative
   prompts but there's been some success with concatenated "not X, not
   Y" language at the end.

---

## 12. Open questions for an external reviewer

1. **Should the cast description be rewritten per-medium** instead of
   reused as-is? The current reuse is convenient but silently biases
   every path toward photo-real.
2. **Is Flux Dev the wrong model** for stylized mediums? Its prior
   dominates prompt tokens. Would a model with stronger style fidelity
   (Playground, Midjourney, a LoRA stack) be a better fit than
   fighting Flux's bias per prompt?
3. **Is the current ~80-line Sonnet brief fundamentally too expressive?**
   Would a short, narrative brief perform better ("Write a Flux prompt
   for a {medium} painting of {subject} in {scene}, ending with
   'hyper detailed'") because Sonnet has nothing to compress?
4. **Is face swap the right mechanism** for identity on stylized
   mediums? Should it be medium-gated (only on photography + anime +
   surreal), with other mediums relying on text-based identity?
5. **How do other image apps solve this** — user identity + style
   variety without the style collapse? Midjourney's `--sref` and
   `--cref`? Ideogram's character lock? What's the industry pattern?

---

## 13. Relevant files

| File | Role |
|---|---|
| `supabase/functions/generate-dream/index.ts` | Orchestrator; all briefs live here; ~2000 lines |
| `supabase/functions/_shared/renderEntity.ts` | Embodied trait extraction + templates |
| `supabase/functions/describe-photo/index.ts` | Llama Vision that generates cast description |
| `dream_mediums` DB table | Per-medium config |
| `dream_vibes` DB table | Per-vibe directive |
| `user_recipes.recipe.dream_cast[]` | Cast description + thumb_url storage |

---

## 14. What a reviewer should know about "why is it this way"

- **Path routing is regex-based** because cast selection was an
  afterthought. A proper intent classifier (LLM) would be more robust
  but would add a call per generation.
- **`flux_fragment` and `directive` are split** because we found empirically
  that Flux weights early comma-separated tokens strongly. Putting the
  concrete style tokens at position 1 helps style land. The prose
  directive is for Sonnet's planning, not Flux's rendering.
- **Face swap is post-generation** because Flux Dev doesn't reliably
  render a specific face from text alone. The swap gives us identity
  guarantees.
- **Every fix is a patch on a brittle base.** The V2 engine has been
  iterating for weeks. Today alone saw: a major refactor attempted,
  reverted, then targeted patches to the pre-refactor state. The
  architecture hasn't fundamentally changed in that time — just prompt
  text and routing rules.
