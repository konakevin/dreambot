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

const pathBuilders = {
  // existing
  claymation: require('./paths/claymation'),
  vinyl: require('./paths/vinyl'),
  sackboy: require('./paths/sackboy'),
  'toy-landscape': require('./paths/toy-landscape'),
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
};

module.exports = {
  username: 'toybot',
  displayName: 'ToyBot',

  // mediumByPath — each path locks to its medium.
  // toybox-chaos rotates across an array per render to deliberately mix
  // the visual signature.
  mediumByPath: {
    claymation: 'claymation',
    vinyl: 'vinyl',
    sackboy: 'stitched',
    'toy-landscape': ['claymation', 'vinyl'],
    'shortcake-scene': 'shortcake_figures',
    'barbie-scene': 'barbie_figures',
    'gi-joe-missions': 'gi_joe_figures',
    'green-army-warzone': 'army_men',
    'miniature-dungeon': 'tabletop_minis',
    'collector-shelf-epic': 'action_figure',
    'epic-hero-bucket': 'action_hero_figures',
    'dollhouse-life': 'dollhouse_figures',
    'hotwheels-city': 'hot_wheels',
    'model-train-world': 'model_train_diorama',
    'plush-world': 'plush_fabric',
    'mech-toy-rampage': 'mech_toys',
    'toybox-chaos': ['action_figure', 'plush_fabric', 'hot_wheels', 'barbie_figures', 'army_men'],
    'space-saga-figures': 'space_saga_figures',
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
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path prompt prefix override — Funko Pop visual identity is front-loaded
  // for the vinyl path so Flux's early-token weighting locks the look. Without
  // this, the generic toy-photography prefix dilutes Funko-specific cues.
  promptPrefixByPath: {
    vinyl:
      'photograph of authentic Funko Pop vinyl collectible figures with signature oversized SQUARE CUBE heads, small stocky bodies, tiny legs, large round solid-black dot eyes (no pupils), glossy matte vinyl, classic Funko Pop boxed-collectible look',
  },

  // Per-medium prompt injection — ToyBot's dialect for each toy medium.
  // Injected between promptPrefix and the Sonnet-written scene. Each medium
  // is rendered as a REAL PHYSICAL TOY photographed in a practical set.
  mediumStyles: {
    claymation:
      'stop-motion Plasticine clay puppet, visible thumbprints and sculpting-tool marks on the clay surface, slightly-asymmetric hand-sculpted features, painted glossy-enamel irises, armature-supported body with subtle clay seams, Aardman / Laika / Coraline / Wallace-and-Gromit aesthetic, matte-clay texture with occasional glossy highlight, practical miniature-set cinematography, NOT digital-render NOT illustration',
    vinyl:
      'Funko Pop vinyl collectible figure, signature Funko Pop proportions (oversized SQUARE CUBE head approx 1:1 with body, small stocky body, tiny legs), large round solid-black dot eyes (no pupils, glossy black), tiny printed mouth or no mouth, glossy matte vinyl finish, mass-produced collectible aesthetic, printed costume / fur / accessory details, Funko Pop figure boxed-collectible look — NOT Dunny NOT Bearbrick NOT Kidrobot NOT designer-art-toy, ONLY classic Funko Pop visual language',
    action_figure:
      '1/12-scale posable action-figure, visible ball-joint articulation at neck / shoulders / elbows / wrists / hips / knees / ankles, hard-plastic body with cloth-hybrid costume elements, hand-painted weathering and detail wash, interchangeable accessories at scale, GI-Joe / Hot-Toys / Mezco / NECA / Hasbro-Black-Series aesthetic, practical diorama lighting with shallow depth-of-field, NOT CGI NOT illustration',
    stitched:
      'LittleBigPlanet Sackboy-world aesthetic — burlap / hessian brown-sackcloth body with visible thread stitching along every seam, iconic zipper-down-chest, round plastic-button eyes, felt mouth-and-eyebrow details sewn on, cotton-fiberfill soft rounded body, optional yarn-or-felt-strip hair, LBP craft-world environment where everything looks hand-sewn (fabric hills, cardboard trees, button flowers, yarn grass, corduroy stone, sponge rocks), Media Molecule LittleBigPlanet game-world cinematography, practical lighting that follows the pool palette, NOT CGI NOT Raggedy-Ann NOT generic-plushie NOT illustration',
    // Calico Critters — kept for legacy callers; dollhouse-life uses dollhouse_figures.
    calico_figures:
      'Calico Critters / Sylvanian Families aesthetic — flocked velvet-textured small-animal figurines (bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel) at ~3-inch dollhouse scale, painted plastic eyes, tiny cloth outfits with gingham / knit / calico detail (apron-dress / overalls / knit-sweater / bonnet / pinafore), fully-appointed miniature dollhouse sets with wooden furniture / tiny dishware / mini books / hand-sewn drapes, cozy wholesome daily-life energy, practical lighting per pool palette, shallow-depth-of-field miniature dollhouse photography, detail-rich handcrafted set — NOT real animal NOT CGI NOT illustration NOT anime',
    // dollhouse-life — broader figurine medium. Rolls one of three traditions
    // inside the path file. Generic phrasing here covers all three.
    dollhouse_figures:
      'dollhouse-scale miniature figurines in a fully-appointed handcrafted miniature interior — could be flocked Calico-Critter-style small-animals, vintage wooden / soft-plastic dollhouse-people, or modern Lori / Lottie-style posable fashion-doll-scale humans, painted faces, tiny cloth outfits, wooden furniture / tiny dishware / mini books / hand-sewn drapes / miniature appliances at scale, warm window-glow or lamp-glow practical lighting, cozy wholesome daily-life energy — NOT real human NOT real animal NOT CGI NOT illustration',
    shortcake_figures:
      '1980s Strawberry-Shortcake-era scented-doll aesthetic — 3-to-5-inch soft-plastic girl-doll figurines with oversized heads, huge round eyes, tiny nose, rosy painted blush, thick rooted pastel-yarn hair in strawberry-blonde / raspberry-pink / blueberry-blue / lemon-yellow / mint shades, gingham or calico apron-dress, pinafore, pantaloons, oversized berry-or-flower bonnet, striped tights, tiny ankle-boots, pastel dessert-and-flower-themed miniature playset with oversized-scale props (giant strawberry / cupcake-castle / lollipop-tree / rainbow-bridge / pie-cottage), nostalgic 80s-catalog lighting that follows the pool palette, faded-catalog color grade, wholesome no-edge mood — NOT modern doll NOT real girl NOT CGI NOT anime',
    barbie_figures:
      'Mattel-scale 11.5-inch fashion-doll aesthetic — articulated plastic fashion-doll bodies, molded hair (blonde / brunette / redhead / black / pastel-dyed variety), oversized head with glossy painted-makeup (winged eyeliner / pink-lip / highlight), fashion-forward mini-wardrobe (evening-gown / power-suit / swimsuit / astronaut / chef / rockstar / ballerina / vet-coat), spike-heel plastic shoes molded to foot, fully-dressed DreamHouse / boutique / rooftop-pool / convertible-pink-car / runway playset, pink-dominant signature palette, glossy-plastic sheen, practical lighting per pool palette, cinematic Barbie-film composition, shallow depth-of-field toy-photography — NOT real woman NOT CGI NOT illustration NOT anime NOT live-action',
    tabletop_minis:
      'Warhammer / Dungeons-&-Dragons / Reaper / WizKids tabletop-miniature aesthetic — 28mm-to-32mm scale painted pewter-or-plastic fantasy figures with visible brush-strokes, wash-shaded recesses, drybrushed highlights on raised edges, metallic-armor paint, freehand shield-crest detail, mounted on round flocked bases with static-grass / cork-rock / sand / snow texture, handcrafted terrain dioramas with sculpted-foam rocks / lichen-trees / plaster ruins / resin-water, Games-Workshop / Reaper / WizKids collector-grade pro-painter display DNA, dramatic cabinet-LED spotlight rim-light per pool palette, shallow-depth display-cabinet photography — NOT CGI NOT illustration NOT real fantasy scene NOT anime',
    army_men:
      'classic Bucket-O-Soldiers / Toy-Story 2nd-battalion / green-army-men aesthetic — monochromatic solid-color molded-plastic toy soldiers (army-green / olive-drab / tan-desert / grey-Wehrmacht / sand-Marine variants), ~2-inch scale, fixed cast-in-plastic single-pose (crouch-and-fire / bayonet-charge / binocular-spot / bazooka-shoulder / radio-operator / grenade-throw / flamethrower / flag-bearer / prone-rifleman), visible vertical mold-seam down each figure, plastic-shine where light catches, oval connector-base attached underfoot, helmet / rifle / backpack / canteen molded as one piece with body, handcrafted WWII-diorama or oversized-real-world backyard-epic practical set, cotton-ball smoke / flash-bulb explosion-burst / dramatic spotlight lighting, multiple soldiers in frame — NOT articulated NOT action-figure NOT real soldier NOT CGI NOT illustration',
    gi_joe_figures:
      '1980s GI-Joe-era articulated-commando action-figure aesthetic — 3.75-inch hand-painted multicolor military action-figures with swivel-waist / ball-joint arms / rubber-band-waist construction, colorful commando wardrobe (camo fatigues / berets / goggles / bandannas / chest-rig / dogtags), named-code-style commando archetypes (masked-operative / mohawk-soldier / ninja-operative / gruff-sergeant / demolitions-expert / pilot-ace / jungle-specialist / arctic-specialist) paired against masked terror-organization faceless-troopers in silver-visor helmets with armored jumpsuits and chrome-faceplate / hooded-cloak / snake-motif commanders, fully-dressed battle-playset with iconic plastic military vehicles (tank / jeep / assault-chopper / hoverbike / attack-cruiser), bright Saturday-morning-cartoon-serial energy, cotton-ball smoke / flash-bulb explosion-burst / dramatic practical lighting — NOT classic single-pose army-men NOT real soldier NOT CGI NOT illustration',
    action_hero_figures:
      'vintage 80s/90s "epic" action-figure aesthetic — rolled-up bucket covering (a) 5-to-7-inch hyper-muscled sword-and-sorcery Masters-of-Universe-style hand-painted figures (barbarian-hero / sorceress / skeletal-villain / muscle-champion / beast-warrior with loincloth-fur-boots-cross-straps, magic-sword or battle-axe, crystal-staff), (b) 3.75-inch space-adventurer-era figures (hooded laser-sword monk / dark-helmet full-face-mask villain / scruffy vested smuggler / astromech-or-protocol droid / flight-suited rebel-pilot / T-visor-helmeted bounty-hunter / fur-covered alien-sidekick), (c) cape-and-cowl generic superhero figures (caped champion with geometric chest-emblem / dark hooded vigilante with utility-belt and grappling-gun / winged hero / cosmic hero with glowing ring or staff / powered-armor hero with glowing chest-reactor / amazon warrior with tiara-and-bracers / horned cape-villain with scepter), hand-painted bright primary-color plastic, swivel-waist articulation, fully-dressed handcrafted playset diorama, dramatic toy-commercial lighting (backlit rim-light / fog-haze / laser-bolt-glow / magic-crystal glow), Saturday-morning-epic-serial energy — NOT IP-named NOT real-person NOT CGI NOT illustration',
    hot_wheels:
      'Hot Wheels / Micro Machines die-cast toy cars — 1:64-scale (~3-inch) die-cast metal-and-plastic toy cars with chrome accents, glossy paint, oversized hot-rod-style wheels, racing-stripes or flame-decals, visible mold-seam underneath, real-world-surface practical-set photography (kitchen counter / driveway / bedroom rug / garage floor / picnic blanket / coffee table / patio), speed-blur on tires, dust-puff under wheels, headlight cones cutting through shadow, bright die-cast-car-commercial energy — NOT real car NOT 1:18-scale collector NOT CGI NOT illustration',
    model_train_diorama:
      'HO-scale (1:87) or N-scale model-railroad diorama — tiny die-cast steam locomotive or diesel engine pulling boxcars / passenger cars / coal-tenders / cabooses on twin nickel-silver rails, hand-built terrain features (ground foam, lichen trees, plaster-cast rock-faces, static-grass meadows, scratch-built brick depots, signal-towers, water-tower, level-crossing, lift-bridge), NO HUMAN FIGURES in frame, visible model-railroad construction tells (raised baseboard edge OK), lit windows in tiny depot, smoke from engine stack, atmospheric haze in valleys, cozy obsessive-detail energy — NEVER real train NEVER CGI NEVER illustration NEVER scale-people-figures filling frame',
    plush_fabric:
      'plush stuffed-animal characters — soft-fabric creatures with visible plush-fiber FUR or KNIT TEXTURE, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, optional tiny knit sweaters or cloth bandanas, fully-dressed handcrafted miniature sets (forest campsite, sailboat, picnic meadow, attic bedroom, treehouse), warm firelight / lantern-glow / golden-hour / moonlit-window practical lighting, storybook warmth — NOT LBP burlap-with-zipper (that is Sackboy) NOT real animal NOT CGI NOT illustration',
    mech_toys:
      'articulated mech-toys — robot-toys / Gundam-style model-kits / transforming-mech-toys with visible ball-joint articulation at neck / shoulders / elbows / wrists / hips / knees / ankles, chrome-plated paneling and armor plates, visible transformation seams (line-cuts where panels would fold/flip), cockpit-canopy with glowing tinted plastic, hand-painted weathering / battle-damage / panel-line wash, snap-on weapon accessories (energy-sword / plasma-rifle / shield / shoulder-cannon / missile-pod), 1/144 to 1/100 collector scale, real-physical-toys on a handcrafted set, chrome reflections, cockpit-glow, sparks-flying, missile-trail haze — NEVER IP-named NEVER CGI NEVER illustration',
    // Vintage Kenner 3.75-inch space-saga action-figures (rebels / imperials /
    // hooded-monks / smugglers / bounty-hunters / droids / aliens). Bot-only.
    // Archetype-only — bans IP names (no Star Wars / Lucasfilm).
    space_saga_figures:
      'authentic vintage Kenner 1977-1985 Star Wars 3.75-inch action-figures — hand-painted plastic, bubble-card-mint paint quality, swivel-waist or limited-articulation, signature gear molded as part of body (lightsabers, blasters, jetpacks, helmets, capes, robes, droid-tools), real-physical-toys on handcrafted playset dioramas, named characters allowed (Luke / Leia / Han / Vader / Yoda / Boba Fett / Stormtroopers / R2-D2 / C-3PO / Chewbacca / Obi-Wan / Greedo / Ewoks / Tusken Raiders / Wampa / etc.), iconic Star Wars locations and ships (Tatooine / Hoth / Endor / Dagobah / Bespin / Death Star / Mos Eisley cantina / X-wings / TIE Fighters / Millennium Falcon / AT-ATs / Sandcrawlers), NEVER CGI, NEVER illustration',
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
    claymation: ['cozy', 'whimsical', 'peaceful', 'nostalgic', 'enchanted', 'ethereal', 'ancient', 'nightshade'],
    vinyl: ['cinematic', 'cozy', 'whimsical', 'nostalgic', 'voltage', 'coquette', 'shimmer', 'peaceful', 'nightshade'],
    sackboy: ['cozy', 'whimsical', 'peaceful', 'enchanted', 'coquette', 'shimmer', 'ethereal', 'nostalgic'],
    'toy-landscape': ['cinematic', 'cozy', 'epic', 'peaceful', 'ethereal', 'ancient', 'enchanted', 'nostalgic', 'nightshade', 'shimmer', 'voltage'],
    'shortcake-scene': ['cozy', 'whimsical', 'coquette', 'shimmer', 'peaceful', 'enchanted', 'ethereal'],
    'barbie-scene': ['cozy', 'whimsical', 'coquette', 'shimmer', 'peaceful', 'ethereal', 'nostalgic'],
    'gi-joe-missions': ['cinematic', 'epic', 'voltage', 'nostalgic', 'ancient', 'nightshade'],
    'green-army-warzone': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'miniature-dungeon': ['cinematic', 'epic', 'arcane', 'ancient', 'enchanted', 'nightshade', 'ethereal', 'surreal'],
    'collector-shelf-epic': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'epic-hero-bucket': ['cinematic', 'epic', 'voltage', 'nostalgic', 'ancient', 'nightshade'],
    'dollhouse-life': ['cozy', 'whimsical', 'coquette', 'shimmer', 'peaceful', 'ethereal', 'nostalgic', 'enchanted'],
    'hotwheels-city': ['cinematic', 'epic', 'voltage', 'nostalgic', 'nightshade', 'ancient'],
    'model-train-world': ['cozy', 'peaceful', 'nostalgic', 'ancient', 'ethereal', 'enchanted', 'cinematic'],
    'plush-world': ['cozy', 'whimsical', 'peaceful', 'enchanted', 'coquette', 'shimmer', 'ethereal', 'nostalgic'],
    'mech-toy-rampage': ['cinematic', 'epic', 'voltage', 'nightshade', 'ancient', 'surreal', 'arcane'],
    'toybox-chaos': ['cinematic', 'cozy', 'epic', 'nostalgic', 'peaceful', 'whimsical', 'ethereal', 'arcane', 'ancient', 'enchanted', 'coquette', 'voltage', 'nightshade', 'shimmer', 'surreal'],
    'space-saga-figures': ['cinematic', 'epic', 'voltage', 'nostalgic', 'ancient', 'nightshade', 'ethereal', 'surreal'],
    'monster-boss-battle': ['cinematic', 'epic', 'voltage', 'nightshade', 'arcane', 'ancient', 'surreal'],
  },

  paths: [
    'claymation',
    'vinyl',
    'sackboy',
    'toy-landscape',
    'shortcake-scene',
    'barbie-scene',
    'gi-joe-missions',
    'green-army-warzone',
    'miniature-dungeon',
    'collector-shelf-epic',
    'epic-hero-bucket',
    'dollhouse-life',
    'hotwheels-city',
    'model-train-world',
    'plush-world',
    'mech-toy-rampage',
    'toybox-chaos',
    'space-saga-figures',
    'monster-boss-battle',
  ],

  pathWeights: {
    claymation: 1,
    vinyl: 1,
    sackboy: 1,
    'toy-landscape': 2,
    'shortcake-scene': 1,
    'barbie-scene': 1,
    'gi-joe-missions': 1,
    'green-army-warzone': 1,
    'miniature-dungeon': 1,
    'collector-shelf-epic': 1,
    'epic-hero-bucket': 1,
    'dollhouse-life': 1,
    'hotwheels-city': 2,
    'model-train-world': 1,
    'plush-world': 1,
    'mech-toy-rampage': 1,
    'toybox-chaos': 2,
    'space-saga-figures': 1,
    'monster-boss-battle': 1,
  },

  // Chaos layer — subject-level distortions (silhouette/echo) ON for ALL paths.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'claymation', 'vinyl', 'sackboy', 'toy-landscape',
      'shortcake-scene', 'barbie-scene', 'gi-joe-missions',
      'green-army-warzone', 'miniature-dungeon', 'collector-shelf-epic',
      'epic-hero-bucket', 'dollhouse-life', 'hotwheels-city',
      'model-train-world', 'plush-world', 'mech-toy-rampage', 'toybox-chaos',
      'space-saga-figures',
    ],
  },

  // Two-pass Sonnet→Haiku polish for tighter Flux-ready prompts.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
  },

  // Sensory anchors — lightcolor required, additional channels rolled.
  // pathContext: 'figure' for paths where toys are the subject, 'scene' for
  // pure-scenery paths (toy-landscape, model-train-world).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Figure-centric (toys are the subject)
      claymation: 'figure',
      vinyl: 'figure',
      sackboy: 'figure',
      'toy-landscape': 'scene',
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
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    // 50/50 classic vs world. Vinyl + monster-boss-battle don't have
    // path-native classic SCENES pools (vinyl was rebuilt for Funko slice-of-
    // life, boss-battle is new in 2026-05) — force them to world mode.
    const noClassicMode = new Set(['vinyl', 'monster-boss-battle']);
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
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] ToyBot`;
  },
};
