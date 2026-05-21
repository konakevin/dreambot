/**
 * dragonbot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  FEMALE_ADVENTURER: {
  description: 'PATH-BESPOKE — DragonBot female-adventurer path (2026-05-14 rebuild from female-warrior). Gender-locked WOMAN of any D&D × LOTR fantasy race, any class (rogue / ranger / sorceress / warlock / mage / paladin / warrior / monk / druid / bard / cleric / barbarian / artificer / etc.), in the wild doing her adventurer thing. SLEEK adventuring gear — no bulky/massive armor, no cheesecake, no artist-name lineage callouts. NSFW-clean rebuild. Character at 25-40% frame in a candid mid-action moment. Painterly fantasy concept art aesthetic. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'race', 'class', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'landscape', 'action', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  FEMALE_ACTION_SCENES: {
  description: 'PATH-BESPOKE — DragonBot female-action-scenes path (2026-05-14 clone of FEMALE_ADVENTURER, massaged for pure action energy). Same gender-locked, NSFW-clean, sleek-gear, strict-high-fantasy WOMAN. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats — mages mid-spell with explosions, ranger mid-loose with arrow streaking, rogue sneaking through busy night market, paladin mid-strike with divine light, sorceress at summon apex, druid mid-shape-shift, warlock eldritch blast. Alive, motion-blurred, effect-rich. Character at 25-40% frame.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'race', 'class', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'landscape', 'action', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  MALE_ADVENTURER: {
  description: 'PATH-BESPOKE — DragonBot male-adventurer path (2026-05-14 mirror of FEMALE_ADVENTURER, completely bespoke male pools). Gender-locked MAN of any D&D × LOTR fantasy race, any class. SLEEK adventuring gear — no bulky/massive armor, no shirtless/cheesecake, no artist-name lineage callouts. NSFW-clean. Strict Western high fantasy. Beards allowed for races where canon-appropriate (dwarves / humans / half-orcs / etc.). Character at 25-40% frame in candid mid-action moment. Painterly fantasy concept art. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'race', 'class', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'landscape', 'action', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  MALE_ACTION_SCENES: {
  description: 'PATH-BESPOKE — DragonBot male-action-scenes path (2026-05-14 clone of MALE_ADVENTURER, massaged for pure action energy). Same gender-locked MAN, NSFW-clean, sleek-gear, strict-high-fantasy. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats with multi-effect stacking. Mirror of FEMALE_ACTION_SCENES for male protagonists. Character at 25-40% frame.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'race', 'class', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'landscape', 'action', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  DRAGONBOT_DARK_REALM: {
  description: 'PATH-BESPOKE — DragonBot dark-realm path (2026-05-14 migration). Corrupted wastelands / necromancer kingdoms / fallen empires / cursed lands. Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo energy. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted. Optional tiny figures (hooded wanderers / cursed knights / pilgrims) permitted as scale-provers. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'scene', 'architecture', 'surprise_element', 'sky_layer' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  DRAGONBOT_DRAGON_LORE: {
  description: 'PATH-BESPOKE — DragonBot dragon-lore path (2026-05-14 migration from legacy function-based form). Ancient archaeological-fantasy evidence of dragons — massive skeletal remains, weathered murals depicting dragon wars, abandoned lairs with scattered hoards, fossilized eggs, ruined dragon-temples, crumbling dragon-rider outposts. The dragons are GONE but their presence echoes everywhere. Mood: WONDER + MELANCHOLY + REVERENCE + LOST GRANDEUR. Optional tiny figures (scholars / explorers / archaeologists) as scale-provers and mood-setters. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'scene', 'architecture', 'surprise_element', 'sky_layer' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  ARCANE_SPACES: {
  description: 'PATH-BESPOKE — DragonBot arcane-spaces path (2026-05-15). Sister path to arcane-halls. Grand magical INTERIOR SPACES — vast architectural marvels with obsessive magic-density saturating the room. NO CHARACTERS — pure environment. Cathedral halls / throne rooms / floating-platform libraries / gateway arch chambers / ritual conclaves / observatories / vault corridors / etc. Architecture is the subject; magic phenomena fill every quadrant. Reuses ARCANE_HALL (200) + ARCANE_HALL_PHENOMENA (100, pickN:3) pools.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'hall', 'magic_phenomena' ] },
  pickN: { magic_phenomena: 3 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  ARCANE_HALLS: {
  description: 'PATH-BESPOKE — DragonBot arcane-halls path (2026-05-15 pivot — was no-character magic-overload, NOW character-mid-magic-moment). A single spellcaster (mage / cleric / sorceress / druid / warlock / archmage / etc.) caught at the apex of their magical moment INSIDE a grand magical interior (cathedral hall / throne room / courtyard / stairwell / vault / banquet hall / observatory / etc.). The character is the focal point — MAGIC IS PARAMOUNT, visibly pouring from them and saturating the space. Path-bespoke axes (hall / caster / spell_moment / magic_phenomena pickN:2) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'hall', 'caster', 'spell_moment', 'magic_phenomena' ]
  },
  pickN: { magic_phenomena: 2 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  ICONIC_LANDSCAPE: {
  description: 'PATH-BESPOKE — DragonBot iconic-landscape path (2026-05-14 merger of wow-landscape + lotr-landscape into a single stylized-fantasy-biome path). Stylized/saturated/iconic fantasy biomes drawing from BOTH the Tolkien-mythic-grandeur tradition AND the Blizzard-hand-painted-stylized tradition. Iconic archetypal biomes: Shire-pastoral / Mordor-volcanic / Rivendell-valley / Moonglade-elven / fel-corrupted-alien / Misty-Mountains-cold / Lothlorien-golden-wood / Northrend-tundra / Pandaria-bamboo / etc. NO CHARACTERS — pure landscape. Saturated stylized aesthetic distinct from the realistic-coded main `landscape` path. 3 path-bespoke axes (biome / sky_layer / phenomenon 60%-gated) + universal lighting + atmosphere.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'biome', 'sky_layer' ] },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.6 },
  framingModes: null,
  anchorScaleRange: null
},

  EPIC_MOMENT: {
  description: 'PATH-BESPOKE — DragonBot epic-moment path = EPIC CASTLE SCENES (2026-05-14 migration + reframing). The CASTLE is the hero — massive, sweeping, awe-inducing fantasy castle filling the frame. A huge cinematic event is happening at/in/around it: dragons attacking / massive siege underway / magic portal opening above the courtyard / royal coronation procession / cavalry charge through the gates / summoning ritual on the battlements / fleet of war-galleys approaching the harbor / leyline-storm breaking over the spires. Wide cinematic establishing shots. People/armies/crowds at scale-prover size, dwarfed by both castle and event. 2 path-bespoke axes (castle / event) + universal lighting + atmosphere.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'castle', 'event' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  FANTASY_SCENE: {
  description: 'PATH-BESPOKE — DragonBot fantasy-scene path (2026-05-14 migration from legacy + cranked to movie-poster intensity). A single fantasy character integrated into an epic magical landscape, engaged with the magic / setting. Movie-poster mandate: every render stacks 3+ visually-striking elements (character + epic landscape + atmospheric phenomenon + scale-prover or magic-effect). Reuses 200-entry FANTASY_CHARACTERS + 280-entry FANTASY_LANDSCAPES + bespoke 50-entry action + 30-entry drama (80%-gated almost-always-fires).',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'character', 'landscape', 'action' ] },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  DRAGONBOT_LANDSCAPE: {
  description: 'PATH-BESPOKE — DragonBot landscape path (2026-05-14 migration from legacy function-based form, cranked to movie-poster intensity 2026-05-14). Pure scenery — NO CHARACTERS, NO FIGURES. The landscape is the hero. "Land is alive" + "MOVIE POSTER" mandate: every render stacks 3+ visually striking elements (biome + architecture + dramatic phenomenon + scale-prover) for maximum awe. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere. Flagship weight-5 path.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'biome', 'architecture', 'surprise_element', 'sky_layer' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  ARTSY_GIRL: {
  description: 'PATH-BESPOKE — DragonBot artsy-girl path. Frozen 2026-05-13 clone of FEMALE_WARRIOR producing Frazetta / Brom / Vallejo painted-fantasy-novel-cover heroines in cinematic peaceful adventuring moments. Cheesecake-friendly painterly aesthetic. Locked separately from female-warrior so race-lock / armor-coverage tuning on female-warrior never touches this path.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'landscape', 'action', 'warrior_archetype', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  DRAGONBOT_CASTLE: {
  description: 'PATH-BESPOKE — DragonBot castle path (2026-05-17 NEW). Majestic epic beautiful castle views — castles are 100% the focal subject, set amongst gorgeous fantasy backdrops with massive sense of scale. Distinct from epic-moment (50/50 castle + event) — this is pure castle-as-hero, movie-poster establishing shot energy. 5 path-bespoke pools: castle (architectural subject) + biome (gorgeous fantasy backdrop) + sky_layer (dramatic sky) + scale_prover (tiny element proving scale) + phenomenon (40%-gated atmospheric flourish). Lineage: Helms-Deep / Minas-Tirith / Edoras / Erebor / Anor-Londo establishing-shot.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'castle', 'biome', 'sky_layer', 'scale_prover' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  DRAGON_SCENE: {
  description: 'PATH-BESPOKE — DragonBot dragon-scene path. Traditional Western dragon (4 legs + 2 wings + horned reptilian skull) is the SUBJECT in a jaw-dropping fantasy landscape. NO characters/riders/humans. Path-bespoke pools for dragon (anatomy) + action (mid-action moment) + landscape (epic biome) + drama (40% gated environmental event) + surprise_element (tiny secondary subject). Canonical-LITE — DragonBot uses minimal wrapper layer so Sonnet body leads.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'dragon', 'action', 'landscape', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'drama', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},
};
