/**
 * Meta-prompt registry for CoquetteBot sensory channel pools.
 * 2 contexts (female / scene) × 7 channels = 14 pools.
 * NO MALE figures — hard ban per design doc.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry
- Comma-separated phrases when needed
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: coquette / Pre-Raphaelite / Disney-princess / cottagecore / Parisian-romance
- NEVER reference: blood, crypts, decay, gore, smoke-clinging, dark-fantasy, gothic
- ALL anchors stay sweet, romantic, light, dreamy

━━━ AESTHETIC ANCHORS ━━━
- objects: rose petals, ribbon, satin bow, lace, parasol, tulle, organza, cream-velvet,
  porcelain teacup, lacquer tray, music box, vanity mirror, doily, peony bouquet, cherry blossoms,
  patisserie, croissant, macaron, eclair, raspberry tart, strawberry shortcake, jam jar,
  ballet slippers, ribbon-tied gift, ginghamcheck, polka-dot, cottage trellis, climbing roses,
  garden sundial, antique vanity, embroidered cushion, pressed flower, dried lavender bundle
- materials: silk, satin, lace, organza, tulle, cream-velvet, ivory porcelain, blush-pink ceramic,
  pastel-painted wood, light-oak, soft-pink fabric, mint-green ribbon, champagne lace, gold leaf
- environments: cottage parlor, bedroom-fashion suite, Parisian café, garden conservatory,
  rose-arbor, lavender field, picnic blanket, pastry-shop counter, vanity table, music room,
  cottagecore kitchen, cherry-blossom park, coastal pink-rose path`;

function ch(opts) {
  return (n) => `You are writing ${n} distinct ${opts.name.toUpperCase()} anchors for CoquetteBot's ${opts.context} context.

${opts.desc}

EXAMPLES (DO NOT REUSE):
${opts.examples.map(e => '- "' + e + '"').join('\n')}

${SHARED_RULES}
${opts.absoluteRule || ''}

━━━ DEDUP — too similar if both ${opts.dedup}. Vary one.
━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`;
}

const female = {
  smell: ch({name: 'smell', context: 'FEMALE (Pre-Raphaelite/Disney-princess woman)', desc: 'Sweet floral/patisserie scents on her body, hair, gown.', examples: ['rose-petal jam on the corner of her teacup','vanilla and bergamot warming on her wrist','sun-warm strawberries clinging to her apron','lavender-water cooling at her temples','fresh croissant butter on her gloved fingertips'], dedup: 'SCENT NOUN AND LOCATION on her body'}),
  sound: ch({name: 'sound', context: 'FEMALE', desc: 'Soft sweet sounds — fabric/teacup/ballet/music-box.', examples: ['her ribbon-tied parasol catching the breeze','tulle skirt rustling as she crosses the parlor','her teaspoon chiming against the porcelain saucer','wind-chime tinkling above her cottage door','her ballet slippers whispering across the wood floor'], dedup: 'SOURCE AND QUALITY'}),
  touch: ch({name: 'touch', context: 'FEMALE', desc: 'Satin/lace/petal/sun on her skin/hands.', examples: ['satin ribbon brushing the back of her neck','rose-petal soft against her cheek','lace cuff dragging through her teacup foam','afternoon-warm sunlight on her bare shoulder','her gloved hand sticky with cherry-jam'], dedup: 'BODY PART AND SENSATION VERB'}),
  temperature: ch({name: 'temperature', context: 'FEMALE', desc: 'Sun, tea-warmth, breeze on her body.', examples: ['warm afternoon sun pressing through her parasol','porcelain teacup warming her cupped palms','spring-breeze cool on her flushed cheeks','summer-meadow heat blooming under her bonnet','garden dew cool on her ankle stockings'], dedup: 'THERMAL SOURCE AND BODY PART'}),
  weight: ch({name: 'weight', context: 'FEMALE', desc: 'Tulle/parasol/peony/satin weight on her body.', examples: ['tulle ballgown sweeping behind her','parasol of cream organza balanced on her shoulder','her bouquet of peonies cradled in both arms','ribbon-tied pearl strands at her throat','satin train dragging across the parquet'], dedup: 'OBJECT AND BODY PART'}),
  air: ch({name: 'air', context: 'FEMALE', desc: 'Petals, sugar-dust, blossoms, mist around her.', examples: ['rose petals drifting around her in the orchard','powdered sugar puff drifting from her macaron','spring blossoms fluttering past her café window','her breath misting against the cold cottage window','lavender pollen drifting in golden afternoon light'], dedup: 'PARTICLE AND MOTION VERB'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for CoquetteBot's FEMALE context. ALL pastel — no jewel tones, no dark tones.

EXAMPLES (DO NOT REUSE):
- "blush-pink key glowing through her parasol onto her face"
- "honey-gold sunlight rim sculpting her shoulder"
- "champagne-amber chandelier glow flooding her face from above"
- "rose-tinted window-shaft falling diagonal across her cheek"
- "lavender-twilight cool wash cooling her gown"

━━━ COLOR FAMILIES ━━━
BLUSH-PINK (15-18), HONEY-GOLD (12-14), CHAMPAGNE-AMBER (10-12), ROSE-TINTED (10-12), LAVENDER-TWILIGHT (10-12), BUTTER-YELLOW (8-10), PEACH-ORANGE (8-10), IVORY-CREAM (8-10), MINT-GREEN (4-6), DUSTY-ROSE (4-6).

━━━ DIRECTION SPREAD ━━━ key (14-16), rim (12-14), shaft (10-12), wash (8-10), backlight (6-8), sidelight (4-6).

━━━ HARD RULES ━━━ 8-16 words; pastel COLOR + DIRECTION + IMPACT POINT (her face / parasol / gown / silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: ch({name: 'smell', context: 'SCENE', desc: 'Cottage/Parisian/garden environmental scents.', examples: ['fresh-baked madeleines and butter from the open kitchen','rain on hot strawberry vines in the garden','old roses pressed between the pages of a leather-bound book','honeysuckle climbing the cottage trellis','earl-grey steam rising from the porcelain pot'], dedup: 'SCENT NOUN AND LOCATION'}),
  sound: ch({name: 'sound', context: 'SCENE', desc: 'Cottage/garden environmental sounds.', examples: ['kettle whistling on the wood-stove','wind-chime tinkling in the cottage garden','rain pattering on the gingham window-curtains','wood floor creaking in the empty ballet studio','music-box winding down in the bedroom corner'], dedup: 'SOURCE AND QUALITY'}),
  touch: ch({name: 'touch', context: 'SCENE', desc: 'Soft cottagecore/garden textures.', examples: ['moss creeping over the stone garden wall','ivy curling around the wrought-iron café table','powdered-sugar dusted across the serving tray','raindrops beading on the rose petals','lace doily soft beneath the teapot'], dedup: 'TEXTURE AND SURFACE'}),
  temperature: ch({name: 'temperature', context: 'SCENE', desc: 'Cottage/conservatory/meadow thermal cues.', examples: ['afternoon sun warming the pink-velvet bedroom','first-frost glittering on the cottage roses','lavender-meadow heat shimmering in the distance','spring rain cool against the conservatory glass','fireplace warmth spreading through the cottage parlor'], dedup: 'THERMAL SOURCE AND LOCATION'}),
  weight: ch({name: 'weight', context: 'SCENE', desc: 'Soft cottagecore weight in environment.', examples: ['century-heavy oak teacart laden with patisserie','wisteria vines drooping from the conservatory beams','stack of romance novels on the bedside table','antique vanity mirror in its gilded frame','ribbon-tied bouquets piled on the cottage bench'], dedup: 'OBJECT AND WEIGHT VERB'}),
  air: ch({name: 'air', context: 'SCENE', desc: 'Petals/sugar/blossoms/dust in the environment.', examples: ['rose petals drifting across the garden path','lavender pollen suspended in the afternoon shaft','icing-sugar dust hanging over the macaron tower','blossoms floating on the garden pond','dust motes turning in the cottage windowlight'], dedup: 'PARTICLE AND LOCATION'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for CoquetteBot's SCENE context. ALL pastel.

EXAMPLES (DO NOT REUSE):
- "blush-pink key glowing through the conservatory glass"
- "honey-gold afternoon shaft falling across the parquet"
- "rose-tinted window-shaft falling diagonal across the bedroom dresser"
- "champagne-amber chandelier glow flooding the parlor"
- "lavender-twilight cool wash in the garden"

━━━ COLOR FAMILIES ━━━ Same as female: BLUSH-PINK (15-18), HONEY-GOLD (12-14), CHAMPAGNE-AMBER (10-12), ROSE-TINTED (10-12), LAVENDER-TWILIGHT (10-12), BUTTER-YELLOW (8-10), PEACH-ORANGE (8-10), IVORY-CREAM (8-10), MINT-GREEN (4-6), DUSTY-ROSE (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), shaft (12-14), wash (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; pastel COLOR + DIRECTION + IMPACT POINT.
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { female, scene };
module.exports = { metaPrompts };
