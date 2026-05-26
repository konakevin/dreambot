/**
 * GothBot vampire-hunter-in-action path — declarative axis-system (2026-05-22 R4 RESTART).
 *
 * THE SOUL OF THE PATH:
 *   SOLO hunter on-the-prowl, pre-encounter. Quarry is IMPLIED OFF-CAMERA —
 *   never visible in the frame. The hunter is mid-stalk through a specific
 *   gothic scene (cobblestone alley / cathedral nave / castle courtyard /
 *   crypt-yard / rooftop / forest path) with weapon at the ready and
 *   active body language toward an off-frame target.
 *
 *   Distinct from sibling male paths:
 *     - vampire-assassin-male: character-portrait with weapon (kept as-is)
 *     - goth-male-closeup: tight portrait
 *     - goth-male-full-body: mid-shot character
 *     - vampire-hunter-in-action: SOLO ON-THE-PROWL, vampire off-camera,
 *       hunter mid-motion through specific gothic location
 *
 *   Like a stealth-game screenshot / Castlevania cutscene mid-stalk.
 *   Medium-close composition (hunter readable, 50-65% of vertical frame).
 *
 * 11 AXES (10 always-on + 1 gated spoor):
 *   - prowl_action: LOAD-BEARING — the active motion (aiming / mid-stride / sneaking / drawing)
 *   - setting_location: LOAD-BEARING — specific gothic place
 *   - hunter_archetype: which kind of hunter (Belmont / Witcher / Van Helsing)
 *   - weapon_signature: prominent period-accurate gothic weapon
 *   - outfit_silhouette: heavy field-worn hunter gear (chest fully covered)
 *   - environmental_detail: scene-specific accents (gas-lamps / iron-fence / cobblestone-puddles)
 *   - lighting: dramatic gothic light + time-of-day
 *   - atmospheric_depth: fog / mist / god-rays / smoke / embers
 *   - composition_framing: medium-close solo camera angle
 *   - foreground_anchor: closest tactile element
 *   - spoor (40%-gated): subtle hint of past quarry presence (handprint / footprints / ash)
 */

module.exports = {
  archetype: 'GOTHBOT_VAMPIRE_HUNTER_IN_ACTION',
  pools: {
    prowl_action: 'GOTHBOT_VHIA_PROWL_ACTION',
    setting_location: 'GOTHBOT_VHIA_SETTING_LOCATION',
    hunter_archetype: 'GOTHBOT_VHIA_HUNTER_ARCHETYPE',
    weapon_signature: 'GOTHBOT_VHIA_WEAPON_SIGNATURE',
    outfit_silhouette: 'GOTHBOT_VHIA_OUTFIT_SILHOUETTE',
    environmental_detail: 'GOTHBOT_VHIA_ENVIRONMENTAL_DETAIL',
    lighting: 'GOTHBOT_VHIA_LIGHTING',
    atmospheric_depth: 'GOTHBOT_VHIA_ATMOSPHERIC_DEPTH',
    composition_framing: 'GOTHBOT_VHIA_COMPOSITION_FRAMING',
    foreground_anchor: 'GOTHBOT_VHIA_FOREGROUND_ANCHOR',
    spoor: 'GOTHBOT_VHIA_SPOOR',
  },
};
