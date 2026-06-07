#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot unexpected-places renders. Each entry is one specific framing — tuned for venue-context scenes (greenhouse / library / train / amusement-park / aquarium / rooftop-garden).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 INTIMATE EYE-LEVEL (food filling 60% of frame, venue blurred behind)
- 4 OFF-CENTER RULE-OF-THIRDS (food in left/right third, venue breathing on opposite side)
- 4 OVERHEAD / TOP-DOWN (looking down on the food on its surface)
- 4 THREE-QUARTER LEAN (slight tilt revealing depth + venue context)
- 4 LOW HERO-UP (looking up at the food, venue ceiling/sky/awning above)
- 5 WIDE VENUE-FRAMING (showing food in full venue context — bookshelves / glass-paneled walls / aquarium tank / etc.)

━━━ EXAMPLES ━━━

"Intimate eye-level portrait, food filling sixty percent of frame, venue softly blurred behind"
"Off-center composition with food in left third, venue context breathing on the right"
"Overhead top-down framing, food centered on the venue surface, props radiating outward"
"Three-quarter lean revealing depth and venue setting behind the subject"
"Low hero-up angle gazing upward at the food, venue ceiling or canopy above"
"Wide venue framing showing food and full venue context in soft focus"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
