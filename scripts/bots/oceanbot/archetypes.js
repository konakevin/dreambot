/**
 * OceanBot — archetype definitions (slot lists per path).
 *
 * The composer reads each archetype's `slots.path` to know which pool axes
 * to roll for each render, and the matching template function in
 * ./archetype-templates.js consumes those rolled values into a Sonnet brief.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Path coverage (13 paths, 2026-06-01):
 *   NATURE / BIOME-LED (scene-as-hero):
 *     deep-wonder           — abyssal mystery, bioluminescent deep-sea
 *     undersea-seascape     — coral arches, kelp cathedrals, caustic light
 *     shipwreck-kingdom     — wrecks reclaimed by marine life
 *     polar-seas            — Arctic/Antarctic icy ocean
 *     calm-glass-sea        — meditative mirror-flat
 *     whale-encounter       — humpbacks/blue whales
 *     bioluminescent-night  — glowing plankton/marine life
 *     storm-surface         — violent sea storms
 *   ANCHOR-LED (vessel/figure/creature is hero):
 *     ghost-ship            — derelict age-of-sail vessel
 *     kraken-leviathan      — sea-monster encounter
 *     lost-cities           — Atlantis sunken civilization
 *     pirates               — age-of-sail piracy
 *     mermaid-myth          — single-tail Pre-Raphaelite painted mermaid
 *
 * Each path has its OWN bespoke pool set (no cross-path reuse per
 * [[feedback_full_bespoke_per_path_no_shared_pools]]). MVP-25 cap until
 * Kevin signs off on quality and approves production scale-up to 200.
 */

