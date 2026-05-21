/**
 * PixelBot pixel-horror path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT GOTHIC-ACTION GAMEPLAY SCREENSHOTS — Castlevania (NES/SNES) +
 * Ghosts n Goblins + Ghouls n Ghosts + Black Tiger + Demon Crest +
 * Magical Quest + Splatterhouse + Rondo of Blood + Bloodstained pixel.
 *
 * NOT modern psychological horror. CLASSIC gothic-fantasy monster-
 * slaying action vibe. Single hero (knight / vampire-hunter / barbarian
 * / mage) is genre-correct (Castlevania-style solo monster-slayer).
 *
 * Camera flexibility: side-view OR 3/4-iso OR top-down per setting.
 *
 * Axes (3 path-bespoke + 40%-gated props):
 *   - gothic_setting (25): vampire castle / graveyard / cathedral /
 *     dragon-cave / crypt / demon-realm / cursed-forest / etc.
 *   - classic_enemy (25): skeletons / vampire / gargoyle / zombie /
 *     dragon / lich / werewolf / etc. mid-action
 *   - hero_action (25): solo knight / vampire-hunter / barbarian /
 *     mage mid-attack
 *   - gothic_props (25, 40%-gated): torches / candelabras / stained
 *     glass / chandeliers / etc.
 */

module.exports = {
  archetype: 'PIXELBOT_PIXEL_HORROR',
  pools: {
    gothic_setting: 'PIXELBOT_PIXEL_HORROR_GOTHIC_SETTING',
    classic_enemy: 'PIXELBOT_PIXEL_HORROR_CLASSIC_ENEMY',
    hero_action: 'PIXELBOT_PIXEL_HORROR_HERO_ACTION',
    gothic_props: 'PIXELBOT_PIXEL_HORROR_GOTHIC_PROPS',
  },
};
