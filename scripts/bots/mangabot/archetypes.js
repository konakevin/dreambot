/**
 * mangabot archetypes — path-bespoke archetype definitions.
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
  MANGABOT_ISEKAI_FANTASY: {
    description:
      'PATH-BESPOKE — MangaBot isekai-fantasy (2026-05-22 axis-system migration). Anime isekai canon — Sword Art Online / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei / Slime / Restaurant of Another World / Log Horizon / Tate no Yuusha. Painterly anime cel-shaded register with anime-isekai-coded settings, characters, magic, creatures. NOT Western Witcher / Skyrim / D&D. 14 path-bespoke axes designed around anime-isekai-specific content.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'fantasy_world_setting',
        'architectural_anchor',
        'character_role',
        'action_moment',
        'magic_effect',
        'fantasy_creature',
        'atmospheric_air',
        'light_quality',
        'time_of_day',
        'emotional_dna',
        'camera_framing',
        'story_prop',
        'background_detail',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  MANGABOT_GHIBLI_COUNTRYSIDE: {
    description:
      'PATH-BESPOKE — MangaBot ghibli-countryside (2026-05-22 axis-system migration). Studio Ghibli pastoral wonder — Totoro / Kiki / Mononoke / Spirited-Away / Whisper of the Heart aesthetic. Soft warm pastel palette (sage/butter/sky-blue/cream/wildflower-pink) and HAND-PAINTED oil-watercolor brush texture. Rural Japan only — no cities, no neon, no armor. 14 path-bespoke axes (13 always-on + spirit_element conditionally gated at 40%) — Ghibli sometimes has magic visible, sometimes pure pastoral.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'landscape_setting',
        'architectural_anchor',
        'character_role',
        'action_moment',
        'wildflower_garden',
        'weather_air',
        'light_quality',
        'time_of_day',
        'emotional_dna',
        'camera_framing',
        'story_prop',
        'background_detail',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'spirit_element', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MANGABOT_NEO_TOKYO: {
    description:
      'PATH-BESPOKE — MangaBot neo-tokyo (2026-05-22 axis-system migration). Cyberpunk Japan future — Akira / Ghost-in-the-Shell / Blade-Runner-Tokyo / Edgerunners / Bubblegum Crisis. Vertical density, wet-street neon, kanji-signage saturation, tech-artifact clutter. Each render is a frame from a cyberpunk anime keyframe with NEON palette (pink/cyan/magenta) NOT pastels. 15 path-bespoke axes — denser than samurai-era because the aesthetic demands more layered content.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'district',
        'landmark_anchor',
        'signage_density',
        'tech_artifacts',
        'vertical_density',
        'character_role',
        'action_moment',
        'weather_air',
        'light_signature',
        'time_of_day',
        'emotional_dna',
        'camera_framing',
        'story_prop',
        'background_detail',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  MANGABOT_SAMURAI_ERA: {
    description:
      'PATH-BESPOKE — MangaBot samurai-era (2026-05-22 axis-system migration). Historical Japan / jidaigeki — Mononoke / Demon-Slayer / Rurouni-Kenshin / Vagabond aesthetic. Decouples the legacy SAMURAI_SCENES baked-scene pool into 10 composable axes so renders get true multi-tier depth + monumental anchors + scale provers + variety. Every render is a keyframe still: composition lead + monumental architectural anchor + figure mid-action + atmospheric motion + cinematic light.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'landscape_setting',
        'architectural_anchor',
        'character_role',
        'action_moment',
        'atmospheric_element',
        'light_drama',
        'time_of_day',
        'emotional_dna',
        'camera_framing',
        'story_prop',
        'background_detail',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot anime-character-female (2026-05-29 Phase 2.1
  // axis-system migration; legacy inline form preserved at
  // paths/legacy/anime-character-female.js).
  //
  // Anime girl as the HERO of the frame in a richly-rendered anime setting.
  // Mirror of DragonBot's FEMALE_ADVENTURER 12-axis split (the canonical
  // character-path recipe) but anime-canon-coded throughout. Designed
  // anti-back-to-camera from gen-1 per the Phase 2.0 validation lesson:
  //   • camera_framing wired as MANDATORY DRIVING AXIS via
  //     shared-blocks.CAMERA_FRAMING_MANDATORY_BLOCK
  //   • action pool seeded FORWARD-FACING ONLY (mid-strike toward viewer /
  //     mid-cast / forward 3/4 stance / profile dynamic action — never
  //     "walking toward gate" / "approaching the temple" / "looking out")
  //   • setting pool designed for character-led compositions where the
  //     character is naturally engaged with something IN-FRAME, not
  //     "X looking out over Y"
  //   • twoPassPolish skipped (Phase 2.0c lesson — Haiku strips axis text)
  //
  // 12-axis split (8 character DNA + 3 path + 1 conditional drama):
  //   • characterDnaAxes: ethnicity + archetype + skin + eyes + hair_color
  //     + hairstyle + outfit + accessory
  //   • path: setting + action + camera_framing + surprise_element
  //   • conditionalLayer: drama (40% gate)
  //
  // Reuses existing 200-entry character-DNA pools (ANIME_ARCHETYPE_FEMALE /
  // ANIME_OUTFITS_FEMALE / ANIME_HAIRSTYLES_FEMALE / ANIME_ACCESSORIES_FEMALE
  // / ANIME_SKIN / ANIME_EYES / ANIME_HAIR_COLOR) — those describe
  // appearance only, no composition bias. The 5 new bespoke pools below
  // (ethnicity / setting / action / camera_framing / surprise_element /
  // drama) carry the anime-canon flavor + the forward-facing mandate.
  MANGABOT_ANIME_CHARACTER_FEMALE: {
    description:
      'PATH-BESPOKE — MangaBot anime-character-female (2026-05-29 Phase 2.1). Anime woman as the HERO of the frame in a rich anime setting. 12-axis split mirroring DragonBot FEMALE_ADVENTURER, anime-canon-coded throughout. ANTI-BACK-TO-CAMERA architecture: action pool seeded forward-facing only; camera_framing wired as MANDATORY DRIVING AXIS via shared block; skipPaths twoPassPolish so axis text reaches Flux.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot cherry-blossom-romance (2026-05-29 Phase 2.7).
  MANGABOT_CHERRY_BLOSSOM_ROMANCE: {
    description: 'PATH-BESPOKE — solo tender romantic-moment under sakura. Pink palette + petal-cascade mandate. Forward-facing tender pose.',
    slots: { universal: ['lighting', 'atmosphere'], bot: [], characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'], path: ['setting', 'action', 'camera_framing', 'surprise_element'] },
    pickN: {}, conditionalLayer: { slot: 'drama', gate: 0.4 }, framingModes: null, anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot rooftop-sunsets (2026-05-29 Phase 2.8).
  // The audit-failure path. Character ENGAGED on rooftop, not gazing out.
  MANGABOT_ROOFTOP_SUNSETS: {
    description: 'PATH-BESPOKE — rooftop-sunsets. Audit-failure path reconfigured: character ENGAGED with foreground/midground on rooftop, not back-of-character looking out. Sunset palette.',
    slots: { universal: ['lighting', 'atmosphere'], bot: [], characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'], path: ['setting', 'action', 'camera_framing', 'surprise_element'] },
    pickN: {}, conditionalLayer: { slot: 'drama', gate: 0.4 }, framingModes: null, anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot slice-of-life (2026-05-29 Phase 2.6).
  // Everyday mundane-cozy moments. K-On / Tamako Market / Aria / late-night Tokyo register.
  MANGABOT_SLICE_OF_LIFE: {
    description:
      'PATH-BESPOKE — MangaBot slice-of-life (2026-05-29 Phase 2.6). Everyday cozy mundane moments — K-On / Tamako Market / Aria / late-night Tokyo register. Different from kawaii (cute) and cherry-blossom-romance (romantic) — slice-of-life is REALISTIC everyday with subtle wonder. Forward-facing engaged with everyday objects/contexts.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot kawaii (2026-05-29 Phase 2.5).
  // Cozy cute moments. Sanrio / lolita / Pop-Mart-vinyl-cute / character-cafe tradition.
  MANGABOT_KAWAII: {
    description:
      'PATH-BESPOKE — MangaBot kawaii (2026-05-29 Phase 2.5). Cozy cute moments — sanrio-coded, lolita-frilly, character-cafe register. Forward-facing cute pose with sparkle stack at gentle intensity. Lower drama gate (30%) for kawaii tone.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot shonen-action (2026-05-29 Phase 2.4).
  // Peak-action shonen hero (Naruto / MHA / JJK / Bleach / Demon Slayer
  // tradition). MULTI-EFFECT STACK mandate — 3+ simultaneous dynamics
  // per render. Higher chaos intensity. Combat-coded camera framings.
  MANGABOT_SHONEN_ACTION: {
    description:
      'PATH-BESPOKE — MangaBot shonen-action (2026-05-29 Phase 2.4). Peak-action shonen hero mid-combat-move. Multi-effect stack (3+ simultaneous dynamics). Higher chaos, combat-coded framings, anti-back-to-camera, anti-shirtless. Bespoke axes for hero_class / power_signature / battlefield / etc.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'hero_class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'weapon',
      ],
      path: ['power_signature', 'battlefield', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot magical-girl (2026-05-29 Phase 2.3).
  // Mahou-shoujo / Sailor-Moon / Precure / Madoka-Magica tradition. Solo
  // magical-girl mid-transformation or mid-power-moment. Sparkle-stack
  // mandate + transformation-peak mandate. Forward-facing magical pose.
  MANGABOT_MAGICAL_GIRL: {
    description:
      'PATH-BESPOKE — MangaBot magical-girl (2026-05-29 Phase 2.3). Solo mahou-shoujo / sailor-moon / precure / madoka archetype. Mid-transformation or mid-power-moment with SPARKLE STACK. Forward-facing magical-girl identity. 11-axis split, all path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot anime-character-male (2026-05-29 Phase 2.2).
  // Mirror of MANGABOT_ANIME_CHARACTER_FEMALE with male-coded action +
  // outfit + ethnicity + male-specific NSFW bans (per DragonBot
  // male-adventurer lesson: no shirtless / no oiled-pecs / no bare-chested,
  // explicit chest-covering mandate on every outfit). Same 12-axis split.
  MANGABOT_ANIME_CHARACTER_MALE: {
    description:
      'PATH-BESPOKE — MangaBot anime-character-male (2026-05-29 Phase 2.2 clone-with-divergence from FEMALE). Anime man as HERO. Same 12-axis split. Male-coded action pool + male DNA pools. Anti-shirtless + anti-pretty-boy mandates (rugged-handsome bar; explicit chest-covering on every outfit).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'ethnicity',
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // ━━━ WAVE 2 — character-led genre paths (2026-05-29) ━━━

  // PATH-BESPOKE — MangaBot occult-tokyo (Phase 2.9). Urban Tokyo + spirits.
  MANGABOT_OCCULT_TOKYO: {
    description:
      'PATH-BESPOKE — MangaBot occult-tokyo (2026-05-29 Phase 2.9). Modern urban Japan with spirit-energy / cursed-tech / ofuda / sigils. Tokyo Ghoul / Jujutsu Kaisen / Mob Psycho / Bleach register. Character ENGAGED with the occult, NOT passive. Anti-back-to-camera.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot post-apocalyptic (Phase 2.10). Lone wanderer + ruins.
  MANGABOT_POST_APOCALYPTIC: {
    description:
      'PATH-BESPOKE — MangaBot post-apocalyptic (2026-05-29 Phase 2.10). Quiet decay + nature reclaiming civilization + lone wanderer. Trigun / Made-in-Abyss / Girls-Last-Tour / Yokohama-Kaidashi register. Character ENGAGED in ruined world (scavenging, sheltering, navigating), not silhouette-on-horizon. Anti-back-to-camera.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot beach-episode (Phase 2.11). Anime summer-arc vacation.
  MANGABOT_BEACH_EPISODE: {
    description:
      'PATH-BESPOKE — MangaBot beach-episode (2026-05-29 Phase 2.11). Anime summer-arc vacation paradise. K-On / Free / Lucky-Star / Nichijou register. Character ENGAGED in beach/poolside fun. ANTI-cheesecake (modest swimwear / cover-up / sundress register, NEVER suggestive). Anti-back-to-camera.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot festival-nights (Phase 2.12). Yukata at matsuri.
  MANGABOT_FESTIVAL_NIGHTS: {
    description:
      'PATH-BESPOKE — MangaBot festival-nights (2026-05-29 Phase 2.12). Japanese summer matsuri / hanami-fireworks / lantern-stalls. Yukata-coded character ENGAGED with festival (eating yakisoba, holding sparkler, mid-laugh under fireworks). NOT silhouette-watching. Anti-back-to-camera.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['ethnicity', 'archetype', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['setting', 'action', 'camera_framing', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot mecha-hangars (Phase 2.14, second attempt).
  // The previous (2026-05-22) axis attempt failed on two Flux gravities:
  //   1. "anime mech standing arms-out T-pose" default
  //   2. "Mt-Fuji-without-mech postcard drift" (mech vanishes, landscape wins)
  // This second attempt explicitly forces LOADED-POSTURE (no T-pose) +
  // SCALE-PROVERS-IN-FRAME (catwalks/crew/vehicles at the mech's feet) +
  // mech-fills-50-to-80%-of-frame mandate so the landscape can't eat the mech.
  // SCENE-LED — mech is HERO, pilot/crew tiny for scale only.
  MANGABOT_MECHA_HANGARS: {
    description:
      'PATH-BESPOKE — MangaBot mecha-hangars (2026-05-29 Phase 2.14 second-attempt). Giant mech is HERO. Gundam / Eva / Patlabor / Macross / Code-Geass register. Anti-T-pose (loaded posture mandate) + anti-Mt-Fuji-drift (mech fills 50-80%) + scale-provers-in-frame (crew/catwalks). SCENE-LED, no character DNA. 10 bespoke axes designed around the two prior failure modes.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'mech_class',
        'mech_posture',
        'hangar_setting',
        'scale_provers',
        'mech_detail',
        'mech_weaponry_or_tool',
        'steam_or_spark',
        'light_signature',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // PATH-BESPOKE — MangaBot anime-village (Phase 2.13). Village-streetscape SCENE-led.
  // Different from char-led W1/W2 paths: this is a LANDSCAPE / streetscape with
  // an optional small inhabitant figure for human scale. Anchor is the village.
  MANGABOT_ANIME_VILLAGE: {
    description:
      'PATH-BESPOKE — MangaBot anime-village (2026-05-29 Phase 2.13). SCENE-LED Japanese small-town / village / mountain-edge / riverside neighborhood streetscape. Mushishi / Spice-and-Wolf / Mononoke pastoral register OR Akihabara / Asakusa modern alleyways. Optional small-scale figure for human scale, NOT hero portrait. Different shape from W1/W2 char-led — uses scene-led axes (anchor / streetscape / architecture).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'village_anchor',
        'architecture',
        'streetscape_detail',
        'foreground_element',
        'inhabitant',
        'wildlife_or_object',
        'weather_air',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
