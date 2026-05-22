#!/usr/bin/env node
/**
 * EarthBot beach-night — PHENOMENON axis (conditional 30%-gated).
 *
 * Rare optical / sky event woven naturally — shooting star, moonbow,
 * distant lightning over the horizon, meteor, sun pillar.
 *
 * R0 = 25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_phenomenon.json',
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} RARE NIGHT PHENOMENON entries for EarthBot beach-night. Each entry describes ONE rare natural sky event woven into the tropical beach night scene. 30%-gated conditional axis — fires on minority of renders.

━━━ ABSOLUTELY BANNED ━━━

- "Bioluminescent waves" (sci-fi)
- "Single beam" / "single shaft" / "single column of light"
- "Bonfire" / "tiki" / "lantern" (human-built)
- Sci-fi / fantasy / portal-events
- Daytime phenomena (sun-pillar at noon, etc — must be night-compatible)
- Multiple phenomena per entry (ONE only)

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-22 words each.

━━━ PHENOMENON TYPES ━━━

SHOOTING STAR / METEOR:
- A bright shooting star streaks across the upper sky
- A meteor trail crossing the upper night sky in a brief bright streak
- A streak from a passing meteor visible against the dark night sky

DISTANT LIGHTNING:
- Distant lightning flickering at the deep horizon, faint flash illuminating clouds at the edge
- A distant lightning fork on the deep horizon, faint silver-white flash

LUNAR PHENOMENA:
- A lunar halo ring visible around the moon
- A faint moonbow arc over the distant tropical horizon
- A lunar corona visible around the moon

AURORAL / OPTICAL:
- A faint aurora-like glow at the deep distance horizon

PASSING CELESTIAL:
- A satellite track crossing the night sky
- The ISS visible as a moving bright point of light traversing the sky
- A cluster of meteors during a meteor shower streaking across the upper sky

━━━ EXAMPLES ━━━

✓ "A bright shooting star streaks across the upper night sky"

✓ "Distant lightning flickering at the deep horizon, faint silver flash illuminating clouds at the edge"

✓ "A lunar halo ring visible faintly around the moon"

✓ "A faint moonbow arc visible over the distant tropical horizon"

✓ "A meteor trail crossing the upper night sky in a brief bright streak"

✓ "A satellite track visible crossing the sky in a slow moving point of light"

✓ "A cluster of meteors during a meteor shower streaking across the upper sky"

✓ "A lunar corona visible around the moon in soft cool halo"

✗ BAD — bioluminescent: "Bioluminescent waves below" (BANNED)
✗ BAD — single beam: "Single lightning beam piercing the sky" (BANNED)
✗ BAD — daytime: "Sun-pillar rising vertical" (BANNED — beach-night is fully night)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE night-compatible phenomenon. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
