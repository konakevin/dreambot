/**
 * Meta-prompt registry for GothBot sensory channel pools.
 *
 * Three contexts (female / male / scene) × seven channels (smell / sound /
 * touch / temperature / weight / air / lightcolor) = 21 distinct pools.
 *
 * Each registry entry is a function that takes (n) and returns the meta
 * prompt string for Sonnet to generate `n` distinct entries for that
 * (context, channel) pair.
 *
 * Usage from the per-channel gen scripts:
 *
 *   const { metaPrompts } = require('./sensoryMeta');
 *   generatePool({
 *     outPath: 'scripts/bots/gothbot/seeds/sensory_female_smell.json',
 *     total: 50,
 *     batch: 25,
 *     metaPrompt: metaPrompts.female.smell,
 *   });
 */

// ─────────────────────────────────────────────────────────────
// Shared rules — repeated in every meta prompt for consistency
// ─────────────────────────────────────────────────────────────

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO subject demographic claims ("ancient", "queen", "Victorian woman")
- NO duplicate verb+noun pairs across entries
- Aesthetic register: gothic, dark-fantasy, vampire, cathedral, cursed, decaying, ornate, baroque

━━━ AESTHETIC ANCHORS (use freely, mix and match) ━━━
- objects: incense, candle wax, frankincense, embalming wax, dried roses, raven feathers,
  velvet, silk, lace, brass, iron, silver, jet, obsidian, mother-of-pearl, pipe organ,
  bell tower, choir, mausoleum, crypt, mosaic, stained glass, chandelier, sarcophagus,
  thurible, censer, oil lamp, torchlight, gargoyle, cobweb, mildew, moss, dust
- materials: stone, marble, granite, slate, oak, ash, bone, ivory, crystal, copper,
  bronze, parchment, vellum, tarnished silver, blackened iron
- environments: nave, transept, apse, undercroft, sacristy, cloister, bell tower, vault,
  catacomb, ossuary, scriptorium, abbey, monastery, sanctuary, reliquary, chapel`;

// ─────────────────────────────────────────────────────────────
// FEMALE channel pools — subject is a female-presenting character
// ─────────────────────────────────────────────────────────────

const female = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for GothBot's FEMALE-character paths (vampire-girls-2, goth-closeup, goth-full-body). Each entry is one short olfactory cue tied to a female-presenting vampire/goth subject in a gothic setting.

Smell entries should evoke: scents on her body / clothing / hair / breath, or scents in the immediate gothic environment around her.

EXAMPLES (DO NOT REUSE — invent new ones in this register):
- "her perfume mingling with frankincense smoke"
- "rose oil on her wrist beneath dried blood"
- "myrrh clinging to the lace at her collar"
- "iron and copper traced in her breath"
- "tallow candles guttering near her hair"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN (rose, frankincense, blood, etc.) AND the LOCATION (her hair, her breath, her wrist, her collar). Vary at least one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for GothBot's FEMALE-character paths. Each entry is one short auditory cue — sounds the female subject makes, hears, or is surrounded by in the gothic setting.

Sound entries should evoke: her own movement / breath / voice, or environmental sounds nearby (organ, bell, candle, raven, wind, distant choir).

EXAMPLES (DO NOT REUSE):
- "silk skirt whispering across stone"
- "her own slow breath in the silence"
- "single fang clicking against crystal goblet"
- "raven wings beating at the rose window above her"
- "a corset bone creaking as she shifts"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE (her breath, raven, organ, etc.) AND the QUALITY (whispering, beating, ringing, etc.). Vary one of the two.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for GothBot's FEMALE-character paths. Each entry is one short tactile cue — what she feels against her skin, what she's touching with her hands, what's pressing or scraping or wrapping her body.

Touch entries should reference: her skin / hands / throat / shoulders / fingertips / lips / hair, in contact with gothic materials (lace, velvet, silk, iron, stone, blood, wax, claws).

EXAMPLES (DO NOT REUSE):
- "lace digging at her throat"
- "candle wax cooling on her hand"
- "blood drying tacky on her chin"
- "cold marble pressing against her bare shoulder"
- "claws scraping the gilt frame at her hip"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the BODY PART (throat, hand, hip, etc.) AND the SENSATION VERB (digging, cooling, pressing, etc.). Vary one of the two.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for GothBot's FEMALE-character paths. Each entry is one short thermal cue — heat or cold sensation on her body, or in the gothic space around her.

Temperature entries should evoke: warmth (candle/torch/forge/blood/breath) or cold (stone/crypt/moonlight/grave/winter) interacting with her body specifically.

EXAMPLES (DO NOT REUSE):
- "breath fogging in the still chapel air"
- "fever-heat trapped in her fur collar"
- "stone floor radiating crypt-cold up through her bare feet"
- "a single candle's amber pocket of warmth at her cheek"
- "body heat absent from her skin where blood once flowed"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE (candle, stone, breath, etc.) AND the BODY PART. Vary one of the two.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for GothBot's FEMALE-character paths. Each entry is one short cue evoking heaviness, drag, or pressure on her body — usually clothing, jewelry, or carried objects.

Weight entries should reference: gowns / capes / trains / crowns / chains / jewelry / weapons / books / chalices interacting with her body's specific physics.

EXAMPLES (DO NOT REUSE):
- "century-heavy crown pressing her brow"
- "chainmail hood pulling her shoulders down"
- "a jet locket dragging against her sternum"
- "a train of velvet sweeping mosaic behind her"
- "a brass crucifix swinging from her belt"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the GARMENT/OBJECT (crown, locket, train, etc.) AND the BODY PART. Vary one of the two.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (
    n
  ) => `You are writing ${n} distinct AIR anchors for GothBot's FEMALE-character paths. Each entry is one short cue evoking atmospheric movement — particles drifting, smoke curling, mist trailing, hair stirring — around her body.

