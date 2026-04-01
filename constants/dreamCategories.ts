/**
 * Dream categories — high-level groups that partition ALL possible
 * outputs from the recipe engine. Every post must match at least one.
 *
 * Categories are derived from the recipe engine's dimensions:
 * mediums, moods, settings, eras, interests, and subjects.
 * Each category casts a wide net of keywords to avoid orphaned posts.
 */

import { colors } from '@/constants/theme';

export interface DreamCategory {
  key: string;
  label: string;
  icon: string;
  color: string;
  /** Keywords to match against ai_prompt or caption text */
  keywords: string[];
}

export const DREAM_CATEGORIES: DreamCategory[] = [
  {
    key: 'all',
    label: 'All',
    icon: 'grid',
    color: colors.accent,
    keywords: [], // empty = show everything
  },
  {
    key: 'nature',
    label: 'Nature',
    icon: 'leaf',
    color: '#4CAA64',
    keywords: [
      // Settings: wild outdoors, mountains, beach, underwater
      'forest', 'mountain', 'ocean', 'waterfall', 'garden', 'lake', 'river',
      'flower', 'tree', 'meadow', 'canyon', 'cave', 'reef', 'moss', 'fern',
      'bioluminescent', 'beach', 'tropical', 'palm', 'island', 'sand', 'wave',
      'tide', 'coral', 'kelp', 'underwater', 'sea', 'glacier', 'alpine',
      'prairie', 'redwood', 'bamboo', 'lavender', 'cherry blossom', 'sunrise',
      'sunset', 'rain', 'storm', 'snow', 'fog', 'aurora', 'northern lights',
      // Animals & creatures
      'animal', 'fox', 'deer', 'owl', 'whale', 'bird', 'wolf', 'butterfly',
      'jellyfish', 'turtle', 'eagle', 'bear', 'cat', 'dog', 'rabbit',
      'fish', 'frog', 'octopus', 'dragon', 'phoenix', 'koi', 'elk',
      'penguin', 'hummingbird', 'chameleon', 'firefly', 'snail',
      // Nature moods
      'serene', 'peaceful', 'tranquil', 'wild', 'natural', 'organic',
    ],
  },
  {
    key: 'fantasy',
    label: 'Fantasy',
    icon: 'sparkles',
    color: '#BB88EE',
    keywords: [
      // Fantasy interest + settings
      'fantasy', 'magic', 'castle', 'knight', 'medieval', 'fairy', 'enchanted',
      'wizard', 'mythical', 'elven', 'sorcerer', 'potion', 'throne', 'kingdom',
      'spell', 'rune', 'goblin', 'unicorn', 'dragon', 'phoenix', 'dwarf',
      'forge', 'quest', 'warrior', 'armor', 'sword', 'shield',
      // Era: medieval, ancient, prehistoric
      'ancient', 'temple', 'ruins', 'stone', 'monolith', 'prehistoric',
      'cave painting', 'ice age', 'viking', 'monastery',
      // Dark fantasy
      'gothic', 'haunting', 'shadow', 'skull', 'raven', 'cemetery',
      'vampire', 'ghost', 'phantom', 'curse', 'necromancer', 'crypt',
      // Victorian / steampunk
      'victorian', 'steampunk', 'brass', 'gear', 'clockwork', 'airship',
      'gas lamp', 'steam',
      // Magical moods
      'ethereal', 'mystical', 'arcane', 'enchantment', 'legend',
      // Pop culture fantasy
      'hobbit', 'shire', 'hogwarts', 'mordor', 'narnia', 'lord of the rings',
      'harry potter', 'game of thrones', 'witcher',
    ],
  },
  {
    key: 'cosmic',
    label: 'Cosmic',
    icon: 'planet',
    color: '#6699EE',
    keywords: [
      // Space setting + interest
      'space', 'cosmic', 'nebula', 'aurora', 'starlight', 'galaxy', 'planet',
      'astronaut', 'stellar', 'celestial', 'void', 'constellation', 'asteroid',
      'moon', 'stars', 'black hole', 'orbit', 'zero gravity', 'alien',
      'mars', 'saturn', 'jupiter', 'pluto', 'comet', 'meteor',
      // Sci-fi
      'sci-fi', 'sci fi', 'cyberpunk', 'neon city', 'holographic', 'android',
      'robot', 'mech', 'spaceship', 'starship', 'warp', 'hyperspace',
      'far future', 'futuristic', 'chrome', 'laser', 'hologram',
      'space station', 'orbital', 'terraformed', 'biopunk',
      // Pop culture sci-fi
      'star wars', 'matrix', 'blade runner', 'tron', 'death star',
      'lightsaber', 'jedi', 'enterprise', 'avatar pandora',
      // Surreal cosmic
      'fractal', 'kaleidoscope', 'prism', 'dimension', 'portal',
      'impossible geometry', 'escher', 'tessellation',
    ],
  },
  {
    key: 'cozy',
    label: 'Cozy',
    icon: 'cafe',
    color: '#E8A040',
    keywords: [
      // Cozy indoors setting
      'cozy', 'warm', 'candle', 'fireplace', 'library', 'cottage', 'cabin',
      'blanket', 'tea', 'coffee', 'book', 'window', 'lamp', 'indoor',
      'gentle', 'soft', 'comfort', 'home', 'hearth', 'snug', 'pillow',
      'reading nook', 'attic', 'kitchen', 'mug', 'baking',
      // Village setting
      'village', 'cobblestone', 'market', 'lantern', 'quaint', 'shop',
      'harbor', 'canal', 'terracotta',
      // Food
      'bakery', 'ramen', 'candy', 'sushi', 'pizza', 'food', 'cafe',
      'restaurant', 'cooking', 'recipe',
      // Cozy moods
      'nostalgic', 'tender', 'intimate', 'homesick', 'peaceful',
      // Bob Ross vibes
      'bob ross', 'happy little trees', 'calm',
    ],
  },
  {
    key: 'artistic',
    label: 'Artistic',
    icon: 'color-palette',
    color: '#FF6B8A',
    keywords: [
      // Art mediums & styles
      'oil painting', 'watercolor', 'brushstroke', 'impressionist',
      'canvas', 'sketch', 'pencil', 'gouache', 'pastel', 'chalk',
      'ink', 'linework', 'woodcut', 'print', 'etching',
      'stained glass', 'mosaic', 'ceramic', 'sculpture',
      'origami', 'papercraft', 'cross-stitch', 'embroidery', 'felt',
      'collage', 'abstract', 'geometric',
      // Famous artists
      'van gogh', 'picasso', 'monet', 'frida', 'klimt', 'warhol',
      'banksy', 'basquiat', 'hokusai', 'rothko', 'dali', 'mucha',
      'hopper', 'haring', 'pop art', 'art nouveau', 'art deco',
      'cubist', 'surreal', 'expressionist',
      // Fashion / design
      'fashion', 'haute couture', 'textile', 'fabric', 'boutique',
      'elegant', 'glamorous', 'aesthetic',
      // Architecture
      'architecture', 'skyscraper', 'cathedral', 'palace', 'monument',
      'treehouse', 'greenhouse', 'dome', 'tower', 'bridge',
      // Music
      'music', 'guitar', 'piano', 'orchestra', 'concert', 'jazz',
      'vinyl', 'record', 'drum', 'cello', 'symphony', 'opera',
      'festival', 'stage', 'spotlight',
    ],
  },
  {
    key: 'action',
    label: 'Action',
    icon: 'flash',
    color: '#FF4500',
    keywords: [
      // Sports
      'sport', 'surfing', 'skateboard', 'snowboard', 'skiing', 'climbing',
      'racing', 'boxing', 'basketball', 'football', 'soccer', 'hockey',
      'tennis', 'baseball', 'gym', 'workout', 'fitness', 'olympic',
      'BMX', 'motorcycle', 'car', 'drift', 'truck', 'monster truck',
      'drag', 'extreme', 'paragliding', 'bungee',
      // Action moods
      'epic', 'dramatic', 'intense', 'fierce', 'battle', 'fight',
      'explosion', 'lightning', 'thunder', 'fire', 'lava', 'volcano',
      // Gaming
      'gaming', 'arcade', 'pixel', 'retro game', 'nintendo', 'mario',
      'zelda', 'pokémon', 'pokemon', 'sonic', 'minecraft', 'final fantasy',
      'boss battle', 'power-up', 'level', 'quest',
      // Anime action
      'shonen', 'manga', 'anime', 'naruto', 'dragon ball', 'attack on titan',
      'demon slayer', 'jujutsu', 'hero', 'punch', 'energy blast',
      // Movies action
      'marvel', 'spider-man', 'avengers', 'star wars', 'pirate',
      'gladiator', 'samurai', 'ninja',
    ],
  },
  {
    key: 'whimsical',
    label: 'Whimsical',
    icon: 'balloon',
    color: '#FF8C00',
    keywords: [
      // Whimsical interest
      'whimsical', 'playful', 'cute', 'candy', 'miniature', 'tiny', 'toy',
      'cartoon', 'kawaii', 'chibi', 'pastel', 'bubble', 'silly', 'funny',
      'music box', 'snow globe', 'fairy light', 'mushroom',
      // Fun mediums
      'pixar', 'ghibli', 'disney', 'animation', 'claymation', 'LEGO',
      'voxel', 'plushie', 'felt', 'fabric', 'button', 'craft',
      'paper cutout', 'diorama', 'miniature', 'tilt-shift',
      // Cute subjects
      'baby', 'kitten', 'puppy', 'duckling', 'bunny', 'hamster',
      'hedgehog', 'panda', 'otter', 'squirrel',
      // Whimsical scenes
      'upside-down', 'cloud kingdom', 'snowglobe', 'bottle',
      'kaleidoscope', 'rainbow', 'sparkle', 'glitter', 'confetti',
      'tea party', 'carousel', 'treehouse', 'blanket fort',
      // Pride & celebration
      'pride', 'rainbow flag', 'celebration', 'parade', 'festival',
      'party', 'birthday', 'balloon', 'firework',
    ],
  },
  {
    key: 'retro',
    label: 'Retro',
    icon: 'radio',
    color: '#44CCAA',
    keywords: [
      // Retro eras
      'retro', 'vintage', 'neon', 'vaporwave', '80s', '70s', '50s', '60s',
      'film grain', 'nostalgic', 'polaroid', 'synthwave', 'airbrush',
      'disco', 'cassette', 'VHS', 'analog', 'CRT',
      'mid-century', 'jukebox', 'diner', 'drive-in', 'lava lamp',
      'shag carpet', 'roller', 'mall',
      // Art deco
      'art deco', 'jazz age', 'gatsby', 'speakeasy', '1920s',
      'roaring twenties', 'gold and black',
      // Retro mediums
      '8-bit', 'pixel art', 'NES', 'arcade', 'glitch',
      'isometric', 'comic book', 'halftone', 'screen print',
      // Travel / landmarks (iconic, recognizable)
      'eiffel', 'venice', 'machu picchu', 'santorini', 'taj mahal',
      'safari', 'cappadocia', 'petra', 'angkor', 'colosseum',
      'pyramid', 'sphinx', 'great wall', 'tokyo tower', 'dubai',
      'london', 'paris', 'new york', 'times square',
      // K-pop & modern pop culture
      'k-pop', 'kpop', 'album cover', 'aesthetic',
    ],
  },
];
