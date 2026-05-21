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

  FAEBOT_FAIRY_COURT: {
  description: 'PATH-BESPOKE — FaeBot fairy-court (2026-05-21 R6 chamber-life axis). Soft ethereal enchanted-forest fairy court — atomic feature-stack candidates (pickN:5), template uses RNG to roll 1-4 figures with explicit positional labels for multi-figure Flux compliance. Court-infrastructure mandate (throne / benches / lantern-orbs / moss-stair approach / giant-mushroom canopy / hero-tree landmark) leads the Flux prompt. NEW chamber_life axis adds ambient set-dressing (critters / flowers / butterflies / fireflies / lush foliage texture) to populate the chamber. Categories: birch-glade / oak-cathedral / wisteria-cathedral / giant-mushroom-canopy / hero-tree / fern-grotto / yew-grove / sacred-clearing. ABSOLUTELY NO mushroom-AS-THRONE / mushroom-spire-pillars / bioluminescent-glen. 11 axes: court_subject pickN:5 / ceremonial_moment / composition / regalia / forest_backdrop / lighting / weather / magical_flavor / chamber_life / foreground_anchor + sacred_companion (40%-gated).',
  slots: {
    universal: [],
    bot: [],
    path: [
      'court_subject',
      'ceremonial_moment',
      'composition',
      'regalia',
      'forest_backdrop',
      'lighting',
      'weather',
      'magical_flavor',
      'chamber_life',
      'foreground_anchor'
    ]
  },
  pickN: { court_subject: 5 },
  conditionalLayer: { slot: 'sacred_companion', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},
};
