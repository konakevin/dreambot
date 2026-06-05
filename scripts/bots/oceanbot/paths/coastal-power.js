/**
 * OceanBot coastal-power — axis-system declarative path.
 *
 * Mother-nature-at-full-power register. Heavy swells, wave-crashes
 * against shore (cliff faces, sea-stacks, jagged coastal rocks, reefs
 * at the breaker line, lighthouses engulfed in spray) AND shorebreak
 * (heavy waves curling onto sand — classic Clark Little register).
 * Epic moments of oceanic force colliding with stone or sand. Iconic
 * coasts (Big Sur / Cliffs of Moher / Cape Disappointment / Nazaré /
 * Cape Horn / Reynisfjara / Portland Head Light / Lands End / Iceland).
 *
 * 3 path-bespoke axes (scene + weather/sky + camera framing) — the
 * weather/sky axis gives the path atmospheric range (sunsets / storm
 * fronts / golden hour / dawn / aurora / rainbow-after-squall / etc.).
 *
 * NO SHIPS, NO PEOPLE, NO SURFERS — only the natural collision and
 * the empty shore architecture.
 *
 * Wires the OCEANBOT_COASTAL_POWER archetype slots to per-axis pool
 * names that resolve via bot.poolByName.
 */

module.exports = {
  archetype: 'OCEANBOT_COASTAL_POWER',
  pools: {
    coastal_power_scene: 'COASTAL_POWER_SCENES',
    weather_and_sky: 'COASTAL_POWER_WEATHER_AND_SKY',
    camera_framing: 'COASTAL_POWER_CAMERA_FRAMING',
  },
};
