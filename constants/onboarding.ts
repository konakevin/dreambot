import type { Interest, ColorPalette, PersonalityTag, Era, Setting, SceneAtmosphere, SpiritCompanion } from '@/types/recipe';

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
  { key: 'gaming',       label: 'Gaming',       icon: 'game-controller' },
  { key: 'movies',       label: 'Movies',       icon: 'film' },
  { key: 'music',        label: 'Music',        icon: 'musical-notes' },
  { key: 'geek',         label: 'Geek',         icon: 'hardware-chip' },
  { key: 'sports',       label: 'Sports',       icon: 'football' },
  { key: 'travel',       label: 'Travel',       icon: 'airplane' },
  { key: 'pride',        label: 'Pride',        icon: 'heart-circle' },
];

/** Step 2: Spirit companion tiles */
export const SPIRIT_COMPANIONS: { key: SpiritCompanion; label: string; icon: string }[] = [
  { key: 'fox',               label: 'Fox',        icon: 'paw' },
  { key: 'cat',               label: 'Cat',        icon: 'paw' },
  { key: 'owl',               label: 'Owl',        icon: 'eye' },
  { key: 'dragon',            label: 'Dragon',     icon: 'flame' },
  { key: 'rabbit',            label: 'Rabbit',     icon: 'heart' },
  { key: 'wolf',              label: 'Wolf',       icon: 'moon' },
  { key: 'jellyfish',         label: 'Jellyfish',  icon: 'water' },
  { key: 'deer',              label: 'Deer',       icon: 'leaf' },
  { key: 'butterfly',         label: 'Butterfly',  icon: 'flower' },
  { key: 'robot',             label: 'Robot',      icon: 'hardware-chip' },
  { key: 'ghost',             label: 'Ghost',      icon: 'cloudy-night' },
  { key: 'mushroom_creature', label: 'Mushroom',   icon: 'nuclear' },
];

/** Step 3: Vibe tiles — each derives personality_tags, scene_atmospheres, color_palettes, and axes */
export interface VibeTile {
  key: string;
  label: string;
  icon: string;
  personality_tags: PersonalityTag[];
  scene_atmospheres: SceneAtmosphere[];
  color_palettes: ColorPalette[];
  energy: number;
  brightness: number;
  warmth: number;
}

export const VIBE_TILES: VibeTile[] = [
  { key: 'cozy',       label: 'Cozy',          icon: 'cafe',           personality_tags: ['cozy', 'gentle', 'peaceful'],       scene_atmospheres: ['golden_hour', 'foggy_dawn'],          color_palettes: ['warm_sunset', 'earthy_natural'],  energy: 0.2, brightness: 0.6, warmth: 0.8 },
  { key: 'epic',       label: 'Epic',          icon: 'flash',          personality_tags: ['adventurous', 'bold', 'fierce'],     scene_atmospheres: ['stormy_twilight', 'aurora_night'],     color_palettes: ['dark_bold', 'neon'],              energy: 0.9, brightness: 0.6, warmth: 0.5 },
  { key: 'dreamy',     label: 'Dreamy',        icon: 'cloud',          personality_tags: ['dreamy', 'gentle', 'whimsical'],     scene_atmospheres: ['foggy_dawn', 'golden_hour'],          color_palettes: ['soft_pastel', 'cool_twilight'],   energy: 0.2, brightness: 0.8, warmth: 0.6 },
  { key: 'dark',       label: 'Dark & Moody',  icon: 'moon',           personality_tags: ['mysterious', 'edgy', 'raw'],         scene_atmospheres: ['starry_midnight', 'stormy_twilight'],  color_palettes: ['dark_bold', 'cool_twilight'],     energy: 0.3, brightness: 0.2, warmth: 0.3 },
  { key: 'playful',    label: 'Playful',       icon: 'balloon',        personality_tags: ['playful', 'wild', 'chaotic'],        scene_atmospheres: ['sunny_morning', 'golden_hour'],       color_palettes: ['neon', 'soft_pastel'],            energy: 0.6, brightness: 0.8, warmth: 0.7 },
  { key: 'serene',     label: 'Serene',        icon: 'water',          personality_tags: ['peaceful', 'gentle', 'dreamy'],      scene_atmospheres: ['foggy_dawn', 'sunny_morning'],        color_palettes: ['cool_twilight', 'earthy_natural'], energy: 0.1, brightness: 0.7, warmth: 0.4 },
  { key: 'intense',    label: 'Intense',       icon: 'thunderstorm',   personality_tags: ['fierce', 'bold', 'edgy'],            scene_atmospheres: ['stormy_twilight', 'snowy_night'],     color_palettes: ['dark_bold', 'neon'],              energy: 0.9, brightness: 0.3, warmth: 0.3 },
  { key: 'nostalgic',  label: 'Nostalgic',     icon: 'time',           personality_tags: ['nostalgic', 'cozy', 'romantic'],      scene_atmospheres: ['golden_hour', 'rainy_afternoon'],     color_palettes: ['warm_sunset', 'earthy_natural'],  energy: 0.3, brightness: 0.5, warmth: 0.7 },
  { key: 'mysterious', label: 'Mysterious',    icon: 'eye',            personality_tags: ['mysterious', 'elegant', 'raw'],       scene_atmospheres: ['starry_midnight', 'foggy_dawn'],      color_palettes: ['cool_twilight', 'dark_bold'],     energy: 0.5, brightness: 0.2, warmth: 0.2 },
  { key: 'whimsical',  label: 'Whimsical',     icon: 'sparkles',       personality_tags: ['whimsical', 'playful', 'dreamy'],     scene_atmospheres: ['sunny_morning', 'aurora_night'],      color_palettes: ['soft_pastel', 'neon'],            energy: 0.5, brightness: 0.7, warmth: 0.6 },
  { key: 'romantic',   label: 'Romantic',      icon: 'heart',          personality_tags: ['romantic', 'elegant', 'gentle'],      scene_atmospheres: ['golden_hour', 'rainy_afternoon'],     color_palettes: ['warm_sunset', 'soft_pastel'],     energy: 0.3, brightness: 0.7, warmth: 0.8 },
  { key: 'spooky',     label: 'Spooky',        icon: 'skull',          personality_tags: ['edgy', 'mysterious', 'chaotic'],      scene_atmospheres: ['snowy_night', 'stormy_twilight'],     color_palettes: ['dark_bold', 'cool_twilight'],     energy: 0.5, brightness: 0.2, warmth: 0.2 },
  { key: 'euphoric',   label: 'Euphoric',      icon: 'sunny',          personality_tags: ['bold', 'wild', 'adventurous'],        scene_atmospheres: ['sunny_morning', 'aurora_night'],      color_palettes: ['neon', 'warm_sunset'],            energy: 0.9, brightness: 0.9, warmth: 0.6 },
  { key: 'elegant',    label: 'Elegant',       icon: 'diamond',        personality_tags: ['elegant', 'romantic', 'nostalgic'],    scene_atmospheres: ['golden_hour', 'starry_midnight'],     color_palettes: ['warm_sunset', 'cool_twilight'],   energy: 0.3, brightness: 0.6, warmth: 0.5 },
  { key: 'fierce',     label: 'Fierce',        icon: 'flame',          personality_tags: ['fierce', 'bold', 'raw'],              scene_atmospheres: ['stormy_twilight', 'snowy_night'],     color_palettes: ['dark_bold', 'neon'],              energy: 0.8, brightness: 0.3, warmth: 0.4 },
];

