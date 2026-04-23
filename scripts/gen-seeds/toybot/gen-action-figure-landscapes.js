#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/action_figure_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ACTION-FIGURE-PLAYSET LANDSCAPE scene descriptions for ToyBot's action-figure path. Collector-grade 1/12-scale playsets (Hot-Toys / Mezco / NECA / Hasbro-Black-Series style) — handcrafted weathering, paint-detail, display-cabinet dramatic lighting.

Each entry: 15-25 words. ONE specific action-figure-playset landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty playset diorama, NO figures. Collector-diorama environment IS the subject.
- ~70% Type B — ONE off-center 1/12-scale articulated action-figure in a specific body-shaping pose within a playset environment. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Landscape/diorama dominates frame.

━━━ CONTEXT DNA ━━━
- Playset environments: post-apocalyptic wasteland / abandoned warehouse / ruined temple / spaceship interior / urban-warfare street / haunted mansion / alien surface / pirate-ship deck / dungeon / carnival / zombie-fortification / medieval forge / scrapyard / subway / desert convoy / observatory / sacred grove / jungle-ruin / crashed-UFO / arctic-station / Western saloon / biotech lab / space-cargo-bay / castle courtyard
- Figure DNA: articulated 1/12-scale, ball-joints visible, hand-painted weathering, hard-plastic body, cloth-hybrid costume, accessories at scale

━━━ MUST-HAVE ━━━
- Reference ACTION-FIGURE / 1/12-scale / ball-joint / collector-diorama / handcrafted-miniature LANGUAGE
- Collector-grade weathering + paint detail language
- Type A = zero figures. Type B = exactly ONE figure, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type

━━━ BANNED ━━━
- NO centered-hero figure
- NO multi-figure entries
- NO passive verbs
- NO real IP set-names (Star Wars / Marvel / Transformers / GI Joe / He-Man / COBRA specific names)
- NO CGI / illustration / photorealism

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
