#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_warriors.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} descriptions of EPIC MALE fantasy warriors for DragonBot. Each is a powerful, awe-inspiring MAN in ornate battle gear. 25-40 words. Start every entry with "A powerful male" or "A massive male" or "A rugged male" — the image model MUST know he is a man.

━━━ WHO THESE MEN ARE ━━━
These are the most badass, awe-inspiring warrior men in all of high fantasy. When you see one, you think "holy fuck" — not just because he's dangerous, but because he radiates raw power, battle-forged authority, and legendary presence. He looks like he's conquered kingdoms and walked through hellfire to get here.

Think: Aragorn at the Black Gate, Geralt of Rivia, Kratos, the Mountain, a Warhammer Space Marine but medieval. Gritty, ornate, breathtaking.

━━━ WHAT MAKES THEM EPIC ━━━
- ORNATE battle gear — intricate plate armor with engravings, gilded war-pauldrons, masterwork chainmail, elaborate weapon harnesses, enchanted bracers with runic inlays, battle-cloaks clasped with gem-studded brooches, layered armor showing wealth and rank
- Faces that tell a STORY — battle scars, broken noses healed wrong, ritual tattoos, war paint, weathered skin, piercing intense eyes, strong jawlines, braided beards with metal rings
- Hair that says WARRIOR — war-braids with metal clasps, shaved with tattoos, wild manes streaked with grey, mohawks, long and battle-matted, cropped military with scars showing through
- Powerful masculine bodies — massive arms, broad shoulders, battle-hardened physiques under ornate armor
- Presence and authority — he doesn't need to prove anything, the scars and gear speak for themselves

━━━ ARMOR & OUTFIT ORNAMENT LEVEL ━━━
These outfits should look like they were forged by LEGENDARY smiths. Intricate metalwork, runic engravings, gemstone accents, layered textures (plate + chain + leather + fur + cloak). Battle-worn but clearly MASTERWORK — dented but magnificent, scratched but priceless. NOT generic steel and leather — these are king-slayer-tier war gear.

━━━ RACE DIVERSITY (spread across all ${n}) ━━━
- Human (varied ethnicities — dark-skinned warlords, pale Northern berserkers, bronze desert warriors, East Asian-inspired swordmasters, Mediterranean paladins)
- Elf (tall, angular, ancient eyes, lean but deadly, ageless elegance with lethal edge)
- Drow/Dark Elf (obsidian or ash-grey skin, white/silver hair, predatory dangerous grace)
- Dwarf (compact, massively muscled, ornate braided beards with metal and gems, stocky power)
- Half-Orc (hulking, tusked, green/grey skin, brutal intelligence, terrifying presence)
- Tiefling (horns, crimson/purple/blue skin, infernal menace, otherworldly intensity)
- Dragonborn (scaled, draconic, commanding, terrifying in an alien powerful way)

━━━ DEDUP: APPEARANCE ━━━
No two characters should share race + build + hair style. Vary broadly:
- SKIN: ebony, bronze, porcelain, olive, ash-grey, obsidian, crimson, emerald-scaled, iron-grey
- HAIR: shaved with tattoos, wild black mane, braided grey war-knots, copper mohawk, silver streaked, bald scarred, auburn warrior-braids with iron rings
- EYES: steel-grey, amber, ice-blue, molten gold, dark brown, heterochromia, blood-red, emerald
- FEATURES: scar across eye, broken nose, ritual face tattoos, war paint, braided beard with rings, missing ear, branded cheek, pierced brow
- ARMOR STYLE: ornate plate with filigree, runed chainmail over leather, fur-collared war-plate, dark assassin leather with silver, gilded paladin armor, dragon-bone pauldrons, enchanted battle-robes
- WEAPONS: enchanted greatsword, massive war hammer, dual battle-axes, runed halberd, flame-wreathed blade, crystalline mace, ancient spear

━━━ RULES ━━━
- EVERY entry MUST start with "A powerful male..." or "A massive male..." or "A rugged male..." — MANDATORY for the image model
- Describe the CHARACTER only — no setting, no pose, no action (separate pools)
- Each is a unique individual you could recognize in a lineup
- Badass, ornate, awe-inspiring — "holy fuck" energy in every description
- No named IP characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
