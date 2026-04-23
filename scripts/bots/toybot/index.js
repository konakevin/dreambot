/**
 * ToyBot — the bot-engine contract.
 *
 * Every render is CINEMATIC toy-world storytelling. Action-packed movie-stills.
 * Each path pegged to specific toy medium via mediumByPath. Bot-only mediums
 * `stitched` and `action-figure` (NOT in public dream_mediums table — same
 * pattern as VenusBot's `surreal`).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'lego-epic': require('./paths/lego-epic'),
  claymation: require('./paths/claymation'),
  vinyl: require('./paths/vinyl'),
  'action-figure': require('./paths/action-figure'),
  sackboy: require('./paths/sackboy'),
  'toy-landscape': require('./paths/toy-landscape'),
  'calico-scene': require('./paths/calico-scene'),
  'shortcake-scene': require('./paths/shortcake-scene'),
  'barbie-scene': require('./paths/barbie-scene'),
  'tabletop-minis': require('./paths/tabletop-minis'),
  'army-men': require('./paths/army-men'),
  'gi-joe': require('./paths/gi-joe'),
  'action-hero': require('./paths/action-hero'),
};

module.exports = {
  username: 'toybot',
  displayName: 'ToyBot',

  // mediumByPath — each path locks to its medium (heavy use)
  // `stitched` + `action-figure` are bot-only mediums
  mediumByPath: {
    'lego-epic': 'lego',
    claymation: 'claymation',
    vinyl: 'vinyl',
    'action-figure': 'action-figure',
    sackboy: 'stitched',
    'toy-landscape': ['lego', 'lego', 'lego', 'claymation', 'vinyl'],
    'calico-scene': 'calico-figures',
    'shortcake-scene': 'shortcake-figures',
    'barbie-scene': 'barbie-figures',
    'tabletop-minis': 'tabletop-minis',
    'army-men': 'army-men',
    'gi-joe': 'gi-joe-figures',
    'action-hero': 'action-hero-figures',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-medium prompt injection — ToyBot's dialect for each toy medium.
  // This fragment gets injected between promptPrefix and the Sonnet-written
  // scene, giving each toy medium its unique stylistic anchor. Each medium
  // is rendered as a REAL PHYSICAL TOY photographed in a practical set —
  // the medium-specific construction + texture + articulation is what makes
  // each medium read visually distinct.
  mediumStyles: {
    lego:
      'authentic LEGO brick-construction figure, visible 4-stud tops on torso and shoulders, cylindrical hand-clips, blocky segmented limbs with pin-joint articulation, Minifig-scale proportions, smooth glossy ABS-plastic sheen with injection-mold seams, printed face decal, practical brick-set photography with soft studio light, toy-photography macro close depth-of-field, NOT digital-render NOT CGI NOT illustration',
    claymation:
      'stop-motion Plasticine clay puppet, visible thumbprints and sculpting-tool marks on the clay surface, slightly-asymmetric hand-sculpted features, painted glossy-enamel irises, armature-supported body with subtle clay seams, Aardman / Laika / Coraline / Wallace-and-Gromit aesthetic, matte-clay texture with occasional glossy highlight, practical miniature-set cinematography, NOT digital-render NOT illustration',
    vinyl:
      'designer art-toy vinyl figure, oversized-head proportions (approx 3:1 head-to-body), glossy ABS-plastic sheen with specular highlights, visible mold-parting seams, hand-painted details with crisp paint-lines, articulated ball-joints at shoulders and hips, Dunny / Bearbrick / Kidrobot / Mighty-Jaxx designer-toy aesthetic, collector-grade paint work, display-case studio photography, NOT Funko-Pop NOT cartoon NOT illustration',
    'action-figure':
      '1/12-scale posable action-figure, visible ball-joint articulation at neck / shoulders / elbows / wrists / hips / knees / ankles, hard-plastic body with cloth-hybrid costume elements, hand-painted weathering and detail wash, interchangeable accessories at scale, GI-Joe / Hot-Toys / Mezco / NECA / Hasbro-Black-Series aesthetic, practical diorama lighting with shallow depth-of-field, NOT CGI NOT illustration',
    stitched:
      'LittleBigPlanet Sackboy-world aesthetic — burlap / hessian brown-sackcloth body with visible thread stitching along every seam, iconic zipper-down-chest, round plastic-button eyes, felt mouth-and-eyebrow details sewn on, cotton-fiberfill soft rounded body, optional yarn-or-felt-strip hair, LBP craft-world environment where everything looks hand-sewn (fabric hills, cardboard trees, button flowers, yarn grass, corduroy stone, sponge rocks), Media Molecule LittleBigPlanet game-world cinematography, warm tungsten practical lighting on fabric texture, NOT CGI NOT Raggedy-Ann NOT generic-plushie NOT illustration',
    // Calico Critter / Sylvanian Families — cozy flocked-animal dollhouse figurines.
    // Bot-only medium.
    'calico-figures':
      'Calico Critters / Sylvanian Families aesthetic — flocked velvet-textured small-animal figurines (bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel) at ~3-inch dollhouse scale, painted plastic eyes, tiny cloth outfits with gingham / knit / calico detail (apron-dress / overalls / knit-sweater / bonnet / pinafore), fully-appointed miniature dollhouse sets with wooden furniture / tiny dishware / mini books / hand-sewn drapes, cozy wholesome daily-life energy, warm window-glow or lamp-glow practical lighting, shallow-depth-of-field miniature dollhouse photography, detail-rich handcrafted set — NOT real animal NOT CGI NOT illustration NOT anime',
    // 1980s OG girl-targeted scented-doll — Strawberry Shortcake era.
    // Bot-only medium.
    'shortcake-figures':
      '1980s Strawberry-Shortcake-era scented-doll aesthetic — 3-to-5-inch soft-plastic girl-doll figurines with oversized heads, huge round eyes, tiny nose, rosy painted blush, thick rooted pastel-yarn hair in strawberry-blonde / raspberry-pink / blueberry-blue / lemon-yellow / mint shades, gingham or calico apron-dress, pinafore, pantaloons, oversized berry-or-flower bonnet, striped tights, tiny ankle-boots, pastel dessert-and-flower-themed miniature playset with oversized-scale props (giant strawberry / cupcake-castle / lollipop-tree / rainbow-bridge / pie-cottage), warm golden-hour nostalgic 80s-catalog lighting, faded-catalog color grade, wholesome no-edge mood — NOT modern doll NOT real girl NOT CGI NOT anime',
    // Mattel Barbie fashion-doll world.
    // Bot-only medium.
    'barbie-figures':
      'Mattel-scale 11.5-inch fashion-doll aesthetic — articulated plastic fashion-doll bodies, molded hair (blonde / brunette / redhead / black / pastel-dyed variety), oversized head with glossy painted-makeup (winged eyeliner / pink-lip / highlight), fashion-forward mini-wardrobe (evening-gown / power-suit / swimsuit / astronaut / chef / rockstar / ballerina / vet-coat), spike-heel plastic shoes molded to foot, fully-dressed DreamHouse / boutique / rooftop-pool / convertible-pink-car / runway playset, pink-dominant signature palette, glossy-plastic sheen, studio soft-box or golden-hour practical lighting, cinematic Barbie-film composition, shallow depth-of-field toy-photography — NOT real woman NOT CGI NOT illustration NOT anime NOT live-action',
    // Warhammer / D&D painted tabletop miniatures on terrain.
    // Bot-only medium.
    'tabletop-minis':
      'Warhammer / Dungeons-&-Dragons / Reaper / WizKids tabletop-miniature aesthetic — 28mm-to-32mm scale painted pewter-or-plastic fantasy figures with visible brush-strokes, wash-shaded recesses, drybrushed highlights on raised edges, metallic-armor paint, freehand shield-crest detail, mounted on round flocked bases with static-grass / cork-rock / sand / snow texture, handcrafted terrain dioramas with sculpted-foam rocks / lichen-trees / plaster ruins / resin-water, Games-Workshop / Reaper / WizKids collector-grade pro-painter display DNA, dramatic cabinet-LED spotlight with warm-key rim-light, shallow-depth display-cabinet photography — NOT CGI NOT illustration NOT real fantasy scene NOT anime',
    // Classic green-army-men single-pose molded-plastic toy soldiers.
    // Bot-only medium.
    'army-men':
      'classic Bucket-O-Soldiers / Toy-Story 2nd-battalion / green-army-men aesthetic — monochromatic solid-color molded-plastic toy soldiers (army-green / olive-drab / tan-desert / grey-Wehrmacht / sand-Marine variants), ~2-inch scale, fixed cast-in-plastic single-pose (crouch-and-fire / bayonet-charge / binocular-spot / bazooka-shoulder / radio-operator / grenade-throw / flamethrower / flag-bearer / prone-rifleman), visible vertical mold-seam down each figure, plastic-shine where light catches, oval connector-base attached underfoot, helmet / rifle / backpack / canteen molded as one piece with body, handcrafted WWII-diorama or oversized-real-world backyard-epic practical set, cotton-ball smoke / flash-bulb explosion-burst / dramatic spotlight lighting, multiple soldiers in frame — NOT articulated NOT action-figure NOT real soldier NOT CGI NOT illustration',
    // 1980s GI-Joe-era articulated-commando action-figures. Bot-only medium.
    'gi-joe-figures':
      '1980s GI-Joe-era articulated-commando action-figure aesthetic — 3.75-inch hand-painted multicolor military action-figures with swivel-waist / ball-joint arms / rubber-band-waist construction, colorful commando wardrobe (camo fatigues / berets / goggles / bandannas / chest-rig / dogtags), named-code-style commando archetypes (masked-operative / mohawk-soldier / ninja-operative / gruff-sergeant / demolitions-expert / pilot-ace / jungle-specialist / arctic-specialist) paired against masked terror-organization faceless-troopers in silver-visor helmets with armored jumpsuits and chrome-faceplate / hooded-cloak / snake-motif commanders, fully-dressed battle-playset with iconic plastic military vehicles (tank / jeep / assault-chopper / hoverbike / attack-cruiser), bright Saturday-morning-cartoon-serial energy, cotton-ball smoke / flash-bulb explosion-burst / dramatic practical lighting — NOT classic single-pose army-men NOT real soldier NOT CGI NOT illustration',
    // Vintage 80s/90s "epic" action-figures — He-Man + Star-Wars + cape-and-cowl DNA rolled up. Bot-only medium.
    'action-hero-figures':
      'vintage 80s/90s "epic" action-figure aesthetic — rolled-up bucket covering (a) 5-to-7-inch hyper-muscled sword-and-sorcery Masters-of-Universe-style hand-painted figures (barbarian-hero / sorceress / skeletal-villain / muscle-champion / beast-warrior with loincloth-fur-boots-cross-straps, magic-sword or battle-axe, crystal-staff), (b) 3.75-inch space-adventurer-era figures (hooded laser-sword monk / dark-helmet full-face-mask villain / scruffy vested smuggler / astromech-or-protocol droid / flight-suited rebel-pilot / T-visor-helmeted bounty-hunter / fur-covered alien-sidekick), (c) cape-and-cowl generic superhero figures (caped champion with geometric chest-emblem / dark hooded vigilante with utility-belt and grappling-gun / winged hero / cosmic hero with glowing ring or staff / powered-armor hero with glowing chest-reactor / amazon warrior with tiara-and-bracers / horned cape-villain with scepter), hand-painted bright primary-color plastic, swivel-waist articulation, fully-dressed handcrafted playset diorama, dramatic toy-commercial lighting (backlit rim-light / fog-haze / laser-bolt-glow / magic-crystal glow), Saturday-morning-epic-serial energy — NOT IP-named NOT real-person NOT CGI NOT illustration',
  },

  // Inverts old excludeVibes (dark/fierce/psychedelic/macabre).
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

  paths: [
    'lego-epic',
    'claymation',
    'vinyl',
    'action-figure',
    'sackboy',
    'toy-landscape',
    'calico-scene',
    'shortcake-scene',
    'barbie-scene',
    'tabletop-minis',
    'army-men',
    'gi-joe',
    'action-hero',
  ],

  pathWeights: {
    'lego-epic': 2,
    claymation: 1,
    vinyl: 1,
    'action-figure': 1,
    sackboy: 1,
    'toy-landscape': 2,
    'calico-scene': 1,
    'shortcake-scene': 1,
    'barbie-scene': 1,
    'tabletop-minis': 1,
    'army-men': 1,
    'gi-joe': 1,
    'action-hero': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
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
