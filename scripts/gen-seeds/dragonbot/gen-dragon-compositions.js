#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_compositions.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DRAGON COMPOSITION descriptions for DragonBot — the POSE + SETTING + MOMENT a dragon is caught in. Species-agnostic (species comes from separate pool). Each entry 15-30 words. Cinematic concept-art framings.

━━━ SCOPE — POSE + SETTING + MOMENT ONLY ━━━
This pool describes HOW a dragon is arranged in frame. Do NOT describe the dragon's anatomy/species — that comes from a separate pool. Here describe:
- Pose / stance / action beat
- Environmental setting around the dragon
- Atmospheric moment (weather, time, peripheral elements)
- Scale-communication via surroundings

━━━ HARD DIVERSITY RULE ━━━
- BANNED: "tail coiled around tower/building/structure" — that cliché must not appear in this pool
- Across the 200-entry pool, no two compositions share the same pose-type AND same setting-type
- Rest-moment compositions ≥ 30 entries (sleeping, basking, quiet watch, preening, drinking, contemplating)
- Flight compositions ≥ 30 entries (soaring, diving, gliding, ascending)
- Ground/perched compositions ≥ 40 entries
- Submerged/cave/subterranean compositions ≥ 20 entries
- Peripheral-architecture compositions ≤ 30 entries total (castles/towers/ruins — not dominant)
- Natural-wilderness-only settings ≥ 50 entries (no architecture)
- Cosmic/atmospheric backdrop compositions ≥ 25 entries (aurora, storm, eclipse, dawn, nebula)

━━━ RULES ━━━
- NO species/anatomy details
- Each composition visibly distinct in pose AND setting from every other entry
- Sonnet invents the compositions freely — do not default to predictable tropes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
