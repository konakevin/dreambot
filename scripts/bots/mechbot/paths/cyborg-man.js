/**
 * MechBot cyborg-man path — "android-man" rebuild (2026-05-26, Kevin).
 *
 * Full rich axis-system conversion. Replaces BOTH the bust-portrait
 * cyborg-male-legacy function-form AND the disabled, face-obsessed
 * MECHBOT_CYBORG_MAN axis attempt.
 *
 * Register: a MOSTLY-MACHINE male android-BEING — synthetic chassis dominates
 * the silhouette, organic shows ONLY at the eyes / a small face-panel — a
 * human ghost inside an engineered body (Alita / Ghost in the Shell Major /
 * Nier Automata / battle-android / Cyberpunk full-borg). RUGGED, weathered,
 * lethal. FULL-FIGURE in a sci-fi scene, NEVER a bust. Solves the two prior
 * failures: (1) bust-shot-of-a-head and (2) handsome organic head pasted onto
 * a chrome body.
 *
 * Fully composer-driven — 8 bespoke path axes + 1 conditional drama +
 * 2 universal. Does NOT read the pretty-boy cyborg-man sharedDNA character
 * fields; only sharedDNA.glowColor / scenePalette / colorPalette (set by the
 * 'cyborg-man' branch of bot.rollSharedDNA()).
 *
 * Composition pool is ~85% full-figure to kill the bust-shot failure mode.
 *
 * Pre-rebuild function-form brief preserved at paths/legacy/cyborg-man.js.
 */

module.exports = {
  archetype: 'MECHBOT_ANDROID_MAN',
  pools: {
    identity: 'ANDROID_MAN_IDENTITY',
    chassis: 'ANDROID_MAN_CHASSIS',
    material: 'ANDROID_MAN_MATERIAL',
    head: 'ANDROID_MAN_HEAD',
    eye: 'ANDROID_MAN_EYE',
    augment: 'ANDROID_MAN_AUGMENT',
    action: 'ANDROID_MAN_ACTION',
    setting: 'ANDROID_MAN_SETTING',
    composition: 'ANDROID_MAN_COMPOSITION',
    surprise: 'ANDROID_MAN_SURPRISE',
    drama: 'ANDROID_MAN_DRAMA', // 40% gated conditional
  },
};
