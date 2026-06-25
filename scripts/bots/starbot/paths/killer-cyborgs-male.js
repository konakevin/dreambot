/**
 * MechBot killer-cyborgs-male path — MALE mirror of killer-cyborgs (2026-06-09).
 *
 * Handsome/rugged lethal MALE cyborg assassin-thieves — agile, sleek, dangerous.
 * Same architecture as killer-cyborgs; only the gendered SUBJECT + FACE pools are
 * male-specific. The weapon / biome / look / composition / eyes / drama pools are
 * SHARED with the female killer-cyborgs path (they're gender-neutral). Flux-locked.
 */

module.exports = {
  archetype: 'STARBOT_KILLER_CYBORGS_MALE',
  pools: {
    xeno_being: 'KILLER_CYBORG_MALE_XENO_BEING', // male assassin subject
    organic: 'KILLER_CYBORG_MALE_ORGANIC', // male face
    eyes: 'KILLER_CYBORG_EYES', // shared
    signature_wow: 'KILLER_CYBORG_SIGNATURE_WOW', // shared (weapon)
    biome: 'KILLER_CYBORG_BIOME', // shared
    look: 'KILLER_CYBORG_LOOK', // shared
    composition: 'KILLER_CYBORG_COMPOSITION', // shared
    drama: 'KILLER_CYBORG_DRAMA', // shared (40%-gated)
  },
};
