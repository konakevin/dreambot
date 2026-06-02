#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/dungeon_depth_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERE descriptions for PixelBot's dungeon-depth path. Each entry is 15-30 words describing the animated-feel atmospheric particulate + tension-building details for a pixel dungeon (Diablo + Hades + Hyper Light Drifter + Salt and Sanctuary).

EVERY entry must include 2-3 of these tension-building elements:
- Drifting dust motes in light shafts
- Dripping water from ceiling-stalactites
- Drifting magical glow-spore particles
- Swinging chains creaking
- Distant echo / drip / breath-mist
- Drifting ash / smoke / embers
- Distant skeletal / monstrous silhouette in middle-distance
- Cobwebs swaying
- Bone-piles scattered on floor
- Crumbling masonry-dust falling
- Drifting fog / damp-mist at floor level

Examples (write fresh):
- "Drifting dust motes in the torch-shaft, dripping water from a stalactite into a foreground puddle, distant skeletal patrol silhouette in middle-distance archway."
- "Swinging rusted chain creaking gently, cobwebs swaying in the doorway, drifting smoke from a brazier, scattered bone-piles in the foreground corner."
- "Drifting pale-cyan glow-spore particles from cluster-fungi, dripping water reflections on stone, drifting fog at floor level, distant chamber-echo."
- "Bone-piles scattered across the chamber floor, drifting ash from a long-dead brazier, single dripping water source, oppressive silence-feeling."
- "Drifting magical motes catching the rune-light, breath-mist visible in the cold air, swinging chain shadow, crumbling masonry-dust falling from a cracked column."
- "Damp ground-fog rolling between sarcophagi, drifting cobweb-strands, distant drip-water echo, two skeletal hands suggested at the edge of frame."
- "Sickly-green glow-spore drift from cracked corpse-altar, dripping fluid into puddles below, breath-mist in the cold, distant scraping-claw echo."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
