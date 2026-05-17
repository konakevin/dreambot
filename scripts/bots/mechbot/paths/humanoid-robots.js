/**
 * MechBot humanoid-robots path — declarative form (2026-05-17).
 *
 * Seventh MechBot path on the declarative composer. NEW path (not a
 * migration) — Kevin asked for a sister to robot-moment specifically
 * for COOL HUMANOID ROBOTS at human-scale (1.5-2.5m tall), polished
 * chassis with multi-iris compound-optic eye-arrays + multi-color
 * glowing joint-seams + atmospheric cinematic outdoor settings.
 *
 * Reference DNA calibrated from 10 reference images Kevin provided
 * 2026-05-17:
 *   - Polished chrome / titanium / brushed-metal chassis (NOT scrap-weld)
 *   - Multi-iris compound-optic heads (kaleidoscope rainbow eye-arrays)
 *   - Multi-color glowing joint-seams + chest-cores + shoulder-orbs
 *     (cyan + amber + magenta + emerald blend)
 *   - Allows feminine + masculine + androgynous + alien-form chassis
 *   - Lean atmospheric cinematic outdoor settings (waterfall / snow
 *     mountain / canyon / overgrown ruin / fire-glow wasteland) more
 *     than urban-corporate
 *   - Both contemplative-still AND mid-action poses welcome
 *
 * SISTER path to robot-moment (legacy, function-form, kept unchanged).
 * Robot-moment is more varied morphology (hexapod / hovering / etc.)
 * with full-body-50-85%-frame strict cinema. This path is bipedal
 * humanoid only at atmospheric scale.
 *
 * Pools (5 path-bespoke + 2 universal):
 *   - subject: humanoid robot DNA (multi-iris eyes, glowing joints,
 *     polished chassis, varied body-types)
 *   - action: contemplative or mid-action poses
 *   - landscape: atmospheric outdoor cinematic environments
 *   - composition: full-body humanoid robot camera angles
 *   - lighting: theatrical / atmospheric / mood-driven
 *   - drama: 40%-gated visual flourishes
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_HUMANOID_ROBOTS slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_HUMANOID_ROBOTS brief)
 */

module.exports = {
  archetype: 'MECHBOT_HUMANOID_ROBOTS',
  pools: {
    subject: 'HUMANOID_ROBOTS_SUBJECT',
    action: 'HUMANOID_ROBOTS_ACTION',
    landscape: 'HUMANOID_ROBOTS_LANDSCAPE',
    lighting: 'HUMANOID_ROBOTS_LIGHTING',
    composition: 'HUMANOID_ROBOTS_COMPOSITION',
    drama: 'HUMANOID_ROBOTS_DRAMA', // 40% gated conditional
  },
};
