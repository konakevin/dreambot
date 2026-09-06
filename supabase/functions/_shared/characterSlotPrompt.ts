/**
 * Unified character face-swap slot-based prompt pipeline.
 * Handles BOTH single-character and dual-character face-swap renders.
 *
 * Why slot-based:
 *   Freeform Sonnet output let the model write camera/face/pronoun/positioning
 *   language that fought the L/R role lock and produced gender swaps,
 *   asymmetric placements, and stylized-to-photoreal drift. With slots,
 *   Sonnet ONLY writes scene, wardrobe, mood, props — everything that
 *   drives face-swap geometry (camera, framing, face visibility, identity,
 *   gender, side assignment) is hardcoded by the template here.
 *
 * Why unified single + dual:
 *   Both paths need the SAME architectural improvements: model rotation,
 *   per-model fragment overrides, vibe bans, wardrobe-mood randomization,
 *   forbidden-phrase validation, location pillar position. Splitting into
 *   two pipelines means fixing things in two places. Unifying gets us
 *   one source of truth — cast.length === 1 vs 2 drives the few
 *   differences (gender lock, L/R framing) inside this file.
 *
 * Used by:
 *   - nightly-dreams (single human face-swap + dual face-swap)
 *   Pet single-character renders still use the legacy freeform brief
 *   because the slot pipeline assumes human cast.
 */

import { callSonnet } from './llm.ts';
import { resolveCastGender, genderNoun, genderLockShout, type CastGender } from './genderLock.ts';
import { varyFemaleHair, type HairSceneRegister } from './femaleHairVariation.ts';
import { buildSceneHook } from './sceneHook.ts';
import { normalizeActionBeat, depronounActionBeat, validateActionBeat } from './actionSafety.ts';

// ── Public types ─────────────────────────────────────────────────────────

export type CastSlotMember = {
  /** Cast role label — used for L/R assignment in dual */
  role: string;
  /** Llama-Vision-generated prose description from describe-photo */
  promptDesc: string;
  /** Numeric age estimate (from describe-photo AGE: line) */
  age?: number | null;
  /** Compact comma-separated physical traits (hair / build / eyes / skin / age) */
  physicalSummary?: string | null;
  /** Explicit gender (from describe-photo). Authoritative — preferred over
   * inferring gender from promptDesc. Pass it through so the body renders the
   * correct sex and the face-swap lands a male face on a male body. */
  gender?: 'male' | 'female' | null;
  /** Broad race bucket from classifyEthnicity (White / Black / East Asian /
   * South Asian / Hispanic-Latino / Middle Eastern), or null when unread. Used
   * as the strongest cast RACE anchor to beat a location ethnicity prior
   * ("set in china" → local). Null → fall back to skin-tone. (RACE_FIDELITY_PLAN.md) */
  ethnicity?: string | null;
};

export type SingleSlots = {
  scene_description: string;
  wardrobe: string;
  mood: string;
  props: string;
  /** Scene-first authored action beat (SCENE_FIRST_ACTION_PLAN.md). Only present when the
   *  brief asked for it (`authorAction`) AND it passed the swap-safe validator. */
  action?: string | null;
};

export type DualSlots = {
  scene_description: string;
  left_wardrobe: string;
  right_wardrobe: string;
  mood: string;
  props: string;
  /** Scene-first authored action beat — see SingleSlots.action. */
  action?: string | null;
};

export type CharacterSlots = SingleSlots | DualSlots;

export interface CharacterSlotPipelineInput {
  /** 1 cast member (single character) or 2 (dual character).
   * Order matters for dual: [LEFT, RIGHT] mapping is locked downstream. */
  cast: CastSlotMember[];
  // Scene anchors
  iconicAnchor: string | null;
  userPlace: string | null;
  /** When a SCENARIO replaces the location, the full seed text rides
   * iconicAnchor (Sonnet's brief needs the whole scenario) but the assembled
   * prompt's early "set at" slot uses THIS dieted setting clause instead —
   * keeping pose/creature choreography out of the highest-attention window
   * (2026-09-03 camel-render diagnosis). Null → set at iconicAnchor/userPlace. */
  setAtOverride?: string | null;
  timeAxis: string;
  weatherAxis: string;
  phenomenaAxis: string;
  /** Optional location-specific wardrobe anchor rolled from biome_config.WARDROBE
   * (added 2026-05). If set, supersedes the generic WARDROBE_MOODS pick so
   * characters render in on-location attire (fairy-tale tunics at Fairy Cottage,
   * yukata at Tokyo, etc.). If null, falls back to the generic mood randomizer. */
  wardrobeAnchor?: string | null;
  /** Whether the location is a REAL-WORLD place (not a fantasy/imagined dream
   * world). Drives the TRAVELER wardrobe rule: on real places the cast are
   * VISITORS and must wear contemporary travel clothes, never the traditional/
   * national/ethnic dress of that culture (a white cast in a hanfu reads Chinese —
   * a major vector in the race-swap bug). Fantasy/imagined worlds keep their
   * in-world attire, so the rule is suppressed there. Undefined → treated as
   * real-world (the safe default: the rule only ever bans REAL-culture dress, which
   * fantasy worlds don't use). Set explicitly by nightly-dreams from
   * `!imaginedLocation`. (RACE_FIDELITY_PLAN.md) */
  realWorldLocation?: boolean;
  // Medium + tone
  mediumFluxFragment: string;
  vibeDirective: string;
  avoidList: string;
  // Pose
  action: string | null;
  /** SCENE-FIRST ACTION (2026-09-05, SCENE_FIRST_ACTION_PLAN.md). When set, Sonnet AUTHORS the
   *  action beat FROM the scene in this same call (a new `action` slot) instead of being handed a
   *  pre-rolled pool pose to build the scene around. `action` above then serves only as the
   *  fallback when the authored beat fails the swap-safe validator. `register` names the
   *  scene register for Sonnet (goofy / elegant / holiday:<pool>); `exemplars` are 3 pool poses
   *  shown as STYLE examples only. Nightly-only — Create/DLT never set it, so with it unset every
   *  code path here is byte-identical to before (locked by __tests__/lib/sceneFirstAction.test.ts). */
  authorAction?: AuthorActionSpec | null;
  /** COUPLE framing preset (2026-09-06 variance): 'waist_up' = the closer two-shot that used to appear
   *  at random (faces larger, swap-friendlier); null/'three_quarter' = the knees-up default. Gated by
   *  engine_config.dual_closer_pct upstream. Solo renders ignore it. */
  dualComposition?: 'three_quarter' | 'waist_up' | null;
  /** COUPLE stance flags (dualStances.ts): seated → the anchor stops saying "stand"; heightContrast →
   *  the "same vertical height" line is omitted (one seated, one standing). */
  dualStance?: { seated?: boolean; heightContrast?: boolean } | null;
  /** Stage 5c (2026-07-09): expanded SOLO composition preset. null/undefined =
   *  the classic waist-up frontal contract. Only meaningful for cast.length 1;
   *  gated upstream by engine_config.single_composition_expanded_pct. The
   *  Stage-8 identity gates (restore + post-swap verify) are what make the
   *  smaller-face presets safe to ship. */
  soloComposition?: 'three_quarter' | 'enviro_wide' | null;
  /** NIGHTLY female-hairstyle variation (2026-08-31). When > 0, a FEMALE cast
   *  member's hair is re-styled with this % chance (preserving color/length/
   *  bangs/coily texture). Only the nightly path sets this; Create leaves it
   *  unset, so variation never fires there. Read from
   *  engine_config.female_hair_variation_pct. */
  femaleHairVariationPct?: number | null;
  /** Scene register for the hair-style bias (elegant → updos/glam, active →
   *  ponytails/braids). Derived from the rolled nightly scene kind. */
  sceneRegister?: HairSceneRegister | null;
}

