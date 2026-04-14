# Fix The Nightly Dreams

## Status (2026-04-14)

The nightly dream pipeline is mechanically working. Face swaps fire correctly, character composition is enforced, and the old mood-weighted template architecture is restored. **The problem now is template quality** — the 6,665 seed templates produce boring, everyday scenes (typewriters, fields, coral) instead of epic dreamscapes.

## Architecture (What's Working)

### Pipeline Flow
1. **Roll the dream algorithm** (`dreamAlgorithm.ts`) — picks path (40% personal_cast, 30% personal_scene, 30% cast_random), cast members, personal elements
2. **Pick a mood-weighted template** from `nightly_seeds` table — 31 categories, ~215 templates each, weighted by user's mood sliders
3. **Fill generic slots** — `${character}` → "a lone figure", `${place}` → user's location or "a forgotten city", `${thing}` → user's object or "glowing fragments"
4. **Sonnet writes the Flux prompt** — receives: filled template as dream scene, full character description as separate block, medium directive, vibe directive, camera direction
5. **Flux Dev renders** the image
6. **Face swap API** (`codeplugtech/face-swap`) pastes user's real face onto the rendered figure
7. **Upload and post**

### Key Decisions That Made Face Swap Work
- **Full character description goes to Sonnet as a separate block**, NOT baked into the template slot. The `${character}` slot stays generic ("a lone figure"). Sonnet merges both.
- **Face-swap mediums ALWAYS use `character` composition** (never `epic_tiny`). Enforced in `dreamAlgorithm.ts`. Without this, Flux renders tiny distant figures with no usable face.
- **Don't try to control Flux's framing via text instructions.** "Front-facing, face visible" in the prompt doesn't work — Flux ignores late-positioned instructions. The character composition path + Sonnet's brief naturally produces close-enough shots.
- **Face swap only fires when**: single human cast member, medium.faceSwaps=true, composition!='pure_scene', castPick.thumb_url exists.

## Pitfalls Discovered

### Things That Don't Work
1. **Minimal character description for face-swap** ("a 35-40 year old man" instead of full reference sheet) — produces generic people that don't resemble the user at all. Face swap needs Flux to render someone CLOSE to the user's appearance first.
2. **Front-facing injection into Flux prompt** — prepending "front-facing portrait, face clearly visible" to the prompt doesn't work. Flux still renders dramatic back-turned shots. Wasted effort.
3. **Kontext with cast photo as input** — Kevin says Kontext quality is not good enough for this use case. Stick with Flux Dev + face swap.
4. **Energy seeds (single pool, no categories)** — personal elements passed as separate labeled sections caused Sonnet to deprioritize character descriptions, resulting in generic figures.
5. **Slotted seeds with full character description baked in** — dumping the full reference sheet into `${character}` produced awkward text that Sonnet regurgitated literally into the Flux prompt.
6. **`epic_tiny` composition with face-swap mediums** — renders the person as a tiny distant figure. Face swap can't find a face. MUST force `character` composition for face-swap mediums.

### Things That Work
1. **Full character description as separate Sonnet block** + generic slot fill in template
2. **31 mood-weighted categories** — gives variety, personalizes to user's taste
3. **Character composition forced for face-swap mediums** — ensures person is prominent enough for face swap
4. **`codeplugtech/face-swap` model** — works fine when given a visible, well-lit face. Not the model's fault when it fails — it's the input image lacking a visible face.

## What Needs To Be Done

### Priority 1: Better Seed Templates (Character Path)

The 6,665 templates currently in `nightly_seeds` produce **lame, mundane scenes**. A man at a typewriter. A man in a field. Clever wordplay about bootstrap paradoxes. These are LITERARY, not VISUAL. Flux can't render "a bus that arrives before being called."

**The fundamental rule:** if a dream includes the person (self or plus_one), it MUST be a **character-driven scene**. The person IS the image. The epic environment is the BACKDROP, not the subject.

**What the current templates get wrong:**
- Literary/conceptual descriptions instead of visual ones ("bootstrap paradoxes give birth to themselves")
- Mundane settings (offices, fields, typewriters, sandboxes)
- Character as secondary element in a vast scene (back turned, tiny, climbing away)
- Clever metaphors that Flux can't render

