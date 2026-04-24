/**
 * BloomBot — shared prose blocks.
 *
 * Scene-centric bot (flowers are the hero, not a character). No character /
 * body / solo-composition blocks needed. Universal rules focus on the
 * IMPOSSIBLE-BEAUTY aesthetic and flower dominance.
 */

// Flux prompt wrapping — applied verbatim every render. Tuned for
// photorealistic-leaning floral beauty with painterly quality where applicable.
const PROMPT_PREFIX =
  'breathtaking floral beauty, impossibly lush, dramatic atmospheric lighting, magazine-cover-worthy composition, every petal and dewdrop in focus, saturated with color and life';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality, the kind of image you would hang on a wall';

const FLORAL_DOMINANCE_BLOCK = `━━━ FLOWERS ARE THE HERO — NON-NEGOTIABLE ━━━

Flowers dominate the frame. The viewer's eye should land on flowers FIRST, always. Every render showcases impossibly dense, lush, beautiful blooms. Garden-of-Eden-times-100 energy — more flowers than physics allows.

NEVER a minimalist single-stem shot where negative space dominates. NEVER a landscape where the flowers are just garnish. The flowers are the SUBJECT.

Specific flower TYPES always named (roses / peonies / wisteria / protea / lotus / sunflowers / dahlias / lilac / magnolia / cherry blossom / INVENTED alien species). Never generic "flowers" — always specific, always visible as that flower type.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE, NO CHARACTERS — NON-NEGOTIABLE ━━━

BloomBot renders are always PURE FLORAL SCENES. No people in the frame. No hands, no faces, no figures, no silhouettes, no shadows of people. The scene is inhabited only by flowers and their immediate environment (vases, pathways, architecture, alien landscapes).

Wildlife is acceptable IF it's peripheral and flower-forward — a hummingbird at a bloom, a bee on petals, a butterfly in flight. But nothing humanoid. Ever.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is aspirational — "I have never seen anything this beautiful" is the reaction. Not documentary photography of real flowers — AI-generated beauty impossible to capture in reality. Dense petal architecture, physics-defying bloom density, lighting more perfect than nature allows, colors more saturated than film could capture. The kind of image someone stares at for 30 seconds finding new details.

Beauty FIRST. Whatever secondary concept the path is exploring (cozy / surreal / pathway / closeup), the render must ALWAYS pass the "would I save this to my camera roll" bar.`;

const DRAMATIC_LIGHTING_BLOCK = `━━━ DRAMATIC LIGHTING — ALWAYS ━━━

Every render has dramatic, intentional lighting. NEVER flat daylight. Possible treatments:
- Golden-hour backlighting through translucent petals
- Rembrandt chiaroscuro — hard directional light, deep shadows
- Dawn / dusk sidelight creating long dramatic shadows
- Dappled shafts through canopy / window / arch
- Moonlit silver cool-light
- Stormy moody overcast with a single shaft of sun
- Candlelit warm interior glow
- Underwater god-rays through bloom
- Bioluminescent glow from within the flowers

The lighting is a character in the frame. Never an afterthought.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  FLORAL_DOMINANCE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  DRAMATIC_LIGHTING_BLOCK,
};
