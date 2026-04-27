#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/atmospheres.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC CONDITION descriptions for AncientBot's ancient civilization scenes. Each entry is 10-20 words describing the atmospheric quality of a scene — what's in the AIR. These compose with separate scene/lighting pools.

━━━ ATMOSPHERE TYPES (mix across all) ━━━
- Desert heat (heat shimmer rising from sun-baked stone, dry dusty air, bleached-white sky at horizon)
- Incense smoke (thick fragrant smoke drifting through temple colonnades, blue-gray haze catching light)
- River mist (dawn fog rising off water, soft edges on distant architecture, moisture beading on stone)
- Dust clouds (construction dust, desert wind carrying fine sand, golden particulate in light shafts)
- Rain (rare desert rain darkening stone, wet reflections on paving, storm clouds over monuments)
- Smoke (kiln smoke from pottery district, bronze-foundry haze, cooking fires, ceremonial fire smoke)
- Humid tropical (heavy wet air, condensation on stone, lush vegetation pressing close)
- Clear crisp (sharp shadows, crystalline air, infinite visibility to distant mountains)
- Sandstorm approaching (wall of ochre dust on horizon, dimming sun, people covering faces)
- Night atmosphere (cool desert air, star-dense sky, torch smoke rising straight in still air)
- Volcanic haze (Akrotiri/Thera, sulfurous tint, eerie diffused light)

━━━ RULES ━━━
- Each entry is ONE specific atmospheric condition
- Describe what's IN THE AIR — particles, moisture, smoke, temperature quality
- Include how it affects VISIBILITY and LIGHT
- 10-20 words
- Period-appropriate (no industrial smog, no car exhaust)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
