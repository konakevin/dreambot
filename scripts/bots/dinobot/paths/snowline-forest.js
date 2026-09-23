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
 * A near-clone of `paleo-landscape`: same megaflora / phenomenon / surprise_element / sky_layer
 * pools, same universal lighting + atmosphere, and the SAME COMPOSITION — but NOT the same archetype
 * any more. It runs `DINOBOT_SNOWLINE_FOREST`, a thin wrapper over `DINOBOT_PALEO_LANDSCAPE`.
 *
 * WHY THE ARCHETYPE HAD TO CHANGE (found 2026-09-22 by reading the emitted prompts, not the pools).
 * The paleo-landscape template hands every render two hardcoded lines that are both fatal here:
 *   "The PALETTE skews WARM EARTH-TONES — autumn-gold + bronze + rust-red + earthy ochre + amber
 *    … NOT cold-monochrome. RICH WARM SATURATED earth-tones"
 *   "• NO Iceland-style snowy-grey-rocky alpine canyons"
 * So the archetype ordered the OPPOSITE palette to this path's whole reason for existing, and
 * hard-banned its own subject. It showed: warm vocabulary reached all 8 early renders' prompts
 * (amber 7/8, bronze 6/8, rust 5/8), fighting the snow words every time. The wrapper swaps exactly
 * those two strings and nothing else, so composition stays shared and cannot drift; its anchors are
 * locked by `__tests__/lib/dinobotSnowlineArchetype.test.ts`.
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
 * MEGAFLORA: now its OWN cold pool, not the shared one. This was flagged in this header before the
 * first render ("if renders come back as a jungle with snow added, a bespoke alpine_flora pool is
 * the fix") and it duly happened — the shared pool's own PALETTE LOCK says "NEVER cold-monochrome"
 * and all 8 of its formations are lush tropical (cycads, palms, tree-ferns, vine-curtains,
 * fan-cap mushroom-trees, ginkgo groves), so a cold archetype over a warm flora pool still rendered
 * frost-rimed jungle lagoons. `DINOBOT_SNOWLINE_FOREST_FLORA` (recipe
 * `dinobot_snowline_forest_flora`) is the cold sibling: wind-flagged conifers, krummholz, the
 * tree-line itself, avalanche scars, cloud-layer forests. Validated at 0 tropical leak across all
 * six banned families, snow in 19 of 25, warm accents present but never dominant (the proven
 * one-warm-accent anti-monochrome lever).
 */

module.exports = {
  archetype: 'DINOBOT_SNOWLINE_FOREST',
  pools: {
    biome: 'DINOBOT_SNOWLINE_FOREST_BIOME',
    megaflora: 'DINOBOT_SNOWLINE_FOREST_FLORA',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
    surprise_element: 'DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'DINOBOT_PALEO_LANDSCAPE_SKY',
  },
};
