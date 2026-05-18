/**
 * DinoBot aerial-perspectives — declarative composer form (2026-05-17 migration).
 *
 * FLYING PTEROSAURS in their element OR sky-altitude aerial-camera views of
 * ground dinosaurs. Two valid modes:
 *   - Mode A (70%): pterosaur-in-flight (Pteranodon / Quetzalcoatlus / etc.)
 *     with wing-membrane anatomy fidelity per species
 *   - Mode B (30%): bird's-eye-view of ground dinosaurs from helicopter
 *     altitude
 *
 * The camera is HIGH UP. Paleo-cinematographer aerial framing.
 *
 * Reuses 3 existing production-scale pools:
 *   - AERIAL_SUBJECTS (200 pterosaur subjects)
 *   - AERIAL_ACTIONS (200 flight behaviors)
 *   - AERIAL_SETTINGS (200 sky/aerial environments)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_AERIAL_PERSPECTIVES_SURPRISE_ELEMENT (aerial accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Template includes pterosaur anatomy fidelity mandate + movie-poster
 * quality mandate. NO grounded-ban here — mid-air IS the brief for this path.
 *
 * Pre-migration function-form at paths/legacy/aerial-perspectives.js.
 */

module.exports = {
  archetype: 'DINOBOT_AERIAL_PERSPECTIVES',
  pools: {
    subject: 'AERIAL_SUBJECTS',
    action: 'AERIAL_ACTIONS',
    setting: 'AERIAL_SETTINGS',
    surprise_element: 'DINOBOT_AERIAL_PERSPECTIVES_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
