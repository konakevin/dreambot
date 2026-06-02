#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_surprise_elements.json',
  total: 150,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot bath-time scenes — tiny secondary subjects or ambient details the eye finds AFTER the hero creature(s). The hero creature is the main subject; the surprise element is the second-tier detail that proves there's a bigger world.

Each entry: 12-25 words. ONE specific surprise element with concrete visual detail.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Reads as a secondary detail (hiding in a corner, peeking through, drifting past, background)
- Specific, picture-able, distinct from any creature/amenity pool entry
- Adds story or scale (proves the bigger world exists, gives the eye something to discover after the hero)
- Adorable / wholesome / curious — NEVER threatening

━━━ CATEGORY DISTRIBUTION ━━━
- 25% tiny background creature (mouse-family peeking from a wall hole / butterfly drying its wings on the windowsill / hummingbird sipping from the soap bubble / shy snail leaving a glitter trail / dragonfly hovering above the suds / firefly resting on a candle rim)
- 20% steam + bubble drift (rainbow-hued soap bubble drifting upward / lone bubble caught in sunlight / steam swirl shaped like a heart / dewdrop sliding down the mirror / single sud-bubble at edge of frame)
- 15% domestic-detail (open storybook on the bathroom floor / teacup of mint tea on the rim / forgotten slipper / bath-stopper on a chain / steamed-up mirror with finger-drawn smiley / open jar of bath salts)
- 15% nature-detail (curled fern in the corner / tiny moss patch on the tub edge / fallen petal floating / dew on the windowsill / climbing vine through the open window / acorn on a shelf)
- 10% atmospheric drift (steam curl rising / single feather floating / candle smoke ribbon / hair-flower drifting on the water / leaf carried by a draft)
- 10% magical ambient (tiny will-o-wisp peeking around the candle / sparkles caught in the steam / floating wishing-star / glow-spell hovering / fairy dust falling)
- 5% travel/transient (paper boat sailing across the basin / tiny letter folded on the windowsill / message-in-a-bottle on the shelf / hot-air-balloon visible through the window)

━━━ HARD BANS ━━━
- NO hero creatures
- NO activity verbs that imply main subject
- NO setting language (no "in the bathroom" / "at the spring")
- NO time/weather
- NO threatening / sad / lost-creature undertones

━━━ DEDUP ━━━
Dedup by: element type + concrete detail. "rainbow soap bubble drifting" and "single bubble drifting upward" are duplicates.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