export interface AuthorActionSpec {
  register: string;
  exemplars: string[];
  /** Rolled couple body-language frame (dualStances.ts) — Sonnet builds the beat around it. */
  stance?: string | null;
  /** Genre register sample (actionRegisters.ts): coherent things people do in THIS world + composed
   *  stills — Sonnet picks or adapts one. */
  registerActions?: string[] | null;
}

export interface CharacterSlotPipelineResult {
  briefUsed: string;
  rawResponse: string;
  slots: CharacterSlots;
  assembledPrompt: string;
  fallbackReasons: string[];
  retries: number;
}

// ── Cast description parsing helpers (shared single + dual) ─────────────

export function extractGender(promptDesc: string): 'man' | 'woman' | 'person' {
  const lower = promptDesc.toLowerCase();
  const manRe = /\b(man|male|guy|gentleman|boy|father|dad|husband|brother|son)\b/;
  const womanRe = /\b(woman|female|lady|girl|mother|mom|wife|sister|daughter)\b/;
  const manMatch = lower.match(manRe);
  const womanMatch = lower.match(womanRe);
  if (manMatch && womanMatch) {
    return manMatch.index! < womanMatch.index! ? 'man' : 'woman';
  }
  if (manMatch) return 'man';
  if (womanMatch) return 'woman';
  return 'person';
}

// Pull JUST the hair / facial-hair tokens out of physical_summary. The full
// physical_summary contains eye color, skin tone, face shape too — those get
// face-swapped away anyway and in the prompt they pull renders toward
// Disney-princess / stock-photo archetypes. Hair + build (handled separately)
// are the only identity traits actually visible in the final render.
export function extractHair(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const parts = physicalSummary.split(/[,;]/).map((p) => p.trim());
  const hairParts = parts.filter((p) =>
    /\b(hair|beard|stubble|clean[- ]shaven|mustache|moustache|sideburns|bald|balding|hairline)\b/i.test(
      p
    )
  );
  if (hairParts.length === 0) return null;
  return hairParts.join(', ');
}

// Pull JUST the skin-tone / complexion clause out of physical_summary. Skin
// tone is RACE-CRITICAL and MUST reach the prompt: the face swap only refines
// the FACE — the neck/arms/chest/hands are ALWAYS Flux-generated and never
// swapped, so with no skin descriptor a strong location ethnicity prior ("fiji"
// → Pacific Islander, "egypt", "brazil", "japan") fills in the WRONG race, and
// a low-fidelity or shirtless render can't be corrected by the swap. The cast
// description must OVERRIDE the character's race (Kevin, 2026-08-27: a white
// cast rendered Polynesian in a Fiji couple dream because extractHair dropped
// the "warm peachy-tan skin" clause, leaving nothing to counter the prior).
// We include ONLY the skin clause here, NOT eye color / face shape — those are
// the tokens that (per extractHair's note) pull renders toward Disney-princess /
// stock-photo archetypes. Skin tone does not.
export function extractSkin(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const parts = physicalSummary.split(/[,;]/).map((p) => p.trim());
  const skinParts = parts.filter((p) => /\bskin\b|complexion|-skinned|\btoned\b/i.test(p));
  if (skinParts.length === 0) return null;
  return skinParts.join(', ');
}

// Pull the build word from physical_summary. Constrained to the SAME three
// buckets the describer now emits — thin / athletic / average — so no one ever
// gets a heavy/unkind body label. Any other (legacy) word like "curvy" or
// "full-figured" from an older stored description is IGNORED (→ null), so the
// AI decides the body instead of inheriting a wrong size token. (2026-06-16)
export function extractBuild(physicalSummary: string | null | undefined): string {
  const m = (physicalSummary ?? '').toLowerCase().match(/\b(thin|athletic|average)\b/);
  // Default to "average" when the regex finds no bucket — covers legacy stored
  // descriptions ("curvy"/"full-figured" → average) and any model miss. Kevin's
  // rule: never a heavy/unkind label; everyone who isn't thin/athletic is average.
  return m ? m[1] : 'average';
}

// Pull explicit age phrase from cast desc so we can front-load it. Flux
// otherwise defaults "generic adult" (skewing older) when age is buried.
export function extractAge(promptDesc: string): string | null {
  const s = promptDesc.toLowerCase();
  const decadeNum = s.match(
    /\b(early|mid|late)[ -](teens|twenties|thirties|forties|fifties|sixties|seventies|eighties|\d{2}s)\b/
  );
  if (decadeNum) return decadeNum[0];
  const decadeWord = s.match(
    /\b(teens|twenties|thirties|forties|fifties|sixties|seventies|eighties)\b/
  );
  if (decadeWord) return decadeWord[0];
  const decadeShort = s.match(/\b\d{2}s\b/);
  if (decadeShort) return decadeShort[0];
  const numMatch = s.match(/\b(\d{2})[ -]?(?:year|yr)s?[ -]?old\b/);
  if (numMatch) return `${numMatch[1]} years old`;
  return null;
}

export function extractIdentityPhrase(promptDesc: string): string {
  let s = promptDesc.replace(/^\s*(this|that|these|those|a|an|the)\s+/i, '').trim();
  const sentenceEnd = s.search(/[.!?]/);
  if (sentenceEnd > 0) s = s.slice(0, sentenceEnd);
  const words = s.split(/\s+/);
  if (words.length > 18) {
    s = words.slice(0, 18).join(' ');
    const lastComma = s.lastIndexOf(',');
    if (lastComma > s.length - 40) s = s.slice(0, lastComma);
  }
  s = s.replace(/[,;:]?\s*(and|with|in|wearing|featuring|having)\s*$/i, '');
  return s.trim();
}

// ── Wardrobe-mood randomizer ────────────────────────────────────────────

const WARDROBE_MOODS = [
  'casual everyday outfits',
  'active outdoor / sporty clothing',
  'polished resort wear',
  'breezy boho artsy style',
  'vintage retro inspired',
  'simple monochrome neutrals',
  'colorful playful patterns',
  'modern minimalist',
  'utilitarian outdoor gear',
  'soft pastel palette',
  'rich saturated jewel tones',
  'classic timeless pieces',
];

// ── Resolved cast identity (computed once per render) ───────────────────

type ResolvedIdentity = {
  gender: 'man' | 'woman' | 'person';
  /** Resolved binary gender (explicit field > prose), or null if truly unknown.
   * Drives the shouted gender lock. */
  castGender: CastGender | null;
  age: string | null; // "38 years old" or "mid-30s"
  build: string | null;
  skin: string | null; // skin-tone / complexion clause — race-critical, always kept
  ethnicity: string | null; // broad race bucket (strongest race anchor) or null
  identity: string; // hair / facial-hair string
};

// Map a race bucket to its prompt adjective (Hispanic/Latino → "Hispanic" to
// avoid the slash + gendered Latino/Latina). null for unknown → no anchor.
function ethnicityAdjective(e: string | null): string | null {
  switch (e) {
    case 'White':
    case 'Black':
    case 'East Asian':
    case 'South Asian':
    case 'Middle Eastern':
      return e;
    case 'Hispanic/Latino':
      return 'Hispanic';
    default:
      return null;
  }
}

export function resolveIdentity(member: CastSlotMember): ResolvedIdentity {
  // Explicit gender (from describe-photo) is authoritative; fall back to prose.
  const castGender = resolveCastGender(member);
  const gender: 'man' | 'woman' | 'person' = castGender
    ? genderNoun(castGender)
    : extractGender(member.promptDesc);
  const age =
    typeof member.age === 'number' ? `${member.age} years old` : extractAge(member.promptDesc);
  const build = extractBuild(member.physicalSummary);
  const skin = extractSkin(member.physicalSummary);
  const ethnicity = member.ethnicity ?? null;
  const identity = extractHair(member.physicalSummary) || extractIdentityPhrase(member.promptDesc);
  return { gender, castGender, age, build, skin, ethnicity, identity };
}

