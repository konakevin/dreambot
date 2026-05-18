/**
 * MechBot cyborg-man path — declarative form (2026-05-17).
 *
 * Mirrors cyborg-woman migration pattern but male-coded: RUGGED, HANDSOME,
 * CAPABLE, MYSTERIOUS, BADASS. NOT sexy. Half-human half-machine male
 * cyborg with cinematic atmospheric presence — Solid Snake / Adam Jensen /
 * Geralt-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V energy.
 *
 * DNA flows from bot.rollSharedDNA() (existing 'cyborg-man' branch already
 * populates male characterBase/skin/bodyType/eyes/hair/internal/glowColor).
 *
 * Pools:
 *   - cyborg_feature: CYBORG_FEATURES (shared)
 *   - cyborg_material: CYBORG_WOMAN_MATERIAL (shared — gender-neutral
 *     material/finish descriptions)
 *   - action: CYBORG_MALE_ACTIONS (existing male action pool)
 *   - landscape: CHARACTER_INTERIOR (shared sci-fi architecture pool)
 *   - composition: NEW CYBORG_MAN_COMPOSITION (50% closeup + 50% full-body
 *     action, male-coded — scarred jaw / chrome temple / weathered eye /
 *     wide-stance / mid-vault / over-shoulder mid-fire)
 *   - drama: CYBORG_WOMAN_DRAMA (shared — atmospheric flourishes, 40% gated)
 *
 * Pre-migration function-form brief preserved at paths/legacy/cyborg-man.js.
 */

module.exports = {
  archetype: 'MECHBOT_CYBORG_MAN',
  pools: {
    cyborg_feature: 'CYBORG_FEATURES',
    cyborg_material: 'CYBORG_WOMAN_MATERIAL',
    action: 'CYBORG_MALE_ACTIONS',
    landscape: 'CHARACTER_INTERIOR',
    composition: 'CYBORG_MAN_COMPOSITION',
    drama: 'CYBORG_WOMAN_DRAMA',
  },
};
