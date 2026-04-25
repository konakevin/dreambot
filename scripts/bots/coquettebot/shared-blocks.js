/**
 * CoquetteBot — shared prose blocks.
 *
 * Bot for girls who LOSE THEIR MINDS over cuteness. Soft pink pastel everything.
 * Cottagecore / princess / fairy / ballet / Parisian-pastry energy. Adult-
 * feminine-pastel (vs CuddleBot's kid-friendly cute). Every render must
 * trigger: "I WANT TO BE HER" / "I WANT TO LIVE THERE" / "OH MY GOD cute."
 */

const PROMPT_PREFIX =
  'dreamy coquette pastel aesthetic, cottagecore pink-velvet romance, fairytale princess-ballet energy, soft feminine atmospheric beauty, blush and rose-gold pastel palette, precious-pretty adorable';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const COQUETTE_ENERGY_BLOCK = `━━━ COQUETTE ENERGY — NON-NEGOTIABLE ━━━

Pink. Pastel. Soft. Feminine. Princess. Cottagecore. Ballet. Fairy. Parisian-pastry. Every render makes girls say: "I want to BE her" / "I want to LIVE there" / "OH MY GOD that's cute." Adult-feminine-pastel (not kid-nursery-cute — that's CuddleBot). The viewer feels PRECIOUS, DREAMY, ROMANTIC, SOFT.`;

const PINK_AND_PASTEL_DOMINANT_BLOCK = `━━━ PINK + PASTEL DOMINANT ━━━

Pink is always present. Supporting pastels: rose-gold, blush, cream, lavender, mint, butter-yellow, peach, soft-rose. Palettes are SOFT + LUMINOUS + DREAMY. Never saturated-primary-bold. Never gothic-black. Never bright-neon. Soft + romantic + pastel always wins.`;

const NO_DARK_NO_EDGY_BLOCK = `━━━ NO DARK / NO EDGY / NO GRITTY ━━━

Absolutely no menacing, edgy, gritty, dark, cyberpunk, punk, goth, or harsh-contrast elements. The tone is precious, romantic, delicate, feminine. If it even whispers "edgy" — dial back to soft.`;

const NO_HUMANS_IN_SWEETS_BLOCK = `━━━ NO HUMANS IN SWEETS PATH ━━━

Sweets path: ZERO humans, zero chefs, zero pastry workers, zero human hands. Cute whimsical animal characters (mouse baker, bunny pastry-chef, hedgehog with tiny apron) are OK as supporting elements — but NEVER human presence of any kind. Pure food still-life or animal-pastry-shop magic.`;

const STYLIZED_AESTHETIC_BLOCK = `━━━ STYLIZED AESTHETIC (ALL paths) ━━━

Fairytale / watercolor / illustration energy dominates every path. NEVER photorealistic. Every render feels painterly / storybook / dreamy — even fashion and character paths are whimsical illustrations, not photo shoots.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION (character paths) ━━━

When a girl or character appears: SHE IS SOLO. No male figures. No second-figure interaction. No "she stands beside him". She is the subject, alone, whimsical and dreamy. (Two-figure shots read as cheesy stock-art.)`;

const NO_MALE_FIGURES_BLOCK = `━━━ NO MALE FIGURES (ever) ━━━

CoquetteBot never includes male characters. When the fashion path shows a human, she is a young woman, alone. Couture path uses fantasy creature / fairy / princess wearers — no men, no boys.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — COQUETTE EDITION ━━━

Wall-poster / phone-wallpaper quality. NOT dramatic-epic-beautiful — PRECIOUS-pretty. Soft-gorgeous. Dreamy-luxurious. Every render is the girl's Pinterest-board dream image.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — COQUETTE AMPLIFICATION ━━━

Pink-pastel-cute is the canvas, not the ceiling. Stack: pink + rose-gold + ribbons + pearls + lace + florals + soft-gauze + sparkles + dreamy atmosphere + abundant florals + charming accessories. If it doesn't make a girl squeal — DIAL IT UP. Max precious, max dreamy, max soft-feminine within the pastel palette.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  COQUETTE_ENERGY_BLOCK,
  PINK_AND_PASTEL_DOMINANT_BLOCK,
  NO_DARK_NO_EDGY_BLOCK,
  NO_HUMANS_IN_SWEETS_BLOCK,
  STYLIZED_AESTHETIC_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  NO_MALE_FIGURES_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
