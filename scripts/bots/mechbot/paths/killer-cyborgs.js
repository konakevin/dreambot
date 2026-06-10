/**
 * MechBot killer-cyborgs path — VERBATIM CONFIG CLONE of scifi-cyborg-female
 * (2026-06-09). Created as an equal baseline to fan out toward more MENACING /
 * "evil robot" + killer-cyborg looks. The pools start as copies of the
 * scifi-cyborg-female pools; they will be regenerated (new menacing content) as
 * the path tilts evil. Until then it renders identically to scifi-cyborg-female.
 *
 * Same architecture as scifi-cyborg-female (archetype MECHBOT_KILLER_CYBORGS):
 *   xeno_being / organic / eyes / signature_wow / biome / look / composition
 *   + 40%-gated drama + universal lighting/atmosphere. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_KILLER_CYBORGS',
  pools: {
    xeno_being: 'KILLER_CYBORG_XENO_BEING',
    organic: 'KILLER_CYBORG_ORGANIC',
    eyes: 'KILLER_CYBORG_EYES',
    signature_wow: 'KILLER_CYBORG_SIGNATURE_WOW',
    biome: 'KILLER_CYBORG_BIOME',
    look: 'KILLER_CYBORG_LOOK',
    composition: 'KILLER_CYBORG_COMPOSITION',
    drama: 'KILLER_CYBORG_DRAMA', // 40%-gated conditional layer
  },
};
