#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_LEGENDARY_LANDMARK — production scale-up to 200.
 *
 * The iconic mythic feature baked INTO the biome — a petrified dragon-skull,
 * a sword-in-stone monument, a hovering island, a sunken city visible through
 * a lake. Each entry names a SPECIFIC landscape-scale landmark with shape +
 * scale + position. NEVER focal-character-scale. This is the readable-focus
 * mythic detail that turns a generic biome into an unmistakably-mythic vista.
 *
 * Mirrors the existing 25 entries' register: 30-50 word sentence naming the
 * landmark, its position in the frame (foreground/midground/deep-distance),
 * and a scale cue that proves it's landscape-scale not character-scale.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_legendary_landmark.json',
  total: 200,
  batch: 50,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LEGENDARY-LANDMARK descriptions for DragonBot's iconic-landscape path. Each entry names a SPECIFIC mythic feature woven INTO a fantasy landscape at LANDSCAPE-SCALE (NOT character-scale) — a petrified dragon-skull the size of a cathedral, a sword-in-stone monument crowning a far ridge, a hovering island trailing waterfalls, a sunken city visible through a glassy lake.

Each entry: 30-50 words, ONE sentence. Names: (1) the landmark, (2) its position in the frame (foreground / midground / deep-distance / horizon), and (3) a SCALE CUE proving it's landscape-scale not character-scale.

━━━ EXAMPLE REGISTER (mirror this exactly) ━━━

  "A petrified dragon-skull the size of a cathedral resting in the midground valley floor, its hollow eye sockets framing the distant snowpeaks beyond, unmistakably readable at landscape scale."
  "A sword-in-stone monument crowning the far ridge in deep distance, the blade a thin silver sliver silhouetted against storm-lit clouds, its impossible scale clarified by the forests dwarfed below."
  "A world-tree of impossible height dominating the horizon at dead center, its golden canopy wider than a city, roots visible as ridge-lines curling into the foreground earth."

━━━ VARIETY MANDATE — distribute the ${n} entries roughly across these landmark categories ━━━

(roughly equal counts — do NOT cluster on one category)

1. **DRAGON / GREAT-BEAST REMAINS** — petrified skulls, spine-roads, rib-cage cathedrals, claw-mountains, fossilized wing-arches. Each at cathedral-or-larger scale.

2. **TITAN / GIANT REMAINS** — half-buried colossal stone heads / hands / shoulders / feet / kneeling-torso ruins. Limbs visible as terrain features.

3. **SWORD / WEAPON MONUMENTS** — sword-in-stone, axe-in-cliff, broken-blade obelisk, halberd-driven-through-mountain, hammer-on-altar at watchtower scale.

4. **WORLD-TREES / SACRED TREES** — single colossal tree dominating horizon, golden-canopy world-tree, silver-bark grove of impossibly-tall ancients, hollow-tree-city.

5. **FLOATING / SUSPENDED OBJECTS** — hovering islands trailing waterfalls, suspended boulders, levitating monolith-clusters, drifting cathedrals, hanging-rock with lone-tree silhouette.

6. **SUNKEN / SUBMERGED RUINS** — sunken city under glassy lake, drowned cathedral visible through ice, submerged colossus reaching upward, underwater spire-forest.

7. **STANDING-STONE CIRCLES / HENGES** — ring of runic megaliths, concentric stone circles, broken obelisk-cluster, fallen-tower-stones, ley-marker spire-ring.

8. **CARVED CLIFF-FACES / MOUNTAIN CARVINGS** — giant face carved into a cliff, mountain-spanning relief, colossal door carved into a mountain, throne-shaped peak, helmet-shaped summit.

9. **BATTLEFIELD / AFTERMATH RELICS** — bone-field plain, broken-banner forest of standing spears, scattered-armor field, cursed-blade graveyard, ash-cairn ridge.

10. **MAGICAL / RUNIC INSTALLATIONS** — glowing leyline-spring pool, portal-rune circle, suspended-bridge of cold light, runic monolith-cluster, levitating ward-stones in concentric rings.

11. **RUINED CITIES / FORTRESSES** — collapsed bridge with single keystone suspended, half-collapsed citadel on a far ridge, broken aqueduct-line spanning a gorge, fallen-watchtower at horizon, crumbling colossus-statue street.

12. **NATURAL PHENOMENA AT IMPOSSIBLE SCALE** — inverted waterfall rising upward, petrified-forest with mid-splinter trunks, frozen-wave coast, crystal-spire eruption, glowing geode-cluster the size of a hill.

13. **THRONES / SACRED SEATS** — lost throne in a wilderness clearing, judgment-stone seat on a peak, fallen-king's-chair half-claimed by forest, oracle-throne over a chasm.

14. **CROWN / ARTIFACT MONUMENTS** — half-buried iron crown the size of a keep, broken sceptre across a riverbed, fallen-banner the size of a ship-sail draped over a hill.

━━━ THE SCALE CUE — NON-NEGOTIABLE ━━━

Every entry MUST contain a scale-proving phrase that makes the landmark unmistakably LANDSCAPE-SCALE, NOT character-scale. Examples (use this exact construction style):

- "...the size of a cathedral resting in the midground valley floor..."
- "...wider than a city..."
- "...each curving bone the diameter of a watchtower..."
- "...wide enough to encircle a keep..."
- "...twice the height of a ship-mast..."
- "...each block the size of a cottage..."
- "...the scale declared by the pine trees rooted in its hairline carvings..."
- "...the forests dwarfed below..."
- "...the bearded stone face half-submerged..."

━━━ POSITION CUE — NON-NEGOTIABLE ━━━

Every entry MUST name the landmark's position in the frame:
- "foreground" / "midground" / "deep distance" / "horizon" / "the far ridge" / "the midground valley floor" / "the upper midground sky" / "in dead center" / etc.

━━━ STRICT BANS ━━━

- NO franchise proper nouns: NO "Mordor", "Rivendell", "Lothlorien", "Azeroth", "Pandaria", etc. Describe the landmark generically.
- NO characters / heroes / orcs / elves / dwarves / hobbits in frame. Pure landscape.
- NO modern (no industrial / electric / plastic / chrome / glass-skyscraper).
- NO sci-fi / cyberpunk / neon / orbital.
- NO Eastern-coded register (no torii / pagoda / samurai-shrine).
- NO scale phrases that read as character-scale: NEVER "the size of a man / a horse / a wagon" — too small. Cathedrals / cities / forests / mountains / watchtowers as scale-referents only.
- Each entry MUST be a SINGLE coherent landmark — not a list of three random features.

━━━ STRICT FORMAT ━━━

- ONE sentence per entry. No internal periods.
- 30-50 words.
- Start with "A " or "An " (the indefinite article framing) — same as the existing 25.
- Strip apostrophes from possessives.
- Each landmark unique — no near-duplicates of prior entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each entry follows the format exactly.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
