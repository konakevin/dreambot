#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/titan_war_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BATTLEFIELD descriptions for MechBot's titan-war-machines path. Each describes WHERE the titan combat is happening, 14-22 words. Includes scale-reference (tiny humans / tanks / aircraft) and atmospheric context (smoke / fire / debris).

━━━ SETTING CATEGORIES ━━━
- Destroyed urban skyline (skyscrapers half-collapsed, smoke columns, fires)
- Trench-and-line battlefield (artillery dugouts, infantry massed at base of titans)
- Coastal assault (titan wading into surf, naval ships behind)
- Desert warzone (sand kicked into massive plumes, distant artillery flashes)
- Frozen tundra (snow displaced by mech footfalls, white-out blizzard)
- Alien-jungle warzone (titanic trees being broken, biome reacting violently)
- Orbital drop zone (titan just-landed, impact crater visible, sky still showing drop trails)
- Forest clearing (broken treeline, fire spreading, titan silhouetted)
- Bridge or megastructure crossing (titan spanning a chasm, supports failing)
- Apocalyptic ruined city at night (only titan-silhouettes and weapon-glow visible)

━━━ ATMOSPHERIC ELEMENTS — INCLUDE IN EVERY ENTRY ━━━
- Tracer rounds, smoke plumes, fire, dust storms, lightning, debris fields, crater rings
- Tiny humans / tanks / aircraft / civilian vehicles for SCALE reference (titans dwarf everything)

━━━ EXAMPLES (write fresh) ━━━
- "Half-destroyed urban skyline at dusk, kilometer-high smoke columns, civilian cars overturned in foreground for scale"
- "Coastal beachhead under storm, titan thigh-deep in foaming surf, dropships overhead trailing missile streams"
- "Frozen tundra mid-blizzard, two titans silhouetted in white-out, infantry trenches at the foreground edge"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain + time-of-day + atmospheric element + scale-reference type.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
