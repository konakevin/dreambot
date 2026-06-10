/**
 * MechBot sentinels path — NEW path (2026-06-09).
 *
 * COLOSSAL ancient guardian-mechs — monumentally huge, half-dormant, weathered and
 * overgrown after ages, in sacred awe-landscapes. The register MechBot lacks: AWE +
 * ancient majesty + melancholy + sacred stillness (not action). Shadow of the
 * Colossus / Horizon tallnecks / Ghibli-Mononoke / Castle in the Sky. The guardian
 * is a MACHINE (overgrown, but a guardian-mech), never a shiny war-machine.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_SENTINELS):
 *   FIGURE:
 *   - sentinel     HERO — a DIFFERENT colossal guardian archetype per render
 *   - awakening    the SIGNATURE money-shot (ancient optics kindling to life / dormancy)
 *   ENVIRONMENT:
 *   - realm        the sacred awe-landscape WITH its own lighting/mood baked in
 *   - look         rendering register (leads CLIP — anti-homogenize)
 *   - composition  framing (ALWAYS a tiny scale-prover proving godlike size)
 *   - drama        40%-gated stirring beat (first step / birds scatter / core wakes)
 *
 * universal: [] — the bot's LIGHTING/ATMOSPHERES pools are space-coded (StarBot
 * heritage) and would fight a misty-valley / jungle-temple scene; the realm + look +
 * awakening carry the light instead. NO guardian-type enumeration in any prefix
 * (first-named-noun lock) — the HERO pool carries the archetype. promptPrefixByPath
 * is EMPTY (wrapper-strip). Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_SENTINELS',
  pools: {
    sentinel: 'SENTINEL_BEING',
    awakening: 'SENTINEL_AWAKENING',
    realm: 'SENTINEL_REALM',
    look: 'SENTINEL_LOOK',
    composition: 'SENTINEL_COMPOSITION',
    drama: 'SENTINEL_DRAMA', // 40%-gated conditional layer (stirring)
  },
};
