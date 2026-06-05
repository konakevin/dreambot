/**
 * OceanBot archetype slot definitions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Live archetypes:
 *   • OCEANBOT_SHIPWRECK_KINGDOM (pre-1850 wooden wrecks)
 *   • OCEANBOT_LOST_CITIES (sister naval-lore — sunken civilizations)
 *
 * Other 8 paths' archetypes ship after these are validated in production.
 *
 * AXIS-COUNT CALIBRATION (2026-06-04) — both archetypes use the SAME 5-slot
 * lean axis set, cut down from the original 10 path-slots + conditional drama.
 * The 11-axis structure produced busy / over-stuffed / occasionally-anachronistic
 * renders (lithograph-record-player on a pre-1850 wreck, 6 humans in one frame,
 * modern research submarines as scale-provers, brass astrolabes + jeweled
 * cutlasses + treasure chests all in one prompt). Sonnet was weaving 11 axis
 * contributions into a single 90-word Flux prompt — each axis only got 1-2
 * specific phrases and the scene became a jumble of competing detail with no
 * single hero. The 5-axis cut lets the wreck_class / ruin_class HERO get
 * ~15 words instead of ~8, and the 4 supporting axes (coral / marine_life /
 * caustic_light / camera_framing) each add tasteful atmosphere instead of
 * competing for the spotlight. Dropped axes: decay_state / crumble_state
 * (already encoded in the hero entries), water_clarity (atmosphere default
 * covers it), foreground_element (composition mandate prescribes inline),
 * scale_provers (the source of multi-human-foreground issues), surprise_element
 * (the source of anachronism injection), drama conditional (more noise).
 *
 * Apply this same lean count to future OceanBot paths and any other path
 * whose hero-entry pool is rich enough to carry the scene on its own.
 */

const SHARED_PATH_SLOTS_BASE = ['coral_growth', 'marine_life', 'caustic_light', 'camera_framing'];

module.exports = {
  OCEANBOT_SHIPWRECK_KINGDOM: {
    description:
      'Sunken wreck reclaimed by reef life — the wreck IS the reef. Pre-1850 wooden vessel as the hero anchor, marine life as the living frame, caustic submarine light setting the mood. NatGeo wreck-discovery register on photography medium; Pre-Raphaelite painted maritime tradition on canvas.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['wreck_class', ...SHARED_PATH_SLOTS_BASE],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_LOST_CITIES: {
    description:
      'Sunken civilization reclaimed by the sea — the ruin IS the reef. Hewn-stone monument as the hero anchor, marine life as the living frame, caustic submarine light setting the mood. Drowned-archaeology documentary register on photography medium; Pre-Raphaelite painted maritime tradition on canvas. Sister axis to shipwreck-kingdom — same underwater register, stone instead of wood.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['ruin_class', ...SHARED_PATH_SLOTS_BASE],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
