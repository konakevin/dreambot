/**
 * StarBot asteroid-mining path (2026-06-10, NEW). Gritty blue-collar
 * industrial sci-fi — a mining rig carving an asteroid, refineries, haulers,
 * floodlights, sparks. Scene-led. Bot default starbot_hyperreal medium.
 * MVP-25 pools — seed-test-then-scale.
 */
module.exports = {
  archetype: 'ASTEROID_MINING',
  pools: {
    mining_setting: 'ASTEROID_MINING_SETTING',
    industrial_detail: 'ASTEROID_MINING_DETAIL',
    mining_action: 'ASTEROID_MINING_ACTION',
    worker_presence: 'ASTEROID_MINING_WORKER',
    belt_setting: 'ASTEROID_MINING_BELT',
    hazard_event: 'ASTEROID_MINING_HAZARD', // 40% gate
  },
};
