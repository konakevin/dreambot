#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_time_of_night.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-NIGHT phrases for ChibiBot night-meadow — short cinematic NIGHTTIME-light descriptors that fix WHEN-AT-NIGHT this meadow scene takes place. Path is LOCKED to night/twilight, never midday. The mood comes from this axis — the moon phase, sky color, ambient luminance.

Each entry: 8-15 words. ONE specific NIGHTTIME / TWILIGHT moment with its signature sky color + ambient light quality. Concrete sensory anchors that Flux can render directly.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Concrete nighttime anchor (deep-night / blue-hour-twilight / new-moon-darkness / full-moon-bright / pre-dawn / late-twilight / civil-twilight / nautical-twilight / astronomical-night / golden-magic-hour-after-sunset)
- Signature sky color (indigo / violet / cobalt / midnight-blue / silver-blue / purple-black / inky / starlit-with-pale-pink-horizon / pre-dawn-grey-blue)
- ONE specific moon-or-sky detail (full moon impossibly large on the horizon / crescent moon hooked in the sky / Milky Way visible band / new-moon darkness with bright stars / first-quarter-moon / blood-moon red / aurora dancing / pre-dawn star fade)

━━━ DISTRIBUTION ━━━

Cover the full nighttime spectrum (NO daytime). Aim for roughly:
- 15% blue-hour / civil-twilight (just-after-sunset, sky still lit purple-orange)
- 15% deep-twilight (sky dark blue, first stars visible, moon emerging)
- 25% full-night with full-moon (moon impossibly large, silver-lit landscape)
- 15% deep-night with crescent / new-moon (mostly starlight, Milky Way visible)
- 10% pre-dawn (first hint of pink-grey on horizon, last stars fading)
- 10% special-moon (blood-moon / harvest-moon / super-moon / lunar-eclipse-night)
- 10% magical-night (aurora-lit / meteor-shower-streaks / comet-bright / blood-moon)

━━━ HARD BANS ━━━

- NO daytime (this is strictly NIGHT — no sunset-during, no dawn light, no midday)
- NO weather (no "rainy night" / "snowy night")
- NO setting language (no "in the forest" / "over the meadow")
- NO creatures or activity
- NO repeated openers ("full moon overhead..." 10× is a failure)

━━━ DEDUP ━━━

Dedup by: time-of-night + sky color + moon-or-sky detail. "full moon overhead, silver light" and "huge full moon hanging in indigo sky" are duplicates if both are "full-moon + silver lighting".

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
