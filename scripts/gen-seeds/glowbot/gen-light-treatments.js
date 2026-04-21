#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/light_treatments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHT TREATMENT descriptions for GlowBot — each describes a specific lighting phenomenon that can be applied to a scene. The LIGHT IS THE HERO. All treatments emotional + peaceful, never harsh.

Each entry: 10-20 words. One specific light phenomenon with quality.

━━━ CATEGORIES ━━━
- God-rays / sun-shafts (through fog, clouds, canopy, window, cathedral)
- Aurora (green, pink, violet, golden, curtain, pillar, shimmer)
- Firefly / lightning-bug gathering (pillars, swarms, dotted-constellation)
- Moss-glow / bioluminescent (inner-glow, cyan-wash, gentle pulsing, dotted-across-forest-floor)
- Moonlight (silver-path-on-water, cold-silver-on-snow, gentle-silver-on-leaves)
- Dawn-shaft (warm golden first-light, pink-peach break-of-day)
- Dusk-sidelight (warm amber laying across scene, long shadows soft)
- Dappled-canopy (leaf-pattern on floor, sun-dappling through trees, summer-breeze light-play)
- Stained-glass filter (rainbow-colored light through glass)
- Lantern / candle-pool (warm pool of light in darker scene)
- Bioluminescent-mushroom cluster (dotted-across-forest-floor, soft pulsing)
- Northern-lights curtain (waves of colored light in sky)
- Fog-shaft (sun breaking through atmospheric haze)
- Through-mist-or-steam (warm light diffused by vapor)
- Iridescent-cloud (rainbow-opal clouds)
- Halo of moisture around moon/sun (moonhalo, sundog)
- Crystal-refraction (light broken into prismatic colors)
- Softbox-ethereal (ambient-diffuse heavenly glow)
- Inner-light-from-object (artifact, flower, crystal, tree)
- Breathing-light (pulsing gently like heartbeat)

━━━ RULES ━━━
- Peaceful + awe-inducing
- Specific, not generic
- Never harsh / aggressive / electric-sharp

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
