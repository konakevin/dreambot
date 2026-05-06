#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for DinoBot — humid, primordial, layered atmosphere with VISIBLE depth. Each entry is 12-22 words and describes a specific atmospheric element FILLING THE FRAME.

━━━ NON-NEGOTIABLE — ATMOSPHERE IS VISIBLE & MULTI-LAYERED ━━━
Every entry must describe atmosphere that the camera SEES — not invisible humidity, but visible vapor, dust, pollen, mist, particulates, sheet-rain, light-shaped fog. Multi-distance preferred (foreground particulates + midground volume + background haze).

━━━ CATEGORIES ━━━

JUNGLE / FOREST HUMIDITY (heavy emphasis):
- Steam columns rising from forest floor at dawn, individual vapor strands visible against backlit canopy
- Heavy humidity haze diffusing tree-fern silhouettes into milky middle-distance softness
- Pollen drift through golden-hour shafts, individual grains catching light like particles
- Spore-cloud from burst fungus, lit by raking sidelight, drifting through fern understory
- Mist condensing on broad cycad leaves, droplets catching light like beads

WATER / WET ATMOSPHERE:
- Spray plume from a tail-slap into shallows, droplets backlit, ripples spreading outward in sky-mirror water
- Sheet-rain blowing diagonally through a clearing, individual drops catching golden backlight
- Waterfall mist curtain rising as a wall of vapor, prismatic rainbow forming in the spray
- Lake-surface fog rolling outward at sunrise, dinosaur silhouettes wading into it
- Post-rain steam rising from sun-warmed mud, the air feeling heavy and tropical

DUST / EARTH PARTICULATES:
- Dust-cloud kicked by a herd's stampede, individual pillars rising hundreds of feet, lit warm-orange
- Footfall dust-puff drifting backward from a single dinosaur stride, lit by raking dawn light
- Pollen-yellow haze from massive cycad-coning event, the air thick with reproductive dust
- Wind-blown sand veiling a desert horizon, primordial dunes fading into ochre infinity

VOLCANIC / GEOTHERMAL:
- Sulfur-yellow steam venting from a fumarole, visible columns rising into a slate-grey sky
- Ash-fall drifting like grey snow, settling on dinosaur backs and broad fern-fronds
- Heat-shimmer rising from cooled lava-flow, distorting the dinosaur silhouettes beyond it
- Pyroclastic-cloud wall on the horizon, tiny figures fleeing across a foreground plain

LIVING ATMOSPHERE (insects/seeds):
- Cloud of giant dragonflies catching low-angle sun, wings flashing iridescent against fern-green
- Drifting seed-fluff (early angiosperm) floating like snow through a still understory
- Firefly swarm at dusk speckling the air, sleeping sauropod silhouetted within
- Mosquito-swarm pillar over a bog, lit golden against shadowed tree line

WEATHER DRAMA:
- Storm cell on the horizon trailing dark rain-curtains, light breaking through one crack
- Lightning-fork freezing for one frame, briefly revealing a herd in stark blue-white
- Hail-shower at edge of frame, individual stones bouncing off broad leaves
- Heavy rain sheeting across a clearing, the world reduced to grey verticals and a single dinosaur

ATMOSPHERIC PERSPECTIVE:
- Distant mountains fading into milky blue layers receding to vanishing point
- Forest receding into atmospheric haze, color desaturating with each layer of distance
- Multiple cloud levels at different altitudes, near-clouds dark, far-clouds light

━━━ EVERY ENTRY MUST INCLUDE ━━━
- A visible particulate or vapor element (mist, steam, pollen, dust, ash, spore, droplet, smoke)
- Either light interaction (backlit / sidelit / shafted) OR multi-distance depth language
- Specific texture descriptor (sheet, curtain, column, drift, swirl, plume, halo)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: particulate type + behavior (rising/falling/drifting/streaming) + light interaction.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
