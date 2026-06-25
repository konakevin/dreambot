/**
 * MechBot og-cyborg-female path — NEW (2026-06-09).
 *
 * Replicates Kevin's "OG" reference aesthetic (14 reference renders): beautiful,
 * SEXY, human-proportioned female cyborgs — a gorgeous human(oid) face + curvy
 * figure clad in a glossy sculpted chassis, exposed mechanical joints, glowing
 * accent-lights, real hair (or a chrome cranium), glowing eyes, and a signature
 * cyber head/neck feature. Sorayama-chrome meets Ghost-in-the-Shell beauty.
 * PHOTOREAL — grounded, NOT the wild alien-creature register of
 * scifi-cyborg-female (which is left untouched; we may iterate on it later).
 *
 * Architecture (archetype STARBOT_OG_CYBORG_FEMALE):
 *   - subject       HERO — the beautiful sexy human-proportioned cyborg woman
 *   - hair          real hair OR chrome cranium (RNG)
 *   - cyber_feature signature cyber head/neck detail (RNG)
 *   - eyes          glowing eyes (RNG)
 *   - setting       soft, subject-focused background
 *   - composition   beauty-shot framing/pose (profile / three-quarter / medium)
 *   - drama         40%-gated soft atmosphere (conditional)
 *   + universal: lighting, atmosphere
 *
 * No look-axis — the consistent photoreal glossy look IS the aesthetic (uses the
 * default render medium). Tasteful-sexy: glossy chassis covers her, never bare
 * skin. Pools at MVP-25 — NOT scaled. promptPrefixByPath EMPTY (wrapper-strip).
 */

module.exports = {
  archetype: 'STARBOT_OG_CYBORG_FEMALE',
  pools: {
    subject: 'OG_CYBORG_SUBJECT',
    hair: 'OG_CYBORG_HAIR',
    cyber_feature: 'OG_CYBORG_CYBER_FEATURE',
    eyes: 'OG_CYBORG_EYES',
    setting: 'OG_CYBORG_SETTING',
    composition: 'OG_CYBORG_COMPOSITION',
    drama: 'OG_CYBORG_DRAMA', // 40%-gated conditional layer
  },
};
