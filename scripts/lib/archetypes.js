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

  FEMALE_EXPLORER: {
    description: 'Sci-fi female explorer character path — gender-locked to "she/her/woman" throughout the template (per 2026-05-12 lesson: Flux uses gendered pronouns + nouns as primary gender-rendering signals, gender-neutral templates regress character renders). Full 7-axis female DNA stack composed at runtime. Character is the SHOW at MEDIUM scale (25-40% frame). Alien biome serves as her stage.',
    slots: {
      universal: ['lighting', 'weather_particulate'],
      bot: ['sky_layer', 'surprise_element'],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['biome', 'action', 'explorer_archetype'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_EXPLORER: {
    description: 'Sci-fi male explorer character path — gender-locked to "he/his/man" throughout the template. Sibling archetype to FEMALE_EXPLORER; separate template per gender per the 2026-05-12 hard rule about character-path gender-locking. Full 7-axis male DNA stack composed at runtime.',
    slots: {
      universal: ['lighting', 'weather_particulate'],
      bot: ['sky_layer', 'surprise_element'],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['biome', 'action', 'explorer_archetype'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
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

  OUTDOOR_CITY: {
    description: 'Architecture / city as hero. Anchor entity at TINY/SMALL scale (scale prover only). City fills 80%+ of frame. Path-bespoke pools for setting + lone city-witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
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
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['setting', 'deep_distance'],
    },
    pickN: { scale_provers: 2 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
  },

  SPACE_OPERA: {
    description: 'Sci-fi spaceship as anchor entity, MEDIUM/LARGE scale. Hero ship in cosmic setting with optional 50%-gated wide-action mode (multi-ship battle/traffic chaos with two sub-pools rolled together).',
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
      path: ['ship', 'setting', 'ship_action'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: {
      gate: 0.5,
      pools: {
        traffic: { name: 'BUSY_FLEET_ELEMENTS', pickN: 3 },
        battle: { name: 'BATTLE_DYNAMICS', pickN: 3 },
      },
    },
    framingModes: null,
    anchorScaleRange: ['MEDIUM', 'LARGE'],
  },

  MEGASTRUCTURE: {
    description: 'Colossal post-planetary engineered construct as hero — orbital rings, Dyson constructs, planetary mantles, megaships. Anchor at TINY/SMALL (scale prover). Structure fills 85%+ of frame. Path-bespoke pools for setting + lone structure-scale witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
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
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['setting', 'deep_distance'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
  },

  STARCRAFT_LANDSCAPE: {
    description: 'PATH-BESPOKE — Starcraft-franchise landscape (Blizzard / Sam Didier / Glenn Rane / Trent Kaniuga concept-art tradition). Three faction-coded biomes: TERRAN frontier-industrial-rust + PROTOSS gold-crystalline-psionic + ZERG organic-biomech-creep-wasteland. Strong color identity per faction. NO figures dominating.',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting', 'weather_particulate'],
      bot: [],
      path: ['biome', 'anchor_entity', 'moment', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STARTREK_LANDSCAPE: {
    description: 'PATH-BESPOKE — Star-Trek-franchise landscape (Andrew Probert / Rick Sternbach / classic-Trek painted-matte tradition). Each world reads as distinct COLOR-CODED species/empire aesthetic. Red-desert temple-worlds, orange-stone monasteries, tropical paradises, matte-black Borg-cube stations, volcanic warrior-empires, classical-future Federation colonies, green-bronze Romulan-style, bone-rust Cardassian-style. NO figures (pure landscape).',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting', 'weather_particulate'],
      bot: [],
      path: ['biome', 'anchor_entity', 'moment', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  MASS_EFFECT_ARCHITECTURE: {
    description: 'PATH-BESPOKE — Mass-Effect-franchise architecture interior (BioWare / Sparth / Matt Rhodes tradition). CLEAN-FUTURE-MEETS-DISTINCT-ALIEN. Each species/world has its own architectural language. Controlled color palette — blues, oranges, purples. Holographic UI / biotic-energy / mass-effect-fields. NO figures.',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
      bot: [],
      path: ['setting', 'atmosphere', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: { slot: 'incident', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  HALO_LANDSCAPE: {
    description: 'PATH-BESPOKE — Halo-franchise landscape (Bungie / 343 Industries / Sparth / Pat Rawlings tradition). Ring-installation arc visible across sky is the signature. Ancient precursor megaliths, frontier military bases, sacred-ancient → military-industrial → biblical-ringworld mood range. Path-bespoke pools.',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting', 'weather_particulate'],
      bot: [],
      path: ['biome', 'anchor_entity', 'moment', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  GUARDIANS_ARCHITECTURE: {
    description: 'PATH-BESPOKE — Guardians-of-the-Galaxy-franchise architecture interior (James Gunn / Jack Kirby cosmic / 70s album-cover sci-fi). PLAYFUL-EXTRAVAGANT-WEIRD. SATURATED COLOR signature. Less gritty than Star Wars, more whimsical-cosmic-grand. NO skulls, NO figures. Path-bespoke pools (setting + atmosphere + deep_distance + 40% incident).',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
      bot: [],
      path: ['setting', 'atmosphere', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: { slot: 'incident', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DUNE_LANDSCAPE: {
    description: 'PATH-BESPOKE — Dune-franchise desert vista (Frank Herbert / Denis Villeneuve / David Lean / Kubrick / Lawrence-of-Arabia tradition). BIBLICAL scale. Sky dominates 50-70% of frame. Twin-sun light raking dunes. Spice-blue dawn haze. Sandstorm-wall scale. Hand-carved architectural ornament. Monumental empire grandeur. Ancient-bronze-and-stone material weight. Path-bespoke pools (biome + anchor_entity + moment + deep_distance).',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting', 'weather_particulate'],
      bot: [],
      path: ['biome', 'anchor_entity', 'moment', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  ALIENS_ARCHITECTURE: {
    description: 'PATH-BESPOKE — Aliens-franchise architecture interior (H.R. Giger / Ridley Scott / Cameron / Ron Cobb / Syd Mead industrial). TERRIFYING-AND-MAJESTIC mood. Biomech hive / derelict spacecraft / abandoned colony / atmospheric processor / sterile lab / dropship interior. NO figures. Path-bespoke pools (setting + atmosphere + deep_distance + 40% incident).',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
      bot: [],
      path: ['setting', 'atmosphere', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: { slot: 'incident', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ARCHITECTURE_INTERIOR: {
    description: 'Pure architecture interior (corridors / chambers / hangars / labs) — NO FIGURE required. Structure is hero. Path-bespoke pools for setting + atmospheric detail + deep-distance signature + conditional incident drama (40% gate). Atmosphere-heavy vs ALIEN_LANDSCAPE which mandates a witness.',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
      bot: [],
      path: ['setting', 'atmosphere', 'deep_distance'],
    },
    pickN: {},
    conditionalLayer: { slot: 'incident', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  COZY_INTERIOR: {
    description: 'Intentionally minimalist canonical-LITE — narrative universal axes only (story_beat / composition_frame / emotional_dna / lighting). Skips scale_provers / surprise_element / weather_particulate / sky_layer (these would over-stuff intimate scenes). 3 path-bespoke pools: interior (fat-seed primary) + cozy_moment (40% gated drama) + warmth_source (intimate framing axis).',
    slots: {
      universal: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
      bot: [],
      path: ['interior', 'warmth_source'],
    },
    pickN: {},
    conditionalLayer: { slot: 'cozy_moment', gate: 0.4 },
    framingModes: {
      modes: ['wide-room', 'zoom-in'],
      weights: [70, 30],
    },
    anchorScaleRange: null,
  },

  ALIEN_LANDSCAPE: {
    description: 'Alien planet biome as hero. Anchor entity at TINY/SMALL scale (silhouette scale prover). Path-bespoke pools for biome, lone wilderness witness (anchor_entity overrides bot default), candid landscape moment, signature deep-distance feature. Bot surprise_element is wired (was previously missing).',
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
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['biome', 'moment', 'deep_distance'],
    },
    pickN: { scale_provers: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
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
