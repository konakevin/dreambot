#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE SURPRISE-ELEMENT entries — everyday secondary subjects at midground/background.

Each entry: 10-18 words. Element + placement + everyday-Tokyo world implication.

VARIETY:
- 16% URBAN-DETAIL (vending-machine glow at edge / scrolling LED-sign / pachinko parlor neon / convenience-store light)
- 14% PET/ANIMAL (cat watching from shop windowsill / dog under cafe-table / sparrow on rail / koi in pond)
- 12% PEOPLE-DETAIL (commuter silhouette through window / barista in deep midground / blurred passers-by / kid running past)
- 10% NATURE-DETAIL (potted plant on windowsill / single rose in vase / leaf drifting past / fern in corner)
- 10% FOOD-PROP (teapot steaming on table / bento-box at counter / parfait at midground / yakisoba on grill)
- 8% TRANSIT (bicycle leaning on wall / parked scooter / train passing midground / taxi at curb)
- 8% TEXTURE-DETAIL (rain-streaks on window / steam on glass / dust-motes in light / smoke from incense)
- 6% TECHNOLOGY (TV showing show in background / radio on shelf / old-clock on wall / digital-display)
- 6% SHRINE/CULTURAL (small ema-board hanging / paper-talisman charm / shrine-bell catching light)
- 4% MUSIC (record-player at midground / acoustic-guitar on wall / wind-chime catching breeze)
- 4% SEASONAL (cherry-petal cluster drifting / autumn-leaf in scene / first-snowfall drift / summer-mosquito-coil)

DO write:
- Vending-machine glowing pink-cyan at edge of frame, drink-bottles visible in close midground
- Black cat watching from shop windowsill in deep midground, green-glow eyes catching streetlight
- Commuter silhouette through window blur in deep midground, train-light pulsing
- Potted plant on windowsill at midground, leaves catching afternoon sun-shaft
- Teapot steaming on table beside her at midground, steam curl rising

DO NOT: foreground competing with hero / "distant vista" / multiple per entry.

Everyday Tokyo/Japan implied. NEVER stealing focus.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
