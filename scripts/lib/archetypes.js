/**
 * Bot path archetypes. Each archetype declares which axis slots are
 * required + their role + how many entries to pick. The composer reads
 * this and assembles a brief per archetype-template.
 *
 * Phased introduction: starting with PURE_COSMOS (cosmic-vista). Other
 * archetypes will be added as each path is migrated. See
 * BOT_AXIS_REFACTOR_PLAN.md for the full taxonomy.
 */

const ARCHETYPES = {
  PURE_COSMOS: {
    description: 'Astronomical phenomenon as subject. No figure.',
    slots: {
      // Resolution order at render time: path override (pathConfig.pools[slot])
      // → bot default (bot.defaultPools[slot]) → error.
      universal: [
        'story_beat',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['surprise_element'],
      path: ['phenomenon'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'event', gate: 0.4 },
    framingModes: null,
  },

  CHARACTER: {
    description: 'Figure is protagonist within a scene. Anchor at MEDIUM/LARGE scale. Slim character + location + action pools layered with full canonical axes; Sonnet weaves the figure INTO the scene.',
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['sky_layer', 'surprise_element'],
      path: ['character', 'location', 'action'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    // anchor_scale pool entries start with TINY/SMALL/MEDIUM/LARGE prefix;
    // CHARACTER paths declare which range applies (default MEDIUM/LARGE so
    // the figure is the subject, not a scale prover).
    anchorScaleRange: ['MEDIUM', 'LARGE'],
  },

  PHOTOREAL_ASTRO: {
    description: 'NASA-grade photoreal astrophotography — slim seed (named astronomical objects) + full canonical axes. Sonnet weaves the layers; medium wrapper adds Hubble/JWST/Chandra/EHT cranked-to-11 framing.',
    slots: {
      // Slim seed + full canonical axes — same shape as PURE_COSMOS but
      // distinct brief template (NASA multi-wavelength photoreal, not
      // painted oil-canvas). Reseeding 2026-05-12 moved this away from the
      // fat-seed exception.
      universal: [
        'story_beat',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['surprise_element'],
      path: ['subject'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'event', gate: 0.35 },
    framingModes: null,
  },
};

module.exports = { ARCHETYPES };
