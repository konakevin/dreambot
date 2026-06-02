#!/usr/bin/env node
/**
 * EarthBot beach-night — NIGHT SKY axis.
 *
 * Sky behavior + atmosphere at night. Cloud / star-density / sky-tone
 * details. Light_source is separate (moon / Milky Way is the hero
 * there); this axis describes the SUPPORTING sky context.
 *
 * R0 = 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_sky.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} NIGHT SKY entries for EarthBot beach-night. Each entry describes ONE night-sky condition (the SUPPORTING context to the primary light_source). NOT the light source itself — the sky around / behind it. Star density, cloud presence, sky tone gradient, faint horizon glow.

━━━ THE BAR — NIGHT SKY AS SUPPORTING CONTEXT ━━━

The light_source axis names the moon/Milky-Way HERO. This axis describes the rest of the sky: scattered clouds, dense stars between, deep sky color gradients, faint horizon residual glow.

━━━ ABSOLUTELY BANNED ━━━

- Subject content (no "tropical beach below" — subject axis)
- Light source words (no "bright moon" / "Milky Way" — light_source axis)
- Water details
- Shoreline elements
- Humans
- Architecture / tiki / lanterns
- Sci-fi / fantasy / glow-magic
- Bioluminescent / phosphorescent
- Daylight / sunset / sunrise

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-24 words each.

━━━ NIGHT SKY TYPES ━━━

CLEAR SKIES:
- A clear cobalt-black night sky packed with bright stars edge to edge
- Pristine clear black night sky with countless small bright stars
- Deep midnight-blue clear sky with constellation-clear stars

SCATTERED CLOUDS:
- Scattered tropical cumulus drifting low across the dark sky
- A few high cirrus streaks across the deep night sky
- Tropical cumulus scattered across the upper frame, dark in profile against starry sky between
- A few drifting clouds with stars visible in the clear breaks between

DEEP NIGHT TONES:
- Deep indigo night sky overhead, fading to faint horizon residual glow at the edge
- Pure midnight black with faint deep-cobalt gradient at the horizon
- Velvet black-cobalt night sky, smooth tone gradient overhead

TWILIGHT TRANSITIONS:
- Deep twilight residual glow at the horizon, dark cobalt above transitioning into stars
- Faint blue-band twilight at the horizon edge, deep night above with stars

CLOUDS-AROUND-MOON:
- Scattered cumulus drifting around the moon position, halo-ring around moon visible
- Wispy cirrus passing across the upper sky, faint moonlit cloud edges visible

━━━ EXAMPLES ━━━

✓ "A clear cobalt-black night sky packed with bright stars edge to edge, deep night tone"

✓ "Scattered tropical cumulus drifting low across the dark sky, stars visible in the clear breaks between"

✓ "Pristine clear black night sky with countless small bright stars, no clouds anywhere"

✓ "Deep indigo night sky overhead, fading to faint cobalt residual glow at the horizon edge"

✓ "A few high cirrus streaks across the deep night sky, stars visible above"

✓ "Tropical cumulus scattered across the upper frame, dark in profile against starry sky between"

✓ "Velvet black-cobalt night sky overhead, smooth tone gradient with a few wispy clouds"

✓ "Scattered cumulus drifting around the moon position, halo-ring around moon visible faintly"

✓ "Faint deep-cobalt twilight residual at the horizon edge, deep midnight black above with constellation stars"

✓ "Wispy cirrus passing across the upper sky, stars visible through the thin cloud cover"

✗ BAD — light source: "Bright moon overhead" (BANNED — light_source axis owns)
✗ BAD — subject: "Sky over tropical beach" (BANNED — generic only)
✗ BAD — daylight: "Sunrise glow on the horizon" (BANNED — fully night)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Night sky supporting context only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
