/**
 * MechBot hunter-killers path — NEW path (2026-06-09).
 *
 * PURE-MACHINE autonomous hunter-killer drones/units ON THE HUNT — no pilot, no
 * rider, no organic. The machine itself is the predator, sweeping dead cities and
 * wastelands, framed so the viewer feels like the prey in its sights. Terminator
 * HK / ED-209 / Boston-Dynamics-gone-rogue / Oblivion drone lineage. Sits in the
 * dark cinematic MechBot vibe.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_HUNTER_KILLERS):
 *   FIGURE:
 *   - unit            HERO — a DIFFERENT autonomous HK archetype per render
 *   - armament        the lethal weapon system
 *   - sensor          the SIGNATURE money-shot (the scan / targeting beam / locking optic)
 *   ENVIRONMENT:
 *   - hunting_ground  dark dystopian setting WITH its own lighting/mood baked in
 *   - look            rendering register (leads CLIP — anti-homogenize)
 *   - composition     framing (full-body, aimed at the viewer)
 *   - drama           40%-gated contact/kill beat (conditional layer)
 *
 * universal: [] — the bot's LIGHTING/ATMOSPHERES pools are space-coded (StarBot
 * heritage) and would fight a grounded dead-city scene; the hunting_ground + look
 * carry the light instead. NO unit-type enumeration in any prefix (first-named-noun
 * lock) — the HERO pool carries the archetype. promptPrefixByPath is EMPTY
 * (wrapper-strip). Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_HUNTER_KILLERS',
  pools: {
    unit: 'HK_UNIT',
    armament: 'HK_ARMAMENT',
    sensor: 'HK_SENSOR',
    hunting_ground: 'HK_HUNTING_GROUND',
    look: 'HK_LOOK',
    composition: 'HK_COMPOSITION',
    drama: 'HK_DRAMA', // 40%-gated conditional layer (contact/kill)
  },
};
