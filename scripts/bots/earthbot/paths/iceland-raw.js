/**
 * EarthBot iceland-raw — Iceland's unique raw geology (2026-05-23 scaffold).
 *
 * Geothermal vents + Strokkur geysers, glacier tongues (Vatnajökull,
 * Sólheimajökull), black-sand beaches (Reynisfjara), basalt columns
 * (Reynisdrangar, Stuðlagil), ice caves, moss-on-lava fields, waterfalls
 * (Skógafoss, Gullfoss, Seljalandsfoss), Diamond Beach iceberg shards.
 * NO humans, NO buildings, NO sheep-with-fence.
 * Phenomena: real Earth only (aurora ALLOWED here since Iceland is one
 * of the few paths where it's actually a real-Earth phenomenon — but
 * grounded photographic register, NOT fantasy-cosmic). Fog inversions,
 * volcanic vapor, ice-cave light shafts, snow squall. NO sci-fi / portal.
 */
module.exports = {
  archetype: 'EARTHBOT_ICELAND_RAW',
  pools: {
    subject: 'ICELAND_RAW_SUBJECT',
    foreground_anchor: 'ICELAND_RAW_FOREGROUND_ANCHOR',
    light_condition: 'ICELAND_RAW_LIGHT_CONDITION',
    atmosphere: 'ICELAND_RAW_ATMOSPHERE',
    sky_layer: 'ICELAND_RAW_SKY_LAYER',
    scale_prover: 'ICELAND_RAW_SCALE_PROVER',
    phenomenon: 'ICELAND_RAW_PHENOMENON',
  },
};
