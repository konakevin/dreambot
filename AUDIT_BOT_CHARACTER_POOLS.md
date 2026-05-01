# Bot Character-Path Pool Audit

**Run:** 2026-05-01
**Status (2026-05-01):** ALL FINDINGS RESOLVED. SteamBot (`b7fd9ce`), GothBot polish + DragonBot warriors + StarBot explorers (this branch). Cyborg paths confirmed already wired (false positive in original grep).

**Scope:** GothBot, DragonBot, StarBot — does each bot's male/female character path follow the slot-pool DNA standard set by GothBot's `goth-full-body.js` (the reference implementation)?

**Standard (GothBot reference):** Each character path picks ~10 independent dimension slots — archetype, skin, eyes, makeup (women), hair color, hairstyle, wardrobe, accessory/feature, action/moment, lighting, atmosphere — each from its own seed pool with `picker.pickWithRecency` for independent dedup. Slot sizes are typically 25 entries (combinatorial variety comes from COMBINATION, not pool depth).

**SteamBot's `sexy-steampunk-woman` was just upgraded to this standard 2026-05-01.** Use as a template alongside `goth-full-body.js`.

---

## Summary table

| Bot | Path | Status | Active dim slots | Missing dimensions |
|---|---|---|---|---|
| GothBot | `goth-closeup` (female) | ✅ COMPLIANT | 10 (archetype, makeup, moment, wardrobe, skin, eyes, hair_color, hairstyle, lighting, atmosphere) | accessory not pulled (pool exists at 200) |
| GothBot | `goth-full-body` (female) | ✅ COMPLIANT | 11 (adds backdrop) | accessory not pulled (pool exists at 200) |
| GothBot | `goth-male-closeup` | ✅ COMPLIANT (male standard) | 9 (character, action, hair_color, hairstyle, skin, accessory, backdrop, lighting, atmosphere) | makeup intentionally absent (male path); EYES MISSING |
| GothBot | `goth-male-full-body` | ✅ COMPLIANT (male standard) | 9 same as closeup | EYES MISSING |
| GothBot | `vampire-girls-2` | ✅ COMPLIANT (custom slot pool family) | 8+ vampire-specific (compositions, menace, settings, killer_detail, hair, wardrobe, archetype, ethnicity, lighting) | own custom DNA family — works as an art-direction-locked variant |
| **DragonBot** | **`female-warrior`** | ❌ **OLD PATTERN** | **3** (character, outfit, action) | **MISSING: skin, eyes, makeup, hair_color, hairstyle, accessory** |
| **DragonBot** | **`male-warrior`** | ❌ **OLD PATTERN** | **2** (character, action) | **MISSING: skin, eyes, hair_color, hairstyle, outfit, accessory** |
| **StarBot** | **`female-explorer`** | ❌ **OLD PATTERN** | **3** (character, outfit, action) | **MISSING: skin, eyes, hair_color, hairstyle, accessory** |
| **StarBot** | **`male-explorer`** | ❌ **OLD PATTERN** | **3** same as female | **MISSING: skin, eyes, hair_color, hairstyle, accessory** |
| **StarBot** | **`cyborg-woman`** | ⚠️ **POOLS EXIST BUT UNUSED** | **6** (cyborg_feature, closeup_framing, action, camera_angle, lighting, atmosphere) | **7 huge pools unused** — see below |
| **StarBot** | **`cyborg-man`** | ⚠️ **POOLS EXIST BUT UNUSED** | **6** (same as cyborg-woman, with CYBORG_MALE_ACTIONS) | **same 7 pools unused** |
| StarBot | `cosmic-oracle` | character pool exists but not solo-character-focused — separate concern (scenery-led path) |

---

## GothBot — REFERENCE IMPLEMENTATION ✅

GothBot is the standard. All 5 character paths (female closeup/full-body, male closeup/full-body, vampire-girls-2) use the slot-pool pattern with 25-entry pools per dimension.

**Minor cleanup opportunities (not bugs, just polish):**

1. **`goth_woman_accessories.json` is at 200 entries** but never pulled by any goth-* path. Either:
   - Wire it into `goth-closeup` and `goth-full-body` (would add a slot to the brief)
   - Trim down to 25 entries to match the rest of the standard
   - Delete if truly unused

2. **Male paths are missing an EYES slot.** Female paths use `GOTH_EYE_COLORS`. Males don't pull from any eye pool — Sonnet picks freely. Could add `goth_male_eye_colors.json` (25 entries) or share via a unisex `eye_colors.json` to bring the male path to slot-parity. Low-priority since male character paths are rendered ~30% as often as female per memory.

3. **`facial_features.json` at 25 entries** appears to be defined but I don't see it consumed in any path's `pickWithRecency` call. May be loaded but unused. Verify usage or remove.