**What good character templates look like:**
- The character is the PRIMARY SUBJECT — they come FIRST in the template
- The epic scene wraps AROUND them as backdrop
- Think: movie poster, video game cover art, anime key visual
- The character faces the viewer (or 3/4 angle), is prominent, recognizable
- The environment is extraordinary but serves the character, not the other way around

**Bad:** `"${character} climbing a massive crystalline staircase spiraling up through storm clouds"` — Flux renders a tiny figure climbing away. Scene dominates. Back turned.

**Good:** `"${character} illuminated by the glow of a volcanic eruption, rivers of lava stretching to the horizon behind them"` — character is the grammatical subject, lit by the scene. Flux renders them prominent, epic world behind.

**Every word must be something a camera can see.** No feelings, no concepts, no wordplay. Describe materials, lighting, weather, scale. The character exists WITHIN a visually stunning world.

**Regeneration approach:**
- Rewrite the seed generation prompts in `scripts/generate-nightly-seeds.js` for the 31 mood-weighted categories
- Each category's generation prompt must demand character-first, visually epic, paintable scenes
- Anti-patterns: "NOT climbing away, NOT back turned, NOT tiny figure in vast landscape, NOT clever wordplay, NOT metaphors, NOT mundane settings"
- Pro-patterns: "character illuminated by, character surrounded by, character standing before, character emerging from"
- Enforce dedup extraction to prevent repetition
- Generate ~215 per category = ~6,665 total
- Wipe old seeds and import new ones

### Priority 2: Other Dream Paths (After Character Path is Solid)

These paths do NOT face swap, so they have FULL creative freedom. Wide shots, abstract compositions, tiny figures — whatever looks most stunning.

- **Personal scene path** (no cast) — location + object dreams. No face swap constraint. Use `pure_scene` or `epic_tiny` composition. Can go wild.
- **Pure dream path** (no personal elements) — pure art matched to user's taste. Should be bot-quality. Zero constraints.
- **Non-face-swap mediums** (lego, claymation, vinyl, etc.) — full character description rendered stylized, no face swap. Can use `epic_tiny` since no face needed.

### Priority 3: Per-User Scene Dedup

Kevin proposed: after each dream, extract a 2-3 word scene key and store in a `nightly_dream_log` table per user. Next dream queries last 60 days of keys and passes them as a ban list to Sonnet. Old entries age out for recycling.

## Flux Prompt Engineering (from ChatGPT research)

### The Core Problem We Had
We were putting the character description FIRST in the Sonnet brief → Sonnet wrote Flux prompts that led with character → Flux rendered portraits. Background became mush.

### The Fix: Scene First, Character Second, Camera Last

Flux prompts must be structured as:

```
(A) SCENE BLOCK — environment, time of day, weather, architecture, props, mood lighting
(B) ACTION BLOCK — character doing something (verb, not "standing")
(C) CHARACTER BLOCK — short identity anchors only (not full reference sheet)
(D) CAMERA BLOCK — framing, lens, depth, composition
```

### Magic Lines That Force Backgrounds
- `"foreground midground background, layered composition"` — forces depth, prevents flat subject+blur
- `"environment dominates"` — Flux prioritizes the world
- `"deep depth of field"` — keeps background sharp (vs bokeh which blurs it)
- `"24mm lens"` or `"28mm lens"` — wide angle forces more environment into frame
- `"establishing shot"` or `"environmental portrait"` — scene-first composition

### Face Swap vs Non-Face-Swap Camera Blocks

**Face-swap dreams** (need visible face):
```
medium wide shot, environmental portrait, character prominent but background highly detailed,
foreground midground background layered depth, deep depth of field, 35mm lens, cinematic lighting
```
- Use "medium wide" not "wide" — character is visible but not dominating
- Use "35mm lens" not "24mm" — slightly tighter but still cinematic
- Use "environmental portrait" — face visible, world behind

**Non-face-swap dreams** (full creative freedom):
```
wide establishing shot, full body, character small in frame, environment dominates,
foreground midground background layered depth, deep depth of field, 24mm lens, cinematic composition
```
- Go wild — tiny figure in vast landscape is fine
- "character small in frame" forces epic scale

### Action Verbs (Never "Standing")
Use: walking through, leaning against, climbing, running, holding, looking over shoulder, reaching for, kneeling beside, emerging from, crouching near

