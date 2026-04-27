#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_male_ethnicities.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE VAMPIRE ETHNICITY descriptions for GothBot's vampire-boys path. Each entry describes a specific EUROPEAN ethnic background + the MASCULINE facial features that come with it. Vampires are ALWAYS of European descent. These anchor Flux to render a specific MALE face, not a generic one.

GENDER: These are MALE vampires. Say "vampire man" not just "vampire". Describe MASCULINE features — strong jaw, brow ridge, angular bone structure, facial hair texture.

━━━ FORMAT ━━━
Each entry: "{Region} vampire man — {masculine bone structure}, {eye shape + color}, {nose}, {lip shape}, {hair texture + color}, {skin undertone} beneath deathly pallor"

━━━ EUROPEAN ETHNICITY SPREAD (enforce variety across ${n}) ━━━
- Eastern European (5-6): Romanian, Hungarian, Serbian, Polish, Czech, Bulgarian, Croatian
- Western European (4-5): French, German, Dutch, Belgian, Austrian
- Northern European (4-5): Scandinavian-Norse, Finnish, Icelandic, Scots-Highland, Irish
- Southern European (4-5): Italian, Spanish, Greek, Portuguese, Sicilian
- British Isles (3-4): Welsh, English, Scottish
- Slavic (3-4): Russian, Ukrainian, Georgian, Balkan

Every entry should feel like a DIFFERENT man from a different region — not 25 versions of the same pale guy. European faces have huge variety: Mediterranean olive vs Nordic pale vs Slavic broad vs Celtic angular. Use that.

━━━ RULES ━━━
- Every entry MUST say "vampire man" — never just "vampire"
- Describe MASCULINE features: strong jawline, heavy brow ridge, angular cheekbones, Adam's apple, broader nose bridge
- Include skin undertone + how vampire-pallor interacts with it (Mediterranean olive goes ashen differently than Nordic pink-undertone)
- Be specific to the region — Romanian bone structure is different from Scandinavian
- No named individuals as reference

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
