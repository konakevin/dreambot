/**
 * StarBot ship-graveyard path (2026-06-10, NEW). A vast fleet-scale boneyard
 * of dead warships drifting from a battle long over, a lone explorer threading
 * the hulls. Melancholy, vast. Scene-led. Bot default starbot_hyperreal medium.
 * MVP-25 pools — seed-test-then-scale.
 */
module.exports = {
  archetype: 'SHIP_GRAVEYARD',
  pools: {
    graveyard_setting: 'SHIP_GRAVEYARD_SETTING',
    wreck_detail: 'SHIP_GRAVEYARD_WRECK',
    graveyard_scale: 'SHIP_GRAVEYARD_SCALE',
    explorer_craft: 'SHIP_GRAVEYARD_EXPLORER',
    cosmic_setting: 'SHIP_GRAVEYARD_COSMIC',
    eerie_detail: 'SHIP_GRAVEYARD_EERIE', // 40% gate
  },
};