**Conclusion: GothBot is the gold standard for this strategy. Use `goth-full-body.js` as the template when upgrading other bots.**

---

## DragonBot — ❌ OLD PATTERN (high-priority upgrade)

Both `female-warrior` and `male-warrior` paths only pull 2-3 slots. Hair color, eye color, skin tone, makeup, hairstyle, accessory are ALL Sonnet-RNG. This is the same problem SteamBot's sexy-steampunk-woman had before the 2026-05-01 upgrade.

**Pool size mismatch:** DragonBot's existing pools (`female_warriors`, `female_outfits`, `warrior_actions`) are **200 entries each**. That's the wrong shape for the slot-pool pattern. The reference standard is 25 entries × many slots. DragonBot has 200 × few slots, which means:
- High variety in what she IS (200 archetypes) and WEARS (200 outfits)
- Zero variety in dimensions that aren't pooled (hair/eyes/skin clusters on Sonnet's defaults)

**Required new pools (Sonnet-seeded, 25 each):**

For `female-warrior`:
- `female_warrior_skin.json` (25) — fantasy-fitting skin diversity
- `female_warrior_eyes.json` (25) — vivid, fantasy-light-aware
- `female_warrior_hair_color.json` (25)
- `female_warrior_hairstyles.json` (25) — battle-practical to elaborate
- `female_warrior_accessories.json` (25) — talismans, rings, signature blades

For `male-warrior`:
- `male_warrior_skin.json` (25)
- `male_warrior_eyes.json` (25)
- `male_warrior_hair_color.json` (25) — could SHARE with female (hair colors are unisex)
- `male_warrior_hairstyles.json` (25) — long warrior braids, tied-back, shaved-sides, etc.
- `male_warrior_accessories.json` (25)

**Also consider:** trimming `female_warriors`, `female_outfits`, `male_warriors` from 200 to 25 entries each to match the reference standard. The 200-entry pools have deep tail entries that probably never fire in practice, and tighter curation would improve quality. Optional.

**Path builder rewrites:** `female-warrior.js` and `male-warrior.js` need to be rewritten to mirror `goth-full-body.js` — pull all the new slots, glue them into the brief with the "render the EXACT pool entry, do not substitute" instruction.

**Estimated work:** 2-3 hours generation + 2 path-builder rewrites. Same template as the SteamBot upgrade.

---

## StarBot — MIXED ❌⚠️ (high-priority upgrade with twist)

### `female-explorer` and `male-explorer` paths — ❌ OLD PATTERN

Same situation as DragonBot — only 3 slots active (character / outfit / action), missing hair/eyes/skin/makeup/hairstyle/accessory dimensions. Pool sizes also at 200 (wrong shape — should be 25 × many slots).

**Required new pools (Sonnet-seeded, 25 each):**

For `female-explorer`:
- `sci_fi_female_skin.json`
- `sci_fi_female_eyes.json`
- `sci_fi_female_hair_color.json`
- `sci_fi_female_hairstyles.json`
- `sci_fi_female_accessories.json` (helmet types, comm units, energy weapons, etc.)

For `male-explorer`:
- `sci_fi_male_skin.json`
- `sci_fi_male_eyes.json`
- `sci_fi_male_hair_color.json`
- `sci_fi_male_hairstyles.json`
- `sci_fi_male_accessories.json`

Path builder rewrites mirror DragonBot's.

### `cyborg-woman` and `cyborg-man` paths — ⚠️ POOLS EXIST, MOSTLY UNUSED

This is the more interesting case. StarBot already has these cyborg-specific seed pools:

| Pool | Size | Used by cyborg path? |
|---|---|---|
| `cyborg_female_characters` | 200 | ❌ NOT USED |
| `cyborg_male_characters` | 200 | ❌ NOT USED |
| `cyborg_female_body_types` | 100 | ❌ NOT USED |
| `cyborg_male_body_types` | 100 | ❌ NOT USED |
| `cyborg_female_hair` | 200 | ❌ NOT USED |
| `cyborg_male_hair` | 200 | ❌ NOT USED |
| `cyborg_female_internal` | 25 | ❌ NOT USED |
| `cyborg_male_internal` | 25 | ❌ NOT USED |
| `cyborg_eye_styles` | 200 | ❌ NOT USED |
| `cyborg_glow_colors` | 200 | ❌ NOT USED |
| `cyborg_skin_tones` | 200 | ❌ NOT USED |
| `cyborg_features` | 200 | ✅ USED |
| `cyborg_actions` | (not audited) | ✅ USED |
| `cyborg_male_actions` | (not audited) | ✅ USED |
| `cyborg_closeup_framings` | (not audited) | ✅ USED |

**Diagnosis:** Someone seeded a complete cyborg slot-pool DNA system (skin/eyes/hair/body_type/internal/glow/character_archetype) but the path builders only consume 1-3 of them. This is the WORST kind of waste — the pools exist on disk, the gen scripts exist, the data is there, but the path builders just... don't use them.

