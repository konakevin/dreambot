#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_SPECTACLE — the 50%-gated environmental beat for the
 * theme-park path (fireworks / light-show / fountain / confetti / laser /
 * parade-burst). Audit 2026-06-05: existing 18 entries — undersized.
 * Target 200.
 *
 * Each entry describes a secondary brick-built fairground spectacle —
 * fireworks, light-shows, fountains, confetti-cannons, laser-shows, parade-
 * bursts. Always 100% LEGO brick (trans-element + bar-element + clear-rod).
 * Never photoreal pyro.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_spectacle.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SPECTACLE entries for BrickBot's theme-park path — the 50%-gated environmental BEAT secondary to the hero ride/attraction (fireworks / light-show / fountain / confetti / laser / parade-pyro / bubble-cloud / balloon-release / blimp / etc.). Every spectacle is 100% LEGO brick (trans-element parts on bar-elements / clear-rod stems). Each entry is ONE CAPS prefix + em-dash + 30-45 word body describing the brick-built spectacle.

━━━ THE BAR ━━━
Every entry must describe a BRICK-BUILT secondary focal beat (fireworks-burst / fountain-jet / confetti-cannon / laser-show / parade / etc.) using SPECIFIC LEGO part names (trans-red + trans-yellow + trans-green 1×1 round-plates on clear-rod / bar-element / stud-rod / trans-bar / etc.) plus the crowd reaction beat below it. Generic ("fireworks above") FAILS — name the parts, the geometry, and the crowd reaction.

━━━ VARIETY MANDATE (distribute roughly across these spectacle categories) ━━━
- ~4 FIREWORKS-BURST — radial trans-element bursts on clear-rod centers, upturned minifig crowd cheering
- ~3 RIDE LIGHT-SHOW — every ride outlined in synchronized trans-stud rows pulsing across the midway
- ~3 FOUNTAIN WATER-JET — arcing trans-blue + trans-light-blue round-plate columns from a brick basin, white round-plate spray
- ~3 LASER-SHOW — trans-clear + trans-color bar-elements fanning in wide beams from a rooftop stage-tower
- ~2 PARADE / FLOAT-BURST — parade-floats on printed-tile bases, costumed minifigs waving, streamer-bar trails
- ~2 CONFETTI-CANNON — frozen burst of multicolor 1×1 round-plates from a stage-mount cannon
- ~2 BALLOON-RELEASE — clustered round balloon-elements on clear bar-rods rising over the park gate
- ~2 BUBBLE-MACHINE CLOUD — trans-clear + trans-light-blue 1×1 round-plates on fine clear stud-rods drifting above kids-area
- ~2 STAGE-SHOW PYRO — trans-orange + trans-yellow flame-jets on bar-element stems behind performer minifigs
- ~2 TICKER-TAPE / SNOW-CANNON — cascade of flat printed-tile strips + white 1×1 round-plates frozen mid-fall
- ~1 DOVE / BUTTERFLY RELEASE — flock of white / pastel micro-brick birds or butterfly-elements on clear stud-rods rising
- ~1 SKY-BANNER BLIMP — brick-built blimp on clear bar-rod with a long printed-tile banner trailing
- ~1 STARBURST SPINNER — radial frame of bar-elements with alternating trans-color 1×1 round-plates spinning overhead
- ~1 CHARACTER MEET-AND-GREET — costumed-mascot minifig waving on a brick stage, children clustered, photo-opp beat
- ~1 LIGHTHOUSE / SEARCHLIGHT-SWEEP — single trans-yellow searchlight beam raking across the midway from a tower
- ~1 RIDE BREAKDOWN FLASH-FROZEN — coaster mid-stall with safety lights flashing in trans-red rotating beacons

━━━ FORMAT ━━━
Each entry: ONE CAPS prefix (2-5 words hyphenated), em-dash, then 30-45 word body. Body MUST include: specific LEGO part-names (trans-element colors / 1×1 round-plate / bar-element / clear-rod / stud-rod / printed tile), the spectacle's geometry (radial / arcing / cascading / clustered / rising), and the minifig crowd reaction. Touchpoint examples:
"FIREWORKS-BURST — trans-red + trans-yellow + trans-green 1×1 round-plates radiate from clear-rod centers on bar-element spokes high above the coaster, the upturned minifig crowd frozen mid-cheer beneath a built sky-show"
"FOUNTAIN WATER-JET — arcing columns of trans-blue + trans-light-blue 1×1 round-plates leap from a circular brick basin, white round-plate spray caps each jet-tip, the plaza crowd gathered at the rail watching"
"LASER-SHOW — trans-clear + trans-green bar-elements fan in wide beams from a rooftop stage-tower across the dark park, the crowd silhouetted on the brick plaza, a frozen built geometry of light-beams"

━━━ BANS ━━━
- NO photoreal pyro / real fireworks / real fountain / real beams — every spectacle is brick-built
- NO motion blur / animation — render is FROZEN brick moment
- NO real licensed park names (Disney / Universal / specific real-world rides)
- NO photoreal smoke / fog haze — use cotton-elements / 1×1 round-plates
- NO single-figure framing — the spectacle is the secondary focal point, the crowd is reacting
- NO bland descriptors — name the trans-element colors + the geometric shape + the crowd beat

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with CAPS prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
