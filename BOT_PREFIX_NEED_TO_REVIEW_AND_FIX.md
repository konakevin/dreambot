# Bot prefix audit — paths flagged for the enumeration-lock anti-pattern (2026-06-01)

> **Status:** review queue. Nothing here has been changed. Return to this doc to triage.
> **Spawned by:** the EarthBot `andes-patagonia` R0 failure (5/5 renders locked to Patagonian granite spires regardless of subject) which led to the new playbook section **"Biome / material / style enumeration in a path prefix = first-named-noun lock"** + a corresponding `CLAUDE.md` hard rule.

---

## Why this doc exists

Two paths in a single session (African-landscape R5, Andes-Patagonia R0) failed in the same way: subject pool varied, render composition did not. Root cause: the path's `promptPrefixByPath` enumerated multiple biomes / materials / styles, and CLIP attention dropped sharply after the first-named noun — so every render locked to the first item in the list regardless of what subject Sonnet's body wrote downstream.

The fix is documented in two places:
- **`CLAUDE.md` → Hard rules** ("NEVER enumerate biomes / materials / sub-styles in a path's `promptPrefixByPath`").
- **`BOT_SCENE_QUALITY_PLAYBOOK.md` → "Biome / material / style enumeration in a path prefix = first-named-noun lock"** — full case studies + wrong/right code, sits right after the existing "Stuffed wrappers GRIDLOCK diversity" section (which is the 2026-05-14 character-path version of the same trap).

This audit swept all 17 bots (`bot.promptPrefix` + `bot.promptPrefixByPath`) and found 7 enumeration-trap candidates. Listed below in priority order.

---

## The anti-pattern in one paragraph (so you don't have to re-read the playbook)

When a path prefix lists multiple comma-/and-/or-/plus-separated nouns of the same KIND (biomes, materials, palette colors, franchise references, artist names, race/class options, material types), Flux's CLIP tokenizer attends most heavily to the FIRST item and treats the rest as flavoring. Every render locks visually to that first item. Symptom: a varied subject pool produces homogenous renders. Diagnostic: count the multi-noun groups in the prefix; if there's more than one, that's the lock. Fix: short single-anchor prefix, push enumeration into per-path templates or pools (which are not first-tokens).

This is documented as a 2026-05-14 lesson for character paths (DragonBot `female-adventurer` wrapper-strip incident) and was re-derived 2026-06-01 for scene/region paths (Andes-Patagonia).

---

## Full matrix

### ✅ SAFE — short anchor, no enumeration (no action)

| Bot | Where | Length | Pattern |
|---|---|---|---|
| BloomBot | bot-wide | 298ch | single anchor "LUSH flower scene" + composition guidance |
| BrickBot | bot-wide | 340ch | single anchor "LEGO diorama scene" + LEGO material facts |
| BrickBot | pirates, space, macro-display, crazy-islands | 110-174ch | composition only |
| ChibiBot | bot-wide | 151ch | short style anchor |
| DinoBot | bot-wide + dino-cozy + swamp-river | 173-386ch | single Mesozoic-era anchor with descriptive props (no enum) |
| DragonBot | 15 paths (all character paths except `artsy-girl`) | empty | per the wrapper-strip rule |
| EarthBot | iceland-raw, andes-patagonia | 62-69ch | region-only anchor (fixed 2026-06-01) |
| EarthBot | 9 EARTH paths | 97ch | photography anchor |
| EarthBot | 8 BEACH paths | 110ch | travel-photography anchor |
| FaeBot | bot-wide + all paths | empty | per the wrapper-strip rule |
| MangaBot | bot-wide | 180ch | manga anchor |
| MechBot | bot-wide | 105ch + 7 empty per-path | safe |
| RetroBot | bot-wide | 117ch | retro-photography anchor |
| StarBot | bot-wide | 120ch | sci-fi anchor |
| SteamBot | bot-wide | 132ch | steampunk anchor |
| TinyBot | bot-wide | 246ch | "miniature diorama photography" anchor + lens specifics |
| ToyBot | bot-wide + vinyl override | 107-242ch | toy/vinyl anchor |
| YumBot | bot-wide | 223ch | "3D CGI render with painterly polish" |

### 🚨 SUSPECT — needs review + likely fix

See per-bot detail below.

