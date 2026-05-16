/**
 * SteamBot steam-transport — declarative composer form.
 *
 * Migrated 2026-05-15 to canonical vehicle-vs-terrain shape. Non-airship
 * Victorian-industrial vehicles (locomotives / submarines / walking-machines
 * / paddleboats / steam-carriages / mine-cages / clockwork-creatures-as-
 * transport) conquering DRAMATIC TERRAIN. The machine and the landscape
 * create the drama together — never a vehicle on flat boring track.
 *
 * 5-axis split: 3 path-bespoke (transport / terrain_drama / surprise_element)
 * + 1 conditional 50%-gated (phenomenon) + 2 universal (lighting /
 * atmosphere). Reuses production-scale 200-entry TRANSPORT_SCENES pool.
 *
 * Pre-rewrite preserved at paths/legacy/steam-transport.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAM_TRANSPORT',
  pools: {
    transport: 'TRANSPORT_SCENES',
    terrain_drama: 'STEAMPUNK_TRANSPORT_TERRAIN_DRAMA',
    surprise_element: 'STEAMPUNK_TRANSPORT_SURPRISE',
    phenomenon: 'STEAMPUNK_TRANSPORT_PHENOMENON',
  },
};
