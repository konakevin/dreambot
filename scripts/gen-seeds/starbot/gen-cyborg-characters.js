#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_female_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CYBORG WOMAN face/identity descriptions for StarBot. Each describes ONLY her organic face and which major body regions are mechanical — the brief has SEPARATE pools for skin tone, body type, hair, eyes, internal exposure, and glow color, so do NOT repeat those here.

Each entry: 20-30 words. Face ethnicity + which limbs/regions are mechanical + dominant material + one-word energy.

━━━ WHAT EACH ENTRY COVERS ━━━
- Face: ethnicity or alien-skin, bone structure, expression
- Mechanical layout: which limbs/regions are chrome vs organic (e.g. "both arms chrome from shoulder down, torso transparent panel")
- Dominant material: chrome, brass, carbon fiber, rose-gold, obsidian glass, ceramic, etc.
- Role word (spread EVENLY): assassin, scholar, surgeon, pilot, diplomat, dancer, oracle, engineer, priestess, huntress, medic, siren, navigator, architect, phantom

━━━ IMPORTANT — DIVERSITY OF ROLES ━━━
These cyborgs come from ALL walks of life. No more than 20% should be combat roles (assassin/huntress/phantom). The rest are civilian: scholars, surgeons, pilots, diplomats, dancers, oracles, engineers, priestesses, medics, navigators, architects, sirens. ALL are beautiful

━━━ WHAT NOT TO INCLUDE (handled by other pools) ━━━
- Skin tone details (separate pool)
- Eye color/style (separate pool)
- Hair style (separate pool)
- Body build/silhouette (separate pool)
- Internal exposure / translucent panels (separate pool)
- Glow color (separate pool)

━━━ DEDUP ━━━
Vary: face ethnicity + which body regions are mechanical + dominant material. No two entries should share the same ethnicity AND same mechanical layout.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
