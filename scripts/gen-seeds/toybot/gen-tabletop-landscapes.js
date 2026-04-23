#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/tabletop_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} WARHAMMER / D&D TABLETOP-MINIATURE TERRAIN LANDSCAPE scene descriptions for ToyBot's tabletop-minis path. Handcrafted terrain dioramas — sculpted-foam rocks, lichen-trees, plaster ruins, resin-water, flocked-bases. Games-Workshop / Reaper / WizKids display-cabinet pro-painter aesthetic.

Each entry: 15-25 words. ONE specific tabletop-terrain landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty handcrafted terrain-diorama, NO miniatures. Sculpted terrain (sculpted-foam rocks / lichen-trees / plaster ruins / resin-water) IS the subject.
- ~70% Type B — ONE off-center 28mm-32mm painted fantasy miniature (visible brush-strokes, drybrushed highlights, flocked-base) in a specific body-shaping pose within a terrain-diorama. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Terrain dominates frame.

━━━ CONTEXT DNA ━━━
- Terrain environments: scorched battlefield / cobblestone courtyard / ruined temple / crumbling tower / dwarven hold gate / tavern interior / dungeon crawl chamber / siege-tower moat / graveyard crypt / cavalry-field / forest-tree-stump / ogre-crushing-cart / wizard sanctum / goblin cave / undead pirate-ship / black-dragon bridge / floor-trap temple / frost-giant snow-drift / dwarven forge-hall / lich-sarcophagus / mushroom-forest / paladin funeral-pyre / hobbit-village riverside / drow stealth / plaster ruins
- Miniature DNA: 28mm-32mm scale, painted pewter-or-plastic, visible brush-strokes, wash-shaded recesses, drybrushed highlights, metallic-armor-paint, freehand shield-crest detail, mounted on round flocked-base (static-grass / cork-rock / sand / snow texture). Archetype: knight / orc / dwarf / elf / wizard / skeleton / dragon / goblin / paladin / ranger / cleric / barbarian / necromancer / ogre

━━━ MUST-HAVE ━━━
- Reference PAINTED-MINIATURE / tabletop-scale / brush-strokes / flocked-base / terrain-diorama LANGUAGE
- Games-Workshop / Reaper / WizKids collector-grade display-cabinet aesthetic
- Specific fantasy archetype (dwarf / orc / wizard / knight / elf / dragon) — never "fantasy character"
- Type A = zero miniatures. Type B = exactly ONE miniature, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per terrain-type, vary archetype across entries

━━━ BANNED ━━━
- NO centered-hero miniature
- NO multi-miniature entries
- NO passive verbs
- NO game-IP proper nouns (Frodo / Gandalf / Drizzt / Space Marine chapter-names)
- NO CGI / illustration / digital-render

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
