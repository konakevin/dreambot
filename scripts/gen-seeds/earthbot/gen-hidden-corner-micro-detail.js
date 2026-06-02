#!/usr/bin/env node
/**
 * EarthBot hidden-corner — MICRO DETAIL axis.
 *
 * Rich texture detail that makes every surface alive. Dew droplets,
 * lichen patches, mushroom caps, ferns unfurling, water ripples, etc.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_micro_detail.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MICRO DETAIL entries for EarthBot hidden-corner. Each entry names 2-4 SPECIFIC rich texture elements that make every surface in the intimate scene visibly alive. Dew, lichen, mushrooms, water droplets, fern unfurling, etc. Real Earth ONLY.

━━━ THE BAR — 2-4 SPECIFIC TEXTURE ELEMENTS ━━━

Each entry names 2-4 distinct micro-texture elements visible across the scene. Examples: "Morning dew clinging to fern fronds, lichen patches on the stone walls in chartreuse and pale-mint colors, mushroom clusters at the trunk bases, water droplets beading on wet leaves" — multiple textures, named specifically. NEVER vague language like "rich detail" — name the textures.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<2-4 specific texture elements, 22-40 words>" }

Bare strings acceptable.

━━━ TEXTURE ELEMENT CATEGORIES (combine freely) ━━━

- DEW / DROPLETS — water clinging to leaves / stones / petals / spider webs
- LICHEN — colorful crusts (chartreuse / orange / pale-mint / silver-grey) on stone or bark
- MUSHROOM CAPS — clusters of small fungi (NOT bioluminescent — real species)
- MOSS TEXTURES — emerald velvet moss, springy reindeer moss, shaggy old-man's-beard moss
- FERN UNFURLING — fiddleheads emerging, mature fronds, varied fern species
- WET STONE GLEAM — water-slick surfaces catching light
- WATER RIPPLES — surface ripples, concentric rings from falling droplets
- BARK PATTERNS — peeling birch, fissured oak, smooth maple, lichen-crusted spruce
- LEAF VEINS — close-detail leaf vein patterns, water-droplet-magnified
- SPIDER WEBS — dew-strung webs catching light between branches
- PETAL DROPS — fallen blossoms on moss / stone / water surfaces
- BUTTERFLY-WING DUST — pollen dust on petals / spider webs

━━━ EXAMPLES ━━━

✓ { "description": "Morning dew clinging to every fern frond in shimmering droplets, chartreuse and pale-mint lichen patches crusting the wet stone walls, scattered mushroom caps at the mossy base, water-droplet beading on the leaf surfaces" }

✓ { "description": "Velvet emerald moss carpeting every stone surface, fiddlehead-fern fronds emerging tightly coiled, water-slick wet-stone gleam catching the dappled light from above, scattered red-cap mushroom clusters at the trunk bases" }

✓ { "description": "Lacy spider webs strung dew-glittering between branches, fallen pink petals scattered across the moss floor, lichen patches in silver-grey and chartreuse on the rock walls, water rippling in concentric rings on the pool surface" }

✓ { "description": "Peeling silver-birch bark on the close trunks, soft fiddlehead-fern emergence at the base, mushroom clusters with chestnut caps tucked between the roots, dew-soaked moss surfaces gleaming throughout" }

━━━ ABSOLUTELY BANNED ━━━

- Vague language ("rich detail" / "lush textures") — NAME the elements
- Bioluminescent / phosphorescent / glowing-fungi
- Sci-fi / fantasy / iridescent / impossible
- Architecture / man-made elements
- Single texture only (must be 2-4 elements)
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. 2-4 specific textures per entry. Real-Earth, named specifically. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
