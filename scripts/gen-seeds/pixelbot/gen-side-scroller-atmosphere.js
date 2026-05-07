#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/side_scroller_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's side-scroller-world path. Each entry is 15-30 words describing the layered parallax animated-feel atmospheric details for a 2D pixel-platformer (Owlboy + Hollow Knight + Dead Cells + Celeste + Ori).

EVERY entry must include 2-3 of these animated parallax-feel elements:
- Drifting pollen / pollen-motes / spores
- Falling rain / falling snow / drifting ash
- Drifting petals / falling leaves
- Sparkling magical motes / glowing particles
- Drifting fog / mist / steam
- Distant biome-creatures (bird in flight, fish drifting, butterfly, dragonfly, drifting jellyfish)
- Lava-bubble pop / geyser-spurt / wave-crash
- Sprite-trail blur on flying subjects
- Drifting waterfall mist
- Magical glow-pulse on platforms

Examples (write fresh):
- "Drifting pollen-motes through the canopy sun-rays, three songbirds in flight across mid-frame, falling leaves on the foreground platform, soft mist between layers."
- "Drifting magical motes catching crystal-glow, dripping water from stalactites, a lone bat in flight middle-distance, sparkling glow-spore particles."
- "Falling snow drifting across all parallax layers, distant aurora-shimmer, breath-mist in foreground cold air, a single distant snow-fox silhouette in middle-distance."
- "Drifting ash from a distant erupting volcano, embers rising from foreground lava-cracks, smoky red haze between layers, a fire-bird in flight middle-distance."
- "Drifting cherry-petals across all layers, distant pagoda-bell echo, butterflies in flight middle-distance, drifting golden-hour pollen-motes."
- "Lightning flash strobing across the storm-sky, rain streaking diagonally, foreground waves crashing on the platform, distant gull-silhouette."
- "Drifting waterfall mist between layers, magical motes catching the spray-light, falling petals from canopy, two dragonflies in flight at eye-level."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
