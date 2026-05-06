#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/industrial_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's industrial-machines path. Each describes what the machine is DOING — productive industrial work, 12-18 words.

━━━ ABSOLUTE RULE — PRODUCTIVE WORK ━━━
The machine is working. NEVER fighting, NEVER abandoned, NEVER ceremonial. Doing industry-things RIGHT NOW.

━━━ ACTION CATEGORIES ━━━
- Drilling through rock face (dust plume / sparks / vibration)
- Lifting / hauling cargo container (counterweight stress / hydraulic groan)
- Welding girders (sparks raining / arc-flash / weld bead glowing)
- Excavating earth (bucket scoop / soil cascading / piston extension)
- Refining / processing material (smoke / heat-shimmer / catalyst glow)
- Surveying terrain (scanner sweep / sample collection / probe deployment)
- Maintenance on itself or another machine (panel open / arms reaching inside)
- Loading bulk material onto a transport (clamps closing / cargo container settling)
- Pile-driving foundation work (impact / shockwave dust ring)
- Towing or pushing a stuck rig (cables strained / wheels spinning)

━━━ BANNED ━━━
- NO combat / weapons-fire (titans territory)
- NO ceremonial idle (robot-moment territory)
- NO abandoned/decay (rust-apocalypse territory)

━━━ EXAMPLES (write fresh) ━━━
- "Grinding through a rock face with diamond drill, dust plume rising, hydraulic arms compressing under load"
- "Welding a girder mid-air, arc-flash backlighting the operator-frame, sparks raining onto deck plating"
- "Lifting a thirty-ton cargo container onto a transport tractor, hydraulic legs straining, counterweight pivoting"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: industry verb + body part involved + visible byproduct (dust / sparks / steam / fluid).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
