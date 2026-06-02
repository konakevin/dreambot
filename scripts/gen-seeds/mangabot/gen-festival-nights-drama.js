#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} FESTIVAL-NIGHTS DRAMA entries — 50%-gated matsuri events around the character. Should celebrate matsuri-energy without pulling her back-to-camera. Each 12-20 words. Drama + festival aesthetic + frame placement.

⚠️ CRITICAL: Drama is BEHIND or ABOVE or AT-MIDGROUND, character REMAINS engaged-forward. NEVER drama that pulls her to face-away.

VARIETY:
- 24% FIREWORK-BURST-OVERHEAD (sudden hanabi chrysanthemum-burst high overhead lighting frame golden-pink / cascade-firework dripping willow-style / triple-burst overlapping at midground sky — character NOT facing it, but face lit by it)
- 16% LANTERN-RELEASE (paper-lanterns rising in deep midground sky, dozens at once / single river-lantern floating past / lantern-string-light-up cascading along yatai-row)
- 12% SUDDEN-RAINSHOWER (warm-summer-rain starting on hanabi-sky / first-drops on chochin-lanterns / drizzle starting at midground)
- 10% SHOOTING-STAR (single shooting-star across midground sky above fireworks / meteor-streak distant / first-star appearing as dusk deepens)
- 10% SPARKLER-SHOWER (handful of sparklers lit simultaneously at midground / pyrotechnic-fountain at festival-stage / cascade of sparks from yagura)
- 8% MASK-STORE-REVEAL (mask-vendor pulling cloth-cover off fresh-batch of kitsune-masks at midground / new-stall opening / vendor-revealing-tray)
- 6% MIKOSHI-PASS (portable-shrine being carried past at midground with rope-bearers chanting / festival-parade passing / float-cart rolling by)
- 6% FIRST-LANTERN-LIGHTING (festival-master lighting central yagura-lantern at midground / chochin-string lighting up sequentially / dusk-to-night transition at lantern-light-up)
- 4% PETAL-OR-CONFETTI-CASCADE (festival-confetti showering from above / paper-streamers cascading / paper-fortune flying past)
- 4% TAIKO-DRUMMER-STRIKE (taiko-drummer mid-strike at midground yagura / drum-flash at distance / drummer mid-leap)

DO write:
- Sudden hanabi chrysanthemum-burst high overhead, gold-pink petals of light cascading at midground sky
- Paper-lanterns rising in deep midground sky, dozens at once dotting the night warm-amber
- Warm summer-rain starting on hanabi-sky, first drops glinting on chochin-lanterns
- Shooting-star streaking across midground sky above the festival, single white arc
- Handful of sparklers lit simultaneously at midground by friend-group, sparks raining
- Mask-vendor pulling cloth-cover off fresh batch of kitsune-masks at midground stall
- Mikoshi portable-shrine being carried past at midground with rope-bearers chanting, gold-flash
- Festival-master lighting central yagura-lantern at midground, warm-amber bloom spreading
- Paper-confetti showering from above at midground rooftop, pastel-streamers cascading
- Taiko-drummer mid-strike at midground yagura-tower platform, bachi-stick high in arc

DO NOT: drama that pulls character back-to-camera (no "she turns to watch the fireworks"). Combat/dramatic. Photoreal cinematography. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
