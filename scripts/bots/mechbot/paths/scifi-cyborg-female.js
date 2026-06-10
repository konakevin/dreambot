/**
 * MechBot scifi-cyborg-female path — NEW from-scratch exotic path (2026-06-09).
 *
 * "Truly out there" exotic alien-cyborg females. Built completely fresh, with
 * NO inheritance from the legacy cyborg-woman beauty-portrait (which locked one
 * glossy contemplative register). The design goal: genuinely alien, wow-inducing
 * sci-fi cyborg women — every render a different alien race, with the look axis
 * varying the rendering register so nothing homogenizes.
 *
 * Architecture (declarative, archetype MECHBOT_SCIFI_CYBORG_FEMALE):
 *   - xeno_being      HERO — a DIFFERENT exotic alien-cyborg species per render
 *   - signature_wow   the ONE showstopper feature (floating / unfolding / light)
 *   - biome           exotic alien environment with multi-tier depth
 *   - look            cinematic rendering register (leads CLIP — anti-homogenize)
 *   - composition     framing + pose (varied, tasteful, never pinup)
 *   - drama           40%-gated exotic phenomenon (conditional layer)
 *   + universal: lighting, atmosphere (bot defaults)
 *
 * Tasteful-sexy via exotic elegance, never cheesecake (NSFW guardrails in the
 * template + the pool recipes). Pools at MVP-25 — NOT scaled. promptPrefixByPath
 * is EMPTY (wrapper-strip lesson) so the look-led Sonnet body leads.
 */

module.exports = {
  archetype: 'MECHBOT_SCIFI_CYBORG_FEMALE',
  pools: {
    xeno_being: 'SCIFI_CYBORG_XENO_BEING',
    organic: 'SCIFI_CYBORG_ORGANIC', // organic face + alien biology (human/alien variety)
    eyes: 'SCIFI_CYBORG_EYES', // glowing-eyes RNG accent
    signature_wow: 'SCIFI_CYBORG_SIGNATURE_WOW',
    biome: 'SCIFI_CYBORG_BIOME',
    look: 'SCIFI_CYBORG_LOOK',
    composition: 'SCIFI_CYBORG_COMPOSITION',
    drama: 'SCIFI_CYBORG_DRAMA', // 40%-gated conditional layer
  },
};
