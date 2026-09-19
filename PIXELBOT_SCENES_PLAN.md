# PixelBot Scene Paths: Build, Seed, and QA Plan

**Status:** PLANNED 2026-09-19, handoff-ready, not started. Written against commit `0d345649`
(the roster cut). Read this whole doc, then `BOT_SCENE_QUALITY_PLAYBOOK.md` in full (CLAUDE.md hard
rule), then invoke the `bot-paths` skill (the build/QA loop) and the `dream-shoot` skill (the grading
crew). Track progress in `PIXELBOT_PATH_BUILD_STATE.md` (create it at kickoff, update after every
round, never only at the end).

**Kevin's ask (his words, 2026-09-19):** "shape pixelbot more into actual scenes rendered in pixels ...
cozy/cool/fantasy scenes (not in game 8bit shots) but actual 'paintings' or photographs of scenes that
look cool rendered in pixels ... a lot of them come off as random chaos in an old video game." Then:
"more pixelart than 8bit screenshots, even though i do want to still keep the in game stuff, it adds a
fun flavor." And for the plan: "brainstorming the concepts for each path, and an end to end plan of
setting up the new paths, seeding them, doing up to 3 qa rounds of 5 renders each to improve any
defects or things that make the render less than 4-4.5/5 ... at the end of this pixelbot's new paths
should be all setup and improved up to 3 rounds for all new paths, seeded to 25 for qa, and ready to
just be fully seeded and shipped."

**Decisions already made and live:** `jrpg-combat`, `dungeon-depth`, `pixel-overworld`,
`pixel-item-shop`, `pixel-landscapes` are cut and their pools deleted (commit `4e8b932f`).
`cozy-farming-life-sim` is pulled from rotation and parked in `shadowPaths` for the rework in this
plan. Live roster today (8): `cozy-rpg-town`, `side-scroller-world`, `boss-arena`, `pixel-horror`,
`pixel-sci-fi-action`, `classic-jrpg`, `epic-vista`, `retro-racing`. The six Halloween seasonal paths
are untouched by everything here.

**End state this plan delivers:** a pixel LOOKS register (the sixth proven looks bot, after YumBot,
MangaBot, ChibiBot, BloomBot, SteamBot, FarmBot) rolling a pixel sub-style per render on every scene
path, plus twelve scene paths (eleven new keys plus the farm rework) each wired as a hidden shadow path
on a new "pixel painting" register, pools at MVP-25, QA'd up to three rounds of five renders against
the bar with looks rolling, with a per-path ship checklist so scaling and go-live are mechanical.

---

## 0a. Kevin's mid-build recalibration (2026-09-19, supersedes any wording below that conflicts)

