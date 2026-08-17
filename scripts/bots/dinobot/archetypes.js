/**
 * dinobot archetypes — path-bespoke archetype definitions.
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
  DINOBOT_DINO_NIGHTS: {
    description:
      'PATH-BESPOKE — DinoBot dino-nights path (Stage D1, SHADOW). The NOCTURNAL Mesozoic — moonlit watering holes, hunts by starlight, pre-dawn mist, Milky Way over sauropod silhouettes. First NIGHT register on the bot. The DINOSAUR doing a candid nocturnal behavior is the HERO, REVEALED by moonlight (land stays visibly lit, never black-silhouette). night_light REPLACES the universal lighting slot (moonlight/starlight is the only light). Eyes catch light naturally, never glow-fantasy. 4 path axes (night_scene / night_light / night_biome / surprise_element) + 80%-gated night_phenomenon + universal atmosphere (NO universal lighting).',
    slots: {
      universal: ['atmosphere'],
      bot: [],
      path: ['night_scene', 'night_light', 'night_biome', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'night_phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_POLAR_DINOS: {
    description:
      'PATH-BESPOKE — DinoBot polar-dinos path (Stage D3, SHADOW). Real paleo-accuracy showcase — polar-latitude dinosaurs (Nanuqsaurus, Leaellynasaura, Edmontosaurus at high latitude), snow-dusted feathers/hide, aurora skies, ice-edge coasts, months-long dusk. ENTIRELY NEW cool palette (the bot is all-warm). SPECIES_ANCHOR load-bearing (obscure genera). Feathering = INSULATION, described POSITIVELY (the coat), never negated. Mesozoic-lock: never Arctic-today (no polar bears/seals/penguins, no modern spruce) — cold-hardy primordial flora. polar_light REPLACES the universal lighting slot; aurora allowed HERE only. 4 path axes (polar_scene / ice_feature / polar_light / surprise_element) + 80%-gated polar_phenomenon + universal atmosphere.',
    slots: {
      universal: ['atmosphere'],
      bot: [],
      path: ['polar_scene', 'ice_feature', 'polar_light', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'polar_phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_STORM_SEASON: {
    description:
      'PATH-BESPOKE — DinoBot storm-season path (Stage D2, SHADOW). Dinosaurs in DRAMATIC weather — rain sheeting off a tyrannosaur, lightning over a fleeing gathering, monsoon-flooded fern-plains, dust-storm walls. Jurassic-Park-in-the-rain register. WET-WORLD cranked; animals REACT to weather (mid-flee / hunkered / drinking the flood), never posed; grounded ban doubly enforced (wind+rain invite floaty poses); lightning = ONE physically-lit fork (never sci-fi); clouds soft/moist (cloud-vocab law). storm_light REPLACES the universal lighting slot. 5 path axes (storm_scene / weather_drama / storm_light / storm_biome / surprise_element) + 80%-gated peak_event + universal atmosphere (NO universal lighting).',
    slots: {
      universal: ['atmosphere'],
      bot: [],
      path: ['storm_scene', 'weather_drama', 'storm_light', 'storm_biome', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'peak_event', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_PALEO_LANDSCAPE: {
    description:
      'PATH-BESPOKE — DinoBot paleo-landscape path (2026-05-17 axis-system migration from legacy function-form). PURE PREHISTORIC LANDSCAPE — Mesozoic / Jurassic / Cretaceous IMAX-scale ancient world vistas. NO dinosaurs as primary subject (only tiny distant silhouettes via surprise_element). The PRIMORDIAL WORLD itself is the hero — mega-flora, alien Earth, lush, alive. Avatar Pandora × Skull Island × Land-of-the-Lost overgrown jungle cinematics. Reuses PREHISTORIC_SETTINGS (200) as biome. 5 path-bespoke axes (biome / megaflora / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'megaflora', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_SWAMP_RIVER: {
    description:
      'PATH-BESPOKE — DinoBot swamp-river path (2026-05-17 axis-system migration from legacy function-form). MESOZOIC SWAMP / RIVER / WATERWAY with a SEMI-AQUATIC DINOSAUR interacting with the water. Spinosaur fishing / sauropod wading / hadrosaur drinking / mosasaur breaching / crocodilian floating / pterosaur skimming. Water is the setting; dino is the candid focal subject (25-40% frame). NO humans. National-Geographic-cinematic candid moment. 3 path-bespoke axes (water_scene / dino / surprise) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['water_scene', 'dino', 'surprise'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_OCEAN_REPTILES: {
    description:
      'PATH-BESPOKE — DinoBot ocean-reptiles path (2026-05-17 axis-system migration from legacy function-form). STRICT MESOZOIC OPEN OCEAN with a MARINE REPTILE (mosasaur / plesiosaur / ichthyosaur / pliosaur / marine crocodile / Archelon sea-turtle / ammonite / marine pterosaur over ocean). Underwater scenes + mid-ocean breach + surface-break encouraged. NEVER river / swamp / lake. ONLY actual ocean dinosaurs (NO land dinos). 25-40% marine reptile + 55-65% ocean-scene (open water / underwater / breach / abyss / reef). 3 path-bespoke axes (ocean_scene / creature / surprise) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['ocean_scene', 'creature', 'surprise'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_NESTING_GROUND: {
    description:
      'PATH-BESPOKE — DinoBot nesting-ground path (2026-05-17 axis-system migration). MESOZOIC FAMILY-LIFE scenes — hatchlings tumbling, parents teaching juveniles, siblings play-fighting, families migrating, communal nurseries. The full spectrum of dinosaur family behavior (not just egg-sitting). Reuses NESTING_SCENES (200 fat-seed family-life scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for family-specific small accents. National-Geographic-cinematic tender prehistoric family moments. 3 path-bespoke axes (biome / family_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'family_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_HERD_MIGRATION: {
    description:
      'PATH-BESPOKE — DinoBot herd-migration path (2026-05-17 axis-system migration). COLOSSAL DINOSAUR HERDS crossing alien-Mesozoic landscapes. Hero foreground dinosaurs (35-55% frame) + massive 50-200 strong herd extending into vanishing-point haze. Silhouettes scream DINOSAUR (neck-S-curves, crests, frills, plate-rows, spike-tails) never wildebeest. Reuses HERD_SCENES (200 fat-seed herd scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for herd-specific small accents. BBC-Planet-Earth-meets-Prehistoric-Planet documentary cinematography. 3 path-bespoke axes (biome / herd_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'herd_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_TERRITORY_CLASH: {
    description:
      'PATH-BESPOKE — DinoBot territory-clash path (2026-05-17 axis-system migration). TWO DINOSAURS in dominance confrontation — horn-locks, threat-displays, head-butts, frill-vs-frill push, jaw-clamping, ground-shaking charges. Raw primal power without gore. Reuses CLASH_SCENES (200 fat-seed clash scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for clash-specific small accents (broken-fern-debris / blood-trickle / panicked-bystander / dust-rising / etc.). BBC-Planet-Earth + Prehistoric-Planet documentary tension cinematography. 3 path-bespoke axes (biome / clash_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'clash_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_CINEMATIC_SILHOUETTE: {
    description:
      'PATH-BESPOKE — DinoBot cinematic-silhouette path (2026-05-17 axis-system migration). DINOSAURS as dramatic dark silhouettes against breathtaking prehistoric skies — sunrise / sunset / moonrise / lightning-storm / meteor-shower / aurora. The SHAPE of the animal is the subject. Iconic poster-worthy compositions. Reuses SILHOUETTE_SCENES (200 fat-seed silhouette scenes) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for silhouette-specific small accents (pterosaur silhouette / sun-disk-positioning / moon-phase / etc.). Fine-art wildlife-photography cinematography. 3 path-bespoke axes (biome / silhouette_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'silhouette_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_COZY: {
    description:
      'PATH-BESPOKE — DinoBot dino-cozy path (2026-05-17 axis-system migration). TENDER DINOSAUR VIGNETTES — nesting / grooming / sleeping / nursing / playing / nuzzling-hatchlings / parent-and-juvenile-intimacy. The warm peaceful side of prehistoric life. Wildlife-documentary cozy-moment cinematography. Reuses DINO_SPECIES (200 dinosaur species) + COZY_DINO_ACTIONS (200 fat-seed cozy actions) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for cozy-specific small accents (hatchlings nearby / soft-light-detail / nest-debris / etc.). 4 path-bespoke axes (biome / species / cozy_action / surprise_element) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'cozy_action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_PACK: {
    description:
      'PATH-BESPOKE — DinoBot dino-pack path (2026-05-17 axis-system migration). MULTI-DINOSAUR group behaviors — pack-hunting / waterhole-gathering / river-crossing / nesting-colony / migration-cluster / defensive-formation. Same-species groups of dozens-to-hundreds. Wildlife-documentary group-life cinematography. Reuses DINO_SPECIES (200 dinosaur species) + PACK_DINO_ACTIONS (200 fat-seed group behaviors) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for pack-specific small accents (lookout-sentinel / scattered-prey-bones / pack-leader-pose / etc.). 4 path-bespoke axes (biome / species / pack_action / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'pack_action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_AERIAL_PERSPECTIVES: {
    description:
      'PATH-BESPOKE — DinoBot aerial-perspectives path (2026-05-17 axis-system migration). FLYING PTEROSAURS in their element OR sky-altitude aerial-camera views of ground dinosaurs. The frame is HIGH UP. Two modes: pterosaur-in-flight (70%) or bird-eye-view-of-ground-dinosaurs (30%). Wing-membrane anatomy fidelity per species. Reuses AERIAL_SUBJECTS (200 pterosaur subjects) + AERIAL_ACTIONS (200 flight behaviors) + AERIAL_SETTINGS (200 sky/aerial environments). Adds one new path-bespoke pool for aerial-specific small accents (companion-flock / sun-disk-positioning / cloud-bank / etc.). Paleo-cinematographer high-altitude framing. 4 path-bespoke axes (subject / action / setting / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'setting', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_PORTRAIT: {
    description:
      'PATH-BESPOKE — DinoBot dino-portrait path (2026-05-17 axis-system migration). SINGLE DINOSAUR hero telephoto wildlife portrait — the camera catches one specific dinosaur in a candid moment. Museum-grade paleoart detail. Single subject fills 50-70% of frame. Reuses DINO_SPECIES (200 dinosaur species) + DINO_VISUAL_CUES (200 atmospheric cues) + DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome). Adds one new path-bespoke pool for portrait-specific accents (breath-fog / feather-drift / dust-cloud / etc.). Paleo-art wildlife-photography telephoto cinematography. 4 path-bespoke axes (biome / species / visual_cue / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'visual_cue', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_DINO_ACTION: {
    description:
      'PATH-BESPOKE — DinoBot dino-action path (2026-05-17 axis-system migration). DYNAMIC PEAK-ACTION single dinosaur — frozen-frame predator hunts / charges / mid-strike / sudden-spring / fleeing-prey-mid-stride. BBC-cameraman-caught-the-moment energy. No gore. Reuses DINO_SPECIES (200) + DINO_ACTIONS (200 fat-seed peak-action verbs) + DINOBOT_PALEO_LANDSCAPE_BIOME (200). Adds new path-bespoke pool for action-specific small accents. 4 path-bespoke axes (biome / species / action / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DINOBOT_EXTINCTION_EVENT: {
    description:
      'PATH-BESPOKE — DinoBot extinction-event path (2026-05-17 axis-system migration). K-Pg APOCALYPTIC scenes — asteroid streak across sky / impact-aftermath firestorms / impact-winter darkness / last-dinosaurs-in-dying-world. Epic tragedy + beautiful devastation. The end of the Mesozoic era. Reuses DINO_SPECIES (200) + EXTINCTION_SCENES (200 fat-seed) + DINOBOT_PALEO_LANDSCAPE_BIOME (200). Adds new path-bespoke pool for extinction-specific accents (ash-fall, ember-streams, distant-impact-glow, etc.). 4 path-bespoke axes (biome / species / extinction_scene / surprise_element) + 80%-gated phenomenon + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'species', 'extinction_scene', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
