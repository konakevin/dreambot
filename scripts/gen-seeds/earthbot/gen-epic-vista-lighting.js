#!/usr/bin/env node
/**
 * EarthBot epic-vista — LIGHTING axis.
 *
 * Each entry = ONE clean signature light condition tuned to wide-panoramic
 * vista compositions. NO stacking ("golden hour AND storm light AND
 * crepuscular rays"). One light condition, described with direction +
 * warmth + shadow quality + atmospheric volumetric where appropriate.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_lighting.json',
  total: 25,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for EarthBot epic-vista — ONE signature light condition per entry, tuned to flatter a wide-panoramic landscape composition.

━━━ THE BAR ━━━

Light is a CHARACTER in the frame, but it's ONE clean light character per render — not a stack of phenomena. Describe direction, warmth, shadow quality, and (only when scene-natural) volumetric quality.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 15-25 words. Describe:
- Time of day (golden hour / blue hour / midday / pre-dawn / alpenglow / midnight sun / storm-break / etc.)
- Light DIRECTION (raking from low east / overhead / backlit / side-light / behind-camera)
- Warmth + color temperature (warm amber / cool cobalt / pearl-grey / rose-pink / etc.)
- Shadow quality (long-raking / short / soft-diffuse / sharp-hard / no-shadow-overcast)
- Volumetric quality (ONLY when scene-natural — e.g. godrays in mist, not godrays through clear desert air)

ONE light condition. NEVER "X AND Y AND Z" stacked. NO weather phenomena in this axis (those belong to phenomenon/sky_layer).

━━━ EXAMPLES ━━━

✓ "Golden hour raking from low east, warm amber side-light, long shadows reaching across the foreground, far ridges glowing rose-gold"
✓ "Pre-dawn blue hour — sky deepening cobalt to indigo zenith, peaks emerging silhouette-dark, no direct sun yet"
✓ "Midnight sun under Arctic clarity, low horizontal light at 11pm, hour-long shadows raking across ice, light cool-white"
✓ "Storm-break afternoon: sun blasting through one ragged tear in cloudbase, valley spotlit gold, surrounding ridges still in cool storm-shadow"
✓ "Alpenglow at sunset: snow summits glowing rose-pink against indigo eastern sky, valley already in violet shadow"
✓ "Overcast soft diffuse light, no shadows, every color rendered at full saturation, atmospheric depth muted"
✓ "Harsh tropical midday sun directly overhead, sharp short shadows, water blazing turquoise-white"
✓ "Twilight after sunset, sun below horizon, sky still glowing peach-magenta at zenith, peaks lit by reflected sky-glow"

✗ BAD — stacks: "Golden hour AND crepuscular rays AND aurora AND alpenglow all at once" (this is the chaos failure mode)
✗ BAD — adds phenomena: "Light with rainbow and sun-pillar" (phenomena go in phenomenon axis)
✗ BAD — adds weather: "Stormy lightning-lit sky" (weather goes in sky_layer)

━━━ CATEGORY DISTRIBUTION ━━━

- ~25% Golden hour variations (dawn rake / sunset rake / sunset back-light)
- ~15% Blue hour / twilight (pre-dawn / post-sunset)
- ~15% Mid-day clarity (clean overhead / desert noon / Arctic midday)
- ~15% Storm-break / spotlight / dramatic-fragment
- ~15% Alpenglow / specific to mountain peaks at high latitude
- ~15% Soft / diffuse / overcast / fog-soft

━━━ HARD BANS ━━━

- NO multiple light sources stacked
- NO weather phenomena in light entries
- NO sci-fi / fantasy / magical / arcane vocabulary
- NO "supernatural" or "otherworldly" or "alien" descriptors

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