/** Step 4: World tiles — each maps to eras + settings */
export interface WorldTile {
  key: string;
  label: string;
  icon: string;
  eras: Era[];
  settings: Setting[];
}

export const WORLD_TILES: WorldTile[] = [
  { key: 'cozy_village',       label: 'Cozy Village',        icon: 'home',           eras: ['medieval', 'retro'],          settings: ['cozy_indoors', 'village'] },
  { key: 'enchanted_forest',   label: 'Enchanted Forest',    icon: 'leaf',           eras: ['medieval', 'prehistoric'],    settings: ['wild_outdoors'] },
  { key: 'neon_city',          label: 'Neon City',           icon: 'flash',          eras: ['synthwave', 'modern'],        settings: ['city_streets'] },
  { key: 'ancient_ruins',      label: 'Ancient Ruins',       icon: 'trophy',         eras: ['ancient', 'prehistoric'],     settings: ['wild_outdoors', 'underground'] },
  { key: 'deep_space',         label: 'Deep Space',          icon: 'rocket',         eras: ['far_future'],                 settings: ['space'] },
  { key: 'underwater',         label: 'Underwater World',    icon: 'water',          eras: ['prehistoric'],                settings: ['underwater'] },
  { key: 'steampunk_workshop', label: 'Steampunk Workshop',  icon: 'cog',            eras: ['steampunk', 'victorian'],     settings: ['cozy_indoors', 'underground'] },
  { key: 'tropical_paradise',  label: 'Tropical Paradise',   icon: 'sunny',          eras: ['modern', 'retro'],            settings: ['beach_tropical'] },
  { key: 'mountain_peaks',     label: 'Mountain Peaks',      icon: 'triangle',       eras: ['prehistoric', 'modern'],      settings: ['mountains'] },
  { key: 'haunted_gothic',     label: 'Haunted & Gothic',    icon: 'cloudy-night',   eras: ['victorian', 'medieval'],      settings: ['cozy_indoors', 'underground'] },
  { key: 'desert_canyons',     label: 'Desert & Canyons',    icon: 'bonfire',        eras: ['ancient', 'prehistoric'],     settings: ['wild_outdoors'] },
  { key: 'fairy_tale',         label: 'Fairy Tale Kingdom',  icon: 'sparkles',       eras: ['medieval'],                   settings: ['village', 'wild_outdoors'] },
  { key: 'cyberpunk_future',   label: 'Cyberpunk Future',    icon: 'hardware-chip',  eras: ['far_future', 'synthwave'],    settings: ['city_streets'] },
  { key: 'art_deco',           label: 'Art Deco Glamour',    icon: 'diamond',        eras: ['art_deco', 'retro'],          settings: ['city_streets', 'cozy_indoors'] },
  { key: 'alien_world',        label: 'Alien & Otherworldly', icon: 'planet',        eras: ['far_future'],                 settings: ['otherworldly', 'space'] },
];

/** Minimum selections per step */
export const LIMITS = {
  interests: { min: 3 },
  vibes: { min: 2 },
  worlds: { min: 2 },
} as const;

/** Total steps in the onboarding flow */
export const TOTAL_STEPS = 7;
