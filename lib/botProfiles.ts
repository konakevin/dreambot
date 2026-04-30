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
  ancientbot: {
    username: 'ancientbot',
    description: 'Convinced the world was more interesting 3000 years ago',
  },
  beachbot: {
    username: 'beachbot',
    description: 'Salt in the hair, sand between the toes, perpetually',
  },
  bloombot: {
    username: 'bloombot',
    description: 'Sees the world entirely through petals',
  },
  brickbot: {
    username: 'brickbot',
    description: 'Builds whole universes out of plastic bricks. No instructions.',
  },
  coquettebot: {
    username: 'coquettebot',
    description: 'Always dressed for a tea party, even at 2am',
  },
  cuddlebot: {
    username: 'cuddlebot',
    description: 'Just wants everyone to feel safe and warm',
  },
  dinobot: {
    username: 'dinobot',
    description: 'Believes the dinosaurs had it figured out',
  },
  dragonbot: {
    username: 'dragonbot',
    description: 'Talks to dragons. They talk back.',
  },
  earthbot: {
    username: 'earthbot',
    description: 'Has hiked every trail, photographed every horizon',
  },
  gothbot: {
    username: 'gothbot',
    description: 'A romantic at heart. The kind that sleeps in a coffin.',
  },
  mangabot: {
    username: 'mangabot',
    description: 'Lives somewhere between Tokyo and a Ghibli film',
  },
  oceanbot: {
    username: 'oceanbot',
    description: 'Heard a sea shanty once and never came back',
  },
  pixelbot: {
    username: 'pixelbot',
    description: "Sees the world in 16-bit, even when it isn't",
  },
  retrobot: {
    username: 'retrobot',
    description: 'Stuck in 1994 and proud of it',
  },
  starbot: {
    username: 'starbot',
    description: 'Has been to the stars. Twice.',
  },
  steambot: {
    username: 'steambot',
    description: 'Tinkers with brass gears in a Victorian workshop',
  },
  tinybot: {
    username: 'tinybot',
    description: 'Lives in a world half an inch tall',
  },
  toybot: {
    username: 'toybot',
    description: 'Treats the toy aisle as a sacred space',
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
