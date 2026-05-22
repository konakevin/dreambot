#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_light_signature.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHT-SIGNATURE entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry specifies the DOMINANT LIGHT SOURCE + COLOR + DIRECTION that bathes the scene. Neon-saturated. Akira / Blade-Runner / GitS color register.

Each entry: 10-20 words. ONE light signature with palette + direction + quality.

LIGHT-SIGNATURE VARIETY (all neon-coded):
- HOT-PINK NEON BLAST (massive pink dominant, single key, deep cyan shadows)
- CYAN-STRIP WASH (cool cyan light from horizontal LED strips, low-key)
- BLOOD-RED SIGNAGE GLOW (deep red overhead key from massive red sign)
- COOL-BLUE HOLO-PROJECTION (UV-blue glow from a hologram dominant, ghostly)
- AMBER SODIUM STREETLAMP (warm amber from a singular streetlamp, noir register)
- STROBING KANJI (multiple competing colors, animated, chaotic)
- TV-STATIC-BLUE (cool blue from a giant building-face screen wash)
- AKIRA-EXPLOSION-YELLOW (bright yellow-white from distant explosion / energy)
- BLADE-RUNNER PINK + CYAN MIX (the iconic dual-key pink top + cyan bottom)
- MAGENTA-AND-CYAN DUAL-KEY (warm magenta from one side, cool cyan from other)
- DRONE-SPOTLIGHT WHITE (harsh white from a hovering drone above the subject)
- HOSTESS-CLUB PINK BLOOM (saturated pink dominant from facade ahead)
- INDIGO-AND-MAGENTA HAZE (deep indigo upper, magenta lower, hazed)
- ARC-WELD BLUE-WHITE (intense cyan-white from a sparking welder / cyber-tool)
- HOLOGRAPHIC RAINBOW SPILL (multicolor scatter from a malfunctioning hologram)

DO write:
- Hot-pink neon as dominant top-key from overhead sign, deep cyan-blue shadows underneath, classic Blade-Runner contrast
- Cool cyan from a horizontal LED-strip wash bathes the scene low-key, casts long pink reflection in puddles
- Blood-red signage glow as overhead dominant from massive hostess-club sign, casts dramatic shadow downward
- Warm amber from a single sodium streetlamp acts as noir-key, deep magenta shadow opposite
- Iconic Blade-Runner dual-key — pink top from billboard above, cyan bottom from street-LEDs below, dramatic split

DO NOT write:
- Warm-golden / sunny / pastoral lighting (must be neon-coded)
- Multiple key sources (designate ONE dominant key direction)
- Time-of-day (separate axis)
- Lights without color (every entry names a neon color)
- Photoreal camera specs (no f-stops / mm)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
