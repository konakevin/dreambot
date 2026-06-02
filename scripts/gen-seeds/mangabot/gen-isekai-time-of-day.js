#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_time_of_day.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TIME-OF-DAY entries for a MangaBot ANIME ISEKAI keyframe. Pure time register, decoupled from light source.

Each entry: 8-16 words. Names time + anime fantasy sky register.

DISTRIBUTION:
- 20% GOLDEN HOUR (warm anime amber sky, honey light)
- 15% DUSK / TWILIGHT (deep cobalt-violet sky, lanterns igniting)
- 14% MIDDAY CLEAR (clear bright anime sky with fluffy cumulus)
- 12% DAWN MISTY (anime dawn pink-gold with mist rising)
- 10% MOONLIT NIGHT (anime moonlit fantasy night)
- 8% MAGIC-HOUR PINK (anime magical-hour pink-violet sky)
- 7% STARLIT NIGHT (anime starry-sky fantasy night)
- 6% OVERCAST DAY (anime gentle cloudy sky)
- 4% STORM-DRAMATIC (anime storm sky for dramatic moments)
- 4% AURORA-NIGHT (anime aurora curtains for magical scenes)

DO write:
- Golden hour anime warm-amber sky, honey light casting long pastoral shadows
- Dusk-twilight anime cobalt-violet sky with lanterns igniting on fantasy buildings
- Midday clear anime sky with fluffy cumulus and bright saturated blue
- Dawn misty anime pink-and-gold sky with mist rising from fantasy valleys
- Anime moonlit fantasy night with cool moonlight bathing the landscape
- Magic-hour anime pink-violet sky for romantic-isekai moments
- Anime starlit fantasy night with twinkling stars and crescent moon
- Anime gentle overcast day with soft grey sky and no harsh shadows
- Anime storm sky for dramatic isekai moments, dark cloud-bank rolling
- Anime aurora curtains for magical scenes in winter fantasy landscape

DO NOT write:
- Western photoreal sky tech
- Cyberpunk night sky
- Multiple times per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
