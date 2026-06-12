/**
 * chibibot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  CHIBIBOT_HEARTWARMING_SCENE: {
    description: `PATH-BESPOKE — ChibiBot heartwarming-scene path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). The "OMG IT'S TOO CUTE. I CAN'T." cuddle moment — adorable creature(s) doing something heart-melting in a deliberately-chosen storybook setting under a deliberately-chosen time-of-day with deliberate weather and an optional environmental phenomenon. 10 axes: 3 universal (lighting + atmosphere + weather, via bot.defaultPools) + 5 path-bespoke (setting + time_of_day + creature_1 + activity + surprise_element) + 1 conditional creature_2 70%-gated + 1 template-gated phenomenon 60%.`,
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: ['creature_1', 'activity', 'setting', 'time_of_day', 'surprise_element', 'phenomenon'],
    },
    pickN: {},
    conditionalLayer: { slot: 'creature_2', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_BATH_TIME: {
    description:
      'PATH-BESPOKE — ChibiBot bath-time path (2026-06-05 lean 7-axis rebuild — the previous 11-axis stack pushed the bath vessel out of frame in favor of spectacle locations, phenomena, sensory amplifiers, and stacked mandates; the 6-axis R4 cleared the bath as hero but renders felt generic. R5 adds signature_detail for per-render flavor.). 7 axes: creature_1 (always) + setting + lighting + set_decorations pickN:2 + signature_detail + conditional creature_2/creature_3 60%-gated (template includes creature_3 25% of the times creature_2 fires → ~40% solo / 45% pair / 15% trio).',
    slots: {
      universal: [],
      bot: [],
      path: ['creature_1', 'setting', 'lighting', 'set_decorations', 'signature_detail'],
    },
    pickN: { set_decorations: 2 },
    // Multi-pool conditional: rolls creature_2 + creature_3 together at 60%.
    // The template uses Math.random() < 0.25 to decide whether the rolled
    // creature_3 actually appears in the brief — yielding ~15% trio overall.
    conditionalLayer: {
      gate: 0.6,
      pools: {
        creature_2: { name: 'CUTE_CREATURES_UNIFIED' },
        creature_3: { name: 'CUTE_CREATURES_UNIFIED' },
      },
    },
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_CUDDLY_AQUATIC: {
    description:
      "PATH-BESPOKE — ChibiBot cuddly-aquatic path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). Pair of adorable cuddly baby aquatic creatures in underwater / surface-water habitats — sea otter pups holding paws, axolotl tea-room scenes, baby seals on ice, jellyfish blanket octopuses. Pixar/Sanrio/Ghibli/Finding-Nemo cuteness. UNLIKE other ChibiBot paths, creature_2 is ALWAYS-ON (no 70% gate) — this path's identity IS the cuddling pair. 10 axes: 3 universal (lighting + atmosphere + weather, via bot.defaultPools) + 6 path-bespoke (creature_1 + creature_2 + interaction + setting + time_of_day + surprise_element + phenomenon) + 1 template-gated phenomenon 60%.",
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature_1',
        'creature_2',
        'interaction',
        'setting',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_NIGHT_MEADOW: {
    description:
      'PATH-BESPOKE — ChibiBot night-meadow path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). Pair of impossibly cute critters at twilight/night in a meadow/glade/forest-clearing under the stars. Stargazing fox kits, fireflies in mason jars, glow-worm tea parties, comet-watching bunnies, moonlit picnics. Pixar/Sanrio/Ghibli/Beatrix-Potter-twilight aesthetic. creature_2 is ALWAYS-ON — pair-bond identity. 11 axes: 3 universal (lighting + atmosphere + weather) + 8 path-bespoke (creature_1 + creature_2 + interaction + setting + time_of_night + prop pickN:2 + surprise_element + phenomenon) + 1 template-gated phenomenon 60%.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature_1',
        'creature_2',
        'interaction',
        'setting',
        'time_of_night',
        'prop',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { prop: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_COZY_LANDSCAPE: {
    description:
      'PATH-BESPOKE — ChibiBot cozy-landscape path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). SETTING-AS-HERO path: a magical miniature cozy world (mushroom village / acorn cottage / wildflower meadow / beach cove / market square / treehouse) is the hero; a SOLO tiny resident creature adds story without stealing focus. Pixar/Studio Ghibli/Beatrix Potter/tilt-shift cozy aesthetic. UNLIKE pair-bond paths, NO creature_2 — the resident is one creature, small in the frame. 11 axes: 3 universal (lighting + atmosphere + weather) + 7 path-bespoke (creature + resident_activity + world + world_detail pickN:3 + time_of_day + surprise_element + phenomenon). Template-gated phenomenon 60%. world_detail pickN:3 forces stacked architectural/nature details that make the cozy world feel lived-in.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'world',
        'world_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { world_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_RAINY_INTERIOR: {
    description:
      'PATH-BESPOKE — ChibiBot rainy-interior path (2026-05-19 full-bespoke axis-system migration per BOT_SCENE_QUALITY_PLAYBOOK). OUTDOOR RAINY-DAY path: creatures playing OUT IN the rain — splashing puddles, holding polka-dot umbrellas, mud-stomping in boots, racing paper boats, catching raindrops in cupped paws, picking wet flowers, sharing umbrellas under trees. Cottagecore wet-fun joy. Pixar storybook painterly register. UNLIKE pair-bond paths, NO creature_2. 10 axes: 3 universal (lighting + atmosphere + weather) + 7 path-bespoke (creature + resident_activity + setting + setting_detail pickN:3 + time_of_day + surprise_element + phenomenon). Template-gated phenomenon 60%. Pixar-medium locked. Two-pass-polish skipped.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature_group',
        'group_activity',
        'setting',
        'setting_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { setting_detail: 3, creature_group: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_RAINY_DAY_COZY: {
    description:
      'PATH-BESPOKE — ChibiBot rainy-day-cozy path (2026-05-19 full-bespoke migration). GROUP-OF-FRIENDS SHELTERED-FROM-RAIN cozy moments: 2-4 chibi friends huddled together in cozy outdoor shelters (mushroom caps / porches / under umbrellas / hollow logs / stone arches) during rain. Sister path to rainy-interior (which is friends OUT IN the rain playing actively); this one is friends SHELTERED warmly with rain visibly falling around the shelter. Warm-cozy shelter glow vs cool-blue-grey rainy world. Pixar-medium-locked. 10 axes: 3 universal + 7 path-bespoke (creature_group pickN:3 + huddle_activity + shelter + detail pickN:3 + time_of_day + surprise_element + phenomenon).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature_group',
        'huddle_activity',
        'shelter',
        'detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { detail: 3, creature_group: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_SLEEPY_NAPTIME: {
    description: `PATH-BESPOKE — ChibiBot sleepy-naptime path (2026-05-19 full-bespoke migration). SOLO creature dozing in an impossibly cozy nap-spot. Peak-cute sleeping moment. Mid-close framing with the creature as the focal hero. NOT a group path. The viewer melts and whispers "shhh don't wake it". 10 axes: 3 universal + 7 path-bespoke (creature + sleep_pose + nap_spot + detail pickN:3 + time_of_day + surprise_element + phenomenon).`,
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'sleep_pose',
        'nap_spot',
        'detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_COZY_INTERIOR: {
    description:
      'PATH-BESPOKE — ChibiBot cozy-interior path (2026-05-19 full-bespoke). SETTING-AS-HERO INDOOR cozy space, often a REAL-OBJECT-AS-HOME (chibi has moved into a teacup / music-box / matchbox / piano / kettle / pumpkin / etc.) — 60%, OR a purpose-built chibi-scale dwelling (mushroom-house / treehouse / hobbit-hole / chibi-cottage) — 40%. SOLO peripheral creature does a cozy-snuggle activity. Wide-shot interior establishing — room fills 75-85% of frame, creature 10-20% as a tiny visible anchor. Pixar painterly storybook register via chibibot_pixar medium lock. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'room',
        'room_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { room_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_OUTDOOR_ADVENTURE: {
    description:
      'PATH-BESPOKE — ChibiBot outdoor-adventure (2026-05-20 full-bespoke). CREATURE IN THE WILD/OPEN WORLD — pure wilderness scene with NO village/architecture. Forest / mountain / cave / canyon / river / cliff / lake / hill / desert / coastline / canyon / glacier / jungle-floor / etc. Creature mid-adventure-pose (climbing / wading / hiking / mid-leap / discovering / cresting-ridge). Studio Ghibli / Spirited-Away wilderness / Pokemon-overworld / Pixar-adventure painterly storybook. 10 axes: 3 universal + 7 path-bespoke (creature + adventure_activity + wilderness_setting + wilderness_detail pickN:3 + adventure_prop + time_of_day + surprise_element).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'adventure_activity',
        'wilderness_setting',
        'wilderness_detail',
        'adventure_prop',
        'time_of_day',
        'surprise_element',
      ],
    },
    pickN: { wilderness_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_CREATURE_PORTRAIT: {
    description:
      'PATH-BESPOKE — ChibiBot creature-portrait (2026-05-20 full-bespoke). SOLO CREATURE-AS-HERO tight portrait MAXED with cute outfit + visible accessory + 3 scattered set-decorations. Creature FILLS 60-80% of the frame, dreamy soft-bokeh background ~20-30%. Hyper-cute marshmallow proportions. 12 axes: 3 universal + 9 path-bespoke (creature + pose + expression + portrait_feature pickN:2 + outfit + accessory + set_decoration pickN:3 + background_mood + time_of_day).',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'pose',
        'expression',
        'portrait_feature',
        'outfit',
        'accessory',
        'set_decoration',
        'background_mood',
        'time_of_day',
      ],
    },
    pickN: { portrait_feature: 2, set_decoration: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_AQUATIC_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot aquatic-village path (2026-05-19 full-bespoke). SETTING-AS-HERO underwater/coastal village. Coral-tower villages, kelp-forest cottages, pearl-shell hamlets, submarine-ports, tidepool villages, sea-cave dwellings, floating lily-pad clusters, kraken-shell cottages, bioluminescent grottos, starfish-bridge towns, shipwreck-coral hamlets. Architecture + ocean atmosphere are hero; MARINE-tagged peripheral resident creature (+ ANY wildcard). Studio Ghibli / Ponyo / Atlantis / Finding-Nemo painterly storybook. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_COTTAGECORE_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot cottagecore-village path (2026-05-19 full-bespoke). SETTING-AS-HERO English-countryside / cottagecore village. Thatched-roof clusters, windmill villages, lavender-field cottages, apple-orchard hamlets, wisteria-tunnel villages, cobblestone lanes, canal-side cottages, bee-skep villages, mushroom-cottage clusters (Smurfs-style), fairy-glade hamlets, stone-bridge cottages. Architecture + cottagecore atmosphere are hero; LAND/FANTASY peripheral resident (+ ANY wildcard). Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_SUNNY_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot sunny-village path (2026-05-19 full-bespoke). SETTING-AS-HERO Mediterranean / sun-drenched village. Bougainvillea-clad cottages, Mediterranean white-cottages on cliffs, terracotta-roof clusters, cliff-side villages (Santorini), desert-oasis hamlets, sun-bleached pueblos, fishing-port cottages, orchard-grove villages, mosaic-tile villages, palm-fringed hamlets, Tuscan olive-grove villages. Architecture + golden-hour atmosphere are hero; LAND/BIRD peripheral resident (+ ANY wildcard). Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca / Spirited-Away. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_TWILIGHT_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot twilight-village path (2026-05-19 full-bespoke). SETTING-AS-HERO dusk/lantern/firefly-time village. Lantern-lane villages, firefly-meadow cottages, moonlit-bridge towns, dusk-window-glow clusters, paper-lantern-festival villages, Japanese-paper-lantern towns (Spirited-Away), nightingale-grove cottages, star-lit-spire villages, bioluminescent-garden clusters, glowworm-cave hamlets, moonflower-meadow villages. Architecture + twilight-magic atmosphere are hero; LAND/FANTASY peripheral resident (+ ANY wildcard). Studio Ghibli / Spirited-Away / Whisper-of-the-Heart / Howl-Moving-Castle / Tangled-lanterns. 10 axes.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_ARCTIC_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot arctic-village path (2026-05-19 full-bespoke). SETTING-AS-HERO village in a snow/ice/arctic biome. Snow-cottage rows, igloo clusters, log-cabin villages under aurora, gingerbread-snow-fortresses, polar-station hamlets, mountain-chalet clusters, hot-spring villages, fishing-villages on frozen lakes. Architecture + arctic atmosphere are the hero; ARCTIC-tagged peripheral resident creature (from unified pool + ANY wildcard) adds story. Studio Ghibli / Frozen / Arrietty-Borrowers / Polar-Express painterly storybook aesthetic. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHIBIBOT_JUNGLE_VILLAGE: {
    description:
      'PATH-BESPOKE — ChibiBot jungle-village path (2026-05-19 full-bespoke). SETTING-AS-HERO village in a jungle/rainforest. Treehouse villages, mushroom-house clearings, leaf-roof huts, vine-bridge connectors. Architecture + jungle atmosphere are the hero; SOLO peripheral resident creature (JUNGLE-tagged from unified pool) adds story. Studio Ghibli / Encanto / Princess-Mononoke / Avatar-Pandora-village aesthetic. 10 axes: 3 universal + 7 path-bespoke.',
    slots: {
      universal: ['lighting', 'atmosphere', 'weather'],
      bot: [],
      path: [
        'creature',
        'resident_activity',
        'village',
        'village_detail',
        'time_of_day',
        'surprise_element',
        'phenomenon',
      ],
    },
    pickN: { village_detail: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
