#!/usr/bin/env node
/**
 * YumBot DREAM_CAMERA top-up (Stage 2 backfill 2026-06-05).
 *
 * Camera compositions for the rainbow-dreamscape path — wider scenic
 * shots showing the kawaii cups IN the pastel landscape (mountains,
 * meadow, rainbow sky). Existing 56 entries cycle through mid-wide,
 * wide-vista, low-angle, 3/4 over-meadow, mid-distance, high-vantage,
 * dutch-tilt. Topping up toward 200 with additional vantage variety
 * while preserving the wider-scenic mandate.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_camera.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMERA COMPOSITION descriptors for YumBot rainbow-dreamscape. Wider scenic shots showing the kawaii cups IN the pastel-dreamscape landscape (rolling meadows, soft mountains, rainbow sky).

Each entry: 12-22 words. ONE camera composition.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━

"mid-wide eye-level shot showing the kawaii cups nestled in the meadow with mountains behind"
"wide-vista shot of the entire pastel-landscape with kawaii cups as inhabitants below"
"low-angle from cup-level looking up at the rainbow sky and tall meadow grass"
"3/4 angle over the meadow looking down toward the kawaii cups and distant mountains"
"high-vantage looking down across the meadow showing scattered kawaii cup-inhabitants"

━━━ VARIETY MANDATE — distribute across ${n} entries ━━━

- ~22% MID-WIDE EYE-LEVEL (kawaii cups nestled in meadow with landscape framing, mountains behind)
- ~18% WIDE-VISTA / ESTABLISHING (the entire pastel-landscape with kawaii cups as inhabitants, broader scenic feel)
- ~12% LOW-ANGLE LOOK-UP (from cup-level looking up at rainbow sky / clouds / overhead canopy)
- ~12% 3/4 OVER-MEADOW (3/4 angle over meadow looking down toward cups + distant features)
- ~10% MID-DISTANCE / MIDDLE-GROUND (kawaii cups in middle-ground with landscape framing front-and-back)
- ~8% HIGH-VANTAGE / OVERHEAD-DOWN (high-vantage looking down across meadow at scattered cup-inhabitants)
- ~6% TRACKING-LATERAL (lateral camera-tracking past the cups with the landscape rolling behind)
- ~5% CHEST-LEVEL EYE-LEVEL with shallow depth (kawaii cups in mid-ground crisp, mountains soft behind)
- ~3% DUTCH-TILT-PASTEL (subtle playful pastel dutch-tilt composition)
- ~2% RIM-OF-MEADOW WIDE-ANGLE (camera at meadow edge, kawaii cups gathered in the middle distance)
- ~2% TREETOP-CANOPY-FRAMED (cups visible through soft pastel-tree-canopy frame in the foreground)

━━━ HARD MANDATES ━━━

- Wider scenic feel (NOT tight close-up).
- BOTH the landscape AND the kawaii cups visible.
- The kawaii cups read as inhabitants WITHIN a landscape, not isolated subjects.
- Use specific spatial language ("nestled in", "scattered across", "gathered at", "rising behind").

━━━ HARD BANS ━━━

- NO tight close-ups of a single cup.
- NO tabletop / flat-lay / overhead-product angles.
- NO portrait crops.
- NO photographer-name drops / lens-spec / aperture-f-stop / shutter-speed.
- NO repeating an angle word-for-word across entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
