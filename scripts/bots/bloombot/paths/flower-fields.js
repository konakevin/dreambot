/**
 * BloomBot flower-fields — the cultivated mega-field (Stage A2). Tulip stripes,
 * lavender rows, sunflower seas, poppy hills. GEOMETRY is the differentiator vs
 * the wild landscape carpet. Rides the default LUSH_HERO_MANDATE (edge-to-edge
 * field). No humans/tractors/greenhouses/windmills/barns; vanishing-point
 * compositions get the no-lone-figure ban.
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_FIELDS',
  pools: {
    field_geometry: 'BLOOMBOT_FLOWER_FIELDS_GEOMETRY',
    crop_bloom: 'BLOOMBOT_FLOWER_FIELDS_CROP_BLOOM',
    vantage: 'BLOOMBOT_FLOWER_FIELDS_VANTAGE',
    field_backdrop: 'BLOOMBOT_FLOWER_FIELDS_BACKDROP',
    field_event: 'BLOOMBOT_FLOWER_FIELDS_EVENT',
  },
};
