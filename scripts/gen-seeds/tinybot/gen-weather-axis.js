#!/usr/bin/env node
/**
 * WEATHER axis pool — 30 entries.
 *
 * Forces TinyBot to render with VISIBLE weather/atmospheric event so renders
 * stop drifting back to "calm warm air". Heavy rain, fog rolling in,
 * blizzard, dust storm, lightning, breaking sunbeams etc. — each must be
 * VISIBLY EXECUTED in the render (drops, shine, fog tendrils, dust haze).
 *
 * Each entry: 10-20 words. One specific atmospheric event + how it shows.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 30;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/tinybot/seeds/weather_axis.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 15),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} WEATHER-OVERRIDE descriptions for TinyBot — visible atmospheric events that bend the render away from default "calm warm air at golden hour".

Each entry: 10-20 words. The WEATHER event + the EXECUTION CUE (what makes it readable in a still image).

━━━ CATEGORIES (span ALL of these — never cluster on one) ━━━
- HEAVY RAIN (fat falling drops, splash rings on puddles, wet shine on every surface, droplet streaks across frame)
- DRIZZLE / MIST (fine micro-droplets, soft sheen on surfaces, low visibility, cool air feel)
- FOG ROLLING IN (visible tendrils creeping low, distant subjects fading to grey, ground vapor)
- DENSE FOG (everything muted to soft greys, only nearest subject in clarity, atmospheric depth)
- BLIZZARD / HEAVY SNOWFALL (visible motion-streak snowflakes filling frame, accumulation visible, low visibility)
- LIGHT SNOWFALL (slow drifting flakes, fresh dusting, calm cold)
- DUST STORM (thick rust-tinted air, particles streaking across frame, distant subjects orange-haze)
- WIND-WHIPPED (debris/leaves/petals streaking horizontally, cloth/fabric pulled taut, dust kicking up)
- BREAKING SUNBEAMS (volumetric god-rays through clouds/canopy, dust motes in beams, dramatic shafts)
- PRE-STORM TENSION (still air, dark heavy clouds approaching, ominous yellow-grey light, calm before)
- THUNDERSTORM / LIGHTNING (lightning fork or flash, instant freeze of the strike, electric blue cast)
- HAILSTORM (visible falling hailstones, ice impacts, pock-marked surfaces, frozen mid-bounce)
- MONSOON (sheets of rain, near-flooding, palm fronds whipping, tropical heavy)
- SLEET (mixed rain-and-ice, slick wet surfaces, glassy reflections)
- DAWN FROST (everything rimed white, breath visible, crystal clarity)
- HOT SUMMER HAZE (heat shimmer rising, distant objects warping, washed-pale daylight)
- AURORA (green/pink aurora streaks across sky, snow reflecting the colors)
- SANDSTORM SUNRISE (orange-pink sun barely piercing thick airborne sand)
- HEAT-LIGHTNING (silent flashes lighting the scene, no rain, dry summer night)
- POST-RAIN CLARITY (everything wet and shining, fresh-washed colors, rainbow possibility)

━━━ FORMAT ━━━
"{WEATHER EVENT}, {EXECUTION CUE — visible droplets / streaks / haze / shine / ice / breath / motion}, {AIR FEEL — cold / hot / electric / muggy / sharp}"

Examples:
- "Heavy rainfall, fat droplets streaking across the frame and splash-rings exploding on puddles, every surface wet-shining, cold pressure in the air"
- "Rolling fog tendrils creeping low across the ground, distant subjects fading to soft grey silhouettes, damp cool air"
- "Lightning fork mid-flash freezing the entire scene in stark blue-white, every shadow sharp, electric tension"
- "Dust storm whipping rust-orange particles horizontally across the frame, distant subjects barely visible through the haze, dry hot bite"
- "Pre-storm pressure with still air and a wall of dark cumulus approaching, ominous yellow-grey backlight, charged calm"
- "Breaking sunbeams cutting through cloud cover in volumetric shafts, dust motes glittering in the light, fresh-after-rain feel"

━━━ HARD RULES ━━━
- Every entry must be VISUALLY EXECUTABLE — Flux needs cues like "fat droplets / fog tendrils / lightning fork / ice rim".
- NEVER "calm warm air at golden hour" or any variation. The point is to BREAK that default.
- NEVER mention tilt-shift, miniature, scale (those are added by the prompt prefix).
- Variety: span ALL 20 categories. Don't cluster on rain.
- The WEATHER must override any "cozy warm" instinct in the scene seed.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
