#!/usr/bin/env node
/**
 * EarthBot geological-wonder — PHENOMENON axis (conditional 30%-gated, R3 clean).
 *
 * R2 had 4 of 30 entries with beam/shaft/column-of-light phrasing
 * that Flux rendered as laser-beams or sci-fi columns. R3 PURGES
 * those phrasings.
 *
 * Rare optical / weather event woven into the scene — aurora, rainbow,
 * snow dust, eruption plume backlight, halo, mammatus clouds, sun-pillars.
 *
 * R0 = 30.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/geological_wonder_phenomenon.json';
// R3 production scale — append to existing 30 entries to reach 100 (conditional axis, smaller pool fine).
generatePool({
  outPath,
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} RARE PHENOMENON entries for EarthBot geological-wonder. Each entry describes ONE specific signature optical / weather event woven naturally into a geological scene. 30%-gated conditional axis — fires on a minority of renders.

━━━ THE BAR — ONE RARE PHENOMENON, NATURALLY INTEGRATED ━━━

The phenomenon is a wow-moment captured at the right place + right time. Aurora through a cave skylight, rainbow over a salt flat, eruption plume backlit, snow dust on red-rock hoodoos. Real natural phenomena only — no sci-fi / fantasy.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one phenomenon, 14-26 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **ONE NAMED PHENOMENON** (drawn from this list — vary across entries):

   Sky phenomena:
   - aurora borealis ribbons shimmering above
   - rainbow arc through clearing storm
   - double rainbow arcing
   - sun-pillars rising vertical from the horizon
   - crepuscular sun rays bursting through cloud
   - lenticular clouds hovering above a peak
   - mammatus cloud-pouches hanging overhead
   - alpenglow gradient at peak chromatic moment
   - moonbow at night
   - sun dog appearing beside the sun
   - halo-ring around the sun

   Weather phenomena:
   - snow dust swirling lightly across the formation
   - light snowfall settling on warm-colored rock
   - virga rain wisps falling from cloud bottoms
   - lightning strike on a distant peak
   - heavy fog parting briefly
   - storm-tear with sun blasting through

   Volcanic / thermal phenomena:
   - eruption plume backlit by sunset
   - lava-flow glowing amber-red against dark crust
   - geyser eruption at peak column-height
   - thermal vent steaming dramatically
   - heat-shimmer rising from hot rock

   Crystal / mineral phenomena:
   - prismatic light scattering through crystal formations
   - selenite crystals lit from within by penetrating sun
   - iridescent shimmer across an obsidian flow

2. **HOW IT INTEGRATES WITH THE SCENE** (most entries include this):
   - "above the formation"
   - "visible through the cave skylight"
   - "behind the geological feature"
   - "lit from within"
   - "framing the scene above"

━━━ HARD BANS ━━━

NEVER include:
- Subject content (no "aurora over crystal cave" — say generic "aurora above")
- Lighting words (no "aurora lit by godrays" — lighting axis owns)
- Atmosphere (no "mist + aurora")
- Mineral colors (mineral_color axis)
- Multiple phenomena (ONE per entry — restrained truth)
- Sci-fi / fantasy events (no portal-opening / no UFO / no magical-effect)
- Impossible combinations (no aurora + bright daytime sun)
- Humans

━━━ R3 BANS — beam/shaft/column phrasings (Flux laser-beam triggers) ━━━

NEVER write these — Flux renders them as sci-fi laser-beams / energy columns:

- "single intense shaft of white light" / "single shaft"
- "beam of light" / "single beam"
- "column of light" / "single column"
- "refracted beams" / "exit the mineral faces" (prismatic crystal beam exits)
- "lit from within" / "ignite into warm translucent gold along the direct beam path"

USE INSTEAD: "shafts plural fanning", "spread of light", "scattered illumination", "broad spotlight", "rim-glow", "soft glow"

✗ BAD: "single intense shaft of white light flooding through the gap"
✓ GOOD: "broad spotlight breaking through the gap, illuminating the formation"

✗ BAD: "Prismatic light scattering through crystal formations, tight rainbow fans where refracted beams exit"
✓ GOOD: "Prismatic light scattering through crystal formations, rainbow color spreading across adjacent surfaces"

━━━ EXAMPLES ━━━

✓ "Aurora borealis ribbons shimmering above the formation, green-magenta curtains rippling across the night sky"

✓ "Double rainbow arcing through a clearing storm, both arcs sharp against deep storm-grey clouds, framing the geological feature below"

✓ "Sun-pillars rising vertical from the horizon, golden columns of light extending upward in the sky"

✓ "Crepuscular sun rays bursting through scattered cloud-gaps overhead, multiple shafts illuminating the formation below"

✓ "Lenticular clouds hovering above the peak, smooth lens-shaped formations suspended motionless"

✓ "Alpenglow gradient at peak chromatic moment, rose-pink to magenta saturating the rock face, eastern sky holding deep indigo"

✓ "Snow dust swirling lightly across the warm-colored formation, glittering flakes catching low sun in golden flickers"

✓ "Lightning strike on a distant peak, bright fork against deep storm-grey clouds, the foreground formation rim-lit briefly"

✓ "Eruption plume backlit by sunset, dark ash-cloud silhouetted against gold-pink sky with the plume rising high"

✓ "Geyser eruption at peak column-height, hundred-foot steam column against the dawn sky, mineral-crusted terraces glowing below"

✓ "Halo-ring around the sun overhead, ice-crystal halo visible in the upper atmosphere"

✓ "Mammatus cloud-pouches hanging overhead, droopy sky-pouches in deep storm-grey above the geological feature"

✓ "Iridescent rainbow-sheen shimmering across an obsidian flow surface, prismatic colors visible in the volcanic glass"

✓ "Sun-dog appearing beside the sun, bright rainbow point in the cloud layer adjacent to the main sun"

✓ "Virga rain wisps falling from cloud bottoms, partial-rain streaks visible above but not reaching the ground"

✗ BAD — multiple phenomena: "Aurora AND rainbow AND eruption" (BANNED — ONE)
✗ BAD — impossible: "Aurora visible in bright midday sun" (BANNED — incompatible)
✗ BAD — subject: "Aurora over a crystal cave" (BANNED — generic, no subject content)
✗ BAD — fantasy: "Magical portal opening above" (BANNED — real phenomena only)

━━━ DISTRIBUTION ━━━

Spread across categories:
- ~30% sky phenomena (aurora / rainbow / sun-rays / halo / lenticular / mammatus)
- ~25% weather phenomena (snow / virga / lightning / fog / storm-tear)
- ~25% volcanic / thermal (eruption / lava-flow / geyser / vent / heat-shimmer)
- ~20% crystal / mineral (prismatic light / iridescent sheen / lit-from-within)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. One real natural phenomenon per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
