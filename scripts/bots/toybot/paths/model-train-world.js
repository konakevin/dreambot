/**
 * ToyBot model-train-world path — declarative axis-system (R0 proper migration).
 *
 * HO-scale (1:87) or N-scale model-railroad diorama. NO HUMAN FIGURES by
 * design — handcrafted terrain + tiny model trains ARE the subject.
 *
 * Axes:
 *   - Universal (bot.defaultPools): camera_angle, scenario, staging
 *   - Path-bespoke: scene (merged landscape + scene = 400 entries),
 *     train_consist (200), train_weather (100)
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
  },
};
