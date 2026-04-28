/**
 * Self-Insert Detector — determines if a user prompt references cast members
 * (self, plus_one, pet) and should trigger cast injection.
 *
 * Context-aware "my":
 *   "my wife at a bbq"     → plus_one only (NOT self)
 *   "my wife and I dancing" → self + plus_one
 *   "my face in a painting" → self only ("face" is not a relationship word)
 *
 * False-positive filtering for imperative "me" constructions like
 * "show me a castle" where "me" = "for me", not "of me".
 */

export type CastRole = 'self' | 'plus_one' | 'pet';

export interface SelfInsertResult {
  isSelfInsert: boolean;
  cleanedPrompt: string;
  referencedRoles: Set<CastRole>;
}

// ── Relationship words (require "my" prefix) ─────────────────────────

const RELATIONSHIP_WORDS =
  'partner|wife|husband|girlfriend|boyfriend|spouse|fiancée?|friend|bestie|buddy|bff|pal|mom|dad|mother|father|brother|sister|son|daughter|family|hubby|wifey';
const PET_WORDS = 'dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo';

const MY_PLUS_ONE = new RegExp(`\\bmy\\s+(${RELATIONSHIP_WORDS})\\b`, 'i');
const MY_PET = new RegExp(`\\bmy\\s+(${PET_WORDS})\\b`, 'i');

// "my [anything else]" → self-reference (my face, my childhood home)
const MY_SELF = new RegExp(`\\bmy\\b(?!\\s+(${RELATIONSHIP_WORDS}|${PET_WORDS}))`, 'i');

// ── Self-pronouns (always mean the user themselves) ──────────────────

const SELF_PRONOUNS = /\b(I|I'm|I'll|I'd|I've|myself|mine|selfie)\b/i;

// ── "me" handling (imperative filtering) ─────────────────────────────

const ME_PATTERN = /\bme\b/i;

const ME_IMPERATIVES = [
  /\b(show|give|tell|send|teach|get|find|bring)\s+me\s+(a|an|the|some|any|about|how)\b/i,
  /\blet me (see|know)\b/i,
];

const ME_SELF_OVERRIDES = [/\bshow me (in|at|on|as)\b/i, /\bmake me (a|an|into|look)\b/i];

// ── Cleaning patterns ────────────────────────────────────────────────

const CLEAN_PLUS_ONE = new RegExp(`\\bmy\\s+(${RELATIONSHIP_WORDS})\\b`, 'gi');
const CLEAN_PET = new RegExp(`\\bmy\\s+(${PET_WORDS})\\b`, 'gi');

// ── Main detection ───────────────────────────────────────────────────

export function detectSelfInsert(prompt: string): SelfInsertResult {
  const text = prompt.trim();
  const roles = new Set<CastRole>();

  // 1. Check relationship references ("my wife", "my dog")
  if (MY_PLUS_ONE.test(text)) roles.add('plus_one');
  if (MY_PET.test(text)) roles.add('pet');

  // 2. Check self-pronouns (I, I'm, myself, mine, selfie)
  if (SELF_PRONOUNS.test(text)) roles.add('self');

  // 3. Check "my [non-relationship]" (my face, my childhood home)
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
    cleanedPrompt: isSelfInsert ? cleanSelfReferences(text) : prompt,
    referencedRoles: roles,
  };
}

function cleanSelfReferences(prompt: string): string {
  const cleaned = prompt
    // Relationship words first (before generic "my" replacement)
    .replace(CLEAN_PLUS_ONE, 'a companion')
    .replace(CLEAN_PET, 'a pet')
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