| Priority | Bot | Where | Length | Anti-pattern |
|---|---|---|---|---|
| 1 (highest leverage) | GothBot | bot-wide | 282ch | franchise `+` list + 6-color palette enum (hits EVERY GothBot path) |
| 2 (highest leverage) | PixelBot | bot-wide | 372ch | 5-item NEGATION-leak chain (hits EVERY PixelBot path) |
| 3 | DragonBot | `artsy-girl` | **1568ch** | textbook OR-list race + multi-axis enumeration (path renders likely flat) |
| 4 | DragonBot | `dragon-scene` | 499ch | artist + franchise enumeration **(but path is a Kevin-pinned hearted recipe — do not blindly change, see notes)** |
| 5 | MechBot | `cyborg-male-legacy` | 408ch | material enumeration **(path name ends `-legacy` — likely frozen reference, check before touching)** |
| 6 | ChibiBot | `aquatic-village` | 499ch | biome OR + 5-color palette enum |
| 7 | YumBot | `candy-fantasy` | 603ch | 8-item candy-biome enumeration |

---

## Suspect detail (one block per flagged path)

### 1. GothBot — bot-wide prefix (282ch) — HIGHEST LEVERAGE

**Current:**
```
Dark gothic fantasy, hauntingly beautiful, operatic dark romance with vampire-hunter danger, Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing energy, rich varied palette with deep purples + midnight blues + velvet blacks + poison greens + candle-amber + moonlit silver accents
```

**Two enumeration traps:**

1. **Franchise list** `Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing energy` → Flux locks Castlevania. Bloodborne, DMC, Van Helsing are dropped.
2. **Palette list** `deep purples + midnight blues + velvet blacks + poison greens + candle-amber + moonlit silver` → Flux locks deep purples. The other 5 colors are dropped. The phrase "rich varied palette" is self-defeating — naming 6 colors guarantees the variety doesn't render.

**Why this is high-leverage:** bot-wide prefix applies to EVERY render of EVERY GothBot path (17 paths × 4 posts/day = 68 daily renders, all subject to this lock).

**Recommended replacement:**
```
Dark gothic fantasy, hauntingly beautiful, operatic dark romance with vampire-hunter danger, gallery-quality, masterpiece
```

**Where the removed content should live:**
- **Franchise references** → per-path. `monster-prowl`'s hearted recipe IS impasto-Castlevania ([[project_gothbot_monster_prowl_two_branches]]) — that lineage should live in the `monster-prowl` path's prefix or template only, not bot-wide where it overrides every other path.
- **Palette** → atmosphere / lighting pools per path. The bot-wide should not pre-pick a palette — that's what kills "rich variety."

**Diagnostic to confirm BEFORE changing:** pull the last 20 GothBot renders across different paths via:
```sql
SELECT caption, image_url, ai_prompt FROM uploads
WHERE caption ILIKE '[%] GothBot' ORDER BY created_at DESC LIMIT 20;
```
Open the images. If they all skew Castlevania-impasto + deep-purple-dominant regardless of path, the bot-wide IS the lock. If renders genuinely differ across paths (vampire-female ≠ monster-prowl ≠ goth-closeup in style), the wrapper is somehow being beaten by per-path content and the cost of changing is lower because variety is already coming through anyway.

**Residual risk:** removing franchise references might soften the gothic genre intensity. If renders feel generic after the change, restore the FIRST franchise (`Castlevania`) alone — never as part of a `+` list. Same for palette: if renders go flat in color, name ONE color only ("rich saturated deep-purple palette") in the bot-wide, let pools rotate the rest.

---

### 2. PixelBot — bot-wide prefix (372ch) — HIGHEST LEVERAGE

**Current:**
```
16-bit retro pixel art game screenshot, classic SNES-era pixel craft, chunky visible pixel grid, low effective sprite resolution upscaled crisp, dithered limited palette, NO smooth gradients, NO vector smoothing, NO 32-bit polished pixel-illustration, NO HD-2D, NO modern indie-pixel painterly hybrid, classic 2D-RPG sprite character forms, every surface clearly pixelated
```

**Two failure modes:**

1. **NEGATION leak** (5 negated phrases): `NO smooth gradients, NO vector smoothing, NO 32-bit polished pixel-illustration, NO HD-2D, NO modern indie-pixel painterly hybrid`. Per [[feedback_negative_prompt_leak]] CLIP ignores `NO` and reads `smooth gradients`, `vector smoothing`, `32-bit polished pixel-illustration`, `HD-2D`, `modern indie-pixel painterly hybrid` as desired content. Almost certainly contributing to drift toward exactly the styles we're trying to ban.
2. **Style enumeration** woven through: `16-bit retro pixel art game screenshot, classic SNES-era pixel craft, chunky visible pixel grid, low effective sprite resolution, dithered limited palette, classic 2D-RPG sprite character forms` — six separate "pixel" anchors. Probably locks `16-bit retro pixel art game screenshot` and ignores the rest.

