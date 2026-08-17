/**
 * DinoBot storm-season — dinosaurs in DRAMATIC weather (Stage D2, SHADOW). Rain
 * sheeting off a tyrannosaur, lightning over a fleeing gathering, monsoon-flooded
 * fern-plains, dust-storm walls. Jurassic-Park-in-the-rain register. WET-WORLD
 * cranked; animals REACT (mid-flee / hunkered / drinking the flood), never posed;
 * grounded ban doubly enforced. storm_light REPLACES the universal lighting slot;
 * universal 'atmosphere' only. 0.8-gated peak_event.
 */

module.exports = {
  archetype: 'DINOBOT_STORM_SEASON',
  pools: {
    storm_scene: 'DINOBOT_STORM_SEASON_STORM_SCENE',
    weather_drama: 'DINOBOT_STORM_SEASON_WEATHER_DRAMA',
    storm_light: 'DINOBOT_STORM_SEASON_STORM_LIGHT',
    storm_biome: 'DINOBOT_STORM_SEASON_STORM_BIOME',
    surprise_element: 'DINOBOT_STORM_SEASON_SURPRISE_ELEMENT',
    peak_event: 'DINOBOT_STORM_SEASON_PEAK_EVENT',
  },
};
