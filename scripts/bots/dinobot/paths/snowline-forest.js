/**
 * DinoBot snowline-forest — high conifer forest at the snowline (2026-09-22, SHADOW).
 *
 * Promoted from a BUCKET to a PATH on Kevin's call (2026-09-22): "those two new dinobot buckets
 * could be their own paths ... literally just clone the path it's in, and set it to just that
 * bucket for both of those."
 *
 * WHY THE PROMOTION IS RIGHT. As a bucket these 25 entries were 25 of 250 in
 * `DINOBOT_PALEO_LANDSCAPE_BIOME` — about 10% of ONE pool's airtime on one path, and that pool is
 * shared by 10 live paths, so a snowline scene would surface rarely. As its own path it gets a full
 * slot in the rotation. The entries were MOVED rather than copied: the parent pool is back to its
 * pre-wave-1 200, so this content is exclusive here and never double-serves.
 *
 * A true CLONE of `paleo-landscape`: same archetype, same megaflora / phenomenon /
 * surprise_element / sky_layer pools, same universal lighting + atmosphere. Only the biome differs.
 * That is the ChibiBot shared-family pattern (one archetype, N paths each wiring their own hero
 * pool), so this path inherits a composition already proven on the bot.
 *
 * WHY THIS ONE IS ALSO WORTH ITS OWN SLOT ON MERIT: DinoBot's whole landscape register is warm —
 * the shared biome pool used the word "amber" in 84% of its entries. A cold, high, sparse,
 * blue-shadowed forest is the single biggest tonal contrast available to the bot, and it was
 * previously buried at 10% of one axis.
 *
 * READY TO SCALE: biome pool at MVP-25 pending Kevin's grade. Recipe is
 * `dinobot_snowline_forest_biome` in `scripts/gen-dinobot-pool.js`, so production size is
 * `node scripts/gen-dinobot-pool.js --pool dinobot_snowline_forest_biome --target 200`.
 *
 * Watch at grade time: the shared `megaflora` axis is written for LUSH jungle (mega-cycads,
 * tree-ferns, vine cathedrals) and a snowline wants sparse wind-flagged conifers. If renders come
 * back as a jungle with snow added, a bespoke `alpine_flora` pool is the fix — not the template.
 */

module.exports = {
  archetype: 'DINOBOT_PALEO_LANDSCAPE',
  pools: {
    biome: 'DINOBOT_SNOWLINE_FOREST_BIOME',
    megaflora: 'DINOBOT_PALEO_LANDSCAPE_MEGAFLORA',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
    surprise_element: 'DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'DINOBOT_PALEO_LANDSCAPE_SKY',
  },
};
