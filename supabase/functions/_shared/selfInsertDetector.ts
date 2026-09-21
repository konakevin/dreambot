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
  /** Roster id of the cast member the prompt named, if any. The render re-points the
   *  plus_one mirror at them, which is how a name beats the starred default. */
  matchedPartnerId?: string;
  /** A name-shaped word the user paired themselves with that matched NOBODY. Surfaced
   *  to the client so it can say "Steph isn't in your Dream Cast"; never casts anyone. */
  unmatchedName?: string;
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

// ── Cast names ("me and Steph") ──────────────────────────────────────
// NOT name EXTRACTION. We never have to work out which token in a sentence is a
// person, which is the genuinely hard problem — we already hold the complete list
// of candidates (at most 5 roster names), so this is a bounded SEARCH: does any
// name the user gave a cast member appear in the prompt as a whole word?

/** Names shorter than this never match. Two-letter names collide with ordinary text
 *  far too often to be worth the rare person they would catch. */
export const MIN_CAST_NAME_LENGTH = 3;

/** Words a BARE cast-name mention must never hijack. CANONICAL CODE FALLBACK — the
 *  live source is engine_config.name_stop_words, so a bad match is a dashboard fix
 *  with no deploy (same contract as relationship_words / pet_words).
 *
 *  Deliberately weighted toward DREAM-PROMPT vocabulary rather than common English:
 *  the dangerous overlap is names that double as scenery, because those are the words
 *  people actually type here. A stop-listed name is still matchable inside an explicit
 *  couple construction (see below), so someone really called Luna is not locked out. */
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
  /** The user's NAMED roster members, so "me and Steph" casts Steph. Passed in from
   *  vibe_profile.partner_library — these names are COMPARED against and never
   *  concatenated into a prompt, which is what keeps user-typed text out of the
   *  engine's own instructions. */
  castNames?: CastName[];
  /** Live override for DEFAULT_NAME_STOP_WORDS (engine_config.name_stop_words). */
  nameStopWords?: string;
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
  // adjectived forms entirely (2026-07-01: "my sexy wife in hawaii" cast
  // nothing).
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

  // 1. Check relationship references ("my wife", "my dog", "me and +1")
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
    // list: "me and Rose" is a person, while "roses at dawn" is scenery. That is what
    // keeps a real Dawn or Luna usable without letting scenery words cast anybody.
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
  // Only worth reporting when nothing matched: with a real cast member found, a second
  // capitalized word is far more likely to be a place than a missing person.
  const unmatched = matchedName ? null : unnamedCoupleToken(text, CONN);

  return {
    isSelfInsert,
    cleanedPrompt: isSelfInsert
      ? cleanSelfReferences(text, relWords, petWords, matchedName)
      : prompt,
    referencedRoles: roles,
    ...(matchedName ? { matchedPartnerId: matchedName.id } : {}),
    ...(unmatched ? { unmatchedName: unmatched } : {}),
  };
}
// A capitalized word sitting in a "me and ___" slot that matched no cast member. Used
// ONLY to tell the user their person is not in the cast — never to cast anybody — so
// it is deliberately strict where matching is lenient: matching is case-insensitive
// because people type "me and steph", but with no roster hit there is no evidence a
// lowercase token is a name at all, so the note requires a capital. A missed note
// costs nothing; a wrong one is noise.
const NAME_LIKE = "[A-Z][a-zA-Z'\u2019-]{2,}";
// Capitalized words that are never the person: articles and possessives that routinely
// open a noun phrase ("me and The Eiffel Tower").
const NOT_A_NAME = /^(?:The|A|An|My|Our|His|Her|Their|Its|Some|That|This|Two|Both)$/;

/** The name-shaped word in a "me and ___" slot, or null. Does NOT decide whether it
 *  is a real cast member — the caller checks that. */
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

function cleanSelfReferences(
  prompt: string,
  relWords: string,
  petWords: string,
  matchedName: CastName | null = null
): string {
  // Descriptor words between "my" and the noun are CAPTURED and kept — the
  // user's adjective is rendering intent ("my sexy wife" → "a sexy companion",
  // not just "a companion").
  const CLEAN_PLUS_ONE = new RegExp(`\\bmy\\s+((?:\\w+\\s+){0,2})(?:${relWords})\\b`, 'gi');
  // Pet species is CAPTURED and kept ("my fluffy cat" → "a fluffy cat", never
  // "a fluffy pet"). The old species-erasing replacement assumed a pet cast
  // member's description would fill the gap — but a user with NO pet in their
  // cast lost the species entirely and Flux rendered an ambiguous "fluffy pet"
  // blob (2026-09-02 prompt-fidelity fix: "cuddling my fluffy cat" dropped the
  // cat on every dream-art medium). When a cast pet DOES exist its description
  // still drives the look; the species word only ever agrees with it.
  const CLEAN_PET = new RegExp(`\\bmy\\s+((?:\\w+\\s+){0,2})(${petWords})\\b`, 'gi');
  // The matched NAME has to go the same way "my wife" does. Left in, Flux receives a
  // proper noun: a name that collides with a celebrity drags that person's face into
  // the render, and an unusual one gets drawn as lettering. The cast photo carries the
  // likeness; the prompt only needs to know someone is there.
  const withoutName = matchedName
    ? prompt.replace(new RegExp(nameBoundary(escapeRe(matchedName.name.trim())), 'gi'), (hit) =>
        /^[^\w]/.test(hit) ? `${hit[0]}a companion` : 'a companion'
      )
    : prompt;
  const cleaned = withoutName
    // Relationship words first (before generic "my" replacement)
    .replace(CLEAN_PLUS_ONE, 'a $1companion')
    .replace(CLEAN_PET, 'a $1$2')
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
    // Trim BEFORE the conjunction strip: removing a leading "Show me" leaves the string
    // starting with a space, which the ^ anchor below would otherwise never get past.
    .trim()
    // "Show me and Steph snowboarding" cleaned to "and a companion snowboarding": the
    // verb+me strip above removes the sentence's SUBJECT and leaves the conjunction
    // dangling at the front. Harmless to a human reader, but this string is a brief for
    // Sonnet, and an instruction that opens mid-clause is a worse one than the same
    // fragment without it. Only true conjunctions — never the article "an", which is
    // the opening word of plenty of real prompts.
    .replace(/^(?:and\b|[&+,])\s*/i, '')
    .trim();
  return cleaned || 'in a cinematic scene';
}
