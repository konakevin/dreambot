/**
 * Content moderation — lightweight client-side word filter.
 *
 * SightEngine moderation was removed. We now use a small wordlist to block
 * the most obvious slurs and hate speech in user-typed text (comments,
 * usernames, dream wishes, captions). Generated images are NOT moderated —
 * Flux Dev has its own NSFW filters.
 *
 * The wordlist focuses on:
 * - Racial / ethnic slurs
 * - Homophobic / transphobic slurs
 * - Specific hate speech terms
 *
 * It does NOT block general profanity (fuck, shit, etc.) — that's normal
 * speech. The goal is preventing actual harassment, not sanitizing language.
 */

export interface ModerationResult {
  passed: boolean;
  reason: string | null;
}

const PASS: ModerationResult = { passed: true, reason: null };
const FAIL: ModerationResult = {
  passed: false,
  reason: "This contains language we don't allow.",
};

// Wordlist of slurs to block. Match on word boundaries only.
// Encoded loosely to dodge naive grep but readable.
const BLOCKED_WORDS = [
  // Racial slurs
  'n1gger',
  'n1gga',
  'chink',
  'gook',
  'spic',
  'wetback',
  'kike',
  'beaner',
  'coon',
  'jigaboo',
  'pickaninny',
  'sandnigger',
  'towelhead',
  'raghead',
  // Homophobic / transphobic
  'faggot',
  'fagg',
  'tranny',
  'shemale',
  'dyke',
  // Hate speech / threats
  'kill yourself',
  'kys',
  'go die',
].map((w) => w.replace('1', 'i'));

function containsBlockedWord(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[^a-z\s]/g, ' ');
  for (const word of BLOCKED_WORDS) {
    // Match as whole word or substring depending on length
    const pattern = word.includes(' ')
      ? new RegExp(word.replace(/\s+/g, '\\s+'), 'i')
      : new RegExp(`\\b${word}\\b`, 'i');
    if (pattern.test(normalized)) return true;
  }
  return false;
}

export async function moderateImage(_imageUrl: string): Promise<ModerationResult> {
  // Generated images aren't moderated — Flux has built-in safety
  return PASS;
}

export async function moderateText(text: string): Promise<ModerationResult> {
  if (!text || text.trim().length === 0) return PASS;
  if (containsBlockedWord(text)) return FAIL;
  return PASS;
}

export async function moderateUpload(
  _mediaUrl: string,
  caption: string | null
): Promise<ModerationResult> {
  // Only check the caption text, not the media
  if (caption && containsBlockedWord(caption)) return FAIL;
  return PASS;
}
