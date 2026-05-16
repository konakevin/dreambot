/**
 * MechBot mech-skyships path — declarative form (2026-05-15).
 *
 * Second MechBot path on the declarative composer (after titan-war-machines).
 * Same architectural pattern: reuse production-grade legacy 200-entry
 * subject/action/setting pools, add path-bespoke vertigo-composition +
 * combat-lighting + 40%-gated drama pools.
 *
 * KEEPS legacy DNA verbatim:
 *   - Predatory sci-fi DNA (asymmetric blade silhouettes, fang prows,
 *     spike rams, glowing power conduits, NOT box-shaped warships)
 *   - "NO modern military references" ban (no aircraft carrier /
 *     dreadnought / battleship / jet / helicopter — these pull literal
 *     Earth-military into the render)
 *   - "TURNED UP TO 11" multi-layer atmospheric mandate (multi-altitude
 *     clouds + volumetric god-rays + color-gradient sky + weather + scale)
 *   - Multi-distance ship staging (hero in foreground, fleet specks at
 *     vanishing point)
 *
 * Path-bespoke pools (6 axes):
 *   - subject:     MECH_SKYSHIPS_SUBJECTS    (legacy 200-entry pool, REUSED)
 *   - action:      MECH_SKYSHIPS_ACTIONS     (legacy 200-entry pool, REUSED)
 *   - landscape:   MECH_SKYSHIPS_SETTINGS    (legacy 200-entry pool, REUSED)
 *   - lighting:    MECH_SKYSHIPS_LIGHTING    (NEW path-bespoke aerial lighting)
 *   - composition: MECH_SKYSHIPS_COMPOSITION (NEW sky-vertigo angles)
 *   - drama:       MECH_SKYSHIPS_DRAMA       (NEW 40%-gated sky-combat phenomena)
 *
 * Pre-migration function-form brief preserved at paths/legacy/mech-skyships.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_SKYSHIPS slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_SKYSHIPS brief template)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (vertigo-composition pattern from titan-war)
 */

module.exports = {
  archetype: 'MECHBOT_SKYSHIPS',
  pools: {
    subject: 'MECH_SKYSHIPS_SUBJECTS',
    action: 'MECH_SKYSHIPS_ACTIONS',
    landscape: 'MECH_SKYSHIPS_SETTINGS',
    lighting: 'MECH_SKYSHIPS_LIGHTING',
    composition: 'MECH_SKYSHIPS_COMPOSITION',
    engagement: 'MECH_SKYSHIPS_ENGAGEMENT', // ALWAYS-ON multi-actor combat scene
    drama: 'MECH_SKYSHIPS_DRAMA', // 40% gated conditional
  },
};
