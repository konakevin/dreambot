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

  OCEANBOT_PIRATES: {
    description:
      'Pirates-of-the-Caribbean cinema — Golden Age of Piracy (1650-1730). Pirate galleons under full sail, harbor towns lantern-lit at dusk, hidden tropical coves, boarding actions, gun-deck shadow. EXCEPTION to OceanBot’s no-people convention — pirates ARE visible subjects. The setting still does as much visual lifting as the figures. Even leaner than shipwreck/lost-cities — the pirate_scene hero pool encodes setting + characters + action + atmosphere in one entry, so the supporting axes can do less.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      // 2-slot path layer (hero + composition) — see archetypes.js header
      // for axis-count calibration. Pirates hero is the richest pool in
      // the bot (legacy 18-22 word entries doing 4 jobs at once); 2 path
      // slots is the right count here.
      path: ['pirate_scene', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_GHOST_SHIP: {
    description:
      'Derelict pre-1850 wooden sailing vessels drifting through fog — Flying Dutchman energy. Tattered sails, barnacle-crusted hulls, phantom silhouettes on the horizon, lanterns swinging on empty decks. Eerie, beautiful, haunted. NO CREW visible — the ships are alone. Same lean 2-path-slot shape as pirates: the ghost_ship hero entry encodes vessel + state + spectral atmosphere in one phrase.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      // 2 path slots — hero + composition. ghost_ship hero entries are
      // dense like pirates (vessel + state + atmospheric/spectral all in
      // one), so supporting axes can do less. NO_PEOPLE returns here
      // (pirates is the only OceanBot exception).
      path: ['ghost_ship', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_POLAR_SEAS: {
    description:
      'Arctic / Antarctic ocean — towering icebergs with impossible blue interiors, pack ice and frozen seas, polar wildlife (narwhal / beluga / orca / humpback / penguin / polar bear at ice edge / seal / walrus haul-out), aurora over still polar water. Eerie blue silence of the far north or far south. Naturalistic register. NO ships, NO people. Same lean 2-path-slot shape.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['polar_scene', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_REEF_PARADISE: {
    description:
      'Tropical shallow-water coral reef teeming with marine life — maximum abundance, sun-lit. Counterpoint to deep-wonder (abyssal dark) — this is razor-sharp sun-shafted clarity with reef-builders + reef-dwellers all in frame. Naturalistic NatGeo / BBC Blue Planet reef register. No ships, no people, no diving gear. Same lean 2-path-slot shape.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['reef_scene', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_WHALE_ENCOUNTER: {
    description:
      'NatGeo whale-documentary register — cetaceans as wonders of the natural world. Humpback breach, blue-whale glide, orca pod hunting, sperm whale sounding, gray whale with calf, beluga arctic dance, narwhal, fin whale, right whale, bowhead. Naturalistic register (NOT myth — kraken-leviathan path is for myth). No ships, no people, no diving gear. Same lean 2-path-slot shape.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['whale_encounter', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_DEEP_WONDER: {
    description:
      'Bioluminescent beauty, alien elegance, deep-sea wonder — the BEAUTIFUL side of the deep ocean. Jellyfish trailing light, elegant siphonophores, glowing plankton clouds, translucent creatures with inner light, anglerfish lures, lantern-fish constellations. Beauty in the darkness, NOT horror. No ships, no people. First of 5 scenic-OceanBot paths; same lean 2-path-slot shape as the naval-lore set.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['deep_wonder', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OCEANBOT_KRAKEN_LEVIATHAN: {
    description:
      'Sea monsters attacking pre-1850 wooden ships — maritime myth made vivid. ONLY 4 creatures: kraken, giant squid, giant octopus, leviathan-whale. Embodiment rule (whole-beast visible, never disembodied tentacles). The hardest hero pool of the bot — kraken_scene entries must encode specific creature + embodiment + specific wooden ship + attack moment + atmospheric register. Same lean 4-axis shape as pirates / ghost-ship.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      // 2 path slots — hero + composition. The hero pool carries the
      // creature + ship + attack moment in one phrase; supporting axes
      // set lighting + atmospheric mood. Reuses PRE_1850_VESSEL_BLOCK
      // from shared-blocks (same era constraint as shipwreck / ghost-
      // ship) PLUS the kraken-specific KRAKEN_CREATURE_BLOCK that locks
      // the 4-creature whitelist and the embodiment rule.
      path: ['kraken_scene', 'camera_framing'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
