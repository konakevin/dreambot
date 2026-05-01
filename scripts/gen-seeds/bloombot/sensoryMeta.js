/**
 * BloomBot sensory meta — 2 contexts (bloom / scene) × 7 channels.
 * NO HUMANS — flowers ARE the character.
 * bloom = closeup macro of one flower as subject
 * scene = environmental floral landscape/garden/meadow/conservatory
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — never her/his/she/he. NEVER human anatomy. The flower is the subject.
- Aesthetic register: lush / sun-drenched / IMPOSSIBLE-beauty / wallpaper-worthy / dreamy floral
- Vocabulary: petal, stamen, pollen, dewdrop, blossom, bloom, bud, calyx, sepal, stigma, nectar,
  honey, bee, butterfly, hummingbird, dragonfly, conservatory, glasshouse, trellis, garden gate,
  moss, fern, lichen, tropical, orchid, peony, magnolia, hydrangea, lavender, rose, jasmine,
  lily, iris, daisy, sunflower, dahlia, ranunculus`;

const bloom = {
  smell: (n) => `${n} SMELL anchors for BloomBot's BLOOM context (single flower closeup as subject).

EXAMPLES (DO NOT REUSE):
- "honey-sweet jasmine perfume rising from the open bloom"
- "rose-petal warmth radiating in the afternoon shaft"
- "lily-of-the-valley fragrance hovering above the flower bed"
- "ripe peony scent thick in the morning humidity"
- "lavender pollen-dust on the bloom's stamens"

${SHARED_RULES}
━━━ DEDUP — share SCENT and FLOWER PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for BloomBot's BLOOM context.

EXAMPLES (DO NOT REUSE):
- "a bee humming as it crosses the blossom face"
- "the soft tear of a petal letting go and falling"
- "wind rustling the petal-edges"
- "raindrops tapping the broad leaf beside the bloom"
- "the faint hum of a hummingbird's wings at the bloom's mouth"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for BloomBot's BLOOM context.

EXAMPLES (DO NOT REUSE):
- "dewdrops beading along the petal's curved edge"
- "pollen powder dusting the stamen tips"
- "petal velvet softness against the camera lens"
- "leaf-vein texture cool to the touch"
- "rain-warmed sap weeping from a fresh-cut stem"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and FLOWER PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for BloomBot's BLOOM context.

EXAMPLES (DO NOT REUSE):
- "morning-dew chill clinging to the bloom"
- "afternoon sun-warmth radiating from the petal face"
- "first-frost glittering on the petal edge"
- "tropical-greenhouse humidity beading on the flower"
- "golden-hour warmth glowing through the translucent petals"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and FLOWER PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for BloomBot's BLOOM context.

EXAMPLES (DO NOT REUSE):
- "century-heavy magnolia bloom dropping its head"
- "rain-soaked peony folding under its own weight"
- "sunflower head pulling its stem to one side"
- "dahlia head bowing on its long stem"
- "ripe iris swaying with its own weight"

${SHARED_RULES}
━━━ DEDUP — share FLOWER PART and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for BloomBot's BLOOM context.

EXAMPLES (DO NOT REUSE):
- "pollen drifting in the golden afternoon shaft"
- "petals falling around the focal bloom"
- "morning mist hanging between the flower and the lens"
- "rose-scent waves rising in the heat"
- "butterfly drifting across the bloom face"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and MOTION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for BloomBot's BLOOM context. Lighting on the flower closeup.

EXAMPLES (DO NOT REUSE):
- "honey-gold sun-shaft glowing through the translucent petals"
- "rose-pink window glow on the conservatory bloom"
- "magenta-magenta tropical noon key flooding the orchid"
- "lavender-twilight cool wash on the garden-rose"
- "butter-yellow morning ray catching the daffodil throat"

━━━ COLOR FAMILIES ━━━
HONEY-GOLD-SUN (12-14), ROSE-PINK (10-12), MAGENTA-TROPICAL (8-10), LAVENDER-TWILIGHT (8-10), BUTTER-YELLOW (8-10), IRIDESCENT-PEARL-MOONLIGHT (6-8), CHAMPAGNE-AMBER (6-8), CORAL-SUNSET (6-8), COSMIC-VIOLET (4-6), EMERALD-GREEN-DAPPLED (6-8), IVORY-CREAM-SUNBEAM (4-6), SOFT-PINK-DAWN (4-6).

━━━ DIRECTION SPREAD ━━━ shaft (14-16), key (12-14), backlight (10-12), wash (8-10), rim (6-8).

━━━ HARD RULES ━━━ 8-16 words; pastel COLOR + DIRECTION + IMPACT POINT (petal / stamen / leaf / silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: (n) => `${n} SMELL anchors for BloomBot's SCENE context (environmental floral landscape).

EXAMPLES (DO NOT REUSE):
- "rose-garden warmth in the late-afternoon meadow"
- "tropical-greenhouse jasmine and orchid mixing"
- "rain-on-honeysuckle drifting from the cottage trellis"
- "lavender field heated by midday sun"
- "wisteria perfume cascading from the conservatory beams"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "bees humming in the lavender fields"
- "wind through the conservatory glass panes"
- "fountain trickling in the rose garden"
- "wind-chime tinkling at the cottage garden gate"
- "leaves rustling in the conservatory canopy"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "moss carpeting the garden stepping-stones"
- "vines climbing the conservatory iron beams"
- "dew soaking the trousers of the imagined garden walker"
- "ivy creeping over the garden wall"
- "tropical-leaf shade cool against the camera"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "afternoon-meadow warmth shimmering on the rose-bushes"
- "tropical-noon humidity hanging in the conservatory"
- "first-frost edging the autumn-meadow flowers"
- "morning-meadow chill cooling the dew-laden roses"
- "spring-rain warmth radiating from the cottage trellis"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "century-heavy wisteria vines drooping from the pergola"
- "tropical-canopy leaves bowing in the conservatory ceiling"
- "trellis sagging under the climbing roses"
- "iron archway anchored under thick climbing vines"
- "ancient garden bench softened by century of moss"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "pollen drifting through the golden meadow shaft"
- "rose petals floating on the garden pond"
- "blossoms drifting from the cherry-orchard canopy"
- "tropical mist hanging between the orchid stalks"
- "fireflies drifting across the night-blooming jasmine garden"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for BloomBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "honey-gold sun-shaft cutting through the rose-arbor"
- "tropical-noon magenta-and-cyan key flooding the conservatory"
- "lavender-twilight cool wash on the meadow"
- "butter-yellow morning ray cutting across the cottage garden"
- "iridescent-pearl moonlight on the night-blooming jasmine"

━━━ COLOR FAMILIES ━━━ Same as bloom: HONEY-GOLD-SUN (12-14), ROSE-PINK (10-12), MAGENTA-TROPICAL (8-10), LAVENDER-TWILIGHT (8-10), BUTTER-YELLOW (8-10), IRIDESCENT-PEARL-MOONLIGHT (6-8), CHAMPAGNE-AMBER (6-8), CORAL-SUNSET (6-8), COSMIC-VIOLET (4-6), EMERALD-GREEN-DAPPLED (6-8), IVORY-CREAM-SUNBEAM (4-6), SOFT-PINK-DAWN (4-6).

━━━ DIRECTION SPREAD ━━━ shaft (14-16), key (12-14), wash (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; pastel COLOR + DIRECTION + IMPACT POINT (garden / conservatory / meadow / trellis feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { bloom, scene } };
