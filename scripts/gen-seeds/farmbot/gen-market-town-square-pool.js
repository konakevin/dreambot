#!/usr/bin/env node
/**
 * FarmBot — market-town-square path (Place, MVP-25).
 *
 * A market-day town square as the hero place — one of the few paths where
 * stylized townsfolk are a DELIBERATE, expected feature (Kevin 2026-09-07),
 * not incidental. Avoid signage-baiting elements (price boards, hanging
 * shop signs) since this concept already has an elevated Flux tendency
 * toward hallucinated readable text — describe stalls/goods/bunting only.
 * Locked to Gemini in bot.modelByPath for this exact reason.
 *
 * Blended concept (2026-09-08, Japan-rural expansion pass) — MIX separate
 * Western-market entries and Japanese shōtengai/roadside-market entries
 * across the pool for variety (not fused within one entry), same pattern
 * as farmhouse-garden/crop-fields/duck-pond/orchard/decorative-garden-
 * fences. A Japanese market scene is an EVEN HIGHER signage-hallucination
 * risk (noren curtains and shop banners commonly carry kanji/text in
 * training data) — ban readable text/characters of any language explicitly
 * and extra-explicitly for this variant.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_market_town_square_scenes.json'),
    total: 120,
    append: false,
    metaPrompt: (n) => `Generate ${n} distinct MARKET-DAY TOWN SQUARE scene descriptions for
a cozy farm-life bot. Generate roughly HALF the entries as (A) Western
market style — a cobblestone or packed-dirt town square lined with market
stalls, striped awnings, crates of colorful produce, hanging bundles of
dried flowers or herbs, baskets of baked goods, bunting strung between
buildings — and HALF as (B) Japanese market style — a narrow shōtengai
(covered shopping street) hung with plain undyed fabric awnings, or a
countryside roadside stall (michi-no-eki) with crates of daikon, satsuma,
and mushrooms under a wooden lean-to roof, small glass lanterns strung
overhead (NEVER paper lanterns — see the strict ban below).
Each individual entry should be internally coherent to ONE of these two
styles, not mixed. Both share a small handful of stylized townsfolk (1-3
people — a shopper with a basket, a vendor arranging goods, a couple
browsing) as a deliberate, expected part of EVERY entry — describe them
briefly and warmly (an apron, a basket, a shawl, a cheerful expression),
never as the sole focus, always part of the wider square. Both share cozy
iyashikei slice-of-life mood — warm midday or golden-hour light, the
particular cheerful bustle of a small market.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest scenes imaginable. SURROUND the square/street with
rich detail (potted flowers by the stalls, a tree in bloom overhead,
hanging plants, lanterns) PLUS at least one small whimsical, fun detail —
a cat weaving between crates, a butterfly over the flower stall, petals
drifting past, steam rising from a food stall. Vary: season (favor
spring/summer greenery), time of day, weather, angle (wide over the whole
square, close on one stall with figures nearby, a street-level view down a
row of stalls). CRITICAL: the SQUARE, STREET, or a stall/architecture
detail must ALWAYS be the grammatical subject named FIRST in the sentence;
people appear only in a trailing clause. 25-40 words each. Examples:
["A cobblestone town square bustles with striped market awnings and crates of ripe autumn produce, a shopper in a knit shawl pausing at a flower-decked stall as a cat weaves between the wicker baskets.", "A narrow shōtengai glows beneath strings of small glass lanterns and plain fabric awnings, a vendor arranging crates of daikon and mushrooms as potted chrysanthemums line the stall fronts in the warm evening light."]

🚫 STRICT BANS: NO named people/characters (describe them generically —
"a shopper", "a vendor" — never a proper name), NO animals beyond a tiny
incidental cat/butterfly per above, NO readable text, signage, price tags,
hanging shop-name boards, chalkboards, or written characters OF ANY
LANGUAGE (including kanji/kana on banners, noren curtains, or lanterns —
describe them as plain or patterned fabric only, never lettered) — describe
goods and decoration only, never a sign, NO brand names, NO
photographer/camera-brand names, NO bare/empty compositions lacking rich
surrounding detail. CRITICAL — NO "paper lanterns" of any kind (round
paper chōchin-style lanterns are a strong Flux trigger for hallucinated
painted characters/text) — if a lantern is wanted, it must always be
described as a "small glass lantern," never paper, never described as
bearing any marking, character, or design.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
