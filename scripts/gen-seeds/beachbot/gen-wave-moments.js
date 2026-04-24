#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/wave_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} WAVE MOMENT descriptions for BeachBot's wave path — Clark-Little-inspired wave photography. Unusual perspectives + rich backdrops.

Each entry: 15-30 words. One specific wave perspective/moment.

━━━ CATEGORIES ━━━
- Inside-the-tube cylinder view at sunset
- Close-up wave-crest spraying with backlit spray
- Through-the-curtain water-curtain view
- Water-level perspective of breaking wave
- Half-underwater split-view at surf-break
- Behind-the-wave looking at sky
- Crest-curl mid-pitch dramatic
- Wave barrel at dawn with golden-light
- Monster-wave with rainbow through spray
- Crashing-wave aftermath-foam pattern
- Tube-view looking out toward sunset
- Close wave-top catching last-sunlight
- Barrel in storm-weather dark-sky
- Wave with volcanic-rocks in foreground
- Wave from underneath looking up
- Pipeline-style tube with light at end
- Wave with massive rainbow from spray
- Wave backlit by golden-hour sun
- Wave under full moon silver
- Wave close-up with reef visible through
- Wave at Mavericks monster-swell
- Wave at Banzai-Pipeline
- Wave at Teahupo'o heavy-lip
- Wave at Nazaré huge monster
- Wave at Jaws mid-barrel
- Wave at Cortes-Bank big-swell
- Wave at Shipstern's-Bluff ledge
- Wave at Mullaghmore cold Atlantic
- Splash explosion mid-crash
- Rogue-wave towering over boat
- Spilling wave at summer-sunset
- Plunging wave with sun-ray through
- Surging wave along pier
- Tsunami-style huge wave approaching (dramatic but not scary)
- Storm-surge with white-caps to horizon
- Shore-break heavy-crash at dawn
- Reef-break wave with visible reef
- Gentle-glass wave at morning
- Crystal-clear close-wave water
- Wave with sand-swirl under

━━━ RULES ━━━
- Wave is subject — unusual perspective
- Clark-Little inspired
- Rich atmospheric backdrop

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
