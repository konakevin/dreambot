/**
 * ToyBot plush-world path — declarative axis-system (2026-05-19 rewrite).
 *
 * PLUSH-STORYBOOK MISCHIEF — every render is a single-frame storybook moment
 * from an UNEXPECTED plush-stuffed-animal scenario (black-market honey trade,
 * underground knit-off, plush comedy club, gondola taxi in the bath suds,
 * acupuncture clinic, plush courtroom drama, etc.). Beatrix Potter meets
 * Pooh meets Coraline-set-build meets cozy mischief.
 *
 * Axes:
 *   - Universal: camera_angle (path-bespoke wide narrative-action pool)
 *   - Path-bespoke:
 *       scene — 6-slot DNA seed (real surface + unexpected story setup;
 *               protagonist plush + specific action; 3-5 supporting cast
 *               across plush archetypes; multilayered real-prop set
 *               decoration; warm cozy storybook light; overhead chaos)
 *
 * Locked medium: plush_storytelling_mixed (short directive that anchors
 * "plush-fabric distinct per character" without front-loading attention).
 * Path-bespoke prompt prefix replaces bot-wide "toy photography" with
 * "cinematic storybook-diorama film still" so Flux unlocks practical
 * props + dynamic actions instead of Pop-Mart toy-collection defaults.
 * Skips chaos / twoPassPolish / sensoryAnchors — the 6-slot seed is the
 * source of truth.
 */

module.exports = {
  archetype: 'TOYBOT_PLUSH_STORYTELLING',
  pools: {
    scene: 'TOYBOT_PLUSH_STORYTELLING_SCENES',
    camera_angle: 'TOYBOT_PLUSH_STORYTELLING_CAMERAS',
  },
};
