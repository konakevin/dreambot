/**
 * MechBot abyss-mechs path — NEW path (2026-06-09).
 *
 * Deep-sea MACHINES in the crushing abyssal dark — armored dive-mechs, submersible
 * war-rigs, leviathan-scale machine-constructs, hadal sentinels. A MACHINE in the
 * deep, NOT a sea-animal (those were the rejected cyber-beast). Fills MechBot's
 * missing aquatic biome. Lit only by the mech's own lamps + bioluminescence, in
 * crushing black water with drifting marine snow. Subnautica / The Abyss / BioShock
 * Big-Daddy / Pacific Rim underwater lineage.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_ABYSS_MECHS):
 *   FIGURE:
 *   - mech         HERO — a DIFFERENT deep-sea-mech archetype per render
 *   - lumens       the SIGNATURE money-shot (the lamps + bioluminescence cutting the black)
 *   ENVIRONMENT:
 *   - abyss        the deep-sea setting WITH its own lighting/mood baked in
 *   - look         rendering register (leads CLIP — anti-homogenize)
 *   - composition  framing (full-body, crushing scale + isolation)
 *   - drama        40%-gated deep-sea phenomenon (leviathan-shadow / glowing life / vent)
 *
 * universal: [] — the bot's LIGHTING/ATMOSPHERES pools are space-coded (StarBot
 * heritage) and would fight an underwater scene; the abyss + lumens + look carry the
 * light instead. NO mech-type enumeration in any prefix (first-named-noun lock) — the
 * HERO pool carries the archetype. promptPrefixByPath is EMPTY (wrapper-strip).
 * Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_ABYSS_MECHS',
  pools: {
    mech: 'ABYSS_MECH',
    lumens: 'ABYSS_LUMENS',
    abyss: 'ABYSS_BIOME',
    look: 'ABYSS_LOOK',
    composition: 'ABYSS_COMPOSITION',
    drama: 'ABYSS_DRAMA', // 40%-gated conditional layer (deep-sea phenomenon)
  },
};
