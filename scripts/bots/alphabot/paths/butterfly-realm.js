/**
 * DreamBot butterfly-realm path — striking butterflies in a clean, dreamy,
 * whimsical DREAMSCAPE (2026-06-27, R1 redesign).
 *
 * References: eroticbotanical.art (electric-blue morpho butterflies blanketing a
 * moss-covered forest TRUNK in a misty forest — clean, restrained, striking) +
 * ai_bubnova (butterflies forming a rainbow/phenomenon over a vista). NO
 * character; the BUTTERFLIES are the hero — always striking and the focal point.
 *
 * R0 feedback was "spammy / too tied to flowers / not enough whimsy — these are
 * dreamscapes." R1 fix: DE-FLOWERED (mossy trunks / stone / water / open air, not
 * flower gardens), COMPOSITION-OVER-DENSITY (one clean striking butterfly subject
 * against misty negative space — BloomBot's anti-spam lesson), and a new WHIMSY
 * axis (giant moons / glowing orbs / floating islands / aurora / luminous mist)
 * for the surreal dream-magic. 6 axes (dropped the flora ×2 + backdrop + event).
 *
 * AXIS-CLEAN: setting owns BIOME, palette owns BUTTERFLY COLOR, composition owns
 * ARRANGEMENT, whimsy owns the SURREAL DREAM ELEMENT, atmosphere owns LIGHT+MIST,
 * feature owns the ONE clean anchor.
 *
 * Config (index.js): own `dreambot_butterfly` medium (code-only, no DB row) +
 * flux-1.1-pro / pro-ultra; excluded from the look-rotation; skips chaos +
 * two-pass-polish.
 *
 * Archetype + template: DREAMBOT_BUTTERFLY_REALM (archetypes.js + archetype-templates.js).
 */

module.exports = {
  archetype: 'DREAMBOT_BUTTERFLY_REALM',
  pools: {
    setting: 'BUTTERFLY_REALM_SETTING',
    feature: 'BUTTERFLY_REALM_FEATURE',
    composition: 'BUTTERFLY_REALM_COMPOSITION',
    palette: 'BUTTERFLY_REALM_PALETTE',
    whimsy: 'BUTTERFLY_REALM_WHIMSY',
    atmosphere: 'BUTTERFLY_REALM_ATMOSPHERE',
  },
};
