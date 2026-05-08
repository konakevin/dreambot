#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_assassin_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-MALE archetype descriptions for GothBot. Each entry is 25-40 words. This is the character's identity / energy / story-flavor — NOT outfit (separate pool), NOT face details (separate pools). Just WHO he is and HOW he moves through the night.

CONTEXT: He is HOT, ornate, agile, crafty, mean, resourceful vampire ASSASSIN. Castlevania-Belmont + Devil May Cry-Dante + Van Helsing energy. He kills vampires for a reason — vengeance / duty / coin / vow / faith / lineage. He is BEAUTIFUL and DANGEROUS.

EVERY entry must include:
- Age range (early-twenties / mid-twenties / late-twenties / early-thirties / mid-thirties / late-thirties — adult prime, NEVER teen, NEVER elderly)
- Origin / archetype (Belmont-style heir to a hunter clan / ex-priest turned avenger / mercenary blood-hunter / ronin-style lone wolf / noble-blood defying his cursed family / plague-doctor's apprentice / witch-hunter turned vampire-killer / operative of a secret holy order / cursed orphan trained by a master / ex-soldier with a debt / cursed half-breed hunting his own / Dante-style supernatural-mercenary)
- ONE motivation hook (a vow on his dead lover / a brand on his palm he can't explain / a brother he lost to a count / a debt to a dying mentor / a curse he's outrunning / a name he's stalked for ten years / a master he's avenging)
- ONE energy descriptor (calculating, predatory, cold, sardonic, devout, mercenary, ruthless, focused, restless, world-weary, smirking)

ABSOLUTELY BANNED:
- NO weathered / aged / haggard descriptions — he is HOT
- NO civilian / nobleman-at-court / cosplay descriptions — he is a working assassin
- NO "he carries a sword" or outfit/weapon language — those go in other pools
- NO "he is handsome" — show via jawline / posture / bearing, never tell

Examples (write fresh):
- "Late-twenties heir to a Belmont-style hunter clan, calculating and ruthless, a vow tattooed on his right wrist for the count who killed his father"
- "Mid-thirties Dante-style supernatural mercenary, sardonic and smirking, a price-list tucked in his coat and a brand on his palm marking the night he sold his name"
- "Early-thirties ex-priest turned avenger, devout and cold, a faded crucifix-burn on his chest where he renounced his order to hunt the bishop who tried to silence him"
- "Mid-twenties ronin-style lone wolf, focused and restless, a sigil-scar bisecting his eyebrow from a silver crucifix that saved his life"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
