/**
 * StarBot space-opera path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/space-opera.js
 * for 30 days as a rollback reference.
 *
 * Architecture: SPACE_OPERA archetype — sci-fi spaceship as hero at
 * MEDIUM/LARGE anchor scale. Path-bespoke ship/setting/action slim
 * pools. Conditional WIDE-ACTION mode (50% gate) fires two sub-pools
 * together — BUSY_FLEET_ELEMENTS (traffic, 3 picks) + BATTLE_DYNAMICS
 * (battle moments, 3 picks). When off: close-up hero ship mode.
 *
 * Brief mandate: ONE flowing comma-separated dense enumeration with
 * specific counts/colors/scales on every axis element. NOT bullet-list
 * sections. Reference density example built into the template.
 *
 * See:
 *   - scripts/lib/archetypes.js          (SPACE_OPERA slot definitions)
 *   - scripts/lib/archetype-templates.js (SPACE_OPERA brief template)
 *   - scripts/lib/brief-composer.js      (multi-pool conditional layer)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'SPACE_OPERA',
  pools: {
    ship: 'SPACE_OPERA_SHIPS', // primary anchor entity (slim)
    setting: 'SPACE_OPERA_SETTING', // cosmic environment (slim)
    ship_action: 'SHIP_ACTION', // posture/state/motion (slim)
    // NEW path-bespoke axes (2026-05-31 enrichment to premium tier):
    crew_signal: 'SPACE_OPERA_CREW_SIGNAL', // life ON the ship (bridge silhouettes / EVA / deck crew)
    faction_iconography: 'SPACE_OPERA_FACTION_ICONOGRAPHY', // markings/badges/colors of allegiance
    propulsion_signature: 'SPACE_OPERA_PROPULSION_SIGNATURE', // engine/drive aesthetic + exhaust
    genre_register: 'SPACE_OPERA_GENRE_REGISTER', // narrative tone (military thriller / pirate / first contact / etc)
    signature_hull_feature: 'SPACE_OPERA_SIGNATURE_HULL_FEATURE', // the one weird memorable hull detail
    // WIDE-ACTION conditional (50% gate): two sub-pools fire together
    traffic: 'BUSY_FLEET_ELEMENTS', // 3 picks when fired
    battle: 'BATTLE_DYNAMICS', // 3 picks when fired
  },
};
