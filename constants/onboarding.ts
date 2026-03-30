import type { Interest, ColorPalette, PersonalityTag } from '@/types/recipe';

/** Step 1: Interest tiles */
export const INTEREST_TILES: { key: Interest; label: string; icon: string }[] = [
  { key: 'animals',      label: 'Animals',      icon: 'paw' },
  { key: 'nature',       label: 'Nature',       icon: 'leaf' },
  { key: 'fantasy',      label: 'Fantasy',      icon: 'sparkles' },
  { key: 'sci_fi',       label: 'Sci-Fi',       icon: 'planet' },
  { key: 'architecture', label: 'Architecture', icon: 'business' },
  { key: 'fashion',      label: 'Fashion',      icon: 'shirt' },
  { key: 'food',         label: 'Food',         icon: 'restaurant' },
  { key: 'abstract',     label: 'Abstract',     icon: 'color-palette' },
  { key: 'dark',         label: 'Dark',         icon: 'moon' },
  { key: 'cute',         label: 'Cute',         icon: 'heart' },
  { key: 'ocean',        label: 'Ocean',        icon: 'water' },
  { key: 'space',        label: 'Space',        icon: 'rocket' },
  { key: 'whimsical',    label: 'Whimsical',    icon: 'balloon' },
];

/** Step 4: Color palette options */
export const COLOR_PALETTES: { key: ColorPalette; label: string; colors: string[] }[] = [
  { key: 'warm_sunset',    label: 'Warm Sunset',    colors: ['#FFD700', '#FF8C00', '#FF4500'] },
  { key: 'cool_twilight',  label: 'Cool Twilight',  colors: ['#6699EE', '#8855CC', '#BB88EE'] },
  { key: 'earthy_natural', label: 'Earthy Natural', colors: ['#4CAA64', '#8B7355', '#556B2F'] },
  { key: 'soft_pastel',    label: 'Soft Pastel',    colors: ['#FFB6C1', '#DDA0DD', '#F0F8FF'] },
  { key: 'dark_bold',      label: 'Dark & Bold',    colors: ['#1A1A2E', '#E63946', '#FFD700'] },
  { key: 'everything',     label: 'Surprise Me',    colors: ['#FF4500', '#FFD700', '#4CAA64', '#6699EE', '#BB88EE'] },
];

/** Step 5: Personality tags */
export const PERSONALITY_TAGS: { key: PersonalityTag; label: string }[] = [
  { key: 'dreamy',      label: 'Dreamy' },
  { key: 'adventurous', label: 'Adventurous' },
  { key: 'cozy',        label: 'Cozy' },
  { key: 'edgy',        label: 'Edgy' },
  { key: 'romantic',    label: 'Romantic' },
  { key: 'mysterious',  label: 'Mysterious' },
  { key: 'playful',     label: 'Playful' },
  { key: 'fierce',      label: 'Fierce' },
  { key: 'peaceful',    label: 'Peaceful' },
  { key: 'chaotic',     label: 'Chaotic' },
  { key: 'nostalgic',   label: 'Nostalgic' },
  { key: 'futuristic',  label: 'Futuristic' },
  { key: 'elegant',     label: 'Elegant' },
  { key: 'raw',         label: 'Raw' },
  { key: 'whimsical',   label: 'Whimsical' },
  { key: 'bold',        label: 'Bold' },
  { key: 'gentle',      label: 'Gentle' },
  { key: 'wild',        label: 'Wild' },
];

/** Minimum/maximum selections per step */
export const LIMITS = {
  interests: { min: 3, max: 5 },
  colorPalettes: { min: 1, max: 2 },
  personalityTags: { min: 2, max: 8 },
} as const;