Air entries should evoke visible atmosphere: smoke / dust / mist / pollen / snow / sparks / breath cloud / candle haze in motion near her.

EXAMPLES (DO NOT REUSE):
- "incense haze drifting past her cheek"
- "candle smoke curling around her fingers"
- "dust motes turning slow in the shaft of light around her"
- "frost crystallizing on the stained glass behind her"
- "her breath cloud trailing as she turns"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM (smoke, dust, mist, etc.) AND the MOTION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for GothBot's FEMALE-character paths. Each entry forces Flux to render a SPECIFIC, PUNCHY lighting palette on her face/body — overriding Sonnet's safe defaults.

Each entry must include: COLOR + DIRECTION (key/rim/sidelight/underlight/uplight/backlight/spot/shaft) + IMPACT POINT on her body or composition.

EXAMPLES (DO NOT REUSE):
- "blood-red key light cutting across her face"
- "fel-green underlight rising from below her chin"
- "ice-cyan moonlight rim sculpting her silhouette"
- "void-violet sidelight tracing her profile"
- "magenta-pink stained-glass shaft falling diagonal across her face"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
- BLOOD/CRIMSON family (8-9): blood-red, crimson, oxblood, ruby, scarlet, garnet
- VIOLET/PURPLE family (6-8): void-violet, royal-violet, amethyst, void-purple, deep-plum
- GREEN family (5-7): fel-green, poison-green, witch-fire, jade, sickly-green, sulfur
- BLUE/CYAN family (5-7): ice-cyan, sapphire-blue, electric-blue, midnight-blue, void-cyan
- GOLD/AMBER family (5-7): forge-amber, sulfur-yellow, alchemist-gold, brass, ember-gold
- WHITE/SILVER family (3-5): bone-white, mercury-silver, moonlight-white, chrome
- PINK/MAGENTA family (3-5): magenta-pink, blood-pink, rose-violet
- TEAL/TURQUOISE family (2-4): teal, viridian, deep-aqua

━━━ DIRECTION SPREAD ━━━
Distribute roughly: key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6), other (rest).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR comes first, then DIRECTION, then IMPACT
- Comma-separated phrases when needed
- No "and" stacking ("blood-red AND violet" — pick one)
- Aesthetic register: gothic vampire / cathedral / occult

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary at least one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// MALE channel pools — subject is a male-presenting character
// ─────────────────────────────────────────────────────────────

