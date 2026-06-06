#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_LIGHTING — light source / direction / color quality
 * for surface + submerged brick aquatic dioramas.
 * Audit 2026-06-05: existing 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's aquatic path — surface (beach/coast/harbor) + submerged (reef/kelp/wreck/trench) tabletop brick dioramas. Each entry is ONE sentence, 25-40 words, naming the light source / direction / color quality + how it falls across the brick build.

━━━ THE BAR ━━━
Every entry must name a SPECIFIC light source (caustic-dapple, sun-shafts, surface-shimmer, bioluminescent glow, sunset/sunrise, deck-floods, lighthouse-beam, lantern, etc.) PLUS direction (above, raking, side, beneath, etc.) PLUS color quality (cool blue, trans-amber, silver-moon, trans-cyan, etc.) PLUS how it touches the brick (caustic pools on coral plates, trans-glints on tile-water, shadows pooling between studs, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 CAUSTIC / SUN-SHAFT (overhead-water): trans-blue/cyan caustic dapples on reef, shafts piercing down through built water-column, surface-shimmer
- ~4 BIOLUMINESCENT (deep): glow-element-driven trans-cyan/trans-green/trans-pink point-light from anglerfish / coral / jellyfish / vent
- ~4 SURFACE / GOLDEN-HOUR / SUNSET: warm amber raking the beach, low sun gilding wave-tile crests, dusk pink across sand-plate
- ~3 MOONLIT / NIGHT-SEA: silver-blue moon overhead, deep-shadow pools, glistening trans-tile sea-glint
- ~3 LIGHTHOUSE-BEAM / SEARCHLIGHT: directional trans-yellow/trans-clear beam cutting fog or wave, single hot pool
- ~3 DECK-FLOOD / HARBOR-LAMP: warm trans-amber lamp-glow on harbor deck, brick crew lit hot against cool sea-blue
- ~3 OVERCAST / FOG / STORM: flat diffuse cool grey-blue light, soft shadowless flat-light on every brick, storm-grey
- ~2 DAWN / SUNRISE: low pink-amber side-light glancing across calm trans-tile water, soft cool counter-fill in shadow
- ~2 LANTERN / TORCH (interior brick cabin / wreck): warm trans-orange round-plate point-light, deep dark-blue elsewhere
- ~1 HIGH-NOON HARSH: overhead bleaching the beach white-tile, short hard shadows under every brick
- ~1 TRENCH-DEEP NEAR-BLACK: only a single faint trans-cyan vent-glow point illuminating chosen plates, the rest plunged into dark-blue

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Caustic-blue dapple from directly above, broken cool pools scattered across the brick reef and seafloor, trans-clear tiles catching bright glints, deep blue shadow pooling between coral plates."
"Bioluminescent trans-cyan point-light rising from a built coral-cluster, anglerfish-bulb element illuminating the diver's helmet hot, surrounding deep falling to near-black trench-dark."
"Golden beach-sunset raking low across the tan-plate sand, warm amber gilding the palm builds and surf-shack bricks, long plastic shadows stretching hard toward camera."

━━━ BANS ━━━
- NO photoreal water vocab ("rippling", "shimmering water surface")
- NO fluid-motion verbs ("flowing light", "dancing reflections")
- NO mood-only descriptors ("dramatic lighting") — name source + direction + color
- NO film/photographer name-drops
- NO licensed franchise color names

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
