/**
 * ToyBot model-train-world path — declarative axis-system.
 *
 * HO-scale (1:87) or N-scale model-railroad diorama. NO HUMAN FIGURES
 * outside the diorama (tiny scale-figures integral to a drama-beat are fine).
 *
 * Axes:
 *   - Universal (bot.defaultPools): camera_angle, scenario, staging
 *   - Path-bespoke:
 *       scene          — merged landscape+scene (400 entries)
 *       train_consist  — era/engine/cars (200)
 *       train_weather  — atmospheric (100)
 *       drama_moment   — narrative beat that fixes "static trainset" (50 v1)
 *       unusual_cargo  — 35% conditional layer for surprise wow-factor (50 v1)
 *
 * Locked medium: model_train_diorama (via ToyBot mediumByPath).
 * Template inlines all mandate content (TOY_PHOTOGRAPHY, CINEMATIC_STORY,
 * DRAMATIC_LIGHTING, PATH_MEDIUM_LOCK, BLOW_IT_UP, world-mode staging +
 * story-cast) — no bot-local block imports. Self-contained.
 */

module.exports = {
  archetype: 'TOYBOT_MODEL_TRAIN_WORLD',
  pools: {
    scene: 'TOYBOT_MODEL_TRAIN_SCENE',
    train_consist: 'TOYBOT_TRAIN_CONSISTS',
    train_weather: 'TOYBOT_TRAIN_WEATHER',
    drama_moment: 'TOYBOT_TRAIN_DRAMA_MOMENT',
    unusual_cargo: 'TOYBOT_TRAIN_UNUSUAL_CARGO',
    // World-mode pools — picked when sharedDNA.renderMode === 'world':
    world_real_setting: 'TOYBOT_TRAIN_WORLD_REAL',
    world_themed_setting: 'TOYBOT_TRAIN_WORLD_THEMED',
  },
};
