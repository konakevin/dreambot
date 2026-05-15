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
    description:
      'Sci-fi female explorer character path — gender-locked to "she/her/woman" throughout the template (per 2026-05-12 lesson: Flux uses gendered pronouns + nouns as primary gender-rendering signals, gender-neutral templates regress character renders). Full 7-axis female DNA stack composed at runtime. Character is the SHOW at MEDIUM scale (25-40% frame). Alien biome serves as her stage.',
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
    description:
      'Sci-fi male explorer character path — gender-locked to "he/his/man" throughout the template. Sibling archetype to FEMALE_EXPLORER; separate template per gender per the 2026-05-12 hard rule about character-path gender-locking. Full 7-axis male DNA stack composed at runtime.',
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
    description:
      'Figure is protagonist within a scene. Anchor at MEDIUM/LARGE scale. Slim character + location + action pools layered with full canonical axes; Sonnet weaves the figure INTO the scene.',
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
    description:
      'Architecture / city as hero. Anchor entity at TINY/SMALL scale (scale prover only). City fills 80%+ of frame. Path-bespoke pools for setting + lone city-witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
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
    description:
      'Sci-fi spaceship as anchor entity, MEDIUM/LARGE scale. Hero ship in cosmic setting with optional 50%-gated wide-action mode (multi-ship battle/traffic chaos with two sub-pools rolled together).',
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
    description:
      'Colossal post-planetary engineered construct as hero — orbital rings, Dyson constructs, planetary mantles, megaships. Anchor at TINY/SMALL (scale prover). Structure fills 85%+ of frame. Path-bespoke pools for setting + lone structure-scale witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
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

  FEMALE_ADVENTURER: {
    description:
      'PATH-BESPOKE — DragonBot female-adventurer path (2026-05-14 rebuild from female-warrior). Gender-locked WOMAN of any D&D × LOTR fantasy race, any class (rogue / ranger / sorceress / warlock / mage / paladin / warrior / monk / druid / bard / cleric / barbarian / artificer / etc.), in the wild doing her adventurer thing. SLEEK adventuring gear — no bulky/massive armor, no cheesecake, no artist-name lineage callouts. NSFW-clean rebuild. Character at 25-40% frame in a candid mid-action moment. Painterly fantasy concept art aesthetic. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FEMALE_ACTION_SCENES: {
    description:
      'PATH-BESPOKE — DragonBot female-action-scenes path (2026-05-14 clone of FEMALE_ADVENTURER, massaged for pure action energy). Same gender-locked, NSFW-clean, sleek-gear, strict-high-fantasy WOMAN. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats — mages mid-spell with explosions, ranger mid-loose with arrow streaking, rogue sneaking through busy night market, paladin mid-strike with divine light, sorceress at summon apex, druid mid-shape-shift, warlock eldritch blast. Alive, motion-blurred, effect-rich. Character at 25-40% frame.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_ADVENTURER: {
    description:
      'PATH-BESPOKE — DragonBot male-adventurer path (2026-05-14 mirror of FEMALE_ADVENTURER, completely bespoke male pools). Gender-locked MAN of any D&D × LOTR fantasy race, any class. SLEEK adventuring gear — no bulky/massive armor, no shirtless/cheesecake, no artist-name lineage callouts. NSFW-clean. Strict Western high fantasy. Beards allowed for races where canon-appropriate (dwarves / humans / half-orcs / etc.). Character at 25-40% frame in candid mid-action moment. Painterly fantasy concept art. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_ACTION_SCENES: {
    description:
      'PATH-BESPOKE — DragonBot male-action-scenes path (2026-05-14 clone of MALE_ADVENTURER, massaged for pure action energy). Same gender-locked MAN, NSFW-clean, sleek-gear, strict-high-fantasy. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats with multi-effect stacking. Mirror of FEMALE_ACTION_SCENES for male protagonists. Character at 25-40% frame.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_DARK_REALM: {
    description:
      'PATH-BESPOKE — DragonBot dark-realm path (2026-05-14 migration). Corrupted wastelands / necromancer kingdoms / fallen empires / cursed lands. Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo energy. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted. Optional tiny figures (hooded wanderers / cursed knights / pilgrims) permitted as scale-provers. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_DRAGON_LORE: {
    description:
      'PATH-BESPOKE — DragonBot dragon-lore path (2026-05-14 migration from legacy function-based form). Ancient archaeological-fantasy evidence of dragons — massive skeletal remains, weathered murals depicting dragon wars, abandoned lairs with scattered hoards, fossilized eggs, ruined dragon-temples, crumbling dragon-rider outposts. The dragons are GONE but their presence echoes everywhere. Mood: WONDER + MELANCHOLY + REVERENCE + LOST GRANDEUR. Optional tiny figures (scholars / explorers / archaeologists) as scale-provers and mood-setters. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_LANDSCAPE: {
    description:
      'PATH-BESPOKE — DragonBot landscape path (2026-05-14 migration from legacy function-based form, cranked to movie-poster intensity 2026-05-14). Pure scenery — NO CHARACTERS, NO FIGURES. The landscape is the hero. "Land is alive" + "MOVIE POSTER" mandate: every render stacks 3+ visually striking elements (biome + architecture + dramatic phenomenon + scale-prover) for maximum awe. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere. Flagship weight-5 path.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // ARTSY_GIRL — frozen snapshot of FEMALE_WARRIOR (2026-05-13). Kevin
  // loved the Frazetta-cheesecake painted-fantasy-cover output female-warrior
  // was producing and asked for it bottled as its own path, independent of
  // future female-warrior tuning. Identical archetype shape; separate
  // identity so the template/pools/wrapper can be frozen.
  ARTSY_GIRL: {
    description:
      'PATH-BESPOKE — DragonBot artsy-girl path. Frozen 2026-05-13 clone of FEMALE_WARRIOR producing Frazetta / Brom / Vallejo painted-fantasy-novel-cover heroines in cinematic peaceful adventuring moments. Cheesecake-friendly painterly aesthetic. Locked separately from female-warrior so race-lock / armor-coverage tuning on female-warrior never touches this path.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['landscape', 'action', 'warrior_archetype', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_SCENE: {
    description:
      'PATH-BESPOKE — DragonBot dragon-scene path. Traditional Western dragon (4 legs + 2 wings + horned reptilian skull) is the SUBJECT in a jaw-dropping fantasy landscape. NO characters/riders/humans. Path-bespoke pools for dragon (anatomy) + action (mid-action moment) + landscape (epic biome) + drama (40% gated environmental event) + surprise_element (tiny secondary subject). Canonical-LITE — DragonBot uses minimal wrapper layer so Sonnet body leads.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'action', 'landscape', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  COZY_INTERIOR: {
    description:
      'Intentionally minimalist canonical-LITE — narrative universal axes only (story_beat / composition_frame / emotional_dna / lighting). Skips scale_provers / surprise_element / weather_particulate / sky_layer (these would over-stuff intimate scenes). 3 path-bespoke pools: interior (fat-seed primary) + cozy_moment (40% gated drama) + warmth_source (intimate framing axis).',
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
    description:
      'Alien planet biome as hero. Anchor entity at TINY/SMALL scale (silhouette scale prover). Path-bespoke pools for biome, lone wilderness witness (anchor_entity overrides bot default), candid landscape moment, signature deep-distance feature. Bot surprise_element is wired (was previously missing).',
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
    description:
      'NASA-grade photoreal astrophotography — slim seed (named astronomical objects) + full canonical axes. Sonnet weaves the layers; medium wrapper adds Hubble/JWST/Chandra/EHT cranked-to-11 framing.',
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
