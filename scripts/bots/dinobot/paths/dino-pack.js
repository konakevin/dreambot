/**
 * DinoBot dino-pack — declarative composer form (2026-05-17 migration).
 *
 * MULTI-DINOSAUR same-species GROUP behaviors — pack-hunting / waterhole-
 * gathering / river-crossing / nesting-colony / migration-cluster /
 * defensive-formation. Dozens-to-hundreds of the same species.
 * Wildlife-documentary group-life cinematography.
 *
 * Reuses 3 existing production-scale pools:
 *   - DINO_SPECIES (200 dinosaur species)
 *   - PACK_DINO_ACTIONS (200 fat-seed group behaviors)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_DINO_PACK_SURPRISE_ELEMENT (pack-specific accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Template bans the word "herd" + enforces poster-quality framing
 * + species-anchored count phrasing (same lessons as herd-migration R2
 * and cozy R2).
 *
 * Pre-migration function-form at paths/legacy/dino-pack.js.
 */

module.exports = {
  archetype: 'DINOBOT_DINO_PACK',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    species: 'DINO_SPECIES',
    pack_action: 'PACK_DINO_ACTIONS',
    surprise_element: 'DINOBOT_DINO_PACK_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
