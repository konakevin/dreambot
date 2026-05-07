/**
 * curatedBots — picks which bots to feature in the MeetTheBotsSheet based on
 * the user's selected aesthetics. The actual bot list comes from the live
 * `get_bot_users` RPC (so newly-added or retired bots auto-update); this
 * module just decides which usernames to surface.
 *
 * Strategy: map each aesthetic to 2-4 bot usernames whose visual style
 * matches. Take the union of recommendations across the user's selected
 * aesthetics, dedupe, cap at 6. Fall back to a hand-picked "starter pack"
 * if nothing matches.
 *
 * NOTE: bot usernames here must match `users.username` in the database.
 * If a bot is renamed or removed, it'll silently drop out of the
 * recommendations (the live query won't return it).
 */

const AESTHETIC_BOT_MAP: Record<string, string[]> = {
  // Dark / gothic / macabre
  dark: ['gothbot', 'dragonbot'],
  macabre: ['gothbot', 'dragonbot'],
  nightshade: ['gothbot'],
  arcane: ['dragonbot', 'gothbot'],

  // Cozy / cute / soft
  cozy: ['chibibot', 'coquettebot', 'bloombot', 'tinybot'],
  whimsical: ['bloombot', 'coquettebot', 'tinybot'],
  coquette: ['coquettebot', 'bloombot'],
  peaceful: ['bloombot', 'oceanbot', 'earthbot'],
  enchanted: ['bloombot', 'tinybot'],

  // Sci-fi / retro / digital
  voltage: ['starbot', 'retrobot', 'pixelbot'],
  cinematic: ['starbot', 'retrobot', 'gothbot'],

  // Nature
  ethereal: ['oceanbot', 'bloombot', 'earthbot'],
  ancient: ['earthbot', 'dragonbot'],

  // Surreal / weird
  psychedelic: ['mangabot', 'pixelbot', 'retrobot'],
  surreal: ['mangabot', 'starbot', 'tinybot'],
  shimmer: ['bloombot', 'coquettebot', 'starbot'],

  // Bold / loud
  epic: ['dragonbot', 'dinobot', 'starbot'],
  fierce: ['gothbot', 'dragonbot', 'dinobot'],
  nostalgic: ['retrobot', 'pixelbot', 'brickbot'],
  minimal: ['toybot', 'brickbot', 'tinybot'],
};

// Fallback when none of the user's aesthetics map to anything (e.g., they
// picked an aesthetic we haven't curated yet, or they edited the profile
// without saving aesthetics yet). Hand-picked variety pack.
const FALLBACK_BOT_USERNAMES = [
  'bloombot',
  'starbot',
  'dragonbot',
  'oceanbot',
  'gothbot',
  'retrobot',
];

const MAX_RECOMMENDATIONS = 6;

/**
 * Given the user's selected aesthetics, return up to 6 bot usernames to
 * feature. Order: most-recommended first (counted across aesthetics),
 * then alphabetical for stable ordering across re-renders.
 */
export function curateBotsForAesthetics(aesthetics: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const aesthetic of aesthetics) {
    const recs = AESTHETIC_BOT_MAP[aesthetic.toLowerCase()];
    if (!recs) continue;
    for (const username of recs) {
      counts.set(username, (counts.get(username) ?? 0) + 1);
    }
  }

  if (counts.size === 0) {
    return FALLBACK_BOT_USERNAMES.slice(0, MAX_RECOMMENDATIONS);
  }

  const sorted = Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]; // highest count first
    return a[0].localeCompare(b[0]); // alpha for stable order
  });

  return sorted.slice(0, MAX_RECOMMENDATIONS).map(([username]) => username);
}
