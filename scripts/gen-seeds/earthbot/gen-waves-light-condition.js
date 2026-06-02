#!/usr/bin/env node
/**
 * EarthBot waves — LIGHT CONDITION axis.
 *
 * Time-of-day / light tone for the wave scene. NO beam language.
 *
 * R0 = 30.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/waves_light_condition.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHT CONDITION entries for EarthBot waves. Each entry describes ONE time-of-day / light condition for the wave scene.

━━━ ABSOLUTELY BANNED ━━━

- Single beam / single shaft / single column of light (laser-beam trigger — use "shafts plural" / "broad spotlight")
- "Cathedral-scale godray"
- Specific wave content (wave_subject axis)
- Sky details (sky_layer axis)
- Coastal context
- Architecture / humans
- Sci-fi / fantasy

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ LIGHT CONDITION TYPES ━━━

GOLDEN HOUR / SUNSET:
- Warm golden-hour sunset light raking horizontally across the scene
- Last-light sunset glow warming the wave-crest in copper-rose
- Late-afternoon raking sidelight from low sun

STORM-BREAK:
- Storm-break spotlight, sun blasting through a cloud-tear lighting the wave gold
- Backlit storm-light with the wave silhouetted against bright rim-light
- Broad spotlight breaking through overcast hitting the wave in dramatic isolation

DAWN / FIRST-LIGHT:
- Dawn first-light skimming the wave-crest in warm copper-amber
- First-light raking horizontally across the cresting wave

BLUE HOUR / TWILIGHT:
- Pre-dawn blue-hour cool indigo wash across the scene
- Post-sunset twilight cool tones across the wave

MIDDAY:
- High-noon brilliant direct sun with crystal-clear tropical air
- Midday bright tropical light flooding the entire scene
- Bright tropical noon-light hitting the cresting wave

CLOUD-BREAK / SCATTERED:
- Sunset god-rays plural fanning through scattered cloud-gaps illuminating the wave
- Crepuscular rays plural through cloud-gaps catching the spray

BACKLIT:
- Strong backlight from low sun making the wave-tube glow translucent
- Sun behind the wave creating glow-through translucent jade water

━━━ EXAMPLES ━━━

✓ "Warm golden-hour sunset light raking horizontally across the scene, copper-amber tones throughout"

✓ "Storm-break spotlight, sun blasting through a cloud-tear lighting the wave gold against dark surroundings"

✓ "Backlit storm-light with the wave silhouetted against bright rim-light burning along every spray edge"

✓ "Dawn first-light skimming the wave-crest in warm copper-amber"

✓ "Pre-dawn blue-hour cool indigo wash across the entire scene"

✓ "High-noon brilliant direct sun with crystal-clear tropical air, tack-sharp visibility throughout"

✓ "Sunset god-rays plural fanning through scattered cloud-gaps illuminating the cresting wave"

✓ "Strong backlight from low sun making the wave-tube glow translucent jade"

✓ "Last-light sunset glow warming the wave-crest in copper-rose"

✓ "Crepuscular rays plural through cloud-gaps catching the spray in golden sparkle"

✗ BAD — single beam: "Single sunbeam piercing through cloud onto the wave" (BANNED — use "shafts plural")
✗ BAD — specific subject: "Light on the 40-foot wave" (BANNED — wave_subject axis)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE light condition per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
