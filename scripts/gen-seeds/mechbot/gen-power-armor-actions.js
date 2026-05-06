#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's power-armor-infantry path. Each describes what the SQUAD is doing, 12-18 words. Squad-level coordination, not individual heroics.

━━━ ABSOLUTE RULES ━━━
- The action involves the WHOLE SQUAD (or visible coordination across multiple troopers)
- Mid-action freeze-frames — never static "lined up for the camera"
- Tactically grounded — these are professionals doing soldier-things

━━━ ACTION CATEGORIES ━━━
- Stack-and-breach (lined up at a doorway, point-man entering, others covering)
- Bounding overwatch advance (one element moving, another firing cover)
- Ridgeline overwatch (squad spread along high ground, glassing distance)
- Casualty drag (two troopers extracting a wounded teammate under fire)
- Orbital-drop deployment (mid-fall under canopies / pods opening)
- Patrol formation (squad in wedge or column moving through hostile area)
- Fire-and-maneuver (alternating bounds across a kill zone)
- Demolition setup (one trooper placing charges, others fanning a perimeter)
- VIP extraction (squad shielding a non-combatant, weapons outward)
- Last-stand defense (back-to-back perimeter, ammo low, enemies closing)

━━━ EXAMPLES (write fresh) ━━━
- "Stacked at a breach point, lead trooper readying door charge, three covering corners with weapons up"
- "Bounding overwatch across rubble, two firing cover from cover, two sprinting forward, one calling pace"
- "Squad shielding wounded comrade as two drag him backward, three suppressing the doorway with full-auto"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: tactic + squad-formation + visible action across multiple bodies.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
