/**
 * gothbot archetypes — path-bespoke archetype definitions.
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
  GOTHBOT_GOTH_MALE_CLOSEUP: {
  description: 'PATH-BESPOKE — GothBot goth-male-closeup path (2026-05-15 migration). MYSTERIOUS, OMINOUS, DEADLY dark-aristocrat closeups — male-locked. Vampire-lord / dark-prince / shadow-assassin / dark-warlock / death-god / dark-hunter closeups in tight frame (face + throat + one shoulder). Castlevania / Bloodborne / Crimson-Peak / Witcher dark-male-aristocrat lineage. Gender-locked MALE (he/his/man). Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean. 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / face_detail / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'face_detail', 'wardrobe', 'accessory' ],
    path: [ 'candid_moment', 'camera_perspective' ]
  },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: [ 'LARGE' ]
},

  GOTHBOT_VAMPIRE_GIRLS_2: {
  description: 'PATH-BESPOKE — GothBot vampire-girls-2 path (2026-05-15 migration). STRICT VAMPIRE bust portraits — DEAD-PALE corpse-skin, HEAVY DARK GOTH MAKEUP, GLOWING eyes radiating inhuman light, DEMONIC tell (fang / clawed fingertip / slit pupil). Stylized dark-fantasy splash painting / gothic horror character art aesthetic. NOT old-master oil, NOT museum patina, NOT smooth-digital, NOT pretty-girl-in-dress. Gender-locked FEMALE. Solo only. Character at LARGE anchor (bust 40-50% of frame). Reuses 9 existing production-scale vampire pools (compositions / menace_features / settings / killer_details / hair / wardrobe / archetypes / ethnicities / lighting — already at 100 entries each). Unique TEMPLATE: weaves ethnicity + makeup + glow + hair + wardrobe + posture into ONE UNIFIED vampire description (no separate fields for Sonnet to summarize away).',
  slots: {
    universal: [ 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'archetype', 'ethnicity', 'hair', 'wardrobe', 'menace_feature' ],
    path: [ 'composition', 'scene', 'hero_element', 'lighting' ]
  },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: [ 'LARGE' ]
},

  GOTHBOT_GOTH_CLOSEUP: {
  description: 'PATH-BESPOKE — GothBot goth-closeup path (2026-05-15 migration). HAUNTINGLY BEAUTIFUL dark-seductress closeups — SEXY + SULTRY + EVIL + FEISTY gothic women in tight frame (face + throat + one shoulder). Castlevania / Crimson Peak / Bloodborne / Devil-May-Cry dark-beauty lineage. Gender-locked FEMALE. Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean (no nipple/cleavage emphasis). 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / makeup / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'makeup', 'wardrobe', 'accessory' ],
    path: [ 'candid_moment', 'camera_perspective' ]
  },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: [ 'LARGE' ]
},

  GOTHBOT_COZY_GOTH: {
  description: "PATH-BESPOKE — GothBot cozy-goth path (2026-05-15 migration, R3 figure-accent added). LAYERED WITCH'S-LAIR / WIZARD'S-WORKROOM / OCCULT-APOTHECARY interiors — warm-dark gothic spaces with a TWIST OF MAGIC, ALWAYS inhabited by a small mysterious-feminine figure (gypsy fortune-teller / vampire-noblewoman / mysterious-witch / cloaked-mystic / dark-baroness) at deep midground 8-15% of frame as SCALE-PROVER ONLY. Interior stays the hero at 80%+ visual weight. GOTH + TWIST OF MAGIC + small mysterious witness. 5 path-bespoke axes (interior_space / magical_glow_item pickN:3 / occult_artifact pickN:3 / figure_accent / ambient_atmosphere) + universal lighting + atmosphere.",
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'interior_space', 'magical_glow_item', 'occult_artifact', 'figure_accent', 'ambient_atmosphere' ]
  },
  pickN: { magical_glow_item: 3, occult_artifact: 3 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_CASTLEVANIA_SCENE: {
  description: "PATH-BESPOKE — GothBot castlevania-scene path (2026-05-15 migration). STRICT KONAMI CASTLEVANIA aesthetic — Dracula's-castle / Symphony-of-the-Night / Bloodlines / Lords-of-Shadow / Order-of-Ecclesia visual canon. Ayami-Kojima painted concept-art lineage. STRUCTURE IS THE HERO — the Castlevania building dominates the frame with art-nouveau ornate gothic detail. BOLD + LUSH + FULL-COLOR-SATURATED palette (royal violet / deep crimson / sapphire / gold-leaf / emerald / amber). 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere. Differentiator vs gothic-architecture: STRICTLY Castlevania-game-coded — Wallachian / Vlad-Tepes-coded / Bram-Stoker-Dracula-coded — NOT Bloodborne, NOT generic-gothic, NOT Hammer-horror.",
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer' ]
  },
  pickN: { architectural_detail: 3 },
  conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_GOTHIC_ARCHITECTURE: {
  description: 'PATH-BESPOKE — GothBot gothic-architecture path (2026-05-15 bespoke migration). STRUCTURE IS THE HERO with MASSIVE VERTICAL EPIC SCALE — towering, clawing upward, dwarfing everything. Inner dark-magic light glows from within. Ornate architectural detail porn. Two accent layers: accent_creature (80%-gated dark-wildlife) + spice_decoration (100% small atmospheric flourish — vivid moons, lanterns, wisps, sigils). Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls lineage. Exterior-only. 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer' ]
  },
  pickN: { architectural_detail: 3 },
  conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_GOTHIC_VISTA: {
  description: 'PATH-BESPOKE — GothBot gothic-vista path (2026-05-15 migration). Sister to dark-landscape but with "LAND IS ALIVE" mandate: every render saturated with dark-wildlife (crows / bats / wolves / fireflies), bioluminescent dark-flora (nightshade / moonflowers / glowing-fungi), structures glowing-from-within (witch-fire windows / candle-towers), and SUPERNATURAL-PRESENCE (fog-moving-wrong / shadow-pools / will-o-wisps). Haunted gorgeous awe-and-dread. NO CHARACTERS. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
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

  GOTHBOT_MONSTER_PROWL: {
  description: 'PATH-BESPOKE — GothBot monster-prowl path (2026-05-16 bespoke migration from legacy function-form). SOLO GOTHIC CREATURE OUT IN THE WILD doing creature-business — vampire / werewolf / gargoyle / succubus / demon / banshee / lich / harpy / wraith / etc. Wide cinematic full-body composition: creature 25-40% of frame, gothic stage + epic backdrop 60-75% (scenery and creature share costar spotlight). Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster lineage. Solo only — NO hunter (assassin paths), NO combat (combat path), NO second figure. NO gore, NO mid-bite-on-victim. Reuses existing 200-entry pools: CREATURE_ARCHETYPE + CREATURE_WILD_ACTION + ASSASSIN_STAGE + ASSASSIN_EPIC_BACKDROP. 4 path-bespoke axes + universal lighting + atmosphere.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'creature', 'action', 'stage', 'backdrop' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_GOTH_MALE_FULL_BODY_AXIS: {
  description: 'PATH-BESPOKE — GothBot goth-male-full-body-axis (2026-05-22 R2 RESET — uprooted emo-vampire-aristocrat aesthetic). Elite VAMPIRE HUNTER full-body cinematic poster moment — John Wick of vampire hunters. Classic-lore hunters only (Belmont / Witcher of the School of Wolf / Van Helsing / Blade / Hellsing / Underworld Death-Dealer / Castlevania Trevor / Constantine / Tridentine inquisitor-hunter / Wallachian boyar turned vampire-killer / etc.) — NEVER vampires/warlocks/mages/liches/demonologists. STRAPPED with multiple visible weapons (crossbow + pistols + sword + dagger + stakes). Cool, mysterious, forboding, badass. Differentiator from vampire-hunter-in-action: this is POSTER MOMENT (standing/leaning/mid-load/loaded readiness) vs vhia\'s ACTION MID-MOTION mid-stalk.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'character_archetype',
      'body_pose',
      'scene_context',
      'skin',
      'eyes',
      'hair_color',
      'hairstyle',
      'face_detail',
      'outfit_silhouette',
      'weapon_or_signature_object',
      'atmospheric_backdrop',
      'composition_framing'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'foreground_anchor', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_VAMPIRE_HUNTER_IN_ACTION: {
  description: 'PATH-BESPOKE — GothBot vampire-hunter-in-action (2026-05-22 R4 RESTART — solo on-the-prowl pre-encounter). SOLO hunter mid-stalk through specific gothic scene (city street / cathedral / courtyard / crypt-yard / rooftop). Quarry is IMPLIED OFF-CAMERA — never visible in frame. Hunter is in active motion (aiming crossbow forward / drawing pistols mid-stride / sword drawn approaching off-frame target / sneaking through alley / leaning around corner). Like a stealth-game screenshot / film-still mid-hunt. Medium-close composition (hunter 50-65% of vertical frame). 11 axes (10 always-on + 1 gated spoor): prowl_action / setting_location / hunter_archetype / weapon_signature / outfit_silhouette / environmental_detail / lighting / atmospheric_depth / composition_framing / foreground_anchor + spoor (40%-gated, subtle hint of past quarry presence).',
  slots: {
    universal: [],
    bot: [],
    path: [
      'prowl_action',
      'setting_location',
      'hunter_archetype',
      'weapon_signature',
      'outfit_silhouette',
      'environmental_detail',
      'lighting',
      'atmospheric_depth',
      'composition_framing',
      'foreground_anchor'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'spoor', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  GOTHBOT_DARK_LANDSCAPE: {
  description: 'PATH-BESPOKE — GothBot dark-landscape path (2026-05-15 migration from legacy function-based form). Pure gothic landscape — NO CHARACTERS. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton visual lineage (NEVER LOTR / Skyrim / Witcher). Movie-poster wide-vista compositions: vampire castles / cemeteries / abbey ruins / coastal cliffs / haunted forests / cursed villages. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
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
};
