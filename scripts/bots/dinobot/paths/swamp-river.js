/**
 * DinoBot swamp-river — declarative composer form (2026-05-17 migration).
 *
 * Mesozoic SWAMP / RIVER / WATERWAY with a SEMI-AQUATIC DINOSAUR interacting
 * with the water. Spinosaur fishing / sauropod wading / hadrosaur drinking /
 * mosasaur breaching / crocodilian floating / pterosaur skimming. Water is
 * the setting (55-65% frame), dino is the candid focal subject (25-40% frame).
 *
 * National-Geographic / Prehistoric-Planet / Walking-with-Dinosaurs /
 * Jurassic-Park-Isla-Sorna visual lineage. Photoreal cinematic 35mm.
 *
 * 4 path-bespoke pools:
 *   - DINOBOT_SWAMP_RIVER_WATER_SCENE (tannin-river / foggy swamp / lily-marsh / mud-flat / etc.)
 *   - DINOBOT_SWAMP_RIVER_DINO (semi-aquatic dino mid-water-behavior)
 *   - DINOBOT_SWAMP_RIVER_SURPRISE (small accents — dragonfly / fish-jump / pterosaur-skim)
 *   - DINOBOT_SWAMP_RIVER_PHENOMENON (80%-gated — fog / rain / god-rays / steam)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/swamp-river.js.
 */

module.exports = {
  archetype: 'DINOBOT_SWAMP_RIVER',
  pools: {
    water_scene: 'DINOBOT_SWAMP_RIVER_WATER_SCENE',
    dino: 'DINOBOT_SWAMP_RIVER_DINO',
    surprise: 'DINOBOT_SWAMP_RIVER_SURPRISE',
    phenomenon: 'DINOBOT_SWAMP_RIVER_PHENOMENON',
  },
};
