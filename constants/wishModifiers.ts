/** Wish modifier pills — each maps to recipe engine axes for prompt influence */

export interface WishModifier {
  key: string;
  label: string;
  icon: string;
  axes: Partial<Record<'energy' | 'brightness' | 'color_warmth' | 'complexity', 'high' | 'low'>>;
}

export const MOOD_OPTIONS: WishModifier[] = [
  { key: 'happy', label: 'Happy', icon: 'happy-outline', axes: { energy: 'high', brightness: 'high', color_warmth: 'high' } },
  { key: 'sad', label: 'Sad', icon: 'sad-outline', axes: { energy: 'low', brightness: 'low', color_warmth: 'low' } },
  { key: 'anxious', label: 'Anxious', icon: 'pulse-outline', axes: { energy: 'high', brightness: 'low', complexity: 'high' } },
  { key: 'calm', label: 'Calm', icon: 'leaf-outline', axes: { energy: 'low', brightness: 'high', complexity: 'low' } },
  { key: 'energetic', label: 'Energetic', icon: 'flash-outline', axes: { energy: 'high', brightness: 'high' } },
  { key: 'grateful', label: 'Grateful', icon: 'heart-outline', axes: { energy: 'low', color_warmth: 'high', brightness: 'high' } },
  { key: 'nostalgic', label: 'Nostalgic', icon: 'time-outline', axes: { energy: 'low', color_warmth: 'high', brightness: 'low' } },
  { key: 'dreamy', label: 'Dreamy', icon: 'cloud-outline', axes: { energy: 'low', brightness: 'high', complexity: 'low' } },
  { key: 'restless', label: 'Restless', icon: 'swap-horizontal-outline', axes: { energy: 'high', complexity: 'high' } },
  { key: 'peaceful', label: 'Peaceful', icon: 'water-outline', axes: { energy: 'low', brightness: 'high', color_warmth: 'high' } },
];

export const WEATHER_OPTIONS: WishModifier[] = [
  { key: 'sunny', label: 'Sunny', icon: 'sunny-outline', axes: { brightness: 'high', color_warmth: 'high' } },
  { key: 'rainy', label: 'Rainy', icon: 'rainy-outline', axes: { brightness: 'low', color_warmth: 'low' } },
  { key: 'cloudy', label: 'Cloudy', icon: 'cloudy-outline', axes: { brightness: 'low', color_warmth: 'low', complexity: 'low' } },
  { key: 'snowy', label: 'Snowy', icon: 'snow-outline', axes: { brightness: 'high', color_warmth: 'low', energy: 'low' } },
  { key: 'stormy', label: 'Stormy', icon: 'thunderstorm-outline', axes: { energy: 'high', brightness: 'low', complexity: 'high' } },
  { key: 'foggy', label: 'Foggy', icon: 'cloudy-outline', axes: { brightness: 'low', complexity: 'low', energy: 'low' } },
  { key: 'windy', label: 'Windy', icon: 'flag-outline', axes: { energy: 'high', brightness: 'high' } },
  { key: 'misty', label: 'Misty', icon: 'water-outline', axes: { brightness: 'low', energy: 'low', complexity: 'low' } },
];

export const ENERGY_OPTIONS: WishModifier[] = [
  { key: 'exhausted', label: 'Exhausted', icon: 'battery-dead-outline', axes: { energy: 'low', brightness: 'low', complexity: 'low' } },
  { key: 'low', label: 'Low', icon: 'battery-half-outline', axes: { energy: 'low', brightness: 'low' } },
  { key: 'balanced', label: 'Balanced', icon: 'battery-half-outline', axes: {} },
  { key: 'wired', label: 'Wired', icon: 'battery-charging-outline', axes: { energy: 'high', brightness: 'high' } },
  { key: 'charged', label: 'Fully Charged', icon: 'battery-full-outline', axes: { energy: 'high', brightness: 'high', complexity: 'high' } },
];

export const VIBE_OPTIONS: WishModifier[] = [
  { key: 'cozy', label: 'Cozy', icon: 'cafe-outline', axes: { energy: 'low', color_warmth: 'high', brightness: 'low' } },
  { key: 'chaotic', label: 'Chaotic', icon: 'bonfire-outline', axes: { energy: 'high', complexity: 'high' } },
  { key: 'romantic', label: 'Romantic', icon: 'rose-outline', axes: { color_warmth: 'high', brightness: 'low', energy: 'low' } },
  { key: 'spooky', label: 'Spooky', icon: 'skull-outline', axes: { brightness: 'low', energy: 'high', color_warmth: 'low' } },
  { key: 'whimsical', label: 'Whimsical', icon: 'color-wand-outline', axes: { brightness: 'high', complexity: 'high', energy: 'low' } },
  { key: 'mysterious', label: 'Mysterious', icon: 'eye-outline', axes: { brightness: 'low', complexity: 'high', color_warmth: 'low' } },
  { key: 'playful', label: 'Playful', icon: 'game-controller-outline', axes: { energy: 'high', brightness: 'high', color_warmth: 'high' } },
  { key: 'melancholy', label: 'Melancholy', icon: 'moon-outline', axes: { energy: 'low', brightness: 'low', color_warmth: 'low' } },
];

export interface WishModifiers {
  mood: string | null;
  weather: string | null;
  energy: string | null;
  vibe: string | null;
}

export const EMPTY_MODIFIERS: WishModifiers = { mood: null, weather: null, energy: null, vibe: null };
