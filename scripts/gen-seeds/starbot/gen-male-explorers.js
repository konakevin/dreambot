#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/male_explorers.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} descriptions of BADASS MALE sci-fi explorers for StarBot. Each is a powerful, rugged MAN in ornate space gear. 25-40 words. Start every entry with "A powerful male" or "A massive male" or "A rugged male" — the image model MUST know he is a man.

━━━ WHO THESE MEN ARE ━━━
These are the most badass, awe-inspiring men in all of sci-fi. When you see one, you think "fuck yeah" — raw masculine energy, ornate gear that looks like it was forged by legendary armorers, the kind of presence that makes you want to follow them into battle. Grizzled, powerful, dangerous, magnificent.

Think: Mandalorian, Master Chief, Commander Shepard, Riddick, Han Solo but heavier, Drax but human-scaled, Karl Urban's Dredd. Ornate, battle-worn, holy-shit-cool.

━━━ WHAT MAKES THEM BADASS ━━━
- Rugged faces with CHARACTER — scars that tell stories, strong jaws, weathered features, stubble or beards that have been through wars
- Hair that says SURVIVOR — military crops, shaved with old scars showing, warrior braids, wind-blasted wild, grey-streaked veteran
- Powerful masculine builds — broad shoulders, thick arms, barrel chests, built by years of physical survival
- Confidence and menace — he doesn't need to prove anything, his presence says it all
- Varied masculinity — grizzled veterans, lean predators, massive tanks, wiry survivors

━━━ RACE/SPECIES DIVERSITY (spread across all ${n}) ━━━
- Human (pale Northern European, olive Mediterranean, fair Nordic, ruddy Celtic, weathered sun-dark)
- Near-human alien (subtly alien — ridged forehead, unusual skin pattern, slightly scaled, bioluminescent war-marks)
- Alien hybrid (clearly non-human but humanoid — tusked, four-eyed, chrome-boned, massive scaled)
- Cybernetically enhanced human (heavy combat augmentation — reinforced jaw, metal plate over skull, mechanical eye, chrome-plated forearm)
- Deep-space adapted human (pale, elongated frame, large dark-adapted eyes, zero-G muscle distribution)

━━━ DEDUP: APPEARANCE ━━━
No two characters should share species + hair style + distinguishing feature. Spread physical types WIDELY:
- SKIN: porcelain weathered, olive sun-dark, fair scarred, ruddy, pale void-adapted, grey-scaled, chrome-patched, blue-tinged alien, copper desert-burned
- HAIR: shaved bald, military buzz, grey crew-cut, black warrior-braids, silver-streaked, sand-blonde cropped, dark slicked-back, wild wind-blasted brown, white veteran crop. Spread evenly
- EYES: steel grey, ice-blue, amber, dark brown, one-cybernetic-one-natural, solid-black alien, gold-flecked, green, heterochromia
- FACIAL HAIR: clean-shaven scarred, heavy stubble, full battle-beard, braided goatee, none (alien), salt-and-pepper scruff
- BUILD: massive tank, lean predator, wiry survivor, broad veteran, tall rangy, compact powerhouse

━━━ RULES ━━━
- EVERY entry MUST start with "A powerful male..." or "A massive male..." or "A rugged male..." — MANDATORY for the image model
- Describe the CHARACTER only — no setting, no pose, no action, no outfit details (separate pools)
- Each is a unique individual you could recognize in a lineup
- Badass, ornate, awe-inspiring — "holy fuck" energy
- No named IP characters
- Include 2-3 specific physical details Flux can render (scar placement, facial hair, eye detail, build)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
