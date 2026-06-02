#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/boss_arena_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING descriptions for PixelBot's boss-arena path. Each entry is 15-30 words describing DRAMATIC, CINEMATIC boss-arena lighting (Hades + Hollow Knight + Salt and Sanctuary + Dead Cells + Souls-like + Cuphead boss reveal).

EVERY entry must include:
- DRAMATIC RAKING LIGHT cutting the boss/architecture from the background
- HIGH CONTRAST — sharp light vs deep shadow
- Specific light source (raking sunbeam, lightning strike, magical-aura halo, fire-pit glow, cosmic-rune pulse, spotlight-pillar from cracked ceiling, lava-glow, electric-strobe)
- Light DRAMATICALLY emphasizes the boss silhouette / makes it loom
- Color tone (blood-red, blue-cool, cosmic-violet, fire-orange, sickly-green, electric-white, nightshade-purple)

Examples (write fresh):
- "Single shaft of god-light through a stained-glass window cutting the boss silhouette from oppressive cathedral darkness, dust motes catching the beam, deep shadow surrounding."
- "Lightning strike middle-distance illuminating the boss's looming silhouette in stark white-flash, deep blue-black storm-sky between flashes, raking strobe across the arena."
- "Lava-glow orange-red rising from the molten center as primary light, the boss silhouetted against the inferno, drifting embers, deep shadow on the foreground stones."
- "Cosmic-violet aura pulsing from the boss as primary light source, surrounding void deep-blue-black with starfield, the floor glowing pale-violet runic-light."
- "Two flanking braziers blazing red-orange flame, the demon-king-boss silhouetted on a skull-throne between them, raking torchlight on the columned hall, deep shadow corners."
- "Cool-blue glacial backlight rim-lighting the ice-titan boss, the ice-floor glowing pale-blue, breath-mist in the freezing air, deep blue-black storm-sky beyond."
- "Sickly-green poison-glow rising from the chamber floor as primary light, the spider-boss silhouetted against the toxic haze, deep shadow corners, dripping toxic-fluid puddles."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
