/**
 * SteamBot steampunk-curio — declarative composer form.
 *
 * Migrated 2026-05-15 to canonical object-as-hero shape. Single fantastical
 * Victorian-industrial artifact in museum-display / Sotheby's-catalog
 * framing. Cabinet-of-curiosities / Wunderkammer aesthetic. NO PRIMARY
 * HUMAN FIGURE — pure object portrait.
 *
 * 5-axis split: 3 path-bespoke (curio / display_register / ornate_flourish
 * pickN:3) + 2 universal (lighting / atmosphere). Reuses production-scale
 * 100-entry STEAMPUNK_CURIOS pool.
 *
 * Pre-rewrite preserved at paths/legacy/steampunk-curio.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_CURIO',
  pools: {
    curio: 'STEAMPUNK_ANIMATE_CURIOS',
    habitat: 'STEAMPUNK_CURIO_HABITAT',
    ornate_flourish: 'STEAMPUNK_CURIO_ORNATE_FLOURISH',
  },
};
