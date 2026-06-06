#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_LIGHTING — convention-display lighting for the
 * WHOLE diorama. Audit 2026-06-05: existing 16 entries — undersized.
 * Target 200.
 *
 * Each entry describes a complete lighting setup that illuminates the ENTIRE
 * brick world in DEEP FOCUS edge-to-edge (the macro-display rule). Stage,
 * museum-vitrine, gallery-display, theatrical-keyed, magic-hour, night-with-
 * build-lights-on, dusk, blue-hour, raking-low, etc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's macro-display path — the lighting setup illuminating an ENTIRE complete-diorama LEGO MOC photographed at a convention. The light must read the WHOLE build in DEEP FOCUS edge-to-edge (no shallow areas, no dramatic single-subject spots that lose the rest of the world). Each entry is ONE 20-32 word sentence describing the light setup.

━━━ THE BAR ━━━
Every entry must name a SPECIFIC lighting setup (direction / quality / color-temperature / time-of-day-implied) that reads the COMPLETE diorama — convention-hall floods, theatrical reveals, magic-hour glows, night-with-build-lights, museum-vitrine, gallery-display, dusk, blue-hour, sunrise-rake, overcast diffusion, double-key, raking-side, etc. Always reads the whole world, never zones one area into shadow at the expense of the rest.

━━━ VARIETY MANDATE (distribute roughly across these lighting setups) ━━━
- ~3 CONVENTION-HALL EVEN-BRIGHT — clean fluorescent / softbox wash reading every rooftop + minifigure across the full build
- ~3 GOLDEN MAGIC-HOUR GLOW — warm low-angle sun raking across rooftops + battlements, long soft shadows gilding the whole build
- ~3 NIGHT WITH BUILD-LIGHTS ON — deep-blue ambient wrapping the diorama while trans-yellow windows + ride-lights glow across every district
- ~2 BLUE-HOUR TRANSITION — cool sky-ambient wrapping the build while first warm trans-element interior glows emerge across districts
- ~2 THEATRICAL CENTERPIECE SPOT — hard overhead key isolating the hero feature while surrounding zones drop to a soft fill
- ~2 RAKING-LOW SINGLE-KEY — a single hard low source from one corner casting long diagonal shadows across streets + plazas, carving the build into bold relief
- ~2 DUAL-SIDE CROSS-LIGHT — two equal sources flanking the build eliminating harsh shadows while carving edge detail on every tower + vehicle
- ~2 OVERCAST DIFFUSED — broad soft source simulating a bright grey-sky wash over the whole diorama, every facade reading clearly
- ~2 MUSEUM VITRINE — soft overhead spots bathing the whole build as if lit inside a glass case, every brick glowing
- ~2 RIM-LIT BACKLIGHT — bright backlight tracing rooflines + minifigures against a dark fill, dramatic centerpiece reveal from behind
- ~2 HIGH-NOON TOP-LIGHT — strong direct overhead with short crisp shadows, the bold bright daytime read
- ~2 MORNING SOFT-EVEN — gentle cool-bright wash laying soft open shadows across every facade + baseplate
- ~2 WARM AMBER + COOL FILL — bathed in rich tungsten one side, gentle blue fill the other, cinematic two-tone display
- ~1 STORMLIGHT BREAK — dark slate sky over the build, a single beam of sun cutting through cloud across the centerpiece
- ~1 SUNSET BACKLIGHT — orange-red horizon glow behind the build silhouetting its highest features, warm trans-yellow building interiors emerging
- ~1 LATE-NIGHT MOONLIT — cool moon-blue ambient with selective trans-yellow window glow, the whole build hushed under a brick night-sky
- ~1 STAGE-FOG ATMOSPHERIC — soft theatrical haze settling across the diorama, lit by overhead spots, every beam visible cutting through
- ~1 FIREWORKS REFLECTED — primary diorama lit by overhead floods, secondary trans-element fireworks above casting colored kicks across rooftops
- ~1 LIGHTHOUSE-SWEEP — primary even wash with a rotating trans-yellow beam from the build's lighthouse raking across the whole layout
- ~1 SUNRISE RAKE — long warm horizontal sun raking across the diorama from one edge, brick shadows stretching long across the world
- ~1 STUDIO HIGH-KEY — flat bright catalog wash with minimal shadow, every brick crystal-clear, the clean LEGO promotional read

━━━ FORMAT ━━━
Each entry: ONE 20-32 word sentence describing the light. Lead with the setup name as a phrase, comma, then the setup detail. Touchpoint examples:
"Convention-hall even-bright light, a clean fluorescent wash reading every rooftop, alley, and minifigure across the full build, the honest corner-to-corner display photo."
"Golden diorama-glow, a warm low-angle lamp raking across rooftops and tower battlements, long soft shadows gilding the whole build, the magic-hour display shot."
"Dusk with all the build-lights ON, deep-blue ambient wrapping the diorama while hundreds of warm trans-yellow windows and ride-lights glow across every district, the night-build spectacle."

━━━ BANS ━━━
- NO photoreal sun / real-sky language — every light reads a tabletop brick diorama
- NO tilt-shift / shallow DOF — the WHOLE build must read in deep focus
- NO single-subject-zooming light setups — every lighting setup must illuminate the COMPLETE world
- NO motion blur / animation language
- NO photographer name-drops / camera-brand stuffing
- NO mountain-photographer tropes ("godrays raking down the valley") — convention-display register only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
