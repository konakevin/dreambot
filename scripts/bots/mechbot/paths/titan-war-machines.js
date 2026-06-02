/**
 * MechBot titan-war-machines path — declarative form (2026-05-15).
 *
 * KEEPS legacy DNA: kilometer-scale combat machines, biblical scale as
 * the subject, tiny humans/vehicles for scale reference, wide cinematic
 * establishing shots, Pacific Rim / 40K Imperator / AT-AT / Attack on
 * Titan colossus lineage. Pure spectacle, mid-engagement.
 *
 * SHARPENS three things the legacy didn't quite nail:
 *   - Vertigo angles (path-bespoke composition pool, not just "wide shot")
 *   - Path-bespoke lighting (overrides cosmic-coded bot default LIGHTING)
 *   - 40%-gated combat drama (orbital-strike beams / EMP-bursts /
 *     artillery flashes / sonic-boom shockwaves / kaiju-footfall pressure-waves)
 *
 * REUSES legacy production-grade pools (200 each):
 *   - subject:   TITAN_WAR_SUBJECTS
 *   - action:    TITAN_WAR_ACTIONS
 *   - landscape: TITAN_WAR_SETTINGS
 *
 * Pre-migration function-form brief preserved at paths/legacy/titan-war-machines.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_TITAN_WAR slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_TITAN_WAR brief template)
 *   - scripts/bots/mechbot/index.js      (defaultPools + dispatcher wiring)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (architecture decision record)
 */

module.exports = {
  archetype: 'MECHBOT_TITAN_WAR',
  pools: {
    subject: 'TITAN_WAR_SUBJECTS',
    action: 'TITAN_WAR_ACTIONS',
    landscape: 'TITAN_WAR_SETTINGS',
    // Path-overrides:
    lighting: 'TITAN_WAR_LIGHTING', // ground-based combat (overrides cosmic bot default)
    composition: 'TITAN_WAR_COMPOSITION', // vertigo-inducing camera angles
    drama: 'TITAN_WAR_DRAMA', // 40% gated combat phenomenon
  },
};
