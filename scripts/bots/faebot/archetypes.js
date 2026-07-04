/**
 * faebot archetypes — path-bespoke archetype definitions.
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
  FAEBOT_FOREST_FAIRY_SCENE: {
    description:
      'PATH-BESPOKE — FaeBot forest-fairy-scene (2026-05-20 axis-system migration). The canonical FaeBot path — ONE mythic forest creature (40-55% of frame, off-center, candid hidden-camera capture) wrapped in a deep wild forest. Painted-fantasy concept-art lineage (Manchess + Giancola + Bonner + Froud). Otherworldly mythic-creature beauty, NOT human-model beauty. NEVER posing, NEVER eye-contact. 10 axes (9 always-on + 1 gated companion): creature / forest_biome / lighting / weather / foreground_anchor / botanical_accent / candid_action / magical_flavor / scale_prover + companion (50%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'creature',
        'forest_biome',
        'lighting',
        'weather',
        'foreground_anchor',
        'botanical_accent',
        'candid_action',
        'magical_flavor',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FLOWER_FAIRY: {
    description:
      'PATH-BESPOKE — FaeBot flower-fairy (2026-05-20 axis-system migration). Sister to forest-fairy-scene. ONE flower-merged mythic fae creature (40-55% of frame, off-center, candid). DISTINCT DNA: creatures whose BODIES ARE FLOWERS (petal-skin / blossom-hair / petal-wings / petal-garment / pollen-glow). Sub-human scale — flowers can be her HOME. Color-coherent via matchTagsFromSlot: creature carries a palette tag (WARM/COOL/WHITE/MULTI), biome + botanical_accent filter to match. 10 axes (9 always-on + 1 gated companion): creature / flower_biome / lighting / weather / foreground_anchor / botanical_accent / candid_action / magical_flavor / scale_prover + companion (50%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'creature',
        'flower_biome',
        'lighting',
        'weather',
        'foreground_anchor',
        'botanical_accent',
        'candid_action',
        'magical_flavor',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // fairy-swarm — LARGE GATHERINGS of palm-sized fairies (2026-07-04, Kevin).
  // Purpose-built for crowds: AT LEAST SIX fairies per render, more as the
  // event dictates. The gathering_event (shared story beat) is the hero;
  // the ToyBot multi-figure recipe applies (verb-led event seeds + template
  // composition lock + plural prefix opener) or Flux collapses to one fairy.
  FAEBOT_FAIRY_SWARM: {
    description:
      'PATH-BESPOKE — FaeBot fairy-swarm (2026-07-04). Large gatherings (6-14) of palm-sized fairies at one tiny forest venue, mid-shared-story-event, with whole cute critter guests. Painterly-real Froud/Vess register, full faces/hair (kodama ban). 6 always axes (gathering_event + fae_troupe + gathering_spot + critter_guests + flora_detail ×2 + lighting reused from tiny-fae) + magical_flavor gated 0.5 (reused from tiny-fae). In twoPassPolish.skipPaths (polish strips the group-composition mandate) + nudityCheck paths + promptPrefixByPath plural anchor.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'gathering_event',
        'fae_troupe',
        'gathering_spot',
        'critter_guests',
        'flora_detail',
        'lighting',
      ],
    },
    pickN: { flora_detail: 2 },
    conditionalLayer: { slot: 'magical_flavor', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_TINY_FAE: {
    description:
      'PATH-BESPOKE — FaeBot tiny-fae (2026-05-21 axis-system migration). Palm-sized winged fae (3-8 inches tall) at MACRO perspective in the enchanted forest. THE PATH IDENTITY is the scale_anchor_companion — every render includes a normal-sized forest creature (fox / deer / fawn / robin / squirrel / hedgehog / owl / etc.) that DRAMATICALLY DWARFS her. Without this scale-proof, Flux defaults to regular-sized fairy. Painterly-real (Brian Froud + Charles Vess lineage). 10 axes (9 always-on + 1 gated botanical_accent). IMPORTANT: tiny-fae is in twoPassPolish.skipPaths because Haiku polish strips dwarfing language. Pool entries use strong dwarfing positions (perched on a single feature / under looming face / fits inside a paw).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'creature',
        'scale_anchor_companion',
        'macro_perch',
        'forest_micro_biome',
        'lighting',
        'weather',
        'fae_action',
        'magical_flavor',
        'foreground_anchor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'botanical_accent', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_DRYAD_PORTRAIT: {
    description:
      'PATH-BESPOKE — FaeBot dryad-portrait (2026-05-21 axis-system migration). TIGHT close-up portrait (face 35-60% of frame) of an adult-scale tree-bound dryad / hamadryad / naiad / meliae / moss-maiden (ALL FEMININE — male forest-elders live in the forest-elder path). Intimate STILLNESS register — face turned 3/4 or profile, eyes lowered, NEVER eye-contact. Painted-fantasy register (Manchess + Giancola + Bonner + Froud). 10 axes (9 always-on + 1 gated foreground_anchor): creature / expression_moment / gesture_pose / portrait_composition / adornment / forest_backdrop / lighting / weather / magical_flavor + foreground_anchor (40%-gated). Decomposed creature pool to features-only (no posture), with expression / gesture / adornment broken out as separate axes for ~10^9 combinations.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'creature',
        'expression_moment',
        'gesture_pose',
        'portrait_composition',
        'adornment',
        'forest_backdrop',
        'lighting',
        'weather',
        'magical_flavor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'foreground_anchor', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FOREST_ELDER: {
    description:
      'PATH-BESPOKE — FaeBot forest-elder (2026-06-11). The MASCULINE counterpart to dryad-portrait — an ANCIENT MALE woodland spirit (Leshy / Green-Man / horned forest-god / woodwose / bark-druid elder / antlered forest-king / mossy treant-elder / root-warden). HARD GENDER-LOCK: every figure is unmistakably MALE (he/his, a moss-beard, masculine brow) — built to house the male forest-spirit DNA that was causing "girl with a beard" androgyny inside the feminine dryad-portrait path. MIX framing (Kevin: "Both") — ~half intimate bust-portraits, ~half fuller forest-scenes of the elder in his domain, driven by the framing axis. Painted-fantasy register (Manchess + Giancola + Bonner + Froud + Frazetta). ALL pools bespoke-male EXCEPT lighting (reuses genderless dryad time-of-day set). STORYTELLING register (2026-06-11): the story_beat axis (verb-led narrative moment with woodland-creature participants + stakes) replaced the small-bore gesture_pose axis, and the template was un-locked from "intimate stillness" to a front-loaded CAPTURED STORY MOMENT — the elder mid-act (healing a bird, raising a fallen tree, sheltering fawns from rain). 10 axes (9 always-on + 1 gated foreground_anchor): creature / expression_moment / story_beat / framing / domain / adornment / lighting / weather / magical_flavor + foreground_anchor (40%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'creature',
        'expression_moment',
        'story_beat',
        'framing',
        'domain',
        'adornment',
        'lighting',
        'weather',
        'magical_flavor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'foreground_anchor', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FEMALE_DRUID: {
    description:
      "PATH-BESPOKE — FaeBot female-druid (2026-06-11; hair/outfit/pose split into their own axes 2026-06-22). The forest's DEFENDER — a female ELF nature-warrior-mage (night-elf / wood-elf / high-elf / blood-elf / dusk-elf / LOTR-silvan lineages via subThemes). Capable, agile, magical, stylish — distinct from gentle faes + ancient bark elders. The character pool is now ELF BASE ONLY (lineage + skin + eyes + ears + face); HAIR, OUTFIT (incl. staff + nature-magic) and POSE/FRAMING are separate rolled axes for guaranteed per-dimension variety (was rendering the same white-haired side-braid leaf-and-gold bust every time). Lean-COVERED tasteful (no cheesecake). Reuses dryad backdrop + lighting. Companion (spirit-animal) 40%-gated.",
    slots: {
      universal: [],
      bot: [],
      path: ['character', 'hair', 'outfit', 'pose', 'backdrop', 'lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FEMALE_DRUID_ADVENTURE: {
    description:
      'PATH-BESPOKE — FaeBot female-druid-adventure (2026-06-11). The ADVENTURE/candid sibling of female-druid: the elf druid OUT IN THE WORLD — exploring the forest, at a creek/lake edge, surveying from a ledge over the canopy. Full-scene, full/3-4-body figure in environment (NOT a tight portrait), candid action front-loaded. Shares the female_druid character pool + druid_magic + companion. Lean-covered. 6 axes + companion (40%-gated): character / adventure_setting / adventure_action / adventure_composition / druid_magic / lighting + companion.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'character',
        'adventure_setting',
        'adventure_action',
        'adventure_composition',
        'druid_magic',
        'lighting',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_MALE_DRUID: {
    description:
      'PATH-BESPOKE — FaeBot male-druid (2026-06-11; hair/outfit/pose split into their own axes 2026-06-22). Male counterpart to female-druid: a male ELF nature-warrior-mage (same lineages via subThemes). HARD GENDER-LOCK (he/his). Character pool is now ELF BASE ONLY (lineage + skin + eyes + ears + face + optional short beard); HAIR, OUTFIT (incl. staff + nature-magic) and POSE/FRAMING are separate rolled axes for guaranteed per-dimension variety. Male NSFW guard: chest ALWAYS named-covered, FACE-only skin (anti-beefcake). Reuses dryad backdrop + lighting. Companion 40%-gated.',
    slots: {
      universal: [],
      bot: [],
      path: ['character', 'hair', 'outfit', 'pose', 'backdrop', 'lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_MALE_DRUID_ADVENTURE: {
    description:
      'PATH-BESPOKE — FaeBot male-druid-adventure (2026-06-11). ADVENTURE/candid sibling of male-druid: the male elf druid out exploring (forest path / creek / ledge vista). Full-scene candid. HARD GENDER-LOCK (he/his) + male NSFW guard (chest covered). Shares male_druid character + the gender-neutral adventure axes + druid_magic + companion. 6 axes + companion (40%-gated): character / adventure_setting / adventure_action / adventure_composition / druid_magic / lighting + companion.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'character',
        'adventure_setting',
        'adventure_action',
        'adventure_composition',
        'druid_magic',
        'lighting',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'companion', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FAE_VILLAGE_AXIS: {
    description:
      'PATH-BESPOKE — FaeBot fae-village (2026-05-21 axis-system migration). One of FaeBot most popular paths. Enchanted fae dwellings grown from forest (acorn / eggshell / mushroom / treehouse / hollow-trunk / bramble-nest / stone-ruin-overgrown / cliff-ledge / spider-silk-hammock / etc.) as primary subject (40-55% of frame). Amber-glowing windows + chimney smoke + lanterns + lush wildflower carpet + critters bring scene to life. 12 axes (11 always-on + 1 gated water_or_feature): dwelling_type / village_layout / lived_in_signs / approach_pathway / dwelling_garden / forest_setting / lighting / atmospheric_depth / wildlife_lived_in / floral_carpet / foreground_anchor + water_or_feature (40%-gated). village_layout covers 9 legacy layout types (SINGLE / PAIR / CLUSTER / CANOPY-NETWORK / VERTICAL-STACK / OVER-WATER / CLIFF-LEDGE / FAIRY-RING-COURTYARD / HANGING-INVERTED) and reconciles with dwelling_type via Sonnet composition.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'dwelling_type',
        'village_layout',
        'lived_in_signs',
        'approach_pathway',
        'dwelling_garden',
        'forest_setting',
        'lighting',
        'atmospheric_depth',
        'wildlife_lived_in',
        'floral_carpet',
        'foreground_anchor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'water_or_feature', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_NATURAL_VILLAGE: {
    description:
      'PATH-BESPOKE — FaeBot fae-natural-village (2026-06-10). Clone of fae-wilds-village (built around a mandated nature feature + creative connectors), BUT the dwellings are made of ORGANIC, EARTHY, of-the-earth materials — carved wood, giant mushrooms, huge blooming flowers, woven branches, hollow logs, gourds. Weird, fun, very organic. Soft FaeBot fairy register. Self-contained: landscape_feature + village_built + connectors + inhabitants + fae_lighting + drama (40%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['landscape_feature', 'village_built', 'connectors', 'inhabitants', 'fae_lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FAE_COTTAGE: {
    description:
      'PATH-BESPOKE — FaeBot fae-cottage (2026-07-01, Kevin cottagecore reference lock: the hearted flower-drowned stone chapel-cottage with glowing amber windows). ONE cozy fae dwelling — cottage / stone chapel / mill / lodge — as the unmistakable HERO (~40-60% of frame), nestled in a wild FaeBot setting (stream / lake / clearing / meadow / glen), a single dominant flowering species engulfing it, warm window-glow + chimney smoke against a softer scene (the money shot, mandated in the template), charming garden foreground, ZERO humans (critters only via the 60%-gated wildlife accent reusing VILLAGE_WILDLIFE). Self-contained: dwelling + setting + overgrowth + garden (pickN 2) + cottage_lighting + atmosphere + wildlife_accent (60%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['dwelling', 'setting', 'overgrowth', 'garden', 'cottage_lighting', 'atmosphere'],
    },
    pickN: { garden: 2 },
    // gate 0.6→0.75 (2026-07-01 keeper tally): 19 of Kevin's 21 keepers featured critters
    conditionalLayer: { slot: 'wildlife_accent', gate: 0.75 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_WILDS_VILLAGE: {
    description:
      'PATH-BESPOKE — FaeBot fae-wilds-village (2026-06-10). Sibling of fae-castle-village, but the village is BUILT AROUND a mandated dramatic NATURE LANDSCAPE FEATURE — a stream / canyon / waterfall / giant rocks / cliffs / ancient trees. The landscape leads; the elven castle-cottages cling to / span / nestle into it, with parts joined by CREATIVE CONNECTORS (arched bridges, stone arches, rope bridges, swinging vines, ladders, ziplines, hanging lift-baskets, walkways). Soft FaeBot fairy register. Self-contained: landscape_feature + village_built + connectors + inhabitants + fae_lighting + drama (40%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['landscape_feature', 'village_built', 'connectors', 'inhabitants', 'fae_lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_CASTLE_VILLAGE: {
    description:
      'PATH-BESPOKE — FaeBot fae-castle-village (2026-06-10). A HYBRID of elven-city (white elven architecture + soft fairy touches) and fae-village (cozy village layout) — an ethereal, castle-like FAE VILLAGE: a cluster of little white elven spired cottages/towers linked by archways + bridges, nestled in lush forest, optional stream, super pretty + intimate. Self-contained: village_layout + village_detail + setting + inhabitants + fae_lighting + drama (40%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['village_layout', 'village_detail', 'setting', 'inhabitants', 'fae_lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_ELVEN_CITY: {
    description:
      'PATH-BESPOKE — FaeBot elven-city (2026-06-10, recreated from DragonBot elven-city, Kevin hearted those white ethereal elven castles). A graceful white elven spired city — Rivendell/Lothlorien towers, arched bridges, glowing windows, water — with a FAE TOUCH (drifting fairy-motes, glowing fae-lanterns, tiny sprites/pixies among the elves, enchanted-forest integration) in FaeBot painterly register. Self-contained: elven_city + elven_detail + city_setting + fae_inhabitants + fae_lighting + drama (40%-gated).',
    slots: {
      universal: [],
      bot: [],
      path: ['elven_city', 'elven_detail', 'city_setting', 'fae_inhabitants', 'fae_lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_FAE_COURT: {
    description:
      'PATH-BESPOKE — FaeBot fae-court (2026-06-10, transplanted from DragonBot). Ethereal high-fae / elven-court / enchanted-glade scene — gossamer beauty, moonlight, magic. Self-contained: fae_subject + enchanted_setting + ethereal_detail + surprise + fae_lighting (light+atmosphere combined) + drama (40%-gated). No shared universal pools (FaeBot pattern).',
    slots: {
      universal: [],
      bot: [],
      path: ['fae_subject', 'enchanted_setting', 'ethereal_detail', 'surprise', 'fae_lighting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_ENCHANTED_VISTA: {
    description:
      'PATH-BESPOKE — FaeBot enchanted-vista (2026-05-21 axis-system migration from legacy function-form). PURE FOREST LANDSCAPE — no figures, no creatures as focal subjects. The lush enchanted forest itself is the subject, the magical land where the other FaeBot creatures live and thrive. Multi-layer painterly richness (canopy + hero feature + floor + water + magic + light + depth + air + foreground). 11 axes: biome / hero_feature / floor_carpet / water_element / magical_ambient / composition / lighting / atmospheric_depth / weather / foreground_anchor + wildlife_distant (40%-gated). HARD BAN: never include "standing stones / stone circles / tomb / gravestone" (Flux renders these as cemetery imagery).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'biome',
        'hero_feature',
        'floor_carpet',
        'water_element',
        'magical_ambient',
        'composition',
        'lighting',
        'atmospheric_depth',
        'weather',
        'foreground_anchor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'wildlife_distant', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAEBOT_QUEEN_OF_THE_FOREST: {
    description:
      'PATH-BESPOKE — FaeBot queen-of-the-forest (2026-05-21 pivot from fairy-court). ONE ornate magic fae queen POSED beautifully in a stunning natural forest setting (gnarled-root throne in clearing / posed on tree-branch over stream / standing in wildflower meadow / sitting on mossy boulder by waterfall / framed in tree-archway / wading in forest stream / leaning against hero-tree). She is the Queen of the Forest — woodland critters FLOCK to her and pay respects (foxes, robins, fawns, butterflies, frogs, hares at her feet and around her). Sometimes lesser fae also gather (60%-gated). Painted-fantasy register. 11 axes: queen_features / posed_setting / forest_biome / regalia / forest_critters / lighting / weather / magical_flavor / ambient_detail / foreground_anchor + lesser_fae (60%-gated). MULTI-FIGURE / formal-court framing removed — this is the queen alone (or with lesser fae paying respects), posed in her natural domain.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'queen_features',
        'posed_setting',
        'forest_biome',
        'regalia',
        'forest_critters',
        'lighting',
        'weather',
        'magical_flavor',
        'ambient_detail',
        'foreground_anchor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'lesser_fae', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
