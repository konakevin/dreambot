#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/ethereal_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ETHEREAL-MAGIC scene settings for GlowBot — soft-divine-transcendent scenes lit like Ghibli / Narnia / Rivendell. Every entry describes a magical-peaceful place with light as the hero.

Each entry: 18-32 words. Specific ethereal-scene + specific divine-light treatment.

━━━ CATEGORIES ━━━
- Floating islands with glowing flora + waterfalls cascading into void, lit by divine sunrise
- Cloud palaces bathed in peaceful sunset light, airy translucent architecture
- Staircases ascending into pillars of golden light
- Cathedral-scale tree with glowing canopy (Yggdrasil / Tree-of-Life vibes), soft amber light filtering through
- Sunlit glade in enchanted forest with shafts of warm light piercing + drifting pollen glow
- Celestial grove with drifting luminous motes + peaceful moonlight
- Grand divine gate open to a realm of golden light
- Hanging garden of light with glowing vines spilling from clouds
- Dream-bridge between two islands, arching into soft starfield
- Sacred spring with light rising from water, gentle mist + glowing flora
- Temple ruins overgrown with glowing moss + sun-shafts illuminating stone
- Sky meadow at twilight with floating lantern-orbs
- Crystalline forest humming with inner light
- Island floating above clouds, light god-raying through
- Ancient-tree archway framing an ethereal glow beyond
- Moonlit riverbend with silver-glowing water + willow-curtain light

━━━ RULES ━━━
- Magical / soft-divine / transcendent (NOT earthly realism — that's landscape path)
- Always peaceful, never menacing
- Ghibli/Narnia/Rivendell/Elden-Ring-peaceful energy
- No characters

━━━ BANNED ━━━
- Menacing / dark / horror
- Named IP
- Over-crowded detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
