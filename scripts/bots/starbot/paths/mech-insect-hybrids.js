/**
 * MechBot mech-insect-hybrids path — NEW exotic path (2026-06-09).
 *
 * Mechanical/live hybrid insects: an insectoid race where machine + insect have
 * fused into wild sci-fi hybrids. The insect + mechanical aesthetic OVERRULES —
 * insectoid-humanoids are allowed, but the insect/mechanical features always
 * dominate the silhouette (chitin + chrome, wings + turbines, mandibles + servos).
 *
 * Mirrors the scifi-cyborg-female architecture (archetype STARBOT_MECH_INSECT_HYBRIDS):
 *   - being           HERO — a DIFFERENT insect-order × machine-archetype hybrid per render
 *   - material        the fusion surface (where chitin meets chrome)
 *   - eyes            insect optics fused with machine sensors
 *   - signature_wow   the ONE showstopper feature (unfolding wings / snapping mandibles / reactor)
 *   - biome           bio-mechanical environment with multi-tier depth
 *   - look            rendering register (leads CLIP — anti-homogenize)
 *   - composition     framing (hero reads large + central)
 *   - drama           40%-gated drama phenomenon (conditional layer)
 *   + universal: lighting, atmosphere (bot defaults)
 *
 * NO insect-type enumeration in any prefix (first-named-noun lock) — the HERO pool
 * carries the species, the look leads. promptPrefixByPath is EMPTY (wrapper-strip).
 * Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'STARBOT_MECH_INSECT_HYBRIDS',
  pools: {
    being: 'MECH_INSECT_BEING',
    material: 'MECH_INSECT_MATERIAL',
    eyes: 'MECH_INSECT_EYES',
    signature_wow: 'MECH_INSECT_FEATURE',
    biome: 'MECH_INSECT_BIOME',
    look: 'MECH_INSECT_LOOK',
    composition: 'MECH_INSECT_COMPOSITION',
    drama: 'MECH_INSECT_DRAMA', // 40%-gated conditional layer
  },
};
