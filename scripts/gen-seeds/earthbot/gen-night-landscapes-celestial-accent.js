#!/usr/bin/env node
/**
 * EarthBot night-landscapes — CELESTIAL_ACCENT axis (30%-gated).
 *
 * ONE optional, real, quiet celestial extra that makes a shot iconic without
 * being forced every render: a meteor, a quiet meteor-shower scatter, a bright
 * planet, the soft zodiacal-light cone. Real astronomy only — never sci-fi.
 * The template drops it if it conflicts with the rolled night sky (e.g. a faint
 * accent is pointless against a bright moon-washed sky).
 *
 * MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/night_landscapes_celestial_accent.json',
  total: 50,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CELESTIAL ACCENT entries for EarthBot's night-landscapes path. Each is ONE quiet, REAL, optional sky detail that adds a signature touch — a meteor, a planet, zodiacal light. Real astronomy only. Subtle — it never overpowers the landscape (the hero) or the night sky.

━━━ AXIS-CLEAN + REAL ━━━

ONLY one small celestial accent. NO landscape, NO general moon/Milky-Way/aurora description (those are other axes — you reference them only lightly if needed). NO sci-fi, NO fantasy, NO multiple suns, NO portal/glow. One real thing, briefly.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

JSON array of STRINGS, each 8-18 words.

━━━ SPAN ━━━

- a single bright meteor threading silently through the stars, a thin clean streak
- a scatter of faint meteor-shower streaks radiating from one point in the sky
- one long meteor burning a brief bright trace across the upper frame
- a brilliant planet hanging steady and bright low near the horizon
- two bright planets in a close pairing above the distant ridge
- the soft pale cone of zodiacal light leaning up from the horizon
- a faint, slow satellite trail drawing a thin line among the fixed stars
- a single shooting star catching the corner of the frame, gone in an instant

━━━ EXAMPLES ━━━

✓ "A single bright meteor threading silently through the stars, a thin clean streak"
✓ "A scatter of faint meteor-shower streaks radiating from one point overhead"
✓ "A brilliant planet hanging steady and bright low above the distant ridge"
✓ "The soft pale cone of zodiacal light leaning up from the horizon"

✗ BAD — sci-fi: "A glowing wormhole tearing open in the sky" (banned)
✗ BAD — overpowering: "The entire sky filled with a meteor storm of hundreds of fireballs" (too much — it's an accent)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. One quiet real accent each. No preamble, no markdown, no keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
