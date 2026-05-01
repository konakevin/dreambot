/**
 * Meta-prompt registry for CuddleBot sensory channel pools.
 *
 * 2 contexts (creature / scene) × 7 channels = 14 pools.
 * Per design doc memory/sensory_rollout/cuddlebot.md.
 *
 * Cute / cozy / storybook / cottagecore — fluffy creatures + cottage
 * interiors. NO HUMANS. The "creature" is anthropomorphized cute animal
 * or plushie that uses "its" pronouns + animal anatomy (paws, whiskers,
 * tail, snout, fluffy ears) — not human anatomy.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: cozy / cottagecore / storybook / cute / sweet / warm-hearth

━━━ AESTHETIC ANCHORS (use freely, mix and match) ━━━
- objects: cocoa mug, marshmallow, knit blanket, wool yarn, embroidered cushion,
  patchwork quilt, music-box, fairy lights, kettle, cookies, gingerbread, honey,
  bath bubbles, soap suds, lavender sachet, mushroom, daisy crown, picnic basket,
  teacup, doily, jam jar, candle, cinnamon stick, paper-craft, ribbon, button-eye
- materials: cotton, wool, felt, plushie-fabric, sackcloth, flocked-velvet, doily-lace,
  warm oak, cottage-stone, rough plaster, gingham, polka-dot fabric, soft moss
- environments: cottage parlor, bedroom corner, garden gate, picnic blanket,
  meadow path, forest glade, conservatory, kitchen hearth, bath tub, marshmallow-nest,
  tea garden, cottage trellis, storybook-page`;

// ─────────────────────────────────────────────────────────────
// CREATURE — cute creature/plushie as subject. Uses "it" / "its".
// Paths: creature-portrait, plushie-life, sleepy-naptime, bath-time,
//   outdoor-adventure, miniature-feast
// Animal anatomy: paws, whiskers, tail, snout, fluffy ears, button-eyes
// ─────────────────────────────────────────────────────────────

const creature = {
  smell: (n) => `You are writing ${n} distinct SMELL anchors for CuddleBot's CREATURE-context paths (cute fluffy animal or plushie subject). Each entry is one short olfactory cue tied to the cute creature in a cozy/storybook setting.

Smell entries should evoke sweet/cozy scents on its body / paws / fur / snout, or in the immediate cottage/storybook environment around it.

EXAMPLES (DO NOT REUSE):
- "warm cinnamon-sugar drifting from its pawful of biscuit"
- "fresh-baked cookie crumbs in its whiskers"
- "lavender-soap suds clinging to its fluffy ears"
- "vanilla cake batter on its rosy snout"
- "honey-jam smudged across its little paw"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER use human pronouns (her/his/she/he). Always "it" / "its" referencing the cute creature. NEVER reference human anatomy (hands, fingers, hair, lips). Use animal anatomy: paws / whiskers / tail / snout / fluffy ears / fur / button-eyes / little nose.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on the creature. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for CuddleBot's CREATURE-context paths. Cute creature sounds + nearby cozy environment sounds.

EXAMPLES (DO NOT REUSE):
- "its tiny snore in the marshmallow nest"
- "the rustle of its fluffy tail against the pillow"
- "kettle whistling beside it on the cozy stove"
- "a soft squeak as it nuzzles into the blanket"
- "the gentle plop of its paw into the bath-bubble"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER use human pronouns. Always "it" / "its". Animal anatomy only.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for CuddleBot's CREATURE-context paths. What it feels against its fur/paws/snout, or what's brushing/touching its body.

EXAMPLES (DO NOT REUSE):
- "soft cloud-fluff brushing its whiskers"
- "warm wool blanket tucked under its chin"
- "lavender bath-bubbles popping on its fur"
- "raindrops beading on the tip of its snout"
- "a sticky cherry-jam paw print on the doily"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER human anatomy. Animal body parts only.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the BODY PART AND the SENSATION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `You are writing ${n} distinct TEMPERATURE anchors for CuddleBot's CREATURE-context paths.

EXAMPLES (DO NOT REUSE):
- "fireside warmth glowing through its fur"
- "cocoa-mug heat warming its tiny paws"
- "morning dew cool on its bare toes"
- "kotatsu-warm pocket under its sleeping curl"
- "summer-meadow sunshine warming its rounded back"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER human pronouns or anatomy.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for CuddleBot's CREATURE-context paths. Soft cozy weight on the creature's small body.

EXAMPLES (DO NOT REUSE):
- "its plushie body sinking into the marshmallow pillow"
- "an oversized teacup balanced on its little lap"
- "a knit scarf wrapped twice around its neck"
- "a crown of daisies tilting on its fluffy head"
- "a tiny picnic basket dragging behind it on a string"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER human anatomy.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the BODY PART. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for CuddleBot's CREATURE-context paths. Sweet/cozy atmosphere around the creature.

EXAMPLES (DO NOT REUSE):
- "soap bubbles drifting around it in the bath"
- "marshmallow-steam rising from its cocoa cup"
- "blossom petals settling on its sleeping nose"
- "fairy-light glow haloing it on the storybook page"
- "snowflakes catching in its whiskers"

${SHARED_RULES}

━━━ ABSOLUTE RULE ━━━
NEVER human anatomy.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for CuddleBot's CREATURE-context paths. Each entry forces Flux to render a SPECIFIC WARM/COZY lighting palette on the creature.

Each entry must include: COLOR + DIRECTION (key/rim/sidelight/uplight/backlight/spot/shaft) + IMPACT POINT on its body (face / fluffy ears / paws / whiskers / silhouette).

EXAMPLES (DO NOT REUSE):
- "honey-gold storybook glow flooding its little face"
- "lantern-amber backlight rim along its fluffy ears"
- "rose-pink window-shaft falling on its paw"
- "butter-yellow morning ray catching its whiskers"
- "fairy-light cyan twinkle in its dewy eye"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
- HONEY-GOLD/AMBER family (heavy emphasis 22-25): honey-gold, lantern-amber, butter-yellow, sun-amber, candle-amber, golden-hour-amber
- ROSE/PINK family (15-18): rose-pink, blush-pink, peach-pink, dusty-rose, bubblegum-pink, watermelon-pink
- IVORY/CREAM family (12-15): ivory-cream, vanilla-cream, biscuit-cream, pearl-white, marshmallow-white
- LAVENDER/LILAC family (10-12): lavender, lilac-pastel, soft-violet, dawn-lavender
- MINT/SAGE family (8-10): mint-green, sage-green, soft-aqua, cottagecore-mint
- FAIRY-LIGHT/CYAN family (6-8): fairy-light cyan, twinkle-blue, dewdrop-cyan, twilight-blue
- AUTUMN-RUST/COPPER family (6-8): autumn-rust, copper-amber, terra-rust, pumpkin-orange
- SOFT-PEACH/MELON family (4-6): peach-cream, melon-orange

━━━ DIRECTION SPREAD ━━━
Heavy on key + rim (warm cozy lighting bias). key (15-18), rim (12-15), uplight/underlight (8-10), shaft (8-10), backlight (6-8), sidelight (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (creature body part)
- No "and" stacking
- Aesthetic register: cozy storybook / cottagecore / sweet / warm-hearth
- NO dark/macabre/jewel-tones — keep it warm pastel and gentle

━━━ ABSOLUTE RULE ━━━
NEVER human anatomy.

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// SCENE — cottage interior / cozy environment / storybook page
// Paths: cozy-landscape, rainy-day-cozy, storybook-page, cottage-core,
//   heartwarming-scene
// NO subjects — pure environment vocabulary
// ─────────────────────────────────────────────────────────────

const scene = {
  smell: (n) => `You are writing ${n} distinct SMELL anchors for CuddleBot's PURE-SCENE paths (cozy cottage / storybook / heartwarming environments). NO creature subject — scents in the empty cozy space.

EXAMPLES (DO NOT REUSE):
- "fresh-baked gingerbread drifting from the cottage oven"
- "wool blankets and pine logs smoldering in the hearth"
- "rain on the cottage thatched roof"
- "cinnamon-and-clove tea steeping in the kitchen"
- "lavender-honey simmering on the stove"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for CuddleBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "kettle whistling on the wood-stove"
- "rain pattering gently on the cottage windows"
- "wood crackling in the stone fireplace"
- "music-box tinkling in the empty nursery"
- "wind-chimes ringing softly under the porch"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for CuddleBot's PURE-SCENE paths. Cozy material textures.

EXAMPLES (DO NOT REUSE):
- "moss creeping over the cottage stepping stones"
- "wool yarn looped through the rocking-chair arm"
- "rain finding the corner of the windowsill"
- "embroidered cushion piled on the window seat"
- "felt mushroom velvet against the storybook page"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the TEXTURE/MEDIUM AND the SURFACE. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `You are writing ${n} distinct TEMPERATURE anchors for CuddleBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "fireside warmth glowing through the cottage parlor"
- "kettle steam misting the cottage windows"
- "first-snow chill drifting against the cottage door"
- "afternoon-meadow sun on the picnic blanket"
- "kotatsu-warm pocket beneath the table runner"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for CuddleBot's PURE-SCENE paths. Cozy environmental weight implications.

EXAMPLES (DO NOT REUSE):
- "stack of patchwork quilts piled on the bed"
- "wisteria vines drooping from the cottage trellis"
- "century-warm oak beams sagging over the fireplace"
- "kettle full of cocoa balanced on the wood-stove"
- "cushions piled three-deep on the rocking chair"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the OBJECT AND the WEIGHT VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for CuddleBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "marshmallow-steam rising from the cocoa pot"
- "blossoms drifting through the cottage garden gate"
- "snowflakes settling on the cottage path"
- "fairy-lights twinkling in the cottage rafters"
- "candle smoke curling toward the storybook ceiling"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for CuddleBot's PURE-SCENE paths. Each entry forces Flux to render a SPECIFIC WARM/COZY lighting palette across the environment.

Each entry must include: COLOR + DIRECTION + IMPACT POINT (cottage parlor / kitchen / picnic / garden / meadow / bedroom / window / hearth / trellis / storybook).

EXAMPLES (DO NOT REUSE):
- "honey-gold storybook glow flooding the cottage parlor"
- "lantern-amber chain glowing across the picnic"
- "rose-pink afternoon shaft falling on the cottage rug"
- "butter-yellow morning ray cutting through the kitchen"
- "fairy-light cyan twinkle on the bedroom ceiling"

━━━ COLOR FAMILIES (same as creature-lightcolor) ━━━
HONEY-GOLD/AMBER (22-25), ROSE/PINK (15-18), IVORY/CREAM (12-15), LAVENDER/LILAC (10-12), MINT/SAGE (8-10), FAIRY-LIGHT/CYAN (6-8), AUTUMN-RUST/COPPER (6-8), SOFT-PEACH/MELON (4-6).

━━━ DIRECTION SPREAD ━━━
Heavy on key, shaft (warm cozy interior bias). key (15-18), rim (12-15), shaft (12-14), uplight (6-8), backlight (4-6), sidelight (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT
- No "and" stacking
- Aesthetic register: cozy storybook / cottagecore / warm-hearth
- NO dark/macabre/jewel-tones

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { creature, scene };

module.exports = { metaPrompts };
