#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_warriors.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} descriptions of STUNNING FEMALE fantasy warriors for DragonBot. Each is a beautiful, dangerous WOMAN in an ornate outfit. 25-40 words. Start every entry with "A beautiful female" or "A stunning woman" or "A gorgeous female" — the image model MUST know she is a woman.

━━━ WHO THESE WOMEN ARE ━━━
These are the most beautiful, exotic, awe-inspiring warrior women in all of high fantasy. When you see one, your jaw DROPS — not just because she's gorgeous, but because she radiates power, danger, and otherworldly beauty all at once. She looks like she could seduce a king and slay a dragon in the same breath.

Think: Yennefer, Ciri, Triss, Galadriel in battle mode, Melisandre, Daenerys but armed to the teeth. Exotic, ornate, breathtaking.

━━━ WHAT MAKES THEM STUNNING ━━━
- ORNATE fantasy outfits — intricate gold filigree armor, jeweled battle corsets, enchanted chainmail that hugs her form, elaborate pauldrons over bare shoulders, armored bodices with gemstone inlays, flowing battle-cloaks with embroidered runes
- Beautiful faces with DISTINCTIVE features — striking eyes, full lips, high cheekbones, beauty marks, face paint, exotic markings
- Hair that's a STATEMENT — elaborate war-braids with gold thread, flowing manes with jeweled pins, silver hair cascading over dark armor, wild curls threaded with enchanted beads
- Athletic feminine bodies — toned, strong, graceful, powerful curves under ornate armor
- Confidence and presence — she OWNS every room and battlefield she enters
- Exotic beauty — varied skin tones, unusual eye colors, ethereal features, otherworldly allure

━━━ ARMOR & OUTFIT ORNAMENT LEVEL ━━━
These outfits should look like they cost a FORTUNE. Intricate metalwork, gemstone inlays, enchanted materials that shimmer, elaborate engravings, layered textures (metal + leather + silk + fur). Every piece is a masterwork. NOT generic leather and steel — these are ROYAL armorsmiths' finest works worn by women who deserve nothing less.

━━━ RACE DIVERSITY (spread across all ${n}) ━━━
Humans are European descent ONLY — pale, fair, porcelain, olive Mediterranean, ruddy Nordic. This is a medieval European high-fantasy world.
- Human (pale Northern, fair-skinned, olive Mediterranean, ruddy Celtic, porcelain)
- Elf (tall, impossibly beautiful, ageless, elegant yet lethal, pale ethereal skin)
- Drow/Dark Elf (obsidian or ash-grey skin, white/silver hair, dangerous exotic beauty)
- Dwarf (compact, fierce, strong features, ornate braided hair with metal and gems, ruddy/fair)
- Half-Elf (mixed heritage, ethereal features on a human frame, pale or olive)
- Tiefling (horns, crimson/purple/blue skin, infernal allure, otherworldly gorgeous)
- Dragonborn (scaled, draconic, commanding, beautiful in an alien powerful way)

━━━ DEDUP: APPEARANCE ━━━
No two characters should share race + hair color + armor type. CRITICAL: no more than ONE character with red/copper/auburn hair. Spread hair colors WIDELY:
- SKIN: porcelain, olive, fair freckled, ruddy, pale, ash-grey, obsidian, crimson, emerald-scaled, sapphire-scaled
- HAIR: raven black, platinum blonde, honey blonde, ash brown, silver-white, jet black, strawberry blonde, chestnut, violet-black, snow white. MAX ONE red/copper/auburn across all ${n} entries
- EYES: amber, ice-blue, emerald, violet, heterochromia, gold-flecked, molten silver, storm-grey
- ARMOR STYLE: ornate plate with filigree, jeweled leather corset, enchanted chainmail, runed battle-robes, crystal-inlaid gauntlets, dragon-scale bodice, gilded war-harness
- WEAPONS: enchanted greatsword, twin curved daggers, ornate war bow, crystal-topped staff, runed spear, flame-wreathed blade, ice-forged axe

━━━ RULES ━━━
- EVERY entry MUST start with "A beautiful female..." or "A stunning woman..." or "A gorgeous female..." — MANDATORY for the image model
- Describe the CHARACTER only — no setting, no pose, no action (separate pools)
- Each is a unique individual you could recognize in a lineup
- Sexy, exotic, ornate, awe-inspiring — but NEVER trashy or gratuitous
- No named IP characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