function stripIdentity(s: string): string {
  const stripAgeRe =
    /\b(in\s+(?:his|her|their)\s+)?(early|mid|late)?[ -]?(teens|twenties|thirties|forties|fifties|sixties|seventies|eighties|\d{2}s)\b\s*,?\s*/i;
  const stripLeadingGenderRe = /^(man|woman|guy|gentleman|lady|girl|boy|male|female)\b\s*,?\s*/i;
  return s
    .replace(stripAgeRe, '')
    .replace(stripLeadingGenderRe, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Map the extracted skin clause to a strong tone adjective that gets attached to
// the SUBJECT NOUN ("a fair-skinned man"). A trailing descriptor alone (", light
// peachy skin tone") is regularly steamrolled by a heavy stylistic prior — the
// face-swap medium overrides (jewel-tone ornate illustration, painted concept
// art; faceSwapModelOverrides.ts) carry a strong race prior, and it rendered a
// white cast member with dark skin (Kevin, michele's nightly 2026-08-31: partner
// race-swapped despite ", light peachy skin tone" in the prompt). Attaching the
// tone to the subject noun early is the proven counter (feedback_ethnicity_noun_
// beats_visual_descriptors): a noun-adjacent skin token beats a late descriptor
// when a stylistic medium fights it. The never-swapped body skin (neck/arms/
// hands) must be locked here — the swap only refines the face.
export function skinToneAdjective(skin: string | null | undefined): string | null {
  if (!skin) return null;
  const s = skin.toLowerCase();
  if (/\b(ebony|espresso|mahogany|umber|very dark|deepest)\b/.test(s)) return 'dark-skinned';
  if (/\bdark\b/.test(s)) return 'dark-skinned';
  if (/\bdeep\b/.test(s) && /\b(brown|skin|tone|complexion)\b/.test(s) && !/\bolive\b/.test(s))
    return 'dark-skinned';
  if (/\b(light[ -]brown|caramel|tawny|bronze)\b/.test(s)) return 'tan-skinned';
  if (/\bolive\b/.test(s)) return 'olive-skinned';
  if (/\b(brown|chestnut|cocoa|mocha|copper)\b/.test(s)) return 'brown-skinned';
  if (/\b(tan|golden|sun[ -]?kissed|medium)\b/.test(s)) return 'tan-skinned';
  if (
    /\b(fair|light|pale|porcelain|ivory|peach|peachy|rosy|cream|creamy|alabaster|milky|freckl)\b/.test(
      s
    )
  )
    return 'fair-skinned';
  return null;
}

// Pull the primary HAIR COLOR out of the hair clause so it can be anchored EARLY
// on the subject ("a White man with chestnut-brown hair, ..."). Hair color, like
// race, drifts to a dark default under a scene/medium prior when it's only a
// buried mid-clause token (Kevin: sunnysteph's chestnut-haired +1 rendered black
// in a China dual). An early positive restatement holds it (verified). Positive
// only — never a negation ("not black" leaks into Flux). Returns null when no
// color word (bald / color-less clause) → no anchor.
function extractHairColor(hairStr: string | null): string | null {
  if (!hairStr) return null;
  const m = hairStr.match(
    /\b(jet[- ]?black|salt[- ]and[- ]pepper|dark brown|light brown|dirty blonde|dirty blond|strawberry blonde|ash blonde|platinum blonde|chestnut(?:[- ]brown)?|auburn|mahogany|copper|ginger|brunette|blonde|blond|brown|red|black|grey|gray|silver|white|sandy|honey|caramel|raven|golden)\b/i
  );
  return m ? m[1].toLowerCase() : null;
}

type HairVariationOpts = { pct: number; register: HairSceneRegister | null };

function buildIdentityBlock(
  prefix: string,
  resolved: ResolvedIdentity,
  wardrobe: string,
  hairOpts?: HairVariationOpts
): string {
  const ageAxis = resolved.age ? `, ${resolved.age}` : '';
  const buildAxis = resolved.build ? `, ${resolved.build} build` : '';
  // Skin tone sits right in the identity block so it anchors the (never-swapped)
  // body skin to the cast member's actual complexion and overrides any location
  // ethnicity prior. Race must never be inferred from the setting.
  const skinAxis = resolved.skin ? `, ${resolved.skin}` : '';
  // RACE ANCHOR on the subject noun. A broad ETHNICITY bucket ("a White man",
  // "an East Asian woman") is the STRONGEST counter to a location ethnicity prior
  // ("set in china" → local) — it beats a skin-tone descriptor (RACE_FIDELITY_PLAN.md
  // + feedback_ethnicity_noun_beats_visual_descriptors). Prefer it when present;
  // otherwise fall back to the skin-tone adjective ("fair-skinned"). Ethnicity WINS
  // over tone: a mis-captured "warm medium" skin read must not fight a "White" anchor.
  const ethnicityAdj = ethnicityAdjective(resolved.ethnicity);
  const raceAnchor = ethnicityAdj ?? skinToneAdjective(resolved.skin);
  const subject = raceAnchor ? `${raceAnchor} ${resolved.gender}` : resolved.gender;
  // NIGHTLY female-hair variation: re-style a FEMALE's hair (color/length/bangs
  // preserved) so she isn't pigeonholed to one static hairdo every night. Gated
  // to female + a caller-supplied pct (nightly only). Male hair is untouched.
  let identitySource = resolved.identity;
  if (hairOpts && resolved.castGender === 'female') {
    identitySource =
      varyFemaleHair(resolved.identity, { pct: hairOpts.pct, register: hairOpts.register }) ??
      resolved.identity;
  }
  const cleanIdentity = stripIdentity(identitySource);
  // HAIR-COLOR anchor: restate the color EARLY on the subject so it survives the
  // scene/medium prior (full character preservation — the person, in the scene).
  // The full hair clause still follows for cut/style; the early color is the lever.
  // BALD-GUARD (Kevin, 2026-09-01): NEVER render someone bald when their cast photo
  // has hair — short/greying/faded cuts drift to bald under a stylized render (his
  // +1 came out bald). If they have a hair color (i.e. they have hair) and aren't
  // described bald, force "a full head of ... hair". Positive only.
  const hairColor = extractHairColor(identitySource);
  const isBald = /\b(bald|balding|shaved head|hairless|receding)\b/i.test(identitySource);
  const colorAnchor = hairColor && !isBald ? ` with a full head of ${hairColor} hair` : '';
  // SENIOR ANCHOR (2026-09-02, the Michele bug): a 74yo white-haired +1 rendered
  // as a ~40yo with a thick brown quiff — the prompt was CORRECT ("full head of
  // white hair, 74 years old") but age/hair arrived as TRAILING modifiers, and
  // stylized mediums' young-attractive-couple prior steamrolled them (identity
  // sank to 0.327). Same physics as the race fix: NOUN-form beats descriptors.
  // For 55+ cast the age + hair colour move INTO the subject noun ("an older
  // white-haired White man") and the age axis gains positive emphasis. Applies
  // to every consumer (nightly, create, first-dream) — a young render of an
  // older user is an identity failure, not a flattering choice.
  const ageNum = (() => {
    const m = (resolved.age || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  })();
  const isSenior = ageNum !== null && ageNum >= 55;
  // FLATTERING-ALWAYS (Kevin): the anchor must carry IDENTITY (their real age
  // and hair, recognizably them) while staying aspirational — "distinguished
  // silver-haired gentleman", never "old". No wrinkle/age-line language.
  const grace = resolved.castGender === 'female' ? 'elegant' : 'distinguished';
  const seniorSubject =
    isSenior && hairColor && !isBald
      ? `${grace} older ${hairColor}-haired ${subject}`
      : isSenior
        ? `${grace} older ${subject}`
        : subject;
  // Clean-shaven guard for senior males: the "older white-haired" prior gifts a
  // sage/Santa beard; "clean-shaven" alone is negation-shaped and loses. State
  // it positively when the description says clean-shaven (3/3 repro renders
  // grew a white beard without this).
  const cleanShaven =
    resolved.castGender === 'male' && /clean[- ]shaven/i.test(identitySource)
      ? ', freshly shaven with a smooth bare face'
      : '';
  const ageEmphasis =
    (isSenior && resolved.age
      ? `, truly ${resolved.age} and aging ${resolved.castGender === 'female' ? 'gracefully' : 'handsomely'}`
      : ageAxis) + cleanShaven;
  return `${prefix}: ${/^[aeiou]/i.test(seniorSubject) ? 'an' : 'a'} ${seniorSubject}${colorAnchor}${ageEmphasis}${buildAxis}${skinAxis}, ${cleanIdentity}, wearing ${wardrobe}`;
}

// ── Slot brief construction ─────────────────────────────────────────────

/**
 * Scene-first action field (SCENE_FIRST_ACTION_PLAN.md §2). Returned EMPTY when the caller did
 * not ask for an authored action, so the brief is byte-identical to the pre-feature text.
 * The envelope is Option B's (locationActionBeat.ts) — the only authored-action rules that have
 * shipped swap-safely in production; the validator (actionSafety.ts) enforces them after.
 */
function buildActionFieldSpec(input: CharacterSlotPipelineInput): string {
  const spec = input.authorAction;
  if (!spec) return '';
  const dual = input.cast.length === 2;
  const exemplars = spec.exemplars
    .slice(0, 3)
    .map((e) => `"${e.replace(/"/g, '')}"`)
    .join(' · ');
  return `action (${dual ? '20-40 words, HARD LIMIT 48' : '8-20 words, HARD LIMIT 22'} — present-tense like a photo caption; YOU write it, it is not locked. REQUIRED: never omit this field)
  ONE concrete, LIVELY moment that fits THIS EXACT scene and its named objects, in the
  "${spec.register}" register.${
    spec.stance
      ? `
  STANCE for this render — build the moment around it if the scene allows, otherwise the closest
  that fits: ${spec.stance}`
      : ''
  }
${
  spec.registerActions && spec.registerActions.length > 0
    ? `
  Things people do HERE — pick ONE or adapt it to this exact scene, or take a composed still:
  ${spec.registerActions.map((a) => `"${a.replace(/"/g, '')}"`).join(' · ')}`
    : ''
}
  Hands may be busy with a scene object (lifting, stirring, carving, pouring, strumming, toasting…) OR
  simply natural (pockets, folded arms, hands on hips, resting on something). A well-composed still pose
  is welcome — weight on one hip, hands in pockets, leaning on something, arms folded. The goal is VARIETY
  across renders, not constant action. Never merely waiting or contemplating. Hands, props and gestures stay at
  CHEST LEVEL OR LOWER (no running, jumping, climbing). A held prop ONLY if it obviously belongs here.
  NEVER mention the head, chin, face, or where anyone looks, and no reading / studying / examining /
  consulting (that turns the face down) — faces stay toward the camera by code.
  Refer to people by role, never by pronoun.${
    dual
      ? `
  Give EACH person their own small beat ("one …, the other …") with a clear gap between them —
  they do NOT touch, hug, kiss, lean together, or face each other.`
      : ''
  }${
    exemplars
      ? `
  Style examples for this register (invent your own, do NOT reuse): ${exemplars}`
      : ''
  }

`;
}

export function buildSlotBrief(input: CharacterSlotPipelineInput): string {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const wardrobeMood = WARDROBE_MOODS[Math.floor(Math.random() * WARDROBE_MOODS.length)];

  // When a location-specific wardrobe anchor is provided (rolled from
  // biome_config.WARDROBE), use it as style GUIDANCE — period/setting
  // inspiration for Sonnet to riff on, not a hard lock. Sonnet has
  // creative latitude to adapt for the character; the anchor just keeps
  // the wardrobe on-vibe for the location. When no anchor is provided,
  // fall back to the legacy climate-guess behavior.
  // TRAVELER wardrobe rule (2026-09-01, RACE_FIDELITY_PLAN.md): the cast are
  // VISITORS, not locals. Dressing them in the traditional/national/ethnic dress
  // of a real-world place (kimono in Japan, mandarin jacket in China, sari in
  // India) makes even a fair-skinned cast member READ as that ethnicity — it was
  // a major vector in the "white +1 looks Chinese" bug. Force contemporary travel
  // wear on real-world locations; themed FANTASY / imagined dream worlds keep
  // their in-world attire, so the rule is SUPPRESSED there (realWorldLocation ===
  // false). Undefined → treated as real-world (safe default; the rule only bans
  // real-culture dress anyway). The location wardrobe ANCHOR is ALSO suppressed
  // upstream on real-world locations (nightly-dreams) so it can't fight this rule.
  const isRealWorld = input.realWorldLocation !== false;
  const travelerRule = isRealWorld
    ? ' The cast are VISITORS/travelers here, NOT locals — dress them in flattering, stylish CONTEMPORARY clothes they would actually travel in, and NEVER in the traditional, national, or ethnic dress of a real-world culture (no kimono, hanfu, mandarin/Mao jacket, sari, kurta, dirndl, lederhosen, keffiyeh, cheongsam, qipao, etc.). A tourist visiting Japan wears their own clothes, not a kimono.'
    : '';
  const climateGuidance =
    (input.wardrobeAnchor
      ? `WARDROBE — you are the COSTUME DESIGNER dressing the hero and heroine of a film shot at "${location}". Dress EACH character to look striking and their absolute best: flattering, cool, and distinctive, in pieces true to the period / setting / cultural register of "${location}". One on-location inspiration to draw from: "${input.wardrobeAnchor}". Adapt it into something bold and attractive for each character — flattering silhouette, rich materials, standout details, styled hair — or invent something equally on-location and eye-catching. NEVER plain, dowdy, mundane, frumpy, drab, or merely "historically accurate" — this is a DREAM, so make the outfit sing while staying true to the setting. Avoid generic "linen shirt + chinos" defaults.`
      : `wardrobe MUST be flattering, stylish, contemporary clothing suited to ${location}'s climate and setting — distinctive, never dowdy or drab. A tropical beach, an alpine village, a desert ruin, a modern city, and an arctic glacier all call for different wardrobe. WARDROBE MOOD for this render: ${wardrobeMood}. Lean into this style while keeping it climate-appropriate and flattering. Bring distinctive pieces, colors, and silhouettes — avoid the same "linen shirt + chinos" default every render.`) +
    travelerRule;

  const forbiddenList = `━━━ FORBIDDEN IN ANY FIELD — your output will be rejected if you violate ━━━
- Camera / lens / framing: close-up, wide shot, medium shot, low angle, 85mm, depth of field, fisheye
- Face / facial words: face, eyes, smile, lips, expression, gaze, jaw, cheeks, eyebrows
- Eye direction / interaction: looking at, gazing, watching, facing each other, turned toward, eye contact
- Pronouns: he, she, him, her, his, hers (refer to people by role label, not pronouns)
- Face occlusion: helmet, mask, sunglasses, hood covering face, scarf over face
- Bad framing: from behind, back view, rear view, side profile`;

  const actionKey = input.authorAction ? ',\n  "action": "..."' : '';
  const actionSpec = buildActionFieldSpec(input);

  const sharedScene = `LOCATION (scene_description MUST depict this): ${location}

ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT contradict):
- TIME: ${input.timeAxis}
- WEATHER: ${input.weatherAxis}
- PHENOMENON: ${input.phenomenaAxis}

VIBE (use for the mood field): ${input.vibeDirective}${
    input.action && !input.authorAction
      ? `

ACTION CONTEXT (read-only — the pose itself is LOCKED by code, never describe it):
The person${input.cast.length === 2 ? 's' : ''} will be caught mid-action: "${input.action}".
Write scene_description as a place where this action makes sense. If the action implies
an object, prop, or creature, DECIDE what it concretely is AT THIS LOCATION and name it
in scene_description or props — never leave a noun like "giant"/"monster"/"someone"
ambiguous for the image model to guess at (an ambiguous "sleeping giant" at a zoo
renders as a literal colossal beast). ALWAYS choose a TASTEFUL, believable object that
truly belongs in this exact place and register — never a whimsical, novelty, oversized,
comic, or out-of-place oddity (never a giant mushroom, a random sculpture, an absurd
prop). If nothing tasteful fits, pick a plain natural feature of the place instead. Keep
it environment-only: no people, no pose.`
      : ''
  }`;

  // Cast-count-specific brief structure
  if (input.cast.length === 1) {
    const m = resolveIdentity(input.cast[0]);
    const buildHint = m.build ? `, ${m.build} build` : '';
    return `You are designing a one-person scene for AI image generation. You write ${input.authorAction ? 'FIVE' : 'FOUR'} fields. The framing, camera, faces, and character identity are LOCKED by code.

Output ONLY this JSON object, no markdown, no commentary:
{
  "scene_description": "...",
  "wardrobe": "...",
  "mood": "...",
  "props": "..."${actionKey}
}

${sharedScene}

FIELDS YOU OWN:

scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Keep it a BELIEVABLE, elegant, real version of the place — no whimsical, novelty,
  oversized, comic, or surreal invented oddities (no giant mushrooms, no absurd
  sculptures) unless the location itself is explicitly fantastical.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.

wardrobe (8-15 words)
  Clothing worn by the character — a ${m.gender}${buildHint} (${m.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

props (0-10 words — STRONGLY PREFER an empty string "")
  Usually leave EMPTY. Only if a prop genuinely elevates the shot, a single TASTEFUL,
  believable object that naturally belongs in this exact place and register (a champagne
  flute at a gala, a surfboard at a beach, a lantern in an alley). NEVER whimsical,
  novelty, oversized, comic, organic-oddity, or out-of-place objects (never a giant
  mushroom, an absurd sculpture, a random creature). When in doubt, empty string.

${actionSpec}${forbiddenList}

${input.avoidList}

Output ONLY the JSON object. Start with { and end with }. No commentary.`;
  }

  // Dual (cast.length === 2)
  const left = resolveIdentity(input.cast[0]);
  const right = resolveIdentity(input.cast[1]);
  const leftBuildHint = left.build ? `, ${left.build} build` : '';
  const rightBuildHint = right.build ? `, ${right.build} build` : '';
  return `You are designing a two-person scene for AI image generation. You write ${input.authorAction ? 'SIX' : 'FIVE'} fields. The framing, camera, faces, and character identities are LOCKED by code.

Output ONLY this JSON object, no markdown, no commentary:
{
  "scene_description": "...",
  "left_wardrobe": "...",
  "right_wardrobe": "...",
  "mood": "...",
  "props": "..."${actionKey}
}

${sharedScene}

FIELDS YOU OWN:

scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Keep it a BELIEVABLE, elegant, real version of the place — no whimsical, novelty,
  oversized, comic, or surreal invented oddities (no giant mushrooms, no absurd
  sculptures) unless the location itself is explicitly fantastical.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.

left_wardrobe (8-15 words)
  Clothing worn by the LEFT character — a ${left.gender}${leftBuildHint} (${left.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

right_wardrobe (8-15 words)
  Clothing worn by the RIGHT character — a ${right.gender}${rightBuildHint} (${right.identity}).
  Same climate rules and wardrobe mood as LEFT. Pick distinctive wardrobe in the chosen mood.
  Do NOT describe body, face, hair (locked). Do NOT describe pose.

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

props (0-10 words — STRONGLY PREFER an empty string "")
  Usually leave EMPTY. Only if a prop genuinely elevates the shot, a single TASTEFUL,
  believable object that naturally belongs in this exact place and register (a champagne
  flute at a gala, a surfboard at a beach). NEVER whimsical, novelty, oversized, comic,
  organic-oddity, or out-of-place objects (never a giant mushroom, an absurd sculpture,
  a random creature). When in doubt, empty string.

${actionSpec}${forbiddenList}

${input.avoidList}

Output ONLY the JSON object. Start with { and end with }. No commentary.`;
}

// ── JSON parsing ────────────────────────────────────────────────────────

function parseSlotsJson(text: string, castCount: 1 | 2): CharacterSlots {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('no JSON object in response');
  const parsed = JSON.parse(match[0]);
  const requiredCommon = ['scene_description', 'mood'];
  for (const k of requiredCommon) {
    if (typeof parsed[k] !== 'string' || parsed[k].length < 2) {
      throw new Error(`missing or invalid slot: ${k}`);
    }
  }
  const action =
    typeof parsed.action === 'string'
      ? depronounActionBeat(normalizeActionBeat(parsed.action))
      : null;
  if (castCount === 1) {
    if (typeof parsed.wardrobe !== 'string' || parsed.wardrobe.length < 2) {
      throw new Error('missing or invalid slot: wardrobe');
    }
    return {
      scene_description: String(parsed.scene_description),
      wardrobe: String(parsed.wardrobe),
      mood: String(parsed.mood),
      props: typeof parsed.props === 'string' ? parsed.props : '',
      ...(action ? { action } : {}),
    };
  }
  for (const k of ['left_wardrobe', 'right_wardrobe']) {
    if (typeof parsed[k] !== 'string' || parsed[k].length < 2) {
      throw new Error(`missing or invalid slot: ${k}`);
    }
  }
  return {
    scene_description: String(parsed.scene_description),
    left_wardrobe: String(parsed.left_wardrobe),
    right_wardrobe: String(parsed.right_wardrobe),
    mood: String(parsed.mood),
    props: typeof parsed.props === 'string' ? parsed.props : '',
    ...(action ? { action } : {}),
  };
}

// ── Validation: forbidden phrases ──────────────────────────────────────

const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'looking-direction', regex: /\blooking\s+(at|toward|into|across|up\s+at|out|over)\b/i },
  { name: 'gazing', regex: /\bgazing\b/i },
  { name: 'watching-staring', regex: /\b(watching|observing|staring|peering)\b/i },
  { name: 'facing-each-other', regex: /\bfacing\s+(each\s+other|one\s+another)\b/i },
  { name: 'face-to-face', regex: /\bface[-\s]to[-\s]face\b/i },
  { name: 'turned-toward', regex: /\bturned\s+(toward|to|away)\s+/i },
  { name: 'eye-contact', regex: /\beye\s+contact\b|\beyes?\s+(meet|locked|connect)\b/i },
  { name: 'close-up', regex: /\b(close[-\s]up|tight\s+shot|extreme\s+close)\b/i },
  { name: 'shot-words', regex: /\b(wide|establishing|medium|long|full)[-\s]shot\b/i },
  { name: 'angle-words', regex: /\b(low|high|dutch|extreme|aerial)\s+angle\b/i },
  { name: 'fisheye', regex: /\bfisheye\b/i },
  { name: 'lens-mm', regex: /\b\d{2,3}\s*mm\b/i },
  { name: 'depth-of-field', regex: /\bdepth\s+of\s+field\b/i },
  {
    name: 'face-words',
    regex: /\b(faces?|smiles?|grins?|expressions?|jaw(line|s)?|cheeks?|lips|eyebrows?|gaze)\b/i,
  },
  { name: 'eye-words', regex: /\beyes?\b/i },
  {
    name: 'from-behind',
    regex: /\b(from\s+behind|back\s+view|rear\s+view|back\s+of\s+(the|her|his|their)\s+head)\b/i,
  },
  { name: 'profile', regex: /\b(side\s+profile|profile\s+shot)\b/i },
  {
    name: 'occlusion',
    regex:
      /\b(masks?|helmets?|sunglasses|hoods?\s+covering|scarf\s+over\s+(her|his|the)?\s*face)\b/i,
  },
  { name: 'pronoun', regex: /\b(she|he|him|her|his|hers|she's|he's)\b/i },
];

function validateSlots(slots: CharacterSlots): string[] {
  const violations = new Set<string>();
  const fields: string[] = [slots.scene_description, slots.mood, slots.props ?? ''];
  if ('wardrobe' in slots) fields.push(slots.wardrobe);
  if ('left_wardrobe' in slots) fields.push(slots.left_wardrobe, slots.right_wardrobe);
  for (const field of fields) {
    if (!field) continue;
    for (const { name, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(field)) violations.add(name);
    }
  }
  return Array.from(violations);
}

// ── Fallback slots when Sonnet fails ───────────────────────────────────

function fallbackSlots(input: CharacterSlotPipelineInput): CharacterSlots {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const sceneFallback = `${location}, ${input.timeAxis.split(' — ')[0]}, ${input.weatherAxis.split(',')[0]}, atmospheric depth`;
  const moodFallback =
    input.vibeDirective.split('.')[0].slice(0, 80) || 'warm cinematic atmosphere';
  const wardrobeFallback = 'casual outdoor clothing in earthy tones';
  if (input.cast.length === 1) {
    return {
      scene_description: sceneFallback,
      wardrobe: wardrobeFallback,
      mood: moodFallback,
      props: '',
    };
  }
  return {
    scene_description: sceneFallback,
    left_wardrobe: wardrobeFallback,
    right_wardrobe: wardrobeFallback,
    mood: moodFallback,
    props: '',
  };
}

// ── Final prompt assembly (template-owned geometry) ────────────────────
//
// ████████████████████████████████████████████████████████████████████████
// HARD LESSON (2026-06-20) — DO NOT FRONT-LOAD / AMPLIFY THE SCENE HERE.
// ████████████████████████████████████████████████████████████████████████
// The face swap IS the product. The face-swap-dual service detects the two
// rendered faces, splits them at the gap, and pastes each cast member onto the
// matching face. It can ONLY do that if Flux renders the couple BIG with two
// large, clearly-separated, frontal faces. The ORDER of these `parts` is the
// lever that controls face size: identity/anchor/framing come FIRST so the
// couple dominates, and `slots.scene_description` comes LAST (after the framing
// block) so the environment fills in behind them WITHOUT shrinking them.
//
// On 2026-06-19 a change (commit 7a1092ff "front-load the scene", + its single
// twin 2c34da44) moved scene_description to the front AND added the cue
// "...fills the entire background with rich, layered environmental detail" to
// fix plain/studio backdrops. It worked for backdrops — but it made Flux render
// the SCENE dominant and the couple SMALL, so the detector could no longer find
// two clean faces: ai_generation_log filled with
//   no_dual_split(faces=2/0) -> rerender_for_dual -> dual_degrade_single
// and renders came back with BOTH cast faces merged onto one figure / a
// stranger's face. Dual face swaps had been 100% for days; this broke them
// "left and right" within minutes of the deploy. Reverted in d29c2ddb.
//
// RULE: never move scene_description earlier than the framing block, and never
// tell Flux the scene "fills the background" / is "rich/layered/dominant" on a
// face-swap prompt. If backdrops are too plain, fix it WITHOUT shrinking the
// faces (e.g. richer scene_description CONTENT, never a size/dominance cue), and
// re-verify the no_dual_split rate in ai_generation_log before shipping.
// ████████████████████████████████████████████████████████████████████████

export function assembleCharacterPrompt(
  slots: CharacterSlots,
  input: CharacterSlotPipelineInput
): string {
  const location = input.setAtOverride || input.iconicAnchor || input.userPlace || '';
  const mediumSignal = (input.mediumFluxFragment || '').trim();
  // Early scene hook — the scene's 1-2 most distinctive clauses ride the early
  // "set at" slot (see buildSceneHook). Same for single + dual.
  const sceneHook = buildSceneHook(slots.scene_description, location);
  const setAt = location
    ? `set at ${location}${sceneHook ? ` — ${sceneHook}` : ''}`
    : sceneHook
      ? `set in ${sceneHook}`
      : '';
  // Female-hair variation opts (nightly only — Create leaves the pct unset).
  const hairOpts: HairVariationOpts | undefined = input.femaleHairVariationPct
    ? { pct: input.femaleHairVariationPct, register: input.sceneRegister ?? null }
    : undefined;

  // Cast-count branches
  if (input.cast.length === 1) {
    const m = resolveIdentity(input.cast[0]);
    const wardrobe = (slots as SingleSlots).wardrobe;
    const identityBlock = buildIdentityBlock('CHARACTER', m, wardrobe, hairOpts);

    // Gender lock SHOUTED at position 1 — non-negotiable, mirrors the dual
    // path. This is what stops a male cast photo from rendering on a female
    // body (and vice-versa) on the single-cast nightly path.
    const genderLock = m.castGender ? genderLockShout(m.castGender) : '';

    // Single anchor — positive phrasing, no L/R. Relaxed 2026-08-24 (Kevin): the
    // old triple-hammered "frontal portrait, face to camera" was defensive
    // scaffolding from before the swap safety guards existed; it forced a stiff,
    // camera-locked "cardboard cutout" look. The swap only needs a face that is
    // clearly VISIBLE, LARGE and roughly toward camera — a natural three-quarter
    // angle satisfies that (proven by Kevin's hearted Create renders). So frame it
    // as a candid, cinematic subject instead of a posed ID-photo.
    const singleAnchor =
      'ONE person alone in the scene, the only person in the image, the clear subject of a candid cinematic photograph, face clearly visible and turned naturally toward the viewer at an easy three-quarter angle';

    // Framing — single doesn't need the L/R clear-gap line. Stage 5c presets
    // trade face size for composition freedom; the classic waist-up stays the
    // default. Face-priority language is load-bearing in both presets — the
    // swap needs a big readable frontal face (Hard Rule: never let the scene
    // shrink the subject).
    // Face-priority lines (visible / large / unobstructed) are KEPT — the swap
    // needs them (Hard Rule: never let the scene shrink the subject). Only the
    // rigid "frontal portrait, face to the camera" line is replaced with candid +
    // scene-integration + cinematic-lighting language so the person is genuinely
    // PRESENT in the world and lit BY it, not a stamped-on cutout (Kevin 2026-08-24).
    // NOT a "must look away / must be doing something" rule (Kevin 2026-08-24): the
    // subject looking toward the camera is good and desirable — his hearted refs do
    // exactly that. The fix is killing the STIFFNESS + integrating the LIGHTING, not
    // avoiding the lens. So: relaxed + scene-lit + photoreal, comfortable looking at
    // the camera OR gently off, never a stiff over-posed studio portrait.
    // 2026-09-02 background-drowning fix, round 2 (Kevin: do NOT homogenize
    // framing — 3/4 portraits are welcome; the ask is more background DETAIL at
    // whatever framing rolls). So the framing presets keep their original
    // variety, and the integration line gains a DETAIL-not-size cue: whatever
    // slice of setting is visible must be specific and crisp, never a blank
    // wall / empty sky (the hearted failure). Detail language is safe under the
    // 2026-06-19 hard rule — the footgun was SIZE/dominance cues ("fills the
    // background"), never detail. "gentle shallow depth of field" (a literal
    // background-blur instruction) stays deleted.
    // 2026-09-02 zoom-regression fix (Kevin, 20-night sim: "repeated zoomed-in
    // shots... we want the characters WITHIN the world — the closest should be
    // about a 3/4 body view with a lot of scene showing"). Root cause: the
    // integration line said "whatever SLICE of the setting is visible behind
    // them" — phrasing that LICENSES a sliver of background, which Flux
    // satisfies cheapest with a face-filling close-up plus one crisp sliver.
    // Replacement demands BREADTH positively (setting sweeping around them,
    // ground to sky). Still detail-not-dominance — the 2026-06-19 rule stands.
    // Framing floor rises with Kevin's explicit minimum: knees-up three-quarter
    // (was waist-up). A 3/4-length face is ~15-20% of frame height — squarely
    // inside the healthy swap band, and the giant-face guard floors the other
    // extreme.
    const integrationLine =
      'the subject naturally lit by the scene itself (soft rim light and ambient colour from the environment on them), a relaxed warm editorial photograph, comfortable and natural — looking toward the camera or gently off into the scene, at ease, photographic realism, filmic colour, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, the wall or sky behind the subject full of specific detail, any visible sky alive with colour, cloud form, or weather';
    const framingBlock = (
      input.soloComposition === 'enviro_wide'
        ? [
            'full figure visible, standing prominent in the foreground third of a sweeping environment',
            'the person is the unmistakable subject, face large enough to read clearly',
            integrationLine,
          ]
        : [
            'shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene',
            'face unobstructed and clearly visible to the viewer',
            integrationLine,
          ]
    ).join(', ');

    // 2026-09-02 background-drowning fix: on SINGLES the scene_description moves
    // ONE slot earlier — ahead of the framing block, still AFTER the identity
    // block (race/hair anchors keep their early position). The 2026-06-19
    // scene-position incident was DUAL-specific (no_dual_split when the couple
    // shrank); singles are backstopped by the identity gate + restore + post-swap
    // verify. Dual ordering is untouched. Verify identity_sim in
    // ai_generation_log when touching this.
    const parts = [
      genderLock,
      mediumSignal,
      setAt,
      singleAnchor,
      slots.action || input.action || '',
      identityBlock,
      slots.scene_description,
      framingBlock,
      slots.mood,
      slots.props,
      'foreground midground background stacked top to bottom, layered depth',
      'no text, no words, no letters, no watermarks, ultra detailed',
    ].filter((p) => p && p.trim().length > 0);

    return parts.join(', ');
  }

  // Dual (cast.length === 2)
  const left = resolveIdentity(input.cast[0]);
  const right = resolveIdentity(input.cast[1]);
  const dualSlots = slots as DualSlots;
  const leftBlock = buildIdentityBlock(
    'LEFT side of frame',
    left,
    dualSlots.left_wardrobe,
    hairOpts
  );
  const rightBlock = buildIdentityBlock(
    'RIGHT side of frame',
    right,
    dualSlots.right_wardrobe,
    hairOpts
  );

  // Gender lock SHOUTED at position 1. Non-negotiable for dual.
  // SENIOR ECHO in the position-1 lock (2026-09-02, Michele bug round 2): the
  // mid-prompt identity anchor alone moved a 74yo from rendering ~40 to ~50 —
  // not enough. Position-1 tokens are what Flux obeys most (first-noun law), so
  // a compact age/hair echo rides the lock itself for 55+ cast:
  // "SILVER-HAIRED OLDER MAN on the RIGHT". Flattering register, no age-line talk.
  const seniorEcho = (m: ResolvedIdentity): string => {
    const a = (m.age || '').match(/\d+/);
    if (!a || parseInt(a[0], 10) < 55) return '';
    const hc = extractHairColor(m.identity);
    return hc ? `${hc.toUpperCase()}-HAIRED OLDER ` : 'OLDER ';
  };
  const genderLock = `${seniorEcho(left)}${left.gender.toUpperCase()} on the LEFT, ${seniorEcho(right)}${right.gender.toUpperCase()} on the RIGHT`;

  // Dual anchor — positive phrasing. Head separation stated EARLY (this lands at
  // assembly position 4, ahead of the framing block) so it can counter the
  // pull-together tokens in the medium fragment + raw user prompt that sit at
  // positions 2-3 (glamour's "romantic soft-focus portrait", a user's "sexy
  // companion", etc.). The dual face-swap can only place both faces when the two
  // HEADS render clearly apart; heads-touching → the detector can't split them.
  // Softened 2026-08-24 (Kevin) — LIGHTLY. Dual is fragile: the detector must find
  // TWO faces to split them, so both faces MUST stay turned toward the camera
  // (a first over-relax turned them to profile → no_dual_split(faces=1) → dual
  // reject). So we keep "faces toward the camera" firm and only drop the stiff
  // "portrait" register. Head-gap / each-head-own-side KEPT verbatim (load-bearing).
  // Composition counter-pull (2026-08-25): the front-loaded genderLock face-realism
  // block ("realistic human face … true-to-life") can push Flux into an extreme
  // two-giant-heads close-up (foreheads cropped, scene lost — the hearted-failure),
  // especially on stylized mediums + ultra models. We pull the framing OUT with an
  // explicit ENVIRONMENTAL TWO-SHOT / not-a-close-up instruction placed early — while
  // KEEPING every bit of the load-bearing swap-safety verbatim (clear gap between
  // heads, each head on its own side, faces toward camera, three-quarter). This does
  // NOT touch aspect (stays 9:16 phone-portrait) or the gender-safe genderLock.
  // 2026-09-06 variance (Kevin): the couple template was one composition. Two conditional swaps,
  // both inert unless nightly passes the new inputs: a 'waist_up' closer two-shot (the crop that used
  // to appear at random on 1.1-pro) and, for seated / perched / crouched stances, "side by side"
  // instead of "stand side by side" so the anchor stops contradicting the beat.
  const closer = input.dualComposition === 'waist_up';
  const seatedStance = !!(input.dualStance && input.dualStance.seated);
  const dualAnchor = `an ENVIRONMENTAL TWO-SHOT of two people together, ${
    closer
      ? 'shown from the waist up in a closer two-shot with the setting clearly visible around and above them'
      : 'shown from at least mid-thigh in a three-quarter length composition with the setting sweeping clearly around and above them at a natural editorial distance'
  }, NOT a tight face close-up — their faces are a normal-sized part of the frame, never filling it; the two ${
    seatedStance ? '' : 'stand '
  }side by side with a clear gap between their two heads, both facing toward the camera in a natural, unforced three-quarter view, each face clearly visible and turned toward the viewer, each head on its own side of the frame`;

  // Framing — includes L/R head-gap + same-height constraints for crop pipeline.
  // The head-gap clause is the load-bearing dual-swap constraint (Kevin
  // 2026-07-24: a glamour/elf couple rendered cheek-to-cheek and the swap
  // crossed the faces). Phrased in the proven pool language ("clear gap between
  // their heads / not cheek to cheek / heads on separate sides"), not the old
  // weaker "clear gap between them". Same-height is KEPT (the crop pipeline needs
  // it) but the gap is now the dominant instruction, not "heads at the same level".
  // Face-priority + head-gap + same-height are KEPT verbatim (all load-bearing for
  // the dual crop/split). Only the rigid "frontal portrait composition" line is
  // swapped for the candid cinematic-integration line (2026-08-24).
  const framingBlock = [
    closer
      ? 'both shown from the waist up, faces large and clear, open space around them showing the scene'
      : 'both shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene',
    'both faces unobstructed, clearly visible and turned toward the camera, easy to read',
    // Detail-not-size background cue (2026-09-02): the visible setting must be
    // specific and recognizable, never a blank sky/wall. SIZE/dominance cues
    // remain forbidden (2026-06-19 hard rule) — this asks for DETAIL only.
    'naturally lit by the scene with soft rim light and ambient colour from the environment, an editorial cinematic photograph feel rather than a stiff studio couple portrait, filmic colour grade, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, never a blank wall or featureless sky behind the couple, any visible sky alive with colour, cloud form, or weather — never flat white',
    'a clear gap between their two heads, faces apart and not touching, each head on its own side of the frame, not cheek to cheek, heads not leaning together',
    // Omitted for a height-contrast stance (one seated, one standing) — dualStances.ts.
    ...(input.dualStance && input.dualStance.heightContrast
      ? []
      : ['both at the same vertical height, heads at the same level']),
  ].join(', ');

  // 2026-09-02 background-drowning fix: dual gets ONLY the early scene hook in
  // the set-at slot (L1). Part ordering + all framing language stay untouched —
  // the 2026-06-19 hard rule (scene stays behind the framing block on duals).
  const parts = [
    genderLock,
    mediumSignal,
    setAt,
    dualAnchor,
    slots.action || input.action || '',
    leftBlock,
    rightBlock,
    framingBlock,
    slots.scene_description,
    slots.mood,
    slots.props,
    'foreground midground background stacked top to bottom, layered depth',
    'no text, no words, no letters, no watermarks, ultra detailed',
  ].filter((p) => p && p.trim().length > 0);

  return parts.join(', ');
}

/**
 * Build a SOLO fallback prompt from a completed DUAL render, for when the dual
 * face-swap fails every retry and the couple can't be delivered.
 *
 * The bug this fixes: the old fallback re-rendered the COUPLE prompt (which says
 * "MAN on the LEFT, WOMAN on the RIGHT ...") with a "one person" phrase glued on
 * the front. A prefix can't override a prompt whose whole body describes two
 * people, so Flux kept rendering a couple → the solo-swap guard saw a
 * wrong-gender partner face and refused → the cast dream degraded to a FACELESS
 * pure-scene (root-caused 2026-08-27: 8 of 10 faceless nightlies died here).
 *
 * This instead re-assembles self's ALREADY-COMPUTED wardrobe + the shared
 * scene/mood/props as a genuine SINGLE-character prompt (self only, partner
 * dropped). Flux renders one clean person of self's gender, the guard passes, and
 * self always lands — a cast dream never degrades to a faceless scene. It reuses
 * the single-cast branch of assembleCharacterPrompt (self's shouted gender lock,
 * "ONE person alone in the scene", swap-safe face size), so it can never emit the
 * L/R couple framing. Deterministic — no Sonnet call; the dual build already
 * produced every field this needs.
 *
 * @param selfIndex which side of the dual is self: 0 = LEFT, 1 = RIGHT. Picks
 *   self's wardrobe and drops the partner entirely.
 */
/**
 * The input for a couple-degrade SOLO rebuild: the same slots/identity, but the medium's REAL face-swap
 * fragment instead of the flux-1.1-pro override that was chosen for the couple render. Pure; test-locked
 * (NIGHTLY_NO_PLAIN_RENDERS_PLAN.md F2 — the override + rebuild combination produced the true headshots).
 */
export function soloRebuildInput(
  input: CharacterSlotPipelineInput,
  realMediumFragment: string
): CharacterSlotPipelineInput {
  return { ...input, mediumFluxFragment: realMediumFragment || input.mediumFluxFragment };
}

export function assembleSoloFallbackFromDual(
  dualSlots: DualSlots,
  dualInput: CharacterSlotPipelineInput,
  selfIndex: 0 | 1
): string {
  const selfMember = dualInput.cast[selfIndex];
  if (!selfMember) {
    throw new Error(`assembleSoloFallbackFromDual: selfIndex ${selfIndex} out of range`);
  }
  const singleSlots: SingleSlots = {
    scene_description: dualSlots.scene_description,
    wardrobe: selfIndex === 0 ? dualSlots.left_wardrobe : dualSlots.right_wardrobe,
    mood: dualSlots.mood,
    props: dualSlots.props,
  };
  return assembleCharacterPrompt(singleSlots, {
    ...dualInput,
    cast: [selfMember],
    // The dual ACTION describes a COUPLE pose ("both ... a clear gap between
    // their heads") — meaningless and confusing for a solo render, so drop it;
    // the single anchor + framing block already position the lone subject.
    action: null,
    // three_quarter is the proven swap-safe solo preset (2026-08-24): it holds a
    // big-enough, readable face for the identity gate. Never enviro_wide here —
    // that shrinks the face below the swap floor (the very failure we're recovering
    // from).
    soloComposition: 'three_quarter',
  });
}

// ── Main pipeline entry point ──────────────────────────────────────────

export async function runCharacterSlotPipeline(
  input: CharacterSlotPipelineInput,
  anthropicKey: string
): Promise<CharacterSlotPipelineResult> {
  if (input.cast.length < 1 || input.cast.length > 2) {
    throw new Error(
      `character slot pipeline requires 1 or 2 cast members, got ${input.cast.length}`
    );
  }
  const castCount = input.cast.length as 1 | 2;
  const slotBrief = buildSlotBrief(input);
  const fallbackReasons: string[] = [];
  let slots: CharacterSlots | null = null;
  let rawResponse = '';
  let lastAttemptBrief = slotBrief;
  let retries = 0;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const sonnet = await callSonnet(lastAttemptBrief, anthropicKey, 500);
      rawResponse = sonnet.rawResponse;
      retries = attempt;
      const parsed = parseSlotsJson(sonnet.text, castCount);
      const violations = validateSlots(parsed);
      if (violations.length === 0) {
        slots = parsed;
        break;
      }
      fallbackReasons.push(`slot_violations_attempt_${attempt + 1}:${violations.join('|')}`);
      lastAttemptBrief = `${slotBrief}\n\n━━━ YOUR PREVIOUS OUTPUT WAS REJECTED ━━━\nForbidden content categories found in your fields: ${violations.join(', ')}\nRewrite the JSON without these. Keep the same fields; only the content changes.`;
    } catch (err) {
      fallbackReasons.push(`slot_parse_error_attempt_${attempt + 1}:${(err as Error).message}`);
      lastAttemptBrief = `${slotBrief}\n\n━━━ RETRY ━━━\nYour previous output was not parseable JSON. Output ONLY a single valid JSON object — no markdown fences, no commentary, no extra text. Start with { and end with }.`;
    }
  }

  if (!slots) {
    slots = fallbackSlots(input);
    fallbackReasons.push('character_slot_fallback_used');
  }

  // Scene-first action (SCENE_FIRST_ACTION_PLAN.md): the authored beat ships ONLY if it passes
  // the swap-safe envelope; otherwise it is dropped and assembly falls back to `input.action`
  // (today's pool pose). Never a retry — a bad beat must not cost a second Sonnet call.
  if (input.authorAction) {
    const beat = slots.action ?? null;
    if (!beat) {
      fallbackReasons.push('scene_action_fallback:missing');
    } else {
      const verdict = validateActionBeat(beat, castCount);
      if (verdict.ok) {
        fallbackReasons.push('scene_action');
      } else {
        fallbackReasons.push(`scene_action_fallback:${verdict.reason}`);
        slots = { ...slots, action: null };
      }
    }
  } else if (slots.action) {
    // Not asked for → never honored (a hallucinated `action` key must not change the
    // create / DLT prompt; assembly falls through to `input.action` exactly as before).
    slots = { ...slots, action: null };
  }

  const assembledPrompt = assembleCharacterPrompt(slots, input);

  return {
    briefUsed: slotBrief,
    rawResponse,
    slots,
    assembledPrompt,
    fallbackReasons,
    retries,
  };
}
