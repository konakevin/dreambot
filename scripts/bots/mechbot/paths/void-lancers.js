/**
 * MechBot void-lancers path — NEW path (2026-06-10).
 *
 * ZERO-G orbital mech-KNIGHT combat — EVA combat-mechs free-floating in the vacuum,
 * energy-lances + attitude-thrusters, a planet's curve below, debris-fields and
 * damaged stations. Weightless orbital knight-combat. MECH-FOCUSED — distinct from
 * StarBot (cosmic vistas / ships / alien worlds) and mech-skyships (atmospheric
 * flight). Gundam space-combat / Knights of Sidonia / The Expanse.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_VOID_LANCERS):
 *   FIGURE:
 *   - lancer       HERO — a DIFFERENT orbital mech-knight archetype per render
 *   - maneuver     the SIGNATURE money-shot (the zero-G combat maneuver/weapon)
 *   ENVIRONMENT:
 *   - void         the orbital setting WITH hard vacuum lighting + a planet for scale
 *   - look         rendering register (leads CLIP — anti-homogenize)
 *   - composition  framing (weightless free-float, full body, orbital scale)
 *   - drama        40%-gated orbital-combat beat (foe charging / ship exploding)
 *
 * universal: [] — the path supplies its own orbital lighting via void + look (the
 * bot's universal pools are coded for a different context). promptPrefixByPath is
 * EMPTY (wrapper-strip). Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_VOID_LANCERS',
  pools: {
    lancer: 'VOID_LANCER',
    maneuver: 'VOID_MANEUVER',
    void: 'VOID_SETTING',
    look: 'VOID_LOOK',
    composition: 'VOID_COMPOSITION',
    drama: 'VOID_DRAMA', // 40%-gated conditional layer (orbital combat)
  },
};
