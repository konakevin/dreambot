/**
 * Meta-prompt registry for DragonBot sensory channel pools.
 *
 * 4 contexts (female / male / creature / scene) × 7 channels (smell /
 * sound / touch / temperature / weight / air / lightcolor) = 28 distinct
 * pools. Per design doc memory/sensory_rollout/dragonbot.md.
 *
 * High-fantasy magical worlds — LOTR / GoT / Elden-Ring / Witcher /
 * Warhammer concept-art DNA. Female-warrior + male-warrior + dragon
 * (creature) + epic-fantasy-landscapes/halls/realms (scene).
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO subject demographic claims ("ancient", "mythic", "legendary")
- NO duplicate verb+noun pairs across entries
- Aesthetic register: high-fantasy / sword-and-sorcery / arcane / draconic / epic-painted

━━━ AESTHETIC ANCHORS (use freely, mix and match) ━━━
- objects: rune-stone, leyline-marker, sigil-ring, gauntlet, pauldron, longsword, broadsword,
  warhammer, shield, chainmail, mythril, talisman, sorcerer's staff, ancient tome, scroll,
  reliquary, alchemist's brazier, spell-book, candle wax, dragon-scale, claw, talon, wing-membrane,
  hoard-gold, treasure-chest, crystal orb, banner, war-horn, oath-ring, raven, wolf, owl, stag
- materials: weathered iron, blackened steel, mythril, dragon-bone, oak, ash, granite, obsidian,
  velvet, leather, fur, embroidered silk, tarnished gold, bronze, runed stone
- environments: mountain-pass, sacred grove, dread tower, dragon-lair, arcane hall, leyline-circle,
  abandoned watchtower, cathedral-vault, crypt, smithy, council chamber, alchemist's spire,
  windswept moor, blasted heath, burning village, snow-laden ridge, throne-hall, pyre`;

// ─────────────────────────────────────────────────────────────
// FEMALE — female-warrior path: armored sword-and-sorcery women
// (Ciri / Eowyn / Brienne energy)
// ─────────────────────────────────────────────────────────────

const female = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for DragonBot's FEMALE-character path (female-warrior). Each entry is one short olfactory cue tied to an armored fantasy woman in epic-fantasy-magical settings.

Smell entries should evoke scents on her body / armor / cloak / weapons / hair, or in the immediate magical environment around her.

EXAMPLES (DO NOT REUSE):
- "her leather gauntlet faintly oiled and sun-warm"
- "smoke from a smothered campfire clinging to her braid"
- "spell-incense curling around the pendant at her throat"
- "iron and rust on the back of her hand from the morning skirmish"
- "wet wool clinging to the nape of her neck after the storm crossing"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on/around her. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for DragonBot's FEMALE-character path. Each entry is one short auditory cue — sounds she makes, hears, or is surrounded by in epic-fantasy-magical settings.

Sound entries should evoke her movement / armor / weapons / breath, or environmental sounds nearby (raven, wind, war-horn, leyline-hum, distant battle).

EXAMPLES (DO NOT REUSE):
- "her chainmail whispering against itself as she draws breath"
- "the steel of her drawn blade keening softly in the cold air"
- "her arrow nocked, the bowstring creaking under her grip"
- "her gauntlet flexing as she closes her hand on the rune-stone"
- "wind rattling the war-pennant at her shoulder"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for DragonBot's FEMALE-character path. Each entry is one short tactile cue — what she feels against her skin, what she's touching with her hands.

Touch entries should reference her skin / hands / throat / shoulders / fingertips / lips / hair, in contact with epic-fantasy materials (leather, mythril, iron, runed stone, blood, fur, embroidered silk).

EXAMPLES (DO NOT REUSE):
- "rune-etched bracer cool against the skin of her wrist"
- "moss damp under her bare hand on the standing stone"
- "blood drying along her collarbone from the morning's skirmish"
- "her sword-pommel cool against her cheek as she rests"
- "her warhorn's leather strap rough across the back of her neck"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the BODY PART AND the SENSATION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for DragonBot's FEMALE-character path. Each entry is one short thermal cue — heat or cold sensation on her body, or in the magical space around her.

Temperature entries should evoke: warmth (forge / torch / spell-fire / dragon-breath / blood) or cold (mountain-pass / snow / leyline-frost / crypt-stone) interacting with her body specifically.

EXAMPLES (DO NOT REUSE):
- "frost climbing the rim of her shield"
- "dragon-breath heat radiating against her left side"
- "moonlit stone leaching cold through her boot soles"
- "campfire warmth flushing one side of her face"
- "leyline-cold raising goosebumps along her bared forearm"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for DragonBot's FEMALE-character path. Each entry is one short cue evoking heaviness, drag, or pressure on her body — usually armor, weapons, cloak, jewelry.

Weight entries should reference: cloak / chainmail / pauldron / sword / shield / quiver / talisman / spell-book interacting with her body's specific physics.

EXAMPLES (DO NOT REUSE):
- "her broadsword pulling at her hip belt"
- "a cloak of silvered mountain-fox sagging from her shoulders"
- "a quiver of black-fletched arrows shifting at her back"
- "her sigil-ring heavy on her sword-hand"
- "a runed talisman swinging from her belt as she turns"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (
    n
  ) => `You are writing ${n} distinct AIR anchors for DragonBot's FEMALE-character path. Each entry is one short cue evoking atmospheric movement near her — particles drifting, smoke curling, mist trailing, hair stirring.

Air entries should evoke visible atmosphere: ash / smoke / mist / pollen / snow / spell-mist / spark in motion near her body.

EXAMPLES (DO NOT REUSE):
- "ash drifting around her from the burning village"
- "spell-mist curling between her and the standing stones"
- "her breath cloud trailing behind her in the snow pass"
- "leyline-sparks dancing past her sword-arm"
- "raven-feather drift settling on her pauldron"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for DragonBot's FEMALE-character path. Each entry forces Flux to render a SPECIFIC PUNCHY lighting palette on her face/body — overriding Sonnet's safe defaults.

Each entry must include: COLOR + DIRECTION (key/rim/sidelight/underlight/uplight/backlight/spot/shaft) + IMPACT POINT on her body/armor/silhouette.

EXAMPLES (DO NOT REUSE):
- "ember-amber forge glow casting her face in warm copper"
- "moon-silver rim sculpting her armor in the night pass"
- "arcane-violet underlight rising from the rune-circle she stands in"
- "dragon-fire orange backlight bursting around her silhouette"
- "witch-fire green shaft falling diagonal across her cheek"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
- DRAGON-FIRE/ORANGE family (12-14): dragon-fire orange, ember-amber, molten-orange, forge-amber, sundered-gold
- ARCANE/VIOLET family (12-14): arcane-purple, wraith-violet, void-purple, deep-amethyst, spell-violet
- MOON/SILVER family (10-12): moon-silver, frost-blue, mercury-silver, pale-blue moonlight
- WITCH-FIRE/GREEN family (10-12): witch-fire green, leyline-cyan, poison-green, jade-arcane
- BLOOD/CRIMSON family (8-10): blood-red, crimson, sundered-crimson, oxblood
- GOLD/AMBER family (10-12): forge-amber, alchemist-gold, candle-amber, sundered-gold
- BLUE/CYAN family (6-8): sapphire-blue, leyline-cyan, ice-blue, deep-indigo
- PINK/AURORA family (4-6): spell-pink-aurora, fairy-rose

━━━ DIRECTION SPREAD ━━━
key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6), other (rest).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT
- Comma-separated phrases when needed
- No "and" stacking ("blood-red AND violet" — pick one)
- Aesthetic register: epic high-fantasy / arcane / draconic

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary at least one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// MALE — male-warrior path: rugged knights/barbarians
// (Geralt / Aragorn / Arthur energy)
// ─────────────────────────────────────────────────────────────

const male = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for DragonBot's MALE-character path (male-warrior). Each entry is one short olfactory cue tied to a rugged armored fantasy man in epic-fantasy-magical settings.

EXAMPLES (DO NOT REUSE):
- "wet wool and pine-smoke clinging to his cloak"
- "sword-oil on the leather of his sheath"
- "horse-sweat and damp hide on his riding gloves"
- "blood and iron-musk on the back of his gauntleted hand"
- "tobacco-and-ash on his beard from the long council"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on/around him. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for DragonBot's MALE-character path. Each entry is one short auditory cue — sounds he makes, hears, or is surrounded by.

EXAMPLES (DO NOT REUSE):
- "his greatsword scraping the stone as he stands"
- "armor-plate ringing softly with each measured step"
- "his slow breath fogging the mountain pass air"
- "his oath-ring chiming against the iron pommel of his sword"
- "the deep grunt as he lifts his battle-shield"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for DragonBot's MALE-character path. Each entry is one short tactile cue — what he feels against his skin, what he's touching with his hands.

EXAMPLES (DO NOT REUSE):
- "iron pommel resting cold against his palm"
- "wolf-fur collar brushing his jaw as he turns"
- "a fresh wound stinging beneath his pauldron"
- "his sigil-ring pressing into the back of his sword-hand"
- "the engraved leather grip of his warhammer warm in his palm"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the BODY PART AND the SENSATION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for DragonBot's MALE-character path.

EXAMPLES (DO NOT REUSE):
- "forge-warmth pressing at his back from the smithy door"
- "snow biting through the gaps in his beard"
- "campfire heat flushing one side of his face"
- "leyline-cold creeping up the back of his neck"
- "dragon-breath warmth scorching the front of his shield-arm"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for DragonBot's MALE-character path. Each entry evokes heaviness or drag on his body — armor, weapons, cloak, gear.

EXAMPLES (DO NOT REUSE):
- "longsword dragging at his hip"
- "shield strapped across his back, pulling his shoulders square"
- "warhammer head resting against his boot in the council hall"
- "a runed amulet pulling cold against the hollow of his throat"
- "his battle-cloak heavy with rain at the shoulders"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for DragonBot's MALE-character path.

EXAMPLES (DO NOT REUSE):
- "his breath clouding heavy in the cold pass"
- "spark-embers drifting past him from the burning watchfire"
- "snow gathering in the brim of his hood"
- "spell-mist curling around his sword-arm"
- "ash drifting around him from the smoldering tower"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the MEDIUM AND the MOTION/LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for DragonBot's MALE-character path.

Each entry must include: COLOR + DIRECTION + IMPACT POINT (his face, jaw, shoulder, blade, armor, silhouette).

EXAMPLES (DO NOT REUSE):
- "dragon-fire orange key flooding his face from the breath-blast ahead"
- "arcane-purple sidelight tracing his armor across the rune-circle"
- "moon-silver rim catching the edge of his cloak"
- "ember-amber underlight from the campfire glowing on his jaw"
- "witch-fire green shaft cutting across his shoulder-line"

━━━ COLOR FAMILIES (same as female-lightcolor) ━━━
DRAGON-FIRE/ORANGE (12-14), ARCANE/VIOLET (12-14), MOON/SILVER (10-12), WITCH-FIRE/GREEN (10-12), BLOOD/CRIMSON (8-10), GOLD/AMBER (10-12), BLUE/CYAN (6-8), PINK/AURORA (4-6).

━━━ DIRECTION SPREAD ━━━
Same as female: key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT
- No "and" stacking
- Aesthetic register: epic high-fantasy warrior / arcane knight / cursed paladin

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// CREATURE — dragon-scene path: the dragon as sole subject
// NO HUMANS. Anchors reference dragon-only anatomy (scales /
// wing-membrane / talon / forge-throat / multi-ton body).
// ─────────────────────────────────────────────────────────────

const creature = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for DragonBot's CREATURE path (dragon-scene). The DRAGON is the sole subject. NO HUMANS. Anchors reference dragon anatomy + dragon-environment scents.

EXAMPLES (DO NOT REUSE):
- "sulphur clinging to its breath as it parts its jaws"
- "centuries of charred bone in its lair"
- "rain hissing on its still-warm scales"
- "iron-tang of treasure-hoard heating beneath its belly"
- "ash-and-pyre stink rising from a freshly-burned forest below it"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans, riders, knights, women, men, hands, faces. The dragon is alone or with non-human companions (other creatures, treasure, ruins). Use "its" or "the dragon's" — never "her" or "his".

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on/around the dragon. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for DragonBot's CREATURE path. Dragon as sole subject, NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "its wing-membranes thundering open in one beat"
- "talons grinding on solid granite as it shifts weight"
- "the deep furnace-rumble of its chest before a flame breath"
- "scales sliding over stone as it coils tighter"
- "molten saliva hissing as it hits cold cave floor"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans. Use "its" or "the dragon's".

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for DragonBot's CREATURE path. Tactile cues from the DRAGON'S perspective or environment touching it.

EXAMPLES (DO NOT REUSE):
- "a kingdom's worth of gold scraping under its belly"
- "rain steaming the moment it touches its scaled hide"
- "old chains snapping under its slow-coiled tail"
- "its talons sinking deep into ancient oak"
- "ice-shards shattering across its wing-membranes"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the TEXTURE/MEDIUM AND the BODY PART (scale / wing-membrane / talon / belly / tail). Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for DragonBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "furnace-heat radiating from beneath its ribcage outward"
- "frost crystallizing where its breath fogs against the cave wall"
- "molten rock pooling beneath its glowing throat"
- "snow vaporizing the moment it meets its wing-membrane"
- "the hoard beneath its body radiating slow stored heat"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for DragonBot's CREATURE path. Multi-ton dragon body interacting with environment.

EXAMPLES (DO NOT REUSE):
- "stone tower groaning under its single perched claw"
- "ancient hoard shifting beneath its century-coiled body"
- "the lake's surface bowing inward beneath its passing shadow"
- "great trees toppling under its slow lumbering pass"
- "bridge-stones cracking as it sets one talon down"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SURFACE/OBJECT AND the WEIGHT VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for DragonBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "smoke curling from its nostrils in slow lazy spirals"
- "downdraft of one wing-beat clearing the entire courtyard of dust"
- "ash spiraling around its silhouette from the burning forest below"
- "embers rising in the heated air column above its scaled back"
- "snowfall melting before it touches its outstretched wing"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER reference humans.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the MEDIUM AND the MOTION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for DragonBot's CREATURE path. Lighting hits the dragon's scaled body / wing-membrane / glowing throat / cave-lair.

Each entry must include: COLOR + DIRECTION + IMPACT POINT (its scaled snout / wing-membranes / glowing throat / talon / silhouette).

EXAMPLES (DO NOT REUSE):
- "dragon-fire orange underlight rising from its glowing throat"
- "moonlight rim sculpting its wing-membranes from behind"
- "arcane-purple shaft catching its eye in the cave depths"
- "blood-red key light cutting across its scaled snout"
- "molten-orange light pulsing through the translucent wing-veins"

━━━ COLOR FAMILIES (same as female-lightcolor) ━━━
DRAGON-FIRE/ORANGE (heavy emphasis — 18-20 entries here), ARCANE/VIOLET (10-12), MOON/SILVER (10-12), WITCH-FIRE/GREEN (8-10), BLOOD/CRIMSON (8-10), GOLD/AMBER (8-10), BLUE/CYAN (6-8), other (rest).

━━━ DIRECTION SPREAD ━━━
Heavier on rim, underlight, backlight (sculpting the dragon's silhouette). key (10-12), rim (14-16), underlight/uplight (12-14), backlight (8-10), shaft/spot (4-6), sidelight (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (dragon body part)
- No "and" stacking
- Aesthetic register: epic dragon / draconic / scaled creature

━━━ ABSOLUTE RULE ━━━
NEVER reference humans.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// SCENE — landscape, fantasy-scene, epic-moment, cozy-arcane,
// arcane-halls, dark-realm, dragon-lore (figure-optional environments)
// ─────────────────────────────────────────────────────────────

const scene = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for DragonBot's PURE-SCENE paths (landscape, fantasy-scene, epic-moment, cozy-arcane, arcane-halls, dark-realm, dragon-lore). NO human or creature subject — scents in the empty epic-fantasy environment.

EXAMPLES (DO NOT REUSE):
- "ancient parchment and beeswax in the arcane library"
- "spell-smoke curling around the standing stones"
- "wet stone and lichen in the abandoned dragon lair"
- "iron and old blood lingering in the throne-hall after the council"
- "pine-smoke rising from the smoldering watchtower beacon"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION/SOURCE. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for DragonBot's PURE-SCENE paths. Environmental sounds only.

EXAMPLES (DO NOT REUSE):
- "wind howling through the broken cathedral-vault"
- "distant thunder rolling across the dragon-pass"
- "leyline-hum vibrating in the air around the rune-circle"
- "raven calls echoing across the cliff abbey"
- "iron portcullis creaking open in the abandoned keep"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `You are writing ${n} distinct TOUCH anchors for DragonBot's PURE-SCENE paths. Environmental texture/contact cues — rain on stone, ivy on walls, frost on iron, dust on books, embers on tapestries.

EXAMPLES (DO NOT REUSE):
- "ivy creeping over the fallen warrior's headstone"
- "moss soft underfoot in the enchanted glade"
- "frost cementing the iron gate to its hinge"
- "spell-dust settled across the alchemist's open ledger"
- "wax pooling in the runed depression of the standing stone"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the TEXTURE/MEDIUM AND the SURFACE. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for DragonBot's PURE-SCENE paths. Thermal cues in the environment.

EXAMPLES (DO NOT REUSE):
- "leyline-warmth radiating from the spellforge floor"
- "dragon-pass cold seeping out of the granite cliff"
- "lingering forge-heat in the abandoned smithy"
- "alchemist's brazier-warmth pulsing faintly across the spire chamber"
- "snow-laden ridge bleeding cold into the watchtower stones"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (
    n
  ) => `You are writing ${n} distinct WEIGHT anchors for DragonBot's PURE-SCENE paths. Anchors implying gravity / mass / pressure on environmental elements.

EXAMPLES (DO NOT REUSE):
- "stone tower bowed under centuries of arcane storms"
- "great oak doors slumping on rusted hinges"
- "ancient tapestry sagging under dust and dragon-soot"
- "iron chandelier hanging heavy over the council hall"
- "hoard-chest cracked and bowed under its piled gold"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the WEIGHT VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (
    n
  ) => `You are writing ${n} distinct AIR anchors for DragonBot's PURE-SCENE paths. Atmospheric particle/movement cues in empty space.

EXAMPLES (DO NOT REUSE):
- "spell-mist drifting between the standing stones"
- "cinder-ash drifting from the smoldering tower"
- "moonlight haze pooling in the empty arcane hall"
- "leyline-sparks dancing above the rune-circle"
- "snow drifting through the shattered cathedral dome"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for DragonBot's PURE-SCENE paths. Each entry forces Flux to render a SPECIFIC PUNCHY lighting palette across the environment.

Each entry must include: COLOR + DIRECTION/SOURCE + IMPACT POINT in the environment (altar, throne, archway, statue, brazier, gateway, peak, valley, cliff face, cavern, lair, tower).

EXAMPLES (DO NOT REUSE):
- "dragon-fire orange beam falling across the cracked altar"
- "arcane-violet shaft cutting through the cathedral dome"
- "moon-silver pooling on the marble dais"
- "witch-fire green wash leaking from the alchemist's brazier"
- "leyline-cyan pulse rippling across the standing stones"

━━━ COLOR FAMILIES (same as female-lightcolor) ━━━
DRAGON-FIRE/ORANGE (12-14), ARCANE/VIOLET (12-14), MOON/SILVER (10-12), WITCH-FIRE/GREEN (10-12), BLOOD/CRIMSON (8-10), GOLD/AMBER (10-12), BLUE/CYAN (6-8), PINK/AURORA (4-6).

━━━ DIRECTION SPREAD ━━━
Same: key (12-14), rim (10-12), underlight/uplight (8-10), sidelight (6-8), backlight (4-6), shaft/spot (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (an environmental feature)
- No "and" stacking
- Aesthetic register: epic high-fantasy / arcane / draconic environments

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { female, male, creature, scene };

module.exports = { metaPrompts };
