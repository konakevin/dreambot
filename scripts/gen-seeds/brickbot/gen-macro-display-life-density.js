#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_LIFE_DENSITY — how the complete diorama is
 * populated (minifig + creature + vehicle traffic / activity). Audit
 * 2026-06-05: existing 16 entries — undersized. Target 200.
 *
 * Each entry describes the LEVEL + KIND of life filling the brick world so
 * it reads as a LIVING complete diorama, not an empty model — could be
 * bustling, quiet, animal-life, traffic-life, working-port, sleeping-village,
 * festival-day, etc. Theme-agnostic (the diorama_theme axis owns the world
 * type; life_density owns how populated it is).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_life_density.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIFE-DENSITY entries for BrickBot's macro-display path — how the entire COMPLETE-DIORAMA brick world is populated with minifig + creature + vehicle life, so it reads as a LIVING build, not an empty model. Each entry is ONE 22-35 word sentence describing the SCALE + KIND of activity filling the diorama.

━━━ THE BAR ━━━
Every entry must name a specific level of population (massed / scattered / sparse / lone) PLUS a specific KIND of activity (commercial / military / construction / festival / animal / domestic / tourist / industrial / nautical / nocturnal / agricultural / catastrophic) so Flux can place the figures and creatures into the brick world. Generic ("lots of figures") FAILS — be specific about WHAT they're doing across the build.

━━━ VARIETY MANDATE (distribute roughly across these density × kind combinations) ━━━
- ~4 MASSED COMMERCIAL — packed market / shopping / vendor minifigs across plazas + streets, stall-to-stall bustle
- ~3 MASSED MILITARY / SIEGE — minifig armies clashing across walls + courtyard, attackers vs defenders mid-battle
- ~3 MASSED FESTIVAL / PARADE — parade route packed with spectators, floats mid-procession, performers + musicians clustered
- ~3 KINETIC TRAFFIC — brick locomotives / cars / wagons / boats / ships mid-route, viaducts + canals + roads filled with frozen-motion traffic
- ~3 INDUSTRIAL WORKING — dockworkers / crane-builds / loaders / factory-shift minifigs filling a working-port / quarry / mill / shipyard
- ~3 TOURIST / CROWD — camera-clutching tourist minifigs at landmarks, guides leading groups, souvenir vendors at plaza entrances
- ~3 CONSTRUCTION SITE — tower crane mid-lift, scaffolds wrapping facades, worker minifigs on every level, material stacks at street level
- ~2 ANIMAL LIFE — brick sparrows / deer / fish / butterflies / sheep / monkeys / wildlife threaded through every landscape zone
- ~2 WORKING-ANIMAL CART — horses pulling carts, oxen in fields, dogs outside taverns, chickens in yards — pre-industrial work-animal life
- ~2 SPARSE / QUIET — a single fisherman / window-watcher / cyclist / monk in a deliberately atmospheric empty world
- ~2 NOCTURNAL QUIET — most of build dark, warm trans-yellow light leaking from scattered windows, a lone walker on the lamplit street
- ~2 AGRICULTURAL HARVEST — field hands / threshers / wagon-loaders across crop fields, harvest mid-rhythm filling the rural zones
- ~2 CATASTROPHIC PANIC — figures fleeing a fire / volcanic eruption / flood / monster, chaos rippling across districts
- ~2 ROUTINE WEEKDAY — delivery minifig at every third door, repair-worker on roof, commuters on the corner, shop-tenders behind counters
- ~1 PILGRIMAGE / PROCESSION — pilgrims climbing a stepped temple approach, vendors lining the route, worshippers at the summit
- ~1 RUSH-HOUR GRIDLOCK — brick cars stacked at intersection, tram mid-route, pedestrians crossing at every corner

━━━ FORMAT ━━━
Each entry: ONE 22-35 word sentence, present-tense / participle-led. Touchpoint examples:
"Dozens of minifig shoppers + vendors packed through a winding market district, stall-to-stall bustle spreading across every street zone, the whole build humming with tiny commercial life."
"Brick locomotives mid-route across a viaduct, cars threading cobbled roads below, a canal boat pushing through blue-plate water, the entire build kinetic with frozen-motion traffic."
"A handful of minifig monks moving through a monastery courtyard at dawn, one tending a garden, one reading in a window arch — the world quietly inhabited, serene, unhurried."

━━━ BANS ━━━
- NO photoreal / real-photo language — figures + creatures are LEGO minifigs + brick-built
- NO motion blur — "frozen mid-motion", "mid-stride", "mid-cheer" only
- NO references to specific build types (saloons / castle / mech etc.) — life_density is theme-agnostic
- NO real human descriptors — every figure is a minifig
- NO single-figure portrait — this axis describes the WHOLE-build populating
- NO bland counts ("many figures") — name the activity + zone-spread

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