**Why this is high-leverage:** hits every render of every PixelBot path.

**Recommended replacement:**
```
16-bit retro pixel art game screenshot, SNES-era sprite craft, chunky visible pixel grid, dithered limited palette, every surface clearly pixelated
```

Stripped:
- All 5 `NO X` negations (positive-only)
- Redundant style anchors (`classic SNES-era pixel craft` already implies "classic")

**Diagnostic BEFORE changing:** pull recent PixelBot renders, look specifically for smooth-gradient leaks, HD-2D-style polish, painterly hybrid renders. If any are showing → negations are leaking exactly as predicted by [[feedback_negative_prompt_leak]].

**Residual risk:** if smooth-gradient drift returns after removing `NO smooth gradients`, the FIX is in pools (no smooth-gradient-coded vocabulary in atmosphere/lighting pools), template (positive instruction "chunky pixel edges visible"), or medium (lock to a more pixel-coded model lineage). NEVER restore the negations.

---

### 3. DragonBot — `artsy-girl` path prefix (1568ch) ⚠️ longest in the codebase

**Current** (full text):
```
classic painted fantasy-novel-cover oil illustration — hand-painted oil-on-canvas with visible painterly brushwork, rich impasto and soft glazing, dramatic romantic-realist sword-and-sorcery paperback cover art, rendered in LUSH, RICH FULL COLOR (deep full-bodied saturated oil-pigment palette, rich naturalistic color depth, full jewel-tone hues), a single heroic WOMAN of a SPECIFIC NON-DEFAULT-HUMAN fantasy lineage — render the race anatomy and tone as the ABSOLUTE FIRST visual property (drow = obsidian skin OR dragonborn = scaled face OR tiefling = horns AND red/violet skin OR orc = green skin AND tusks OR night-elf = purple skin AND glowing silver eyes OR blood-elf = glowing fel-green eyes OR aasimar = alabaster with inner glow OR genasi = elemental-tinted skin) — race is NEVER a pale-European-woman default, at 25-40% of frame full body mid-action wearing an exotic fantasy battle outfit and wielding a signature weapon — the specific armor style, materials, silhouette, and weapon varies DRAMATICALLY entry to entry (lamellar / scale / chitin / dragonbone / coral / mithril / lacquered / engraved / barbarian fur-and-bone / desert-nomad wraps / samurai bound silk — and weapons axe / spear / glaive / bow / staff / hammer / kukri / scimitars / runeblade as often as sword), CANDID PEACEFUL ADVENTURING moment between battles (NO combat NO violence — weapons holstered or being maintained), epic fantasy landscape as her stage, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Witcher visual lineage, awe-inducing concept-art masterwork
```

**This is the textbook trap.** The playbook (`BOT_SCENE_QUALITY_PLAYBOOK.md` line 1156 — original female-adventurer wrapper-strip incident) literally documents this exact pattern as the canonical anti-example for character paths. Three independent enumeration locks stacked:

1. **Race OR-list** (8 races): `drow OR dragonborn OR tiefling OR orc OR night-elf OR blood-elf OR aasimar OR genasi`. The playbook documents that this style of OR-list locks Flux on the default-trained interpretation (i.e. pale-European woman, the OPPOSITE of the intent).
2. **Armor enumeration** (11 styles): `lamellar / scale / chitin / dragonbone / coral / mithril / lacquered / engraved / barbarian fur-and-bone / desert-nomad wraps / samurai bound silk`. Locks lamellar.
3. **Weapon enumeration** (9 weapons): `axe / spear / glaive / bow / staff / hammer / kukri / scimitars / runeblade`. Locks axe.
4. **Franchise enumeration** (5 franchises): `LOTR + GoT + Elden Ring + Skyrim + Witcher`. Locks LOTR.

**Recommended approach:** empty the wrapper, match every other character path on DragonBot.

```js
'artsy-girl': '',
```

The race / armor / weapon / franchise variety belongs in the SUBJECT POOL, not in a wrapper. That's the entire 2026-05-14 wrapper-strip lesson. Currently this path is the lone outlier on DragonBot — every other character path has empty `promptPrefixByPath`.

