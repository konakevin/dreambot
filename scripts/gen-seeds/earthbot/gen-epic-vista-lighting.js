#!/usr/bin/env node
/**
 * EarthBot epic-vista — LIGHTING axis (R4 stacked-drama rewrite, 2026-05-20).
 *
 * Each entry stacks 2-3 PURE light dimensions per the gallery-print legacy
 * format: time-of-day + light DIRECTION + COLOR + SHADOW DRAMA (and peak-
 * moment intensity). No volumetric language, no haze, no godrays, no mist
 * here — those belong to the atmosphere axis. When atmosphere rolls
 * particulate, atmospheric beams naturally appear via the air; when
 * atmosphere rolls clear, drama comes from color + shadow + direction.
 *
 * Template's STACKED LIGHT DRAMA mandate demands every render be rendered
 * at the peak moment of the rolled lighting — the lighting axis is the
 * "what kind of light" lever; atmosphere axis is the "what's in the air"
 * lever. Clean axis split.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_lighting.json',
  total: 150,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING entries for EarthBot epic-vista — gallery-print fine-art landscape (Marc Adamus / Peter Lik / Max Rive / Iurie Belegurschi caliber). Each entry STACKS 2-3 pure light dimensions at peak dramatic moment.

━━━ THE BAR ━━━

These entries describe the LIGHT only — its time-of-day, direction, color, and the shadow drama it creates. Each entry must be theatrical and dramatic — the peak moment of the light category, not the generic version. Stack drama densely (legacy gen-script style) but stay strictly on the LIGHT dimensions.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 20-30 words. Stack 2-3 of these:
- TIME-OF-DAY (golden hour / pre-dawn blue hour / midnight sun / alpenglow at peak / midday Arctic clarity / blue hour twilight / storm-break / etc.)
- LIGHT DIRECTION (raking from low east / overhead / backlit / side-light / behind-camera / spotlit-shaft through cloud-tear / etc.)
- COLOR temperature + saturation (warm amber-gold / rose-copper / cool cobalt-indigo / pearl-grey / rose-pink / charcoal-purple / etc.)
- SHADOW drama (long-raking shadows / deep crimson shadow pools / charcoal slot-shadows / pearl no-shadow diffuse / sharp hard-edged shadows / etc.)
- PEAK intensity moment (the precise 90 seconds when X is at its absolute brightest / the 30 seconds when Y is wide open)

━━━ ABSOLUTELY FORBIDDEN IN THIS POOL ━━━

The atmosphere axis owns these — DO NOT include them in lighting entries:
- NO fog / mist / haze / spray descriptors
- NO godrays / volumetric beams / atmospheric shafts (these EMERGE naturally when atmosphere rolls particulate — they don't get authored into the light entry)
- NO crepuscular rays / sun-beams-through-clouds (these are phenomenon axis)
- NO dust / pollen / particulate / mist-drift
- NO weather descriptors (rain, snow, etc. — atmosphere axis)

This entry is PURE LIGHT — the time, direction, color, and shadow it produces. Stacking these gives the drama; the atmosphere rolled separately will determine whether the air is crisp-clear or particulate.

━━━ EXAMPLES (legacy gallery-print stacking density, axis-clean) ━━━

✓ "Golden hour rake from low east, warm amber side-light slashing across cliff face, deep crimson shadow pooling in slot fractures, distance ridges glowing rose-gold against indigo zenith"
✓ "Pre-dawn blue hour at deepest indigo, sky bleeding cobalt to violet at zenith, the precise minute when the first rose-copper seam ignites along the eastern horizon, peaks emerging silhouette-dark"
✓ "Midnight sun under Arctic clarity, low horizontal light at eleven-pm raking ice-cyan across crevasse fields, hour-long shadows trailing electric-blue across the white"
✓ "Storm-break spotlight — sun blasting wide-open through ragged cloud-tear, valley spotlit gold like stage-light, surrounding ridges sunk in cool storm-shadow purple-grey"
✓ "Alpenglow at the 90-second peak chromatic moment — summit faces burning rose-pink against indigo eastern sky, snow holding the warm glow while valley below already pools violet"
✓ "Late-afternoon backlight, sun low behind central peaks, ridge silhouettes rimmed in molten copper, foreground in warm reflected fill against cool overhead cobalt"
✓ "Harsh tropical midday sun directly overhead, sharp short shadows, water blazing turquoise-white, every color pushed to maximum saturation"
✓ "Twilight after sunset — sun below horizon, sky peach-magenta gradient at zenith bleeding through coral to violet, peaks softly lit by reflected sky-glow"
✓ "Sunrise rake from due east, the precise minute the disc clears the horizon, warm copper-amber light hitting the cliff face like a spotlight, hard charcoal shadows in every crevice"
✓ "Blood-red desert sunset, sun a deep crimson disc low in saturated tangerine sky, sandstone walls glowing oxide-red, ridge shadows stretched impossibly long"
✓ "Polar twilight extended hour — sky deep indigo at zenith bleeding rose at horizon for forty unbroken minutes, snow holding cool blue-violet glow"
✓ "Storm-cell underlight — anvil cloud belly glowing rose-magenta from setting sun behind, lower atmosphere already in shadow, lightning-edge violet"

✗ BAD — includes atmosphere: "Golden hour rake through dense fog" (fog is atmosphere)
✗ BAD — includes godrays/volumetrics: "Sunset with godrays piercing cloud tear" (volumetrics are atmosphere-emergent)
✗ BAD — includes phenomena: "Light with rainbow visible" (phenomena are their own axis)
✗ BAD — generic / single-dimension: "Golden hour" (must stack 2-3 dimensions)

━━━ CATEGORY DISTRIBUTION (across ${n} entries — strong variance) ━━━

- ~22% Golden hour stacked drama (dawn rake / sunset rake / sunset back-light / sunrise spotlight) — peak chromatic with stacked shadow
- ~15% Blue hour / twilight (pre-dawn / post-sunset / polar extended twilight) — deep cobalt/indigo stacked color
- ~15% Alpenglow / mountain rim-light — rose-pink summit + indigo east, classic stacked alpenglow
- ~15% Storm-break / spotlight / dramatic light-tear — sun blasting through cloud-tear, valley spotlit
- ~10% Midnight sun / Arctic midday clarity — low horizontal polar light with extended shadows
- ~8% Midday harsh sun / tropical noon — sharp short shadows, saturated color blaze
- ~8% Storm-cell underlight / sunset-lit anvil — clouds glowing from beneath
- ~7% Sunset-blood / volcanic-haze sunset — crimson disc, oxide-red glow

━━━ HARD BANS (one more time) ━━━

- NO atmosphere-axis language (fog / mist / haze / spray / particulate)
- NO phenomenon-axis language (rainbows / sun-pillars / sun-dogs / aurora / halos)
- NO single-dimension generic ("golden hour") — must stack
- NO sci-fi / fantasy / magical / mystical descriptors
- NO weather descriptors (rain / snow / storm conditions)

━━━ OUTPUT ━━━

JSON array of ${n} strings. Pure light dimensions stacked at peak drama. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
