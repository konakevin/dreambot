/**
 * DinoBot desert-dunes — a PURE PALEO DESERT vista (2026-09-22, SHADOW).
 *
 * Promoted from a BUCKET to a PATH on Kevin's call (2026-09-22): "those two new dinobot buckets
 * could be their own paths ... literally just clone the path it's in, and set it to just that
 * bucket for both of those."
 *
 * WHY THE PROMOTION IS RIGHT. As a bucket these 25 entries were 25 of 250 in
 * `DINOBOT_PALEO_LANDSCAPE_BIOME` — about 10% of ONE pool's airtime on one path. As its own path it
 * gets a full slot in the rotation, so a desert vista actually shows up. The 25 entries were also
 * MOVED rather than copied: the parent pool is back to its pre-wave-1 200, so this content is
 * exclusive here and never double-serves.
 *
 * This is a CLONE of `paleo-landscape` in the exact sense Kevin asked for — same archetype, same
 * megaflora / phenomenon / surprise_element / sky_layer pools, same universal lighting + atmosphere.
 * The ONLY difference is the biome pool. That is the ChibiBot shared-family pattern (one archetype,
 * N paths each wiring their own hero pool) and it means this path inherits a composition that is
 * already proven on the bot.
 *
 * READY TO SCALE: the biome pool is at MVP-25 pending Kevin's grade. Its recipe lives in
 * `scripts/gen-dinobot-pool.js` as `dinobot_desert_dunes_biome`, so production size is
 * `node scripts/gen-dinobot-pool.js --pool dinobot_desert_dunes_biome --target 200`.
 *
 * One thing to watch at grade time: the megaflora axis is shared with paleo-landscape and is
 * written for LUSH jungle (mega-cycads, tree-ferns, vine cathedrals). A dune field wants sparse,
 * wind-stunted, half-buried flora. If the renders read as a jungle that happens to have sand in it,
 * a bespoke `desert_flora` pool is the fix, not a template change.
 */

module.exports = {
  archetype: 'DINOBOT_PALEO_LANDSCAPE',
  pools: {
    biome: 'DINOBOT_DESERT_DUNES_BIOME',
    megaflora: 'DINOBOT_PALEO_LANDSCAPE_MEGAFLORA',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
    surprise_element: 'DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'DINOBOT_PALEO_LANDSCAPE_SKY',
  },
};
