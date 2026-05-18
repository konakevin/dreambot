/**
 * DinoBot extinction-event — declarative composer form (2026-05-17 migration).
 *
 * K-PG APOCALYPTIC scenes — asteroid streak across sky / impact-aftermath
 * firestorms / impact-winter darkness / last-dinosaurs-in-dying-world.
 * Epic tragedy + beautiful devastation. End of Mesozoic era.
 *
 * Reuses 3 existing production-scale pools:
 *   - DINO_SPECIES (200 dinosaur species)
 *   - EXTINCTION_SCENES (200 fat-seed apocalyptic scenes)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome with apocalyptic tint)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_EXTINCTION_EVENT_SURPRISE_ELEMENT (apocalyptic accents — ember-fall,
 *     ash-flake, distant-impact-glow, startled-pterosaur, falling-tektite)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Template enforces apocalyptic-sky-event mandate (asteroid streak / impact flash /
 * firestorm glow / ash winter), dignified-not-panicked dinosaur posture,
 * "herd" word ban, no-gore mandate, movie-poster quality mandate, species +
 * biome variety mandates, grounded ban.
 *
 * Pre-migration function-form at paths/legacy/extinction-event.js.
 */

module.exports = {
  archetype: 'DINOBOT_EXTINCTION_EVENT',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    species: 'DINO_SPECIES',
    extinction_scene: 'EXTINCTION_SCENES',
    surprise_element: 'DINOBOT_EXTINCTION_EVENT_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
