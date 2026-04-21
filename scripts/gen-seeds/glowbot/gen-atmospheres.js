#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ELEMENT descriptors for GlowBot renders — each is a specific in-frame particulate/ambient element that adds to the peaceful luminous atmosphere.

Each entry: 8-18 words. One atmospheric element per entry.

━━━ CATEGORIES ━━━
- Drifting particles (pollen motes, pearlescent dust, floating light-flecks, gentle drifting leaves)
- Mist / fog (pearlescent fog, low-morning-mist, veil-like fog, drifting vapor curtains)
- Petals/leaves falling (cherry blossom drift, golden autumn leaves, drifting pink petals)
- Fireflies / luminous insects (drifting fireflies, glowing-butterfly flutter, lantern-bugs)
- Water mist (dew-kissed air, water-spray rainbow, river mist-cool)
- Stars / sparkles (soft twinkling stars, glittering particulate, prismatic light-flecks)
- Floating lanterns / light-orbs (sky lanterns, floating candle-flames)
- Pollen clouds (backlit pollen-stream drifting, soft yellow-green haze)
- Ash / snow-drift (gentle falling snow, soft ash-fall from distant volcano)
- Magic particles (glowing motes, drifting sparkles, iridescent flecks)
- Seed / fluff (dandelion-fluff drift, milkweed-seed float)
- Wildlife as atmosphere (distant bird silhouettes, deer at edge, glowing butterfly at bloom)
- Cloud movement (slow-drifting low cloud, atmospheric stratus)
- Rainbow light (prismatic rainbow hanging, light-refraction-flecks)
- Steam / vapor (rising from water, from wet moss, from hot spring)
- Aurora shimmer (soft-moving curtain overhead)
- Light-dancing on water (reflected-sun dancing pattern)
- Soft-glowing tendrils (wisp-like drift)

━━━ RULES ━━━
- Peaceful + adds warmth/serenity/luminosity
- One element per entry
- Integrates naturally with landscape
- No dramatic/aggressive particles (lightning, fire, sparks)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
