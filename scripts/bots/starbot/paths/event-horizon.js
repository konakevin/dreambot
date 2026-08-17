/**
 * StarBot event-horizon (Stage L1, SHADOW) — the black-hole close-pass. A black hole
 * with a blazing accretion disk (Interstellar/Gargantua register), gravitational
 * lensing warping the starfield into an Einstein ring, a tiny ship silhouette against
 * the glow. Self-lit (the disk is the only light). Uses the bot default
 * starbot_hyperreal medium. 5 bespoke slots + 35%-gated infall_event.
 */

module.exports = {
  archetype: 'EVENT_HORIZON',
  pools: {
    hole_presentation: 'EVENT_HORIZON_HOLE_PRESENTATION',
    lensing_effect: 'EVENT_HORIZON_LENSING_EFFECT',
    witness_scale: 'EVENT_HORIZON_WITNESS_SCALE',
    disk_light: 'EVENT_HORIZON_DISK_LIGHT',
    space_backdrop: 'EVENT_HORIZON_SPACE_BACKDROP',
    infall_event: 'EVENT_HORIZON_INFALL_EVENT',
  },
};
