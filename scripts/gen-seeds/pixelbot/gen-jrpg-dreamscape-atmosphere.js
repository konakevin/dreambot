#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_dreamscape_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's jrpg-dreamscape path. Each entry is 15-30 words describing surreal cosmic dreamscape animated-feel particulate (Final Fantasy mode-7 + Octopath HD-2D + Sea of Stars + Chrono Trigger + Earthbound).

EVERY entry must include 2-3 of these surreal-cosmic-feel elements:
- Drifting feathers / petals / leaves
- Falling stars / falling cosmic-sparks
- Hourglass-sand / time-particle drift
- Drifting magical motes / glow-spheres
- Refracted prism-shimmer
- Drifting cosmic-clouds / nebula-mist
- Floating geometric runes / fractal-shapes
- Suspended fragments / shattered crystal-shards floating
- Drifting cosmic-ribbons / aurora-veils
- Pulse-rings expanding from a focal point
- Drifting koi / ethereal-fish swimming through air
- Suspended water-droplets

Examples (write fresh):
- "Drifting opalescent feathers across the cosmic platform, falling pale-gold cosmic-sparks, suspended crystal-shards floating in middle-distance, soft pearl-white haze."
- "Hourglass-sand suspended mid-fall around the chamber, drifting time-particles in pulse-rings, refracted prism-shimmer catching the runic-glow."
- "Drifting magical-motes, ethereal koi swimming through the cosmic-air, falling stars trailing pale-cyan, pulse-rings expanding from a central altar."
- "Drifting cherry-petals across the astral-plane, soft cosmic-ribbon aurora-veils, suspended water-droplets catching prism-light, gentle nebula-mist."
- "Falling pale-gold leaves from the world-tree above, drifting magical-motes, pulse-rings expanding outward from the trunk, soft cosmic-haze."
- "Cosmic-clouds drifting at all parallax depths, floating fractal-shape runes pulsing pale-violet, refracted prism-shimmer, suspended crystal-shards."
- "Drifting koi-spirits swimming through the cosmic-river, suspended water-droplets, soft golden-rose pulse-rings, drifting feather-particles."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