### What NOT To Do
- Don't start with character description — Flux renders a portrait
- Don't use "bokeh" — blurs the background
- Don't over-describe the face — "perfect eyes, symmetrical face" = closeup
- Don't use static poses — "standing" = boring

### How This Changes The Sonnet Brief

**Current (bad):**
1. Medium directive
2. Full character description ← FIRST = portrait
3. Cast instruction
4. Dream scene
5. Camera
6. Mood

**New (good):**
1. Medium directive
2. **Dream scene / environment** ← FIRST = Flux builds the world
3. **Action** — what the character is doing
4. **Short character anchors** — just enough for identity (age, gender, hair, build, 1-2 distinguishing features)
5. **Camera block** — framing, lens, depth (different for face-swap vs non-face-swap)
6. Mood/vibe

### Reusable Flux Prompt Template (for Sonnet to follow)

```
[SCENE: location, time, weather, architecture, environment details, props],
foreground midground background, layered composition, atmospheric haze, volumetric lighting,
[CHARACTER doing ACTION in the scene],
[3-5 short identity traits],
[CAMERA: shot type, lens, depth of field, composition style], cinematic lighting, high detail,
no text, no words, no letters, no watermarks
```

### Seed Templates Should Be SCENE PACKS

The nightly seed templates should describe ENVIRONMENTS, not character actions. Examples:

- `"rainy neon street market at night, glowing signs reflecting on wet pavement, steam rising from vents, crowded stalls with hanging lanterns, distant skyscrapers fading into fog"`
- `"ancient stone temple hidden in jungle ruins, vines and moss covering broken pillars, golden sunlight filtering through leaves, dust floating in air"`
- `"frozen mountain pass during heavy snowfall, jagged cliffs overhead, narrow trail with footprints, distant temple silhouette barely visible through storm"`

The character gets placed INTO these scenes by Sonnet based on the character description block. The template doesn't need `${character}` at all for the scene itself — it's pure worldbuilding.

## New Architecture: Procedural Art Director (Scene DNA)

The ChatGPT research suggests a fundamentally better approach than pre-written templates. Instead of 6,665 static templates that are mostly garbage, build prompts from **modular pools** assembled at runtime with weighted randomness.

### Why This Is Better Than Templates

- **Templates are static** — 6,665 templates means 6,665 possible scenes. Most are lame.
- **Modular pools are combinatorial** — 50 settings × 10 times × 10 weathers × 10 lightings × 50 story hooks = 2.5 MILLION unique combos
- **Weighted randomness** — 65% safe, 25% bold, 10% chaotic. Quality floor is high, ceiling is insane.
- **Tag-based conflict filtering** — underwater + dust storm never happens
- **No bioluminescence-in-every-seed problem** — each dimension is independently varied

### The Prompt Structure (Scene DNA)

Every nightly dream prompt is assembled from these modules:

```
1. SETTING      — location (neon market, jungle ruins, frozen temple, etc.)
2. SCALE        — "towering structures" / "endless landscape" / "cathedral-sized"
3. TIME         — twilight, golden hour, midnight, solar eclipse
4. WEATHER      — rain, fog, snow, embers, fireflies
5. LIGHTING     — god rays, rim light, neon bounce, candlelight, lightning
6. FOREGROUND   — cables, moss, machinery, lanterns, broken glass
7. MIDGROUND    — silhouettes, staircases, stalls, debris
8. BACKGROUND   — skyline, mountains, spaceship, ocean, mist
9. SIGNATURE    — one weird detail (25% chance): floating traffic light, glowing koi, etc.
10. CHARACTER   — placed INTO the scene (from user's cast or "a lone figure")
11. ACTION      — walking, climbing, kneeling, running, reaching (NEVER "standing")
12. STORY HOOK  — "the door just opened for the first time in centuries"
13. CAMERA      — wide/medium/establishing + lens + depth of field
14. STYLE PACK  — cinematic film still / matte painting / noir / surreal
15. QUALITY     — "foreground midground background, layered composition, deep depth of field"
```

### Face Swap = Body Double, Not Character Art

**Critical mental model:** Flux builds the world + lighting + staging. Face swap adds identity AFTERWARD. Never mix those responsibilities.

