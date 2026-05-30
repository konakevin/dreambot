#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE DRAMA entries — 40%-gated SUBTLE everyday events. Soft visible focal point, never eclipses character.

Each entry: 12-20 words. Subtle event + slice-of-life aesthetic + frame placement.

VARIETY:
- 20% WEATHER-SHIFT (sudden rain-drops streaking window / sunbeam breaking through clouds / passing-breeze lifting curtains / snowflakes drifting past)
- 16% TIME-OF-DAY-SHIFT (golden-hour light streaming sideways / blue-hour settling outside / late-afternoon shadows lengthening / first morning-light)
- 14% NATURE-SUBTLE (cherry-petal cluster drifting through frame / autumn-leaf cyclone gentle / first-firefly cluster appearing / dandelion-seeds floating)
- 10% URBAN-AMBIENT (train passing midground with light-streak / car-headlights sweeping past / store-sign flickering on)
- 8% PEOPLE-DETAIL (friend appearing at door in doorway / partner mid-greet at far edge / customer entering shop)
- 8% PET-MOMENT (cat-leap onto her shoulder / dog-tail-wag at her feet / bird-landing on rail beside)
- 6% FOOD-MOMENT (kettle whistling on stove / pan sizzling with hot oil / pastry-dough rising / tea-steeping in pot)
- 6% MUSICAL-AMBIENT (record-needle dropping on vinyl / radio fading in / wind-chime tinkling / piano-key tap)
- 6% MEMORY-FRAGMENT (photograph drifting from album / letter-paper unfurling / dust-motes in sun-shaft swirling)
- 6% TECHNOLOGY (phone-vibrating on table / laptop-notification pop / TV-flicker in background)

DO write:
- Sudden rain-drops streaking the window beside her at midground, soft pulse of warmth
- Golden-hour light streaming sideways through window, warm bar across her tea-mug
- Cherry-petal cluster drifting through frame, three petals catching the morning light
- Train passing in midground beyond the cafe-window, light-streak briefly illuminating
- Cat-leap onto her shoulder mid-action, paws light, warm gold-eyed look at viewer

DO NOT: dramatic-magical / combat / sparkle-stack (kawaii territory). Drama positioning her back-to-camera. Photoreal CGI.

Drama is QUIET + atmospheric. Never overwhelms.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
