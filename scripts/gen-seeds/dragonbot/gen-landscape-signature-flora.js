#!/usr/bin/env node
/**
 * LANDSCAPE_SIGNATURE_FLORA — production scale-up to 200.
 *
 * Each entry names ONE specific HERO FLORA that defines the scene's genre
 * specificity. Concrete species-name + concrete COLOR + concrete SCALE +
 * placement in the frame (foreground / midground / canopy / cliff face).
 * NO generic "lush forest" — every flora has a fantasy-coded NAME.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/landscape_signature_flora.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SIGNATURE-FLORA entries for DragonBot's landscape path — each entry names ONE specific HERO FLORA that defines a high-fantasy landscape's species-specificity. Each entry is one sentence, 22-32 words. The flora is the FRAME-FILLING vegetation element, not a tiny accent.

━━━ EVERY ENTRY MUST CONTAIN ALL FOUR ━━━

1. NAMED FANTASY-CODED SPECIES — a SPECIFIC compound name ("blood-rose" / "glass-bamboo" / "titan-mushroom" / "frost-flower" / "phosphorescent-tree" / "ember-thorn" / "floating-lotus" / "corpse-flower" / "sky-vine" / "spirit-pine" / "world-tree" / "ash-flower" / "ice-rose" / "mirage-flower")
2. CONCRETE COLOR — name the specific palette ("deep-crimson" / "translucent jade-green" / "rust-orange" / "white crystalline" / "silver-blue" / "coal-black with veins of orange fire" / "pale-gold" / "mottled purple-and-grey")
3. CONCRETE SCALE / SIZE — give a real-world comparison ("the size of dinner plates" / "no taller than a knee" / "each the diameter of a village square" / "thumbnail-sized" / "the width of longboats" / "thirty meters tall" / "the width of towers")
4. PLACEMENT IN FRAME + EXTENT — name where it sits and how much space it occupies ("sprawling across the foreground" / "occupying the midground" / "dominating the entire frame" / "stretching from foreground to horizon" / "clustered in the shadowed understory" / "filling the upper water column")

━━━ VARIETY MANDATE (distribute roughly across these flora classes) ━━━

- 5 FLOWER-FIELDS / MEADOWS (blood-rose / frost-flower / midnight-iris / ash-flower / wisp-lily / mirage-flower / ice-rose / star-petal)
- 5 GIANT-TREE / CANOPY (world-tree / sacred-oak / spirit-pine / phosphorescent-tree / silver-birch-grove / weeping-willow-giant / ironwood-titan / cedar-of-the-old-world)
- 4 MUSHROOM / FUNGAL (titan-mushroom / glow-mushroom / corpse-bloom / fungal-creep / mushroom-cathedral / spore-tower)
- 4 GRASS / DUNE / TUNDRA (dune-grass / glacier-lichen / ice-rose-tundra / sky-grass / sword-grass-prairie / steppe-bloom)
- 3 BAMBOO / REED / VINE (glass-bamboo / sky-vine / ironvine-tangle / silver-reed / crystal-bamboo / spore-reed)
- 4 THORN / THICKET / BRAMBLE (ember-thorn / shadow-bramble / crimson-thorn / bonethorn / razorvine-thicket / fire-bramble)
- 4 AQUATIC / MARSH (floating-lotus / kelp-canopy / mangrove-on-stilts / lily-of-deep-water / wisp-lily / coral-grove / abyss-flower)
- 3 CRYSTAL / GEM-FLORA (crystal-bloom / quartz-spire / sapphire-lichen / rune-petal / star-shard-flower)
- 3 ASH / VOLCANIC (ash-flower / ember-bloom / cinder-petal / lava-lily / smoke-vine)
- 3 PETAL-CLOUD / SKY-FLORA (cherry-blossom cloud / petal-storm / drifting-bloom / dandelion-host / silk-pollen-drift)

━━━ EXAMPLE PHRASINGS TO USE ━━━

Format: "A [named species] [grove/field/forest/thicket] [placement verb], [color description] [size description] [extent description]."

GOOD:
- "A blood-rose meadow sprawling across the foreground, deep-crimson petals the size of dinner plates carpeting every inch of scorched black soil."
- "A titan-mushroom forest dominating the entire frame, rust-orange caps each the diameter of a village square casting absolute shadow on the mossy understory."
- "A glass-bamboo grove occupying the midground, translucent jade-green stalks catching the light and scattering prismatic fragments across the forest floor."

━━━ BANS ━━━

- NO generic "lush forest" / "dense jungle" / "rolling grasslands" without a NAMED species and a COLOR
- NO real-world-only botanical names (no "oak forest" alone — must be "sacred-oak ring" or "silver-oak titan grove")
- NO scale ambiguity ("massive trees" → name the size: "trees the width of towers")
- NO characters / creatures / fauna in the flora entry — flora axis only
- NO mood / lighting (no "moody mist" / "golden glow") — those are other axes
- NO photographer / film references

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
