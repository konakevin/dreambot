#!/usr/bin/env node
/**
 * PixelBot pixel-overworld — bespoke axis pools (Stage K3, SHADOW). The classic JRPG
 * world-MAP screen: top-down tile continents, tiny walled towns, mountain ranges,
 * forests as tile clusters, a ship sprite on tile sea, cloud shadows. 16-bit SNES
 * pixel-art. STRAIGHT top-down world-map view (the map SCREEN). The chunky repeating
 * terrain TILE-GRID must read. NO UI/menus/labels/text. 4 pools.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-overworld-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';

(async () => {
  // map_region — the geography composition.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_overworld_map_region.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} MAP-REGION descriptions for PixelBot's pixel-overworld path — the geography composition of a classic 16-bit JRPG WORLD-MAP screen (top-down tile continents). The register is the overworld map of Final-Fantasy / Dragon-Quest / Chrono-Trigger-style SNES RPGs. 16-bit SNES pixel-art, straight top-down.

Each entry: 18-30 words. ONE specific overworld geography composition made of chunky repeating terrain tiles. NO characters/sprites (those are another axis). NO UI/labels/text.

Variety mandate — distribute across: an archipelago of green tile-islands scattered across a tile sea; twin continents split by a wide tile ocean channel; an inland sea ringed by tile-mountain ranges; a volcanic isle-chain with dark lava tiles; a snowy northern tile-continent with ice floes; a great forest-tile continent veined with rivers; a desert tile-region with an oasis; a mountainous highland with tile-plateaus and canyons; a coastal peninsula of green plains and cliffs; a swampy delta of marsh tiles and winding rivers.

━━━ BANS ━━━
- NO UI / menus / map-labels / place-names / text / grid-numbers
- NO characters/sprites, NO first-person, NO 3/4-town-view (this is the flat MAP SCREEN, straight top-down)
- 16-bit pixel-art with CHUNKY REPEATING TERRAIN TILES, NO smooth illustration
Return ONLY a JSON array of ${n} strings.`,
  });

  // map_features — pickN:2 landmark tiles.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_overworld_map_features.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} MAP-FEATURE descriptions for PixelBot's pixel-overworld path — a single small landmark that sits on the tile world-map (the template stacks TWO per render). Each entry 8-16 words. A chunky pixel map-icon landmark, NO text/labels.

Variety mandate — a tiny walled town of clustered rooftops; a lone stone tower on a hill; a pixel bridge spanning a river; a little port with docks and a boat; a castle with pennants; a dark dungeon-cave entrance; a windmill on a plain; a pyramid in the desert; a shrine on a mountaintop; a lighthouse on a cape; a village of thatched huts; a stone circle in a forest clearing.

━━━ BANS ━━━
- NO text / signage / place-name labels / UI
- NO IP references, 16-bit chunky pixel map-icon only
Return ONLY a JSON array of ${n} strings.`,
  });

  // traveler_sprite — the tiny party/vehicle crossing the map.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_overworld_traveler_sprite.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} TRAVELER-SPRITE descriptions for PixelBot's pixel-overworld path — the tiny party/vehicle sprite crossing the world-map (the overworld avatar). Each entry 10-18 words. A TINY top-down chunky sprite on the tiles, never a portrait.

Variety mandate — a tiny party of hero-sprites walking a plains tile-path; a little sailing ship crossing the tile sea; an airship-sprite casting a shadow over the tiles; a tiny mounted rider on a road tile; a canoe on a river tile; a lone traveler-sprite entering a forest; a caravan of little wagon-sprites; a small boat rounding a cape; a party crossing a mountain pass tile; an airship docking at a tile-town.

━━━ BANS ━━━
- sprite is TINY top-down (map-scale), NEVER a portrait / close-up / first-person
- NO text / UI / party-menu, NO IP references
Return ONLY a JSON array of ${n} strings.`,
  });

  // map_event — 40%-gated.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_overworld_map_event.json',
    total: 30,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} MAP-EVENT descriptions for PixelBot's pixel-overworld path — a gated small dramatic accent on the tile world-map. Each entry 8-16 words. Chunky pixel-art, NO text.

Variety mandate — a swirling storm-cloud tile-cluster over the sea; a glowing dungeon-entrance pulsing on a mountain; a volcano erupting a pixel plume; drifting cloud-shadows crossing the tiles; a whirlpool spiraling in the tile sea; a meteor streaking over the map; a rainbow arcing over a continent; a magical glow radiating from a shrine; a fog-bank rolling over a forest; aurora shimmering over the northern tiles.

━━━ BANS ━━━
- NO text / UI / labels, NO IP references
- 16-bit chunky pixel-art tiles only
Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 pixel-overworld pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
