#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/dark_elf_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DARK ELF ACTION descriptions for SirenBot's dark-elf path. Each entry is what a drow woman is DOING in her underground world — going about her daily life, unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific action.

━━━ CATEGORIES TO COVER ━━━
- Sharpening an obsidian blade on a whetstone, testing the edge with her thumb
- Moving silently along a cavern ledge, cloak trailing behind her
- Mixing luminous poisons in crystal vials by the light of a glowing mushroom
- Reading ancient runes carved into a cavern wall, tracing them with her fingers
- Descending a spiral staircase carved from living rock, hand on the rail
- Feeding a giant spider companion scraps of meat from her hand
- Practicing sword forms in a shadowed training hall, blade a blur
- Braiding silver wire into her hair before a polished obsidian mirror
- Inspecting spider-silk fabric held up to a bioluminescent light source
- Leaping across a chasm gap, caught mid-air with cloak billowing
- Crouching at the edge of a mushroom forest, scanning for prey
- Adjusting enchanted armor straps before descending into deeper tunnels

━━━ BANNED ━━━
- Sitting / lying passively / meditating / watching quietly
- "Posing", "modeling", looking at the camera
- Second figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + prop/tool involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
