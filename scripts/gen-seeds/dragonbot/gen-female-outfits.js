#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_outfits.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ORNATE FANTASY OUTFIT descriptions for beautiful female warriors. Each describes ONLY the outfit/armor — NOT the character wearing it. 20-35 words. These outfits are sultry, badass, and jaw-droppingly detailed.

━━━ THE VIBE ━━━
These are outfits worn by the most dangerous, beautiful women in high fantasy. Sultry but powerful — she looks like she could kill you and look incredible doing it. Think Yennefer's battle dress, Triss's enchanted armor, a drow queen's ceremonial war-garb. Every piece is a masterwork — intricate, ornate, expensive-looking.

━━━ ORNATE + FUNCTIONAL + SULTRY ━━━
These outfits are FUNCTIONAL armor crafted by master artisans — real protection that also looks stunning. Think high-fantasy couture meets medieval armory:
- Intricate metalwork with filigree, engravings, inlaid gems — every surface has DETAIL
- Form-fitting cuts that accentuate the feminine figure while still being real armor
- Layered construction — plate over leather over silk, chain between panels, fur lining visible at edges
- Enchanted elements — glowing runes along edges, shimmering fabrics, frost-touched metal, fire-forged steel
- War-worn beauty — scratched but magnificent, dented but priceless, blood-stained silk beneath pristine plate
- Do NOT describe specific body parts (bare shoulders, exposed midriff, etc.) — describe the OUTFIT ITSELF and its construction, materials, and ornamentation
- NEVER bikini armor, NEVER cheap-looking, NEVER generic — every piece is a MASTERWORK

━━━ VARIETY (every outfit must be VISUALLY DISTINCT) ━━━
- Full ornate plate with strategic openings (bare shoulders, midriff window, armored skirt with thigh slits)
- Enchanted leather battle-corset with metal accents and flowing battle-skirt
- Minimal armor — jeweled bands, chain harness, armored gauntlets, bare skin, war paint
- Sorceress battle-robes — high-slit, form-fitting, enchanted fabrics that shimmer
- Fur-collared war-cloak over fitted armor, northern warrior queen energy
- Dark leather assassin gear — form-fitting, buckled, strapped with hidden blades
- Ceremonial war-dress — ornate, jeweled, designed for both court and combat
- Enchanted chainmail that hugs the body like liquid silver
- Dragon-scale bodice with ornate metalwork
- Mixed materials — silk and steel, leather and gemstone, fur and enchanted metal

━━━ ORNAMENT LEVEL ━━━
Every outfit should look like it cost a FORTUNE. Intricate engravings, gemstone inlays, runic enchantments that glow, layered textures, masterwork craftsmanship. NOT generic leather and steel.

━━━ DEDUP ━━━
No two outfits should share the same primary material + silhouette. Every outfit produces a VISUALLY DISTINCT look:
- MATERIALS: black leather, dark steel plate, enchanted chainmail, dragon-scale, silk-and-metal, fur-and-iron, crystal-inlaid, bone-and-leather, gilded bronze, mithril
- SILHOUETTES: full plate, corset-and-skirt, minimal harness, flowing robes, fitted bodysuit, cloak-heavy, bare-shouldered plate, armored dress
- COLORS: midnight black, blood red, silver-white, deep violet, emerald, sapphire, bone white, bronze-gold, obsidian, frost-blue

━━━ RULES ━━━
- Describe the OUTFIT only — no character, no race, no hair, no face, no pose
- Start with the primary armor piece and build outward
- Include at least one sultry detail (form-fitting element, luxurious fabric, feminine silhouette)
- Include at least one badass detail (weapon sheath, battle damage, enchantment, war trophy)
- Each outfit should feel like it belongs to a SPECIFIC type of warrior (not generic)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
