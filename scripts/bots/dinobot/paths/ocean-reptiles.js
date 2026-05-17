/**
 * DinoBot ocean-reptiles — declarative composer form (2026-05-17 migration).
 *
 * STRICT MESOZOIC OPEN OCEAN with a MARINE REPTILE (mosasaur / plesiosaur /
 * ichthyosaur / pliosaur / marine crocodile / Archelon sea-turtle / ammonite /
 * marine pterosaur over ocean). Underwater + mid-ocean breach + surface-break
 * encouraged. NEVER river / swamp / lake. ONLY actual ocean dinosaurs (no
 * land dinos). 25-40% marine reptile + 55-65% ocean-scene.
 *
 * BBC Blue Planet × Prehistoric Planet × Jurassic-World-Mosasaur-tank-but-wild
 * underwater cinematography lineage.
 *
 * 4 path-bespoke pools:
 *   - DINOBOT_OCEAN_REPTILES_OCEAN_SCENE (underwater / surface-break / abyss / reef)
 *   - DINOBOT_OCEAN_REPTILES_CREATURE (mosasaur / plesiosaur / ichthyosaur / pliosaur / etc.)
 *   - DINOBOT_OCEAN_REPTILES_SURPRISE (school of fish / ammonite / jellyfish / etc.)
 *   - DINOBOT_OCEAN_REPTILES_PHENOMENON (80%-gated — sun-shafts / storm / breach / plankton-bloom)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/ocean-reptiles.js.
 */

module.exports = {
  archetype: 'DINOBOT_OCEAN_REPTILES',
  pools: {
    ocean_scene: 'DINOBOT_OCEAN_REPTILES_OCEAN_SCENE',
    creature: 'DINOBOT_OCEAN_REPTILES_CREATURE',
    surprise: 'DINOBOT_OCEAN_REPTILES_SURPRISE',
    phenomenon: 'DINOBOT_OCEAN_REPTILES_PHENOMENON',
  },
};
