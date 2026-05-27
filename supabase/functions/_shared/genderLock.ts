/**
 * genderLock — the SINGLE source of truth for cast-member gender resolution
 * and the gender-lock phrasing used in render prompts.
 *
 * Used by the create flow (castResolver → promptCompiler), the nightly slot
 * pipeline (characterSlotPrompt), and nightly-dreams directly. Before this
 * module, three separate places re-derived gender (castResolver, nightly's
 * inline regex, characterSlotPrompt.extractGender) and only the dual path
 * shouted a lock — so a male cast photo could land on a female body on the
 * nightly single-cast path. This unifies all of them.
 *
 * ⚠️ NEGATION-LEAK LESSON (MechBot cyborg-man, 2026-05): diffusion models
 * attend to nouns even after "not"/"do not" — "do not feminize" makes the
 * model render femininity. So every lock LEADS with what the subject IS
 * (positive masculine/feminine description); negation is avoided.
 */

export type CastGender = 'male' | 'female';

/** Anything we can read a gender off of — explicit field preferred over prose. */
export interface GenderResolvable {
  role?: string;
  /** Explicit gender captured at describe-photo time — the authoritative signal. */
  gender?: 'male' | 'female' | null;
  /** Free-text vision description (fallback signal). */
  description?: string | null;
  /** Cleaned prompt description (fallback signal). */
  promptDesc?: string | null;
}

const MAN_RE = /\b(man|male|guy|gentleman|boy|father|dad|husband|brother|son)\b/;
const WOMAN_RE = /\b(woman|female|lady|girl|mother|mom|wife|sister|daughter)\b/;

/**
 * Resolve a cast member's gender.
 *   1. Pets (role === 'pet') → null (never gender-locked).
 *   2. Explicit `gender` field wins (set by describe-photo vision).
 *   3. Else infer from prose (first gendered keyword wins, mirroring the
 *      legacy extractGender ordering).
 *   4. No signal at all → null (caller decides whether to lock).
 */
export function resolveCastGender(member: GenderResolvable): CastGender | null {
  if (member.role === 'pet') return null;
  if (member.gender === 'male' || member.gender === 'female') return member.gender;

  const text = `${member.promptDesc ?? ''} ${member.description ?? ''}`.toLowerCase();
  if (!text.trim()) return null;
  const m = text.match(MAN_RE);
  const w = text.match(WOMAN_RE);
  if (m && w) return (m.index ?? 0) < (w.index ?? 0) ? 'male' : 'female';
  if (m) return 'male';
  if (w) return 'female';
  return null;
}

/** The plain noun the slot prompt uses. */
export function genderNoun(gender: CastGender): 'man' | 'woman' {
  return gender === 'male' ? 'man' : 'woman';
}

/**
 * Short, SHOUTED, positive-led gender-lock phrase for the prompt opener
 * (used at position 1 of single + dual character prompts). Also front-loads
 * "face clearly to the camera" so the face-swap step gets a detectable face.
 */
export function genderLockShout(gender: CastGender): string {
  return gender === 'male'
    ? 'a MALE man — masculine face, masculine build, clearly a man (beard or facial hair if he has it), his face turned clearly toward the camera'
    : 'a FEMALE woman — feminine face and feminine build, clearly a woman, her face turned clearly toward the camera';
}

/**
 * Longer lock sentence baked into the create-flow prompt's
 * "GENDER — NON-NEGOTIABLE" block (via castResolver). MUST keep the leading
 * "MALE character" / "FEMALE character" tokens — `dualGenderRouting.genderFromLock`
 * parses them to route dual face-swap sources.
 */
export function genderLockSentence(gender: CastGender): string {
  return gender === 'male'
    ? 'MALE character — a man with masculine features, build, and clothing; full beard / facial hair visible if described; keep him clearly a man.'
    : 'FEMALE character — a woman with feminine features and build; keep her clearly a woman, with no facial hair.';
}
