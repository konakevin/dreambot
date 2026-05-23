/**
 * EarthBot european-wilderness — British Isles + Alpine + Scandinavian raw
 * nature (2026-05-23 scaffold).
 *
 * British Isles: Scottish Highlands (Glen Coe, Quiraing, Old Man of Storr),
 * Welsh Snowdonia, Irish Cliffs of Moher + Connemara, Lake District.
 * Alpine European: Dolomites, Matterhorn, Slovenian Julian Alps, Bavarian
 * Alps + Königssee, Polish Tatras, French Vanoise.
 * Scandinavian fjords / Faroe Islands (overlap-aware with existing
 * Scandinavian coverage — scope to fjord-coast specifically).
 * NO humans, NO sheep-with-fence, NO villages, NO castles, NO standing
 * stones (megalithic culture — adjacent civilization).
 * Phenomena: real Earth only (sea of clouds, alpenglow, mist drift, snow
 * squall, lenticular over peaks). NO aurora drift / fantasy.
 */
module.exports = {
  archetype: 'EARTHBOT_EUROPEAN_WILDERNESS',
  pools: {
    subject: 'EUROPEAN_WILDERNESS_SUBJECT',
    foreground_anchor: 'EUROPEAN_WILDERNESS_FOREGROUND_ANCHOR',
    light_condition: 'EUROPEAN_WILDERNESS_LIGHT_CONDITION',
    atmosphere: 'EUROPEAN_WILDERNESS_ATMOSPHERE',
    sky_layer: 'EUROPEAN_WILDERNESS_SKY_LAYER',
    scale_prover: 'EUROPEAN_WILDERNESS_SCALE_PROVER',
    phenomenon: 'EUROPEAN_WILDERNESS_PHENOMENON',
  },
};
