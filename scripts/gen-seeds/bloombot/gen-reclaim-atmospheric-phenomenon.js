#!/usr/bin/env node
/**
 * BLOOMBOT_RECLAIM_ATMOSPHERIC_PHENOMENON — small atmospheric / wildlife
 * / particulate phenomenon inside a ruined / bloom-overrun cathedral or
 * castle interior. Vertical light-beams through collapsed dome,
 * hummingbird at capital bloom, cottonwood seed-down drift, water-pool
 * mirror reflection, firefly cloud between columns.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_reclaim_atmospheric_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC PHENOMENON entries for BloomBot's reclaim path — small atmospheric / wildlife / light / particulate phenomenon inside a ruined cathedral / castle / abbey / fortress overrun by wildflowers and climbing-vine bloom-mass. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing the phenomenon + how it interacts with collapsed walls, ruined columns, broken vaults, vine-mass, fallen masonry.

━━━ THE BAR ━━━
Every entry names a SPECIFIC ruin-interior atmospheric event: vertical light-beam through a collapsed dome, fog-veil drifting between columns, cottonwood seed-down through ruin space, hummingbird at a capital-bloom, mirror-pool reflection of arched ceiling, firefly cloud between columns, ivy-curl mid-climb, swift darting through a window-arch. The ruin's architectural detail + bloom-overgrowth must be present.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"VERTICAL LIGHT-BEAMS THROUGH COLLAPSED DOME — three thick beams of direct sunlight pouring through the fractured dome crown onto a dense wildflower floor below, beams crisp-edged and gold-amber against the still interior"
"HUMMINGBIRD AT CAPITAL BLOOM — solitary ruby-throated hummingbird hovering at a bloom-cluster spilling over a crumbled stone capital, wings a trembling iridescent blur, soft morning light behind"
"COTTONWOOD SEED-DOWN DRIFT — hundreds of cottonwood seed-fluffs drifting in slow suspension through the open ruin interior, each one catching a slant of late-afternoon gold as it descends"
"WATER-POOL MIRROR REFLECTION — mirror-still rainwater pool on the ruin floor reflecting the entire bloom-draped archway above, a single falling petal breaking the surface into soft concentric rings"
"FIREFLY CLOUD BETWEEN COLUMNS — dense soft-glowing firefly cloud suspended between moss-wrapped columns at blue-hour dusk, hundreds of pale green pulses at every depth"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~4 LIGHT-BEAM THROUGH ROOF (vertical beams through collapsed dome, single beam through cathedral oculus, god-rays through fallen vaulting, slanting shafts through window-arch)
- ~3 HUMMINGBIRD / BIRD AT BLOOM (hummingbird at capital-bloom, songbird on broken column, robin on fallen capital, swift through window-arch)
- ~3 DRIFTING SEED / FLUFF (cottonwood seed-down drift, milkweed-down through ruin, dandelion-clock pieces, willow-fluff suspended)
- ~3 MIRROR-POOL / WATER REFLECTION (water-pool reflecting vault, rainwater puddle mirror, fountain-basin reflection, broken-floor water-pool)
- ~3 FIREFLY / NIGHT-GLOW (firefly cloud between columns, glowworm-cluster on broken stair, luminous moth-cluster, lantern-glow drift)
- ~3 FOG / MIST IN RUIN (fog-veil between columns, morning-mist filling nave, low ground-fog through crypt opening, ground-fog around fallen masonry)
- ~3 SWIFT / BAT / FLYING CREATURE (swift through window-arch, bat through cloister opening, pigeon-flock through fallen vault, crow on broken merlon)
- ~3 PETAL / BLOSSOM FALL (cherry-blossom snow through ruin, peony-petal cascade, rose-petal drift, magnolia-petal fall)
- ~3 VINE / GROWTH MID-MOTION (ivy-tendril mid-climb on column, vine-curl mid-twist, climbing rose mid-bloom on broken capital, moss-cushion lighting up)
- ~3 SOUND-VISIBLE (echoing dust drifting, pebble-fall scattering, distant collapse-dust suspended, fallen masonry-dust haze)
- ~3 BUTTERFLY / MOTH CLUSTER (butterfly cluster at broken altar, atlas-moth on column, white-moth chain in side-aisle, swallowtail at fallen capital)
- ~3 RUIN-SPECIFIC LIGHT (sun-through-rose-window kaleidoscope, light-shaft through crack, single beam through arrow-slit, light-pour through fallen wall-section)
- ~3 SMALL MAMMAL (fox in ruin nave, rabbit at fallen column, marten on broken stair, deer pausing in cloister)
- ~3 RAIN / DROPLET (light-rain through collapsed roof, dripping water from broken vault, single drop chain falling, mist-rain through window-arch)

━━━ BANS ━━━
- NO photographer-name drops.
- NO bare "atmospheric ruin" — name the SPECIFIC phenomenon.
- NO sci-fi / no neon / no hologram.
- NO crowds / no people.
- NO modern-electronics.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming the specific phenomenon + how it interacts with ruin architecture (collapsed roof / columns / broken vault / bloom-mass)".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
