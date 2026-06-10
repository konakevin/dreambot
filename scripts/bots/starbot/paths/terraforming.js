/**
 * StarBot terraforming path (2026-06-10, NEW). A half-remade alien world being
 * born — atmosphere processors, domes, green creeping across red rock, a
 * storm-wall where new climate fights old. Hopeful, epic. Scene-led.
 * Bot default starbot_hyperreal medium. MVP-25 pools — seed-test-then-scale.
 */
module.exports = {
  archetype: 'TERRAFORMING',
  pools: {
    terraform_stage: 'TERRAFORMING_STAGE',
    terraform_tech: 'TERRAFORMING_TECH',
    climate_drama: 'TERRAFORMING_CLIMATE',
    settlement: 'TERRAFORMING_SETTLEMENT',
    world_backdrop: 'TERRAFORMING_BACKDROP',
    milestone_event: 'TERRAFORMING_MILESTONE', // 40% gate
  },
};
