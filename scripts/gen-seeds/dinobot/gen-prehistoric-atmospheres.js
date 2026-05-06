#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for DinoBot — Unreal Engine 5 cinematic paleoart. Each entry is 12-22 words and describes a specific atmospheric or surface element in the frame.

━━━ NON-NEGOTIABLE — REBALANCE: NOT EVERYTHING IS FOGGY ━━━
Distribute entries across these proportions to fix over-foggy renders:
- ~30% volumetric/foggy (dust, mist, pollen, steam, sheet-rain)
- ~70% CRISP / CLEAR / WET / REFLECTIVE (post-rain freshness, specular reflections, raytraced caustics, mirror-water, dramatic shadow architecture, dry contrast, raindrop-specular)

━━━ CATEGORIES ━━━

WET-AND-REFLECTIVE (heavy emphasis — 35%+):
- Mirror-flat lake reflecting dinosaur silhouette in perfect ray-traced doubling
- Rain-slick mud-flat with each footprint puddle holding a fragment of sky
- Splash-corona around a wading dinosaur foot, droplets frozen mid-air catching backlight
- Wet-glistening hide with chrome-bright specular highlights post-rain
- Glassy lagoon at dawn with reflection so still it doubles the scene
- Sun-caustics dancing on shallow lake bed beneath a wading dinosaur
- Wake trail behind swimming sauropod, each ripple catching light edge
- Polished-stone-river-rocks with water-film and mirror sheen
- Rain-droplet lenses on broad megaleaves refracting sunlight
- Wet bark on a mile-high tree gleaming after rain, rivulets visible

POST-WEATHER CRISP CLARITY (15%+):
- Just-after-rain crystalline air, every detail razor-sharp, water dripping from foliage
- Storm-cleared aftermath with rainbow arc and still-wet everything sparkling
- Post-shower clear-edged sunlight, no haze, every leaf gleaming
- Cold-front-passed crisp air with razor-sharp distant peaks
- Rain-cleared sky with shafts of sunlight breaking through retreating clouds

CRISP SPECULAR DETAIL (10%+):
- Bright midday hard-light shadows with chrome-bright specular on wet scales
- Dry-desert raking sunlight with razor-sharp shadow architecture
- Cold-blue arctic clarity with sharp mountain silhouettes
- Golden-hour with crisp edges and rich color saturation, no haze diffusion
- Dramatic chiaroscuro storm-light through a single cloud-break, rest of frame stark

DRAMATIC WEATHER (15%+):
- Mile-wide rain-wall approaching across a plain, sun on one side, dark on the other
- Lightning fork freezing motion, briefly revealing herd in stark blue-white
- Aurora curtains across daytime sky (creative license — this world allows it)
- Double rainbow arching over a herd, prismatic
- Pyrocumulus rising from distant volcano, lit from below by lava

VOLUMETRIC / FOGGY (only ~30% — DON'T overdo this):
- Dust-cloud kicked by herd stampede, individual pillars rising hundreds of feet
- Steam columns rising from forest floor at dawn, vapor strands backlit
- Pollen drift through golden-hour shafts catching light like particles
- Rolling mist filling a canyon floor at sunrise
- Light cathedral god-rays piercing dense canopy with visible beams

ACTIVE WET INTERACTION:
- Tail-slap sending up sheet of water, each droplet a tiny lens
- Charging dinosaur sending water arcing outward in spray
- Drinking dinosaur with concentric ripples expanding from its lips
- Tail dragging behind a swimming sauropod, V-wake doubled in mirror water

LIVING ATMOSPHERE (sparingly):
- Cloud of giant dragonflies with iridescent wing-flash against fern-green
- Drifting seed-fluff floating like snow through still understory
- Firefly swarm at dusk speckling the air, sleeping sauropod silhouetted within

━━━ EVERY ENTRY MUST INCLUDE ━━━
- A specific visual element (mirror reflection / chrome specular / sharp shadow / particulate / weather phenomenon / wet detail)
- A texture or material descriptor (mirror-flat / chrome-bright / razor-sharp / rain-slick / glassy / crisp / specular / matte / etc.)

━━━ PRIORITIZE ━━━
Reflections, specular highlights, wet textures, raytraced clarity OVER fog and haze. Foggy/misty entries should feel like DELIBERATE atmospheric choices, not the default.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: element type + texture descriptor + interaction (with light, with water, with subject).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
