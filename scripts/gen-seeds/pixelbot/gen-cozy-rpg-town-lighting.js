#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_rpg_town_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING descriptions for PixelBot's cozy-rpg-town path. Each entry is 15-30 words describing lighting + light-sources for a cozy pixel-RPG town scene (Stardew + Octopath HD-2D + Sea of Stars lineage). Warm, inviting, golden, layered.

EVERY entry must include:
- Time of day (dawn / golden hour / dusk / night / midday-dappled / blue-hour)
- Specific light sources (warm-lit cottage windows, hanging lanterns, tavern fire-glow, candles, festival lantern-strings, signposts, market awning lamps)
- Layered atmospheric quality (warm-amber + ambient color, soft falloff)

VARIETY: rotate broadly across times of day, weather, and lighting sources. Avoid repeating "warm tavern" 50 times.

Examples (write fresh):
- "Golden-hour low warm sunlight filtering between half-timbered cottages, lit window-glow from the bakery and tavern, hanging lantern-strings beginning to ignite, soft amber dusk haze."
- "Dusk blue-hour with warm-amber lit cottage windows glowing strongest against cool ambient, hanging paper lanterns swaying, distant forge-fire glow, soft pink afterglow sky."
- "Snowy winter twilight with golden interior-glow from every cottage window, lantern-lit cobblestone paths, distant lighthouse beam cutting fog, soft cool blue ambient."
- "Spring midday with dappled cherry-blossom shadow on cobblestones, lit signposts, warm tavern doorway-glow, golden god-rays through tree gaps."
- "Festival-night with hanging lantern-strings glowing warm-amber across the square, food-cart fire-glow, candles in lit cottage windows, deep cool blue ambient sky."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
