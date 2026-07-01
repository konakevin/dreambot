/**
 * Self-Insert Detector — determines if a user prompt references cast members
 * (self, plus_one, pet) and should trigger cast injection.
 *
 * Context-aware "my":
 *   "my wife at a bbq"      → plus_one only (NOT self)
 *   "my wife and I dancing" → self + plus_one
 *   "my face in a painting" → self only ("face" is a self-PART word)
 *   "my annoying car"       → nothing (possessive of an object ≠ self-insert)
 *
 * False-positive filtering for imperative "me" constructions like
 * "show me a castle" where "me" = "for me", not "of me".
 *
 * MIRRORED on the client as lib/selfInsertDetect.ts (drives the Create
 * screen's live face-swap lamp — separate RN runtime, can't import this Deno
 * module). Any change to detection logic or default word lists here MUST be
 * made there too; the jest parity suite (__tests__/lib/selfInsertParity.test.ts)
 * fails on drift.
 */

export type CastRole = 'self' | 'plus_one' | 'pet';

export interface SelfInsertResult {
  isSelfInsert: boolean;
  cleanedPrompt: string;
  referencedRoles: Set<CastRole>;
}

// ── Relationship + pet word lists (require "my" prefix) ──────────────

// CANONICAL CODE FALLBACK. The LIVE source is engine_config.relationship_words /
// pet_words (migration 256) — generate-dream passes those in via opts so an admin
// can fix detection from the dashboard with NO deploy. These constants only apply
// when the DB value is missing/unreachable. "plus one" / "+1" lead the list —
// the app's own term for the second cast member; its absence used to fall through
// the MY_SELF catch-all and wrongly cast SELF (Kevin, 2026-06-08).
//
// MUST match the DEFAULTs in migration 256 AND the client fallback in
// hooks/useEngineConfig.ts (separate RN runtime — can't import this Deno module).
export const DEFAULT_RELATIONSHIP_WORDS =
  'plus[\\s-]?one|plus\\s?1|\\+\\s?1|significant other|partner|wife|husband|girlfriend|boyfriend|gf|bf|spouse|fiancée?|fiancé|fiance|fiancee|friend|best friend|bestie|buddy|bff|pal|mate|mom|mum|dad|mother|father|parent|brother|sister|sibling|twin|son|daughter|kid|kids|child|children|cousin|aunt|uncle|niece|nephew|grandma|grandpa|grandmother|grandfather|granny|roommate|neighbour|neighbor|coworker|colleague|teammate|classmate|hubby|wifey|family';
export const DEFAULT_PET_WORDS = 'dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo';

// ── Self-PART words (require "my" prefix) ────────────────────────────
// "my ___" possessives that mean the user's own PERSON ("my face", "my hair").
// This whitelist replaced the old catch-all `my [anything-not-relationship]`
// rule, which cast SELF for "my annoying car in the sun" and even a bare
// mid-typing "My" (2026-07-01). A generic possessive ("my car", "my childhood
// home") no longer self-inserts — the user says "me at my childhood home" to
// appear in it.
export const DEFAULT_SELF_PART_WORDS =
  'face|head|hair|eyes|smile|beard|body|likeness|reflection|portrait|self';

// ── Self-pronouns (always mean the user themselves) ──────────────────
// "mine" was dropped 2026-07-01: scenery nouns ("a diamond mine", "an
// abandoned mine shaft") false-positived as self and cast the user.

const SELF_PRONOUNS = /\b(I|I'm|I'll|I'd|I've|myself|selfie)\b/i;

// ── Standalone plus-one jargon (no "my" required) ────────────────────
// "+1 / plus one / plus 1" is the app's own term for the second cast member,
// so it counts even without "my" ("me and +1 in paris"). '+' is a non-word
// char, so \b can't anchor its left edge — use an explicit start-or-non-word
// guard instead.
const PLUS_ONE_STANDALONE = /(?:^|[^\w])(?:\+\s?1|plus[\s-]?(?:one|1))(?!\w)/i;

// ── "me" handling (imperative filtering) ─────────────────────────────

const ME_PATTERN = /\bme\b/i;

const ME_IMPERATIVES = [
  /\b(show|give|tell|send|teach|get|find|bring)\s+me\s+(a|an|the|some|any|about|how)\b/i,
  /\blet me (see|know)\b/i,
];

const ME_SELF_OVERRIDES = [/\bshow me (in|at|on|as)\b/i, /\bmake me (a|an|into|look)\b/i];

/** Live-config inputs (from engine_config). All optional — each falls back to a
 *  hardcoded default. relationshipWords/petWords/selfPartWords build the
 *  "my ___" patterns; selfRefRegex overrides the self-PRONOUN matcher (the same
 *  override the client already honors), so both runtimes agree. The "me"
 *  imperative logic is NOT overridable — it's structural, not a word list, and
 *  stays in code. NOTE: a selfRefRegex override should NOT include bare "me"
 *  (me is handled separately with imperative filtering, e.g. "show me a castle"
 *  ≠ self). */
