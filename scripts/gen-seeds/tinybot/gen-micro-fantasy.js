#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/micro_fantasy.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MICRO-FANTASY scene descriptions for TinyBot — miniature-scale magical worlds. Tiny wizard towers, fairy bridges, miniature ruins, glowing portals hidden in moss, spell circles inside terrariums, enchanted miniature kingdoms. Everything at DOLLHOUSE SCALE — these are miniature fantasy dioramas, not full-scale fantasy landscapes.

Each entry: 15-25 words. One specific micro-fantasy scene with scale + magic details.

━━━ CATEGORIES (spread across all) ━━━
- Tiny wizard tower (crooked, glowing windows, books stacked, star charts, telescope on roof, potion bottles)
- Fairy bridge (spanning a puddle, made of twigs + vines, lantern-lit, moss-covered stone arch)
- Miniature ruins (crumbling tiny castle, overgrown with moss + ivy, glowing runes, ancient columns)
- Glowing portal (hidden in moss, between tree roots, inside a hollow log, ringed with mushrooms)
- Spell circle (etched in sand, glowing sigils on a flat stone, candles arranged in pattern, inside terrarium)
- Enchanted garden gate (wrought iron tiny gate, glowing path beyond, fairy lights strung)
- Tiny apothecary shop (shelves of mini bottles, dried herbs hanging, mortar + pestle, crystal display)
- Miniature crystal cave (amethyst walls, glowing pools, stalactites dripping light)
- Fairy market stall (selling tiny potions, enchanted fruit, spell scrolls, crystal balls)
- Tiny enchanted library (floating books, glowing ink, spiral staircase, candle-lit reading nook)
- Miniature dragon's lair (treasure hoard at dollhouse scale, sleeping baby dragon, gold coins)
- Enchanted treehouse (spiraling around a bonsai, rope ladder, lantern porch, leaf-shingle roof)
- Tiny mushroom village (glowing caps, doors + windows carved in stems, smoke from chimneys)
- Miniature observatory (brass telescope, star charts, revolving dome, celestial globe)
- Enchanted well (wishing well with glowing water, coins at bottom, moss-covered stones, vine-wrapped)
- Fairy door in tree trunk (round door, tiny mailbox, welcome mat, warm light from within)
- Miniature alchemy lab (bubbling beakers, swirling potions, floating ingredients, crystal apparatus)
- Tiny stone circle (Stonehenge-miniature, glowing at dawn, moss-covered megaliths, ritual energy)
- Enchanted greenhouse (glass panes, magical plants, self-watering cans, luminous flowers)
- Miniature witch's cottage (crooked chimney, herb garden, cauldron by door, black cat weathervane)

━━━ SCALE RULE ━━━
Every scene must read as MINIATURE / DOLLHOUSE / DIORAMA scale. Include scale cues: "tiny," "miniature," "dollhouse-scale," thumb-sized details, or macro-lens perspective.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: setting type + magical element + specific details. "Wizard tower with star charts" and "wizard tower with potion lab" are distinct. "Wizard tower with glowing windows" and "sorcerer tower with lit windows" are TOO SIMILAR.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
