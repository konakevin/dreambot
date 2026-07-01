/**
 * ToyBot — the bot-engine contract.
 *
 * Every render is CINEMATIC toy-world storytelling. Action-packed movie-stills.
 * Each path pegged to a specific toy medium via mediumByPath, except
 * `toybox-chaos` which intentionally mixes mediums in one scene.
 *
 * Bot-only mediums (NOT in public dream_mediums table): stitched, action_figure,
 * calico_figures, shortcake_figures, barbie_figures, tabletop_minis, army_men,
 * gi_joe_figures, action_hero_figures, hot_wheels, model_train_diorama,
 * plush_fabric, mech_toys, dollhouse_figures.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  // existing
  claymation: require('./paths/claymation'),
  vinyl: require('./paths/vinyl'),
  sackboy: require('./paths/sackboy'),
  'shortcake-scene': require('./paths/shortcake-scene'),
  'barbie-scene': require('./paths/barbie-scene'),
  // renamed (2026-05) — scene-oriented names
  'gi-joe-missions': require('./paths/gi-joe-missions'),
  'green-army-warzone': require('./paths/green-army-warzone'),
  'miniature-dungeon': require('./paths/miniature-dungeon'),
  'collector-shelf-epic': require('./paths/collector-shelf-epic'),
  'epic-hero-bucket': require('./paths/epic-hero-bucket'),
  // rebrand (2026-05)
  'dollhouse-life': require('./paths/dollhouse-life'),
  // new (2026-05)
  'hotwheels-city': require('./paths/hotwheels-city'),
  'model-train-world': require('./paths/model-train-world'),
  'plush-world': require('./paths/plush-world'),
  'mech-toy-rampage': require('./paths/mech-toy-rampage'),
  'toybox-chaos': require('./paths/toybox-chaos'),
  'space-saga-figures': require('./paths/space-saga-figures'),
  // new (2026-05-08) — flagship boss-clash path using shared FINAL_BOSSES pool
  'monster-boss-battle': require('./paths/monster-boss-battle'),
  // new (2026-05-24) — real toy dinosaurs in a claymation prehistoric world
  'dino-diorama': require('./paths/dino-diorama'),
  // new (2026-05-25) — flagship epic toy-movie scenes in one rolled toy universe
  'toy-blockbuster': require('./paths/toy-blockbuster'),
  // new (2026-05-24) — photoreal SURREAL colossal toys in real-world settings
  'giant-toys': require('./paths/giant-toys'),
  // new (2026-06-06) — real-world wide vistas as handcrafted Sackboy/LBP
  // craft worlds with a few real classic toys scattered as scale-prover
  // accents. Pool mirrors BrickBot's lego-landscapes + PixelBot's
  // pixel-landscapes (shared extraction from location_iconic_spots).
  'toy-landscapes': require('./paths/toy-landscapes'),
};

module.exports = {
  username: 'toybot',
  displayName: 'ToyBot',

  // 2026-06-06 — model rotation HARD-LOCKED to flux-1.1-pro + flux-1.1-pro-ultra
  // (Kevin: "only that"). Everything else heart-banned in a single session as
  // Phase 1 story_beat renders surfaced soft / product-shot results:
  //   - flux-2-pro (2026-06-02)
  //   - flux-2-max, flux-2-flex, flux-2-dev, gpt-image-2 (2026-06-06)
  //   - nano-banana (google/gemini-2-image), flux-dev (2026-06-06)
  // modelByPath removed — the whitelist below IS the entire allowed set, no
  // per-path overrides remain. Rotation per render is 50/50 across the two
  // remaining Pro variants.
  useModelPicker: true,
  allowedModels: [
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
  ],

  // Per-path model rotation (2026-06-06). toy-landscapes rotates across
  // gpt-image-2 + the two bot-wide Pro variants (flux-1.1-pro + ultra).
  // gpt-image-2 was bot-wide heart-banned 2026-06-06 for other paths but
  // works great for the LBP / Sackboy landscape register, so it's re-enabled
  // here as one of three. Equal weights = roughly 33% each per render.
  // Other ToyBot paths still rotate the 2-model whitelist above.
  modelByPath: {
    'toy-landscapes': {
      'black-forest-labs/flux-1.1-pro': 100,
      'black-forest-labs/flux-1.1-pro-ultra': 100,
    },
  },

  // mediumByPath — each path locks to its medium.
  // toybox-chaos rotates across an array per render to deliberately mix
  // the visual signature.
  mediumByPath: {
    claymation: 'claymation',
    vinyl: 'vinyl',
    sackboy: 'stitched',
    'shortcake-scene': 'shortcake_figures',
    'barbie-scene': 'barbie_storytelling_mixed',
    'gi-joe-missions': 'gi_joe_figures',
    'green-army-warzone': 'army_men',
    'miniature-dungeon': 'tabletop_minis',
    'collector-shelf-epic': 'action_figure',
    'epic-hero-bucket': 'action_hero_figures',
    'dollhouse-life': 'dollhouse_figures',
    'hotwheels-city': 'hot_wheels',
    'model-train-world': 'model_train_diorama',
    'plush-world': 'plush_storytelling_mixed',
    'mech-toy-rampage': 'mech_toys',
    'toybox-chaos': 'toybox_chaos_mixed',
    'space-saga-figures': 'space_saga_figures',
    'toy-landscapes': 'handcrafted',
    // monster-boss-battle rotates across the full toy-medium roster so the
    // boss + heroes can land in any toy world (vinyl Funko vs kaiju, action
    // figures vs demon lord, mechs vs alien overlord, etc.)
    'monster-boss-battle': [
      'action_figure',
      'vinyl',
      'mech_toys',
      'gi_joe_figures',
      'space_saga_figures',
      'plush_fabric',
    ],
    'dino-diorama': 'dino_diorama',
    // toy-blockbuster — rotate ONE toy universe per render (cohesion). Whole
    // roster of single-line mediums; the rolled medium locks the look so every
    // figure + the centerpiece are that one toy line.
    'toy-blockbuster': [
      'vinyl',
      'army_men',
      'claymation',
      'stitched',
      'gi_joe_figures',
      'action_figure',
      'action_hero_figures',
      'plush_fabric',
      'mech_toys',
      'barbie_figures',
      'shortcake_figures',
      'hot_wheels',
      'tabletop_minis',
      'dollhouse_figures',
      'calico_figures',
    ],
    // giant-toys — single bespoke PHOTOREAL medium (the colossal toy in its
    // true material at giant scale). One medium; toy variety lives in the
    // giant_toy_subject pool, not in medium rotation.
    'giant-toys': 'giant_toy_surreal',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path suffix override (REPLACES promptSuffix for this path). giant-toys
  // bans humans — these negatives sit in the FINAL trailing Flux slot, the same
  // slot where "no text, no words, no watermarks" reliably suppresses (renders
  // never show text), so "no people / no humans" suppresses here too without the
  // Sonnet-sentence negative-prompt-leak. R4 diagnosis 2026-05-24.
  promptSuffixByPath: {
    'giant-toys':
      'no people, no humans, no pedestrians, no crowds, no figures, no text, no words, no watermarks, hyper detailed, masterpiece quality',
  },

  // Per-path prompt prefix override — Funko Pop visual identity is front-loaded
  // for the vinyl path so Flux's early-token weighting locks the look. Without
  // this, the generic toy-photography prefix dilutes Funko-specific cues.
  promptPrefixByPath: {
    vinyl:
      'photograph of authentic Funko Pop vinyl collectible figures with signature oversized SQUARE CUBE heads, small stocky bodies, tiny legs, large round solid-black dot eyes (no pupils), glossy matte vinyl, classic Funko Pop boxed-collectible look',
  },

  // Per-medium prefix REPLACES the bot-wide PROMPT_PREFIX (not stacks).
  // toybox_chaos_mixed: anchor Flux to "stop-motion film still" anchor
  // instead of the bot-wide "toy photography" prefix, which triggers
  // Pop-Mart / Sonny-Angel collection-photo defaults and ignores the
  // scene's actual story content (props, setting, mid-action poses).
  // The stop-motion-film anchor unlocks practical props (real cake,
  // real toilet bowl, real courtroom bench) and dynamic mid-action.
  // R2 audit 2026-05-19.
  //
  // plush_storytelling_mixed: same pattern as toybox-chaos. Anchor to
  // "children's storybook diorama film still" so Flux renders practical
  // props + multi-character storybook scenes instead of the bot-wide
  // "toy photography" default that collapses plush ensembles into a
  // posed plush-collection lineup. R0 plush-world rewrite 2026-05-19.
  promptPrefixByMedium: {
    // 2026-06-02 cruft-audit micro-strip — dropped 3-stack NOT chain
    // (NOT a Pop Mart toy collection / NOT a static product display /
    // NOT a posed lineup). The "captured mid-story-beat with visible
    // action playing out across the scene" positive anchor already
    // mandates dynamic action over posed framing.
    toybox_chaos_mixed:
      'cinematic stop-motion film still from a behind-the-scenes toy diorama, real-world practical-prop set built from kid-found household objects (real wooden blocks, real food packaging, real fabric, real coins, real cardboard, real tape), mixed-medium toy cast captured mid-story-beat with visible action playing out across the scene',
    // 2026-06-02 cruft-audit micro-strip — dropped 5-stack NOT chain
    // (NOT needle-felted Etsy handcraft creatures / NOT small felt
    // figurines / NOT Pop-Mart plushies / NOT static product display /
    // NOT a posed lineup). "Squishmallow-style / oversized round-pudgy
    // fiberfill bodies / soft visible plush-fur / acting out the scene"
    // positive anchors carry the plush-character-mid-action identity.
    plush_storytelling_mixed:
      "cinematic children's-storybook-diorama film still — CUTE Squishmallow-style fluffy huggable plushies (oversized round-pudgy fiberfill bodies, soft visible plush-fur, big embroidered eyes, floppy limbs) acting out the scene below in a multilayered real-prop set built from kid-found household objects (real coffee mugs, real twigs, real moss, real coins, real ribbons, real wooden blocks, real teacups, real Post-it notes), plush cast captured mid-storybook-beat",
    // 2026-05-19 barbie-scene rewrite — anchors Flux to "playroom-diorama
    // film still" so Mattel-style fashion-dolls act out kid-playtime
    // scenarios with practical-prop scene dressing.
    // 2026-06-02 cruft-audit micro-strip — dropped 4-stack NOT chain +
    // 2-stack NEVER chain (NOT a Barbie movie poster / NOT a red-carpet
    // glamour shot / NOT a static product display / NOT a posed lineup /
    // NEVER real women / NEVER CGI). "Mattel-style 11.5-inch articulated
    // fashion-dolls / glossy plastic / molded hair / painted-glossy-
    // makeup faces / acting out the scene mid-story-beat" positive
    // anchors hold the doll-identity + dynamic-action register.
    barbie_storytelling_mixed:
      'cinematic kid-playroom-diorama film still — Mattel-style 11.5-inch articulated fashion-dolls (Barbie / Ken / sisters / Bratz-style — glossy plastic, molded hair, painted-glossy-makeup faces, fashion-doll proportions) acting out the scene below in a multilayered real-prop kid-playroom set built from kid-found household objects (real coffee mugs, real Post-it notes, real wooden blocks, real coins, real cardboard, real tape, real fabric scraps), fashion-doll cast captured mid-story-beat',
    // 2026-05-24 giant-toys — SHORT anchor (replaces the tiny-product "toy
    // photography / toy-ness elevated" bot prefix, which front-loaded a
    // product-shot framing). Keep it brief so Flux's attention reaches the
    // Sonnet-written goofy SITUATION rather than collapsing to a generic
    // "giant toy standing in a city." R1 diagnosis 2026-05-24.
    giant_toy_surreal:
      'epic cinematic action film-still of a goofy TOY BOSS BATTLE — a giant boss toy fighting a band of smaller toys in an ordinary real-world place, real physical toys mid-fight, dramatic cinematic lighting, photoreal',
    // tabletop_minis is exclusive to the merged miniature-dungeon path, which
    // 50/50s between a display-object register and an off-diorama immersive
    // register. REPLACE the bot-wide "toy-ness elevated as the subject" prefix
    // (it pulled the immersive register toward a base/product shot) with
    // register-NEUTRAL painted-miniature material truth. Each register's template
    // then adds its own framing (display = base/diorama; immersive = in-world
    // scene). No base/diorama/tabletop words here (negative-prompt-leak).
    tabletop_minis:
      'hand-painted tabletop-miniature figures, Games-Workshop / Reaper / WizKids collector paint quality, visible brush-strokes and drybrushed metallic highlights, macro miniature photography, shallow depth of field',
  },

  // Per-medium prompt injection — ToyBot's dialect for each toy medium.
  // Injected between promptPrefix and the Sonnet-written scene. Each medium
  // is rendered as a REAL PHYSICAL TOY photographed in a practical set.
  mediumStyles: {
    // 2026-06-02 cruft-audit micro-strip — dropped trailing NOT chains from
    // mediumStyles entries. Positive material/identity anchors carry the
    // register. See [[feedback_negative_prompt_leak]].
    claymation:
      'stop-motion Plasticine clay puppet, visible thumbprints and sculpting-tool marks on the clay surface, slightly-asymmetric hand-sculpted features, painted glossy-enamel irises, armature-supported body with subtle clay seams, Aardman / Laika / Coraline / Wallace-and-Gromit aesthetic, matte-clay texture with occasional glossy highlight, practical miniature-set cinematography',
    vinyl:
      'Funko Pop vinyl collectible figure, signature Funko Pop proportions (oversized SQUARE CUBE head approx 1:1 with body, small stocky body, tiny legs), large round solid-black dot eyes (no pupils, glossy black), tiny printed mouth or no mouth, glossy matte vinyl finish, mass-produced collectible aesthetic, printed costume / fur / accessory details, Funko Pop figure boxed-collectible look — ONLY classic Funko Pop visual language',
    action_figure:
      '1/12-scale posable action-figure, visible ball-joint articulation at neck / shoulders / elbows / wrists / hips / knees / ankles, hard-plastic body with cloth-hybrid costume elements, hand-painted weathering and detail wash, interchangeable accessories at scale, GI-Joe / Hot-Toys / Mezco / NECA / Hasbro-Black-Series aesthetic, practical diorama lighting with shallow depth-of-field',
    // 2026-06-06 cruft audit — stripped LBP-world enumeration (fabric hills /
    // cardboard trees / button flowers / yarn grass / corduroy stone / sponge
    // rocks) + zipper-eye-feature catalog. The story_beat + path template carry
    // WHO and WHAT; the medium carries HOW IT LOOKS only. Material + finish.
    stitched:
      'LittleBigPlanet Sackboy-world aesthetic — sewn brown-sackcloth or burlap-hessian fabric body with visible thread stitching down every seam, plastic-button eyes, stitched-felt features, cotton-fiberfill softness, Media Molecule LBP craft-world look where everything in frame is hand-sewn or papercraft, practical pool-palette lighting',
    // 2026-06-06 cruft audit — stripped 8-animal archetype enumeration + outfit
    // catalog + miniature-prop catalog. Story_beat carries the cast; this is
    // material + finish + practical-set anchor only.
    // Calico Critters — kept for legacy callers; dollhouse-life uses dollhouse_figures.
    calico_figures:
      'Calico Critters / Sylvanian Families aesthetic — flocked velvet-textured small-animal figurines at ~3-inch dollhouse scale, painted plastic eyes, hand-sewn cloth outfits, wooden furniture and tiny props in a fully-appointed handcrafted miniature interior, cozy daily-life energy, shallow-depth-of-field dollhouse photography, practical pool-palette lighting',
    // 2026-06-06 cruft audit — stripped 3-tradition enumeration + miniature-
    // prop catalog. Path file rolls the tradition; the medium just locks the
    // handcrafted-miniature-interior aesthetic.
    dollhouse_figures:
      'dollhouse-scale figurine ensemble in a fully-appointed handcrafted miniature interior — painted faces, tiny cloth outfits, wooden furniture and mini-props at scale, warm window-glow or lamp practical lighting, cozy daily-life energy, shallow-depth miniature photography',
    // 2026-06-06 cruft audit — stripped hair-color enumeration + costume
    // catalog (apron-dress / pinafore / pantaloons / bonnet / tights /
    // ankle-boots) + playset-prop list (giant strawberry / cupcake-castle /
    // lollipop-tree / rainbow-bridge / pie-cottage). Story_beat carries the
    // cast and playset; the medium carries the toy aesthetic.
    shortcake_figures:
      '1980s Strawberry-Shortcake-era scented-doll aesthetic — 3-to-5-inch soft-plastic doll figurines with oversized heads, big round eyes, rosy painted blush, thick rooted pastel-yarn hair, cloth gingham-or-calico outfits, pastel dessert-and-flower-themed miniature playset with oversized scale-prop charm, nostalgic 80s-catalog look, faded-catalog color grade, practical pool-palette lighting',
    // 2026-06-06 cruft audit — stripped hair-color enumeration + makeup
    // catalog + 8-outfit-role enumeration + 5-playset enumeration. Story_beat
    // carries the cast and playset; medium carries the doll aesthetic only.
    barbie_figures:
      'Mattel-scale 11.5-inch fashion-doll aesthetic — articulated glossy-plastic fashion-doll bodies, molded hair, oversized head with painted-glossy-makeup face, fashion-forward cloth outfit, spike-heel plastic shoes, fully-dressed handcrafted playset, pink-leaning signature palette, glossy-plastic sheen, practical pool-palette lighting, shallow depth of field, cinematic Barbie-film composition',
    // 2026-06-06 cruft audit — stripped base-texture catalog (static-grass /
    // cork-rock / sand / snow) + terrain-element catalog (sculpted-foam rocks /
    // lichen-trees / plaster ruins / resin-water). Path scene + story_beat
    // carry the diorama setup; medium carries paint quality + scale only.
    tabletop_minis:
      'Warhammer / D&D / Reaper / WizKids tabletop-miniature aesthetic — 28-32mm scale painted pewter-or-plastic fantasy figures, visible brush-strokes, wash-shaded recesses, drybrushed metallic highlights on raised edges, freehand crest detail, mounted on flocked round bases, handcrafted terrain diorama, collector pro-painter display DNA, dramatic spotlight rim-light per pool palette, shallow-depth display photography',
    army_men:
      'classic Bucket-O-Soldiers / Toy-Story-2nd-battalion / green-army-men aesthetic — monochromatic solid-color molded-plastic toy soldiers, ~2-inch scale, fixed cast-in-plastic single-pose, visible vertical mold-seams, plastic-shine where light catches, oval connector-base attached underfoot, gear molded as one piece with body, handcrafted WWII-diorama or backyard-epic practical set, cotton-ball smoke / flash-bulb burst lighting, multiple soldiers in frame',
    gi_joe_figures:
      '1980s GI-Joe-era articulated-commando action-figure aesthetic — 3.75-inch hand-painted multicolor military action-figures with swivel-waist / ball-joint arms / rubber-band-waist construction, fully-dressed handcrafted battle-playset, bright Saturday-morning-cartoon-serial energy, cotton-ball smoke / flash-bulb burst lighting',
    // 2026-06-06 cruft audit — the worst single offender by length (~1100
    // chars). Stripped three full enumerated archetype categories (a/b/c) with
    // ~21 named figure archetypes (barbarian-hero / sorceress / skeletal-villain
    // / muscle-champion / beast-warrior / hooded laser-sword monk / dark-helmet
    // villain / scruffy smuggler / astromech-or-protocol droid / rebel-pilot /
    // bounty-hunter / alien-sidekick / caped champion / vigilante / winged hero
    // / cosmic hero / powered-armor hero / amazon warrior / cape-villain etc.)
    // + signature-gear catalogs + 4-lighting-effect enumeration. The path file's
    // template still names the (a)/(b)/(c) categories conceptually; the medium
    // just locks material + finish. Story_beat carries the cast.
    action_hero_figures:
      'vintage 80s/90s "epic" articulated action-figure aesthetic — hand-painted bright primary-color plastic, swivel-waist articulation, fully-dressed handcrafted playset diorama, dramatic toy-commercial lighting, Saturday-morning-epic-serial energy',
    // 2026-06-06 cruft audit — stripped 7-surface enumeration (kitchen counter /
    // driveway / bedroom rug / garage floor / picnic blanket / coffee table /
    // patio). Path scene + story_beat carry the surface; medium carries the
    // die-cast-car material truth.
    hot_wheels:
      'Hot Wheels / Micro Machines die-cast toy car aesthetic — 1:64-scale (~3-inch) die-cast metal-and-plastic toy cars with chrome accents, glossy paint, oversized hot-rod-style wheels, racing-stripes or decals, visible mold-seam underneath, real-world-surface practical-set photography, speed-blur on tires, dust-puff under wheels, headlight cones cutting through shadow, bright die-cast-car-commercial energy',
    model_train_diorama:
      // Stripped "HO-scale" / "model locomotive" / "panel-line wash" /
      // "knuckle-couplers" — those are Flux's diorama-trigger tokens.
      // "HO-scale model train" in Flux's training set = tilt-shift
      // miniature diorama photo trope. To break out we have to NOT use
      // those words anywhere in the prompt. Setting context comes from
      // the template — classic mode re-adds diorama language inline,
      // world mode adds real-world language.
      'small toy train — tiny toy locomotive (steam-engine with brass stack and lit headlamp / diesel-engine with chrome trim) pulling toy train cars (boxcars / passenger cars / coal-tender / caboose) on twin metal rails, ~3-inch overall scale, visible toy-train aesthetic',
    // 2026-06-06 cruft audit — stripped 5-setting enumeration (forest campsite /
    // sailboat / picnic meadow / attic bedroom / treehouse) + 4-lighting-source
    // enumeration. Path scene + story_beat carry the setting; medium carries
    // plush material truth.
    plush_fabric:
      'plush stuffed-animal aesthetic — soft-fabric creatures with visible plush-fiber FUR or KNIT TEXTURE, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, handcrafted miniature set, practical pool-palette lighting, storybook warmth',
    // 2026-06-06 cruft audit — stripped 7-joint enumeration + 5-weapon catalog
    // (energy-sword / plasma-rifle / shield / shoulder-cannon / missile-pod).
    // Path scene + story_beat carry the action and equipment; medium carries
    // mech-toy material truth.
    mech_toys:
      'articulated mech-toy aesthetic — robot / Gundam-style / transforming-mech model-kits with visible ball-joint articulation, chrome-plated paneling and armor plates, transformation seams, cockpit-canopy glow, hand-painted weathering and panel-line wash, 1/144-to-1/100 collector scale, real-physical-toys on a handcrafted set, chrome reflections, missile-trail haze',
    // 2026-05-19 axis-system rewrite: toybox-chaos was rotating ONE medium per
    // render, which Flux locked onto and rendered as a single-medium scene
    // (defeating the path's mixed-medium chaos intent). Replaced with a
    // short multi-medium ensemble directive that front-loads "EVERY toy in
    // its OWN native medium". Pairs with the 6-slot toybox_storytelling
    // seed pool which bakes the story DNA.
    // 2026-05-19 R2 audit: aggressive shortening from 1500 → ~250 chars.
    // The long enumeration of 11 toy types was front-loading Flux's
    // attention budget with toy-vocabulary, which collapsed every scene
    // into a static Pop-Mart-style cute-toy lineup before the story
    // content registered. Trust the seed (which names each toy with its
    // medium inline) to do the heavy lifting per render.
    toybox_chaos_mixed:
      'mixed-medium toy diorama scene — each toy renders in its OWN distinct native material (plush=fabric, vinyl=cube-head, action-figure=articulated, die-cast=chrome, fashion-doll=glossy painted, army-men=olive-green plastic, Calico-Critter=flocked-velvet) — every toy carries its own native-material signature so the cast reads visually heterogeneous',
    // 2026-05-19 R0 plush-world rewrite — short directive (~250 chars)
    // anchoring "plush distinct per character" without front-loading
    // attention. Trust the seed (which names each plush + texture
    // inline) to do the heavy lifting. Pairs with the storybook-
    // diorama prompt prefix override above.
    plush_storytelling_mixed:
      'CUTE Squishmallow-style fluffy huggable plushies — oversized round-pudgy fiberfill bodies with visible plush-fur, soft floppy limbs, big embroidered or button eyes, sewn-on muzzles, optional tiny outfits — the plush cast comes from the seed; the aesthetic is cute-fluffy-huggable plush-toy quality throughout',
    // 2026-05-19 barbie-scene rewrite — short directive (~250 chars).
    // Anchors Mattel-style 11.5-inch fashion-doll aesthetic without
    // enumerating outfits or hair-colors (the seed names those per scene).
    barbie_storytelling_mixed:
      'Mattel-style 11.5-inch articulated fashion-dolls — glossy plastic bodies with molded hair (mix of blonde / brunette / redhead / black / pastel across the cast), oversized heads with painted-glossy-makeup faces, fashion-forward outfits varying per role, articulated joints, spike-heel or sneaker plastic shoes — doll cast comes from the seed; the aesthetic is GLOSSY-PLASTIC kid-playroom fashion-doll',
    // Vintage Kenner 3.75-inch space-saga action-figures (rebels / imperials /
    // hooded-monks / smugglers / bounty-hunters / droids / aliens). Bot-only.
    // Archetype-only — bans IP names (no Star Wars / Lucasfilm).
    // 2026-06-06 cruft audit — stripped IP allow-list (~15 named Star Wars
    // characters + 13 named locations/ships) + 7-gear catalog. This was direct
    // first-named-noun-lock fuel — Sonnet/Flux were grabbing the first IP name
    // as the subject. Path file's space_saga_scenes + space_saga_figures pools
    // carry the cast; medium carries Kenner-toy material truth only.
    space_saga_figures:
      'vintage Kenner 1977-1985 3.75-inch space-saga action-figure aesthetic — hand-painted plastic, bubble-card-mint paint quality, swivel-waist or limited-articulation, signature gear molded as part of body, real-physical-toys on handcrafted playset dioramas, dramatic practical Saturday-morning lighting',
    // 2026-05-24 dino-diorama — mixed media: REAL plastic toy dinosaurs (cast)
    // staged inside a HANDMADE CLAYMATION prehistoric WORLD (clay environment).
    // Front-loads "real plastic toy dinosaurs" so Flux renders the dinos as
    // toys, then locks the surrounding world to sculpted clay. Overrides the
    // bot-only DB flux_fragment.
    dino_diorama:
      'real plastic toy dinosaurs (visible mold-seams, toy-scale factory paint) staged in a sculpted-clay claymation environment (Aardman / Laika aesthetic, visible thumbprints, matte clay, glossy-clay rivers), mixed-media contrast, tabletop macro photography, deep focus, warm set-lighting',
    // 2026-05-24 giant-toys — photoreal SURREAL: ONE ordinary toy scaled to
    // COLOSSAL architectural size in a REAL real-world place. The toy's true
    // material is supplied by the giant_toy_subject pool; this medium locks the
    // hyperreal-photograph + monumental-scale + weirdcore framing. Inverse of
    // the tiny-toy mediums — the toy is HUGE and the world is full-size.
    // 2026-05-24 giant-toys — SHORT look-lock (~45 words). The earlier ~280-word
    // version front-loaded "standing in a real place / dwarfing tiny people" and
    // a long material + NOT list, which steamrolled the Sonnet-written goofy
    // SITUATION (Flux rendered a generic giant toy standing in a city instead).
    // Keep this minimal; the subject pool names the material, the situation pool
    // supplies the action. R1 diagnosis 2026-05-24.
    giant_toy_surreal:
      'an EPIC CINEMATIC film-still of a TOY BOSS BATTLE — a giant boss toy fighting a band of smaller toys, all real physical toys (plush / molded plastic / painted tin / vinyl) mid-fight at toy scale, staged in a real-world location, shot like a blockbuster movie: dramatic cinematic lighting, bold dynamic composition, shallow cinematic depth of field, atmospheric haze, lens flare, high production value, photoreal real-world light and shadows, the boss clearly bigger than the little toys — real physical toys throughout',
  },

  // Bot-wide fallback. Per-path filtering happens in `vibesByPath` below.
  vibes: [
    'cinematic',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  // Per-path vibe whitelists. Engine (lib/botEngine.js:resolveVibe) picks
  // from this when set; falls back to bot.vibes otherwise. Curated 2026-05-08
  // so each path only rolls vibes that match its tone (no coquette boss
  // battles, no voltage dollhouses, no shimmer army-men).
  vibesByPath: {
    claymation: [
      'cozy',
      'whimsical',
      'peaceful',
      'nostalgic',
      'enchanted',
      'ethereal',
      'ancient',
      'nightshade',
    ],
    vinyl: [
      'cinematic',
      'cozy',
      'whimsical',
      'nostalgic',
      'voltage',
      'coquette',
      'shimmer',
      'peaceful',
      'nightshade',
    ],
    sackboy: [
      'cozy',
      'whimsical',
      'peaceful',
      'enchanted',
      'coquette',
      'shimmer',
      'ethereal',
      'nostalgic',
    ],
    'shortcake-scene': [
      'cozy',
      'whimsical',
      'coquette',
      'shimmer',
      'peaceful',
      'enchanted',
      'ethereal',
    ],
    'barbie-scene': [
      'cozy',
      'whimsical',
      'coquette',
      'shimmer',
      'peaceful',
      'ethereal',
      'nostalgic',
    ],
    'gi-joe-missions': ['cinematic', 'epic', 'voltage', 'nostalgic', 'ancient', 'nightshade'],
    'green-army-warzone': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'miniature-dungeon': [
      'cinematic',
      'epic',
      'arcane',
      'ancient',
      'enchanted',
      'nightshade',
      'ethereal',
      'surreal',
    ],
    'collector-shelf-epic': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'epic-hero-bucket': ['cinematic', 'epic', 'voltage', 'nostalgic', 'ancient', 'nightshade'],
    'dollhouse-life': [
      'cozy',
      'whimsical',
      'coquette',
      'shimmer',
      'peaceful',
      'ethereal',
      'nostalgic',
      'enchanted',
    ],
    'hotwheels-city': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'model-train-world': [
      'cozy',
      'peaceful',
      'nostalgic',
      'ancient',
      'ethereal',
      'enchanted',
      'cinematic',
    ],
    'plush-world': [
      'cozy',
      'whimsical',
      'peaceful',
      'enchanted',
      'coquette',
      'shimmer',
      'ethereal',
      'nostalgic',
    ],
    'mech-toy-rampage': [
      'cinematic',
      'epic',
      'voltage',
      'nightshade',
      'ancient',
      'surreal',
      'arcane',
    ],
    'toybox-chaos': [
      'cinematic',
      'cozy',
      'epic',
      'nostalgic',
      'peaceful',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'coquette',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'space-saga-figures': [
      'cinematic',
      'epic',
      'voltage',
      'nostalgic',
      'ancient',
      'nightshade',
      'ethereal',
      'surreal',
    ],
    'monster-boss-battle': [
      'cinematic',
      'epic',
      'voltage',
      'nightshade',
      'arcane',
      'ancient',
      'surreal',
    ],
    // prehistoric drama + whimsy tone
    'dino-diorama': [
      'cinematic',
      'epic',
      'whimsical',
      'ancient',
      'nostalgic',
      'nightshade',
      'surreal',
      'voltage',
      'enchanted',
    ],
    // epic / blockbuster tone
    'toy-blockbuster': [
      'cinematic',
      'epic',
      'voltage',
      'nightshade',
      'ancient',
      'arcane',
      'surreal',
      'enchanted',
    ],
    // surreal / liminal / weirdcore — broad mood (quiet AND lively)
    'giant-toys': [
      'surreal',
      'cinematic',
      'ethereal',
      'nightshade',
      'nostalgic',
      'peaceful',
      'voltage',
      'shimmer',
    ],
  },

  paths: [
    'claymation',
    'vinyl',
    'sackboy',
    'shortcake-scene',
    'barbie-scene',
    'gi-joe-missions',
    'green-army-warzone',
    'miniature-dungeon',
    'collector-shelf-epic',
    'epic-hero-bucket',
    'dollhouse-life',
    // hotwheels-city deactivated 2026-06-30 (Kevin) — pulled from rotation.
    'model-train-world',
    'plush-world',
    'mech-toy-rampage',
    'toybox-chaos',
    'space-saga-figures',
    'monster-boss-battle',
    'dino-diorama',
    'toy-blockbuster',
    'giant-toys',
    'toy-landscapes',
  ],

  // toy-blockbuster is the flagship — weighted to exactly 25% of all renders.
  // The other 20 paths split the remaining 75% equally (3 each):
  //   20 / (20 + 20*3) = 20/80 = 25.0%.
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Chaos layer — subject-level distortions (silhouette/echo) ON for ALL paths.
  // model-train-world + toybox-chaos skip: 6-slot seed DNA is precisely tuned
  // and chaos injects incompatible tokens (tilt-shift / studio-strobe /
  // whiteout winter) that scramble the populated-scene intent. R6+R8 audits.
  chaos: {
    enabled: true,
    skipPaths: [
      'model-train-world',
      'toybox-chaos',
      'plush-world',
      'barbie-scene',
      'dino-diorama',
      'toy-blockbuster',
      'giant-toys',
      'toy-landscapes',
    ],
    allowSubjectChaosPaths: [
      'claymation',
      'vinyl',
      'sackboy',
      'shortcake-scene',
      'gi-joe-missions',
      'green-army-warzone',
      'miniature-dungeon',
      'collector-shelf-epic',
      'epic-hero-bucket',
      'dollhouse-life',
      'hotwheels-city',
      'mech-toy-rampage',
      'space-saga-figures',
    ],
  },

  // Two-pass Sonnet→Haiku polish — DISABLED bot-wide 2026-06-06.
  //
  // Background: 7 paths were already skipping polish because their 6-slot
  // baked DNA seeds (model-train-world / toybox-chaos / plush-world /
  // barbie-scene / dino-diorama / toy-blockbuster / giant-toys) carry rich
  // story DNA that Haiku's 65-90 word compression strips on the way to Flux.
  // miniature-dungeon also skipped because its off-diorama register lives
  // in the setting language.
  //
  // 2026-06-06: extending the same logic bot-wide. Phase 1 of the
  // story_beat retrofit (toybox_storytelling.json wired into 5 paths) shipped
  // briefs where Haiku was collapsing the story DNA to a single-character
  // standing portrait — exactly the failure mode the retrofit was meant to
  // fix. Kevin shut it down ("turn off the 2 pass polish for all toybot
  // paths"). Same lesson as the per-path skips: when setting + cast + story
  // matter as much as subject, Haiku reads the prose as descriptive fluff
  // and prioritizes the subject + a single action verb. Result is the
  // figurine-portrait register we're trying to escape.
  //
  // Re-enable per-path via `skipPaths: false` only after we've validated
  // that the polished output preserves story_beat content across 5 renders.
  twoPassPolish: {
    enabled: false,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
    skipPaths: [],
  },

  // Sensory anchors — lightcolor required, additional channels rolled.
  // pathContext: 'figure' for paths where toys are the subject, 'scene' for
  // pure-scenery paths (model-train-world).
  // model-train-world skips: scene-sensory pools contain tilt-shift /
  // lichen-tree / studio-strobe / cabinet-LED tokens that directly
  // contradict the path's warm-daylight playtime-scene DNA. R6 audit.
  sensoryAnchors: {
    enabled: true,
    skipPaths: [
      'model-train-world',
      'toybox-chaos',
      'plush-world',
      'barbie-scene',
      'dino-diorama',
      'toy-blockbuster',
      'giant-toys',
      'toy-landscapes',
    ],
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Figure-centric (toys are the subject)
      claymation: 'figure',
      vinyl: 'figure',
      sackboy: 'figure',
      'shortcake-scene': 'figure',
      'barbie-scene': 'figure',
      'gi-joe-missions': 'figure',
      'green-army-warzone': 'figure',
      'miniature-dungeon': 'figure',
      'collector-shelf-epic': 'figure',
      'epic-hero-bucket': 'figure',
      'dollhouse-life': 'figure',
      'hotwheels-city': 'figure',
      'model-train-world': 'scene', // no human/animal figures by design
      'plush-world': 'figure',
      'mech-toy-rampage': 'figure',
      'toybox-chaos': 'figure',
      'space-saga-figures': 'figure',
      'dino-diorama': 'figure',
      'toy-blockbuster': 'figure',
      'giant-toys': 'scene', // the giant toy IS the subject; no character figures
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths.
  // Universal slots (camera_angle, scenario, staging) resolve to these
  // unless a path overrides via pools: { slot: 'PATH_BESPOKE_POOL' }.
  defaultPools: {
    camera_angle: 'TOYBOT_CAMERA_ANGLES',
    scenario: 'TOYBOT_TOY_SCENARIOS',
    staging: 'TOYBOT_STAGING_AXIS',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`ToyBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    // 50/50 classic vs world. Vinyl + monster-boss-battle + model-train-world
    // don't fall back to classic — model-train-world's classic mode produces
    // the boring "model railroad diorama" failure mode (the entire reason for
    // the world-mode rewrite); force world to make every render real-everyday.
    // green-army-warzone + gi-joe-missions force world mode (R0 hearted state).
    const noClassicMode = new Set([
      'vinyl',
      'monster-boss-battle',
      'model-train-world',
      'green-army-warzone',
      'gi-joe-missions',
    ]);
    const renderMode = noClassicMode.has(path)
      ? 'world'
      : Math.random() < 0.5
        ? 'classic'
        : 'world';
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
      staging: picker.pickWithRecency(pools.STAGING_AXIS, 'staging'),
      camera: picker.pickWithRecency(pools.CAMERA_FRAMING, 'camera_framing'),
      renderMode,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`ToyBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy function-form paths export a function. Dispatch on shape.
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`ToyBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] ToyBot`;
  },
};
