#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/micro_details.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MICRO DETAIL descriptions for DinoBot — extreme close-ups of dinosaur anatomy. Macro wildlife photography of prehistoric animals.

Each entry: 15-25 words. One specific anatomical detail at macro/extreme-close-up scale.

━━━ CATEGORIES ━━━
- Eye close-up: iris colors, pupil shape, reflections of the world in the eye, protective membrane
- Scale texture: overlapping patterns, color gradients, mud caught between scales, iridescence
- Feather detail: barb structure, color banding, dew drops on feathers, wind-ruffled edges
- Claw/talon: curved keratin, scratches and wear marks, dirt beneath, retracted vs extended
- Teeth/jaws: serrations on a tooth edge, drool strands, gum texture, replacement teeth growing in
- Skin texture: wrinkled hide, scars from old wounds, parasites on skin, peeling shed
- Horns/crests: growth rings, keratin sheath texture, battle damage, blood vessels visible
- Feet/footprints: calloused pads, mud between toes, the imprint left in soft ground
- Nostril/snout: breath condensation, moisture, whisker-like sensory structures
- Eggshell: surface texture, hairline cracks, embryo shadow through translucent shell

━━━ RULES ━━━
- EXTREME close-up, macro lens perspective
- Include texture, wear, and environmental evidence (mud, water, parasites)
- Scientifically informed anatomy
- The detail should make the animal feel REAL and alive

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
