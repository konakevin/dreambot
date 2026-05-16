/**
 * SteamBot airship-skies — declarative composer form.
 *
 * Migrated 2026-05-15 to canonical scene-path shape. MOVIE-POSTER airship
 * scenes — dirigibles, sky-galleons, packet-ships in vertigo-inducing
 * dramatic-sky moments. Mortal-Engines / Treasure-Planet / Howl's-Moving-
 * Castle / Last-Exile / Atlantis-lost-empire visual lineage.
 *
 * 5-axis split: 3 path-bespoke (scene / sky_layer / surprise_element) + 1
 * conditional 70%-gated (phenomenon) + 2 universal (lighting / atmosphere).
 *
 * Pre-rewrite preserved at paths/legacy/airship-skies.js.
 */

module.exports = {
  archetype: 'STEAMBOT_AIRSHIP_SKIES',
  pools: {
    scene: 'AIRSHIP_SCENES',
    sky_layer: 'AIRSHIP_SKY_LAYER',
    surprise_element: 'AIRSHIP_SURPRISE_ELEMENT',
    phenomenon: 'AIRSHIP_PHENOMENON',
  },
};
