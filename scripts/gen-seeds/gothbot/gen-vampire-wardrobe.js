#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_wardrobe.json',
  total: 100,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE WARDROBE descriptions for GothBot's vampire-girls-2 path. Each entry describes the dramatic fantasy-vampire wardrobe visible in a BUST or 3/4 portrait. Energy: D&D vampire character portrait, dark-fantasy paperback cover (Frazetta / Vallejo / Royo), Castlevania splash page (Ayami Kojima), dark-fantasy game character art (Diablo, Dragon Age vampire-noble, World of Warcraft blood-elf-aristocrat). NOT subdued period costume. NOT museum gown. DRAMATIC FANTASY-GLAMOUR-VAMPIRE wardrobe. Each entry: 14-22 words, comma-separated phrases.

ABSOLUTE RULES:
- DRAMATIC fantasy-vampire glamour — bold, ornate, character-portrait-tier
- ONE garment description per entry — wardrobe at the bust/3-4 framing visible (collar, bodice, sleeves, pauldrons, cape edge)
- Material + period/style + bold color + ornate detail
- SAFETY: never explicitly suggestive, never revealing — controlled glamour. Modest necklines or ornate covered necklines acceptable. The drama is in the gothic glamour, not the exposure.

━━━ WARDROBE SPREAD (mandatory variety across ${n} entries) ━━━

ROYAL VAMPIRE-QUEEN GOWNS (5-6) — vampire monarch energy:
- royal red-and-gold velvet gown with gold-embroidered bodice and ornate vampire crown of dark gold
- crimson satin Renaissance gown with gold filigree across the bodice and a ruby pendant at the throat
- oxblood-and-black brocade gown with gold-thread embroidery and an ornate baroque collar
- deep crimson velvet bodice with gold-embroidered vine motifs and a tarnished silver crown
- royal black-and-crimson gown with gold-leaf embroidery and a heavy ruby choker

GOTHIC-ARMOR / WARRIOR-HUNTRESS (4-5) — Van-Helsing-vampiress energy:
- black leather corset with brass buckles and dark-feathered shoulder pauldrons
- blackened-plate gorget at the throat with a leather corset bodice and silver-thread embroidery
- dark gothic-armor bodice with bat-wing pauldrons, brass-trimmed leather, embossed sigils
- black leather huntress corset with crimson cord lacing and a heavy silver crucifix at the chest
- obsidian-scale armor-bodice with leather pauldrons and a blood-red sash

DARK-NIGHT-GOWN GLAMOUR (4-5) — Carmilla / Crimson-Peak / dark-fairy-tale energy:
- black silk nightgown with antique lace at the bust, a crimson ribbon choker
- deep midnight-velvet gown off the shoulder with delicate silver beadwork along the neckline
- bone-white satin nightgown with black lace overlay and an ornate jet brooch at the throat
- black sheer gown over a corset bodice with silver embroidery and a black-orchid pin
- midnight-purple velvet gown with onyx beadwork crawling up the bodice like ivy

VICTORIAN GOTHIC FORMAL (4-5) — Bram-Stoker-Dracula's-bride energy:
- high-collared Victorian black gown with jet beadwork and a silver crucifix on a long chain
- mourning Victorian gown of black silk with a high lace collar and ornate cameo brooch
- Edwardian widow's gown of deep purple velvet with jet beadwork and a tarnished silver pendant
- Victorian high-necked black gown with a blood-red velvet ribbon and silver-thread embroidery
- Belle Époque ebony gown with crimson silk ruffles at the throat and a heavy garnet brooch

CEREMONIAL / RITUAL (3-4) — sorceress-priestess energy:
- ceremonial deep-red robes with gold ritual sigils embroidered at the collar and a heavy gold pendant
- black ritual gown with silver-thread spell-sigils running across the bodice and an ornate amulet
- deep-violet sorceress robes with gold-embroidered runes and a crystal pendant glowing faintly
- Castlevania-vampire-priestess gown of black satin with crimson sigils and a heavy obsidian collar

━━━ RULES ━━━
- 14-22 words per entry
- ONE complete dramatic vampire wardrobe per entry (bust-framing visible — collar, bodice, neckline, pauldrons)
- Bold dark-fantasy-vampire glamour; never subdued period costume
- SAFETY: controlled glamour, modest necklines or ornate-covered ones — the drama is in the gothic glamour, not exposure
- NO named IP characters
- Mix queen / huntress / nightgown / Victorian / ritual

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: garment archetype (queen/huntress/nightgown/Victorian/ritual) + dominant color + dominant material. Two entries are too similar if they share more than two of these.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