export interface DetectWords {
  relationshipWords?: string;
  petWords?: string;
  selfRefRegex?: string | null;
  selfPartWords?: string;
}

/** Build the self-pronoun matcher from an admin override, falling back to the
 *  built-in pronouns on null/empty or an invalid pattern (never throws). */
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

// ── Main detection ───────────────────────────────────────────────────

export function detectSelfInsert(prompt: string, words: DetectWords = {}): SelfInsertResult {
  const text = prompt.trim();
  const roles = new Set<CastRole>();

  const relWords = words.relationshipWords || DEFAULT_RELATIONSHIP_WORDS;
  const petWords = words.petWords || DEFAULT_PET_WORDS;
  const selfParts = words.selfPartWords || DEFAULT_SELF_PART_WORDS;
  // Allow up to two descriptor words between "my" and the noun ("my sexy
  // wife", "my fluffy dog", "my beautiful face") — a bare \s+ missed the
  // adjectived forms entirely (2026-07-01: "my sexy wife in hawaii" cast
  // nothing).
  const MY_GAP = '(?:\\w+\\s+){0,2}';
  const MY_PLUS_ONE = new RegExp(`\\bmy\\s+${MY_GAP}(${relWords})\\b`, 'i');
  const MY_PET = new RegExp(`\\bmy\\s+${MY_GAP}(${petWords})\\b`, 'i');
  // "my [self-part]" → self-reference (my face, my hair) — a WHITELIST, so a
  // generic possessive ("my annoying car") isn't a self-insert.
  const MY_SELF = new RegExp(`\\bmy\\s+${MY_GAP}(${selfParts})\\b`, 'i');
  const SELF_RE = buildSelfRegex(words.selfRefRegex);

  // 1. Check relationship references ("my wife", "my dog", "me and +1")
  if (MY_PLUS_ONE.test(text) || PLUS_ONE_STANDALONE.test(text)) roles.add('plus_one');
  if (MY_PET.test(text)) roles.add('pet');

  // 2. Check self-pronouns (I, I'm, myself, selfie) — admin-overridable.
  if (SELF_RE.test(text)) roles.add('self');

  // 3. Check "my [self-part]" (my face, my hair)
  if (MY_SELF.test(text)) roles.add('self');

  // 4. Check "me" with imperative filtering
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

  const isSelfInsert = roles.size > 0;

  return {
    isSelfInsert,
    cleanedPrompt: isSelfInsert ? cleanSelfReferences(text, relWords, petWords) : prompt,
    referencedRoles: roles,
  };
}

function cleanSelfReferences(prompt: string, relWords: string, petWords: string): string {
  // Descriptor words between "my" and the noun are CAPTURED and kept — the
  // user's adjective is rendering intent ("my sexy wife" → "a sexy companion",
  // not just "a companion").
  const CLEAN_PLUS_ONE = new RegExp(`\\bmy\\s+((?:\\w+\\s+){0,2})(?:${relWords})\\b`, 'gi');
  const CLEAN_PET = new RegExp(`\\bmy\\s+((?:\\w+\\s+){0,2})(?:${petWords})\\b`, 'gi');
  const cleaned = prompt
    // Relationship words first (before generic "my" replacement)
    .replace(CLEAN_PLUS_ONE, 'a $1companion')
    .replace(CLEAN_PET, 'a $1pet')
    // Standalone "+1 / plus one" jargon (no "my") — same guard as detection;
    // without this the raw "+1" token would leak into the image prompt.
    .replace(/(^|[^\w])(?:\+\s?1|plus[\s-]?(?:one|1))(?!\w)/gi, '$1a companion')
    // Contractions
    .replace(/\bI'm\b/gi, 'a person is')
    .replace(/\bI'll\b/gi, 'a person will')
    .replace(/\bI'd\b/gi, 'a person would')
    .replace(/\bI've\b/gi, 'a person has')
    .replace(/\bI am\b/gi, 'a person is')
    .replace(/\bI was\b/gi, 'a person was')
    // Verb + me
    .replace(/\b(put|place|show)\s+me\b/gi, '')
    .replace(/\bmake me\b/gi, 'make a person')
    // Standalone pronouns
    .replace(/\bI\b/gi, 'a person')
    .replace(/\bmy\b/gi, "a person's")
    .replace(/\bmyself\b/gi, 'a person')
    .replace(/\bmine\b/gi, "a person's")
    .replace(/\bme\b/gi, 'a person')
    .replace(/\bselfie\b/gi, 'portrait')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || 'in a cinematic scene';
}