The character in a face-swap dream is a **placeholder body double** with a clean, well-lit face zone. Don't describe the face. Don't stylize the face. Generate a cinematic scene with a stable human figure, then paste the real face on.

**Face-swap-friendly prompt rules:**
- `"natural human face, neutral expression"` — that's ALL you need for the face
- `"clean face visibility, unobstructed facial area, balanced lighting on face"` — face swap safe zone
- Push ALL detail into environment, lighting, costume, atmosphere — NOT face
- Eye-level or slightly above, NOT extreme angles
- Face must be ~8-20% of frame height — not too big, not too small
- NO: sunglasses, helmets, hands on face, extreme profile, heavy rain on face, motion blur on head

**Action verbs that DON'T distort the face:**
- walking, observing, holding object calmly, looking into the distance, leaning against something
- AVOID: running (blur), falling, fighting (face distortion), looking straight down

### Face Swap Camera Adaptation

For face-swap dreams, the camera module uses a DIFFERENT pool:
```
"medium wide shot, environmental portrait, character prominent but background highly detailed,
foreground midground background layered depth, deep depth of field, 35mm lens, cinematic lighting"
```

For non-face-swap dreams:
```
"wide establishing shot, full body, character small in frame, environment dominates,
foreground midground background layered depth, deep depth of field, 24mm lens, cinematic composition"
```

### Story Hooks Are Critical

This is the difference between "cool wallpaper" and "movie frame":
- "something massive is approaching from the distance"
- "the door has just opened for the first time in centuries"
- "everyone is gone, but the lights are still on"

Narrative tension → better composition from Flux.

### Signature Weird Details (Rarity-Gated)

50% = none, 35% = safe detail, 12% = bold detail, 3% = chaotic detail

- Safe: "tiny paper lanterns drifting upward like fireflies"
- Bold: "glowing koi fish swimming through the air"  
- Chaotic: "upside-down rain falling toward the clouds"

### Implementation Plan

**Option A: Build the TypeScript prompt engine** (ChatGPT provided full implementation)
- `lib/sceneEngine.ts` — modular pool assembly with weighted randomness + conflict filtering
- Store pools in a JSON file or DB table
- Replace the current "pick a template from nightly_seeds" with "assemble a scene from pools"
- Sonnet still writes the final Flux prompt, but the SCENE it receives is much richer

**Option B: Use Sonnet to assemble from pools**
- Store the pools in the DB
- At runtime, pick one from each pool (weighted, conflict-filtered)
- Pass the assembled pieces to Sonnet as structured input
- Sonnet merges them into a coherent Flux prompt

**Option C: Hybrid — use pools to GENERATE better templates**
- Use the modular pool system to generate 6,665 high-quality templates
- Store them in nightly_seeds like before
- Keep the existing template architecture but with WAY better content

Option A is the cleanest long-term. Option C is fastest to ship.

### Key Flux Prompting Rules (Always Follow)

1. **Scene FIRST** in the prompt — environment, time, weather, architecture
2. **"foreground midground background, layered composition"** in EVERY prompt
3. **"deep depth of field"** — keeps background sharp
4. **Action verbs** — never "standing", always doing something
5. **24mm or 28mm lens** for wide shots, **35mm** for face-swap environmental portraits
6. **Story hook** — narrative tension makes better composition
7. **Scale language** — towering, endless, colossal, cathedral-sized
8. **Don't over-describe the face** — brief identity anchors only
9. **"foreground framing element"** — cables, branches, doorway, archway (instant cinematic feel)
10. **One weird detail max** — too many = incoherent

### Module Pool Sizes Needed

Start with ~30-50 entries per module, expand after testing:
- Settings: 50+
- Scale: 10
- Time: 8
- Weather: 15
- Lighting: 15
- Foreground: 20
- Midground: 20
- Background: 20
- Signature details: 30
- Actions: 20
- Story hooks: 30
- Camera (face-swap): 5
- Camera (non-face-swap): 8
- Style packs: 6
- Quality tags: 3 (always all)

## Next Feature: Location Cards + Object Cards

### The Problem
Currently user locations are injected as ", set in hawaii" — weak, generic, feels like metadata.
User objects are injected as "guitars prominent in the scene" — checklist item, not a dream.

### The Solution: Essence Cards
Generate a rich cinematic description ONCE per location/object, store in shared DB tables, reuse for every user forever.

