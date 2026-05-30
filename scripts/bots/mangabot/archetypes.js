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
};
