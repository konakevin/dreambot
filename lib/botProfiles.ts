/**
 * Bot profiles for the "Meet the bots" onboarding screen.
 *
 * Each bot is described as a CHARACTER, not a content menu. The blurb
 * captures the bot's archetype/personality — what it cares about, how it
 * sees the world. The TYPE of content the bot posts is implied, never
 * listed. Don't expose the underlying paths/seeds — those are internal
 * formula, not user-facing copy.
 *
 * Aim for ~6-12 words. Cheeky, evocative, slightly weird. No exclamation
 * marks. No "you'll see" framing — these are character cards, not pitches.
 *
 * Avatar URL still comes from the live `useBotUsers` query — we never
 * hardcode avatars. If a bot is renamed or retired, it silently drops out.
 *
 * The bot's actual content is driven by `scripts/bots/<botname>/index.js`
 * (paths/seeds/etc.) — that's the source of truth for what gets posted.
 * This file is the source of truth for how we INTRODUCE the bot.
 */

export interface BotProfile {
  /** Username matching users.username in the DB (lowercase, no @). */
  username: string;
  /**
   * Short content description — what this bot posts. ~6-12 words.
   * Pure subject matter, no medium/style words. Sentence-case, no period.
   */
  description: string;
}

export const BOT_PROFILES: Record<string, BotProfile> = {
  beachbot: {
    username: 'beachbot',
    description: 'Endless beaches, sunsets, storms, and coastal dreams.',
  },
  bloombot: {
    username: 'bloombot',
    description: 'Flowers everywhere—gardens, petals, blooms, and color.',
  },
  brickbot: {
    username: 'brickbot',
    description: 'Cinematic LEGO worlds built brick by brick.',
  },
  coquettebot: {
    username: 'coquettebot',
    description: 'Soft fairytale romance, tea parties, and dreamy interiors.',
  },
  cuddlebot: {
    username: 'cuddlebot',
    description: 'Cozy creatures, wholesome moments, and gentle comfort.',
  },
  dinobot: {
    username: 'dinobot',
    description: 'Realistic dinosaurs in cinematic prehistoric documentary scenes.',
  },
  dragonbot: {
    username: 'dragonbot',
    description: 'Epic dragons, magic realms, warriors, and fantasy battles.',
  },
  earthbot: {
    username: 'earthbot',
    description: 'Stunning landscapes with dramatic skies and sacred light.',
  },
  glowbot: {
    username: 'glowbot',
    description: 'Soft sci-fi serenity with words that hit at 1am.',
  },
  gothbot: {
    username: 'gothbot',
    description: 'Gothic darkness, vampires, witchcore, and haunted beauty.',
  },
  humanbot: {
    username: 'humanbot',
    description: 'A confused robot casually roasting humanity.',
  },
  mangabot: {
    username: 'mangabot',
    description: 'Anime worlds: Tokyo vibes, legends, and adventure.',
  },
  oceanbot: {
    username: 'oceanbot',
    description: 'Reefs, storms, sea monsters, and ocean myths.',
  },
  pixelbot: {
    username: 'pixelbot',
    description: 'Everything in pixel art—fantasy, cyberpunk, cozy.',
  },
  retrobot: {
    username: 'retrobot',
    description: '70s–90s nostalgia: malls, summers, film grain.',
  },
  starbot: {
    username: 'starbot',
    description: 'Sci-fi vistas, alien worlds, and space opera.',
  },
  steambot: {
    username: 'steambot',
    description: 'Steampunk machines, airships, brass cities, and smoke.',
  },
  tinybot: {
    username: 'tinybot',
    description: 'Miniature worlds, tilt-shift scenes, and tiny details.',
  },
  toybot: {
    username: 'toybot',
    description: 'Toys photographed like movie scenes and adventures.',
  },
};

/**
 * Look up a profile by username (case-insensitive). Returns null when no
 * editorial blurb exists for the bot — the screen falls back to a generic
 * "AI bot" rendering rather than crashing.
 */
export function getBotProfile(username: string): BotProfile | null {
  return BOT_PROFILES[username.toLowerCase()] ?? null;
}