const male = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for GothBot's MALE-character paths (goth-male-closeup, goth-male-full-body). Each entry is one short olfactory cue tied to a male-presenting vampire/goth subject in a gothic setting.

Smell entries should evoke scents on his body / clothing / weapons / hair, or in the immediate gothic environment around him.

EXAMPLES (DO NOT REUSE):
- "leather and woodsmoke clinging to his cloak"
- "iron and gun oil on his hands"
- "incense smoke caught in his beard"
- "old whiskey and tallow on his breath"
- "tanned hide and sweat under chainmail"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on/around him. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for GothBot's MALE-character paths. Each entry is one short auditory cue — sounds he makes, hears, or is surrounded by.

Sound entries should evoke his armor / boots / weapons / breath, or environmental sounds nearby.

EXAMPLES (DO NOT REUSE):
- "spurs ringing on cathedral flagstone"
- "leather scabbard creaking as he turns"
- "iron crossguard tapping the stone pew"
- "a mailed glove flexing at his side"
- "his slow breath fogging the silence"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for GothBot's MALE-character paths. Each entry is one short tactile cue — what he feels against his skin, what's pressing or scraping his body.

Touch entries should reference his hands / jaw / shoulders / forearm / chest, in contact with gothic materials (leather, mail, iron, stone, blood, wax, fur).

EXAMPLES (DO NOT REUSE):
- "gauntlet leather creaking on his fist"
- "blood crusting along his knuckles"
- "cold iron pommel resting at his hip"
- "wolf-fur collar brushing his jaw"
- "chainmail biting into his shoulder"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the BODY PART AND the SENSATION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for GothBot's MALE-character paths. Each entry is one short thermal cue — heat or cold on his body, or in the gothic space around him.

EXAMPLES (DO NOT REUSE):
- "sweat cooling on the back of his neck"
- "breath fogging beneath his hood"
- "torch heat flushing one side of his face"
- "ice in his beard from the long ride"
- "stone floor leaching warmth through his boot"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for GothBot's MALE-character paths. Each entry is one short cue evoking heaviness or drag on his body — usually armor, weapons, or carried gear.

