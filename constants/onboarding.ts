import type { Aesthetic, ArtStyle } from '@/types/vibeProfile';

/** Mediums: Art style tiles */
export const ART_STYLE_TILES: { key: ArtStyle; label: string; icon: string }[] = [
  { key: 'oil_painting', label: 'Oil Painting', icon: 'brush' },
  { key: 'anime', label: 'Anime', icon: 'star' },
  { key: '35mm_photography', label: '35mm Film', icon: 'camera' },
  { key: 'watercolor', label: 'Watercolor', icon: 'water' },
  { key: 'cgi', label: 'CGI', icon: 'cube' },
  { key: 'pixel_art', label: 'Pixel Art', icon: 'grid' },
  { key: 'claymation', label: 'Claymation', icon: 'hand-left' },
  { key: 'pencil_sketch', label: 'Pencil Sketch', icon: 'pencil' },
  { key: 'comic_book', label: 'Comic Book', icon: 'chatbubble' },
  { key: 'stained_glass', label: 'Stained Glass', icon: 'diamond' },
  { key: 'ukiyo_e', label: 'Ukiyo-e', icon: 'leaf' },
  { key: 'gouache', label: 'Gouache', icon: 'color-fill' },
  { key: 'vector_art', label: 'Vector Art', icon: 'shapes' },
  { key: 'collage', label: 'Collage', icon: 'albums' },
  { key: 'neon_sign', label: 'Neon Sign', icon: 'bulb' },
  { key: 'papercraft', label: 'Papercraft', icon: 'newspaper' },
  { key: 'embroidery', label: 'Embroidery', icon: 'heart' },
  { key: 'lego', label: 'LEGO', icon: 'cube' },
  { key: 'felt_puppet', label: 'Felt Puppet', icon: 'paw' },
];

/** Vibes: Aesthetic tiles */
export const AESTHETIC_TILES: { key: Aesthetic; label: string; icon: string }[] = [
  { key: 'cyberpunk', label: 'Cyberpunk', icon: 'flash' },
  { key: 'cozy', label: 'Cozy', icon: 'cafe' },
  { key: 'liminal', label: 'Liminal', icon: 'exit' },
  { key: 'brutalist', label: 'Brutalist', icon: 'business' },
  { key: 'retrofuturism', label: 'Retro-Futurism', icon: 'rocket' },
  { key: 'dreamy', label: 'Dreamy', icon: 'cloud' },
  { key: 'analog_film', label: 'Analog Film', icon: 'film' },
  { key: 'surreal', label: 'Surreal', icon: 'eye' },
  { key: 'cottagecore', label: 'Cottagecore', icon: 'flower' },
  { key: 'dark_academia', label: 'Dark Academia', icon: 'book' },
  { key: 'solarpunk', label: 'Solarpunk', icon: 'sunny' },
  { key: 'vaporwave', label: 'Vaporwave', icon: 'musical-notes' },
  { key: 'gothic', label: 'Gothic', icon: 'moon' },
  { key: 'art_nouveau', label: 'Art Nouveau', icon: 'color-palette' },
  { key: 'maximalist', label: 'Maximalist', icon: 'sparkles' },
  { key: 'minimalist', label: 'Minimalist', icon: 'remove' },
  { key: 'psychedelic', label: 'Psychedelic', icon: 'nuclear' },
  { key: 'steampunk', label: 'Steampunk', icon: 'cog' },
  { key: 'biopunk', label: 'Biopunk', icon: 'pulse' },
  { key: 'afrofuturism', label: 'Afrofuturism', icon: 'globe' },
];

/** Minimum selections per step */
export const LIMITS = {
  aesthetics: { min: 3 },
  art_styles: { min: 2 },
} as const;

/** Total steps in the onboarding flow (excluding welcome) */
export const TOTAL_STEPS = 6;
