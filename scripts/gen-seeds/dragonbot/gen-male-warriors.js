#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_warriors.json',
  total: 200,
  batch: 50,
  banHumanLanguage: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} descriptions of EPIC fantasy WARRIORS for DragonBot — masculine, powerful, awe-inspiring war-heroes in ornate battle gear. 25-40 words each.

⚠️ RACE + ANATOMY FIRST. Open EACH entry with the fantasy RACE and 2-3 of that race's UNMISTAKABLE features (skin/scale/fur + tusks/horns/ears + build), so the image model renders the SPECIES, not a generic human. For a human warrior, give richly specific fantasy detail.

⛔ BANNED LANGUAGE (it makes the model render a generic modern human):
• NO age words/numbers (no "twenties/thirties/elderly/young/ancient/X-year-old"). Show seniority through grey-streaked beard, scars, weathered skin.
• NO "man / male / woman / female / boy / girl / person." Keep him unmistakably MASCULINE through BUILD (broad shoulders, barrel chest, heavy muscle), BEARD/jaw, war-braids, and the pronoun "he / his" — never the word "male" or "man".
• NO real-world nationality/ethnicity (no "Northern / desert / East-Asian / Mediterranean / Nordic"). Vary skin in the fantasy world's own palette: ebony, bronze, umber, olive, ash-grey, obsidian, crimson, scaled, iron-grey.

━━━ WHAT MAKES THEM EPIC ━━━
- ORNATE battle gear — intricate engraved plate, gilded war-pauldrons, masterwork chainmail, runic-inlay bracers, gem-clasped battle-cloaks, layered armor showing rank
- Faces that tell a STORY — battle scars, broken-and-healed noses, ritual tattoos, war paint, piercing intense eyes, strong jaw, braided beards with metal rings
- WARRIOR hair — war-braids with metal clasps, shaved-with-tattoos, wild grey-streaked manes, long battle-matted, cropped with scars showing through
- Powerful masculine build — massive arms, broad shoulders, battle-hardened physique under ornate armor
- Presence and authority — the scars and gear speak for themselves; "holy fuck" energy

━━━ ARMOR ORNAMENT LEVEL ━━━
Forged by LEGENDARY smiths — intricate metalwork, runic engravings, gemstone accents, layered textures (plate + chain + leather + fur + cloak). Battle-worn but clearly MASTERWORK. NOT generic steel-and-leather.

━━━ RACE DIVERSITY (spread across all ${n}) ━━━
- Human (richly specific fantasy look, varied fantasy-palette skin — NO real-world nationality)
- Elf (tall, angular, pointed ears, luminous eyes, lean but deadly, ageless lethal edge)
- Drow / Dark Elf (obsidian or ash-grey skin, white-silver hair, predatory grace)
- Dwarf (compact, massively muscled, ornate braided beards with metal and gems)
- Half-Orc / Orc (hulking, jutting tusks, green-grey skin, heavy brow, brutal presence)
- Tiefling (curling horns, crimson/violet/blue skin, pointed tail, infernal menace)
- Dragonborn (full scaled draconic head, reptilian snout, clawed, alien power)
- Goliath / Firbolg / Shadar-kai (stone-grey, towering, ashen — vary it)

━━━ DEDUP: APPEARANCE ━━━
No two share race + build + hair. Vary SKIN (ebony / bronze / porcelain / olive / ash-grey / obsidian / crimson / emerald-scaled / iron-grey), HAIR (shaved-tattooed / wild mane / braided war-knots / mohawk / silver-streaked / bald-scarred), EYES (steel-grey / amber / ice-blue / molten-gold / blood-red / emerald), FEATURES (scar across eye / broken nose / face tattoos / war paint / ringed beard / branded cheek), ARMOR (filigree plate / runed chainmail / fur-collared war-plate / dark assassin leather / gilded paladin / dragon-bone pauldrons), WEAPONS (greatsword / war hammer / dual axes / runed halberd / flame-blade / mace / spear).

━━━ RULES ━━━
- Open with the RACE + its anatomy (see RACE-FIRST rule above)
- Describe the CHARACTER only — no setting, no pose, no action (separate pools)
- Each is a unique individual you could recognize in a lineup
- Badass, ornate, awe-inspiring; clearly masculine via build + beard + "he"; no banned words
- No named IP characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