**Diagnostic BEFORE changing:** pull last 20 `artsy-girl` renders, check race diversity, armor diversity, weapon diversity. The playbook's documented prediction is "every render is the same pale-European pretty heroine in cream tunic-dress + brown belt + sword + boots against a mountain backdrop." If that's what you see → confirmed lock.

**Verification AFTER changing:** fire 5 renders, look for race diversity (should see non-default races appear), armor diversity, weapon diversity.

**Residual risk:** the path may have been added with this stuffed wrapper because the artsy-girl POOLS aren't carrying the race/armor/weapon DNA. If pools are thin → stripping the wrapper without fixing pools could regress to generic. Audit `scripts/bots/dragonbot/seeds/artsy_girl_*.json` (or wherever the pools live) before changing — if the race/armor/weapon variety is NOT in the pools, that's a pool-DNA problem to fix first.

---

### 4. DragonBot — `dragon-scene` path prefix (499ch)

**Current:**
```
Frank Frazetta + Brom + Boris Vallejo + Greg Hildebrandt + Michael Whelan painted-fantasy-novel-cover oil tradition, traditional Western high-fantasy DRAGON as the hero — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long muscular tail (NOT a serpent NOT a wyvern), jaw-dropping epic fantasy landscape with multi-layer depth, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Warcraft + D&D visual lineage, awe-inducing concept-art masterwork
```

**Two enumeration traps:**

1. **Artist list** `Frank Frazetta + Brom + Boris Vallejo + Greg Hildebrandt + Michael Whelan` → likely locks Frazetta.
2. **Franchise list** `LOTR + GoT + Elden Ring + Skyrim + Warcraft + D&D` → likely locks LOTR.

**⚠️ DO NOT BLINDLY CHANGE THIS ONE.** Per memory [[feedback_carbon_copy_hearted_prompt_verbatim]] and [[feedback_painted_medium_artist_names_load_bearing]]:

