#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/accessories_female.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ornate ACCESSORY / ARMOR descriptions for a high-fantasy warrior woman. Each describes a specific flashy-detailed piece she's wearing — armor, jewelry, magical adornment, warrior ornament.

Each entry: 12-22 words. One specific piece per entry. Fantasy masterwork-level detail.

━━━ CATEGORIES TO MIX ━━━
- Armor pieces (pauldrons, bracers, gauntlets, chest pieces — ornate enchanted)
- Headpieces (crowns, circlets, helms, feathered bands, antler headdresses)
- Garments (cloaks, robes, warrior skirts, chainmail-silk, leather corsets)
- Jewelry (magical pendants, war-torc, ritual rings, enchanted earrings)
- Magical tattoos (runic brands, glowing sigils, etched script across body)
- War paint / warpaint / ritual paint
- Ceremonial sashes, braids with charms, bone-woven hair pieces
- Enchanted belts, bandoliers, weapon harnesses
- Gem-studded accessories (amethyst / ruby / emerald / onyx gems)

━━━ RULES ━━━
- Ornate flashy detail is non-negotiable
- Fantasy aesthetic — never modern / never realistic
- Coverage-appropriate (not pornographic, not nudity)

━━━ BANNED ━━━
- "posing" / "modeling"
- Specific race naming (race is a separate axis)
- Full-outfit descriptions (one piece per entry)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
