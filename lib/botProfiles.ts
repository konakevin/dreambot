/**
 * Bot profiles for the "Meet the bots" onboarding screen.
 *
 * Each bot gets ONE short description — content only, no medium/style words.
 * Just what the bot posts about. Aim for ~6-12 words. Drop adjectives that
 * describe HOW it's rendered (oil-painted, photographed, anime-style) and
 * keep WHAT it shows (vampires, castles, dinosaurs, beaches).
 *
 * Avatar URL still comes from the live `useBotUsers` query — we never
 * hardcode avatars. If a bot is renamed or retired, it silently drops out.
 *
 * To update: edit the description below. The bot's actual content is
 * driven by `scripts/bots/<botname>/index.js` (paths/seeds/etc.) — that's
 * the source of truth for what gets posted; this file is the source of
 * truth for how we describe it on the meet-the-bots screen.
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
  ancientbot: {
    username: 'ancientbot',
    description: 'Lost civilizations, ancient temples, monumental ruins',
  },
  beachbot: {
    username: 'beachbot',
    description: 'Beaches, tropical coasts, tide pools, ocean moods',
  },
  bloombot: {
    username: 'bloombot',
    description: 'Flowers, gardens, blooming meadows, botanical wonder',
  },
  brickbot: {
    username: 'brickbot',
    description: 'LEGO cities, brick-built castles, mini disasters',
  },
  coquettebot: {
    username: 'coquettebot',
    description: 'Princess bedrooms, tea parties, cottagecore romance, Parisian daydreams',
  },
  cuddlebot: {
    username: 'cuddlebot',
    description: 'Cute creatures, sleepy animals, heartwarming tiny moments',
  },
  dinobot: {
    username: 'dinobot',
    description: 'Dinosaurs, prehistoric herds, volcanic eras, paleo wildlife',
  },
  dragonbot: {
    username: 'dragonbot',
    description: 'Dragons, magical realms, warriors, high-fantasy worlds',
  },
  earthbot: {
    username: 'earthbot',
    description: 'Mountains, deserts, oceans, real-Earth landscapes amplified',
  },
  gothbot: {
    username: 'gothbot',
    description: 'Vampires, gothic castles, witchcore, elegant darkness',
  },
  mangabot: {
    username: 'mangabot',
    description: 'Tokyo streets, samurai, slice-of-life Japan, mythical creatures',
  },
  oceanbot: {
    username: 'oceanbot',
    description: 'Underwater worlds, mermaids, krakens, maritime myth',
  },
  pixelbot: {
    username: 'pixelbot',
    description: 'Fantasy quests, cozy cottages, cyberpunk cities, pixel adventures',
  },
  retrobot: {
    username: 'retrobot',
    description: '90s malls, video stores, summer afternoons, childhood frozen',
  },
  starbot: {
    username: 'starbot',
    description: 'Cosmic vistas, alien worlds, space opera, futuristic cities',
  },
  steambot: {
    username: 'steambot',
    description: 'Steampunk airships, clockwork contraptions, Victorian industry',
  },
  tinybot: {
    username: 'tinybot',
    description: 'Miniature villages, dollhouse interiors, dioramas, macro magic',
  },
  toybot: {
    username: 'toybot',
    description: 'Toys come alive: LEGO epics, action figures, designer toys',
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
