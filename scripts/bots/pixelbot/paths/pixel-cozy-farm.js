/**
 * PixelBot pixel-cozy-farm — FarmBot's cozy countryside world rendered as chunky-cute
 * pixel art (PIXELBOT_SCENES_PLAN.md §3.7; spec of record FARMBOT_CREATIVE_DIRECTION.md).
 * Replaces cozy-farming-life-sim at ship time. Cute > cozy > whimsical > beautiful >
 * realistic. The hero is a named VIGNETTE; animals and villagers share the spotlight;
 * serendipity adds two unexpected cute details. 8 bespoke pools. Function-form.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['vignette', 'farm_place', 'season_weather', 'animal_cast', 'villager', 'serendipity', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_cozy_farm', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const vignette = scene.pick(picker, P, 'vignette', 'farm_vignette');
  const place = scene.pick(picker, P, 'farm_place', 'farm_place');
  const season = scene.pick(picker, P, 'season_weather', 'farm_season');
  const animals = scene.pick(picker, P, 'animal_cast', 'farm_animals');
  const villager = scene.gated(picker, P, 'villager', 'farm_villager', 0.6);
  const s1 = scene.pick(picker, P, 'serendipity', 'farm_serendipity');
  const s2 = scene.pick(picker, P, 'serendipity', 'farm_serendipity');
  const camera = scene.pick(picker, P, 'camera', 'farm_camera');
  const palette = scene.pick(picker, P, 'palette', 'farm_palette');

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a chunky-cute PIXEL-ART PAINTING of a cozy countryside moment for PixelBot: a cute, idyllic storybook farm world where everything is friendly, peaceful, and a little bit magical. Cute over cozy over whimsical over beautiful over realistic, always in that order. The feeling is "I want to live there."

${blocks.SCENE_REGISTER_BLOCK}
The hero is the VIGNETTE below: one sweet, slightly silly moment. ANIMALS and the VILLAGER (if present) share the spotlight EQUALLY, drawn as chunky-cute pixel sprites with round bodies, big heads, and simple friendly faces, mid-frame and whole, with the place dressed richly around them. One moment, one place, room to breathe, never a collage.

━━━ THE VIGNETTE (the hero) ━━━
${vignette}

━━━ THE STAGE ━━━
${place}

━━━ THE ANIMALS ━━━
${animals}
${villager ? `\n━━━ THE VILLAGER ━━━\n${villager}\nThe villager is the same scale as the scene, warm and relaxed, interacting with an animal or with food, never a portrait, never a close-up.\n` : '\nThere is no person in this scene; the animals carry it.\n'}
━━━ SERENDIPITY (two small surprises the eye finds second) ━━━
${s1}
${s2}

━━━ SEASON, WEATHER, TIME, LIGHT ━━━
${season}

━━━ CAMERA ━━━
${camera}

━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Farm life is charming little moments with wooden tools and hand-tended plots, never hard labour or machinery. Every sign, crate, and jar is blank or carries a simple pictorial symbol.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the vignette: animals and villager mid-moment] [the stage around them] [the two serendipity details] [season, weather, and light] [the camera] [the palette]')}`;
};

builder.vibes = ['whimsical', 'nostalgic', 'coquette', 'enchanted'];
module.exports = builder;
