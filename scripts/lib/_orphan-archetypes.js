/**
 * Orphan archetypes — defined but not referenced by any bot path file.
 * Kept here during refactor to preserve them in case they're needed later.
 * Safe to delete entries that have been confirmed unused for 30+ days.
 */
module.exports = {
  COZY_INTERIOR: {
  description: 'Intentionally minimalist canonical-LITE — narrative universal axes only (story_beat / composition_frame / emotional_dna / lighting). Skips scale_provers / surprise_element / weather_particulate / sky_layer (these would over-stuff intimate scenes). 3 path-bespoke pools: interior (fat-seed primary) + cozy_moment (40% gated drama) + warmth_source (intimate framing axis).',
  slots: {
    universal: [ 'story_beat', 'composition_frame', 'emotional_dna', 'lighting' ],
    bot: [],
    path: [ 'interior', 'warmth_source' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'cozy_moment', gate: 0.4 },
  framingModes: { modes: [ 'wide-room', 'zoom-in' ], weights: [ 70, 30 ] },
  anchorScaleRange: null
},

  TOYBOT_TOY_LANDSCAPE: {
  description: 'PATH-BESPOKE — ToyBot toy-landscape path (2026-05-17 R0 axis-system migration). Epic toy-medium landscape vista. NO CHARACTERS by design — the landscape IS the subject. Medium rotates: claymation OR vinyl per render via ToyBot mediumByPath. Universal axes (camera_angle / scenario / staging) resolve to bot.defaultPools. Single path-bespoke axis: landscape (200 entries).',
  slots: { universal: [ 'camera_angle', 'scenario', 'staging' ], bot: [], path: [ 'landscape' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  CHIBIBOT_CUTE_FOOD: {
  description: 'PATH-BESPOKE — ChibiBot cute-food path (2026-05-17 bespoke-axis rebuild). Kawaii pop-mart-style food/drink scenes where the food ITSELF has a smiling face (bex.ai Instagram aesthetic). 4 path-bespoke axes (hero / scatter / background / lighting). Background pool hard-locks the dusty-muted-pastel palette in every entry, eliminating Flux-default vivid drift. Locked medium: chibibot_food (via ChibiBot mediumByPath).',
  slots: { universal: [], bot: [], path: [ 'hero', 'scatter', 'background', 'lighting' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},
};
