/**
 * DreamBot — axis pools. Robot-only since the 2026-07-07 split: every
 * non-robot path (+ its pools/seeds) moved to scripts/bots/alphabot/
 * (ALPHABOT.md). DreamBot is the bubble-bot-in-different-worlds bot.
 * All seeds live in dreambot/seeds/.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Cute-only VIBE_COLOR palette (no dark/fierce/macabre/nightshade/arcane etc.)
const VIBE_COLOR = {
  cozy: 'warm amber candle glow, soft golden highlights, honey tones',
  peaceful: 'soft pastel dawn, gentle pale blues and creams, tranquil',
  whimsical: 'playful buoyant pastels, warm creamy light, sparkle accents',
  enchanted: 'soft magical sparkles, dreamy lavender-and-rose, luminous',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  shimmer: 'shimmering gold particles, iridescent pastel highlights, glitter',
  nostalgic: 'warm copper and peach, faded storybook pastels, cozy sepia',
  ethereal: 'pearl-white ambient, opalescent mist, prismatic pastel sparkles',
  cinematic: 'warm teal-and-peach cinematic grade, soft luminous highlights',
  surreal: 'dreamy soft pastel impossibilities, gentle hallucinatory sweetness',
};

module.exports = {
  // bubble-bot-dreams AXIS SYSTEM (2026-06-12 canonical rebuild) — figure axes
  // (body/dome/eyes/pose) split from environment axes (world/detail/mood/atmo)
  // so BOTH the hero and the dream world get their own bespoke creative seed.
  BUBBLE_BOT_BODY: load('bubble_bot_body'),
  BUBBLE_BOT_DOME: load('bubble_bot_dome'),
  BUBBLE_BOT_EYES: load('bubble_bot_eyes'),
  BUBBLE_BOT_POSE: load('bubble_bot_pose'),
  BUBBLE_DREAM_WORLD: load('bubble_dream_world'),
  BUBBLE_WORLD_DETAIL: load('bubble_world_detail'),
  BUBBLE_LIGHT_MOOD: load('bubble_light_mood'),
  BUBBLE_ATMOSPHERE: load('bubble_atmosphere'),
  // Crossover worlds (2026-06-12) — the bubble-bot visits other bots' universes;
  // each is a themed dream_world pool, same everything else (DREAMBOT_CROSSOVER_PLAN.md).
  BUBBLE_WORLD_EARTHBOT: load('bubble_world_earthbot'),
  BUBBLE_WORLD_BRICKBOT: load('bubble_world_brickbot'),
  BUBBLE_WORLD_DRAGONBOT: load('bubble_world_dragonbot'),
  BUBBLE_WORLD_BLOOMBOT: load('bubble_world_bloombot'),
  BUBBLE_WORLD_CHIBIBOT: load('bubble_world_chibibot'),
  BUBBLE_WORLD_DINOBOT: load('bubble_world_dinobot'),
  BUBBLE_WORLD_FAEBOT: load('bubble_world_faebot'),
  BUBBLE_WORLD_GOTHBOT: load('bubble_world_gothbot'),
  BUBBLE_WORLD_MANGABOT: load('bubble_world_mangabot'),
  BUBBLE_WORLD_MECHBOT: load('bubble_world_mechbot'),
  BUBBLE_WORLD_OCEANBOT: load('bubble_world_oceanbot'),
  BUBBLE_WORLD_PIXELBOT: load('bubble_world_pixelbot'),
  BUBBLE_WORLD_RETROBOT: load('bubble_world_retrobot'),
  BUBBLE_WORLD_STARBOT: load('bubble_world_starbot'),
  BUBBLE_WORLD_STEAMBOT: load('bubble_world_steambot'),
  BUBBLE_WORLD_TINYBOT: load('bubble_world_tinybot'),
  BUBBLE_WORLD_TOYBOT: load('bubble_world_toybot'),
  BUBBLE_WORLD_YUMBOT: load('bubble_world_yumbot'),
  // Bot-wide "look register" (2026-06-07) — rolled by rollSharedDNA for every
  // render; no robot path consumes it today, but the DNA shape stays stable.
  CHIBIBOT_LOOK_REGISTER: load('chibibot_look_register'),

  // Shared axes (also duplicated in alphabot — each module is self-contained)
  SCENE_WEATHER: load('scene_weather'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),

  VIBE_COLOR,

  // Sensory anchor pools — 2 contexts × 7 channels × 100 entries each
  SENSORY_POOLS: {
    creature: {
      smell: load('sensory_creature_smell'),
      sound: load('sensory_creature_sound'),
      touch: load('sensory_creature_touch'),
      temperature: load('sensory_creature_temperature'),
      weight: load('sensory_creature_weight'),
      air: load('sensory_creature_air'),
      lightcolor: load('sensory_creature_lightcolor'),
    },
    scene: {
      smell: load('sensory_scene_smell'),
      sound: load('sensory_scene_sound'),
      touch: load('sensory_scene_touch'),
      temperature: load('sensory_scene_temperature'),
      weight: load('sensory_scene_weight'),
      air: load('sensory_scene_air'),
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
