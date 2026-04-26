#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} NEO-TOKYO SETTING descriptions for MangaBot's neo-tokyo path — cyberpunk-Japan futuristic locations. Blade Runner meets Akira meets Ghost in the Shell. Neon, rain, density, Japanese signage.

Each entry: 15-30 words. One specific cyberpunk-Japan setting.

━━━ CATEGORIES ━━━
- Neon-drenched alleys (rain, Japanese kanji signs, puddle reflections)
- Ramen-shop 3am (glowing shop sign, steam, counter-seating, wet street outside)
- Rooftop city-overlooks (neon Tokyo sprawl, hovering drones, rain-slick)
- Arcade interiors (claw-machines, pachinko, saturated neon)
- Convenience-store 4am neon-lit (fluorescent + cyberpunk glow outside)
- Bullet-train stations future (holographic signs, sleek platforms)
- Subway interiors futuristic (LED ads, crowded standing-only)
- Club district neon (red-light, crowds, holographic ads overhead)
- Mecha hangars (giant mech frames, industrial lighting)
- Cyberpunk apartment interiors (cramped, neon-lit through window)
- Hacker dens (multiple monitors, cables, green-glow)
- Rain-on-neon (Blade-Runner style city shot)
- Hover-vehicle traffic overhead (flying cars, street below)
- Holographic billboard alleys (huge holograms of anime characters advertising)
- Cybernetic clinic interiors (chrome, augmentation procedures)
- Underground fight-club (smoke, neon-rim, cyberpunk crowd)
- Dystopian rainy overpasses (graffiti, neon signs)
- Robotic-vending-machine alley (street vendors automated)
- Cyberpunk festival with neon-torii
- Sky-bridges between mega-buildings (futuristic)
- Mecha-training simulator rooms (holographic virtual)
- Neon-lit pachinko parlors
- Rooftop garden oases in cyberpunk sprawl
- Robot-operated noodle shops
- Augmented-reality-display streets

━━━ RULES ━━━
- Cyberpunk-Japan / Neo-Tokyo aesthetic
- Blade Runner + Akira + Ghost in the Shell vibe
- Rain / neon / density / Japanese signage
- No human figures required (setting is hero — can include peripheral silhouettes)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
