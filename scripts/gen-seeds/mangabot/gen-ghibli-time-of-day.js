#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_time_of_day.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TIME-OF-DAY entries for a MangaBot ghibli-countryside keyframe. Pure time register, decoupled from light source. WEIGHTED toward dramatic-light times (golden-hour / dusk / dawn / firefly-twilight) — Studio Ghibli's most poster-grade moments live here — but KEEP a strong minority of daylight variety.

Each entry: 8-16 words. Names the time + sky color register + Ghibli atmospheric note.

DISTRIBUTION (drama-amplified but variety-preserving):
- 22% GOLDEN HOUR / LATE AFTERNOON (warm amber-copper sky, honey light, long shadows)
- 15% DUSK / EARLY EVENING (deep cobalt/violet sky, lanterns igniting)
- 13% DAWN / EARLY MORNING WITH MIST (pale pink-gold sky, mist rising)
- 12% MID-MORNING (clear bright sky, gentle warmth, dew evaporating)
- 10% MIDDAY CLEAR (high sun, fluffy cumulus, summer-blue sky)
- 8% FIREFLY-TWILIGHT (deep dusk with stars + fireflies rising)
- 7% OVERCAST DAY (gentle grey sky, soft shadowless)
- 5% MOONLIT NIGHT (rare — pastoral starry sky, mid-soft moonlight)
- 4% PRE-RAIN OVERCAST (heavier grey, before gentle rain)
- 4% FOG-MORNING (white-grey, fog clinging to everything)

DO write:
- Golden hour late afternoon, warm amber-copper sky, honey light casting long pastoral shadows
- Dusk early evening, deep cobalt-violet sky transitioning, cottage lanterns igniting one by one
- Dawn early morning with mist rising from the valley, pale pink-gold sky overhead
- Mid-morning clear sky, gentle warmth, dew still evaporating from the meadow grass
- Midday clear summer, high sun with fluffy cumulus building against deep summer-blue sky
- Firefly twilight, deep dusk sky with first stars appearing and warm-yellow firefly-glow drifting
- Overcast gentle day, soft grey sky with no harsh shadows, even tones across the countryside
- Moonlit summer night, soft moonlight bathing the hills, stars scattered overhead
- Pre-rain overcast, heavier grey pressing down, charged air before the gentle pastoral rain
- Fog-morning, white-grey sky with mist clinging to grass, soft warm pockets where sun struggles through

DO NOT write:
- Cyberpunk skies / neon
- Dramatic apocalyptic (red moons / orb suns)
- Multiple times per entry
- Vague "early" / "late"

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
