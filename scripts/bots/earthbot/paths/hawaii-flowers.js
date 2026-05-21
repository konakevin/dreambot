/**
 * EarthBot hawaii-flowers path — declarative axis-system (2026-05-21 R3
 * architecture).
 *
 * R0/R1/R2 problems: tried to bake flowers INTO the subject pool —
 * R0 flower-dominant (no beach), R1 beach-locked but flowers dropped,
 * R2 superseded. R3 architecture pivot: flowers are a SEPARATE always-on
 * axis with their own pool (HAWAII_FLOWERS_ARRANGEMENTS — 200-entry
 * production-grade legacy pool copied from beach/tropical_flower_arrangements).
 * Subject pool is now BEACH-ONLY (ground-level POV, room for foreground
 * flowers to compose in front).
 *
 * New archetype EARTHBOT_HAWAII_FLOWERS (7 slots: subject + flowers +
 * lighting + atmosphere + hero_feature + sky_layer + phenomenon-30%-gated).
 * New template explicitly composes flowers as LARGE FOREGROUND with
 * beach behind.
 *
 * Legacy implementation preserved at paths/legacy/hawaii-flowers.js.
 */

module.exports = {
  archetype: 'EARTHBOT_HAWAII_FLOWERS',
  pools: {
    subject: 'HAWAII_FLOWERS_SUBJECT', // BESPOKE — beach-only, ground-level
    flowers: 'HAWAII_FLOWERS_ARRANGEMENTS', // REUSED — 200-entry legacy tropical flowers
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
