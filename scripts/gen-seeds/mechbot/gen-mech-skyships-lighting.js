#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mech_skyships_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's mech-skyships path. Each describes a complete cinematic AERIAL / SKY lighting setup for a SOLO predatory sci-fi mech-skyship (blade silhouettes, fang-prows, glowing power conduits — NOT box-shaped Earth-military) flying in epic skies — above cloud-deck, in storm cells, at dawn over a continent, dusk over an ocean, night with engine-glow, atmospheric re-entry, orbital twilight.

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause aerial lighting description, how it lands on the skyship's hull plating + engine-glow + cloud-deck below, and the resulting majestic / atmospheric / multi-altitude mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a STREAMING-SERIES POSTER aerial reveal — the skyship is the hero, the sky is the stage. Cloud-deck below + sky-dome above + atmospheric layers + light interacting with both. The skyship's OWN running-lights / engine-glow / weapon-charge interacts with ambient — name that. Solo-ship-beautiful aesthetic (Kevin hearted SOLO, not multi-actor combat).

━━━ VARIETY MANDATE (~16 lighting families across the batch) ━━━

- GOLDEN HOUR HIGH-ALTITUDE (low-angle amber sun raking across hull-tops, long copper shadows trailing down cloud-deck)
- DAWN ABOVE CLOUD-DECK (cold Prussian-blue ambient + first orange sunrise touching upper hull, cloud-deck flushing pink)
- STORM-CELL LIGHTNING FLASH (charcoal sky, actinic-white forked lightning between anvil clouds, briefly white silhouette)
- DUSK BLOOD-RED HORIZON (sun at horizon bleeding crimson, ship edge-lit burning red, cloud-deck scorched orange)
- NIGHT ENGINE-GLOW PRIMARY (cold steel-blue moonlight, thruster-cores throwing amber cones forward, cyan running-lights striping hull)
- SUNSET PURPLE-GOLD GRADIENT (zenith deep violet to molten gold at horizon, ship backlit edge-amber along every fin)
- AURORA EM-WARFARE INTERFERENCE (high-altitude curtains of green-violet, aurora-pulse reflecting on upper hull)
- MUZZLE-FLASH WEAPONS-DISCHARGE (primary cannon fires forward into storm darkness, yellow-white strobe on hull)
- ATMOSPHERIC RE-ENTRY THERMAL BURN (white-hot plasma shield at prow, hull glowing orange-white from friction)
- NEON-CYBERPUNK CITY-GLOW UPLIGHT (low-altitude night pass over megacity, magenta + cyan sign-arrays uplifting underside)
- ORBITAL TWILIGHT TERMINATOR (day-night boundary, port hull gold-direct, starboard cobalt orbital-shadow, atmospheric limb glowing blue)
- BLUE-HOUR HIGH ALTITUDE (post-sunset deep ultramarine sky, first stars appearing, hull catching cool ambient + engine-warm contrast)
- VOLUMETRIC GOD-RAYS THROUGH CLOUDS (sun punching through cumulonimbus tower in defined columns, ship gliding through god-ray bars)
- MIDDAY OVERCAST DIFFUSE (uniform high stratus, low contrast, ship muted-steel, cloud-shadow rolling slow across hull)
- ICE-WORLD POLAR-AURORA (Arctic-circle low-sun + simultaneous polar aurora curtain, dual-temperature light split across hull)
- CYCLONE-EYE CENTERED (skyship suspended in cyclone-eye, calm gold-light core surrounded by wall of dark storm)
- BINARY-STAR DOUBLE-SHADOW (alien planet with two suns, hull casting two divergent shadow-shapes across cloud-deck)
- HEAT-LIGHTNING DISTANT (distant horizon heat-lightning flashing across high-altitude cumulus, ship silhouetted intermittently)
- METEOR-SHOWER NIGHT (streaks of meteor-fire raking the sky behind ship, atmospheric trails reflecting off upper hull)
- MOON-RISE SILVER (gigantic ringed-planet moon rising at horizon, silver moonlight raking hull, planet-rings reflecting in window-arrays)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant sky light
- How it lands on the skyship's HULL plating + fin / fang-prow / power-conduit glow
- How it lands on the CLOUD-DECK BELOW (color reflection / shadow / volumetric haze)
- Atmospheric scale-element (multi-altitude cloud layers / horizon haze / weather curtain / atmospheric limb)
- Resulting mood (majestic / predatory / atmospheric / sublime / approaching-storm / solitude)

━━━ BANS ━━━

- NO box-shaped Earth-military DNA (NO carrier / dreadnought / battleship / destroyer / submarine references)
- NO interior / hangar lighting — this is ALWAYS aerial
- NO closeup / portrait language — ship dominates SKY
- NO Star Wars / Halo / Star Trek IP language
- NO bland flat sky — always multi-altitude atmospheric layers
- NO scrap-weld DNA — ship is POLISHED + PREDATORY + DESIGNED
- NO "intimate" / "quiet" mood — this is BIG SKY + EPIC ATMOSPHERE
- NO crew action / boarding action language — this is the SHIP in atmospheric setting

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
