#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROMANCE DRAMA entries — 40%-gated tender events around her. Soft visible focal point.

Each 12-20 words. Drama + romantic aesthetic + frame placement.

VARIETY:
- 26% PETAL-CASCADE (sudden petal-storm whirling past at midground / massive cherry-cascade swirling around her / gust-petals lifting from ground / petal-tornado spiraling)
- 18% SUNSET-BURST (sunset breaking through clouds golden-pink / blood-red sunset gradient behind her / first-stars appearing as sky deepens)
- 12% RAIN-START (first-raindrops on cherry-petals catching light / rain-shower in distance / single raindrop on cheek)
- 10% LETTER-ARRIVAL (mailman in deep distance approaching / wind-blown letter flying past / love-note falling from above)
- 8% MUSIC-FROM-AFAR (faint piano in deep distance / music-box sound at edge / harmonica-note carrying)
- 8% FIRST-SNOWFALL-CHERRY (mixed-snow-and-petals descending / late-snow with cherry-blooming-anyway / unusual snow-on-sakura)
- 6% LANTERN-LIGHT-UP (festival-lanterns flickering on overhead in deep midground / lantern-string lighting at dusk)
- 6% FIREFLY-EMERGENCE (first-firefly cluster appearing at midground / firefly-dance near cherry-tree / fireflies in deep distance)
- 4% RAINBOW (rainbow-arc forming overhead after passing-rain / petal-rainbow in saturated colors / pastel-arc at deep distance)
- 2% PHOTOGRAPH-WIND (Polaroid lifted by wind past her / photo-album fluttering pages / film-strip catching breeze)

DO write:
- Sudden cherry-petal storm whirling past her at midground, hundreds of petals catching golden-pink light
- Sunset breaking through cloud-veil with golden-pink rays touching her shoulders
- First-raindrops on cherry-petals at midground beside her, single drop catching her cheek
- Mailman in deep distance approaching path, white-glow of envelope in his hand
- Festival-lanterns flickering on overhead in deep midground, warm amber pulse

DO NOT: drama positioning her back-to-camera. Drama she's facing-away-to-admire. Combat/dramatic. Photoreal.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
