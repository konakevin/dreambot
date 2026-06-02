#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} mech-toy-battle lighting + atmosphere descriptors for ToyBot's mech-toy-rampage path. Each entry combines battle-environment lighting + atmospheric phenomenon + color cast. 10-20 words per entry.

━━━ THE WORLD ━━━
Mecha-anime toy-line battles — megacity rooftops, alien deserts, orbital stations, volcano labs, ruined cityscapes, beach landings, asteroid fields, space hangars, dam-power-stations, mountain training-grounds.

━━━ HARD VARIETY RULES ━━━
- Mix dramatic battle-aftermath, mid-combat-strobe, and atmospheric vista-light
- Cover full chromatic range (no over-indexing on one palette)

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- neon-cityscape backlit silhouette, magenta-cyan crossfire glow, polluted smog haze
- megacity rooftop dawn, sodium-amber rooftop glow, drifting smoke columns from distant explosions
- alien-desert twin-suns harsh-shadow, blowing dust, heat-shimmer warping silhouettes
- orbital-station cold cyan corridor light, shaft-of-Earth-light through viewport
- volcano-lab lava-glow underlight, sulfur-haze, magma-pour shadow-dance
- ruined city sunset, amber-orange dust-haze, building-fire smoke-billow
- post-battle drizzle, oil-puddle reflection, sodium street-lamps cutting through fog
- thunder-storm electromagnetic-arc, lightning-fork-strobe, sheet-rain curtain
- arctic-base whiteout, snow-blowing horizontal, exhaust-vapor crystallizing
- space-hangar overhead sodium-strobe, fluorescent floods, vapor-trails crossing
- jungle-canopy dappled sun-shaft, leaf-flutter shadows, tropical-rain mist
- nuclear-strobe afterglow, blast-radius haze, particulate falling
- aurora-borealis battlefield night, green sky-veil, snow reflecting cyan
- asteroid-field starlight, distant nebula glow, debris floating
- megaramp arena spotlight crossfire, smoke pillars, crowd-strobe
- beach-landing dawn fog, salt-haze, rising-sun silhouette through mist
- volcanic-island ash-cloud sunset, pyroclastic-glow, lightning in plume
- megafactory neon-vapor, chrome-reflection floor, pipe-smoke rolling
- dam-spillway sodium spotlight, mist from cascade, rainbow refraction
- cyber-rain neon downpour, holographic-billboard glow on wet street
- desert-night campfire glow, embers floating, starlit dune horizon
- space-engagement zero-grav debris-cloud, plasma-trail spirals, distant nebula
- training-yard overcast diffuse, target-rig-shadows, rain-streaked
- megazord-stadium cathedral-shaft beams, dust-motes in light, dramatic
- subterranean magma-cavern red-glow, heat-shimmer, sparks-rising
- snowstorm-arctic blue-white whiteout, snow-flurry obscuring, exhaust-puffs
- night-firefight, muzzle-flash strobing, tracer-arcs crossing, smoke-pillars

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases, written as direct atmospheric direction:
- "neon-cityscape backlit dawn, magenta-cyan crossfire glow, polluted smog haze, dramatic silhouettes"
- "alien-desert twin-suns harsh-shadow midday, blowing dust, heat-shimmer warping mech silhouettes"
- "post-battle drizzle dusk, oil-puddle reflections, sodium street-lamps cutting fog, smoke pillars"

━━━ BANNED ━━━
- Generic "cinematic lighting" without specifying environment + weather + color
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share ENVIRONMENT + WEATHER + COLOR-CAST exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