### Shared DB Tables

```sql
location_cards (
  id uuid, location_name text UNIQUE,
  core_visuals text[],       -- "volcanic black sand beaches", "plumeria trade winds"
  atmosphere text[],          -- "warm salt air", "afternoon rain through sunshine"
  signature_details text[],   -- "sea turtles on warm rocks", "shave ice in rainbow colors"
  color_palette text,
  created_at timestamptz
)

object_cards (
  id uuid, object_name text UNIQUE,
  visual_forms text[],        -- "worn black guitar with chipped paint", "chrome hardware catching neon"
  interaction_modes text[],   -- "leaning against wall", "half-buried in sand", "held at waist"
  environmental_integration text[],  -- "wired into machinery", "turned into shrine relic"
  lighting_affinity text[],   -- "warm spotlight", "neon rim light"
  surreal_twists text[],      -- "strings form constellations", "emits glowing sound waves"
  created_at timestamptz
)
```

### Lazy Generation Flow
1. Dream rolls "hawaii" + "guitar"
2. Check `location_cards` for "hawaii" — exists? Use it. Missing? Sonnet generates + caches.
3. Check `object_cards` for "guitar" — exists? Use it. Missing? Sonnet generates + caches.
4. Tables fill up organically as users add new locations/objects.

### Dream-Time Compilation

**Hierarchy:** Location = world. Object = story. Face = actor.

1. Scene engine picks base modules (setting, scale, time, weather, etc.)
2. **Location fusion:** Rewrite the setting using the location card's core_visuals + atmosphere
3. **Object integration:** Pick a role (60% artifact, 25% hero prop, 10% carried, 5% surreal) + visual form + interaction mode from the card
4. **Subject framing:** Face-swap constraints locked in
5. **Compile final prompt** in structured blocks:

```
[SETTING rewritten with LOCATION ESSENCE],
[LOCATION atmosphere + signature details],

foreground prop: [OBJECT visual form], [OBJECT placement], [OBJECT environment interaction],

a lone figure [FACE-SWAP-SAFE ACTION],
subject midground, face clearly visible, eyes visible,
face 8-15% of frame height, balanced lighting on face,
not a distant silhouette,

camera: medium wide, eye-level, 50mm lens,
controlled depth of field, layered composition,
cinematic film still, no text, no watermark
```

### Face-Swap Object Safety Rules
- Objects held at waist level or lower
- Objects parked/placed nearby, not covering face
- No helmets, masks, or face-obscuring items
- No strong colored light from objects onto face
- Motorcycle → "helmet hanging from handlebars" not "wearing helmet"

### Sweet Spot Per Dream
- 1 location
- 1 object
- 1 signature detail
- 1 story hook
- More than that = prompt soup

## Files

- `supabase/functions/generate-dream/index.ts` — main Edge Function, nightly path starts at `isNightly` check (~line 435)
- `supabase/functions/_shared/dreamAlgorithm.ts` — dream roll algorithm (paths, cast, composition)
- `scripts/generate-nightly-seeds.js` — seed generation script (needs rewrite for better quality)
- `scripts/test-nightly-slots.js` — test script that posts nightly dreams for Kevin's account
- `nightly_seeds` table — 31 categories × ~215 templates each
- `bot_seeds` table — separate table for bot dreams, DO NOT TOUCH

## Database

- `nightly_seeds`: id (uuid), category (text), template (text), created_at (timestamptz)
- Categories: cosmic, microscopic, impossible_architecture, giant_objects, peaceful_absurdity, beautiful_melancholy, cosmic_horror, joyful_chaos, eerie_stillness, broken_gravity, wrong_materials, time_distortion, merged_worlds, living_objects, impossible_weather, overgrown, bioluminescence, dreams_within_dreams, memory_distortion, abandoned_running, transformation, reflections, machines, music_sound, underwater, doors_portals, collections, decay_beauty, childhood, transparency, cinematic

## How To Test

```bash
# Generate 3 nightly dreams for Kevin with face swap
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/test-nightly-slots.js

# Clear daily generation budget if rate limited
# (MAX_DAILY_GENERATIONS = 50 in Edge Function)
```

The test script forces `cast_random` path + `force_cast_role: 'self'` + random face-swap medium. Check results in the app or pull images via Supabase query.