**Required work:** Just rewrite `cyborg-woman.js` and `cyborg-man.js` path builders to actually pull from the 7 unused pools. NO new generation needed. ~30 minutes per builder.

Pool sizes (200 each) are larger than the reference standard, but that's fine for cyborg specifically — the body is a major variety axis (cybernetic features can vary wildly). Don't trim. Just wire the consumers.

---

## Cross-cutting observations

### 1. Pool size discipline is inconsistent

GothBot reference: 25 entries × many slots (combinatorial variety from combination).

DragonBot, StarBot explorer paths: 200 entries × few slots (variety from single deep pool, but other dimensions cluster).

StarBot cyborg paths: 200 entries × many slots (DNA pools exist but unused).

GothBot's 25-per-slot standard is the right answer for character DNA dimensions because:
- Sonnet processes 25-entry context easily without dilution
- Recency-dedup ledgers stay healthy at 25 (won't exhaust)
- Combinatorial output is already astronomical at 25⁸ ≈ 1.5 trillion combos

### 2. Make a unisex `hair_colors.json` and share it across bots

GothBot's `hair_colors.json` is 25 entries of pure hair color (no genre flavor). Could be lifted to a shared location and consumed by every bot's male AND female character paths. Same with skin tones for non-genre-specific bots.

### 3. Sensory anchors are GothBot-only

GothBot has 21 sensory anchor pools (`sensory_female_*`, `sensory_male_*`, `sensory_scene_*` × air/lightcolor/smell/sound/temperature/touch/weight). DragonBot and StarBot have NONE. This is the "lush sensory mode" referenced in `memory/project_first_dream_engine_spec.md`. Worth porting to other bots' character paths if you want them to feel as alive.

### 4. Male path parity with female

GothBot has a full male DNA family (`dark_male_characters`, `male_character_actions`, `male_hairstyles`, `male_accessories`, plus shared `skin_tones` and `hair_colors`). It's missing only male eyes (uses unisex/none). DragonBot and StarBot's male paths are STARVED of slot pools — they're even more bare than the female equivalents.

### 5. The 200-entry pools look impressive but cluster

When you have a 200-entry "female_warriors" pool but no slot pool for hair color, you'll get 200 different warrior NAMES/ROLES but Sonnet picks the same 3-4 hair colors most of the time. Visual variety doesn't follow archetype variety unless you lock all the dimensions.

---

## Priority ranking for upgrades

1. **HIGH — StarBot cyborg-woman / cyborg-man path builders.** Pools already exist, just need wiring. Cheapest possible win. ~1 hour total.
2. **HIGH — DragonBot female-warrior + male-warrior.** Generate 5 new pools per gender (10 total) + 2 path-builder rewrites. ~3-4 hours.
3. **HIGH — StarBot female-explorer + male-explorer.** Same shape as DragonBot. ~3-4 hours.
4. **MEDIUM — GothBot male path EYES slot.** Add 1 pool, 2 line edits. ~30 min.
5. **MEDIUM — GothBot accessory pool wiring.** Either consume `goth_woman_accessories.json` in goth-* paths or remove it. ~30 min.
6. **LOW — Trim 200-entry character/outfit pools to 25 across DragonBot/StarBot** (after slot pools exist).
7. **LOW — Port sensory-anchor pools to DragonBot and StarBot** (16+ new pools per bot — sizable work).

---

## Recommended approach

Mirror the SteamBot 2026-05-01 process for each bot:

1. Copy `scripts/gen-seeds/steambot/gen-steampunk-women-*.js` as template
2. Adapt the meta-prompt for the bot's genre (fantasy-warrior vs sci-fi-explorer vs cyborg)
3. Write 5-8 gen scripts per gender per bot
4. Run all generators (`node scripts/gen-seeds/<bot>/gen-<slot>.js`)
5. Update bot's `pools.js` to load new files
6. Rewrite `paths/<character-path>.js` to mirror `goth-full-body.js` glue pattern
7. Smoke-test 5 renders, eyeball, commit

Each bot upgrade is one feature branch.

**Files referenced:**
- Reference impl: `scripts/bots/gothbot/paths/goth-full-body.js`
- Recent template: `scripts/bots/steambot/paths/sexy-steampunk-woman.js` + `scripts/gen-seeds/steambot/gen-steampunk-women-*.js`
- Slot helper: `scripts/lib/seedGenHelper.js`

---

## Bot-by-bot quick-look list of paths to upgrade

**DragonBot:** female-warrior, male-warrior
**StarBot:** female-explorer, male-explorer, cyborg-woman, cyborg-man (last two are cheap wires, do those first)
**GothBot:** add male eye colors (cheap), wire/trim woman accessories (cheap)
