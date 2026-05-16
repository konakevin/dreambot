/**
 * SteamBot steampunk-spectacle — declarative composer form.
 *
 * Migrated 2026-05-15 to canonical event-as-subject shape. Grand Victorian-
 * industrial events / ceremonies / festivals / performances / uprisings.
 * CROWD-DRIVEN scenes — tiny figures against massive machinery, packed
 * balconies, sea of top-hats and goggles. THE EVENT is the subject.
 *
 * 5-axis split: 3 path-bespoke (event / crowd_detail / surprise_element)
 * + 1 conditional 40%-gated (escalation) + 2 universal (lighting /
 * atmosphere). Reuses production-scale 199-entry SPECTACLE_EVENTS pool.
 *
 * Pre-rewrite preserved at paths/legacy/steampunk-spectacle.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_SPECTACLE',
  pools: {
    event: 'SPECTACLE_EVENTS',
    crowd_detail: 'STEAMPUNK_SPECTACLE_CROWD',
    surprise_element: 'STEAMPUNK_SPECTACLE_SURPRISE',
    escalation: 'STEAMPUNK_SPECTACLE_ESCALATION',
  },
};
