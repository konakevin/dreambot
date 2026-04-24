/**
 * CuddleBot — shared prose blocks.
 *
 * Pure CUTE + COZY + CUDDLY. Bedroom-poster / picture-book / Pixar / Sanrio /
 * Totoro energy. Every post makes girls and kids go AWWW. Stylized ONLY —
 * never photoreal (AnimalBot handles that). No humans.
 */

const PROMPT_PREFIX =
  'cozy bedroom-poster quality, stylized cute cuddly artwork, adorable, big-eyed, soft shapes';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const CUTE_CUDDLY_COZY_BLOCK = `━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug it" instinct. If the render has even a whisper of dark / edgy / menacing — it FAILED. The reaction is wholesome delight — big eyes, soft shapes, infectious cuteness. Lighting and mood should match the SCENE naturally (rainy = soft grey, sunset = golden, night = moonlit) — not forced bright.`;

const STYLIZED_NOT_PHOTOREAL_BLOCK = `━━━ STYLIZED / ILLUSTRATIVE ONLY — NEVER PHOTOREAL ━━━

Never photoreal. Never documentary-wildlife. The creature or scene is always rendered in a soft illustrative mode — exaggerated proportions (big head, big eyes, soft round limbs), warm painted textures, clean edges, dreamy color grading. Let the MEDIUM tag control the specific art style.`;

const NO_DARK_NO_INTENSE_BLOCK = `━━━ NO DARK / NO INTENSE / NO CREEPY ━━━

Absolutely no menace, no threat, no horror, no creepy undertones, no "uncanny cute" disturbing vibes. Safe + wholesome + approachable. The tone is kind and gentle, not Tim-Burton-stop-motion. Lighting should feel natural to the scene — overcast and soft for rain, golden for sunset, cool and silvery for moonlit — NOT artificially forced bright.`;

const NO_PEOPLE_BLOCK = `━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All subjects are creatures (real-exaggerated or fantasy-cute) or plushies or tiny cozy-worlds. If a thing would normally include a person, reimagine it without — the creature does the activity alone or with another creature.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. The composition is balanced and charming. Every element is rendered with love — the kind of image a kid pins above their bed and looks at every night.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack cute-elements: big dewy eyes + fluffy texture + blushing cheeks + sparkles + warm glow + layered atmospheric charm + adorable supporting micro-details (tiny mushrooms, floating hearts, cozy accessories). Go ALL the way on sweet + warm + cozy. Obsessive detail in service of wholesome delight.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CUTE_CUDDLY_COZY_BLOCK,
  STYLIZED_NOT_PHOTOREAL_BLOCK,
  NO_DARK_NO_INTENSE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
