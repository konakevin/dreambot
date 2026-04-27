#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_skin_corruption.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE SKIN CORRUPTION descriptions for GothBot's vampire portrait paths. Each entry is a SHORT phrase (15-25 words) describing the specific dead/corrupted state of a vampire's skin and flesh. These compose with separate archetype/makeup/hair pools.

These are NOT living people. They are DEAD things wearing faces. The skin should make the viewer uncomfortable — gorgeous but deeply WRONG. Cracked, veined, translucent, decayed, cold.

━━━ VARIETY SPREAD ━━━
- CRACKED / PORCELAIN (5-6) — hairline fracture-lines across cheekbone like aged porcelain, crack running from corner of mouth toward ear, fine craquelure webbing across forehead like a Renaissance painting left in the cold, skin splitting at the jaw-hinge revealing darkness beneath
- VEINED / TRANSLUCENT (5-6) — dark blue-black vein network visible beneath paper-thin skin at temples and throat, veins pulsing faintly with dark ichor visible through translucent flesh, spider-web of indigo veins radiating from eye sockets, vein map visible across entire face like a diagram of something that should be hidden
- SUNKEN / SKELETAL (5-6) — cheekbones jutting sharp enough to tear through from inside, eye sockets sunken into dark hollows, temples concave and shadowed, orbital bone visible through stretched translucent skin, jaw gaunt and angular with tendons visible at the neck
- COLD / DISCOLORED (4-5) — blue-grey undertone to all flesh like a body pulled from cold water, violet-tinged skin around eyes and mouth, grey-white pallor with patches of darker bruise-color at pressure points, frost-rime forming at hairline and eyebrow
- TEXTURAL / UNSETTLING (4-5) — skin with a wax-like sheen that catches light wrong, matte chalky texture like old plaster, surface too smooth and too still like a mask, faint grey mottling across the bridge of the nose like stone weathering

━━━ RULES ━━━
- Each entry describes SPECIFIC visible corruption details — what you SEE on the skin
- Gender-neutral — no "her" or "his", just describe the skin itself
- GORGEOUS but WRONG — the corruption is part of the beauty, not fighting it
- Include WHERE on the face/body the detail appears (temples, cheekbones, throat, under-eyes)
- No wounds, no open cuts, no active bleeding — this is ancient decay, not fresh injury
- No rot, no maggots, no exposed muscle — elegant death, not horror-movie gore

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
