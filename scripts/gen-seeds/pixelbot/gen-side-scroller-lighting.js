#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/side_scroller_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's side-scroller-world path. Each entry is 15-30 words describing layered parallax pixel-platformer lighting (Owlboy + Hollow Knight + Dead Cells + Celeste + Ori-style lineage).

EVERY entry must include:
- Time of day or biome-mood (sunrise, dawn, golden hour, dusk, twilight, midday-dappled, midnight-magical, underground-glow)
- LAYERED LIGHT — different intensities/tints across the parallax foreground/middle/background layers
- Specific light source(s) (sun-rays through canopy, lava-glow, crystal-glow, fire-flicker, magical-aura, neon-arc, lightning-strike, moonbeam, aurora)
- Rim-light or silhouette-cut on subjects (the platforming-feel of strong key-light vs deep-shadow)

VARIETY: rotate broadly across times, biomes, and color palettes.

Examples (write fresh):
- "Sunrise pink-and-orange sun-rays piercing through layered cloud parallax, foreground platforms in cool-blue shadow, middle layer rim-lit warm-orange, far backdrop glowing pink-gold cloud-bank."
- "Underground bioluminescent crystal-glow as primary light source — pale-cyan rim-lighting on foreground stone outcrops, deeper-violet middle-layer cavern hall, far backdrop fading to deep-blue gloom."
- "Golden-hour low warm sunlight through bamboo parallax, foreground bamboo trunks rim-lit gold, middle layer in cool-blue shadow, far backdrop warm-yellow haze."
- "Volcanic lava-glow orange-red as primary light, drifting embers catching the light, foreground platforms silhouetted against the molten backdrop, ash-cloud diffusing the highlights."
- "Storm-cliff with lightning-strike middle-distance, raking white flash, rain streaking, foreground platforms in cool-blue ambient, far backdrop pitch-dark with blue-white flash."
- "Aurora ribbon-light pink-and-cyan in night sky, foreground ice-platforms rim-lit cool-blue, middle layer hills in deep-purple shadow, soft moonbeam wash."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
