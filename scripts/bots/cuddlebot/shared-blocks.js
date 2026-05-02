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

// ─── ToyBot-style toy-photography blocks (used by plushie-life + dollhouse-life ONLY) ─
// These two paths intentionally break cuddlebot's "stylized only" brand contract
// to deliver realistic toy-photography aesthetic matching toybot. All other
// cuddlebot paths use the CUTE/STYLIZED blocks above.
const TOY_PHOTO_PROMPT_PREFIX =
  'toy photography in a handcrafted practical set, action-packed toy-world storytelling, toy-ness elevated as the subject';

const TOY_PHOTO_PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. If it's plush, fabric/felt/yarn/button-eyes visible. If it's a dollhouse figurine, scale-accurate miniature interior with wooden furniture and tiny dishware. Practical-set photography, never CGI, never illustration.`;

const CINEMATIC_STORY_BLOCK = `━━━ CINEMATIC STORY — EVERY RENDER IS A MOVIE STILL ━━━

Something IS HAPPENING. Action mid-charge, mid-pour, mid-toast, mid-laugh, mid-hug. NEVER "toy-on-shelf" static. Narrative + tension + dynamic composition. The viewer should feel they stumbled into minute 47 of a stop-motion film.`;

const DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK = `━━━ LIGHTING ELEVATES THE MEDIUM ━━━

Lighting is the multiplier that makes plastic / clay / fabric feel like it belongs in a museum. Respect the path-specific lighting palette. Atmospheric depth via smoke / haze / dust / steam / pollen / backlight is welcome.`;

const PATH_MEDIUM_LOCK_BLOCK = `━━━ PATH MEDIUM LOCK — NEVER MIX ━━━

Each path is locked to its medium. NEVER mix LEGO with plush, NEVER put vinyl figures beside action-figures. The path's medium is absolute — stay true.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CUTE_CUDDLY_COZY_BLOCK,
  STYLIZED_NOT_PHOTOREAL_BLOCK,
  NO_DARK_NO_INTENSE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  // ToyBot-style toy-photography (used by plushie-life + dollhouse-life only)
  TOY_PHOTO_PROMPT_PREFIX,
  TOY_PHOTO_PROMPT_SUFFIX,
  TOY_PHOTOGRAPHY_BLOCK,
  CINEMATIC_STORY_BLOCK,
  DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK,
  PATH_MEDIUM_LOCK_BLOCK,
};
