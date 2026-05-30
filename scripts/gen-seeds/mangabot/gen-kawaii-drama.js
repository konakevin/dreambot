#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII DRAMA entries — 30%-gated GENTLE cute events around her. Soft visible focal point, never eclipses her.

Each entry: 12-20 words. Drama + kawaii aesthetic + frame placement.

VARIETY:
- 22% SPARKLE-STORM (heart-shaped sparkle-storm cascading around her / pastel-glitter burst rotating / star-rain at midground / soap-bubble explosion drifting)
- 16% FLORAL-BURST (cherry-petal cyclone whirling past / rose-petal storm at midground / floral-cascade descending / bloom-shower around her)
- 14% MASCOT-MATERIALIZE (mascot-pet popping in next to her in puff of sparkles / cute-spirit emerging from cup-of-tea / floating Sanrio-mascot beside her)
- 12% PASTEL-SKY (pastel sunset gradient with cute clouds behind / rainbow-arc across midground / cotton-candy sky cloud-formation)
- 10% DESSERT-BURST (cake-confetti explosion around her at midground / candy-rain cascading / parfait-tower flying-apart playfully)
- 8% LIGHTNING-CUTE (cute lightning-bolt with heart-shaped stroke / pastel-lightning with sparkle / friendly-thunder cloud)
- 6% RAINBOW-ARC (rainbow-arc forming overhead / rainbow-trail catching the moment / rainbow-burst at deep midground)
- 6% BUBBLE-STORM (soap-bubble storm drifting through frame / iridescent-bubble cascade / bubble-trail spiraling)
- 4% MAGICAL-LITE (mini-magical-burst from her wand / gentle spell-circle at her feet / kawaii-rune-glyph hovering)
- 2% FIREWORK-CUTE (heart-shaped firework bursting in deep distance / cute-hanabi at horizon)

DO write:
- Heart-shaped sparkle-storm cascading around her at midground, three large hearts catching golden-pink
- Cherry-petal cyclone whirling past her shoulders, petals catching golden-hour light
- Sanrio-coded mascot-pet popping in next to her in puff of pastel sparkles, mid-materialize
- Pastel-sunset gradient with cute-cloud cluster behind her, rainbow-arc forming overhead
- Cake-confetti explosion at midground beside her, candy-rain drifting around playfully

DO NOT: drama positioning her back-to-camera. Drama she's facing-away-to-admire. Combat/violence. Photoreal CGI.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
