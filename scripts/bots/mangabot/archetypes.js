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
};