From his in-app review of the first shadow renders: (1) the medium must be unmistakably pixels, near-pixel, or voxel (HD Minecraft); a render that reads as a digital painting is a hard fail and looks that trend toward painting are cut; (2) more WHIMSY: "whimsical, somewhat magical looking pixelart that evokes that old school feel and charm", never realistic landscape or geography (EarthBot's lane); (3) the exact reference: "how video games have historically rendered pixel scenes: how Final Fantasy would have pretty pixel art for its splash or loading screens, or old school Ultima scenes." So the scene register is the pretty SCENE a classic game shows on its title / splash / loading screen (era-authentic limited palette, dithered gradient sky, chunky pixels or tiles), and the looks register is ERA sub-styles (SNES RPG splash, VGA adventure background, Ultima-style tile scene, Amiga 32-colour ordered dither, HD voxel world). Every brief in section 3 is read through this lens: storybook shapes, glowing light, an oversized moon, a charm detail, saturated era palettes. And (4), his clarification: "they should still be pretty and not dummed down, but the medium and vibe need to feel old school, while still pulling off a beautiful/cool render." The bar for beauty, detail, composition, and light does not drop; era lives in the pixel medium and the whimsical vibe. A crude, low-detail, or blocky-for-its-own-sake render fails the Director lens the same way a photoreal one fails the Medium lens.

**(5) Medium bar relaxed, 2026-09-19 ~06:35 UTC (Kevin, from two hearted renders: cozy-room R2 #3 on flux-dev + the Ultima-tile look, cabin-glow R2 #3 on flux-1.1-pro-ultra + the VGA look):** "it's okay to be mildly 'not true pixel', these are slightly pixelated, and remind me of when old computers were first being able to render more 'high def' scenes, so i would say we keep these looks in." So the medium HARD FAIL is only a FULLY smooth painting / vector illustration / photo / 3D with no pixel structure at all; a mildly pixelated, early-high-def computer scene scores 4 to 5 on the medium lens. Applied the same minute: flux-1.1-pro-ultra and flux-dev restored to `SCENE_MODELS` (they produce that register with the VGA and Ultima looks; flux-1.1-pro non-ultra stays out), and a sixth look "Early high-def computer scene art" added to the register in his words. The earlier "looks that trend toward painting are cut" sentence in (1) is superseded by this.

## 0b. Identity of record, current state, and how to continue (written 2026-09-19 ~06:00 UTC at Kevin's request)

This section is the hand-off. It supersedes anything below that conflicts with it.

### PixelBot's identity, in Kevin's words (four messages, same evening, all binding)

1. "more pixelart than 8bit screenshots, even though i do want to still keep the in game stuff, it adds a fun flavor"
2. "we need to make sure the medium is pixels or a near pixel look, or voxel (think HD minecraft, etc.) ... some of these are borderline digital painting, so please take that into account as you're scoring, or when considering what looks make the cut"
3. "we want these renders to have more whimsy, the ones i'm seeing are too serious, we already have earthbot, i want whimsical, somewhat magical looking pixelart that evokes that old school feel and charm, and not these overly realistic landscape or geographic images"
4. "we need to recalibrate exactly what pixelbot is about: we still want beautiful art, but more how video games have historically rendered pixel scenes, kinda how final fantasy would have pretty pixel art for its splash or loading screens, or old school ultima scenes"
5. "they should still be pretty and not dummed down, but the medium and vibe need to feel old school, while still pulling off a beautiful/cool render"

**One-sentence identity:** PixelBot posts the beautiful pixel-art SCENE a classic game shows on its title, splash, or loading screen: whimsical, a little magical, richly detailed, in an era-authentic pixel (or voxel) medium, never a realistic landscape, never a gameplay screen with sprites and menus (those are the seven in-game flavour paths), never a modern digital painting.

**The two questions every render must pass:** (a) does it read as a classic game's pixel scene? (medium lens, hard fail on smooth / painterly / photo); (b) is it beautiful, richly detailed, cool, charming? (director lens, hard fail on crude / sparse / blocky-for-its-own-sake). Old school is the medium and the vibe, not the detail level.

### Where the identity is encoded (all committed on `main`)

- `scripts/bots/pixelbot/shared-blocks.js`: `PAINTING_PREFIX` ("beautiful classic video-game splash-screen pixel art, the lush pretty scene an old RPG shows on its title screen, richly detailed pixels on a visible pixel grid, dithered gradient sky, limited era palette, old-school storybook charm"), `PAINTING_MEDIUM`, `PAINTING_SUFFIX`, `PIXEL_LOOK_OVERRIDE`, and the scene blocks (`SCENE_REGISTER_BLOCK` carries the whimsy + beauty + era statement, `ONE_HERO_BLOCK`, `TINY_LIFE_BLOCK`, `PICTORIAL_BLOCK`, `SCENE_STRUCTURE`).
- `scripts/bots/pixelbot/seeds/pixelbot_look_register.json`: six ERA looks, each "richly detailed": Classic SNES RPG splash, VGA adventure-game background, Old-school Ultima-style tile scene, Amiga 32-colour ordered dither, HD voxel world, and (added 06:35 on Kevin's word) Early high-def computer scene art. Rolled per render in `rollSharedDNA.lookRegister`; scene templates prepend `PIXEL_LOOK_OVERRIDE(sharedDNA)`. Cut with reasons: flat cel, chunky low-res, soft-cluster (drop the grid → smooth), hi-bit painterly and fine-dither (borderline painting), CRT phosphor and inked-outline (indistinguishable), impressionist clusters and voxel diorama (modern, not how games rendered scenes).
- `scripts/bots/pixelbot/scenePaths.js`: `SCENE_MODELS` (flux-2-pro, flux-2-max, flux-2-flex, flux-1.1-pro-ultra, flux-dev; flux-1.1-pro dropped for rendering smooth on 4 of 6 draws; ultra + dev were dropped at 05:55 and RESTORED at 06:35 on Kevin's word, see §0a (5)), pool loading, gates, wiring derivation, `patchInMemory` for unwired paths.
- `scripts/bots/pixelbot/index.js`: `SCENE_PATHS` map (one line per scene path) drives `pathBuilders`, `shadowPaths`, `mediumByPath`, `modelByPath`, `vibesByPath`, chaos + polish skip lists.
- Tooling: `scripts/_pixelbot-scene-render.js --path <key> --count 5 --label <key>-r<N> [--look i]` (shadow-posts, wires in memory, one process per round so recency holds), `scripts/_pixelbot-round-fetch.js --path <key> --since <ISO> --limit 5 --out <dir>` (rows, prompts, images).
- Memory: `project_pixelbot_identity_splash_screen_pixel_art` (identity), `feedback_hearts_are_pointers_not_ratings` (never mine heart history).

### State at hand-off (see `PIXELBOT_PATH_BUILD_STATE.md` for round logs)

| path | state |
|---|---|
| pixel-vista | PASSED R3 (4.62) under the OLD realistic register, which Kevin rejected; six pools regenerated whimsy-first (storybook landforms, oversized moons, candy sky bands, magical light moments, charm details, saturated era palettes); needs a look check (one render per era look) + a fresh R0 under the new register. Wired in `SCENE_PATHS`. |
| pixel-harbor, pixel-cabin-glow, pixel-cozy-room | batch 1, three parallel agents mid-build with all steers delivered by message; each reports a verdict, a round table, files, the `SCENE_PATHS` line, lessons. Orchestrator merges the line, re-verifies the bot loads, commits per path. |
| pixel-cozy-farm | SCRAPPED 2026-09-19 (Kevin: "scrap the farm pixels, we'll leave that domain to farmbot"). |
| pixel-cool-rides, pixel-fantasy-vista, pixel-rain-street | batch 2, not started. |
| pixel-campfire-night, pixel-shoreline, pixel-skyward | batch 3, not started. |
| pixel-ruins | batch 4 (alone; the farm is scrapped), not started. |

### Lessons learned so far (also in the playbook's PixelBot section)

Looks that reduce technique lose the pixel grid; an unattached palette "accent" renders as an object (attach accents to the light); light described as a column renders a column; camera entries must be agnostic of the hero type; "stacked cloud heaps / towers" render as a giant thunderhead; parallel render processes each keep their own recency (one process per round); flux-1.1-pro is the smooth-illustration model on this register; and above all, confirm a bot's aesthetic against the OWNER's reference games before writing the first pool ("beautiful" is not a spec).

### How to continue (exact order)

1. Read this doc, the playbook in full, `PIXELBOT_PATH_BUILD_STATE.md`, and the memory note. Verify: `node -e "const b=require('./scripts/bots/pixelbot'); console.log(b.paths, b.shadowPaths, Object.keys(b.mediumStyles))"` and `cat scripts/bots/pixelbot/seeds/pixelbot_look_register.json`.
2. Render budget: at most three renders in flight bot-wide (agents count). Headroom check first; stay off 07:45 to 08:30 UTC.
3. Collect batch-1 agent reports from `/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/78dd141e-21c0-4e87-8920-71b6f8cfc2a4/scratchpad/agent-pixel-*.md` (or re-run those paths' rounds yourself if the reports are missing: the path files and pools they created are on disk). Merge each `SCENE_PATHS` line, verify the bot loads, commit per path with explicit paths.
4. pixel-vista: look check (five renders, `--look 0..4`), cut any era look that renders smooth or crude, then R0 to R2 under the new register.
5. (pixel-cozy-farm: SCRAPPED 2026-09-19 (Kevin: "scrap the farm pixels, we'll leave that domain to farmbot").)
6. Batches 2, 3, 4 per section 7, three agents at a time, each briefed with sections 0a, 0b, 3.x, 4, 5 and the hard rules from the batch-1 briefs (never edit shared files, never delete, shadow renders only, one process per round).
7. When every path has a verdict: update the tracker table, write a final report for Kevin, and stop. Nothing is deleted and nothing goes live until he reviews in the app and says so; scaling and go-live are section 6.

## 0. Ground rules for this build (non-negotiable, all sourced)

1. **Every test render is a shadow post** (`iter-bot ... --post --shadow`), hidden from the public,
   reviewed by Kevin in the app on PixelBot's profile (purple SHADOW badge). Never `/tmp`-only, never
   HTML sheets as the review surface. The `--shadow` flag exists since commit `0d345649`.
2. **Never mine Kevin's like/favorite history** as a calibration signal (his rule, 2026-09-19). A post he
   names in chat is usable. Nothing else.
3. **MVP-25 pools only** until Kevin signs off a path. Scale-to-production is section 6, after his review.
4. **One variable per QA round.** Fix the specific cause; never over-revert; never stack three fixes.
5. **Diagnose from the stored prompt, never from the image alone:** `uploads.ai_prompt` for the failing
   render, then grep the seed pool, then audit the recipe, then (last) the template.
6. **Positive-only wording everywhere** that reaches Flux (medium fragments, prefixes, suffixes, pool
   entries). Name what IS there. Flux renders the noun even inside a ban. The only permitted negations
   are the standard overlay suppressors in the suffix ("no text, no watermarks").
7. **Axis-clean pools:** the place pool says nothing about light; the light pool says nothing about
   weather; the palette pool is colors and light words only (no scene nouns).
8. **No "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" wording** in any brief (it trips Sonnet's own refusal
   patterns and the refusal text gets rendered). Plain cooperative instruction language only.
9. **Render discipline:** `node scripts/check-pool-headroom.js` must say OK before every batch;
   concurrency at most 3; stay off `:00` and the 07:45 to 08:30 UTC window; batches run in the
   FOREGROUND (iter-bot produces nothing from a backgrounded shell).
10. **Fan-out rules** (from `bot-paths`): one agent = one path; agents never touch `index.js`,
    `pools.js`, `archetypes.js`, `archetype-templates.js`, or `gen-pixelbot-pool.js` (single-writer,
    merged by the orchestrator between batches); at most 3 agents at once.
11. **My grades skew harsh** (floor 3 unless something is broken). "Bolder is not broken." Kevin's
    eye decides the LOOK from the app; the agent's job is mechanical honesty plus fixing real defects.
12. **Log every new lesson into the playbook the moment it's learned**, under a new PixelBot subsection.

### 0.5 PixelBot is a different animal: what transfers from the other bots, and what does not

Kevin's caution (2026-09-19): "pixelbot is a bit of a different animal, so those same principles may
be a bit non-applicable." So, explicitly:

**Transfers (use as written):** the build loop from `bot-paths` (design, seed 25, render, VIEW every
image, judge, root-cause from `ai_prompt`, fix one thing, re-render, three rounds max, move on); the
fan-out rules; shadow posting; MVP-25 before scale; axis-clean pools; positive-only wording; the
Medium Looks architecture and its two FarmBot amendments; the "one hero, never a collage" composition
law; the text and signage guard; the register-collision guard (name the neighbouring bot's territory).

**Does NOT transfer (dropped from the rubric and the recipes):** face-swap forensics and identity
scores; the costume-designer and wardrobe lens; "the hero integrated as a PERSON in the scene";
character DNA axes and `pickCharacter`; tagged shared pools filtered per path (every PixelBot pool is
path-bespoke); the "sometimes no human" roll (scene paths are place-led, life is a small accent axis);
the strict no-humans crowd rules of TinyBot/YumBot (tiny pixel sprites of people are on-brand here, only
their SIZE and count are policed); "I want to live there" as the north star wording (PixelBot's is "a
pixel painting I'd hang or screenshot"); fine-art photographer references (the EarthBot lever, wrong
medium here); the anime-canon vocabulary rule (MangaBot). The one place people-as-cast matters is
`pixel-cozy-farm`, and there the rule is FarmBot's (animals and villagers at equal spotlight), not a
face-swap rule.

**PixelBot-specific rules that exist nowhere else:** the medium is the identity, so the LOOK varies the
pixel SUB-STYLE and nothing else; game-camera and hardware-palette rolls never reach a scene path;
readable text is the number one pixel-genre risk (signs, hulls, maps, billboards), so every hero recipe
says what surfaces show instead; sprite-shaped people are correct on the farm path and small everywhere
else; and "chunky" is a technique word here, not a flaw.

---

## 1. Why the old feed read as "random chaos" (recap, verified in code)

- Two shared per-render rolls injected a random GAME camera (two hundred entries: Doom corridor,
  Castlevania side-scroll, extreme close-up) and a random HARDWARE palette (CGA, Game Boy green, NES
  2-bit) into every path. Scene paths in this plan do not consume either pool.
- The global identity is "game screenshot" plus "NPCs mid-stride, sprite-trail blur, stack everything."
  `PIXEL_ART_ONLY_BLOCK` literally bans the hi-bit painterly pixel register Kevin wants.
- The chaos layer was on for the eleven original paths; the three best-graded paths ran with it off.
- Half the roster was combat gameplay. That half is now cut.

The scene register is built so none of those can reach a scene render.

---

## 2. Phase 0: the pixel-painting register (config first, proven on one path)

Phase 0 is done when `pixel-vista` (section 3.8, the fewest-unknowns path: no people, no text risk)
passes a five-render smoke round on the new register. Nothing else is built on the register until then.

### 2.1 A second bot-local medium, code only, no migration

In `scripts/bots/pixelbot/shared-blocks.js` add and export:

```js
// The pixel-PAINTING register (scene paths). Positive-only, no game / sprite / HUD words.
// IDENTITY + quality only. No dither / palette / shading words here: those belong to the
// rolled LOOK (2.8), which must be free to say "flat, no dither" or "heavy ordered dither".
const PAINTING_PREFIX =
  'pixel-art illustration, hand-placed pixels on a visible pixel grid, crisp hard-edged pixels, atmospheric painterly light';
// CONTENT and composition only (the medium owns "what kind of picture", the look owns technique).
const PAINTING_MEDIUM =
  'a finished pixel-art painting of a place: every surface built from square pixels, deep layered depth to the horizon, soft atmospheric light, one clear subject with room to breathe';
const PAINTING_SUFFIX =
  'no text, no watermarks, every surface pixelated, crisp dithered pixel edges';
```

In `index.js`: `mediumStyles.pixelbot_painting = blocks.PAINTING_MEDIUM`,
`promptPrefixByMedium.pixelbot_painting = blocks.PAINTING_PREFIX`,
`promptSuffixByMedium.pixelbot_painting = blocks.PAINTING_SUFFIX`, and `mediumByPath[<scene path>] =
'pixelbot_painting'` for every scene path. The existing `pixels` medium and `PROMPT_PREFIX` stay
exactly as they are for the in-game paths. (Why this works without a `dream_mediums` row: the
`mediumStyles` override beats the DB fragment, an unknown key returns an empty fragment rather than
throwing, and 2.2 pins models per path so the picker never reads `allowed_models` for the new key.
It is not DLT-eligible; add the two DB rows later if that's ever wanted.)

Litmus: after Phase 0, the first ~40 tokens of a scene render's `ai_prompt` must be the painting prefix,
and must contain none of: screenshot, sprite, SNES, HUD, game.

### 2.2 Model set per scene path (pinned, weighted, tunable)

`modelByPath[<scene path>] = SCENE_MODELS` where, to start, `SCENE_MODELS` is the six enabled Flux
models at equal weight (`flux-1.1-pro-ultra`, `flux-1.1-pro`, `flux-2-pro`, `flux-2-max`,
`flux-2-flex`, `flux-dev`). The weighted-object form hardcodes the roll and bypasses the DB lookup.
After the Phase 0 smoke round, drop any model that rendered smooth illustration instead of pixels
(flux-dev is the suspect: Kevin's saved boat scene came from it and is not pixel art). Per-path pins
beyond that come from Kevin's HTML-matrix protocol if he asks for it, never from guessing.

### 2.3 No shared game rolls on scene paths

Scene templates never interpolate `sharedDNA.pixelPerspective`, `sharedDNA.scenePalette`, or
`sharedDNA.colorPalette` (the VIBE_COLOR "pixel grade" strings are a second color directive). Each
scene path carries its own `camera` and `palette` pools (section 3), so `rollSharedDNA` needs no change.

### 2.4 Vibes, chaos, polish

- `vibesByPath[<scene path>]`: a calm set per path (section 3 lists each). The bot's available keys:
  nostalgic, whimsical, enchanted, cinematic, epic, voltage, fierce, arcane, dark, coquette, ethereal.
  `nightshade` may be added for night paths (it has a VIBE_COLOR entry). Templates slice the vibe
  directive to 150 characters.
- Every scene path goes into BOTH `chaos.skipPaths` and `twoPassPolish.skipPaths`. Setting is the
  co-hero on every one of these paths; polish strips setting language first.

### 2.5 Shared scene blocks (short, in `shared-blocks.js`)

Keep each block to a few lines. Terse beats thorough here (the ChibiBot lesson: verbose stacked
mandates push Flux to its generic centroid).

- `SCENE_REGISTER_BLOCK`: "Write this as a finished pixel-art painting of a real place: one clear
  subject, layered depth, deliberate palette, atmospheric light. Describe only what is present."
- `ONE_HERO_BLOCK`: "One hero, one place, one quiet moment. The hero owns 30 to 60 percent of the frame
  with breathing room around it. Layers: near, middle, far, sky. Never a collage of equal elements."
- `TINY_LIFE_BLOCK`: "If life is present it is small: an animal, a bird, or a single figure turned away
  or at distance, never a portrait, never a crowd."
- `PICTORIAL_BLOCK`: "Every sign, hull, poster, and window is blank or carries a simple pictorial
  symbol." (Positive form of the text guard; the suffix carries the only literal negation.)
- `SCENE_STRUCTURE(order)`: "Write the prompt in this order: [register] [hero and place] [light]
  [air] [life accent if any] [moment if any] [palette]. LENGTH IS THE #1 RULE: 70 to 95 words, count
  them. Name the hero and stop."

### 2.6 Path shape: function-form, self-contained

Every scene path is a **function-form path file** (`paths/<key>.js` exports a builder function) that
requires its own seed JSONs directly and inlines its brief. Reasons: it is the collision-safe shape
for agent fan-out (no shared archetype/template files to merge), the playbook's verdict for
scene-as-hero one-offs, and what the three strongest recent path batches on other bots used. Gates use
`Math.random()`; picks use `picker.pickWithRecency(pool, '<axis-key>')`; `pickN` is two recency picks.
Read `paths/pixel-landscapes.js` in git history (`git show 4e8b932f^:scripts/bots/pixelbot/paths/pixel-landscapes.js`)
and `paths/retro-racing.js` plus its template for the two established shapes before writing one.

### 2.7 Pools per path, generated per path

Each scene path gets its own `scripts/gen-seeds/pixelbot/gen-<key>-pools.js` using
`scripts/lib/seedGenHelper.js`'s `generatePool` (one call per pool, `total: 25`, dedup on), not new
entries in `gen-pixelbot-pool.js` (single-writer). Read an existing gen-seeds script for the exact
call shape first (`git show 4e8b932f^:scripts/gen-seeds/pixelbot/gen-pixel-item-shop-pools.js`).
Every recipe: THE BAR paragraph, a VARIETY MANDATE with bucket counts, the axis-clean rule for that
axis, 6 to 12 touchpoints in the path's voice, and a format spec (`CAPS TITLE: body, 25 to 50 words`).
Pools load at `require` time, so run the gen BEFORE wiring the path file.

### 2.8 The Pixel Looks register (Kevin: "confirm your plan includes creating a pixel looks system")

The Medium Looks architecture, sixth bot. PixelBot is a STYLE-identity bot like MangaBot, so the
register varies the pixel SUB-STYLE while the painting medium locks "this is pixel art." Every entry is
pure rendering technique, stays inside pixel art, and is hand-authored (the MangaBot lesson: twelve
curated looks beat twenty-five generated near-duplicates). Scene paths only; the in-game paths keep
their locked SNES register (per-path granularity, the MangaBot exclusion pattern).

**Mechanism (mirrors SteamBot and FarmBot, with both amendments applied):**

- `seeds/pixelbot_look_register.json`: hand-authored strings, loaded in `pools.js` as
  `PIXELBOT_LOOK_REGISTER` (`loadIfExists`).
- `rollSharedDNA` adds `lookRegister: picker.pickWithRecency(pools.PIXELBOT_LOOK_REGISTER, 'look_register')`
  (recency rotation, so two same looks never post back to back).
- `shared-blocks.js` exports `PIXEL_LOOK_OVERRIDE(sharedDNA)`: returns `''` when no look rolled, else
  three plain lines in cooperative wording (no NON-NEGOTIABLE / AUTHORITY / OVERRIDES words, the
  FarmBot amendment): "Please write the Flux prompt using this pixel-art style throughout:
  <look>. Keep every scene element, the composition, and the light exactly as described below; just
  describe everything with this style's pixel technique. Start the prompt with these style words."
- Every scene path file opens its returned brief with `${PIXEL_LOOK_OVERRIDE(sharedDNA)}`.
- The painting PREFIX carries identity only (2.1) so the look leads on technique inside Sonnet's
  output, right after the prefix (the BloomBot lesson: replace or strip the prefix's competing style
  tokens so the look can lead).
- Tracing: the look is the first thing in Sonnet's output, so a render's look is readable from the
  opening of its stored `ai_prompt`. If that ever proves ambiguous, add a `look` field to the
  stored `recipe` the way FarmBot uses its `scenePalette` trace field.

**Entry rules (the two amendments, enforced on every string):** (a) repeat a pixel-family word two or
three times anchored to render-technique nouns (grid, dither, palette count, edges, outline, shading
bands, cluster); (b) ZERO time-of-day, weather, season, lighting, or color-mood words (the light, air,
and palette axes own those, and a look that says "twilight" contradicts the roll); (c) no subject
anatomy or content nouns; (d) no word that is double-meaning across medium families ("painterly"
alone can mean 3D; write "painterly pixel clusters"); (e) no era or product whose canonical subject is
not a scene (the Art-Nouveau-drags-a-woman lesson: PC-98's canonical subject is an anime girl, so it
is a test-and-likely-cut entry).

**Candidate register (curate to about ten after the render check):**

| Look | Technique it varies |
|---|---|
| Hi-bit painterly pixel art | large palette, soft dithered gradients, hand-placed pixel clusters, hard edges |
| Classic 16-bit pixel art | per-region 16-colour discipline, chunky visible grid, banded dither |
| Chunky low-res pixel art | big bold pixel blocks, four shades per material, strong silhouettes |
| Ordered-dither pixel art | Bayer checkerboard dithering on every gradient, banded skies |
| Flat cel pixel art | no dither, flat fills, crisp two-step shading |
| Inked-outline pixel art | dark one-pixel outlines around every form, clean interior fills |
| Impressionist pixel clusters | loose textured clusters, brush-like strokes built from pixels |
| CRT phosphor finish | subtle scanlines, bloom on the brightest pixels, slight colour bleed |
| Fine-dither pixel art (test) | very fine checker dithering, high contrast; cut if it drags anime subjects |
| Isometric pixel diorama (path-gated only) | changes the CAMERA, so never bot-wide; offer to cozy-farm and cozy-room only if wanted |

Excluded on purpose: monochrome and four-shade Game Boy looks (they change COLOUR and would fight the
palette axis; the MangaBot B&W-screentone exclusion), pastel or muted looks (colour words belong to
the palette axis), anything anime-coded.

**Verification in Phase 0 (before any other path is built):** render `pixel-vista` once per candidate
look (force the look for the batch by temporarily pointing the pool at a one-entry array in a
throwaway wrapper, or by reading the `ai_prompt` opener to map each render to its look after a
twelve-render batch). Each look must read visibly distinct and stay pixel art; cut any that renders
smooth, drags a subject, or is indistinguishable from a sibling. From then on every path's QA rounds
run with the register rolling, so a path's verdict already covers its looks.

### 2.9 Phase 0 exit gate

Two gates. (1) The look check in 2.8: the curated register is down to entries that each read distinctly
and stay pixel art. (2) `pixel-vista` R0, five shadow renders with looks rolling: average at or above
4.0, every render reads as pixel art (grid, hard edges, the rolled look's technique visible), no game
camera, no text. If the register itself fails (smooth illustration on
most models, or "screenshot" language in prompts), fix the medium wording as the single variable and
re-run. Then proceed to the other paths in section 7's order.

---

## 3. Path concepts (the creative briefs)

Every scene path shares one skeleton, then differs in what fills it:

| Slot | Role | MVP | Scale | Gate |
|---|---|---|---|---|
| `place` (or `hero`) | the hero subject and its place, path identity | 25 | 200 | always |
| `light` | time of day and light only | 25 | 100 | always |
| `air` | what the air is doing only (mist, rain, snow, clear, dust) | 25 | 60 | always |
| money-shot axis | the one detail this kind of scene is famous for | 25 | 60 | always |
| `life_accent` | tiny life, never the hero | 25 | 60 | ~0.6 |
| `moment` | a small event or phenomenon | 25 | 50 | ~0.35 |
| `camera` | painterly framings for THIS path (audited as a set, section 4.3) | 25 | 25 | always |
| `palette` | color harmonies, colors and light words only | 25 | 40 | always |

Every pool is path-bespoke (Kevin's rule: never share pools or axes across paths). Pool names:
`pixelbot_<key>_<slot>`. Hero pools carry a `CAPS TITLE: body` format so the format-drift scan works
at scale.

### 3.1 `pixel-harbor` (Tier 1, closest to the boat scene Kevin saved)

**Identity.** Boats, water, and the places built beside them: a wooden dock with a rowboat, a fishing
village harbor at dusk, a lighthouse on a point, a canoe on a misty lake, a marina of small sailboats,
a river ferry landing, a houseboat on a canal, a tropical pier. Small, old, hand-built, calm.
**Hero and lock.** One boat or one waterside structure is the hero at mid-distance; water fills a third
to half of the frame; a far shore or horizon gives depth. **Money-shot:** `reflection` (what the water
does with the light: lantern glow doubled in still water, a rippled sunset band, a moonlight path,
window light smeared on wet planks). **Life accent:** ducks, gulls, a cat on the dock, a heron, a lone
fisher at distance. **Moment:** a lantern being lit, a boat casting off, rain starting, fireflies over
the reeds, a shooting star. **Vibes:** nostalgic, enchanted, cinematic, ethereal. **Camera pool:** from
the dock end, across the water from the bank, slightly elevated over the harbor, from the boat toward
shore, down the pier. **Traps and the positive fix:** "harbor" pulls a modern port with cranes and
container ships (write "a small old fishing harbor of wooden boats"); "boat" pulls a yacht (name the
type: rowboat, dory, skiff, sailboat, canoe, ferry, houseboat); hulls and signs carry gibberish
(PICTORIAL_BLOCK plus "unmarked hulls" in the hero recipe); sailors render large (TINY_LIFE_BLOCK).
**Register guard:** OceanBot owns sea creatures and the deep; no sea life as hero here. BrickBot owns
brick harbors. **Place buckets (25):** lakeside dock 5, fishing-village harbor 4, lighthouse point 3,
river landing or ferry 3, misty lake canoe 3, small marina 3, canal houseboat 2, tropical pier 2.

### 3.2 `pixel-cabin-glow` (Tier 1)

**Identity.** One dwelling lit from inside, in its landscape, at dusk or night: a log cabin in snow, a
forest cottage, a lighthouse keeper's house, a treehouse, a hillside farmhouse, a tea house by a
stream, a desert adobe, a cliff hut, a stilt house over a lake. **Hero and lock.** The dwelling is the
hero at mid-distance; its lit windows are the brightest thing in the frame; the landscape wraps it.
Always evening or night (the glow IS the path). **Money-shot:** `window_glow` (amber squares thrown on
snow, a door left open spilling gold, chimney smoke lit from below, a porch lantern, light through
frost). **Life accent:** a cat in the window, a dog on the porch, deer at the treeline, a tiny figure
carrying firewood. **Moment:** first snow, smoke rising, a lamp coming on, aurora, a shooting star.
**Vibes:** nostalgic, enchanted, ethereal, nightshade. **Camera pool:** from the path approaching, from
across a frozen lake, from the treeline, slightly elevated on the hillside, through falling snow.
**Traps and fix:** Flux's cozy-cottage prior adds iron lanterns and pots (accept as cosmetic); "cabin"
pulls a modern A-frame rental (write "old, hand-built, weathered timber"); the lone-figure-walking-into-
the-light trope spawns a person at the vanishing point (write "the path to the door is empty"); every
render at the same warm-golden cast (the light pool must span blue hour, moonlit silver, aurora green,
deep night with one warm window; the template ties glow color to the rolled light). **Register
guard:** FaeBot owns fae cottages (no fae, no magic here); GothBot owns haunted houses. **Place
buckets (25):** snow 5, forest 5, coast or cliff 3, mountain 3, meadow 3, desert 2, tropical 2, lake
or marsh 2.

### 3.3 `pixel-cozy-room` (Tier 1)

**Identity.** An interior with a view; the room is the whole world: an attic bedroom under the eaves, a
kitchen with a kettle, a reading nook, an artist's studio, a tea room, a cabin interior, a lighthouse
lamp room, a sleeper-train cabin, a treehouse room, a greenhouse corner. The classic pixel-art loop
scene, still. **Hero and lock.** Interior, eye level; ONE window is the light source and the outside is
glimpsed through it as part of the very same unbroken shot (the split-panel trap: never describe
"inside" and "outside" as two zones). **Money-shot:** `window_view` (rain on the glass, snow falling
outside, distant city lights, a sunset, a forest, the sea). **Objects:** a second pool `objects`
picked twice (a steaming kettle, stacked books with blank spines, a record player, trailing plants, a
quilt, a desk lamp). **Life accent:** a cat on the sill, a dog asleep, a bird outside the glass, one
small figure reading with their back to us. **Moment:** rain beginning, tea steam, a lamp flickering
on, snow thickening. **Vibes:** nostalgic, whimsical, enchanted, coquette. **Camera pool:** eye level
from the doorway, seated height by the window, a corner three-quarter, low from the floor.
**Traps and fix:** this is the path closest to a portrait (TINY_LIFE_BLOCK plus "if a person is present
they are small, seated, turned away" in the life recipe); text on posters, spines, screens ("blank
spines, wordless posters, a dark screen"); the split-panel render (positive one-shot rule in the
template). **Register guard:** MangaBot owns anime slice-of-life (no anime characters); YumBot owns
food-with-faces. **Room buckets (25):** attic bedroom 4, kitchen 4, reading nook 3, studio 3, tea room
2, cabin interior 3, lighthouse or tower room 2, train cabin 2, treehouse or greenhouse 2.

### 3.4 `pixel-rain-street` (Tier 1, highest risk)

**Identity.** Old-town streets after rain, lit by windows and lamps: a cobbled lane, a canal-side
street, hillside stairs, a covered arcade, a tram stop, a corner bakery still lit, a stone bridge, a
station forecourt. European old town, Japanese old quarter, coastal village; dusk or night; wet.
**Hero and lock.** The street recedes into depth; ONE focal element (a tram, a bakery window, a bridge,
a lamp post) is the hero; wet pavement carries the light. **Money-shot:** `pavement_reflection`.
**Life accent:** a single umbrella figure small and distant, a cat under an awning, a cyclist, a bus
far off. **Moment:** a tram passing, a shop closing its shutters, a lamp flickering, rain easing to
mist. **Vibes:** nostalgic, cinematic, enchanted, nightshade. **Camera pool:** down the lane at eye
level, from the top of the stairs, across the canal, under the arcade, from a bridge.
**Traps and fix:** this is where the old cyberpunk path died (Flux renders modern city scenes smooth);
so: old town only, "warm window light and old street lamps" (never neon, never towers); cars by era
silhouette only ("a small rounded old car") or none; signage is the biggest gibberish risk
(PICTORIAL_BLOCK plus "blank wooden signboards and pictorial shop symbols" in the hero recipe); crowds
both trip the flux-1.1 NSFW filter and steal the frame (sparse, distant, at most two figures).
**Model note:** if two or more of five R0 renders drift to smooth illustration, drop `flux-dev` and
`flux-2-flex` from this path's `modelByPath` as the round's single variable. **Register guard:**
MangaBot owns anime-rain (no anime, no Japan-specific canon names); StarBot owns neon cities.
**Street buckets (25):** cobbled lane 5, canal street 4, hillside stairs 3, arcade 3, tram stop 3,
bakery corner 3, bridge 2, station forecourt 2.

### 3.5 `pixel-cool-rides` (Tier 1, the "race cars" feeling as scenes)

**Identity.** A cool machine at rest or cruising through a beautiful place, painted, not raced: a boxy
old motorcycle on a coast road, a camper van at an overlook, a steam locomotive on a trestle, a
biplane over patchwork fields, a vintage tram on a hill, a hot-air balloon at dawn, a snowmobile on a
ridge, a scooter in a hill town, a small propeller seaplane at a lake. **Hero and lock.** The ride is
the hero at mid-distance in profile or three-quarter, small enough that the landscape is a co-star; the
road, track, or river recedes as a lead line. Cruising or parked, never racing (retro-racing owns the
chase camera and the race). **Money-shot:** `route_line` (switchbacks, a trestle bridge, a cliff road,
a ridge road, a river bend, a runway of fields). **Ride pool:** `ride` (25, later 100), morphological
only, no makes or models (IP rule): "a boxy 1970s touring motorcycle with a round headlamp." **Life
accent:** a rider small on the bike, a dog in the sidecar, gulls, cows by the fence. **Moment:** a
headlight beam at dusk, dust trailing, a train's steam plume, a balloon lifting. **Vibes:** nostalgic,
cinematic, epic, ethereal. **Camera pool:** three-quarter from the roadside, side profile with the
valley behind, from the ridge above, from the trestle's end, low from the shoulder.
**Traps and fix:** real makes and models (recipe ban, post-gen regex); modern supercars (era by
silhouette words: boxy, rounded, long-hood, round headlamp; the MangaBot touge lesson says a third
still drift, accept the residual); crash, drift, or race framing (retro-racing territory: "cruising",
"parked at an overlook"); riders large (TINY_LIFE_BLOCK). **Register guard:** retro-racing = sunset
arcade chase-cam racing; cool-rides = a painting of a ride in a place. **Ride buckets (25):**
motorcycle 5, camper or van 4, steam train 4, small plane 3, tram or trolley 3, balloon 2, boat-plane
or seaplane 2, snow or dune machine 2.

### 3.6 `pixel-fantasy-vista` (Tier 1)

**Identity.** A fantasy place you'd want to visit, painted in pixels: floating islands trailing
waterfalls, a wizard's tower on a sea stack, a giant tree with a city in its branches, crystal caverns,
a moonlit castle over a lake, a sky whale drifting over hills, a glowing mushroom forest, ruins
reclaimed by jungle, a bridge to a cloud city, a lantern city on a cliff. **Hero and lock.** The
landmark is the hero at 40 to 60 percent of the frame and reads in two seconds; tiny scale-provers
(birds, a traveler on a path, lit windows) prove its size. Bright, inviting, wondrous. **Money-shot:**
`wonder_light` (glowing waterfalls, a lantern swarm, aurora, bioluminescent flora, a moon too large,
sunrise through the arch). **Sky:** its own axis, overhead only. **Life accent:** a tiny traveler or
caravan, birds, a small boat, a distant dragon silhouette (far, small, never the hero). **Moment:** a
lantern release, a meteor, a passing sky-ship, mist parting. **Vibes:** enchanted, ethereal, epic,
whimsical. **Camera pool:** wide from the valley floor, from a cliff opposite, from the path below
looking up, across a lake toward the landmark, from a high ridge.
**Traps and fix:** the genre's default dark or grim tone (the far-eden lesson: write the wanted tone
into every recipe: "inviting, bright, wondrous, a place you'd want to visit"); literal-prone words
(vortex, portal, saucer, disc: use "arch", "gateway of light", "floating"); humans large; overlap with
DragonBot (no dragon hero, no knights or elves as subjects) and StarBot (no space, no planets in the
sky beyond one large moon). **Landmark buckets (25):** floating islands 3, tower or spire 3, giant
tree 3, crystal or cave 3, castle 3, sky creature 2, glowing forest 3, ruins 3, cloud city 2.

### 3.7 `pixel-cozy-farm` (the rework; FarmBot's world in pixel art) — SCRAPPED 2026-09-19 (Kevin: "scrap the farm pixels, we'll leave that domain to farmbot")

**Not built further.** The farm domain belongs to FarmBot; PixelBot posts no farm content. The path file, gen script, and eight MVP-25 seed pools were removed the same day (git history keeps them); the five R0 shadow renders (06:14 UTC) stay hidden, ungraded. The old in-game `cozy-farming-life-sim` stays parked in `shadowPaths` (not live) until Kevin says what to do with it. The brief below is history only.

**Spec of record:** `FARMBOT_CREATIVE_DIRECTION.md` (read sections 1 to 10 before writing a single
recipe). Kevin on the old path: "way too many realistic farm or just not that fun of posts, takes
itself a bit serious. it should be akin to farmbot, but pixels." The old `cozy_farming` pools are NOT a
starting point (his no-salvage rule); they stay on disk only until this path ships, then get deleted.
**Identity.** Cute over cozy over whimsical over beautiful over realistic, always in that order. Hay
Day's world and variety, cozy-storybook emotion, rendered as chunky-cute pixel art. Animals are a
major signature with EQUAL spotlight to people, baby-animal biased, each with a personality and a
behavior; villagers are warm archetypes (baker, shepherd, herbalist, innkeeper, farm girl) INTERACTING
with animals or food, never standing beside them; food and baking; crafts; a seasonal calendar; weather
as a feeling; "nothing happening" leisure is a valid scene. **The three-layer model from the spec:**
a named VIGNETTE ("ducklings crossing the yard while the baker carries bread", "a kitten asleep in the
strawberry basket", "goats on the bakery roof", "the sheep watching the laundry dry") is the hero pool;
scene DNA (place, season, weather) composes around it; SERENDIPITY adds two unexpected cute details.
**Hero and lock.** One vignette, one place; animals and people at equal weight; chunky-cute pixel
sprites with big heads are correct here (this is the one scene path where sprite-shaped characters are
the point); bright, saturated, cheerful. **Money-shot:** `serendipity` picked twice. **Axes:**
`vignette` (25, later 200; buckets: animal antics 6, baking or food 4, market or village 3, chores
gone cute 4, leisure or nothing happening 3, seasonal 3, weather-as-feeling 2), `farm_place` (the
stage: yard, orchard, barn door, pond edge, bakery front, market square, greenhouse, porch),
`season_weather` (one axis, each entry season plus weather plus time), `animal_cast` (one to three
animals, baby bias, each doing something with personality), `villager` (gate 0.6: warm archetype in
cute proportions, interacting with an animal or food), `serendipity` (pick 2), `camera` (cozy
storybook iso three-quarter and eye level; never a top-down map, never side-scroll), `palette`
(bright cheerful harmonies). **Vibes:** whimsical, nostalgic, coquette, enchanted. **Traps and fix:**
realistic agriculture nouns (tractor, combine, crop rows in perspective, industrial: recipe ban plus
post-gen regex); serious or somber tone ("cheerful, silly, sweet" in every recipe); the old template's
"farmer mid-task, never an empty farm" mandate (gone; the vignette drives); "horse keeper" style
compound nouns rendering part-animal people (reorder so the animal is the object of care); text on
signs and crates. **Register guard:** FarmBot renders this world as anime-storybook; this path renders
it as pixel art. The medium is the entire difference and both bots may share the world; do not copy
FarmBot's pool text (pixel scenes need pixel-native description: tiles, sprites, chunky forms).

### 3.8 `pixel-vista` (the epic-vista re-frame; Phase 0's proving path)

**Identity.** Big natural landforms as pixel paintings: a mountain range at dawn, a canyon, a fjord, a
desert of dunes, a volcanic coast, an arctic shelf, sea cliffs, rolling hills, a river valley, an
island. No character; the vista is the photo. Built as a NEW shadow key so the live `epic-vista` is
untouched during the build; at go-live, `epic-vista` is cut and `pixel-vista` promoted. **Hero and
lock.** The landform fills 60 to 70 percent of the frame; scale-provers stay tiny and deep; no
near-foreground prop competing with the subject (the EarthBot scene-as-hero lesson). **Money-shot:**
`light_moment` (alpenglow on one peak, a storm break, god-rays through cloud, the first sun on the
canyon rim, moonrise). **Sky:** its own axis. **Life accent:** a flock, a tiny caravan, a single boat,
a lone tree. **Moment:** rain curtain far off, a rainbow, snow beginning. **Vibes:** epic, ethereal,
cinematic, nostalgic. **Camera pool:** wide from a facing ridge, from the valley floor looking up,
from the shore across the water, from a high pass, along the canyon.
**Traps and fix:** the old pool's "4-layer parallax side-scrolling screen" boilerplate (the new
`landform` pool is generated fresh with no screen language); tourist vantage names and famous landmark
names pull stock photos (describe geology, never name viewpoints); "cathedral / colonnade / column
formation" on forests renders a symmetrical nave (banned vocabulary in the forest bucket); lenticular
"disc hovering" clouds render UFOs (weather-true cloud language). **Register guard:** EarthBot owns
photographic real Earth; BrickBot owns brick vistas. **Landform buckets (25):** mountains 4, canyon 3,
fjord or coast cliffs 4, desert 3, volcanic 2, arctic 2, hills or valley 4, island or lake 3.

### 3.9 `pixel-campfire-night` (Tier 2, included by Kevin 2026-09-19)

**Identity.** Night scenes lit by one small warm source under a big dark sky: a campfire in a clearing
beside a tent, a lantern festival on a river, fireflies over a meadow, a beach bonfire, a mountain hut's
fire under the stars, a fishing boat's lantern on a lake, a night lane hung with paper lanterns, a
lighthouse beam sweeping fog. **Hero and lock.** ONE warm point light is the hero; the sky fills the top
half; everything else is silhouette or dimly revealed. The night stays VISIBLY LIT (the DinoBot night
law: describe what the light reveals, so it is a lit nocturne, never a black cutout). **Money-shot:**
`sky_field` (stars, the Milky Way, a moon, aurora, a meteor). **Light axis:** `fire_light` (what the
warm source does: embers, lantern glow on tent canvas and rocks and water, a beam through fog).
**Air:** smoke, mist, clear cold, drizzle. **Life accent (0.6):** at most two figures, small and turned
toward the fire, a dog, a deer at the tree line, an owl. **Moment (0.35):** sparks rising, a meteor,
lanterns lifting, a log collapsing, the beam sweeping past. **Vibes:** nostalgic, enchanted, ethereal,
nightshade. **Camera pool:** from beyond the fire looking to the sky, low from the ground, from across
the water, from the hillside above, down the lantern lane.
**Traps and fix:** firelit faces pull a portrait (TINY_LIFE_BLOCK plus "figures turned away toward the
fire"); Flux's "magical night" prior adds glowing motes and glowing eyes (write "the only lights in the
frame are the fire, the lanterns, and the sky"); festival crowds trip the NSFW filter and steal the
frame (sparse, distant, two figures at most); a black cutout render (the lit-nocturne law in the light
recipe and the template). **Register guard:** GothBot owns night dread; StarBot owns space (this is
Earth's sky, one moon). **Place buckets (25):** campfire clearing 6, lantern-festival river 4, firefly
meadow 3, beach bonfire 3, mountain hut 3, lake boat lantern 2, lantern lane 2, lighthouse beam 2.

### 3.10 `pixel-shoreline` (Tier 2, included)

**Identity.** The edge of the sea by day: a wide beach at low tide, tide pools on black rock, chalk or
basalt cliffs, surf at golden hour, a boardwalk and pier, grassy dunes, a rocky cove, a tropical
lagoon, a pebble beach with one hut, a sea arch or stack. **Hero and lock.** One coastal landform or
structure is the hero; the horizon sits deliberately low or high, never centered; the water shows wave
structure. Wild and empty. **Money-shot:** `sun_on_water` (a glitter path, backlit spray, a wet-sand
mirror, foam lines catching low sun). **Light axis:** coastal light (noon glare, low golden sun, overcast
pearl, dawn pink, storm light). **Air:** spray, haze, clear, wind-blown sand, sea fog. **Life accent
(0.6):** gulls, a crab in a pool, a dog running, a lone figure far down the beach, a sailboat on the
horizon. **Moment (0.35):** a big set wave, a rainbow in the spray, a squall offshore, a flock lifting.
**Vibes:** nostalgic, cinematic, ethereal, whimsical. **Camera pool:** from the dune crest, low from the
wet sand, from the cliff top, along the pier, from inside the cove.
**Traps and fix:** the resort prior (loungers, umbrellas, pools: write "wild, empty, no furniture");
swimwear figures (TINY_LIFE_BLOCK, no swimwear words anywhere); tourist beach names (describe the
geology); a wave tube is welcome, a surfer as hero is not. **Register guard:** EarthBot owns
photographic beaches; OceanBot owns sea creatures (no creature hero). **Place buckets (25):** wide beach
4, tide pools 3, cliffs 4, surf at low sun 3, boardwalk or pier 3, dunes 2, cove 2, lagoon 2, arch or
stack 2.

### 3.11 `pixel-skyward` (Tier 2, included)

**Identity.** Things that float or fly over a landscape: a hot-air balloon festival at dawn over valley
fog, a lone balloon over patchwork fields, a simple canvas airship over hills, kites over a hill town, a
sky harbor with moored airships (the fantasy edge), a glider over cliffs, a fleet of balloons over
desert rock, a paraglider over a coast. **Hero and lock.** ONE vessel is the hero in the upper middle of
the frame; the sky is 50 to 70 percent of the frame as a banded gradient; the landscape below is the
base layer. **Money-shot:** `sky_bands` (the dithered gradient sky itself: dawn peach into lavender,
storm bands, high cirrus streaks, a clean cobalt dome). This is pixel art's signature and the axis
must be rich. **Light axis:** sky light. **Air:** valley fog, clear, high cloud, drizzle veils.
**Life accent (0.6):** birds, a tiny figure in the basket, sheep or cattle below, a second smaller
balloon far off. **Moment (0.35):** a launch, a burner flare, rain shafts, a rainbow. **Vibes:**
ethereal, whimsical, enchanted, cinematic. **Camera pool:** from the ground looking up, from another
basket, from a ridge level with the vessel, wide from the valley floor.
**Traps and fix:** "airship" pulls steampunk brass or a military zeppelin (write "a simple canvas
envelope with a wooden gondola"); envelopes carry text and logos (PICTORIAL_BLOCK plus "plain striped
or patterned envelopes"); "disc-shaped" anything renders a saucer (never); the word drone is banned.
**Register guard:** SteamBot owns steampunk airships; StarBot owns space. **Vessel buckets (25):**
balloon festival 5, lone balloon 4, canvas airship 4, kites 3, glider 2, sky harbor 3, coastal blimp 2,
paraglider 2.

### 3.12 `pixel-ruins` (Tier 2, included)

**Identity.** Ancient ruins reclaimed by nature, calm and beautiful: a mossy temple in jungle, a sunken
city in clear shallows, a desert colonnade half in sand, an overgrown castle keep, a stone circle on a
moor, a cliff monastery, a flooded hall, terraces of a lost hill city, an aqueduct striding a valley, a
tower wrapped in roots. **Hero and lock.** The ruin is the hero at 40 to 60 percent of the frame; nature
climbing it is the second read; serene and romantic, never grim, never combat, never horror (the
GothBot elegy lesson as a top rule: beautiful decay, never rot). **Money-shot:** `light_shaft`
(god-rays through a broken roof, sun through an arch, light on water inside the ruin, dust in beams).
**Light axis:** interior and exterior light. **Air:** mist, dust, humid haze, drizzle. **Life accent
(0.6):** nesting birds, a fox, monkeys, a deer, a single tiny traveler on the path. **Moment (0.35):**
rain beginning, a flock bursting out, petals falling, sunset through the arch. **Vibes:** enchanted,
ethereal, nostalgic, epic. **Camera pool:** from the approach path, from inside looking out through the
arch, from the terrace above, from across the water, low among the fallen stones.
**Traps and fix:** the explorer-hero pull (TINY_LIFE_BLOCK); famous ruin names pull stock photos
(describe, never name); carvings render gibberish (write "worn pictorial reliefs"); planted-avenue
symmetry on the approach ("scattered fallen stones, an irregular path"). **Register guard:** DragonBot
owns dragon-lore relics (no relic hero, no dragons); GothBot owns gothic dread; DinoBot owns the
prehistoric. **Ruin buckets (25):** jungle temple 5, sunken city 3, desert colonnade 3, overgrown keep
3, stone circle 2, cliff monastery 3, flooded hall 2, terraced city 2, aqueduct 2.

Season and weather is deliberately an axis inside every path, not a path of its own.

---

## 4. Build procedure per path (exact steps)

1. **Design pass (15 min):** write the recipes for all pools from section 3 into
   `scripts/gen-seeds/pixelbot/gen-<key>-pools.js`. Each recipe: THE BAR, VARIETY MANDATE with the
   bucket counts above, the axis-clean rule, positive-only trap fixes, 6 to 12 touchpoints in the
   path's voice, `CAPS TITLE: body` format at 25 to 50 words. The camera and palette recipes are short.
2. **Generate MVP-25** for every pool: `node scripts/gen-seeds/pixelbot/gen-<key>-pools.js` (all pools,
   `total: 25`, append off). Verify every JSON has 20 or more entries (dedup can trim a few).
3. **Post-gen sweeps** (all must be clean before the first render; fix by surgical edit or regen):
   - off-genre and modernity: `pirate|tricorn|flintlock|steampunk|cyberpunk|neon|hologram|drone|smartphone|laptop|billboard|logo|brand|lettering|caption|reads "|says "`
   - real vehicles and IP (cool-rides especially): `Harley|Honda|Yamaha|Vespa|Volkswagen|VW|Porsche|Ford|Toyota|Jeep|Cessna|Piper|Mario|Zelda|Stardew|Pokemon`
   - crowd and portrait words in scene pools: `crowd|throng|bustling|mass of people|close-up of (his|her) face|portrait of`
   - negations inside entries: `\bno\b|\bnever\b|\bnot\b|without` (rewrite to the positive)
   - camera pools (audited as a SET, every entry read): `close-up|macro|extreme close|hands|fingers|first-person|top-down map|side-scroll|HUD|screen|split|panel`
   - sky and air pools: `disc|disk|saucer|plate|metallic|hovering|suspended|motionless`
   - vista landform pool: tourist and landmark names (any "X Point", "X Overlook", Half Dome, El Capitan,
     Delicate Arch, Yosemite, Bryce, Grand Canyon, Yellowstone), and `cathedral|colonnade|column formation|nave|aisle|avenue of`
   - CJK: `[　-鿿]`
   - duplicates: eyeball titles; the helper dedups by signature but a rewording pass can slip through.
4. **Write the path file** `scripts/bots/pixelbot/paths/<key>.js` (function-form, section 2.6),
   requiring its own JSONs, using the shared scene blocks, with the gates and pick counts from section
   3, and `SCENE_STRUCTURE` last. `node --check` it.
5. **Wire it** (orchestrator only, one path at a time): `pathBuilders[key]`, `shadowPaths` (NOT
   `paths`), `mediumByPath`, `modelByPath`, `vibesByPath`, `chaos.skipPaths`, `twoPassPolish.skipPaths`.
   Verify: the bot loads, `shadowPaths.includes(key)`, `paths.includes(key) === false`, and a dry brief
   composes (`node -e` calling `bot.buildBrief` with a stub picker, or `iter-bot --dry-run --count 1`).
6. **Round 0:** headroom OK, off-peak, then
   `node scripts/iter-bot.js --bot pixelbot --mode <key> --count 5 --label <key>-r0 --post --shadow`.
7. **Collect the round:** query the five rows (`user_id` = PixelBot, `shadow = true`, caption
   `[<key>]`, `created_at` since the batch start): `id, model, dream_vibe, image_url_display, ai_prompt`.
   Download each image and Read it. Never grade from the log line or `style_summary`.
8. **Grade and diagnose** (section 5), log the round in the tracker, fix ONE variable, repeat as
   round 1 and round 2 if needed.
9. **Commit per path** (explicit paths: the path file, its gen script, its seed JSONs, the index and
   pools edits), message naming the round count and verdict. Never `git add -A`.

An agent building one path in fan-out does steps 1 to 4 and 6 to 8 using the in-memory wrapper from
the `bot-paths` skill (it pushes the key onto `bot.shadowPaths` in memory and calls `runBot` with
`post: true, shadow: true`), then reports the exact `index.js` lines for the orchestrator to merge in
step 5. It never edits shared files.

---

## 5. QA protocol (per path, per round)

### 5.1 The crew (from `dream-shoot`, adapted to pixel scenes): every lens on every render

| Lens | Question | 5 | 3 | 1 |
|---|---|---|---|---|
| Medium (pixel fidelity + look) | Does it read as pixel-built (grid, dither, hard or gently softened edges), and did the rolled look's technique read? | crisp pixel painting, look unmistakable; a mildly pixelated early-high-def scene is a 4 to 5 (Kevin 2026-09-19) | pixel structure faint, look faint | FULLY smooth painting, vector illustration, 3D, or photo with no pixel structure |
| Cinematographer (one hero) | Does the eye land on one subject in two seconds, with breathing room and depth? | one hero, four layers | hero readable but busy | collage, no hero, or a game camera |
| Set dresser (place) | Does it say THIS place, with specific believable detail? | specific, storied, lived-in | generic but coherent | muddy, wrong place, or empty |
| Lighting (light and palette) | Is the light deliberate and the palette one harmony? | cinematic, coherent | flat but fine | two palettes fighting, or a wrong cast |
| Director (charm) | Would you want to be there? Cozy, cool, or wondrous per the path? | yes, instantly | pleasant | dull, grim, or serious when it should be sweet |

Score = the average of the five lenses. **Hard fails cap a render at 2** regardless of lenses:
readable text or gibberish signage; any HUD or UI element; a person large or uncanny; wrong medium
family (photo, 3D, a FULLY smooth painting or vector illustration with no pixel structure; mildly pixelated is fine); two unrelated scenes in one frame; game-screen framing
(side-scroll platform, top-down map, first-person corridor) on a painting path; Sonnet refusal or
meta-commentary in `ai_prompt`.

### 5.2 Pass rule

Kevin's bar is 4 to 4.5. **A path passes a round when the five-render average is at or above 4.5 AND
no single render is below 4.** Any render below 4 is a defect to root-cause. A round at 4.0 to 4.5
with no hard fails is "close": fix the single most common lens miss and run one more round.

### 5.3 Rounds

- R0 after seeding. If it passes, the path is done (Kevin said "or less if the path is killing it").
- Otherwise diagnose, change ONE variable, R1. Then R2. **Three rounds maximum.** After R2, record the
  residual defect and rate, mark the path "3 rounds, residual: X", and move on. Do not grind on model
  lottery (a one-in-five smooth-render drift or a one-in-six far-figure is a known accepted rate).

### 5.4 Diagnostic order and the allowed lever per round

1. Read `ai_prompt` for every sub-4 render. Find the words that produced the miss.
2. Grep the path's seed JSONs for those words. Usually one pool entry or one bucket.
3. Read that pool's recipe. The bad language is usually sanctioned there; fix the recipe AND the
   entries (surgical rewrite for 1 to 10 entries, regen for a systemic miss).
4. Only if the pools are clean: the path file (template order, a block's wording, a gate rate).
5. Only if the template is clean: the medium wording (2.1) or the model set (2.2) for that path.

The variable changed in a round is written in the tracker before the re-render, so the effect is
attributable.

### 5.5 What "one variable" means in practice

A regen of one pool with a hardened recipe is one variable. Dropping one model from a path's set is
one variable. Reordering the template's structure is one variable. Doing two of those in the same
round is not allowed, even when both look obviously right.

### 5.6 Round log format (in `PIXELBOT_PATH_BUILD_STATE.md`, per path)

```
### pixel-harbor
R0 2026-09-2x 03:41 UTC | models: ultra, 2-pro, dev, 2-max, 1.1-pro | avg 4.1 | min 3.0
  misses: #3 smooth illustration (flux-dev), #5 two boats equal, no hero
  cause: #3 model; #5 place entry "MARINA ROW: a line of six sailboats..." (hero pool, bucket marina)
  variable for R1: rewrite the 3 marina entries to name ONE boat as hero (pool edit; model untouched)
R1 ... | avg 4.6 | min 4.0 → PASS
verdict: PASS in 2 rounds. residual: flux-dev drift 1/10 (noted, not chased). ready to scale.
```

### 5.7 Kevin's review

After every path has its verdict, Kevin reviews each path's shadow renders in the app (all rounds
stay posted; nothing is deleted unless he says so). His notes on a path go through one more fix round
if he asks, then section 6.

---

## 6. Ship checklist per path (after Kevin's sign-off; mechanical)

1. **Scale pools with the SAME recipes**, grow-to-N with `append: true` so the tested entries stay:
   hero or place to 200, light 100, air 60, money-shot 60, life 60, moment 50, camera stays 25,
   palette 40. Foreground chunks of about three pools per run.
2. **Format-drift scan:** the `CAPS TITLE:` marker rate on the tested 25 versus the scaled remainder;
   if tested is at or above 80 percent and scaled is below 80, tighten the recipe's format line,
   truncate to the tested entries, regen.
3. **Re-run every sweep from 4.3 on the scaled pools** (Sonnet re-derives banned nouns at scale).
4. **Go-live is a faithful xerox:** move the key from `shadowPaths` to `paths`; change nothing else.
   Confirm the path stays in `chaos.skipPaths` and `twoPassPolish.skipPaths`, `mediumByPath` and
   `modelByPath` are untouched, the bot loads, and `paths.includes(key)`. For `pixel-vista`, also
   remove `epic-vista` from `paths` in the same commit and delete its pools, archetype, and template.
   (`pixel-cozy-farm` is scrapped; `cozy-farming-life-sim` stays parked in `shadowPaths` until Kevin
   decides whether it is deleted too.)
5. **Fold the shadow renders into the feed gradually** (`scripts/promote-shadow-path.js`, backdated)
   or leave them hidden and let the live path post fresh; never flip them all public at once.
6. **Playbook:** add the path's lessons under a PixelBot subsection. **Tracker:** mark shipped.
7. Commit and push (the dispatcher runs from `main`).

Roster math after all twelve ship: seven in-game paths kept by Kevin plus twelve scene paths, in-game
just over a third of the feed. If he wants in-game rarer without more cuts, `pathWeights` is honored alongside
the shuffle-bag rotation.

---

## 7. Order of work, batching, budget

**Order.** Phase 0 with `pixel-vista` first (solo, it proves the register and the looks). Then four
batches of at most three agents: (`pixel-harbor`, `pixel-cabin-glow`, `pixel-cozy-room`), then
(`pixel-cool-rides`, `pixel-fantasy-vista`, `pixel-rain-street`), then (`pixel-campfire-night`,
`pixel-shoreline`, `pixel-skyward`), then (`pixel-ruins` alone; `pixel-cozy-farm` was scrapped 2026-09-19). The orchestrator merges wiring between batches and
re-verifies the bot loads after each merge.

**Concurrency.** Never more than three renders in flight bot-wide. Three agents rendering five each
sequentially is the ceiling. Headroom check before every batch.

**Budget (rough).** Pool generation: 12 paths, about 8 pools each, 25 entries: roughly $30 in Sonnet.
Renders: 12 paths, at most 15 renders each, plus the Phase 0 look check: roughly 200 renders at $0.05
to $0.15, roughly $20, plus briefs. Under $60 total for the whole push. Scaling (section 6) is separate
and larger.

**Wall time.** Phase 0: about ninety minutes with the look check. Each path: one to two hours including
up to three rounds. Four batches plus the vista: two or three sessions.

---

## 8. Resume block (for a fresh agent picking this up)

1. Read this doc, then `BOT_SCENE_QUALITY_PLAYBOOK.md` in full, then invoke `bot-paths` and
   `dream-shoot`.
2. Read `PIXELBOT_PATH_BUILD_STATE.md` if it exists and sanity-check it against `index.js` (a stale
   tracker is worse than none). If it does not exist, Phase 0 has not started.
3. Verify the current state: `node -e "const b=require('./scripts/bots/pixelbot'); console.log(b.paths, b.shadowPaths, Object.keys(b.mediumStyles))"`.
   No `pixelbot_painting` in `mediumStyles`, or no `seeds/pixelbot_look_register.json`, means Phase 0
   is not done.
4. Continue at the first unfinished step in sections 2, then 7's order.

---

## 9. Open questions for Kevin (defaults chosen; say so if you want them changed)

1. The seven in-game paths stay as they are; this plan does not touch them.
2. Thresholds: pass = average 4.5 with no render under 4; three rounds max.
3. `pixel-vista` replaces `epic-vista` at ship time (same concept, painting register). Confirmed by
   Kevin 2026-09-19.
4. Tier 2 is IN this build (Kevin 2026-09-19), as batches three and four in section 7.
5. The pixel looks register is IN this build, as Phase 0 (section 2.8), confirmed by Kevin 2026-09-19.
   Candidate list and exclusions are in 2.8; the render check decides the final set.

## 0c. RESUME POINT (2026-09-19 ~06:00 UTC, written for a context reset)

**Blocked on:** the Mac's boot volume ran out of disk mid-round. Kevin frees it (`rm -rf /tmp/pixelbot-*` are local copies of hidden posts; safe), then the agent resumes at step 1 below. Until space is freed, git commits and renders both fail with ENOSPC.

**Committed on main (HEAD `1f629c87`):** Phase 0 register + looks + tooling (`b0550be7`); recalibration to splash-screen register + era looks + whimsy vista pools + farm pools/path (`3aa4e902`); plan §0a/§0b + "richly detailed" wording (`0376a886`); pixel-cabin-glow PASS wired (`1f629c87`).

**Uncommitted in the working tree (commit these first, explicit pathspec on the commit command):**
- `scripts/bots/pixelbot/scenePaths.js`: SCENE_MODELS pruned to flux-2-pro / 2-max / 2-flex (ultra smooth on 5 draws across vista, harbor, cozy-room; flux-dev smooth on the HD voxel look, cartoon drift on SNES splash). The flux-2 family held the medium on every draw across four paths and every era look.
- `PIXELBOT_PATH_BUILD_STATE.md`: round logs for vista R4, harbor (agent), cozy-room (agent).
- Agent-built, unwired, uncommitted: `scripts/bots/pixelbot/paths/pixel-harbor.js` + `scripts/gen-seeds/pixelbot/gen-pixel-harbor-pools.js` + `seeds/pixelbot_pixel_harbor_*.json` (9); `scripts/bots/pixelbot/paths/pixel-cozy-room.js` + `scripts/gen-seeds/pixelbot/gen-pixel-cozy-room-pools.js` + `seeds/pixelbot_pixel_cozy_room_*.json` (8, plus a `.bak-r0-realistic`). Reports: scratchpad `agent-pixel-harbor.md`, `agent-pixel-cozy-room.md`, `agent-pixel-cabin-glow.md`.
- Wiring lines still to add to `SCENE_PATHS` in index.js: `'pixel-harbor': require('./paths/pixel-harbor'),` and `'pixel-cozy-room': require('./paths/pixel-cozy-room'),`.

**Path status:**
| path | status |
|---|---|
| pixel-cabin-glow | PASS R2 4.74, wired, committed |
| pixel-vista | old-register PASS void; new-register R4 avg 4.0 (3 bangers + 1 hard fail = HD voxel on flux-dev); R5 started under the flux-2-only set: 3 of 5 posted before the disk filled → fetch those 3, render 2 more, grade as R5 |
| pixel-harbor | 3 agent rounds, best 4.08; R3 (granted, registers changed mid-flight) started under flux-2-only: 3 of 5 posted → fetch, render 2 more, grade |
| pixel-cozy-room | 3 agent rounds, best 4.12 (R2 3.66 under the final register); R3 (granted) started: 3 of 5 posted → fetch, render 2 more, grade |
| pixel-cozy-farm | SCRAPPED 2026-09-19 (Kevin: "scrap the farm pixels, we'll leave that domain to farmbot"); files removed, 5 R0 shadow renders left hidden |
| cool-rides, fantasy-vista, rain-street | batch 2, not started |
| campfire-night, shoreline, skyward | batch 3, not started |
| ruins | batch 4 (alone), not started |

**Resume steps, in order:**
1. `df -h /` must show free space. Then `node -e "require('./scripts/bots/pixelbot')"` loads.
2. Commit the uncommitted model prune + tracker (`git add` explicit, then `git commit -F - -- <same paths>`), then wire + commit harbor and cozy-room the same way (one commit each, hook must pass).
3. For each of vista / harbor / cozy-room: `node scripts/_pixelbot-round-fetch.js --path <key> --since <start ISO in scratchpad/<dir>/start.txt> --limit 5 --out <dir>` (start times: `scratchpad/vista-r5/start.txt`, `r3-harbor/start.txt`, `r3-cozy/start.txt`), then `node scripts/_pixelbot-scene-render.js --path <key> --count 2 --label <key>-r<N>b`, fetch again, Read all 5 images, grade on the §5.1 lenses with the medium hard fail, log in the tracker. Max three renders in flight bot-wide.
5. Dispatch batch 2 as three forked agents with the batch-1 brief shape (see the batch-1 agent prompts in the transcript, or reconstruct from §4/§5: only their own files, `--count 5` one process per round, shadow posts, report to `scratchpad/agent-<key>.md`, never delete, never edit shared files) plus §0a/§0b/§3.x; merge each `SCENE_PATHS` line and commit per path. Then batch 3, then batch 4 (ruins).
6. Final report to Kevin; nothing deleted; nothing goes live (section 6 waits for his in-app review).

**Standing rules that bit tonight:** commit with an explicit pathspec on the commit command (another session's staged `create.tsx` was swept into `0376a886`); one render process per round for recency; check disk space before a batch (each render also saves a local copy); never mine heart history.
