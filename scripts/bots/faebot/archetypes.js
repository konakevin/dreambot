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
  description: 'PATH-BESPOKE — FaeBot forest-fairy-scene (2026-05-20 axis-system migration). The canonical FaeBot path — ONE mythic forest creature (40-55% of frame, off-center, candid hidden-camera capture) wrapped in a deep wild forest. Painted-fantasy concept-art lineage (Manchess + Giancola + Bonner + Froud). Otherworldly mythic-creature beauty, NOT human-model beauty. NEVER posing, NEVER eye-contact. 10 axes (9 always-on + 1 gated companion): creature / forest_biome / lighting / weather / foreground_anchor / botanical_accent / candid_action / magical_flavor / scale_prover + companion (50%-gated).',
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
      'scale_prover'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'companion', gate: 0.5 },
  framingModes: null,
  anchorScaleRange: null
},

  FAEBOT_FLOWER_FAIRY: {
  description: 'PATH-BESPOKE — FaeBot flower-fairy (2026-05-20 axis-system migration). Sister to forest-fairy-scene. ONE flower-merged mythic fae creature (40-55% of frame, off-center, candid). DISTINCT DNA: creatures whose BODIES ARE FLOWERS (petal-skin / blossom-hair / petal-wings / petal-garment / pollen-glow). Sub-human scale — flowers can be her HOME. Color-coherent via matchTagsFromSlot: creature carries a palette tag (WARM/COOL/WHITE/MULTI), biome + botanical_accent filter to match. 10 axes (9 always-on + 1 gated companion): creature / flower_biome / lighting / weather / foreground_anchor / botanical_accent / candid_action / magical_flavor / scale_prover + companion (50%-gated).',
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
      'scale_prover'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'companion', gate: 0.5 },
  framingModes: null,
  anchorScaleRange: null
},

  FAEBOT_TINY_FAE: {
  description: 'PATH-BESPOKE — FaeBot tiny-fae (2026-05-21 axis-system migration). Palm-sized winged fae (3-8 inches tall) at MACRO perspective in the enchanted forest. THE PATH IDENTITY is the scale_anchor_companion — every render includes a normal-sized forest creature (fox / deer / fawn / robin / squirrel / hedgehog / owl / etc.) that DRAMATICALLY DWARFS her. Without this scale-proof, Flux defaults to regular-sized fairy. Painterly-real (Brian Froud + Charles Vess lineage). 10 axes (9 always-on + 1 gated botanical_accent). IMPORTANT: tiny-fae is in twoPassPolish.skipPaths because Haiku polish strips dwarfing language. Pool entries use strong dwarfing positions (perched on a single feature / under looming face / fits inside a paw).',
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
      'foreground_anchor'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'botanical_accent', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  FAEBOT_DRYAD_PORTRAIT: {
  description: 'PATH-BESPOKE — FaeBot dryad-portrait (2026-05-21 axis-system migration). TIGHT close-up portrait (face 35-60% of frame) of an adult-scale tree-bound dryad / hamadryad / naiad / meliae / moss-maiden / Leshy. Intimate STILLNESS register — face turned 3/4 or profile, eyes lowered, NEVER eye-contact. Painted-fantasy register (Manchess + Giancola + Bonner + Froud). 10 axes (9 always-on + 1 gated foreground_anchor): creature / expression_moment / gesture_pose / portrait_composition / adornment / forest_backdrop / lighting / weather / magical_flavor + foreground_anchor (40%-gated). Decomposed creature pool to features-only (no posture), with expression / gesture / adornment broken out as separate axes for ~10^9 combinations.',
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
      'magical_flavor'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'foreground_anchor', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  FAEBOT_QUEEN_OF_THE_FOREST: {
  description: 'PATH-BESPOKE — FaeBot queen-of-the-forest (2026-05-21 pivot from fairy-court). ONE ornate magic fae queen POSED beautifully in a stunning natural forest setting (gnarled-root throne in clearing / posed on tree-branch over stream / standing in wildflower meadow / sitting on mossy boulder by waterfall / framed in tree-archway / wading in forest stream / leaning against hero-tree). She is the Queen of the Forest — woodland critters FLOCK to her and pay respects (foxes, robins, fawns, butterflies, frogs, hares at her feet and around her). Sometimes lesser fae also gather (60%-gated). Painted-fantasy register. 11 axes: queen_features / posed_setting / forest_biome / regalia / forest_critters / lighting / weather / magical_flavor / ambient_detail / foreground_anchor + lesser_fae (60%-gated). MULTI-FIGURE / formal-court framing removed — this is the queen alone (or with lesser fae paying respects), posed in her natural domain.',
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
      'foreground_anchor'
    ]
  },
  pickN: {},
  conditionalLayer: { slot: 'lesser_fae', gate: 0.6 },
  framingModes: null,
  anchorScaleRange: null
},
};