module.exports = {
  // ━━━ NATURE / BIOME-LED PATHS ━━━

  OCEANBOT_DEEP_WONDER: {
    description:
      'PATH-BESPOKE — OceanBot deep-wonder. Abyssal mystery, bioluminescent deep-sea life, mesopelagic + bathypelagic zones. Sub-illumination only. Ocean is hero.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'depth_zone',
        'abyssal_anchor',
        'deep_marine_life',
        'bioluminescent_source',
        'water_column_quality',
        'caustic_or_glow',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    // Entity slots = anything that introduces a new object/creature/element.
    // The non-entity slots (depth_zone, water_column_quality, caustic_or_glow,
    // camera_framing) tune the existing scene without adding new focal points
    // and are never capped. See scripts/lib/modelDetailTiers.js.
    entitySlots: [
      'abyssal_anchor', // hero — always kept
      'deep_marine_life', // hero-supporting — always kept
      'bioluminescent_source',
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_UNDERSEA_SEASCAPE: {
    description:
      'PATH-BESPOKE — OceanBot undersea-seascape. Coral arches, kelp cathedrals, sun-shaft caustics. Biome is hero with optional tiny figure for scale.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'biome_anchor',
        'marine_life',
        'submerged_structure',
        'foreground_element',
        'caustic_light',
        'water_clarity',
        'weather_in_water',
        'depth_setting',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'biome_anchor', // hero (the coral / kelp cathedral)
      'marine_life', // hero-supporting (the inhabitants)
      'submerged_structure',
      'foreground_element',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_SHIPWRECK_KINGDOM: {
    description:
      'PATH-BESPOKE — OceanBot shipwreck-kingdom. Wrecks reclaimed by marine ecosystems. Coral growth on hull, schools of fish, kelp around rigging.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'wreck_class',
        'reclamation_state',
        'coral_growth',
        'marine_life',
        'caustic_light',
        'water_clarity',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'wreck_class', // hero (the ship/sub itself)
      'marine_life', // hero-supporting (life that reclaimed it)
      'coral_growth',
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_POLAR_SEAS: {
    description:
      'PATH-BESPOKE — OceanBot polar-seas. Arctic/Antarctic icy ocean, icebergs, sea ice, aurora. Cold-light register.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'ice_anchor',
        'polar_biome',
        'polar_marine_life',
        'sky_phenomenon',
        'water_state',
        'light_signature',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'ice_anchor', // hero (iceberg / floe / glacier face)
      'polar_marine_life', // hero-supporting (narwhal / orca / seal)
      'sky_phenomenon', // aurora / sun-pillar — entity-ish
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_CALM_GLASS_SEA: {
    description:
      'PATH-BESPOKE — OceanBot calm-glass-sea. Mirror-flat meditative sea, dawn/dusk stillness, perfect reflection, horizon-led atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'time_of_day',
        'reflection_anchor',
        'sky_signature',
        'water_clarity',
        'atmospheric_haze',
        'foreground_element',
        'distant_silhouette',
        'light_signature',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
    // Glass-sea is by design the most ATMOSPHERIC path — many slots tune
    // mood/light, only a few introduce entities. Lower entity count is
    // intentional here (the stillness is the point).
    entitySlots: [
      'reflection_anchor', // hero (what's being mirrored)
      'foreground_element',
      'distant_silhouette',
      'surprise_element',
    ],
    protectedEntityCount: 1,
  },

  OCEANBOT_WHALE_ENCOUNTER: {
    description:
      'PATH-BESPOKE — OceanBot whale-encounter. Cinematic humpback/blue/orca whale moment. Breach, depth-dive, mother-calf, song-bubbles.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'whale_species',
        'whale_action',
        'depth_setting',
        'light_signature',
        'water_clarity',
        'marine_supporting_life',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    // The WHALE is the sole hero — supporting entities sample down hard so
    // the frame doesn't fight the whale's scale.
    entitySlots: [
      'whale_species', // hero — always kept
      // (whale_action is a verb attached to whale_species, not its own entity)
      'marine_supporting_life',
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 1,
  },

  OCEANBOT_BIOLUMINESCENT_NIGHT: {
    description:
      'PATH-BESPOKE — OceanBot bioluminescent-night. Glowing plankton, neon dinoflagellates, fluorescent reef, bioluminescent jellyfish. Cool-blue palette against deep black.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'bioluminescent_anchor',
        'light_pattern',
        'depth_setting',
        'supporting_marine_life',
        'water_state',
        'foreground_element',
        'atmospheric_haze',
        'color_signature',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'bioluminescent_anchor', // hero (the glowing creature/cluster)
      'supporting_marine_life', // hero-supporting
      'foreground_element',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_STORM_SURFACE: {
    description:
      'PATH-BESPOKE — OceanBot storm-surface. Violent sea storms, lightning on waves, hurricane fury, mountain-sized swells.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'storm_type',
        'sea_state',
        'sky_signature',
        'light_phenomenon',
        'vessel_optional',
        'foreground_element',
        'scale_provers',
        'weather_air',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
    // Storm-surface is mostly atmosphere — storm_type, sea_state, sky_signature,
    // light_phenomenon, weather_air are all storm-modulators, not new entities.
    entitySlots: [
      'vessel_optional', // hero IF present (scale anchor in the storm)
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 1,
  },

  // ━━━ ANCHOR-LED PATHS ━━━

  OCEANBOT_GHOST_SHIP: {
    description:
      'PATH-BESPOKE — OceanBot ghost-ship. Derelict age-of-sail vessel, fog, decay, age-of-sail maritime myth. Painterly (canvas) heritage.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'ship_class',
        'decay_state',
        'fog_layer',
        'sea_state',
        'light_signature',
        'ghostly_phenomenon',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'ship_class', // hero — always kept
      'ghostly_phenomenon', // hero-supporting (the haunting itself)
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_KRAKEN_LEVIATHAN: {
    description:
      'PATH-BESPOKE — OceanBot kraken-leviathan. Sea-monster encounters. Kraken / megalodon / leviathan / sea serpent / sea dragon. Mythic scale, painted register.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'leviathan_type',
        'action_moment',
        'ocean_setting',
        'scale_provers',
        'threat_signal',
        'atmospheric_drama',
        'water_state',
        'light_signature',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'leviathan_type', // hero — always kept
      'scale_provers', // hero-supporting (the ship/whaler proves the monster's scale)
      'threat_signal',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_LOST_CITIES: {
    description:
      'PATH-BESPOKE — OceanBot lost-cities. Atlantis-coded sunken civilization. Submerged architecture, columned ruins, statue-fragments, reclaimed by marine ecosystem.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'architectural_anchor',
        'civilization_motif',
        'reclamation_state',
        'marine_life',
        'caustic_light',
        'water_clarity',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'architectural_anchor', // hero — always kept (the ruin / temple / column)
      'civilization_motif', // hero-supporting (statue / mosaic / iconography)
      'marine_life',
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_PIRATES: {
    description:
      'PATH-BESPOKE — OceanBot pirates. Age-of-sail piracy. Galleons, broadsides, treasure haul, crew on deck. Cinematic action register.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'vessel_class',
        'action_moment',
        'weather_state',
        'sea_state',
        'era_detail',
        'scale_provers',
        'light_signature',
        'foreground_element',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
    entitySlots: [
      'vessel_class', // hero — always kept (the galleon / brigantine)
      'era_detail', // hero-supporting (period rigging / cannon / crew detail)
      'scale_provers',
      'foreground_element',
      'surprise_element',
    ],
    protectedEntityCount: 2,
  },

  OCEANBOT_MERMAID_MYTH: {
    description:
      'PATH-BESPOKE — OceanBot mermaid-myth. TRADITIONAL ONE-TAIL MERMAID Pre-Raphaelite painted-canvas heritage. Waterhouse / Rossetti / Burne-Jones / Caspar-David-Friedrich oil register. Anatomy locks enforced via shared-blocks.MERMAID_ANATOMY_LOCK.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'mermaid_archetype',
        'tail_detail',
        'ocean_setting',
        'painterly_tradition',
        'lighting_pattern',
        'foreground_element',
        'sea_phenomenon',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
    // Mermaid is the sole hero — supporting entities sample down hard so
    // the painterly figure dominates the canvas (tail_detail modifies the
    // hero, not its own entity; painterly_tradition is stylistic).
    entitySlots: [
      'mermaid_archetype', // hero — always kept
      'sea_phenomenon',
      'foreground_element',
      'scale_provers',
      'surprise_element',
    ],
    protectedEntityCount: 1,
  },
};
