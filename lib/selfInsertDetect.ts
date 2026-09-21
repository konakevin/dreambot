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
// ── Cast names ("me and Steph") ──────────────────────────────────────
// NOT name EXTRACTION. We never have to work out which token in a sentence is a
// person, which is the genuinely hard problem — we already hold the complete list
// of candidates (at most 5 roster names), so this is a bounded SEARCH: does any
// name the user gave a cast member appear in the prompt as a whole word?
// MUST match _shared/selfInsertDetector.ts.

/** Names shorter than this never match. Two-letter names collide with ordinary text
 *  far too often to be worth the rare person they would catch. */
export const MIN_CAST_NAME_LENGTH = 3;

/** Words a BARE cast-name mention must never hijack. Live source is
 *  engine_config.name_stop_words. MUST match the Deno module's list. */
export const DEFAULT_NAME_STOP_WORDS =
  'dawn|dusk|sky|star|storm|river|ocean|forest|meadow|summer|autumn|winter|spring|rose|ivy|jade|amber|pearl|ruby|opal|angel|faith|hope|grace|joy|misty|crystal|luna|aurora|nova|sierra|savannah|willow|hazel|olive|daisy|lily|violet|iris|heather|brook|wren|robin|fox|bear|wolf|king|queen|prince|art|may|june|dale|glen|cliff|reed|sunny|lucky|champ';

/** A named roster member, as the detector needs it. */
export interface CastName {
  id: string;
  name: string;
}

/** A user-typed name can legitimately contain regex metacharacters ("J.R.", "A+"),
 *  which would throw or match wildly if interpolated raw. */
function escapeRe(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** `\b` cannot anchor a name that starts or ends with punctuation, so names use the
 *  same explicit non-word guard the "+1" jargon does. */
function nameBoundary(literal: string): string {
  return `(?:^|[^\\w])(?:${literal})(?!\\w)`;
}

/** Every pattern in the detector is assembled from these alternation lists at RENDER
 *  time, and an admin can save a malformed one from the dashboard — an uncaught
 *  SyntaxError there fails the dream, silently, for everyone. Validate the list once
 *  and fall the WHOLE thing back to its canonical default rather than guarding each
 *  pattern, so a bad value degrades to known-good behaviour instead of half-working.
 *  (`buildSelfRegex` has always done this for self_ref_regex; this extends the same
 *  protection to the word lists.) */
function safeList(list: string, fallback: string): string {
  try {
    new RegExp(`(?:${list})`);
    return list;
  } catch {
    return fallback;
  }
}

/** Whole-string test against one of the live alternation lists. */
function matchesList(word: string, list: string): boolean {
  try {
    return new RegExp(`^(?:${list})$`, 'i').test(word);
  } catch {
    return false; // an invalid admin list must never take the detector down
  }
}

/** The roster names worth testing, in roster order (so first-match-wins is stable
 *  and matches the "duplicate names are fine, keyed by id" rule). A name that IS a
 *  relationship or pet word is dropped: those already resolve through their own path,
 *  so matching them again only doubles the chance of getting it wrong. */
function matchableNames(names: CastName[], relWords: string, petWords: string): CastName[] {
  return names.filter((n) => {
    // The id is the whole point of a match — without one there is nobody to cast, and
    // a junk entry that matched FIRST would swallow the real person behind it and
    // resolve to undefined. Checked here, not just at the call site, because this
    // takes whatever the stored recipe happens to hold.
    if (!n || typeof n.id !== 'string' || !n.id) return false;
    const name = typeof n.name === 'string' ? n.name.trim() : '';
    if (name.length < MIN_CAST_NAME_LENGTH) return false;
    return !matchesList(name, relWords) && !matchesList(name, petWords);
  });
}

// A capitalized word sitting in a "me and ___" slot that matched no cast member. Used
// ONLY to tell the user their person is not in the cast — never to cast anybody — so
// it is deliberately strict where matching is lenient: matching is case-insensitive
// because people type "me and steph", but with no roster hit there is no evidence a
// lowercase token is a name at all, so the note requires a capital.
const NAME_LIKE = "[A-Z][a-zA-Z'\u2019-]{2,}";
const NOT_A_NAME = /^(?:The|A|An|My|Our|His|Her|Their|Its|Some|That|This|Two|Both)$/;

/** The name-shaped word in a "me and ___" slot, or null. */
export function unnamedCoupleToken(text: string, conn: string): string | null {
  const patterns = [
    new RegExp(`\\b[Mm]e\\s+${conn}\\s+(${NAME_LIKE})`),
    new RegExp(`(?:^|[^\\w])(${NAME_LIKE})\\s+${conn}\\s+me\\b`),
  ];
  for (const re of patterns) {
    const hit = re.exec(text);
    if (hit && !NOT_A_NAME.test(hit[1])) return hit[1];
  }
  return null;
}

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
  /** The user's NAMED roster members, so "me and Steph" lights Steph's face. */
  castNames?: CastName[] | null;
  /** Live override for DEFAULT_NAME_STOP_WORDS (engine_config.name_stop_words). */
  nameStopWords?: string | null;
}

