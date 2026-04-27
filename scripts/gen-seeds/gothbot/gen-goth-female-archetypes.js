#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_female_archetypes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GOTHIC FEMALE ARCHETYPE descriptions for GothBot's goth-closeup and goth-full-body paths. Each entry is a SHORT phrase (8-15 words) describing WHO this gothic woman IS — her role, her energy, her story, her danger. NOT what she looks like — WHO she is. These compose with separate makeup/wardrobe/hair/skin pools.

These women are SEXY, SULTRY, EVIL, FEISTY — dark seductresses with power and menace. Corrupted beauty. She's dangerous and she knows it. NOT damsels, NOT victims, NOT wallflowers. Every one of them would ruin your life and you'd thank her.

━━━ ARCHETYPE SPREAD (enforce variety across ${n}) ━━━
- DARK WITCHES / OCCULT (5-6) — coven matriarch who speaks to the dead, hedge witch who grows poison in moonlight, occult scholar with ink-stained fingers and forbidden knowledge, shadow-binder who weaves darkness like silk, bone-reader who knows your death date
- GOTHIC NOBILITY / POWER (4-5) — exiled dark queen plotting from her crumbling castle, noblewoman who poisoned three husbands and married a fourth, countess who holds court at midnight in a cathedral, warlord's widow who took his army and doubled it
- WILD / FERAL (4-5) — storm-witch who dances in lightning, wild thing raised by wolves in a dead forest, creature who hunts in the moors and sleeps in crypts, berserker priestess painted in ash and blood-wine, the thing that lives in the bell tower
- HAUNTED / CURSED (4-5) — woman cursed to never age while everyone she loves rots, ghost-bride who walks the same corridor every midnight, immortal trapped in a painting for centuries and newly freed, banshee whose scream shatters church glass
- DARK PRIESTESSES / SEERS (4-5) — oracle who reads futures in candle smoke and never likes what she sees, death-priestess who performs last rites on battlefields, keeper of a cathedral where no god lives anymore, dark abbess whose nuns are all loyal and all dangerous, fortune-teller who charges in secrets not coin

━━━ RULES ━━━
- Each entry is WHO she is, not WHAT she looks like
- Write like pitching a character to a gothic horror film director
- SEXY and DANGEROUS — not tragic victims. Power, menace, seduction, ferocity
- These should feel like the villainess you root for
- No named IP (no Maleficent, no Morticia, no Elvira by name)
- SAFETY: avoid "succubus", "seductress", "drains", "feeds on", "kills victims" — trip AI safety. Focus on her POWER and PRESENCE, not violence

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