- Artist names in painted-medium prompts are LOAD-BEARING for the NSFW filter pass (artist-name-led prompts render as "painted illustration" which Flux's NSFW filter tolerates; generic descriptions drift toward photoreal and get filter-blocked).
- DragonBot `dragon-scene` IS the canonical hearted recipe per the playbook ("DragonBot dragon-scene (2026-05-14 first clean win)" — line 475 of `BOT_SCENE_QUALITY_PLAYBOOK.md`). Kevin hearted this exact prefix.

**The conflict:** the enumeration anti-pattern says strip the artist list. The hearted-recipe rule says don't paraphrase load-bearing artist names. These are at odds.

**Recommended approach:**
1. DO NOT change without proving the lock first.
2. Pull the last 20 `dragon-scene` renders. Check if every dragon is rendered in Frazetta-specific style (overweight musculature, bronze-age palette, specific Frazetta dragon archetype) regardless of what the scene called for. If YES — locked, can experiment. If renders show genuine artistic variety across the 5 artists — wrapper is somehow not locking, leave it alone.
3. If you DO experiment, **never strip ALL artist names** — that breaks the NSFW filter pass. The minimal experiment is: name ONE artist (`Frank Frazetta painted-fantasy-novel-cover oil tradition`) instead of five. If renders stay in painted-illustration register (not photoreal) → safe to swap to single-artist. If photoreal drift appears → restore all 5 immediately.

**Path here is "investigate before changing"** — flag it for the same review pass but with a 5-render pilot, not a blind swap.

---

### 5. MechBot — `cyborg-male-legacy` path prefix (408ch)

**Current:**
```
handsome adult male man (NOT female NOT woman), masculine face, narrow hips, torso clad in cyborg shell — synth-mesh / composite panels / chrome underweave / mechanical mesh covering chest and abdomen as integrated cyborg anatomy (NOT bare skin, NOT a shirt, NOT fabric clothing — this material IS his body covering), cybernetic breakthroughs across face / neck / forearms / hands, not a full robotic chassis
```

**Trap:** material enumeration `synth-mesh / composite panels / chrome underweave / mechanical mesh` → likely locks synth-mesh.

**⚠️ Path name ends `-legacy`** — likely a frozen reference implementation, not in active rotation. Check `scripts/bots/mechbot/index.js` `paths` array. If the active path is `cyborg-man` (without `-legacy`), then `-legacy` is reference-only and not worth fixing.

**If active:** recommended replacement keeps the gender lock (which IS load-bearing for cyborg-MALE) but drops the material enumeration:

```
handsome adult male man (NOT female NOT woman), masculine face, narrow hips, torso clad in cyborg shell — integrated cyborg anatomy (NOT bare skin, NOT a shirt, NOT fabric clothing — this material IS his body covering), cybernetic breakthroughs across face / neck / forearms / hands, not a full robotic chassis
```

Pushed the specific material vocabulary (synth-mesh, composite panels, chrome underweave, mechanical mesh) into the pool entries where they belong — each pool entry names ONE specific material, never an enumerated list.

**Note: `NOT female NOT woman` is a NEGATION** — could risk same `[[feedback_negative_prompt_leak]]` pattern as PixelBot. But for character gender-coding it's been documented as effective (the "male identity lock" is required to prevent Flux from defaulting feminine). Different failure mode than biome lock. Leave the gender negations.

---

### 6. ChibiBot — `aquatic-village` path prefix (499ch)

**Current:**
```
UNDERWATER OR COASTAL OCEAN SCENE — cool teal-cyan-aqua water-caustic light dappling every surface, deep-blue ocean-water filling the scene, drifting bubble-streams rising through water, swirling fish-schools visible in background, bioluminescent coral-glow accents, water-reflection on architecture, palette of TEAL + CYAN + AQUA + CORAL-PINK + PEARL-VIOLET (cool aquatic palette, NOT warm tropical jungle palette), submerged underwater village OR coastal tidepool village always with VISIBLE WATER
```

**Three traps:**

1. **Biome OR** `UNDERWATER OR COASTAL OCEAN SCENE` (at the open!) → locks UNDERWATER, every render goes fully submerged even when subject calls for tidepool / coastal.
2. **Palette enumeration** `TEAL + CYAN + AQUA + CORAL-PINK + PEARL-VIOLET` → locks TEAL.
3. **Biome OR repeated** `submerged underwater village OR coastal tidepool village` → reinforces the underwater lock.

**Recommended replacement:**
```
aquatic ocean scene with VISIBLE WATER, water-caustic light dappling every surface, drifting bubble-streams, swirling fish-schools, bioluminescent coral-glow accents, water-reflection on architecture, cool aquatic palette
```

Stripped:
- The OR-biome split (just say "aquatic ocean scene with visible water" — let the subject pool decide submerged vs tidepool)
- The palette enumeration
- The `NOT warm tropical jungle palette` negation (per [[feedback_negative_prompt_leak]])

**Diagnostic BEFORE changing:** pull last 10 aquatic-village renders. If they're all fully submerged (no tidepool / surface-water variety), the OR-biome lock is real.

---

### 7. YumBot — `candy-fantasy` path prefix (603ch)

**Current:**
```
Kawaii candy-fantasy scene — composition follows the scene description below (NOT a default candy meadow). The scene sits inside a RICH KAWAII CANDY-FANTASY WORLD with a lush layered candy-world backdrop visible BEHIND the foreground scene — frosted-cake mountains, oversized lollipop-trees, marshmallow drifts, sprinkle-grass, cotton-candy clouds, sugar-glitter air, gumdrop bushes, candy-cane accents — every surface confectionary, NEVER real wood/grass/stone/metal/fabric. The candy-world backdrop is RICH AND DETAILED but never overrides the foreground composition the scene description establishes.
```

**Trap:** 8-item candy-biome enumeration `frosted-cake mountains, oversized lollipop-trees, marshmallow drifts, sprinkle-grass, cotton-candy clouds, sugar-glitter air, gumdrop bushes, candy-cane accents` → likely locks frosted-cake mountains across every candy-fantasy render.

Plus: `NEVER real wood/grass/stone/metal/fabric` — 5-item negation per [[feedback_negative_prompt_leak]] risks injecting those materials into renders.

**Recommended replacement:**
```
Kawaii candy-fantasy scene — composition follows the scene description below (NOT a default candy meadow). The scene sits inside a RICH KAWAII CANDY-FANTASY WORLD where every surface is confectionery. The candy-world backdrop is RICH AND DETAILED but never overrides the foreground composition the scene description establishes.
```

Stripped:
- The 8-element backdrop enumeration → push frosted-cake mountains / lollipop-trees / marshmallow drifts into the pool entries (one element per entry, never a list)
- The "real wood/grass/stone/metal/fabric" negation chain
- Kept the "every surface confectionery" positive instruction (it does the work without enumerating)

**Diagnostic BEFORE changing:** pull last 10 candy-fantasy renders. Check if every backdrop has frosted-cake mountains regardless of scene subject. If yes → locked.

---

## Recommended fix order when returning to this

By leverage (renders affected per day) × confidence:

1. **GothBot bot-wide** — affects all 17 GothBot paths. High leverage, clear two-enum fix, recoverable if regression (just restore one franchise + one color).
2. **PixelBot bot-wide** — affects all PixelBot paths. Negation chain is almost certainly leaking exactly the styles being banned. Strong predicted improvement.
3. **DragonBot `artsy-girl`** — single path but the playbook literally documents this as the canonical anti-pattern. Strip the wrapper, match every other DragonBot character path. Audit pools first — race/armor/weapon variety MUST be in the pools or stripping the wrapper regresses to generic.
4. **ChibiBot `aquatic-village`** — single path, clean fix.
5. **YumBot `candy-fantasy`** — single path, clean fix.
6. **MechBot `cyborg-male-legacy`** — only if it's still in `paths` rotation; likely frozen reference.
7. **DragonBot `dragon-scene`** — DO NOT change without 5-render pilot. Hearted recipe + NSFW-filter-load-bearing artist names. Single-artist experiment only, with immediate revert if photoreal drift appears.

---

## Per-fix protocol

Before touching any prefix:

1. Pull the last 10-20 renders from that bot/path:
   ```sql
   SELECT caption, image_url, ai_prompt FROM uploads
   WHERE caption ILIKE '[<path-name>] <BotName>'
   ORDER BY created_at DESC LIMIT 20;
   ```
2. Read 5 of the images. Check for the predicted lock symptom (same composition / palette / style across varied subjects).
3. If lock confirmed → make the SINGLE-VARIABLE change (only the prefix, no template/pool/medium edits).
4. Fire 5 verification renders via:
   ```
   node scripts/iter-bot.js --bot <bot> --mode <path> --count 5 --post --label "<bot> <path> R0 prefix-fix"
   ```
5. Read all 5 images. Compare to the pre-change batch. If variety returns → ship. If variety doesn't return → the lock was elsewhere (pool DNA / template); revert and audit there.

---

## Related lessons + memories (cross-reference)

- **Playbook section** "Stuffed wrappers GRIDLOCK diversity — keep promptPrefixByPath short (CRITICAL — 2026-05-14)" — the original character-path version of this lesson.
- **Playbook section** "Biome / material / style enumeration in a path prefix = first-named-noun lock (CRITICAL — 2026-06-01)" — the scene/region-path explicit form, added in this session.
- **`CLAUDE.md` Hard rule** added 2026-06-01: "NEVER enumerate biomes / materials / sub-styles in a path's `promptPrefixByPath`."
- **Memory** [[feedback_regional_path_buildout_lessons]] — Lesson #11.
- **Memory** [[feedback_negative_prompt_leak]] — the negation-leak failure mode (relevant to PixelBot + YumBot + ChibiBot).
- **Memory** [[feedback_carbon_copy_hearted_prompt_verbatim]] — when hearted prompts are load-bearing and shouldn't be paraphrased (relevant to DragonBot `dragon-scene`).
- **Memory** [[feedback_painted_medium_artist_names_load_bearing]] — why stripping artist names can NSFW-block renders (relevant to DragonBot `dragon-scene`).
- **Source case study** EarthBot `andes-patagonia` R0 (2026-06-01) — 5/5 renders locked to granite spires. Fix was strip biome-enumeration from prefix. R1 verified the fix.

---

## Data sources

- `/tmp/bot-prefix-audit.json` — JSON dump of all 17 bots' `promptPrefix` + `promptPrefixByPath` from the audit script run 2026-06-01.
- Audit script (rerunnable):
  ```bash
  node -e "
  const fs = require('fs');
  const bots = ['bloombot','brickbot','chibibot','dinobot','dragonbot','earthbot','faebot','gothbot','mangabot','mechbot','pixelbot','retrobot','starbot','steambot','tinybot','toybot','yumbot'];
  const audit = {};
  for (const b of bots) {
    const bot = require('./scripts/bots/'+b+'/index.js');
    audit[b] = { promptPrefix: bot.promptPrefix || '', promptPrefixByPath: bot.promptPrefixByPath || {} };
  }
  fs.writeFileSync('/tmp/bot-prefix-audit.json', JSON.stringify(audit, null, 2));
  "
  ```
