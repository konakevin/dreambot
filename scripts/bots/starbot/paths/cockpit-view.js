/**
 * StarBot cockpit-view path (2026-06-10, NEW). First-person from inside a
 * cockpit/canopy — HUD on the glass, dash + hands in foreground, looking out
 * at space/a dogfight/docking. Bot default starbot_hyperreal medium.
 * MVP-25 pools — seed-test-then-scale.
 */
module.exports = {
  archetype: 'COCKPIT_VIEW',
  pools: {
    cockpit_type: 'COCKPIT_VIEW_COCKPIT',
    hud_overlay: 'COCKPIT_VIEW_HUD',
    view_beyond: 'COCKPIT_VIEW_BEYOND',
    cockpit_detail: 'COCKPIT_VIEW_DETAIL',
    alert_state: 'COCKPIT_VIEW_ALERT',
    combat_event: 'COCKPIT_VIEW_COMBAT', // 40% gate
  },
};
