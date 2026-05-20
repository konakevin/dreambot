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

  GOTHBOT_MONSTER_PROWL: {
    description:
      'PATH-BESPOKE — GothBot monster-prowl path (2026-05-16 bespoke migration from legacy function-form). SOLO GOTHIC CREATURE OUT IN THE WILD doing creature-business — vampire / werewolf / gargoyle / succubus / demon / banshee / lich / harpy / wraith / etc. Wide cinematic full-body composition: creature 25-40% of frame, gothic stage + epic backdrop 60-75% (scenery and creature share costar spotlight). Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster lineage. Solo only — NO hunter (assassin paths), NO combat (combat path), NO second figure. NO gore, NO mid-bite-on-victim. Reuses existing 200-entry pools: CREATURE_ARCHETYPE + CREATURE_WILD_ACTION + ASSASSIN_STAGE + ASSASSIN_EPIC_BACKDROP. 4 path-bespoke axes + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'action', 'stage', 'backdrop'],
    },
    pickN: {},
    conditionalLayer: null,
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

  BLOOMBOT_FLOWER_TUNNELS: {
    description:
      'PATH-BESPOKE — BloomBot flower-tunnels path (2026-05-19 NEW). POV-through-tunnels-of-flowers where flowers are BOTH the dominant visual AND the light source (saturated color caught in dim ambient reads as lanterns / chandeliers / fairy-lights). Variants: wisteria-cathedral cascades, forest tree-canopy paths, lava-tube with Hawaiian flowers, spiraling flower-wormholes, flower-portals to other dimensions, bloom-caves, cherry-blossom archways. 3 path-bespoke pools (tunnel_setting / flower_lanterns / atmospheric_phenomenon-40%-gated) + universal lighting/atmosphere. Inspired by user-hearted bloom-tunnel render where marigolds + wisteria-strands visually functioned as lanterns through saturated petal-color in dim torch-warm ambient.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['tunnel_setting', 'flower_lanterns'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_FRIENDS: {
    description:
      'PATH-BESPOKE — BloomBot flower-friends path (2026-05-19 NEW). CLOSE-UP FLOWER + PLEASANT POLLINATOR pairing renders — beautiful butterfly / bumblebee / dragonfly / ladybug / firefly / moth co-hero with a hero bloom in a soft magical close-up scene with bouquet-cluster foreground + dreamy bokeh background + optional pollen-dust / fairy-light particles. All flower colors welcome. 3 path-bespoke pools (flower_focal_cluster / hero_pollinator / magical_particles-40%-gated) + universal lighting. Inspired by 6 user-hearted IG cozy-insect-on-flower references.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['flower_focal_cluster', 'hero_pollinator'],
    },
    pickN: {},
    conditionalLayer: { slot: 'magical_particles', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_HUMMING_BIRDS: {
    description:
      'PATH-BESPOKE — BloomBot flower-humming-birds path (2026-05-19 NEW). VIBRANT enchanted-garden scenes with 2-4+ iridescent hummingbirds + 3-5+ hummingbird-attracting flowers (trumpet vine, fuchsia, salvia, hibiscus, bee balm, columbine, butterfly bush, cardinal flower, lupine, foxglove, petunia). NO soft-pastel restriction — vibrant saturated jewel-tone register. Hummingbirds rendered with iridescent jewel-tone plumage, wings in motion-blur, dynamic poses (hovering / sipping / mid-flight). 3 path-bespoke pools (flower_focal_cluster / hummingbird_cast / magical_particles-40%-gated) + universal lighting. Sister path to flower-friends.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['flower_focal_cluster', 'hummingbird_cast'],
    },
    pickN: {},
    conditionalLayer: { slot: 'magical_particles', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_FANTASY: {
    description:
      'PATH-BESPOKE — BloomBot flower-fantasy path (2026-05-19 NEW). SURREAL SCALE-INVERSION FLOWER SCENES — natural-world landscapes (forests, valleys, riverbeds, hills, mountainsides, glades) where natural elements are CONSTRUCTED FROM FLOWERS or scale is wildly inverted: giant flower-mushroom in a meadow, forest where every tree is an oversized overgrown flower, river of petals flowing through a glade, pine-trees-that-are-flowers, hillside of tulip-mountains. NO animals / NO humans / NO manmade objects — naturalistic landscape forms reimagined through flowers + unexpected scale. Surreal-magical-realism register. Inspired by Kevin-hearted bloombot post (giant pink flower-mushroom in misty meadow). 3 path-bespoke pools (scale_form / floor_carpet / atmospheric_magic-40%-gated) + universal lighting.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['scale_form', 'floor_carpet'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_magic', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_DESERT_BLOOM: {
    description:
      'PATH-BESPOKE — BloomBot desert-bloom path (2026-05-19 NEW). SOUTHWEST DESERT LANDSCAPES juxtaposed with an EXPLOSION OF WILDFLOWERS — saguaro corridors, joshua-tree groves, agave fields, red-rock canyons, mesa silhouettes, sand dunes — paired with a vivid carpet of desert wildflowers exploding around / between / through the desert elements. Vivid saturated SOUTHWEST register (NOT soft-pastel). Inspired by Kevin-hearted bloombot post — saguaro corridor with vivid red/coral wildflower carpet. 3 path-bespoke pools (desert_anchor / bloom_explosion / atmospheric_magic-40%-gated) + universal lighting.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['desert_anchor', 'bloom_explosion'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_magic', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_SUNSET_FLOWERS: {
    description:
      'PATH-BESPOKE — BloomBot sunset-flowers path (2026-05-19 NEW). SUN-BACKLIT-FLOWER renders where the visible sun is the light source and foreground flowers are strongly backlit / rim-lit — petal edges blazing in warm sun-rim-light against a soft pretty golden-hour sky over a wide gorgeous landscape. Naturalistic photography register (hibiscus / cosmos / cherry-blossom / dandelion / azalea / wisteria / tulip against mountains / hills / lakes / forests / coast). 4 path-bespoke pools (hero_flower / landscape_backdrop / sunset_sky / sun_position) + universal lighting + 40%-gated atmospheric_phenomenon. Inspired by 7 user-hearted IG bloom-against-sunset renders.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['hero_flower', 'landscape_backdrop', 'sunset_sky', 'sun_position'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_CASTLE: {
    description:
      'PATH-BESPOKE — DragonBot castle path (2026-05-17 NEW). Majestic epic beautiful castle views — castles are 100% the focal subject, set amongst gorgeous fantasy backdrops with massive sense of scale. Distinct from epic-moment (50/50 castle + event) — this is pure castle-as-hero, movie-poster establishing shot energy. 5 path-bespoke pools: castle (architectural subject) + biome (gorgeous fantasy backdrop) + sky_layer (dramatic sky) + scale_prover (tiny element proving scale) + phenomenon (40%-gated atmospheric flourish). Lineage: Helms-Deep / Minas-Tirith / Edoras / Erebor / Anor-Londo establishing-shot.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['castle', 'biome', 'sky_layer', 'scale_prover'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.4 },
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

  MECHBOT_MECHA_PILOTS: {
    description:
      'PATH-BESPOKE — MechBot mecha-pilots path (2026-05-16 migration; third MechBot path). Pilot + giant mech with scale-relationship as the punchline (Gundam / Evangelion / Pacific Rim / Iron Giant / Titanfall). Pilot tiny, mech enormous, mid-action moment of boarding / climbing / repairing / deploying — NOT active battlefield. Pilot biology = anything goes. Reuses legacy 200-entry subject/action/setting pools + 3 path-bespoke pools: composition (30 full-body-mech vertigo angles across 15+ environments), lighting (hangar/silo/dawn-deployment overrides cosmic bot default), drama (40%-gated deployment phenomena). MECH FILLS 50-100% OF FRAME BODY (no fragments — head-to-foot silhouette mandatory).',
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

  MECHBOT_POWER_ARMOR_INFANTRY: {
    description:
      'PATH-BESPOKE — MechBot power-armor-infantry path (2026-05-16 migration; fourth MechBot path). MEAN KILL-TEAM squads of 8-12 marines + 2-4 allied combat-bots/drones/walkers in heavy power armor. FULL MAN+MACHINE vs MACHINE combat at maximum-density commotion (per Kevin 2026-05-16). Helldivers 2 + Guard-Dog rovers / WH40K Tactical Squad + Dreadnought + Servitor / Aliens Colonial Marines + Power-Loader + APC / Mass Effect squad + LOKI mechs / Starcraft Marines + Goliath / Avatar Marines + AMP-suits lineage (Star Wars + Halo IP names BANNED — see gen recipe banlist). Hard pivot from legacy "professional military procedural" framing — these must read as MEAN, aggressive, scarred, predator-killers fighting WITH multiple friendly machines amid multiple simultaneous explosions/fires/smoke. 6 path-bespoke pools: composition (squad-combat vertigo angles), lighting (battlefield combat overrides cosmic bot default), engagement (ALWAYS-ON multi-actor combat narrative — per mech-skyships engagement-pool lesson), allied_tech (ALWAYS-ON x2 friendly combat-bots/drones/walkers — added 2026-05-16 for man+machine DNA, pickN:2 for multiple machine-types per render), drama (ALWAYS-ON battlefield phenomena — gate raised 0.4→1.0 for max-density). Reuses legacy 200-entry POWER_ARMOR_SETTINGS.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition', 'engagement', 'allied_tech'],
    },
    pickN: { allied_tech: 2 },
    conditionalLayer: { slot: 'drama', gate: 1.0 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_POST_APOC_RUST_TECH: {
    description:
      'PATH-BESPOKE — MechBot post-apoc-rust-tech path (2026-05-16 migration; sixth MechBot path). FAR-FUTURE sci-fi BUSH-FIX scavenger rigs + crews running across post-apoc wasteland. Mad Max Fury Road (sci-fi-tilted) / Borderlands Pandora / WH40K Ork-Looted / Dune Sardaukar-thopter / Cyberpunk 2077 Nomad-clan / Horizon Zero Dawn rebel-tech / Death Stranding off-Earth lineage. Subject/action/setting pools FULLY REGENERATED 2026-05-16 with sci-fi-tilt + bush-fix mandate baked in (legacy 200-entry pools had present-day-truck / modern-refinery / 21st-century-Earth DNA that surgical word-replace patches couldn\'t fix at the concept level). New 30-entry MVP pools — fusion-cell engines, plasma-drives, alien-tech salvage, hover-skirts, glowing energy-conduits, scavenged orbital-debris. 3 path-bespoke pools added: composition (Mad Max chase angles), lighting (Fury Road wasteland), drama (40%-gated wasteland phenomena).',
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

  MECHBOT_HUMANOID_ROBOTS: {
    description:
      'PATH-BESPOKE — MechBot humanoid-robots path (2026-05-17 NEW PATH, not a migration). Sister to legacy robot-moment (kept untouched) for SPECIFICALLY HUMAN-SCALE BIPEDAL HUMANOID ROBOTS only. Calibrated to Kevin\'s 10 reference images 2026-05-17: polished chrome/titanium/brushed-metal chassis (NOT scrap-weld), multi-iris compound-optic head-arrays (kaleidoscope rainbow eye-lenses), multi-color glowing joint-seams + chest-cores + shoulder-orbs (cyan/amber/magenta/emerald blend), atmospheric cinematic outdoor settings (waterfall/snow-mountain/canyon/overgrown ruin/fire-glow wasteland) over urban-corporate. Allows feminine + masculine + androgynous + alien-form chassis. Both contemplative-still AND mid-action poses welcome. MOVIE POSTER MANDATE baked into template — every render a flagship concept-art frame. 6 path-bespoke pools.',
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

  MECHBOT_CYBORG_WOMAN: {
    description:
      'PATH-BESPOKE — MechBot cyborg-woman path (2026-05-17 migration; eighth MechBot path; 2026-05-17 evening update — added cyborg_material axis + alien-hybrid framing). Half-human half-machine being. Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 / Westworld lineage. Beautiful + terrifying. Character DNA (characterBase / skin / bodyType / eyes / hair / internal / glowColor) continues from bot.rollSharedDNA(cyborg-woman). 5 path-bespoke pools (cyborg_feature / cyborg_material / action / landscape / composition) + 1 conditional drama (40%-gated). Composition pool mixes 60% closeup detail-shots + 40% full-body framings. Material pool dedicated axis for finish variety (chrome / brass / pearl-ivory / xenomaterial / dichroic / etc.) — alien-hybrid skin tones welcome. Template preserves legacy identity guards: face MUST show cyborg, multi-cyborg-reveal mandate (3-4 distinct reveals), full-body cyborg-detail mandate (5-7 body parts) to prevent the "bikini" failure mode, solo composition, banned imagery.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_CYBORG_MAN: {
    description:
      'PATH-BESPOKE — MechBot cyborg-man path (2026-05-17 axis migration; mirror of MECHBOT_CYBORG_WOMAN with male badass recoding per Kevin: rugged / handsome / capable / mysterious / NOT sexy). Solid Snake / Adam Jensen / Geralt-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V lineage. Half-human half-machine MALE being. Character DNA from bot.rollSharedDNA(cyborg-man) — existing male pools (CYBORG_MALE_FEATURES / CYBORG_MALE_CHARACTERS / CYBORG_MALE_ACTIONS / etc.). 5 path-bespoke pools (cyborg_feature / cyborg_material / action / landscape / composition) + 1 conditional drama (40%-gated). Composition pool bespoke 50/50 closeup-badass + full-body-action (CYBORG_MAN_COMPOSITION). Material + drama reuse the gender-neutral CYBORG_WOMAN_* pools. Template recodes masculinity hard — mandatory opening anchor tag ("Adult male cyborg (NOT female), strong jawline, broad shoulders, narrow hips, adult masculine build"), banned feminine words list (pretty / beautiful / delicate / sexy / etc.), badass replacement words (rugged / weathered / capable / lethal / mysterious). Preserves all cyborg safety rails (face human-visible + part-cyborg, multi-reveal mandate, full-body cyborg-detail mandate to prevent glamour failure, solo composition, banned imagery, NO full body armor since combat-droid territory).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_DROID_ASSASSIN: {
    description:
      'PATH-BESPOKE — MechBot droid-assassin path (2026-05-17 NEW). Sister of MECHBOT_CYBORG_WOMAN with a HARD slant toward killer-cyborg / assassin / rogue / mysterious / capable / violent. Same DNA pipeline + same pools, but the template register pulls her into predatory / lethal / shadowed / tactical territory instead of contemplative-beauty. Preserves all safety rails (chest coverage, no mech nipples, exposed inner workings, alien-bend variants).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
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

  STEAMBOT_STEAMPUNK_LABS: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-labs path (2026-05-16 axis-system migration). VICTORIAN-INDUSTRIAL MAD-SCIENCE LABORATORY INTERIOR — soaring arched-glass ceilings, two-story balconies, brass-and-mahogany shelving, gas-lamps, mosaic-tile floors with embedded sigil-patterns. A MAJOR GLOWING EXPERIMENT centerpiece (containment-sphere / Tesla-coil / distillation-column / etc.) anchors the scene. 80%-gated Tesla-coil electrical phenomena and 60%-gated tiny lab-coated scientist scale-prover figure. Inspired by Tesla\'s Wardenclyffe / Frankenstein\'s tower-lab / Nemo\'s Nautilus / Royal Society. Varied palette across renders — architecture is wood-brass-glass, color comes from experiment glow (green/blue/amber/violet/pink/etc.). 4 path-bespoke axes (lab_space / centerpiece / apparatus pickN:3 / electrical 80%-gated) + 60%-gated scientist + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['lab_space', 'centerpiece', 'apparatus', 'electrical'],
    },
    pickN: { apparatus: 3 },
    conditionalLayer: { slot: 'scientist', gate: 0.6 },
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

  BLOOMBOT_LANDSCAPE: {
    description:
      'PATH-BESPOKE — BloomBot landscape path. NOT IN USE (2026-05-16 migration attempted + REVERTED; legacy compose.js outperforms). Archetype + template + pools preserved for reference / future re-attempt. See memory file project_bloombot_landscape_kept_legacy.md for the over-stuffed-brief diagnosis.',
    slots: {
      universal: [],
      bot: [],
      path: ['landform', 'scale_prover', 'surprise_element', 'sky'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CLOSEUP: {
    description:
      'PATH-BESPOKE — BloomBot closeup path (2026-05-16 migration). MACRO VIEW pressing into a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT. HERO BLOOM AMONGST MANY composition mandate (heart-DNA from 2026-05-16 cf57b7eb): one specific hero species dominates the foreground at its OWN natural silhouette and scale — broad face / deep cup / pompom / hanging raceme / umbel / trumpet / spike depending on rolled species, NOT defaulting to tall spires. Supported by 2-3 species carpeting the crevices and threading the gaps. Dramatic single-source lighting hierarchy — warm hero / cool background. Material poetry at petal-scale. 8 poster-grade composition modes (low-angle / overhead-canopy / through-archway / diagonal lead-line / rim-light silhouette / shallow-depth tunnel / off-center hero / dappled light-drama) — vary across them. Anti-bouquet / anti-still-life front-loaded. 2 path-bespoke axes (bloom_wall_type / growing_context) + 60%-gated macro_phenomenon. Palette + lighting + regional flora roster via sharedDNA. 85-115 words.',
    slots: {
      universal: [],
      bot: [],
      path: ['bloom_wall_type', 'growing_context'],
    },
    pickN: {},
    conditionalLayer: { slot: 'macro_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_TROPICAL_PARADISE: {
    description:
      'PATH-BESPOKE — BloomBot tropical-paradise path (2026-05-16 migration). DENSE TROPICAL JUNGLE FLORAL SCENE. Region locked to "tropical" via BloomBot.rollSharedDNA. Wide cinematic shot showing depth + humid atmospheric perspective. MASSIVE showy tropical flowers (torch ginger / heliconia / plumeria / jade vine / cattleya orchid / bird-of-paradise) at jungle scale. Identifiably tropical vegetation scaffolding (palms / banana / banyan / philodendron / fern). 3 path-bespoke axes (tropical_setting / vegetation_anchor / surprise_creature 60%-gated). Palette + lighting + tropical roster via sharedDNA. 85-115 words.',
    slots: {
      universal: [],
      bot: [],
      path: ['tropical_setting', 'vegetation_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'surprise_creature', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_COZY: {
    description:
      'PATH-BESPOKE — BloomBot cozy path (2026-05-16 migration). COZY INTERIOR OVERGROWN BY FLOWERS. Warm humble domestic space — sunroom / breakfast nook / writing desk / arched window / attic dormer / stairwell landing — NEVER palace / ballroom / grand interior. The architecture is the scaffold the bloom-mass cascades through and over. HERO bloom species at the foreground focal plane + supporting cast carpeting / threading / draping the furniture. Dramatic single-source warm light through the window catches the hero blooms; supporting mass and the room beyond sit cooler. POSTCARD / MOVIE-STILL / GALLERY-PIECE framing mandate. 2 path-bespoke axes (interior_setting / furniture_anchor) + 60%-gated atmospheric_moment. Palette + lighting + roster via sharedDNA. 85-115 words.',
    slots: {
      universal: [],
      bot: [],
      path: ['interior_setting', 'furniture_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_moment', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_DREAMSCAPE: {
    description:
      'PATH-BESPOKE — BloomBot dreamscape path (2026-05-16 migration). SURREAL FLORAL DREAMSCAPE — physically impossible composition rendered with HYPERREAL/PHOTOREAL precision. Real earth-bound species (NOT alien flowers); the impossibility is in the LAYOUT (gravity-flipped / floating / mirror-world / Magritte-window / container-world / spiral-staircase / suspended-constellation). Magritte / Dali / Beksinski / Storm Thorgerson album-cover lineage. 3 path-bespoke axes (impossibility_type / world_element / atmospheric_halo 60%-gated). Palette + lighting + roster via sharedDNA.',
    slots: {
      universal: [],
      bot: [],
      path: ['impossibility_type', 'world_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_halo', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_GARDEN_WALK: {
    description:
      'PATH-BESPOKE — BloomBot garden-walk path (2026-05-16 migration). WALKABLE FLORAL PASSAGE inviting the viewer in. SYMMETRIC PORTRAIT composition mandate (archway centered, path leading dead-center, frame divided into foreground bloom-mass on each side + glowing depth-of-field at the path far end). 3 path-bespoke axes (archway_type / path_material / destination_glimpse) + 60%-gated atmospheric_phenomenon. Palette + lighting + roster via sharedDNA.',
    slots: {
      universal: [],
      bot: [],
      path: ['archway_type', 'path_material', 'destination_glimpse'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CONSERVATORY: {
    description:
      'PATH-BESPOKE — BloomBot conservatory path (2026-05-16 migration). VICTORIAN GLASS-AND-IRON CONSERVATORY interior fully OVERGROWN. NON-NEGOTIABLE Victorian glass-dome + wrought-iron framework architecture. Half-architectural / half-jungle. Wide-angle interior shot with volumetric god-rays through the glass. 3 path-bespoke axes (conservatory_type / structural_anchor / atmospheric_phenomenon 60%-gated). Palette + lighting + roster via sharedDNA.',
    slots: {
      universal: [],
      bot: [],
      path: ['conservatory_type', 'structural_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CITY_FLOWERS: {
    description:
      'PATH-BESPOKE — BloomBot city-flowers path (2026-05-16 migration). URBAN ARCHITECTURE HALF-CONSUMED BY FLOWERS. Wide street-photography composition with pedestrian-level POV + leading-lines into city depth. Architecture is the STRUCTURAL HERO; blooms are DISTRIBUTED MASS across balconies / window-boxes / iron grilles / staircases. 3 path-bespoke axes (city_setting / architectural_detail / atmospheric_phenomenon 60%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['city_setting', 'architectural_detail'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_RECLAIM: {
    description:
      'PATH-BESPOKE — BloomBot reclaim path (2026-05-17 migration). ABANDONED HUMAN STRUCTURES reclaimed by flowers. Awe + melancholy + triumphant-nature mood (NEVER horror). Wide cinematic composition with sun-shafts through broken architecture. Architecture is the STRUCTURAL HERO (in deep disrepair but RECOGNIZABLE); blooms are DISTRIBUTED MASS consuming every column, fallen stone, broken arch, cracked masonry. 3 path-bespoke axes (ruin_type / decay_anchor / atmospheric_phenomenon 60%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['ruin_type', 'decay_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },
  DINOBOT_PALEO_LANDSCAPE: {
    description:
      'PATH-BESPOKE — DinoBot paleo-landscape path (2026-05-17 axis-system migration from legacy function-form). PURE PREHISTORIC LANDSCAPE — Mesozoic / Jurassic / Cretaceous IMAX-scale ancient world vistas. NO dinosaurs as primary subject (only tiny distant silhouettes via surprise_element). The PRIMORDIAL WORLD itself is the hero — mega-flora, alien Earth, lush, alive. Avatar Pandora × Skull Island × Land-of-the-Lost overgrown jungle cinematics. Reuses PREHISTORIC_SETTINGS (200) as biome. 5 path-bespoke axes (biome / megaflora / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'megaflora', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },


  DINOBOT_SWAMP_RIVER: {
    description:
      'PATH-BESPOKE — DinoBot swamp-river path (2026-05-17 axis-system migration from legacy function-form). MESOZOIC SWAMP / RIVER / WATERWAY with a SEMI-AQUATIC DINOSAUR interacting with the water. Spinosaur fishing / sauropod wading / hadrosaur drinking / mosasaur breaching / crocodilian floating / pterosaur skimming. Water is the setting; dino is the candid focal subject (25-40% frame). NO humans. National-Geographic-cinematic candid moment. 3 path-bespoke axes (water_scene / dino / surprise) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['water_scene', 'dino', 'surprise'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },
  DINOBOT_OCEAN_REPTILES: {
    description:
      'PATH-BESPOKE — DinoBot ocean-reptiles path (2026-05-17 axis-system migration from legacy function-form). STRICT MESOZOIC OPEN OCEAN with a MARINE REPTILE (mosasaur / plesiosaur / ichthyosaur / pliosaur / marine crocodile / Archelon sea-turtle / ammonite / marine pterosaur over ocean). Underwater scenes + mid-ocean breach + surface-break encouraged. NEVER river / swamp / lake. ONLY actual ocean dinosaurs (NO land dinos). 25-40% marine reptile + 55-65% ocean-scene (open water / underwater / breach / abyss / reef). 3 path-bespoke axes (ocean_scene / creature / surprise) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['ocean_scene', 'creature', 'surprise'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_NESTING_GROUND: {
    description:
      'PATH-BESPOKE — DinoBot nesting-ground path (2026-05-17 axis-system migration). MESOZOIC FAMILY-LIFE scenes — hatchlings tumbling, parents teaching juveniles, siblings play-fighting, families migrating, communal nurseries. The full spectrum of dinosaur family behavior (not just egg-sitting). Reuses NESTING_SCENES (200 fat-seed family-life scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for family-specific small accents. National-Geographic-cinematic tender prehistoric family moments. 3 path-bespoke axes (biome / family_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'family_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_HERD_MIGRATION: {
    description:
      'PATH-BESPOKE — DinoBot herd-migration path (2026-05-17 axis-system migration). COLOSSAL DINOSAUR HERDS crossing alien-Mesozoic landscapes. Hero foreground dinosaurs (35-55% frame) + massive 50-200 strong herd extending into vanishing-point haze. Silhouettes scream DINOSAUR (neck-S-curves, crests, frills, plate-rows, spike-tails) never wildebeest. Reuses HERD_SCENES (200 fat-seed herd scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for herd-specific small accents. BBC-Planet-Earth-meets-Prehistoric-Planet documentary cinematography. 3 path-bespoke axes (biome / herd_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'herd_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_TERRITORY_CLASH: {
    description:
      'PATH-BESPOKE — DinoBot territory-clash path (2026-05-17 axis-system migration). TWO DINOSAURS in dominance confrontation — horn-locks, threat-displays, head-butts, frill-vs-frill push, jaw-clamping, ground-shaking charges. Raw primal power without gore. Reuses CLASH_SCENES (200 fat-seed clash scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for clash-specific small accents (broken-fern-debris / blood-trickle / panicked-bystander / dust-rising / etc.). BBC-Planet-Earth + Prehistoric-Planet documentary tension cinematography. 3 path-bespoke axes (biome / clash_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'clash_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_CINEMATIC_SILHOUETTE: {
    description:
      'PATH-BESPOKE — DinoBot cinematic-silhouette path (2026-05-17 axis-system migration). DINOSAURS as dramatic dark silhouettes against breathtaking prehistoric skies — sunrise / sunset / moonrise / lightning-storm / meteor-shower / aurora. The SHAPE of the animal is the subject. Iconic poster-worthy compositions. Reuses SILHOUETTE_SCENES (200 fat-seed silhouette scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for silhouette-specific small accents (pterosaur silhouette / sun-disk-positioning / moon-phase / etc.). Fine-art wildlife-photography cinematography. 3 path-bespoke axes (biome / silhouette_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'silhouette_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_COZY: {
    description:
      'PATH-BESPOKE — DinoBot dino-cozy path (2026-05-17 axis-system migration). TENDER DINOSAUR VIGNETTES — nesting / grooming / sleeping / nursing / playing / nuzzling-hatchlings / parent-and-juvenile-intimacy. The warm peaceful side of prehistoric life. Wildlife-documentary cozy-moment cinematography. Reuses DINO_SPECIES (200 dinosaur species) + COZY_DINO_ACTIONS (200 fat-seed cozy actions) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for cozy-specific small accents (hatchlings nearby / soft-light-detail / nest-debris / etc.). 4 path-bespoke axes (biome / species / cozy_action / surprise_element) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'cozy_action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_PACK: {
    description:
      'PATH-BESPOKE — DinoBot dino-pack path (2026-05-17 axis-system migration). MULTI-DINOSAUR group behaviors — pack-hunting / waterhole-gathering / river-crossing / nesting-colony / migration-cluster / defensive-formation. Same-species groups of dozens-to-hundreds. Wildlife-documentary group-life cinematography. Reuses DINO_SPECIES (200 dinosaur species) + PACK_DINO_ACTIONS (200 fat-seed group behaviors) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for pack-specific small accents (lookout-sentinel / scattered-prey-bones / pack-leader-pose / etc.). 4 path-bespoke axes (biome / species / pack_action / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'pack_action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_AERIAL_PERSPECTIVES: {
    description:
      'PATH-BESPOKE — DinoBot aerial-perspectives path (2026-05-17 axis-system migration). FLYING PTEROSAURS in their element OR sky-altitude aerial-camera views of ground dinosaurs. The frame is HIGH UP. Two modes: pterosaur-in-flight (70%) or bird-eye-view-of-ground-dinosaurs (30%). Wing-membrane anatomy fidelity per species. Reuses AERIAL_SUBJECTS (200 pterosaur subjects) + AERIAL_ACTIONS (200 flight behaviors) + AERIAL_SETTINGS (200 sky/aerial environments). Adds one new path-bespoke pool for aerial-specific small accents (companion-flock / sun-disk-positioning / cloud-bank / etc.). Paleo-cinematographer high-altitude framing. 4 path-bespoke axes (subject / action / setting / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'setting', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  TOYBOT_BARBIE_STORYTELLING: {
    description:
      'PATH-BESPOKE — ToyBot barbie-scene path (2026-05-19 axis-system rewrite). BARBIE-PLAYTIME MISCHIEF — every render is a single-frame kid-playroom story moment featuring Mattel-style 11.5-inch fashion-dolls (Barbie / Ken / sisters / Bratz-style) acting out absurd unexpected scenarios (black-market lip-gloss empire, Ken intervention, Barbie courtroom drama, sister-summit, campaign rally, cooking-show meltdown, etc.). NOT a Barbie movie poster. 4-6 dolls coexist in one densely populated playtime scene with multilayered real-prop set decoration. Six-slot seed DNA. Skips chaos / two-pass polish / sensory anchors. Uses path-bespoke wide narrative-action camera pool + playroom-diorama prompt prefix override.',
    slots: {
      universal: ['camera_angle'],
      bot: [],
      path: ['scene'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  TOYBOT_PLUSH_STORYTELLING: {
    description:
      'PATH-BESPOKE — ToyBot plush-world path (2026-05-19 axis-system rewrite). PLUSH-STORYBOOK MISCHIEF — every render is a single-frame storybook moment from an UNEXPECTED plush-stuffed-animal scenario (black-market honey trade, underground knit-off finals, plush comedy club, plush gondola taxi in the bath suds, plush acupuncture clinic, plush courtroom drama, fire-extinguisher emergency, etc.). Beatrix Potter meets Pooh meets Coraline-set-build meets cozy mischief. 4-6+ different plush archetypes coexist in one densely populated storybook scene with multilayered real-prop set decoration. Six-slot seed DNA: real surface + unexpected story setup; protagonist plush + specific action; 3-5 supporting cast across plush archetypes; multilayered real-prop set decoration; warm cozy storybook light; overhead/floating chaos element. Skips chaos / two-pass polish / sensory anchors. Uses path-bespoke wide narrative-action camera pool + storybook-diorama prompt prefix override.',
    slots: {
      universal: ['camera_angle'],
      bot: [],
      path: ['scene'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  TOYBOT_TOYBOX_STORYTELLING: {
    description:
      'PATH-BESPOKE — ToyBot toybox-chaos path (2026-05-19 axis-system rewrite). MIXED-MEDIUM STORYTELLING — every render is a single-frame comedy moment from a longer absurd toy-story (heist / wedding crash / talent show / mosh pit / rescue mission / tea party crashed / courtroom drama / magic show / construction disaster / etc.). 4-6+ different toy mediums coexist in one densely populated mischief scene on a real-world surface. Six-slot seed DNA: real surface + story setup; protagonist + dramatic absurd action; 3-5 supporting cast across brand families; absurd visual gag prop detail; warm play light; overhead/floating chaos element. Each seed bakes all 6 slots semicolon-separated. Skips chaos / two-pass polish / sensory anchors (seeds are pre-tuned 6-slot DNA — downstream layers strip slots or inject incompatible tokens).',
    slots: {
      universal: ['camera_angle'],
      bot: [],
      path: ['scene'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  TOYBOT_MODEL_TRAIN_WORLD: {
    description:
      'PATH-BESPOKE — ToyBot model-train-world path. THREE RENDER MODES branched at template level by sharedDNA.renderMode + a roll: (1) classic-diorama [renderMode!=world]: handcrafted HO-scale model-railroad terrain, uses scene + drama_moment + 35% unusual_cargo; (2) real-world [renderMode==world AND world-roll<0.65]: tiny train running through actual real environments (kitchen table, sleeping cat, forest moss, sandbox), scale-tension wow; (3) themed-cinematic [renderMode==world AND world-roll>=0.65]: train as hero in genre-coded immersive worlds (Western / fantasy / Mad Max / Polar Express / cyberpunk / Studio Ghibli / etc.). All four scene-source pools picked per render; template selects which to inject based on mode + roll.',
    slots: {
      universal: ['camera_angle', 'scenario', 'staging'],
      bot: [],
      path: [
        'scene',
        'train_consist',
        'train_weather',
        'drama_moment',
        'world_real_setting',
        'world_themed_setting',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'unusual_cargo', gate: 0.35 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_PORTRAIT: {
    description:
      'PATH-BESPOKE — DinoBot dino-portrait path (2026-05-17 axis-system migration). SINGLE DINOSAUR hero telephoto wildlife portrait — the camera catches one specific dinosaur in a candid moment. Museum-grade paleoart detail. Single subject fills 50-70% of frame. Reuses DINO_SPECIES (200 dinosaur species) + DINO_VISUAL_CUES (200 atmospheric cues) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for portrait-specific accents (breath-fog / feather-drift / dust-cloud / etc.). Paleo-art wildlife-photography telephoto cinematography. 4 path-bespoke axes (biome / species / visual_cue / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'visual_cue', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_ACTION: {
    description:
      'PATH-BESPOKE — DinoBot dino-action path (2026-05-17 axis-system migration). DYNAMIC PEAK-ACTION single dinosaur — frozen-frame predator hunts / charges / mid-strike / sudden-spring / fleeing-prey-mid-stride. BBC-cameraman-caught-the-moment energy. No gore. Reuses DINO_SPECIES (200) + DINO_ACTIONS (200 fat-seed peak-action verbs) + DINOBOT_PALEO_LANDSCAPE_BIOME (200). Adds new path-bespoke pool for action-specific small accents. 4 path-bespoke axes (biome / species / action / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  TOYBOT_TOY_LANDSCAPE: {
    description:
      'PATH-BESPOKE — ToyBot toy-landscape path (2026-05-17 R0 axis-system migration). Epic toy-medium landscape vista. NO CHARACTERS by design — the landscape IS the subject. Medium rotates: claymation OR vinyl per render via ToyBot mediumByPath. Universal axes (camera_angle / scenario / staging) resolve to bot.defaultPools. Single path-bespoke axis: landscape (200 entries).',
    slots: {
      universal: ['camera_angle', 'scenario', 'staging'],
      bot: [],
      path: ['landscape'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_EXTINCTION_EVENT: {
    description:
      'PATH-BESPOKE — DinoBot extinction-event path (2026-05-17 axis-system migration). K-Pg APOCALYPTIC scenes — asteroid streak across sky / impact-aftermath firestorms / impact-winter darkness / last-dinosaurs-in-dying-world. Epic tragedy + beautiful devastation. The end of the Mesozoic era. Reuses DINO_SPECIES (200) + EXTINCTION_SCENES (200 fat-seed) + DINOBOT_PALEO_LANDSCAPE_BIOME (200). Adds new path-bespoke pool for extinction-specific accents (ash-fall, ember-streams, distant-impact-glow, etc.). 4 path-bespoke axes (biome / species / extinction_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'extinction_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_CUTE_FOOD: {
    description:
      'PATH-BESPOKE — ChibiBot cute-food path (2026-05-17 bespoke-axis rebuild). Kawaii pop-mart-style food/drink scenes where the food ITSELF has a smiling face (bex.ai Instagram aesthetic). 4 path-bespoke axes (hero / scatter / background / lighting). Background pool hard-locks the dusty-muted-pastel palette in every entry, eliminating Flux-default vivid drift. Locked medium: chibibot_food (via ChibiBot mediumByPath).',
    slots: {
      universal: [],
      bot: [],
      path: ['hero', 'scatter', 'background', 'lighting'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_HEARTWARMING_SCENE: {
    description:
      'PATH-BESPOKE — ChibiBot heartwarming-scene path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). The "OMG IT\'S TOO CUTE. I CAN\'T." cuddle moment — adorable creature(s) doing something heart-melting in a deliberately-chosen storybook setting under a deliberately-chosen time-of-day with deliberate weather and an optional environmental phenomenon. 10 axes: 3 universal (lighting + atmosphere + weather, via bot.defaultPools) + 5 path-bespoke (setting + time_of_day + creature_1 + activity + surprise_element) + 1 conditional creature_2 70%-gated + 1 template-gated phenomenon 60%.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_1', 'activity', 'setting', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: {},
    conditionalLayer: { slot: 'creature_2', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_BATH_TIME: {
    description:
      'PATH-BESPOKE — ChibiBot bath-time path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). Adorable creature(s) in tiny cozy baths — bubbles, rubber ducks, foam on noses, towel turbans, steamy spa-day-for-tiny-creatures bliss. 11 axes: 3 universal (lighting + atmosphere + weather, via bot.defaultPools) + 6 path-bespoke (setting + activity + creature_1 + amenity pickN:2 + surprise_element + phenomenon) + 1 reused time_of_day (HEARTWARMING_TIME_OF_DAY) + 1 conditional creature_2 70%-gated + 1 template-gated phenomenon 60%. Amenity pickN:2 because bath cuteness amplifies with stacked props (rubber duck + candle, towel + soap, etc.).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_1', 'activity', 'setting', 'time_of_day', 'amenity', 'surprise_element', 'phenomenon'],
    },
    pickN: { amenity: 2 },
    conditionalLayer: { slot: 'creature_2', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_CUDDLY_AQUATIC: {
    description:
      'PATH-BESPOKE — ChibiBot cuddly-aquatic path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). Pair of adorable cuddly baby aquatic creatures in underwater / surface-water habitats — sea otter pups holding paws, axolotl tea-room scenes, baby seals on ice, jellyfish blanket octopuses. Pixar/Sanrio/Ghibli/Finding-Nemo cuteness. UNLIKE other ChibiBot paths, creature_2 is ALWAYS-ON (no 70% gate) — this path\'s identity IS the cuddling pair. 10 axes: 3 universal (lighting + atmosphere + weather, via bot.defaultPools) + 6 path-bespoke (creature_1 + creature_2 + interaction + setting + time_of_day + surprise_element + phenomenon) + 1 template-gated phenomenon 60%.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_1', 'creature_2', 'interaction', 'setting', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_NIGHT_MEADOW: {
    description:
      'PATH-BESPOKE — ChibiBot night-meadow path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). Pair of impossibly cute critters at twilight/night in a meadow/glade/forest-clearing under the stars. Stargazing fox kits, fireflies in mason jars, glow-worm tea parties, comet-watching bunnies, moonlit picnics. Pixar/Sanrio/Ghibli/Beatrix-Potter-twilight aesthetic. creature_2 is ALWAYS-ON — pair-bond identity. 11 axes: 3 universal (lighting + atmosphere + weather) + 8 path-bespoke (creature_1 + creature_2 + interaction + setting + time_of_night + prop pickN:2 + surprise_element + phenomenon) + 1 template-gated phenomenon 60%.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_1', 'creature_2', 'interaction', 'setting', 'time_of_night', 'prop', 'surprise_element', 'phenomenon'],
    },
    pickN: { prop: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },



  CHIBIBOT_COZY_LANDSCAPE: {
    description:
      'PATH-BESPOKE — ChibiBot cozy-landscape path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). SETTING-AS-HERO path: a magical miniature cozy world (mushroom village / acorn cottage / wildflower meadow / beach cove / market square / treehouse) is the hero; a SOLO tiny resident creature adds story without stealing focus. Pixar/Studio Ghibli/Beatrix Potter/tilt-shift cozy aesthetic. UNLIKE pair-bond paths, NO creature_2 — the resident is one creature, small in the frame. 11 axes: 3 universal (lighting + atmosphere + weather) + 7 path-bespoke (creature + resident_activity + world + world_detail pickN:3 + time_of_day + surprise_element + phenomenon). Template-gated phenomenon 60%. world_detail pickN:3 forces stacked architectural/nature details that make the cozy world feel lived-in.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'world', 'world_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { world_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },



  CHIBIBOT_RAINY_INTERIOR: {
    description:
      'PATH-BESPOKE — ChibiBot rainy-interior path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). OUTDOOR RAINY-DAY path: creatures playing OUT IN the rain — splashing puddles, holding polka-dot umbrellas, mud-stomping in boots, racing paper boats, catching raindrops in cupped paws, picking wet flowers, sharing umbrellas under trees. Cottagecore wet-fun joy. Pixar storybook painterly register. UNLIKE pair-bond paths, NO creature_2. 10 axes: 3 universal (lighting + atmosphere + weather) + 7 path-bespoke (creature + resident_activity + setting + setting_detail pickN:3 + time_of_day + surprise_element + phenomenon). Template-gated phenomenon 60%. Pixar-medium locked. Two-pass-polish skipped.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_group', 'group_activity', 'setting', 'setting_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { setting_detail: 3, creature_group: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_RAINY_DAY_COZY: {
    description:
      'PATH-BESPOKE — ChibiBot rainy-day-cozy path (2026-05-19 full-bespoke migration). GROUP-OF-FRIENDS SHELTERED-FROM-RAIN cozy moments: 2-4 chibi friends huddled together in cozy outdoor shelters (mushroom caps / porches / under umbrellas / hollow logs / stone arches) during rain. Sister path to rainy-interior (which is friends OUT IN the rain playing actively); this one is friends SHELTERED warmly with rain visibly falling around the shelter. Warm-cozy shelter glow vs cool-blue-grey rainy world. Pixar-medium-locked. 10 axes: 3 universal + 7 path-bespoke (creature_group pickN:3 + huddle_activity + shelter + detail pickN:3 + time_of_day + surprise_element + phenomenon).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_group', 'huddle_activity', 'shelter', 'detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { detail: 3, creature_group: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_SLEEPY_NAPTIME: {
    description:
      'PATH-BESPOKE — ChibiBot sleepy-naptime path (2026-05-19 full-bespoke migration). SOLO creature dozing in an impossibly cozy nap-spot. Peak-cute sleeping moment. Mid-close framing with the creature as the focal hero. NOT a group path. The viewer melts and whispers "shhh don\'t wake it". 10 axes: 3 universal + 7 path-bespoke (creature + sleep_pose + nap_spot + detail pickN:3 + time_of_day + surprise_element + phenomenon).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'sleep_pose', 'nap_spot', 'detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_COZY_INTERIOR: {
    description:
      'PATH-BESPOKE — ChibiBot cozy-interior path (2026-05-19 full-bespoke). SETTING-AS-HERO INDOOR cozy space, often a REAL-OBJECT-AS-HOME (chibi has moved into a teacup / music-box / matchbox / piano / kettle / pumpkin / etc.) — 60%, OR a purpose-built chibi-scale dwelling (mushroom-house / treehouse / hobbit-hole / chibi-cottage) — 40%. SOLO peripheral creature does a cozy-snuggle activity. Wide-shot interior establishing — room fills 75-85% of frame, creature 10-20% as a tiny visible anchor. Pixar painterly storybook register via chibibot_pixar medium lock. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'room', 'room_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { room_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_MINIATURE_FEAST: {
    description:
      'PATH-BESPOKE — ChibiBot miniature-feast path (2026-05-19 full-bespoke). KAWAII POP-MART CUTE-MAXX FEAST with TONS of chibis (3-4 in group mode) + TONS of smiling-face kawaii food in OUTDOOR-VARIETY settings (picnic / beach / camping / treehouse / garden / boat / hot-air-balloon / mountain / snow / fairytale-forest — ~90% outdoor). Sister to cute-food (which is food-only) — this is CHIBIS + FOOD + SETTING all packed together. chibibot_render Pop-Mart glossy lock. 11 axes: 3 universal + 8 path-bespoke (food_hero + scene_setting + creature_group pickN:4 + chibi_food_activity + food_decoration pickN:3 + kawaii_atmosphere + time_of_day + camera_angle).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['food_hero', 'scene_setting', 'creature_group', 'chibi_food_activity', 'food_decoration', 'kawaii_atmosphere', 'time_of_day', 'camera_angle'],
    },
    pickN: { creature_group: 4, food_decoration: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_AQUATIC_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot aquatic-village path (2026-05-19 full-bespoke). SETTING-AS-HERO underwater/coastal village. Coral-tower villages, kelp-forest cottages, pearl-shell hamlets, submarine-ports, tidepool villages, sea-cave dwellings, floating lily-pad clusters, kraken-shell cottages, bioluminescent grottos, starfish-bridge towns, shipwreck-coral hamlets. Architecture + ocean atmosphere are hero; MARINE-tagged peripheral resident creature (+ ANY wildcard). Studio Ghibli / Ponyo / Atlantis / Finding-Nemo painterly storybook. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_COTTAGECORE_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot cottagecore-village path (2026-05-19 full-bespoke). SETTING-AS-HERO English-countryside / cottagecore village. Thatched-roof clusters, windmill villages, lavender-field cottages, apple-orchard hamlets, wisteria-tunnel villages, cobblestone lanes, canal-side cottages, bee-skep villages, mushroom-cottage clusters (Smurfs-style), fairy-glade hamlets, stone-bridge cottages. Architecture + cottagecore atmosphere are hero; LAND/FANTASY peripheral resident (+ ANY wildcard). Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_SUNNY_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot sunny-village path (2026-05-19 full-bespoke). SETTING-AS-HERO Mediterranean / sun-drenched village. Bougainvillea-clad cottages, Mediterranean white-cottages on cliffs, terracotta-roof clusters, cliff-side villages (Santorini), desert-oasis hamlets, sun-bleached pueblos, fishing-port cottages, orchard-grove villages, mosaic-tile villages, palm-fringed hamlets, Tuscan olive-grove villages. Architecture + golden-hour atmosphere are hero; LAND/BIRD peripheral resident (+ ANY wildcard). Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca / Spirited-Away. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_TWILIGHT_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot twilight-village path (2026-05-19 full-bespoke). SETTING-AS-HERO dusk/lantern/firefly-time village. Lantern-lane villages, firefly-meadow cottages, moonlit-bridge towns, dusk-window-glow clusters, paper-lantern-festival villages, Japanese-paper-lantern towns (Spirited-Away), nightingale-grove cottages, star-lit-spire villages, bioluminescent-garden clusters, glowworm-cave hamlets, moonflower-meadow villages. Architecture + twilight-magic atmosphere are hero; LAND/FANTASY peripheral resident (+ ANY wildcard). Studio Ghibli / Spirited-Away / Whisper-of-the-Heart / Howl-Moving-Castle / Tangled-lanterns. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_ARCTIC_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot arctic-village path (2026-05-19 full-bespoke). SETTING-AS-HERO village in a snow/ice/arctic biome. Snow-cottage rows, igloo clusters, log-cabin villages under aurora, gingerbread-snow-fortresses, polar-station hamlets, mountain-chalet clusters, hot-spring villages, fishing-villages on frozen lakes. Architecture + arctic atmosphere are the hero; ARCTIC-tagged peripheral resident creature (from unified pool + ANY wildcard) adds story. Studio Ghibli / Frozen / Arrietty-Borrowers / Polar-Express painterly storybook aesthetic. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },


  CHIBIBOT_JUNGLE_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot jungle-village path (2026-05-19 full-bespoke). SETTING-AS-HERO village in a jungle/rainforest. Treehouse villages, mushroom-house clearings, leaf-roof huts, vine-bridge connectors. Architecture + jungle atmosphere are the hero; SOLO peripheral resident creature (JUNGLE-tagged from unified pool) adds story. Studio Ghibli / Encanto / Princess-Mononoke / Avatar-Pandora-village aesthetic. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature', 'resident_activity', 'village', 'village_detail', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

};

module.exports = { ARCHETYPES };
