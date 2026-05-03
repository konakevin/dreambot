#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// REGENERATED 2026-05-03 — pool was originally named TRANQUIL_MOMENTS
// (kept for path-code compatibility) but contents are now DYNAMIC
// MID-ACTION verbs matching what Kevin's hearted refs actually show:
// hammering, ascending, wading, etching, scoring, threading, stamping,
// shearing, sweeping. NOT "standing", NOT "watching", NOT "perched".

generatePool({
  outPath: 'scripts/bots/starbot/seeds/tranquil_moments.json',
  total: 80,
  batch: 16,
  metaPrompt: (n) => `You are writing ${n} DYNAMIC MID-ACTION moments for a sci-fi robot caught in the middle of doing something. Each entry is a short phrase (15-30 words) describing the EXACT MOMENT a robot is captured — present-continuous verb, with environmental detail showing the action is in progress.

THE LOAD-BEARING RULE: every entry shows the robot MID-ACTION. Not "standing." Not "watching." Not "perched." Not "kneeling in flowers." VERB-IN-MOTION captured at the exact frozen moment of impact / strike / stride / discharge / sweep / scan / extraction.

━━━ ACTION VERB LEXICON ━━━

PHYSICAL EXERTION (mid-strike, mid-stride):
- "hammering [tool] into [surface]" — fragments flying, sparks scattering
- "ascending [terrain]" — feet stamping, dust trailing
- "wading through [substance]" — body half-submerged mid-stride
- "scoring/etching [hard surface]" with [tool] — debris cascading
- "shearing/cutting [obstacle]" with [manipulator] — sparks showering
- "threading [narrow gap]" — body articulating mid-passage
- "scaling [vertical surface]" — gripping mid-climb
- "breaching [barrier]" — explosive impact mid-fracture

DISCHARGE / FIRE / EMISSION (mid-pulse):
- "firing [weapon] at [target]" — muzzle flash mid-burst, casings ejecting
- "discharging seismic-pulse" — shockwave radiating outward
- "venting [substance]" mid-release — vapor/steam/sparks erupting
- "pulsing [scanner] across [terrain]" — beam mid-sweep
- "sweeping torchlight across [area]" — beam cutting through atmosphere

SAMPLING / EXTRACTION (mid-collect):
- "extracting [sample] from [substance]" — manipulator mid-grip
- "drilling into [hard surface]" — chips flying, friction-glow
- "scanning [terrain]" with [array] — light bouncing, data streaming
- "boring tunnel through [rock/ice]" — debris ejecting

SCOUTING / TRAVERSAL (mid-traverse):
- "tracking [trail] across [terrain]" — sensors lit, ground reading
- "patrolling [perimeter]" — periscope rotating, alarm-pulse
- "rappelling down [cliff]" — cable mid-deploy
- "leaping across [gap]" — airborne mid-arc
- "marching through [hostile environment]" — armor weathered, formation mid-stride

DEFENSE / ENGAGEMENT (mid-stance):
- "deflecting [projectile]" — shield mid-impact, sparks scattering
- "engaging [threat]" — weapon raised, optics locked
- "intercepting [missile]" — countermeasures mid-deploy

CONSTRUCTION / FORTIFICATION (mid-build):
- "welding [structure]" — torch mid-arc, white-hot sparks fountain
- "anchoring [stake/piton] into [surface]" — hammer mid-strike
- "planting [marker/flag] on summit" — staff mid-thrust into stone

━━━ HARD RULES ━━━

- 15-30 words per entry, dense
- Present-continuous verb (-ing form) in the action
- ENVIRONMENTAL DETAIL showing mid-progress (sparks flying / debris cascading / vapor erupting / fragments scattering / dust trailing)
- ONE specific dramatic action per entry
- FORBIDDEN verbs: standing, watching, perched, kneeling (unless mid-action), waiting, observing-passively, contemplating, gazing, resting, posing, sitting, looking
- FORBIDDEN tones: tranquil, peaceful, gentle, quiet, contemplative, serene, meditative
- The action MUST be visible in a still image — a frozen frame of motion, like a film still
- Variety across mission types — battle, sentinel, surveillance, exploration, breaching, cartography, extraction, construction

━━━ FEW-SHOT EXAMPLES (the energy to match) ━━━

- "Hammering rusted ice-pick into fractured polar seawall, plasma-cyan underlight pulsing with each strike, ice fragments arcing"
- "Ascending volcanic ridge mid-stride, footfalls stamping coordinates into volcanic glass, lava spatter trailing"
- "Wading through waist-high crystalline grass blades, brush-tipped fingers leaving ink traces on glass stalks"
- "Etching alien glyphs into purple sand with shock-prod manipulator, amber-gold targeting array casting geometric light"
- "Scoring crimson cliff face with white-hot cutting torch, basalt chips cascading, salt-corrosion crackling"
- "Threading shattered fortification rubble, magnetic-pad feet gripping fractured concrete, rebar shearing under wire-cutters"
- "Firing twin energy-weapons at fleeing target, muzzle flash silhouetting chassis, casings ejecting in spiral"
- "Hammering titanium pitons into basalt columns, stabilizer-piston feet anchoring as twin suns blaze through storm haze"
- "Sweeping searchlight beam across smoke-choked battlefield, dust motes catching the beam, alarm-klaxon pulsing"
- "Discharging seismic-pulse into glacier ice, white vapor erupting from emitter vents"
- "Drilling core-sample from frozen sub-soil, chips ejecting in arc, ozone-green underlight pulsing from vents"
- "Anchoring climbing rope through titanium carabiner mid-rappel, equipment harness swinging across sinkhole"
- "Stringing bioluminescent camp-lights between skeletal alien trees, prayer-bells chiming with movement"
- "Welding scavenged hull-plate mid-arc, white sparks fountain into night, helmet visor reflecting flame"
- "Leaping across collapsed bridge gap, body airborne mid-arc, hydraulic exhaust trailing"
- "Sweeping astrolabe crown to measure planetary tilt, electromagnetic discharge crawling across surface mid-rotation"
- "Pulsing scanner-dish across rust-red crater floor, colored scan-beams cutting downward in spectrum"
- "Marching through howling sandstorm in tight formation, tattered cloaks whipping, optical sensors glowing through dust"
- "Breaching ancient vault door with thermal-cutting torch, molten metal cascading"
- "Extracting glowing mineral specimen from cyan-bioluminescent fungus mass mid-grip, spores drifting like luminous snow"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry is a dense mid-action moment matching the few-shot examples in dynamism and density.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