EXAMPLES (DO NOT REUSE):
- "longsword dragging at his hip"
- "chainmail pulling at his shoulders"
- "iron shield strapped across his back"
- "warhammer head resting against his boot"
- "bandolier of vials swinging at his chest"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (
    n
  ) => `You are writing ${n} distinct AIR anchors for GothBot's MALE-character paths. Each entry is one short atmospheric cue around him.

EXAMPLES (DO NOT REUSE):
- "smoke clinging to his cloak"
- "embers spinning past his shoulder"
- "snow gathering in the brim of his hood"
- "breath cloud trailing as he advances"
- "ash drifting from the burning chapel behind him"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the MEDIUM AND the MOTION/LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for GothBot's MALE-character paths. Each entry forces Flux to render a SPECIFIC PUNCHY lighting palette on his face/body.

Each entry must include: COLOR + DIRECTION + IMPACT POINT (his face, jaw, eye, blade, armor, shoulder, silhouette).

EXAMPLES (DO NOT REUSE):
- "blood-red key light cutting down his face"
- "fel-green underlight catching the underside of his jaw"
- "ice-cyan moonlight rim along his shoulder line"
- "void-violet sidelight along his profile"
- "torch glow flickering across his armor"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
Same families as female-lightcolor: BLOOD/CRIMSON (8-9), VIOLET/PURPLE (6-8), GREEN (5-7), BLUE/CYAN (5-7), GOLD/AMBER (5-7), WHITE/SILVER (3-5), PINK/MAGENTA (3-5), TEAL (2-4).

━━━ DIRECTION SPREAD ━━━
Same as female: key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6), other (rest).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (on his body or weapon)
- No "and" stacking
- Aesthetic register: gothic warrior / vampire hunter / cursed knight / occult priest

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// SCENE channel pools — no human subject; environment-only
// ─────────────────────────────────────────────────────────────

const scene = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for GothBot's PURE-SCENE paths (dark-landscape, gothic-architecture, gothic-vista, gothic-darklands, castlevania-scene, horror-creature, cozy-goth). NO human subject — scents in the empty gothic environment.

EXAMPLES (DO NOT REUSE):
- "centuries of damp stone and decayed tapestry"
- "incense ghost lingering in the empty nave"
- "wet rust on iron bars in the crypt"
- "graveyard mold and rotting roses"
- "cold stone, mildew, and burnt candle wax"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION/SOURCE. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for GothBot's PURE-SCENE paths. NO human subject — environmental sounds only.

EXAMPLES (DO NOT REUSE):
- "wind moaning through broken arches"
- "water dripping in the undercroft"
- "a distant bell tower chiming midnight"
- "raven calls echoing across the cliff abbey"
- "the chapel door creaking on rusted hinges"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for GothBot's PURE-SCENE paths. NO human subject — environmental texture/contact cues (rain on stone, ivy on walls, moss on graves, dust on books, frost on iron).

EXAMPLES (DO NOT REUSE):
- "rain finding cracks in the cathedral roof"
- "ivy creeping over fallen tombstones"
- "frost cementing iron gate to its hinges"
- "moss soft underneath the broken pew"
- "dust thick on the spines of forgotten ledgers"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the TEXTURE/MEDIUM AND the SURFACE. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for GothBot's PURE-SCENE paths. NO human subject — thermal cues in the environment itself.

EXAMPLES (DO NOT REUSE):
- "stone radiating crypt-cold into the empty hall"
- "bronze braziers throwing forge-heat into the nave"
- "frost climbing the iron bars by morning"
- "damp chill seeping from the undercroft"
- "lingering forge-warmth in the abandoned smithy"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for GothBot's PURE-SCENE paths. NO human subject — anchors that imply gravity / mass / pressure on environmental elements.

EXAMPLES (DO NOT REUSE):
- "tapestry sagging under centuries of dust"
- "stone vaulting bowed under its own weight"
- "iron chandelier hanging heavy over the nave"
- "stained glass window pressing in the lead frame"
- "the great oak doors slumping on their hinges"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the WEIGHT VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (
    n
  ) => `You are writing ${n} distinct AIR anchors for GothBot's PURE-SCENE paths. NO human subject — atmospheric particle/movement cues in empty space.

EXAMPLES (DO NOT REUSE):
- "mist drifting between the empty pews"
- "dust suspended in shafts of stained-glass light"
- "smoke from extinguished candles still curling toward the vault"
- "snow drifting through the shattered rose window"
- "embers spinning over the burned-out brazier"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for GothBot's PURE-SCENE paths (NO human subject). Each entry forces Flux to render a SPECIFIC PUNCHY lighting palette across the scene.

Each entry must include: COLOR + DIRECTION/SOURCE (key/rim/uplight/shaft/spot) + IMPACT POINT in the environment (altar, throne, archway, statue, stairwell, fountain, balcony, cliff face, fog bank, cracked dome).

EXAMPLES (DO NOT REUSE):
- "blood-red beam falling across the cracked altar"
- "fel-green underlight rising from the catacomb floor"
- "ice-cyan moonlight pooling on the marble dais"
- "void-violet shaft cutting through the ruined dome"
- "sulfur-yellow torchlight flickering across the crypt walls"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
Same families as female/male-lightcolor: BLOOD/CRIMSON (8-9), VIOLET/PURPLE (6-8), GREEN (5-7), BLUE/CYAN (5-7), GOLD/AMBER (5-7), WHITE/SILVER (3-5), PINK/MAGENTA (3-5), TEAL (2-4).

━━━ DIRECTION SPREAD ━━━
Same: key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6), other (rest).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (an environmental feature)
- No "and" stacking
- Aesthetic register: gothic cathedral / castle / catacomb / forest / abbey / cliff / ruin

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { female, male, scene };

module.exports = { metaPrompts };
