/**
 * GothBot goth-male-full-body-axis path — Elite vampire hunter full-body cinematic poster moment.
 * R2 RESET (2026-05-22) — uprooted emo-vampire-aristocrat aesthetic. John Wick of vampire hunters.
 *
 * Classic-lore vampire hunters only (Belmont / Witcher of the School of Wolf / Van Helsing /
 * Blade / Hellsing / Underworld Death-Dealer / Castlevania Trevor / Constantine / Tridentine
 * inquisitor-hunter / Wallachian boyar turned vampire-killer / etc.) — NEVER vampires/warlocks/
 * mages/liches/demonologists. STRAPPED with multiple visible weapons (crossbow + pistols +
 * sword + dagger + stakes).
 *
 * Distinct from sibling male paths:
 *   - vampire-hunter-in-action: ACTION mid-motion, hunter mid-stalk, vampire off-camera
 *   - goth-male-full-body-axis: POSTER MOMENT — standing/leaning/mid-load/loaded readiness,
 *     weapons displayed, cool/mysterious/forboding/badass. Movie-poster, not action still.
 *
 * 13 axes (12 always-on + 1 gated foreground_anchor):
 *   - character_archetype: elite vampire-hunter lineage
 *   - body_pose: cool poster poses (NEVER just-standing-empty / NEVER emo)
 *   - scene_context: gothic urban/crypt/cathedral stage
 *   - skin (reuse SKIN_TONES)
 *   - eyes (reuse GOTH_MALE_EYE_COLORS)
 *   - hair_color (reuse HAIR_COLORS)
 *   - hairstyle (cool hunter styles — never emo bangs)
 *   - face_detail (stern scar / beard / weathered — never smudgy emo)
 *   - outfit_silhouette (hunter kit, multi-weapon strapped, chest fully covered)
 *   - weapon_or_signature_object (multiple weapons visibly carried — LOADED)
 *   - atmospheric_backdrop (gothic urban/crypt — fog/lantern/moonlight)
 *   - composition_framing (medium-close full-body varied angles)
 *   - foreground_anchor (40%-gated)
 */

module.exports = {
  archetype: 'GOTHBOT_GOTH_MALE_FULL_BODY_AXIS',
  pools: {
    character_archetype: 'GOTHBOT_GMFB_CHARACTER_ARCHETYPE',
    body_pose: 'GOTHBOT_GMFB_BODY_POSE',
    scene_context: 'GOTHBOT_GMFB_SCENE_CONTEXT',
    skin: 'SKIN_TONES',
    eyes: 'GOTH_MALE_EYE_COLORS',
    hair_color: 'HAIR_COLORS',
    hairstyle: 'GOTHBOT_GMFB_HAIRSTYLE',
    face_detail: 'GOTHBOT_GMFB_FACE_DETAIL',
    outfit_silhouette: 'GOTHBOT_GMFB_OUTFIT_SILHOUETTE',
    weapon_or_signature_object: 'GOTHBOT_GMFB_WEAPON_OR_OBJECT',
    atmospheric_backdrop: 'GOTHBOT_GMFB_ATMOSPHERIC_BACKDROP',
    composition_framing: 'GOTHBOT_GMFB_COMPOSITION_FRAMING',
    foreground_anchor: 'GOTHBOT_GMFB_FOREGROUND_ANCHOR',
  },
};
