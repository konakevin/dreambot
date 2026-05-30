/**
 * MangaBot shonen-action path — declarative axis-system form (Phase 2.4,
 * 2026-05-29). Full-bespoke. Peak-action shonen hero in combat-arena with
 * multi-effect stack mandate.
 *
 * 13-axis split (8 DNA + 4 path + 1 conditional drama, drama at 50% gate):
 *   DNA: ethnicity + hero_class + skin / eyes / hair_color (REUSE shared)
 *        + hairstyle (REUSE male) + outfit (bespoke chest-covered)
 *        + weapon (bespoke combat weapon)
 *   path: power_signature + battlefield + action + camera_framing +
 *         surprise_element
 *   conditional: drama (50% — higher than other paths for peak combat)
 *
 * Legacy at paths/legacy/shonen-action.js.
 */
module.exports = {
  archetype: 'MANGABOT_SHONEN_ACTION',
  pools: {
    ethnicity: 'SHONEN_ACTION_ETHNICITY',
    hero_class: 'SHONEN_ACTION_HERO_CLASS',
    skin: 'ANIME_SKIN',
    eyes: 'ANIME_EYES',
    hair_color: 'ANIME_HAIR_COLOR',
    hairstyle: 'ANIME_HAIRSTYLES_MALE',
    outfit: 'SHONEN_ACTION_OUTFIT',
    weapon: 'SHONEN_ACTION_WEAPON',
    power_signature: 'SHONEN_ACTION_POWER_SIGNATURE',
    battlefield: 'SHONEN_ACTION_BATTLEFIELD',
    action: 'SHONEN_ACTION_ACTION',
    camera_framing: 'SHONEN_ACTION_CAMERA_FRAMING',
    surprise_element: 'SHONEN_ACTION_SURPRISE_ELEMENT',
    drama: 'SHONEN_ACTION_DRAMA',
  },
};
