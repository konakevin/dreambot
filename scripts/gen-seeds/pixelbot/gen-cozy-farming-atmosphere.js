#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_farming_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's cozy-farming-life-sim path. Each entry is 15-30 words describing WARM, ANIMATED-FEEL farming/life-sim atmospheric details (Stardew + Spiritfarer pixel + Coffee Talk + Animal Crossing pixel).

EVERY entry must include 2-3 of these animated-feel elements:
- Drifting cherry-petals / apple-blossom / autumn-leaves / dandelion-fluff
- Chimney smoke curling
- Crops swaying gently
- Pixel-cats / dogs / chickens / sheep / cows / ducks mid-stride
- Hanging laundry / herb-bundles / drying garlic-strings billowing
- Bees / butterflies / dragonflies drifting
- Falling sakura / falling leaves seasonal
- Steam from kettle / tea-cup / hot-spring
- Fireflies drifting (evening scenes)
- Rain on greenhouse glass
- Rooster crowing visible (mid-stride animated)
- NPC mid-action (vendor stocking, farmer hauling crate, child running with bucket)

Examples (write fresh):
- "Drifting cherry-petals across the farm, chimney smoke curling from the cottage, a pixel-cat curled on the porch mid-grooming, two chickens pecking near a fence-post."
- "Autumn-leaves drifting across a barn doorway, a NPC hauling a basket of pumpkins, a pixel-dog wagging mid-stride, drifting golden-hour pollen-motes."
- "Bees drifting around lavender plots, butterflies in flight at eye-level, a beekeeper-NPC in front of hives with smoker-puff drifting, dappled-leaf shadow."
- "Steam rising from a kettle on a small porch-stove, drifting laundry on a line, a pixel-cat dozing on the steps, distant rooster mid-crow."
- "Fireflies drifting between cottages at dusk, drifting paper-lantern-glow, a NPC at the well with a bucket, chimney smoke from three rooftops."
- "Rain dripping on a greenhouse glass roof, sprouts in pots swaying gently, a pixel-cat dozing on a stack of pots, drifting steam from a watering-can."
- "Drifting hay-dust in the barn light, sheep grazing in the foreground, a pixel-dog mid-herding, distant farmhouse warm-window-glow."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
