#!/usr/bin/env node
/**
 * PixelBot pixel-item-shop — bespoke axis pools (Stage K1, SHADOW). The beloved
 * genre interior: potion-shop counters (Moonlighter/Recettear), cozy tavern/inn
 * common rooms, blacksmith forges, magic libraries; shopkeeper sprite + adventurer
 * customer. 16-bit SNES pixel-art screenshot. Wares are PICTORIAL (countable
 * readable objects), NEVER text/signage/price-tags. NO IP names. 4 pools.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-item-shop-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';

(async () => {
  // shop_locale — the shop type + interior layout.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_item_shop_shop_locale.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} SHOP-LOCALE descriptions for PixelBot's pixel-item-shop path — the beloved 16-bit RPG shop/tavern interior as the STAGE (shop type + interior layout, the cozy pixel-art room). The register is Moonlighter / Recettear item-shops, cozy RPG taverns and inns, blacksmith forges, and magic libraries. 16-bit SNES pixel-art game screenshot.

Each entry: 18-30 words. ONE specific shop/tavern interior, its layout and mood. NO characters as the focus (those come from another axis). NO readable text/signage/price-tags anywhere.

Variety mandate — distribute across: a cozy potion-shop with a wooden counter and shelves of glass bottles; a warm tavern common-room with a stone hearth and long benches; a blacksmith's forge with an anvil, glowing coals and hanging tools; a magic library with towering bookshelves and a reading nook; an inn's front desk with a key-rack and a staircase; an alchemist's workshop with bubbling flasks and dried herbs; an armory with racks of gear; a bakery-café corner with a brick oven; a general store crammed with barrels and crates; a curio-shop of trinkets and lanterns.

━━━ BANS ━━━
- NO readable text / NO signage / NO price-tags / NO labels (keep everything pictorial)
- NO IP names / no specific game characters / logos / franchises
- NO smooth illustration — 16-bit pixel-art only
- NO characters as the focus (the room is the stage)

Return ONLY a JSON array of ${n} strings.`,
  });

  // shelf_density — MONEY-SHOT: countable readable wares.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_item_shop_shelf_density.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} SHELF-DENSITY descriptions for PixelBot's pixel-item-shop path — the MONEY-SHOT axis: the countable, readable pixel-art WARES that pack the shop (the "I want to buy that" richness). Each entry 12-22 words. Every ware is a clear pictorial pixel object — NEVER text or a price-tag.

Variety mandate — neat rows of colored potion bottles glinting on a shelf; swords and axes hanging on a wall rack; round loaves and bread stacked in baskets; barrels and crates of goods; glowing gems and rings in a display case; stacked spell-tomes and scrolls; wheels of cheese and hanging sausages; iron helms and shields on pegs; jars of herbs and dried ingredients; coiled ropes, lanterns and tools; bolts of colored cloth; wooden toys and trinkets on a table.

━━━ BANS ━━━
- NO readable text / NO price-tags / NO labels — wares are PICTORIAL objects only
- NO IP names, NO smooth illustration — 16-bit pixel-art
Return ONLY a JSON array of ${n} strings.`,
  });

  // keeper_customer_life — verb-led exchange.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_item_shop_keeper_customer_life.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} KEEPER-CUSTOMER-LIFE descriptions for PixelBot's pixel-item-shop path — the verb-led little story-moment of the shopkeeper sprite and an adventurer customer mid-exchange. Each entry 15-25 words, OPENING with an action verb. Chunky 16-bit character sprites, never a portrait.

Variety mandate — a shopkeeper sliding a potion across the counter to a helmeted adventurer; a keeper weighing a pouch of gold coins on a scale; a barkeep pouring a foaming ale for a seated traveler; a blacksmith hammering a glowing blade while a customer waits; a merchant haggling with a hooded rogue over a gem; a librarian handing a heavy tome to a young mage; an innkeeper offering a room-key across the desk; a customer trying on a helm at the armory counter; a keeper wrapping bread for a knight; two sprites bartering over a table of wares.

━━━ BANS ━━━
- NO readable text / speech bubbles / UI dialogue boxes
- NO IP names / no specific game characters
- Chunky 16-bit sprites (side-view or 3/4), NEVER a close-up portrait
Return ONLY a JSON array of ${n} strings.`,
  });

  // cozy_phenomenon — 40%-gated cozy accent.
  await generatePool({
    outPath: DIR + 'pixelbot_pixel_item_shop_cozy_phenomenon.json',
    total: 30,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} COZY-PHENOMENON descriptions for PixelBot's pixel-item-shop path — a gated small cozy atmospheric accent in the shop. Each entry 10-18 words. Pixel-art, wholesome.

Variety mandate — a warm hearth-fire flickering orange light across the room; a sleepy cat curled on the counter; rain streaking down a small window; dust-motes drifting in a shaft of light; a candle-lantern glowing on the desk; steam curling from a kettle; a potted plant on the sill; a wall-clock's pendulum (no readable face); a caged songbird; snow falling past the window; a cozy rug and a crackling brazier.

━━━ BANS ━━━
- NO readable text / clock-numbers / labels
- NO IP names, 16-bit pixel-art only
Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 pixel-item-shop pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
