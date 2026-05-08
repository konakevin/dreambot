#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_outfits_female.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-FEMALE OUTFIT descriptions for GothBot. Each entry is 30-50 words. The outfit is the SILHOUETTE — what defines her shape against the gothic backdrop. ORNATE, agile, sleek, deadly. Castlevania + Devil May Cry + Van Helsing aesthetic.

CONTEXT: She's HOT and an assassin. Outfits should look fitted, agile, gorgeous, dangerous — NEVER bulky generic-armor, NEVER LARP costume, NEVER flowing-princess-gown. Asymmetric cuts, silver-and-leather, intricate metalwork, tactical-couture.

VARIETY MANDATE — rotate widely across these silhouette traditions:
- Van-Helsing-style (long brown leather duster + silver-buckled bandolier + tall riding boots + tricorne hat or wide-brimmed hat)
- Castlevania-Belmont-style (military-cut coat with gold trim + thigh-strap holsters + cuffed boots + leather gauntlets)
- Devil-May-Cry-Lady-style (scarlet or oxblood long coat + black tactical corset + skinny tactical pants + tall heeled combat boots)
- Bloodborne-hunter-style (black wool greatcoat with high collar + leather buckles + iron-clasps + cravat or scarf)
- Witcher-school-style (fitted black-leather huntress armor + silver-and-steel chestplate + arm-guards + sword-harness)
- Victorian-mourning-asymmetric (asymmetric black bodice with silver-buttoned slashes + half-skirt over leather pants + thigh-strap pistol holster)
- Dueling-bodice (corseted leather bodice with silver-buckle cinch + flared half-coat + thigh-high stockings + heeled boots)
- Hooded-plague-hunter (dark-cloak with high hood + leather greatcoat under + silver-stake bandolier across chest + beaked half-mask hanging at throat)
- Ronin-cape-and-blade (long black cape over a fitted dueling-suit + silver-pommel sword sheath + asymmetric clasp at the throat)
- Convent-assassin (black habit modified — cropped at waist + leather pants + silver-cross at throat + half-corset visible at the cinch)

EVERY entry must include:
- Garment 1 (coat / cloak / cape / duster / greatcoat — outer layer)
- Garment 2 (corset / bodice / chestplate / under-coat — torso shape)
- Bottom (pants / skirt-and-leggings / leather-trousers / tactical-pants)
- Footwear (riding boots / heeled combat boots / cuffed leather boots / thigh-high boots)
- ONE silver/metal accent (silver buckles, silver-buttoned slashes, silver-thread embroidery, silver chain belt, silver chestplate edges)
- ONE asymmetric or ornate flourish (asymmetric clasp / ornate metal collar / pendant chain / vambrace pattern / cape-clasp at one shoulder)
- Optional headwear (tricorne / wide-brimmed hat / hood / no headwear)

ABSOLUTELY BANNED:
- NO bikini-armor, NO chainmail-bra, NO impractical exposed-cleavage. Sleek and DEADLY, not cheesecake.
- NO wedding-dress, NO ball-gown, NO princess-gown
- NO modern (zippers / synthetic / streetwear)
- NO Stormtrooper / Mandalorian / specific franchise armor lookalike
- NO bulky generic-RPG-armor

Examples (write fresh):
- "Long oxblood leather duster split at the back for agility, fitted over a black tactical corset with silver-thread sigil-embroidery, skinny black leather pants tucked into knee-high heeled combat boots, silver-buckle bandolier across the chest with stake-holsters, asymmetric silver collar-clasp at the throat"
- "Bloodborne-style black wool greatcoat with high collar and silver iron-buckles, dark grey leather under-coat cinched at the waist, charcoal tactical breeches, tall riding boots laced with silver wire, white cravat at the throat, wide-brimmed black hat tilted low"
- "Asymmetric black silk bodice with silver-buttoned diagonal slashes and a half-skirt of layered black-and-violet, leather leggings beneath, thigh-strap pistol holster visible, heeled combat boots cuffed at the knee, silver chain-mail vambraces, silver-skull pendant at the throat"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
