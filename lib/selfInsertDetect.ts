/**
 * Client mirror of the cast-DETECTION half of
 * supabase/functions/_shared/selfInsertDetector.ts (separate Deno runtime —
 * the app can't import that module; tsconfig excludes supabase/functions/**).
 *
 * Drives the live face-swap indicator on the Create screen: as the user types,
 * the face icon lights when the prompt references the dream cast (self /
 * plus_one / pet). The indicator LIES unless this agrees with the engine, so:
 *
 *   - The word lists are live-tunable via engine_config.relationship_words /
 *     pet_words / self_ref_regex (migration 256), which BOTH runtimes read —
 *     pass them in from useEngineConfig so an admin fix lands on app + engine
 *     together. The DEFAULT_* fallbacks below MUST match the Deno module's.
 *   - The structural "me" imperative filtering is duplicated code by design
 *     (it's logic, not a word list). If you change it here or in the Deno
 *     module, change BOTH — the jest parity test
 *     (__tests__/lib/selfInsertParity.test.ts) fails on drift.
 *
 * Prompt-cleaning (rewriting "my wife" → "a companion") is deliberately NOT
 * mirrored — that's engine-only work.
 */

export type CastRole = 'self' | 'plus_one' | 'pet';

// MUST match _shared/selfInsertDetector.ts + the DEFAULTs in migration 256.
export const DEFAULT_RELATIONSHIP_WORDS =
  'plus[\\s-]?one|plus\\s?1|\\+\\s?1|significant other|partner|wife|husband|girlfriend|boyfriend|gf|bf|spouse|fiancée?|fiancé|fiance|fiancee|friend|best friend|bestie|buddy|bff|pal|mate|mom|mum|dad|mother|father|parent|brother|sister|sibling|twin|son|daughter|kid|kids|child|children|cousin|aunt|uncle|niece|nephew|grandma|grandpa|grandmother|grandfather|granny|roommate|neighbour|neighbor|coworker|colleague|teammate|classmate|hubby|wifey|family';
export const DEFAULT_PET_WORDS = 'dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo';
// "my ___" possessives that mean the user's own PERSON — a whitelist, so a
// generic possessive ("my annoying car") or a bare mid-typing "My" doesn't
// light the lamp. MUST match the Deno module's list.
export const DEFAULT_SELF_PART_WORDS =
  'face|head|hair|eyes|smile|beard|body|likeness|reflection|portrait|self';

// "mine" deliberately absent ("a diamond mine" is scenery, not the user).
const SELF_PRONOUNS = /\b(I|I'm|I'll|I'd|I've|myself|selfie)\b/i;

// "+1 / plus one / plus 1" is the app's own term for the second cast member,
// so it counts even without "my". '+' is a non-word char, so \b can't anchor
// its left edge — explicit start-or-non-word guard instead.
const PLUS_ONE_STANDALONE = /(?:^|[^\w])(?:\+\s?1|plus[\s-]?(?:one|1))(?!\w)/i;

const ME_PATTERN = /\bme\b/i;

const ME_IMPERATIVES = [
  /\b(show|give|tell|send|teach|get|find|bring)\s+me\s+(a|an|the|some|any|about|how)\b/i,
  /\blet me (see|know)\b/i,
];

const ME_SELF_OVERRIDES = [/\bshow me (in|at|on|as)\b/i, /\bmake me (a|an|into|look)\b/i];

export interface DetectWords {
  relationshipWords?: string | null;
  petWords?: string | null;
  selfRefRegex?: string | null;
  selfPartWords?: string | null;
}

function buildSelfRegex(override?: string | null): RegExp {
  if (override) {
    try {
      return new RegExp(override, 'i');
    } catch {
      // invalid admin pattern → fall through to the safe default
    }
  }
  return SELF_PRONOUNS;
}

/** Which cast roles the prompt references. Empty set = no cast injection. */
export function detectCastRoles(prompt: string, words: DetectWords = {}): Set<CastRole> {
  const text = prompt.trim();
  const roles = new Set<CastRole>();

  const relWords = words.relationshipWords || DEFAULT_RELATIONSHIP_WORDS;
  const petWords = words.petWords || DEFAULT_PET_WORDS;
  const selfParts = words.selfPartWords || DEFAULT_SELF_PART_WORDS;
  // Allow up to two descriptor words between "my" and the noun ("my sexy
  // wife", "my fluffy dog", "my beautiful face") — a bare \s+ missed the
  // adjectived forms entirely.
  const MY_GAP = '(?:\\w+\\s+){0,2}';
  const MY_PLUS_ONE = new RegExp(`\\bmy\\s+${MY_GAP}(${relWords})\\b`, 'i');
  const MY_PET = new RegExp(`\\bmy\\s+${MY_GAP}(${petWords})\\b`, 'i');
  // "my [self-part]" → self-reference (my face, my hair) — a WHITELIST, so a
  // generic possessive ("my annoying car") isn't a self-insert.
  const MY_SELF = new RegExp(`\\bmy\\s+${MY_GAP}(${selfParts})\\b`, 'i');
  const SELF_RE = buildSelfRegex(words.selfRefRegex);

  // 1. Relationship references ("my wife", "my dog", "me and +1")
  if (MY_PLUS_ONE.test(text) || PLUS_ONE_STANDALONE.test(text)) roles.add('plus_one');
  if (MY_PET.test(text)) roles.add('pet');

  // 2. Self-pronouns (I, I'm, myself, selfie) — admin-overridable.
  if (SELF_RE.test(text)) roles.add('self');

  // 3. "my [self-part]" (my face, my hair)
  if (MY_SELF.test(text)) roles.add('self');

  // 4. "me" with imperative filtering ("show me a castle" ≠ self)
  if (ME_PATTERN.test(text)) {
    let isSelf = false;
    for (const override of ME_SELF_OVERRIDES) {
      if (override.test(text)) {
        isSelf = true;
        break;
      }
    }
    if (!isSelf) {
      let imperative = false;
      for (const imp of ME_IMPERATIVES) {
        if (imp.test(text)) {
          imperative = true;
          break;
        }
      }
      if (!imperative) isSelf = true;
    }
    if (isSelf) roles.add('self');
  }

  return roles;
}
