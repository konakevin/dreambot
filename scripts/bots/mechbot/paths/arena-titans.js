/**
 * MechBot arena-titans path — NEW path (2026-06-10).
 *
 * Mech-GLADIATOR spectacle — battle-scarred combat-mechs dueling in a colossal
 * roaring arena under blazing spotlights, packed crowds, theatrical melee weapons.
 * Single-combat SPECTACLE. Distinct from titan-war-machines (battlefield) and
 * power-armor-infantry (squad combat) — this is the stadium, the crowd, the show.
 * Real Steel / Pacific Rim / gladiator-Colosseum / BattleBots-titan.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_ARENA_TITANS):
 *   FIGURE:
 *   - gladiator    HERO — a DIFFERENT gladiator-mech archetype per render
 *   - arsenal      the SIGNATURE money-shot (the gladiatorial weapon, mid-swing)
 *   ENVIRONMENT:
 *   - arena        the colossal combat stadium WITH its own lighting + crowd
 *   - look         rendering register (leads CLIP — anti-homogenize)
 *   - composition  framing (full mech + the roaring arena, spectacle)
 *   - drama        40%-gated combat beat (finishing blow / clash / crowd erupting)
 *
 * universal: [] — the bot's LIGHTING/ATMOSPHERES pools are space-coded and would
 * fight a floodlit stadium; the arena + look carry the light. promptPrefixByPath
 * is EMPTY (wrapper-strip). Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_ARENA_TITANS',
  pools: {
    gladiator: 'ARENA_GLADIATOR',
    arsenal: 'ARENA_ARSENAL',
    arena: 'ARENA_SETTING',
    look: 'ARENA_LOOK',
    composition: 'ARENA_COMPOSITION',
    drama: 'ARENA_DRAMA', // 40%-gated conditional layer (combat beat)
  },
};
