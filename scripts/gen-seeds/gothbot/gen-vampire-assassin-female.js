#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_assassin_female.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-FEMALE archetype descriptions for GothBot. Each entry is 25-40 words. This is the character's identity / energy / story-flavor — NOT outfit (separate pool), NOT face details (separate pools). Just WHO she is and HOW she moves through the night.

CONTEXT: She is a HOT, ornate, agile, crafty, mean, resourceful vampire ASSASSIN. Castlevania + Devil May Cry + Van Helsing energy. She kills vampires for a reason — vengeance / duty / coin / vow / faith / lineage. She is BEAUTIFUL and DANGEROUS.

EVERY entry must include:
- Age range (early-twenties / mid-twenties / late-twenties / early-thirties / mid-thirties — adult prime, NEVER teen, NEVER elderly)
- Origin / archetype (heir to a hunter clan / ex-priestess turned avenger / mercenary blood-hunter / ronin-style lone wolf / noble-blood defying her cursed family / plague-doctor's apprentice / witch-hunter turned vampire-killer / operative of a secret holy order / cursed orphan trained by a master / convent-trained nun-assassin)
- ONE motivation hook (a vow on her dead lover / a mark on her wrist she can't explain / a sister she lost to a count / a debt to a dying mentor / a curse she's outrunning / a target she's stalked for ten years)
- ONE energy descriptor (calculating, predatory, cold, ferocious, sardonic, devout, mercenary, ruthless, focused, restless)

ABSOLUTELY BANNED:
- NO weathered / aged / haggard descriptions — she is HOT
- NO civilian / noblewoman-at-court / cosplay descriptions — she is a working assassin
- NO "she carries a sword" or outfit/weapon language — those go in other pools
- NO "she is beautiful" — show via cheekbones / posture / bearing, never tell

Examples (write fresh):
- "Mid-twenties huntress, sole heir to an ancient Belmont-style hunter clan, calculating and ruthless, a vow tattooed on her left wrist for the count who killed her mother"
- "Late-twenties ex-priestess turned holy avenger, ferocious and devout, a faded crucifix-burn on her palm marking the night she renounced her order"
- "Early-thirties mercenary blood-hunter, sardonic and crafty, hunting a specific target for ten years across three countries with a ledger of names hidden in her coat"
- "Mid-twenties noble-blood defying her cursed family, predatory and restless, hunting her own bloodline by night with a curse-mark on her throat she keeps hidden"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
