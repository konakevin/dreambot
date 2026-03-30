/** Continuous axes — each value is a probability bias from 0.0 to 1.0 */
export interface RecipeAxes {
  /** 0 = cool blue/purple, 1 = warm golden/amber */
  color_warmth: number;
  /** 0 = minimalist/simple, 1 = maximalist/detailed */
  complexity: number;
  /** 0 = illustrated/artistic, 1 = photorealistic */
  realism: number;
  /** 0 = calm/serene, 1 = intense/dramatic */
  energy: number;
  /** 0 = dark/moody, 1 = bright/light */
  brightness: number;
  /** 0 = predictable/consistent, 1 = chaotic/surprising */
  chaos: number;
}

/** Color palette preference */
export type ColorPalette =
  | 'warm_sunset'     // 🟡🟠🔴
  | 'cool_twilight'   // 🔵🟣💜
  | 'earthy_natural'  // 🌿🍃💚
  | 'soft_pastel'     // 🌸💗🤍
  | 'dark_bold'       // ⚫🔴🟡
  | 'everything';     // 🌈 random

/** Interest categories the user selected */
export type Interest =
  | 'animals' | 'nature' | 'fantasy' | 'sci_fi'
  | 'architecture' | 'fashion' | 'food' | 'abstract'
  | 'dark' | 'cute' | 'ocean' | 'space' | 'whimsical';

/** Personality trait tags */
export type PersonalityTag =
  | 'dreamy' | 'adventurous' | 'cozy' | 'edgy'
  | 'romantic' | 'mysterious' | 'playful' | 'fierce'
  | 'peaceful' | 'chaotic' | 'nostalgic' | 'futuristic'
  | 'elegant' | 'raw' | 'whimsical' | 'bold'
  | 'gentle' | 'wild';

/** The complete taste recipe stored in user_recipes.recipe JSONB */
export interface Recipe {
  axes: RecipeAxes;
  interests: Interest[];
  color_palettes: ColorPalette[];
  personality_tags: PersonalityTag[];
}

/** Default recipe — all axes at 0.5 (neutral), no selections */
export const DEFAULT_RECIPE: Recipe = {
  axes: {
    color_warmth: 0.5,
    complexity: 0.5,
    realism: 0.5,
    energy: 0.5,
    brightness: 0.5,
    chaos: 0.5,
  },
  interests: [],
  color_palettes: [],
  personality_tags: [],
};
