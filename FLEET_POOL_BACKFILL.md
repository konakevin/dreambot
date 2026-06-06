# Fleet Pool Backfill — Plan + Tracker

**Created 2026-06-05** after a fleet-wide audit surfaced 245 undersized path-bespoke pools across 14 bots. Pools below ~100 entries produce visibly repetitive renders because the shuffle-bag cycles too fast; the playbook target is 200 (or the recipe's natural conceptual ceiling, which is typically 120-180).

This doc is BOTH the plan and the progress tracker. Update the per-bot tables as work lands.

---

## Why this exists

Audit script (one-shot, see commit message of `f82f607e`) found:

- **brickbot — 72 pools** undersized; 50+ stuck at exactly 50 (every path's bespoke pool)
- **starbot — 39 pools** at 23-30 (cosmic-vista, real-space, space-opera path-bespoke axes)
- **bloombot — 24 pools** path-bespoke axes at 30-50
- **chibibot — 19 pools** path phenomena + time-of-day pools at 50
- **mechbot — 18 pools** — six **lighting** pools at 10-13 are critically low
- **dragonbot — 17 pools** (mostly conceptual-ceiling false positives; ~6 actionable)
- pixelbot / gothbot / toybot / yumbot / steambot / earthbot / dinobot / faebot — 1-14 each

Many bots' bespoke pools were authored manually without checked-in gen scripts. They need:

1. A gen script per pool (mirroring the existing register).
2. A run with the patched `seedGenHelper.js` (now does canonical signature-based dedup + semantic-ceiling stop).
3. Acceptance of the pool's natural cap if it doesn't reach 200.

---

## Canonical seeding workflow (per [`BOT_SCENE_QUALITY_PLAYBOOK.md`](BOT_SCENE_QUALITY_PLAYBOOK.md) line 333-471)

**Every backfill follows this exact pattern. Don't deviate.**

### The gen-script skeleton

```js
#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/<bot>/seeds/<pool_name>.json',
  total: 200,        // target — accept natural ceiling if recipe caps lower
  batch: 25,         // 25 for entries 30-50 words; 50 for short entries
  maxTokens: 8000,   // bump to 16000 for 60+ word entries
  append: true,      // preserve existing entries; only add unique new ones
  metaPrompt: (n) => `You are writing ${n} <axis-name> entries for <bot> <path>.

━━━ THE BAR ━━━
[One paragraph: what every entry must produce visually]

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~N CATEGORY A: examples...
- ~N CATEGORY B: examples...
[5-15 categories with explicit counts that sum to ~n]

━━━ FORMAT ━━━
Each entry: <word count range>. Format:
"<short representative example 1>"
"<short representative example 2>"
"<short representative example 3>"

━━━ BANS ━━━
- NO <thing Sonnet defaults to that we don't want>
[3-5 explicit bans per playbook line 462 — soft ban language doesn't work]

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per line.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
```

### Best-practice rules (playbook line 438-454)

**Do:**
- Sample 10 existing entries first; mirror their register
- Front-load "THE BAR" — what every entry must produce
- Distribute variety with explicit category counts
- Quote 3-10 example phrasings ("touchpoints" — Sonnet anchors to these)
- Specify entry word count + format
- Use explicit "NEVER X because Y" bans (soft bans don't work)

**Don't:**
- Write recipes >200 lines — Sonnet gets diluted
- Stack 50+ constraints — first 5-10 carry the brief, rest is noise
- Mix multiple semantic axes in one recipe — split into multiple pools
- Skip the touchpoints examples — Sonnet needs format anchors
- Pass existing entries back to Sonnet as "DO NOT DUPLICATE" anti-prompt — wastes tokens, doesn't work, causes truncation (this was the seedGenHelper anti-pattern fixed 2026-06-05)

### Dedup contract

`seedGenHelper.js` was patched 2026-06-05 to match the canonical pattern from `gen-starbot-pool.js`:

1. NO anti-prompt list passed to Sonnet — fresh variety each iteration
2. Client-side dedup: exact-string + signature-hash (first-12-non-stopword-tokens, alphabetized + joined)
3. Overgenerate by 1.5× per iteration to absorb dedup losses
4. Semantic-ceiling stop: 2 consecutive empty iterations → stop at current count
5. Max 12 iterations safety cap

### Conceptual ceilings per axis type (playbook line 542-558)

These cap LOW — don't expect them to hit 200:

| Axis type | Natural cap | Don't push past |
|---|---|---|
| `race` / `*_race` | 50 | conceptual ceiling — Sonnet exhausts at 50 unique humanoid lineages |
| `class` / `*_class` | 36-50 | warrior/rogue/mage etc. — small intentional taxonomy |
| `hairstyle` / `*_hairstyle` | 44-50 | practical hairstyles cap here |
| `accessory` / `*_accessory` | 49-98 | wide range; some paths cap higher |
| `drama` (gated 40-50%) | 50 | intentionally small — gated axes don't need 200 |
| `eyes` / `eye_color` / `skin` | 100 | descriptor variety caps at 100 |
| `hair_color` | 100 | same — color variety caps |
| `sensory_*` | 100 | sensory anchors cap at 100 per channel |

**Everything else: target 200.** If a recipe caps at 120-180, accept it. If it caps at <100, the recipe needs splitting into sub-pools (playbook line 436).

### Iteration cadence

For NEW recipes (most bots' bespoke pools):
1. Author recipe, gen 25, render-test 5
2. If renders land the register, scale to 200
3. If renders drift, iterate the recipe — wipe + regen 25
4. Repeat until 5/5 lands

For TOP-UP scaling (existing 30-99 entry pools):
1. Sample existing entries → write gen recipe that matches their register
2. Run with `append: true, total: 200`
3. Helper stops at semantic ceiling automatically

---

## Execution stages

Execute stages in order. Commit between stages.

### Stage 1 — Severely under-scaled (≤25 entries) [PRIORITY 0]

These pools are barely functional. The shuffle-bag cycles through them every 25 renders, producing very visible repetition.

| Bot | Pool | Current | Target |
|---|---|---|---|
| brickbot | brickbot_girly_camera_framing | 10 | 200 |
| brickbot | brickbot_macro_display_camera_framing | 12 | 200 |
| brickbot | brickbot_western_camera_framing | 12 | 200 |
| brickbot | brickbot_macro_display_baseplate_edge | 16 | 200 |
| brickbot | brickbot_macro_display_life_density | 16 | 200 |
| brickbot | brickbot_macro_display_lighting | 16 | 200 |
| brickbot | brickbot_macro_display_palette | 16 | 200 |
| brickbot | brickbot_macro_display_build_scope | 18 | 200 |
| brickbot | brickbot_theme_park_spectacle | 18 | 200 |
| brickbot | brickbot_macro_display_surprise_easter_egg | 20 | 200 |
| brickbot | brickbot_macro_display_diorama_theme | 25 | 200 |
| brickbot | brickbot_macro_display_signature_centerpiece | 25 | 200 |
| mechbot | humanoid_robots_lighting | 10 | 200 |
| mechbot | mecha_pilots_lighting | 10 | 200 |
| mechbot | titan_war_lighting | 10 | 200 |
| mechbot | power_armor_lighting | 12 | 200 |
| mechbot | mech_skyships_lighting | 13 | 200 |
| mechbot | rust_apoc_lighting | 13 | 200 |
| mechbot | power_armor_engagement | 16 | 200 |
| mechbot | titan_war_composition | 18 | 200 |
| mechbot | killer_droid_actions | 20 | 200 |
| mechbot | humanoid_robots_composition | 25 | 200 |
| mechbot | killer_droid_composition | 25 | 200 |
| mechbot | power_armor_composition | 25 | 200 |
| mechbot | rust_apoc_composition | 25 | 200 |
| starbot | rugged_male_explorer_outfits | 13 | 200 |
| starbot | space_opera_setting | 23 | 200 |
| starbot | character_action | 24 | 200 |
| starbot | real_space_color_palette_band | 24 | 200 |
| starbot | real_space_event | 24 | 200 |
| starbot | real_space_narrative_phase | 24 | 200 |
| starbot | real_space_scale_anchor | 24 | 200 |
| starbot | real_space_structural_detail | 24 | 200 |
| starbot | real_space_wavelength_signature | 24 | 200 |
| starbot | space_opera_crew_signal | 24 | 200 |
| starbot | space_opera_genre_register | 24 | 200 |
| starbot | (7× cosmic-vista) | 25 | 200 |
| starbot | landscape_moment | 25 | 200 |
| starbot | real_space_composition_focus | 25 | 200 |
| starbot | ritual_moment | 25 | 200 |
| starbot | (3× space_opera) | 25 | 200 |
| toybot | (8× dino_diorama) | 25 | 200 |
| toybot | dino_toy_cast | 25 | 200 |
| dragonbot | cozy_arcane_inhabitant_age | 25 | 100 (age-stage cap) |
| pixelbot | (couple at 27-28) | 27-28 | 200 |
| chibibot | — | (none ≤25) | — |
| bloombot | — | (none ≤25, several at 28-30) | — |
| dinobot | — | (none) | — |
| earthbot | — | (none) | — |
| faebot | — | (none) | — |
| gothbot | — | (none) | — |
| mangabot | — | (none in audit) | — |
| oceanbot | — | (not in audit) | — |
| retrobot | — | (none) | — |
| steambot | — | (none) | — |
| tinybot | — | (not in audit) | — |
| yumbot | — | (none ≤25) | — |

**Stage 1 status: 🚧 IN PROGRESS** (~70 pools)

### Stage 2 — Path-bespoke pools at 26-99 entries [PRIORITY 1]

The bulk of the backfill. Most bots' path-bespoke pools (setting / scene / phenomenon / atmosphere / surprise_element / etc.) sized at 30-90 entries. Bring to 200 where possible, accept natural caps.

(Detailed lists per bot — generated from audit, will be filled in as Stage 1 completes.)

**Stage 2 status: ⏳ PENDING**

### Stage 3 — Cleanup + verification [PRIORITY 2]

- Fleet-wide dedup audit after Stage 1+2 lands
- Render-test 5 per affected path
- Update playbook with any new lessons
- Audit `seedGenHelper.js` interface in case any bot-specific gen-script overrides it

**Stage 3 status: ⏳ PENDING**

---

## Per-bot progress tables

(Filled in as work lands. Each row tracks one pool through the canonical pattern.)

### dragonbot — ✓ Pool scaleup done (2026-06-05 commits `f82f607e` + this work)

| Pool | Before | After | Status | Gen script |
|---|---|---|---|---|
| cozy_arcane_candid_moment | 25 | 200 | ✓ | gen-cozy-arcane-candid-moment.js |
| cozy_arcane_inhabitant_archetype | 25 | 200 | ✓ | gen-cozy-arcane-inhabitant-archetype.js |
| cozy_arcane_clutter_focus | 25 | 200 | ✓ | gen-cozy-arcane-clutter-focus.js |
| cozy_arcane_magical_signature | 25 | 200 | ✓ | gen-cozy-arcane-magical-signature.js |
| cozy_arcane_hearth_warmth_source | 25 | 200 | ✓ | gen-cozy-arcane-hearth-warmth-source.js |
| cozy_arcane_signature_familiar | 25 | 200 | ✓ | gen-cozy-arcane-signature-familiar.js |
| arcane_halls | 25 | 200 | ✓ | gen-arcane-halls.js |
| arcane_spell_moment | 30 | 200 | ✓ | gen-arcane-spell-moment.js |
| landscape_aesthetic_register | 25 | 200 | ✓ | gen-landscape-aesthetic-register.js |
| landscape_light_quality | 25 | 200 | ✓ | gen-landscape-light-quality.js |
| landscape_signature_flora | 25 | 200 | ✓ | gen-landscape-signature-flora.js |
| landscape_signature_fauna | 25 | 200 | ✓ | gen-landscape-signature-fauna.js |
| landscape_magical_element | 25 | 200 | ✓ | gen-landscape-magical-element.js |
| iconic_landscape_mythic_tradition | 25 | 200 | ✓ | gen-iconic-landscape-mythic-tradition.js |
| iconic_landscape_legendary_landmark | 25 | 200 | ✓ | gen-iconic-landscape-legendary-landmark.js |
| iconic_landscape_mood_atmosphere | 25 | 200 | ✓ | gen-iconic-landscape-mood-atmosphere.js |
| iconic_landscape_heraldic_color | 25 | 200 | ✓ | gen-iconic-landscape-heraldic-color.js |
| iconic_landscape_signature_creature | 25 | 200 | ✓ | gen-iconic-landscape-signature-creature.js |
| epic_moment_epoch_signature | 25 | 200 | ✓ | gen-epic-moment-epoch-signature.js |
| epic_moment_peak_event_choreography | 25 | 200 | ✓ | gen-epic-moment-peak-event-choreography.js |
| epic_moment_heraldic_identity | 25 | 200 | ✓ | gen-epic-moment-heraldic-identity.js |
| epic_moment_witness_chorus | 25 | 200 | ✓ | gen-epic-moment-witness-chorus.js |
| epic_moment_architectural_signature | 25 | 200 | ✓ | gen-epic-moment-architectural-signature.js |
| dragon_scene_dragon | 30 | 200 | ✓ | gen-dragon-scene-dragon.js |
| dragon_scene_action | 30 | 200 | ✓ | gen-dragon-scene-action.js |
| dragon_scene_landscape | 30 | 200 | ✓ | gen-dragon-scene-landscape.js |
| dragon_scene_surprise_element | 30 | 200 | ✓ | gen-dragon-scene-surprise-element.js |

**Conceptual-ceiling pools intentionally left at current sizes:**

| Pool | Current | Reason |
|---|---|---|
| cozy_arcane_inhabitant_age | 25 | Age-stage taxonomy caps low |
| female_explorer_outfit / action | 45 | Per playbook accessory/action caps |
| male_explorer_outfit / accessory | 47-55 | Per playbook caps |
| *_phenomenon (gated) | 50 | Gated axes don't need 200 |
| dragon_lore_sky | 97 | Sky vocabulary caps ~100 |
| *_accessory (50-98) | various | Accessory pools cap at 49-98 per playbook |

### brickbot — ⏳ pending

(table TBD — 72 pools)

### starbot — ⏳ pending

(table TBD — 39 pools)

### mechbot — ⏳ pending

(table TBD — 18 pools, 6 critically-low lighting pools)

### bloombot — ⏳ pending

### chibibot — ⏳ pending

### pixelbot — ⏳ pending

### gothbot — ⏳ pending

### toybot — ⏳ pending

### yumbot — ⏳ pending

### steambot — ⏳ pending

### earthbot — ⏳ pending

### dinobot — ⏳ pending

### faebot — ⏳ pending

---

## Tooling

**`scripts/lib/seedGenHelper.js`** — the canonical helper. Every gen script must use it. Patched 2026-06-05:

- Removed the anti-prompt "DO NOT DUPLICATE" list that bloated input tokens
- Added programmatic dedup (exact-string + signature-hash)
- Added iterative overgen-and-dedup loop with semantic-ceiling stop
- Default `maxTokens: 8000` (was 2500 — too small for batch 50 with 25-40 word entries)

**Standard run command:**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
node scripts/gen-seeds/<bot>/<gen-script-name>.js
```

For parallel multi-pool runs, bash backgrounding works:

```bash
for s in <scripts>; do node "$s" > "/tmp/log_$s.log" 2>&1 & ; done; wait
```

---

## Lessons learned during backfill (update as work lands)

- **2026-06-05** — `seedGenHelper` was passing existing entries back to Sonnet as anti-prompt. Doesn't work + bloats tokens + truncates responses. Patched to match `gen-starbot-pool.js` canonical pattern.
- **2026-06-05** — `maxTokens: 2500` is too small for batch 50 with 25-40 word entries. Bumped default to 8000. Bump per-script to 16000 for 60+ word entries.
- **2026-06-05** — Pre-existing-dupe pools surfaced: `castle_hero` had 158 unique of 200, `male_outfits` 153 of 193, `castle_biome` 168 of 200, several others. These had been quietly polluting renders for months. Dedup-pass auto-fixes.