/** What the prompt references. `roles` drives the face lamp; `matchedPartnerId` is
 *  which roster member a name resolved to, so the Create screen can show that face
 *  BEFORE the user spends anything; `unmatchedName` is a name-shaped word that
 *  matched nobody, for the "not in your Dream Cast" note. */
export interface CastRefs {
  roles: Set<CastRole>;
  matchedPartnerId?: string;
  unmatchedName?: string;
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
  return detectCastRefs(prompt, words).roles;
}

/** The full read: roles PLUS which named cast member (if any) the prompt resolves to. */
export function detectCastRefs(prompt: string, words: DetectWords = {}): CastRefs {
  const text = prompt.trim();
  const roles = new Set<CastRole>();

  const relWords = safeList(
    words.relationshipWords || DEFAULT_RELATIONSHIP_WORDS,
    DEFAULT_RELATIONSHIP_WORDS
  );
  const petWords = safeList(words.petWords || DEFAULT_PET_WORDS, DEFAULT_PET_WORDS);
  const selfParts = safeList(
    words.selfPartWords || DEFAULT_SELF_PART_WORDS,
    DEFAULT_SELF_PART_WORDS
  );
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
  // Couple construction "me <connector> my/the <relationship>", robust to a
  // garbled/dropped "and": "me and my wife", "me an the wife", "me 'n the wife",
  // "me n the wife", "me & my wife", "me + my wife". A typo'd "an" used to make
  // the imperative filter (step 4) read "show me an ..." as "show me a[n apple]"
  // and silently drop SELF, rendering a solo of the partner (2026-07-10). This
  // positive signal adds BOTH roles up front so the connector's spelling can't
  // write the user out of their own couple dream; it also accepts the colloquial
  // "the wife" (not only "my wife"). The my/the/our + relationship-word guard
  // keeps it from firing on "show me an apple" / "give me a break".
  // Connector accepts a garbled/dropped "and": and | an | nd | 'n | n | & | +.
  const CONN = `(?:and|an|nd|['’]n|n|&|\\+)`;
  // A partner phrase: my/the/our (+ up to two descriptors) + relationship word.
  const REL = `(?:my|the|our)\\s+${MY_GAP}(?:${relWords})`;
  // Both orders: "me <conn> my/the wife" and "the wife <conn> me".
  const ME_COUPLE = new RegExp(`\\bme\\s+${CONN}\\s+${REL}\\b`, 'i');
  const COUPLE_ME = new RegExp(`\\b${REL}\\s+${CONN}\\s+me\\b`, 'i');

  // 1. Relationship references ("my wife", "my dog", "me and +1")
  if (MY_PLUS_ONE.test(text) || PLUS_ONE_STANDALONE.test(text)) roles.add('plus_one');
  if (MY_PET.test(text)) roles.add('pet');
  // 1b. Couple construction → the user + their partner, even with a garbled "and".
  if (ME_COUPLE.test(text) || COUPLE_ME.test(text)) {
    roles.add('self');
    roles.add('plus_one');
  }

  // ── Cast-name match ────────────────────────────────────────────────
  // First match wins, in roster order — duplicates are legal (the roster is keyed by
  // id, never by name), so two people called Steph resolve to the one added first.
  const names = matchableNames(words.castNames ?? [], relWords, petWords);
  const stopWords = safeList(
    words.nameStopWords || DEFAULT_NAME_STOP_WORDS,
    DEFAULT_NAME_STOP_WORDS
  );
  let matchedName: CastName | null = null;
  let nameInCouple = false;
  for (const candidate of names) {
    const lit = escapeRe(candidate.name.trim());
    if (!new RegExp(nameBoundary(lit), 'i').test(text)) continue;
    // An explicit couple construction is strong enough evidence to OVERRIDE the stop
    // list: "me and Rose" is a person, while "roses at dawn" is scenery.
    const inCouple = new RegExp(
      `(?:\\b[Mm]e\\s+${CONN}\\s+(?:${lit})(?!\\w)|${nameBoundary(lit)}\\s+${CONN}\\s+me\\b)`,
      'i'
    ).test(text);
    if (!inCouple && matchesList(candidate.name.trim(), stopWords)) continue;
    matchedName = candidate;
    nameInCouple = inCouple;
    break;
  }
  if (matchedName) {
    roles.add('plus_one');
    // "Steph at the beach" is a solo of Steph, exactly as "my wife at a bbq" is.
    if (nameInCouple) roles.add('self');
  }

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

  // Only worth reporting when nothing matched: with a real cast member found, a second
  // capitalized word is far more likely to be a place than a missing person.
  const unmatched = matchedName ? null : unnamedCoupleToken(text, CONN);

  return {
    roles,
    ...(matchedName ? { matchedPartnerId: matchedName.id } : {}),
    ...(unmatched ? { unmatchedName: unmatched } : {}),
  };
}
