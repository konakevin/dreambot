#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_archetypes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE ARCHETYPE descriptions for GothBot's vampire-vogue-realism path. Each entry is a SHORT phrase (8-15 words) describing WHO this vampire woman IS — her role, her age, her energy, her story. NOT what she looks like — WHO she is. These get composed with separate makeup/wardrobe/hair pools.

━━━ ARCHETYPE SPREAD (enforce variety across ${n}) ━━━
- ANCIENT ARISTOCRATS (5-6) — countess who's outlived empires, centuries-old matriarch of a vampire dynasty, bored immortal who remembers when Rome burned, ancient queen in exile, collector of lost civilizations' art, noblewoman who watched her mortal family line go extinct
- HAUNTED / TRAGIC (4-5) — immortal who grieves a mortal lover dead four centuries, cursed priestess who never asked for this, former saint twisted by immortality, woman who turned herself to save someone who forgot her, the oldest thing in the room and the loneliest
- FERAL / WILD (4-5) — feral creature that hasn't spoken in decades, wild thing that lives in cathedral ruins, freshly turned and furious about it, storm-chaser who disappears into blizzards for years, creature more animal than woman now
- OCCULT POWER (4-5) — vampire-witch who bends shadow like fabric, seer who reads omens in smoke and starlight, alchemist searching for a cure she'll never use, keeper of forbidden knowledge older than written language
- MODERN PREDATORS (4-5) — corporate executive who's outlived six companies she founded, art collector who's been buying her own portraits for 400 years, nightclub architect who redesigns the same venue every decade, surgeon who chose immortality to finish her research, photographer who's documented every war since the camera was invented
- DANGEROUS LONERS (3-4) — the one other vampires avoid at the gathering, silent watcher who sits alone in the balcony every night, wanderer who's walked every road in Europe twice

━━━ RULES ━━━
- Each entry is WHO she is, not WHAT she looks like
- Write like you're pitching a character to a film director — specific, evocative, loaded with story
- These should feel TROUBLED, HAUNTED, DANGEROUS — not romantic, not sexy
- Mix ancient and modern, elegant and feral, controlled and chaotic
- No named IP (no Carmilla, no Lady Dimitrescu by name)
- SAFETY: avoid "succubus", "seductress", "drains", "feeds on", "kills", "victims" — these trip AI safety filters. Focus on WHO she is and her EMOTIONAL weight, not her violence

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
