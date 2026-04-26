#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/character_details.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ANIME CHARACTER DETAIL descriptions for MangaBot — visual vocabulary pieces that stack onto any character. Hair, eyes, clothing texture, accessories, specific anime-art tropes.

Each entry: 6-14 words. One specific anime character visual detail.

━━━ CATEGORIES ━━━
- Anime eyes (big sparkling shoujo eyes, sharp shounen eyes, feline slit-eyes, heterochromia)
- Anime hair (flowing windswept long hair, gravity-defying spikes, side-braid, short bob with bangs)
- Kimono detail (obi-knot visible, trailing sleeves, silk pattern, embroidered crest)
- Haori detail (worn layered haori, patterned kimono-jacket, hunter-style crest)
- Sword-detail (katana at hip with tsuba ornament, wakizashi paired, naginata at back)
- Cybernetic layers (visible joint-seams, chrome plating, glow-pattern tattoos)
- Mecha-pilot suit (form-fitting with panel-lines, utility belt)
- Spirit-ears or animal features (fox-ears, cat-ears, wolf-tail, feathered arms)
- Traditional hair-accessories (kanzashi ornaments, silk flower ties)
- Weaponry-accessories (sheathed sword on back, kodachi pair, tanto dagger)
- Magical-girl accessories (wand, tiara, ribbon-bows, sparkle-earrings)
- Cyberpunk-jackets (oversized with neon-piping, patched-and-worn, AR-glasses)
- Geta wooden sandals with tabi socks
- Straw-hat kasa or amigasa
- Leather-strap armor-details
- Flowing-cape detail (battle-torn, wind-blown)
- Face-marks / tattoos (warrior clan markings, mystical symbols)
- Mask-details (oni mask on side of head, kitsune mask at belt, kabuki makeup)
- Rope-belt layered (wrestler, monk)
- Warrior-forehead-bands (hachimaki)
- Oversized-weapons (anime-trope huge sword)
- Charm / omamori amulet
- Long-scarf trailing behind running character
- Lantern-in-hand casting close warm glow
- Uniform-details (seifuku sailor collar, schoolboy gakuran)

━━━ RULES ━━━
- Anime-visual vocabulary
- Single-detail entries that stack onto characters
- Include specific named item where possible

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
