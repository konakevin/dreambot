#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/warrior_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WARRIOR MERMAID ACTION descriptions for MermaidBot's mermaid-warrior path. Each entry is what an armored ocean warrior mermaid is DOING — battle, patrol, guardianship, training. Dynamic freeze-frames. SOLO fighter, no second combatant visible.

Each entry: 10-20 words. A specific warrior action.

━━━ CATEGORIES TO COVER ━━━
- Thrusting a coral-forged trident forward in a powerful lunging strike
- Patrolling a sunken fortress perimeter, scanning the dark water ahead
- Sharpening a blade of volcanic obsidian against a whetstone
- Pulling a battered shield from a fallen enemy's wreckage
- Charging through a cloud of silt with weapon raised, wake trailing behind
- Bracing against a current surge while holding a defensive position
- Inspecting battle scars across her tail with veteran familiarity
- Launching upward from an ambush position in a kelp forest
- Strapping on coral-plate armor, tightening abalone buckles
- Standing guard at an ancient temple entrance, trident planted beside her

━━━ BANNED ━━━
- Sitting / lying / resting passively / meditating
- "Posing", "modeling"
- Second combatant/enemy/victim visible
- Gore, severed limbs, blood

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + weapon/tool involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
