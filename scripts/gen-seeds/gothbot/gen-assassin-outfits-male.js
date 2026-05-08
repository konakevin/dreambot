#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_outfits_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-MALE OUTFIT descriptions for GothBot. Each entry is 30-50 words. The outfit is the SILHOUETTE — what defines his shape against the gothic backdrop. ORNATE, agile, sleek, deadly. Castlevania-Belmont + Devil May Cry-Dante + Van Helsing aesthetic.

CONTEXT: He's HOT and an assassin. Outfits should look fitted, agile, gorgeous, dangerous — NEVER bulky generic-armor, NEVER LARP costume, NEVER schlubby-hunter. Asymmetric cuts, silver-and-leather, intricate metalwork, tactical-couture for men.

VARIETY MANDATE — rotate widely across these silhouette traditions:
- Van-Helsing-style (long brown leather duster + silver-buckled bandolier across chest + tall riding boots + tricorne or wide-brimmed hat)
- Castlevania-Belmont-style (military-cut coat with gold trim + thigh-strap holsters + cuffed boots + leather gauntlets)
- Devil-May-Cry-Dante-style (long red or oxblood greatcoat over a black tactical-shirt + leather pants + tall combat boots + open-coat showing weapons-on-back)
- Bloodborne-hunter-style (black wool greatcoat with high collar + leather buckles + iron-clasps + cravat + tricorne)
- Witcher-style (fitted black-leather huntsman armor + steel chestplate + sword-harness on back + arm-guards)
- Victorian-asymmetric-duelist (asymmetric black tailcoat with silver-buttoned slashes + tactical breeches + heeled boots + cravat at the throat)
- Hooded-plague-hunter (dark-cloak with high hood + leather greatcoat under + silver-stake bandolier across chest + beaked half-mask hanging at throat)
- Ronin-cape-and-blade (long black cape over a fitted dueling-suit + silver-pommel sword sheath + asymmetric clasp at the throat)
- Templar-style (black tabard with silver-cross over chainmail-shirt + leather pants + cuffed boots + sword-belt)
- Constantine-trenchcoat-style (long black trenchcoat over white shirt + black tie undone + tactical pants + cuffed boots — modern-Victorian fusion)

EVERY entry must include:
- Garment 1 (greatcoat / duster / cape / trenchcoat / tailcoat — outer layer)
- Garment 2 (vest / chestplate / undershirt / tactical-shirt — torso)
- Bottom (leather pants / tactical breeches / cuffed trousers)
- Footwear (riding boots / cuffed combat boots / heeled leather boots / tall boots)
- ONE silver/metal accent (silver buckles, silver-buttoned slashes, silver chain belt, silver chestplate trim, silver-thread embroidery)
- ONE asymmetric or ornate flourish (asymmetric clasp / ornate metal collar / pendant chain / cape-clasp at one shoulder / silver gauntlet)
- Optional headwear (tricorne / wide-brimmed hat / hood / no headwear)

ABSOLUTELY BANNED:
- NO bare-chested barbarian, NO loincloth, NO impractical exposed-torso. Sleek and DEADLY, not pin-up.
- NO casual modern (zippers / synthetic / streetwear / hoodies)
- NO Stormtrooper / Mandalorian / specific franchise armor lookalike
- NO bulky generic-RPG-knight-armor
- NO wedding-tuxedo, NO ball-suit

Examples (write fresh):
- "Long oxblood greatcoat split at the back for agility, fitted over a black tactical vest with silver-thread cross-embroidery, leather pants tucked into knee-high cuffed combat boots, silver-buckle bandolier across the chest with stake-holsters, asymmetric silver collar-clasp at the throat"
- "Bloodborne-style black wool greatcoat with high collar and silver iron-buckles, dark grey leather under-coat cinched at the waist, charcoal tactical breeches, tall riding boots laced with silver wire, white cravat at the throat, wide-brimmed black hat tilted low"
- "Asymmetric black silk tailcoat with silver-buttoned diagonal slashes and a long split-tail, black tactical breeches, heeled leather boots cuffed at the knee, silver chain-mail vambraces, silver-skull pendant at the throat, cravat half-undone"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
