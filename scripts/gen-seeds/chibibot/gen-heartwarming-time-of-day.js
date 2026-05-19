#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/heartwarming_time_of_day.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot — short cinematic time/light descriptors that fix WHEN a heartwarming creature scene takes place. The scene's emotional temperature comes from this axis.

Each entry: 8-15 words. ONE time-of-day moment with its signature color/light quality. Concrete sensory anchors that Flux can render directly.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Concrete time anchor (dawn, blue hour, golden hour, dusk, candlelit night, predawn, lunch-hour noon, indigo twilight, etc.)
- Signature color cast (pink, gold, lavender, peach, indigo, silver, amber, cornflower)
- ONE specific light-quality detail (low-angle sun, long shadows, room glowing warm, last light, dewdrop sparkles, ground-fog at knee-height, dust motes catching)
- Reads as a moment, not a generic time

━━━ DISTRIBUTION ━━━
Cover the FULL day-night cycle. Aim for roughly:
- 20% bright/midday (high sun, lunch hour, peak afternoon glow, clear-blue sky overhead)
- 15% golden-hour (the warm one) — sunset, late afternoon, long shadows
- 15% blue-hour (twilight before dawn or after sunset) — indigo, lavender, cool dusk
- 10% dawn (predawn pearl-grey, first-pink horizon, dewy morning light)
- 15% candlelit / lamplit night (warm interior light at night, fireflies, hearth)
- 10% moonlit night (silvery-blue, cool soft moonlight, moon-shadows)
- 10% overcast / soft-grey daylight (cloud-diffused, even soft light)
- 5% magical/uncanny time (aurora-lit, eclipse-soft, between-moments)

━━━ HARD BANS ━━━
- NO weather (separate axis — no "rainy" / "snowy" / "stormy")
- NO setting language (no "in the forest" / "at the cottage")
- NO creatures or activity
- NO repeated openers ("golden hour at..." 10× is a failure)

━━━ DEDUP ━━━
Dedup by: time-of-day + color cast + light-quality detail. "dawn with pink sky" and "first pink dawn light over the horizon" are duplicates.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
