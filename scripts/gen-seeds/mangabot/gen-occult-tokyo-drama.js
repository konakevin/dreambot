#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} OCCULT-TOKYO DRAMA entries — 50%-gated supernatural events at the scene, NEVER positioning character back-to-camera.

Each 12-20 words. Event + occult aesthetic + frame placement.

⚠️ DRAMA fires 50% of the time. Must be EVENT-LIKE (visible supernatural happening) NOT mood-only. Always JAPANESE occult vocabulary, NEVER western.

VARIETY:
- 18% SIGIL-GLOW-BURST (kanji-sigil flaring pale-cyan at midground / array-of-runes igniting on ground / glyph-burst from outstretched palm)
- 14% SHIKIGAMI-SWIRL (paper-shikigami swirling around character mid-deployment / origami-spirits forming spiral / paper-doll army manifesting)
- 12% CURSED-ENERGY-BURST (cursed-aura erupting in three-quarter visible behind character / energy-coil wrapping arm visible / dark-aura halo manifesting)
- 10% DOMAIN-EXPANSION (translucent dome of cursed-space forming around character / reality-warp visible at edges / domain-walls of sigil-glyphs)
- 10% SPIRIT-MANIFEST (yokai partially visible at midground emerging / kitsune-fox-spirit forming from mist / oni-silhouette in deep background with eye-glow)
- 8% OFUDA-CASCADE (rain of ofuda strips fluttering down around character / talisman-storm in mid-air / charms exploding outward in arc)
- 6% TORII-GATE-RESONANCE (torii-gate behind character glowing with sigil-pulse / shrine-rope vibrating with light / temple-bell tolling in air visibly)
- 6% PAPER-LANTERN-FLARE (paper-chochin igniting with cursed-flame at midground / lantern-row flaring in sequence / candle-flame turning cursed-color)
- 6% CURSED-RAIN (red-rain falling at midground / black-tear-rain / ash-cinders falling with sigil-glow)
- 4% MIRROR-REFLECTION-WRONG (mirror at midground showing wrong-reflection / window-glass revealing spirit / phone-screen showing cursed-presence)
- 4% TIME-FREEZE-EFFECT (clock-faces stopped visible at midground / falling-objects suspended mid-air / fluorescent-light frozen mid-flicker)
- 2% ANIME-BLOOD-MOON (blood-moon cracking through cloud at deep distance / cursed-eclipse-shadow over Tokyo / aurora-cursed-light)

DO write:
- Kanji-sigil flaring pale-cyan at midground beside her, glyph-array igniting on ground
- Paper-shikigami swirling around her mid-deployment, origami-cranes forming spiral
- Cursed-aura erupting in three-quarter visible behind her, dark-energy halo manifesting
- Translucent dome of cursed-space forming around him, reality-warp visible at edges
- Yokai partially visible at midground emerging from shadow, kitsune-fox-spirit forming
- Rain of ofuda strips fluttering down around her, talisman-storm in mid-air

DO NOT: drama positioning her back-to-camera. Drama she's FACING AWAY to admire. Gore. Photoreal. Western occult (no pentagrams / no demonic-circles).

Drama enhances occult-Tokyo atmosphere. Character is ENGAGED inside it, NOT staring at it from afar.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
