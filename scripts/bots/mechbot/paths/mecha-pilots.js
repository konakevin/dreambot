/**
 * MechBot mecha-pilots path — declarative form (2026-05-16).
 *
 * Third MechBot path on the declarative composer (after titan-war-machines
 * and mech-skyships). Reuses production-grade legacy 200-entry
 * subject/action/setting pools. Adds 3 path-bespoke pools:
 *   - composition: PILOT+MECH scale-relationship angles (climbing-up-leg,
 *     in-cockpit-palm, on-shoulder, gantry-catwalk, pilot-walking-toward,
 *     hangar-deep-wide, etc.) — the scale gap IS the punchline
 *   - lighting: hangar / launch-silo / dawn-deployment / industrial
 *     (overrides cosmic-coded bot default LIGHTING)
 *   - drama: 40%-gated mecha-context phenomena (emergency strobes,
 *     pre-launch sequence, hangar-doors opening, weapon-charge cycle, etc.)
 *
 * Identity preserved from legacy verbatim:
 *   - PILOT VISIBLE & TINY (dwarfed by the machine — scale ruler)
 *   - PILOT BIOLOGY = anything goes (human/cyborg/alien/android/hybrid)
 *   - PILOT mid-motion (climbing / boarding / repairing / deploying)
 *   - Scene NOT active battlefield (that's titan-war territory)
 *
 * Pre-migration function-form brief preserved at paths/legacy/mecha-pilots.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_MECHA_PILOTS slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_MECHA_PILOTS brief template)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (vertigo-composition pattern reference)
 */

module.exports = {
  archetype: 'MECHBOT_MECHA_PILOTS',
  pools: {
    subject: 'MECHA_PILOT_SUBJECTS',
    action: 'MECHA_PILOT_ACTIONS',
    landscape: 'MECHA_PILOT_SETTINGS',
    lighting: 'MECHA_PILOTS_LIGHTING',
    composition: 'MECHA_PILOTS_COMPOSITION',
    drama: 'MECHA_PILOTS_DRAMA', // 40% gated conditional
  },
};
