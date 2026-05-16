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

  GOTHBOT_GOTH_MALE_CLOSEUP: {
    description:
      "PATH-BESPOKE — GothBot goth-male-closeup path (2026-05-15 migration). MYSTERIOUS, OMINOUS, DEADLY dark-aristocrat closeups — male-locked. Vampire-lord / dark-prince / shadow-assassin / dark-warlock / death-god / dark-hunter closeups in tight frame (face + throat + one shoulder). Castlevania / Bloodborne / Crimson-Peak / Witcher dark-male-aristocrat lineage. Gender-locked MALE (he/his/man). Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean. 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / face_detail / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'face_detail',
        'wardrobe',
        'accessory',
      ],
      path: ['candid_moment', 'camera_perspective'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_VAMPIRE_GIRLS_2: {
    description:
      "PATH-BESPOKE — GothBot vampire-girls-2 path (2026-05-15 migration). STRICT VAMPIRE bust portraits — DEAD-PALE corpse-skin, HEAVY DARK GOTH MAKEUP, GLOWING eyes radiating inhuman light, DEMONIC tell (fang / clawed fingertip / slit pupil). Stylized dark-fantasy splash painting / gothic horror character art aesthetic. NOT old-master oil, NOT museum patina, NOT smooth-digital, NOT pretty-girl-in-dress. Gender-locked FEMALE. Solo only. Character at LARGE anchor (bust 40-50% of frame). Reuses 9 existing production-scale vampire pools (compositions / menace_features / settings / killer_details / hair / wardrobe / archetypes / ethnicities / lighting — already at 100 entries each). Unique TEMPLATE: weaves ethnicity + makeup + glow + hair + wardrobe + posture into ONE UNIFIED vampire description (no separate fields for Sonnet to summarize away).",
    slots: {
      universal: ['atmosphere'],
      bot: [],
      characterDnaAxes: ['archetype', 'ethnicity', 'hair', 'wardrobe', 'menace_feature'],
      path: ['composition', 'scene', 'hero_element', 'lighting'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_GOTH_CLOSEUP: {
    description:
      "PATH-BESPOKE — GothBot goth-closeup path (2026-05-15 migration). HAUNTINGLY BEAUTIFUL dark-seductress closeups — SEXY + SULTRY + EVIL + FEISTY gothic women in tight frame (face + throat + one shoulder). Castlevania / Crimson Peak / Bloodborne / Devil-May-Cry dark-beauty lineage. Gender-locked FEMALE. Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean (no nipple/cleavage emphasis). 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / makeup / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'makeup',
        'wardrobe',
        'accessory',
      ],
      path: ['candid_moment', 'camera_perspective'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_COZY_GOTH: {
    description:
      "PATH-BESPOKE — GothBot cozy-goth path (2026-05-15 migration, R3 figure-accent added). LAYERED WITCH'S-LAIR / WIZARD'S-WORKROOM / OCCULT-APOTHECARY interiors — warm-dark gothic spaces with a TWIST OF MAGIC, ALWAYS inhabited by a small mysterious-feminine figure (gypsy fortune-teller / vampire-noblewoman / mysterious-witch / cloaked-mystic / dark-baroness) at deep midground 8-15% of frame as SCALE-PROVER ONLY. Interior stays the hero at 80%+ visual weight. GOTH + TWIST OF MAGIC + small mysterious witness. 5 path-bespoke axes (interior_space / magical_glow_item pickN:3 / occult_artifact pickN:3 / figure_accent / ambient_atmosphere) + universal lighting + atmosphere.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'interior_space',
        'magical_glow_item',
        'occult_artifact',
        'figure_accent',
        'ambient_atmosphere',
      ],
    },
    pickN: { magical_glow_item: 3, occult_artifact: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_CASTLEVANIA_SCENE: {
    description:
      "PATH-BESPOKE — GothBot castlevania-scene path (2026-05-15 migration). STRICT KONAMI CASTLEVANIA aesthetic — Dracula's-castle / Symphony-of-the-Night / Bloodlines / Lords-of-Shadow / Order-of-Ecclesia visual canon. Ayami-Kojima painted concept-art lineage. STRUCTURE IS THE HERO — the Castlevania building dominates the frame with art-nouveau ornate gothic detail. BOLD + LUSH + FULL-COLOR-SATURATED palette (royal violet / deep crimson / sapphire / gold-leaf / emerald / amber). 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere. Differentiator vs gothic-architecture: STRICTLY Castlevania-game-coded — Wallachian / Vlad-Tepes-coded / Bram-Stoker-Dracula-coded — NOT Bloodborne, NOT generic-gothic, NOT Hammer-horror.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer'],
    },
    pickN: { architectural_detail: 3 },
    conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTHIC_ARCHITECTURE: {
    description:
      'PATH-BESPOKE — GothBot gothic-architecture path (2026-05-15 bespoke migration). STRUCTURE IS THE HERO with MASSIVE VERTICAL EPIC SCALE — towering, clawing upward, dwarfing everything. Inner dark-magic light glows from within. Ornate architectural detail porn. Two accent layers: accent_creature (80%-gated dark-wildlife) + spice_decoration (100% small atmospheric flourish — vivid moons, lanterns, wisps, sigils). Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls lineage. Exterior-only. 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer'],
    },
    pickN: { architectural_detail: 3 },
    conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTHIC_VISTA: {
    description:
      'PATH-BESPOKE — GothBot gothic-vista path (2026-05-15 migration). Sister to dark-landscape but with "LAND IS ALIVE" mandate: every render saturated with dark-wildlife (crows / bats / wolves / fireflies), bioluminescent dark-flora (nightshade / moonflowers / glowing-fungi), structures glowing-from-within (witch-fire windows / candle-towers), and SUPERNATURAL-PRESENCE (fog-moving-wrong / shadow-pools / will-o-wisps). Haunted gorgeous awe-and-dread. NO CHARACTERS. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
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

  GOTHBOT_DARK_LANDSCAPE: {
    description:
      'PATH-BESPOKE — GothBot dark-landscape path (2026-05-15 migration from legacy function-based form). Pure gothic landscape — NO CHARACTERS. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton visual lineage (NEVER LOTR / Skyrim / Witcher). Movie-poster wide-vista compositions: vampire castles / cemeteries / abbey ruins / coastal cliffs / haunted forests / cursed villages. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
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

  ARCANE_SPACES: {
    description:
      'PATH-BESPOKE — DragonBot arcane-spaces path (2026-05-15). Sister path to arcane-halls. Grand magical INTERIOR SPACES — vast architectural marvels with obsessive magic-density saturating the room. NO CHARACTERS — pure environment. Cathedral halls / throne rooms / floating-platform libraries / gateway arch chambers / ritual conclaves / observatories / vault corridors / etc. Architecture is the subject; magic phenomena fill every quadrant. Reuses ARCANE_HALL (200) + ARCANE_HALL_PHENOMENA (100, pickN:3) pools.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['hall', 'magic_phenomena'],
    },
    pickN: { magic_phenomena: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  ARCANE_HALLS: {
    description:
      'PATH-BESPOKE — DragonBot arcane-halls path (2026-05-15 pivot — was no-character magic-overload, NOW character-mid-magic-moment). A single spellcaster (mage / cleric / sorceress / druid / warlock / archmage / etc.) caught at the apex of their magical moment INSIDE a grand magical interior (cathedral hall / throne room / courtyard / stairwell / vault / banquet hall / observatory / etc.). The character is the focal point — MAGIC IS PARAMOUNT, visibly pouring from them and saturating the space. Path-bespoke axes (hall / caster / spell_moment / magic_phenomena pickN:2) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['hall', 'caster', 'spell_moment', 'magic_phenomena'],
    },
    pickN: { magic_phenomena: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  ICONIC_LANDSCAPE: {
    description:
      'PATH-BESPOKE — DragonBot iconic-landscape path (2026-05-14 merger of wow-landscape + lotr-landscape into a single stylized-fantasy-biome path). Stylized/saturated/iconic fantasy biomes drawing from BOTH the Tolkien-mythic-grandeur tradition AND the Blizzard-hand-painted-stylized tradition. Iconic archetypal biomes: Shire-pastoral / Mordor-volcanic / Rivendell-valley / Moonglade-elven / fel-corrupted-alien / Misty-Mountains-cold / Lothlorien-golden-wood / Northrend-tundra / Pandaria-bamboo / etc. NO CHARACTERS — pure landscape. Saturated stylized aesthetic distinct from the realistic-coded main `landscape` path. 3 path-bespoke axes (biome / sky_layer / phenomenon 60%-gated) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EPIC_MOMENT: {
    description:
      'PATH-BESPOKE — DragonBot epic-moment path = EPIC CASTLE SCENES (2026-05-14 migration + reframing). The CASTLE is the hero — massive, sweeping, awe-inducing fantasy castle filling the frame. A huge cinematic event is happening at/in/around it: dragons attacking / massive siege underway / magic portal opening above the courtyard / royal coronation procession / cavalry charge through the gates / summoning ritual on the battlements / fleet of war-galleys approaching the harbor / leyline-storm breaking over the spires. Wide cinematic establishing shots. People/armies/crowds at scale-prover size, dwarfed by both castle and event. 2 path-bespoke axes (castle / event) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['castle', 'event'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  FANTASY_SCENE: {
    description:
      'PATH-BESPOKE — DragonBot fantasy-scene path (2026-05-14 migration from legacy + cranked to movie-poster intensity). A single fantasy character integrated into an epic magical landscape, engaged with the magic / setting. Movie-poster mandate: every render stacks 3+ visually-striking elements (character + epic landscape + atmospheric phenomenon + scale-prover or magic-effect). Reuses 200-entry FANTASY_CHARACTERS + 280-entry FANTASY_LANDSCAPES + bespoke 50-entry action + 30-entry drama (80%-gated almost-always-fires).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['character', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.8 },
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

  MECHBOT_TITAN_WAR: {
    description:
      'PATH-BESPOKE — MechBot titan-war-machines path (2026-05-15 migration to declarative composer). Kilometer-scale combat machines in mid-engagement, biblical scale, Pacific Rim / 40K Imperator / AT-AT / Attack on Titan colossus lineage. REUSES legacy 200-entry subject/action/setting pools. Adds 3 path-bespoke pools: lighting (ground-based combat, overrides cosmic bot default), composition (vertigo-inducing camera angles — worm\'s-eye / fly-between-legs / kaiju-step-on-camera / aerial-orbit / dwarfed-skyline), and 40%-gated drama (orbital-strike / EMP-burst / artillery flashes / sonic-boom shockwaves / kaiju-footfall pressure-waves). VERTIGO + BIBLICAL SCALE are mandatory.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_SKYSHIPS: {
    description:
      'PATH-BESPOKE — MechBot mech-skyships path (2026-05-15 migration; 2026-05-16 simplified after Kevin\'s heart-calibration revealed the path should produce SOLO BEAUTIFUL SHIPS in dramatic atmospheric skies, not multi-actor combat scenes). Flying sci-fi mech-vessels with predatory blade silhouettes, fang prows, glowing power conduits. NOT modern military. Reuses legacy 200-entry subject/action/setting pools + 3 path-bespoke pools: composition (SKY vertigo angles), lighting (aerial flight overrides cosmic bot default), drama (40%-gated sky-combat phenomena). VERTIGO COMPOSITION + simplified movie-poster mandate (every-quadrant-striking, multi-tier depth, saturated theatrical sky) + "TURNED UP TO 11" multi-layer atmospheric stack. NO forced multi-actor / engagement / named-call-signs / peak-DNA mandates — let the SHIP be the show.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
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

  STEAMBOT_STEAMPUNK_WOMAN: {
    description:
      'PATH-BESPOKE — SteamBot sexy-steampunk-woman path (2026-05-15 rewrite to canonical character-path shape). Single steampunk WOMAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. THE OUTFIT IS THE MAIN SHOW — super ornate, layered, tasteful Victorian opulent couture (Mucha / Klimt / Pre-Raphaelite / BioShock-Infinite Elizabeth lineage). NSFW-clean vocabulary. Sister to DragonBot ARTSY_GIRL and StarBot FEMALE_EXPLORER. 7 character DNA axes (skin/eyes/makeup/hair_color/hairstyle/outfit/accessory) + 3 path-bespoke (persona/landscape/action) + 2 universal (lighting/atmosphere).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'skin',
        'eyes',
        'makeup',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['persona', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_MAN: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-man path (2026-05-15 rewrite to canonical character-path shape, mirror of STEAMBOT_STEAMPUNK_WOMAN). Single steampunk MAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. HANDSOME / DASHING / RUGGED / INTENT / CAPABLE — never sexy/seductive. Oil-painted illustration on canvas (Frazetta / Brom / Vallejo painted-fantasy-cover lineage). Strict male DNA (skin / eyes / facial_hair / hair_color / hairstyle / outfit / accessory) — never cross-polluted with female vocab. 7 character DNA axes + 3 path-bespoke (persona / landscape / action) + 2 universal (lighting / atmosphere).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'skin',
        'eyes',
        'facial_hair',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['persona', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_AIRSHIP_SKIES: {
    description:
      'PATH-BESPOKE — SteamBot airship-skies path (2026-05-15 migration from function-based form). MOVIE-POSTER airship scenes — dirigibles, sky-galleons, packet-ships, sky-clippers in vertigo-inducing dramatic-sky moments. NO ground, NO city — pure sky-world. Mortal-Engines / Treasure-Planet / Howl\'s-Moving-Castle / Last-Exile / Atlantis-lost-empire / Skies-of-Arcadia visual lineage. 4 path-bespoke axes (scene / sky_layer / surprise_element / phenomenon 70%-gated) + universal lighting + atmosphere. NO CHARACTERS as primary subject.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'sky_layer', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_CURIO: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-curio path (2026-05-15 migration, refined to animate-creature-in-habitat). OBJECT-AS-HERO — a single ANIMATE steampunk robot creature (mimicking a real living thing OR a novel mechanical organism) caught mid-motion in an IMMERSIVE Victorian-industrial habitat (workshop / conservatory / library / observatory / atelier / airship interior / etc.). NEVER jewelry, NEVER crowns, NEVER clocks-as-subject, NEVER museum-display framing. NO PRIMARY HUMAN FIGURE. 3 path-bespoke axes (curio / habitat / ornate_flourish pickN:3) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['curio', 'habitat', 'ornate_flourish'],
    },
    pickN: { ornate_flourish: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_SPECTACLE: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-spectacle path (2026-05-15 migration). GRAND EVENTS / CEREMONIES / FESTIVALS / PERFORMANCES / UPRISINGS in Victorian-industrial worlds. CROWD-driven scenes — tiny figures against massive machinery, packed balconies, sea of top-hats and goggles. THE EVENT IS THE SUBJECT — never a single person. Wide cinematic establishing shots or dramatic crowd-level angles. 3 path-bespoke axes (event / crowd_detail / surprise_element) + 1 conditional 40%-gated (escalation) + universal lighting + atmosphere. Reuses production-scale 199-entry SPECTACLE_EVENTS pool.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['event', 'crowd_detail', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'escalation', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAM_TRANSPORT: {
    description:
      'PATH-BESPOKE — SteamBot steam-transport path (2026-05-15 migration). Non-airship Victorian-industrial vehicles (locomotives / submarines / walking-machines / paddleboats / steam-carriages / mine-cages / clockwork-creatures-as-transport) in DRAMATIC TERRAIN. The vehicle and the landscape create the drama TOGETHER — a train is boring on flat track, epic crossing a canyon bridge in a storm. SHOW THE MACHINE CONQUERING IMPOSSIBLE GEOGRAPHY. 3 path-bespoke axes (transport / terrain_drama / surprise_element) + 1 conditional 50%-gated (phenomenon) + universal lighting + atmosphere. Reuses production-scale 200-entry TRANSPORT_SCENES pool.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['transport', 'terrain_drama', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_COZY_STEAMPUNK: {
    description:
      'PATH-BESPOKE — SteamBot cozy-steampunk path (2026-05-15 resurrection + axis migration). Dreamy ethereal cozy Victorian-industrial INTERIORS — pretty rooms with steampunk furniture, beds, flower arrangements, ornate fixtures, AND a beautiful window view (sunset / rainstorm aqua sky / distant airships / cloudtops). Multi-layered: pretty room + pretty window view together. Comforting + surreally beautiful + intricate. 4 path-bespoke axes (room / flora pickN:3 / window_view / intricate_detail pickN:2) + 1 conditional 40%-gated (quiet_moment) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['room', 'flora', 'window_view', 'intricate_detail'],
    },
    pickN: { flora: 3, intricate_detail: 2 },
    conditionalLayer: { slot: 'quiet_moment', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_SCENE: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-scene path (2026-05-15 migration). CHARACTER INTEGRATED INTO EPIC STEAMPUNK SCENE — a role-based steampunk figure (clockwork magistrate / sky-nomad / weather-prognosticator / etc. — gender-agnostic, persona-driven) AT MEDIUM scale (15-25% frame) standing inside a wildly imaginative steampunk landscape (Big-Ben-clockwork-opened / gear-waterfall / floating-metropolis / mechanical-jungle / brass-cathedral / etc.). The LANDSCAPE is the co-hero. Cinematic feature-film concept render with photoreal physical light. 3 path-bespoke axes (character / landscape / surprise_element) + conditional event 40%-gated + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['character', 'landscape', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },
};

module.exports = { ARCHETYPES };
