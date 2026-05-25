/**
 * toybot archetypes — path-bespoke archetype definitions.
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
  TOYBOT_BARBIE_STORYTELLING: {
  description: 'PATH-BESPOKE — ToyBot barbie-scene path (2026-05-19 axis-system rewrite). BARBIE-PLAYTIME MISCHIEF — every render is a single-frame kid-playroom story moment featuring Mattel-style 11.5-inch fashion-dolls (Barbie / Ken / sisters / Bratz-style) acting out absurd unexpected scenarios (black-market lip-gloss empire, Ken intervention, Barbie courtroom drama, sister-summit, campaign rally, cooking-show meltdown, etc.). NOT a Barbie movie poster. 4-6 dolls coexist in one densely populated playtime scene with multilayered real-prop set decoration. Six-slot seed DNA. Skips chaos / two-pass polish / sensory anchors. Uses path-bespoke wide narrative-action camera pool + playroom-diorama prompt prefix override.',
  slots: { universal: [ 'camera_angle' ], bot: [], path: [ 'scene' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  TOYBOT_PLUSH_STORYTELLING: {
  description: 'PATH-BESPOKE — ToyBot plush-world path (2026-05-19 axis-system rewrite). PLUSH-STORYBOOK MISCHIEF — every render is a single-frame storybook moment from an UNEXPECTED plush-stuffed-animal scenario (black-market honey trade, underground knit-off finals, plush comedy club, plush gondola taxi in the bath suds, plush acupuncture clinic, plush courtroom drama, fire-extinguisher emergency, etc.). Beatrix Potter meets Pooh meets Coraline-set-build meets cozy mischief. 4-6+ different plush archetypes coexist in one densely populated storybook scene with multilayered real-prop set decoration. Six-slot seed DNA: real surface + unexpected story setup; protagonist plush + specific action; 3-5 supporting cast across plush archetypes; multilayered real-prop set decoration; warm cozy storybook light; overhead/floating chaos element. Skips chaos / two-pass polish / sensory anchors. Uses path-bespoke wide narrative-action camera pool + storybook-diorama prompt prefix override.',
  slots: { universal: [ 'camera_angle' ], bot: [], path: [ 'scene' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  TOYBOT_TOYBOX_STORYTELLING: {
  description: 'PATH-BESPOKE — ToyBot toybox-chaos path (2026-05-19 axis-system rewrite). MIXED-MEDIUM STORYTELLING — every render is a single-frame comedy moment from a longer absurd toy-story (heist / wedding crash / talent show / mosh pit / rescue mission / tea party crashed / courtroom drama / magic show / construction disaster / etc.). 4-6+ different toy mediums coexist in one densely populated mischief scene on a real-world surface. Six-slot seed DNA: real surface + story setup; protagonist + dramatic absurd action; 3-5 supporting cast across brand families; absurd visual gag prop detail; warm play light; overhead/floating chaos element. Each seed bakes all 6 slots semicolon-separated. Skips chaos / two-pass polish / sensory anchors (seeds are pre-tuned 6-slot DNA — downstream layers strip slots or inject incompatible tokens).',
  slots: { universal: [ 'camera_angle' ], bot: [], path: [ 'scene' ] },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  TOYBOT_MODEL_TRAIN_WORLD: {
  description: 'PATH-BESPOKE — ToyBot model-train-world path. THREE RENDER MODES branched at template level by sharedDNA.renderMode + a roll: (1) classic-diorama [renderMode!=world]: handcrafted HO-scale model-railroad terrain, uses scene + drama_moment + 35% unusual_cargo; (2) real-world [renderMode==world AND world-roll<0.65]: tiny train running through actual real environments (kitchen table, sleeping cat, forest moss, sandbox), scale-tension wow; (3) themed-cinematic [renderMode==world AND world-roll>=0.65]: train as hero in genre-coded immersive worlds (Western / fantasy / Mad Max / Polar Express / cyberpunk / Studio Ghibli / etc.). All four scene-source pools picked per render; template selects which to inject based on mode + roll.',
  slots: {
    universal: [ 'camera_angle', 'scenario', 'staging' ],
    bot: [],
    path: [ 'scene', 'train_consist', 'train_weather', 'drama_moment', 'world_real_setting', 'world_themed_setting' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'unusual_cargo', gate: 0.35 },
  framingModes: null,
  anchorScaleRange: null
},

  TOYBOT_DINO_DIORAMA: {
  description: 'PATH-BESPOKE — ToyBot dino-diorama path (2026-05-24). REAL plastic/vinyl TOY DINOSAURS staged in a HANDMADE CLAYMATION prehistoric WORLD (clay-sculpted volcano / terrain / foliage / rivers; Aardman / Laika miniature-set craft). The dinos are REAL TOYS; the world around them is sculpted clay — mixed-media charm. Fun, story-driven prehistoric scenes (eruptions, tar pits, meteor watches, river crossings, nest defense) with a 55%-gated SURPRISE (a stray other-toy / unexpected whimsy). Rich multi-axis: cast (SHARED toy-dino pool) + scenario + clay biome + monumental clay anchor + handmade craft detail + secondary critters/scale-provers + universal camera / lighting / atmosphere. Medium dino_diorama. Skips chaos / two-pass polish / sensory so the tightly-composed brief flows straight to Flux.',
  slots: {
    universal: [ 'camera_angle' ],
    bot: [],
    path: [ 'cast', 'scenario', 'biome', 'flora', 'anchor', 'craft', 'critters', 'lighting', 'atmosphere' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'surprise', gate: 0.55 },
  framingModes: null,
  anchorScaleRange: null
},

  TOYBOT_TOYBOX_CHAOS: {
  description: 'PATH-BESPOKE — ToyBot toybox-chaos path (2026-05-24 bucket+pickN refactor). MIXED-TOY CHAOS — a big de-branded TOY BUCKET (trolls / ponies / barbarians / robots / heroes / army-men / plush / dinos / die-cast / dolls / gnomes…) pickN:4-composited into ONE interacting mini-vignette on a real surface, mid-chaos (rescue / battle / heist / race / monster-attack / tea-party-gone-wrong). The INTERACTION MANDATE is load-bearing — the picked toys must react to each other (chasing / rescuing / battling / fleeing), NOT a static lineup, with a clear focal beat. Each toy renders in its OWN native material (plastic / vinyl / plush / die-cast / tin). Replaces the old 6-slot baked-scene pool (combinatorial ceiling) — adding a toy is now a one-line bucket append. TOYBOX_TOY_BUCKET is a SHARED asset. Skips chaos / two-pass polish / sensory.',
  slots: {
    universal: [ 'camera_angle' ],
    bot: [],
    path: [ 'toy_cast', 'surface', 'scenario', 'lighting', 'atmosphere' ]
  },
  pickN: { toy_cast: 4 },
  conditionalLayer: { slot: 'surprise', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},
};
