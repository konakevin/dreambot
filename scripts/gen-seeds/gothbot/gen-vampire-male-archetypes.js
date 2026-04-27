#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_male_archetypes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE VAMPIRE ARCHETYPE descriptions for GothBot's vampire-boys path. Each entry is a SHORT phrase (8-15 words) describing WHO this vampire man IS — his role, his age, his energy, his story. NOT what he looks like — WHO he is. These get composed with separate makeup/wardrobe/hair pools.

━━━ ARCHETYPE SPREAD (enforce variety across ${n}) ━━━
- ANCIENT LORDS (5-6) — count who watched empires collapse from his tower, centuries-old patriarch of a dying vampire house, warlord who remembers battles history forgot, exiled prince from a kingdom erased from maps, collector of swords from wars no one alive remembers, nobleman who buried every mortal friend across five centuries
- HAUNTED / TRAGIC (4-5) — immortal scholar who grieves a mortal son dead four centuries, cursed monk who never asked for this, former priest twisted by immortality into something hollow, man who turned himself to save someone who forgot him, the oldest presence in the room and the most alone
- FERAL / WILD (4-5) — feral creature that hasn't spoken to humans in decades, wild thing living in abandoned cathedral crypts, freshly turned and violently furious about it, storm-chaser who vanishes into blizzards for years, something more wolf than man now
- OCCULT POWER (4-5) — vampire-sorcerer who bends shadow like fabric, seer who reads futures in bone and silence, alchemist searching for a cure he'll never use, keeper of forbidden texts older than written language
- MODERN PREDATORS (4-5) — corporate patriarch who's outlived seven companies he founded, art dealer who's been buying his own portraits for 400 years, architect who redesigns the same building every decade, surgeon who chose immortality to finish research no ethics board would allow
- DANGEROUS LONERS (3-4) — the one other vampires refuse to approach, silent figure in the corner of every gathering for centuries, wanderer who's walked every road in Europe carrying nothing

━━━ RULES ━━━
- Each entry is WHO he is, not WHAT he looks like
- Write like you're pitching a character to a film director — specific, evocative, loaded with story
- These should feel TROUBLED, HAUNTED, DANGEROUS — not romantic, not charming
- Mix ancient and modern, elegant and feral, controlled and chaotic
- No named IP (no Dracula, no Lestat by name)
- SAFETY: avoid "kills", "drains", "feeds on", "victims", "preys on" — these trip AI safety filters. Focus on WHO he is and his EMOTIONAL weight, not his violence

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
