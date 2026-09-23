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
import {
  renderOutfitPlanLines,
  planHasUserGarment,
  missingUserOutfit,
  userOutfitPhrase,
  userOutfitAllowlist,
  allowedByUser,
  type OutfitPlan,
  type OutfitSide,
  type PersonOutfitPlan,
} from './outfitPlan.ts';

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
  /** CREATE-ONLY (2026-09-21). Anchor the wardrobe to what the cast is DOING rather
   *  than to a rolled aesthetic register.
   *
   *  Create never sets `sceneRegister`, so `wardrobeMoodFor` fell to the `casual`
   *  subset — retro resort glamour, vintage-cinema hats and gloves, mid-century silk
   *  scarves — and a snowboarding prompt came back in a velvet ski jacket with gold
   *  piping and an ivory cravat (Kevin: "the outfits we have on are ridiculous …
   *  half the time it's some fancy outfit, and not ski jacket/pants").
   *
   *  A pool per activity does not scale, because a user can prompt anything. It is
   *  also unnecessary: Sonnet already knows what people wear to snowboard, scuba dive
   *  or work a forge, and the no-plain-clothes rule is enforced INDEPENDENTLY by the
   *  PLAIN_CLOTHES validator. The register was overriding that knowledge, not adding
   *  to it. This swaps the aesthetic sentence for the activity, which Create already
   *  extracts via promptSceneSplit and passes as `action`.
   *
   *  Nightly and first-dream never set it, so with it unset every path here is
   *  byte-identical (the same contract `authorAction` documents in reverse). */
  activityWardrobe?: boolean;
  /** CREATE OUTFIT PLAN (CREATE_OUTFIT_PLAN.md, phase 3; outfitPlan.ts): who wears which colour, silhouette
   *  and pattern, plus anything the user asked each person to wear. It replaces the one shared palette + cut
   *  ("SPLIT it between them", which Sonnet mirrored in 62% of production couples) with one line per
   *  person, exempts the user's own words from PLAIN_CLOTHES, and checks Sonnet kept them: a miss is a named
   *  violation and a retry, and a second miss has code write the user's words in.
   *  Unset → every path here is byte-identical. A holiday costumeLock wins over it. */
  outfitPlan?: OutfitPlan | null;
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
  dualComposition?: 'three_quarter' | 'waist_up' | 'full_figure' | null;
  /** COUPLE stance flags (dualStances.ts): seated → the anchor stops saying "stand"; heightContrast →
   *  the "same vertical height" line is omitted (one seated, one standing). */
  dualStance?: { seated?: boolean; heightContrast?: boolean } | null;
  /** Couple prompt ORDER (2026-09-07 ablation, mig 470): 'legacy' = medium + scene first, the people ~300
   *  words in (flux-1.1-pro reads it as a landscape and renders the couple tiny / in profile / from behind:
   *  0/4 usable base renders); 'subject_first' = gender lock, MEDIUM, then the people + a compact framing
   *  line (place inline), identities, action, scene (4/4 usable on 1.1-pro; 38/40 first-try swaps in QA).
   *  Default legacy; QA flag force_prompt_style. */
  promptStyle?: 'legacy' | 'subject_first' | null;
  /** VIBE FRAGMENT (2026-09-11, NIGHTLY_VIBES_AUDIT.md §6): the vibe's verbatim ≤140-char light / palette /
   *  weather accent (dream_vibes.flux_fragment, mig 504), placed directly after scene_description in every
   *  composer so the accent no longer depends on Sonnet compressing a 700-char directive into three mood words
   *  at the tail of the prompt. When set, the Sonnet brief also says the vibe OWNS the light of
   *  scene_description. Null / undefined = the legacy route (mood field only). */
  vibeFragment?: string | null;
  /** Where the vibe fragment sits. 'after_scene' (default) = directly after scene_description; 'early' = right
   *  after the place line, BEFORE the people (round A of the vibe matrix showed Flux ignores a time-of-day change
   *  written late in the prompt: Sonnet wrote a full-moon night, Flux rendered daylight). A ≤140-char light
   *  clause early is not scene front-loading (no scene nouns, no dominance words; the 2026-06-19 rule stands). */
  vibeFragmentPosition?: 'early' | 'after_scene' | null;
  /** LOOK-NEUTRAL FRAMING (looks path): drops the solo integration line's photography prior ("a relaxed warm
   *  editorial photograph … photographic realism, filmic colour"), which pulled painted looks back toward a
   *  photo on every solo cast render. The look's own fragment owns the finish. Default false = legacy text. */
  lookNeutralFraming?: boolean;
  /** SET DRESSER + COSTUME DESIGNER brief (looks path, 2026-09-11): Sonnet writes a 55-85 word scene with at
   *  least six concrete named things layered foreground → background, an 18-28 word complete outfit chosen for
   *  the place, light and LOOK, and one tasteful prop. The legacy brief (25-40 / 8-15 / props empty) was tightened
   *  over months to kill specific bugs and together those rules made every natural nightly plain. Every safety
   *  rule stays (no oddities, no people/camera words, no ethnic dress on real places). Default false = legacy. */
  richBrief?: boolean;
  /** WIDE FRAMING (looks path, 2026-09-12): couples anchored knees-up with open space instead of "from mid-thigh up";
   *  set with soloComposition 'three_quarter' + dualComposition null by looksSlotInputFields. Default false = legacy. */
  wideFraming?: boolean;
  /** HOLIDAY COSTUME LOCK (2026-09-08, holidayCostumes.ts): one costume per cast member in `cast` order
   *  (index 0 = LEFT), rolled by nightly on a holiday's day-of. Sonnet is told the lock so the scene /
   *  mood / props play off it, and the wardrobe slot(s) are then OVERWRITTEN with the text verbatim — no
   *  paraphrase can dilute the costume. Ignored unless its length matches the cast. */
  costumeLock?: string[] | null;
  /** Stage 5c (2026-07-09): expanded SOLO composition preset. null/undefined =
   *  the classic waist-up frontal contract. Only meaningful for cast.length 1;
   *  gated upstream by engine_config.single_composition_expanded_pct. The
   *  Stage-8 identity gates (restore + post-swap verify) are what make the
   *  smaller-face presets safe to ship. */
  soloComposition?: 'three_quarter' | 'enviro_wide' | 'waist_up' | null;
  /** FRAME ROLL (looks path, 2026-09-12): 'close' frames (waist up) tell the SET DRESSER to put the interest
   *  within arm's reach so a closer frame is never a plain portrait; 'wide' = full or three-quarter. */
  frameInterest?: 'wide' | 'close' | null;
  /** SWAP GEOMETRY (looks path, 2026-09-12). 'strict' (default, byte-identical to before) = the couple stands
   *  side by side on one plane at one height with a clear gap between their heads, no contact, hands at chest
   *  level or lower — the language that guaranteed a swappable base before the engine had fault tolerance.
   *  'natural' = the couple may touch and move like a real couple (arm around, arms linked, leaning in, a dance
   *  hold, one seated one standing, walking) and hands may rise; the only physical rule left is that neither
   *  face is hidden or pressed to the other. The dual pipeline re-renders on a failed split with the STRICT
   *  geometry (nightlyLooksPath.ts strictRetryPrompt) before it ever degrades to a solo, so natural costs at
   *  most one retry. Solo renders: only the brief's hands / energy rule relaxes (the solo anchor was never stiff). */
  swapGeometry?: 'strict' | 'natural' | null;
  /** FRAMING AXIS (looks path, 2026-09-12, pools/nightly_framings.ts): one authored composition clause (distance +
   *  device + camera + placement) that REPLACES the fixed distance clause in the framing line. The face clauses
   *  stay code-owned. Null / undefined = the fixed clause (byte-identical). */
  framingClause?: string | null;
  /** Round 16 (looks path): the solo DISTANCE line (framingClause or the composition default) rides the anchor
   *  BEFORE the face-visibility clause instead of the late framing block — flux-1.1-pro only obeys it there. */
  framingInAnchor?: boolean;
  /** Flux couples on the looks path (2026-09-13, "the album skeleton"): the subject-first parts in the ORDER Kevin's
   *  1.2.0 album couples were rendered with — identities, then the pose, then the (short) scene, then the gap line —
   *  with no early vibe fragment. The looks-path v3 order (100-word scene in the look's voice before the identities)
   *  collapsed flux couples into head-and-shoulders two-shots (fixed-seed ablation, scratchpad frame-probe: only the
   *  short album skeleton opened the frame). Inert unless set; production prompts stay byte-identical. */
  coupleSceneAfterAction?: boolean;
  /** Flux parity arm H: a symmetric body stance (dualStances.ts DUAL_STANCES_FLUX_ANCHOR text) that replaces the
   *  "standing side by side from mid-thigh up" distance line INSIDE the couple anchor — the one slot flux obeys. */
  anchorStance?: string | null;
  /** Flux parity arm I: positive-only framing language on the legacy couple anchor + framing block — the negated
   *  "NOT a tight face close-up" / "rather than a stiff studio couple portrait" tokens leak (feedback_negative_prompt_leak)
   *  and are literally the words for a bust shot. Production stays byte-identical while unset. */
  positiveFraming?: boolean;
  /** Round 17 (looks path): every cast member's HAIR COLOUR echoes in the position-1 gender lock
   *  ("BROWN-HAIRED MAN on the LEFT", "a DARK BROWN-HAIRED FEMALE woman —"), the way the senior echo already does
   *  for 55+. Six fixed seeds on flux-1.1-pro: 2/6 salt-and-pepper men + 4/6 blonde wives without it, 0/6 with. */
  hairEcho?: boolean;
  /** false = no <COLOUR>-EYED token at position 1 (album-recipe probe, 2026-09-18). Default on. */
  eyeLock?: boolean;
  /** The framing recipe seats the couple / person — the couple anchor drops "standing". */
  framingSeated?: boolean;
  /** 1.2.0-parity (2026-09-12): the album's renders carried "a relaxed warm editorial photograph … filmic colour";
   *  look-neutral framing dropped it. This puts a photograph-free version back ("a relaxed warm editorial feel,
   *  filmic colour") in the integration lines. Only read under lookNeutralFraming. */
  photoPriors?: boolean;
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
// Day-of STYLING, not a haircut. The scanner used to be told to always report
// how the hair was worn and — absent bangs — to add a "positive hairline"
// phrase, so the 2026-09-01 fleet re-scan stamped 61% of men with the identical
// "swept back from the forehead" and pinned women into a "low bun" from one
// photo, in every render, forever. The prompt no longer asks for it, but 43
// cast members still carry it, so we strip it at prompt time too (no re-scan
// needed). Braids count as styling (Kevin, 2026-09-17); bangs do NOT — a fringe
// is a real cut and stays.
const HAIR_STYLE_TRIGGER =
  /\b(worn\s+in|styled\s+in|pulled\s+back|tied\s+back|swept\s+(back|up|upward)|slicked|gathered|tucked\s+behind|in\s+(a|an|two|twin)\b|ponytail|pigtails|top\s*knot|bun|chignon|updo|half[- ]up|braids?|plaits?|pin\s+curls?|center[- ]part(ed)?|side[- ]part(ed)?|middle[- ]part(ed)?|parted|hairline|fade|undercut|bowl\s+cut|comb[- ]?over|pompadour|quiff)\b/i;

// Left dangling once the styling phrase is cut off the end of a clause.
// NOTE: length words (short/medium/long/cropped) must NOT appear here — they are
// the detail we most want to keep ("cropped short with a fade" → "cropped short").
const TRAILING_FILLER =
  /[\s,]+(with|and|in|into|a|an|the|his|her|their|subtle|slight|soft|softly|neat|neatly|loose|loosely|classic|simple|front[- ]draped)\s*$/i;

/** Remove a trailing day-of styling phrase from ONE hair clause, then tidy the
 *  dangling connector it leaves behind ("brown hair with subtle" → "brown hair").
 *  Returns null when nothing describing hair survives. */
function stripHairStyling(clause: string): string | null {
  // Facial hair is never "styling" — pass beards/stubble through untouched.
  if (/\b(beard|mustache|moustache|stubble|sideburns|clean[- ]shaven)\b/i.test(clause))
    return clause;
  const m = clause.match(HAIR_STYLE_TRIGGER);
  let out = m && m.index !== undefined ? clause.slice(0, m.index) : clause;
  let prev: string;
  do {
    prev = out;
    out = out.trim().replace(TRAILING_FILLER, '');
  } while (out !== prev);
  out = out.trim().replace(/[\s,]+$/, '');
  // Must still describe hair; a clause that was ONLY styling/hairline is dropped.
  if (!/\b(hair|bangs|fringe|bald|balding)\b/i.test(out)) return null;
  return out || null;
}

export function extractHair(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const parts = physicalSummary.split(/[,;]/).map((p) => p.trim());
  const hairParts = parts.filter((p) =>
    /\b(hair|beard|stubble|clean[- ]shaven|mustache|moustache|sideburns|bald|balding|hairline)\b/i.test(
      p
    )
  );
  if (hairParts.length === 0) return null;
  const cleaned = hairParts
    .map(stripHairStyling)
    .filter((p): p is string => !!p && p.trim().length > 0);
  // NEVER return null where we previously returned a clause: resolveIdentity
  // silently falls back to the free-prose description on null, which is exactly
  // the archetype-pulling text extractHair exists to avoid.
  if (cleaned.length === 0) return hairParts.join(', ');
  return cleaned.join(', ');
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

// Pull JUST the eye-colour word out of physical_summary. Eye colour was deliberately dropped from the prompt
// alongside face-shape ("those get face-swapped away anyway" — extractHair's note). Half of that is wrong: the swap
// refines the FACE but does NOT repaint the iris, so with nothing in the prompt Flux picks, and its default for a
// dark-haired woman is brown. Kevin's wife is hazel-green and rendered brown most nights (2026-09-14; 8 of 8 recent
// dual prompts carried no eye colour at all). This is the same shape as the skin-tone fix above — a trait the swap
// does not restore has to be stated — and it is used ONLY in the position-1 lock, never in the descriptive block,
// which is where the Disney-princess pull the original note worried about actually comes from.
// Returns null when the summary says nothing; the caller must never invent a colour.
export function extractEyeColor(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const part = physicalSummary
    .split(/[,;]/)
    .map((p) => p.trim())
    .find((p) => /\beyes?\b/i.test(p));
  if (!part) return null;
  const m = part.match(
    /\b(hazel[- ]?green|hazel[- ]?brown|blue[- ]?green|blue[- ]?gr[ae]y|green[- ]?gr[ae]y|steel[- ]?blue|ice[- ]?blue|dark brown|light brown|deep brown|hazel|amber|emerald|olive|green|blue|brown|gr[ae]y|black)\b/i
  );
  return m ? m[1].toLowerCase().replace(/\s+/g, '-') : null;
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

// WARDROBE REGISTER (Kevin 2026-09-18: "we shouldn't have any 'plain clothes' outfits, everyone should be
// tailored for locations and built to stand out and look good"). Every entry is a costume-designer brief; the
// old list carried five everyday moods (casual, sporty, minimalist, neutrals, utilitarian gear) and they were the
// merino-pullover-and-cargo-pants renders. Exported so a test can lock the register.
export const WARDROBE_MOODS = [
  'bold statement pieces in saturated colour, cut to flatter',
  'glamorous evening wear reimagined for this exact place',
  'adventure-hero costume: rich textures, layered accessories, a signature piece',
  'vintage-cinema wardrobe: hats, gloves, tailored silhouettes, polished shoes',
  'romantic flowing fabrics that catch the light and move with the scene',
  'sharp tailored outerwear with a dramatic silhouette and a strong collar',
  'jewel-toned couture with metallic details and structured shapes',
  'retro resort glamour: bold prints, wide brims, statement jewellery',
  'rugged expedition couture: waxed leather, brass buckles, embroidered layers',
  'fantasy-court garments true to the place: brocade, velvet, clasps, capes',
  'mid-century elegance: structured coats, silk scarves, gleaming accessories',
  'festival maximalism: layered prints, sequins, colour on colour',
];

// ── Wardrobe PALETTE randomizer (Create's activity path) ────────────────
//
// WHY A SECOND POOL (Kevin, 2026-09-21): "how are we going to keep AI from using the same outfits over
// and over, it tends to pigeon hole when left to it's own devices."
//
// He is right, and it is his own hard rule: never let the model invent the VARYING element — it
// pigeonholes and rhymes, so the varying element comes from an authored pool. WARDROBE_MOODS used to be
// that pool for Create. The problem was never that it existed, it was the AXIS it varied: garment GENRE
// ("retro resort glamour", "vintage-cinema wardrobe"), which fights the activity and is how a snowboarder
// ended up in a cravat.
//
// So Create keeps an authored pool and varies an ORTHOGONAL axis instead: colour, material and finish.
// Every entry below reads correctly on a snow shell, a wetsuit, chef's whites, riding kit or a ballgown,
// because none of them names a garment. The activity decides WHAT they wear; this decides how it looks,
// and it changes every render.
//
// HUE BALANCE IS THE WHOLE POINT, and it took two passes to get right.
//
// PASS 1 (Kevin: "a lot of orange/rust/browns … so once again, it's pigeon holing"): seven of
// fourteen entries were warm-earth — rust, ochre, oxblood, brass, tan, copper, burnt amber. The
// model was not pigeonholing; it was rotating faithfully through a pool that was half orange.
//
// PASS 2 (Kevin: "what about the outfit color repetitivness?"): measured across 22 renders, a
// NEUTRAL appeared in 19 of them. The family counts looked fine — the problem was the TEMPLATE.
// Twelve of sixteen entries paired a colour with a neutral or a metallic ("ice blue, bone white and
// brushed silver", "violet and pewter", "cobalt and ivory"), so grey was in almost every render no
// matter which entry was drawn. Capping the family did nothing because the neutrals were riding
// along inside the coloured entries.
//
// So entries are now COLOUR AGAINST COLOUR. Metallics and neutrals appear only in the three
// entries that are deliberately monochrome. An unbalanced pool is indistinguishable from no pool at
// all, and so is a pool where every entry quietly contains the same colour.
//
// Deliberately free of any PLAIN_CLOTHES word — a palette must never be the thing that trips the
// validator (also locked there).
//
// And free of any MATERIAL. The first cut carried "velvety, deep-pile textures" and "weathered
// leather", and the very first batch came back with a "velvet-finish snow jacket" — the same
// cravat-on-a-snowboarder failure in miniature, because a material is not activity-agnostic the way
// a colour is. Velvet belongs on a gown, leather on a jacket, neither on a technical shell. Palettes
// name COLOUR and FINISH QUALITY (matte, glossy, brushed, tarnished, polished) only; the garment and
// its fabric come from the activity.
export const WARDROBE_PALETTES = [
  // COLOUR AGAINST COLOUR — the two named hues are what each half of the couple leads with.
  'cobalt blue against warm terracotta',
  'deep teal with acid-yellow accents',
  'ice blue and soft coral',
  'navy and mustard',
  'forest green with burnt-orange accents',
  'sage and dusty rose',
  'acid lime cutting across deep olive',
  'deep plum and emerald',
  'violet with saffron accents',
  'lilac and moss green',
  'crimson and deep navy',
  'blush pink with sage',
  'coral and turquoise',
  'burnt orange and petrol blue',
  'ochre and plum',
  'rust with teal accents',
  'oxblood and brass',
  'magenta against deep pine',
  // TONAL — one hue, light to deep. Still colour, not grey.
  'tonal blues, pale through midnight',
  'tonal reds, rose through oxblood',
  // TRUE NEUTRAL — kept deliberately few; monochrome is a real look, not a default.
  'black on black with a glossy technical sheen',
  'porcelain white and jet in sharp geometric blocks',
  'storm grey broken by one high-voltage accent',
] as const;

// The SECOND axis, and the one that actually reads (Kevin, 2026-09-21: "two of them are the exact
// same ... this is what i warned about").
//
// Varying palette alone was not enough. Across the first batch the COLOUR rotated fine — cobalt,
// plum, ochre, ice blue — while the garment vocabulary never moved: "snow shell" 6 times,
// "insulated trousers/salopettes" 7 times, "roll-neck midlayer" 3 times. Two renders came back as
// the same puffer-and-snow-pants silhouette in different hues, which reads as the same dream.
//
// Colour is the weaker signal; SHAPE is what the eye compares. So a second orthogonal pool varies
// proportion and construction. Like the palettes these name no garment and no material — a cut
// reads correctly on a snow shell, a gown, chef's whites or riding kit, because it describes how a
// thing is cut rather than what it is. 14 palettes x 10 cuts = 140 combinations on a fixed prompt.
export const WARDROBE_CUTS = [
  'sleek and close-fitting, cut sharp to the body',
  'oversized and relaxed, with generous volume',
  'long-line on top over slim, tapered legs',
  'strongly structured shoulders and a defined waist',
  'layered, with a contrasting collar or hood framing the face',
  'retro 1970s proportions — wide, bold and a little exaggerated',
  'utility-cut, with visible hardware, straps and pockets',
  'cropped above the waist over a high-waisted lower half',
  'an asymmetric closure and one deliberately off-centre line',
  'softly draped and unstructured, moving with the body',
] as const;

/** One cut per render, paired with one palette. Pure + rng-injected so a test can pin it. */
export function wardrobeCutFor(rng: () => number = Math.random): string {
  return WARDROBE_CUTS[
    Math.min(WARDROBE_CUTS.length - 1, Math.floor(rng() * WARDROBE_CUTS.length))
  ];
}

/** One palette per render, SPLIT across the two characters.
 *
 *  The first cut said "both characters dressed for the same outing" and Sonnet did the obvious thing:
 *  painted both of them the same colour head to toe. The render came back with a couple in identical
 *  plum puffers and plum trousers, looking like a bought matching set (2026-09-21). A shared palette
 *  is meant to make them a PAIR, not a uniform — so the brief now hands each of them a different
 *  colour from the same range, which is what coordinated dressing actually looks like.
 *
 *  Pure + rng-injected so a test can pin it. */
export function wardrobePaletteFor(rng: () => number = Math.random): string {
  return WARDROBE_PALETTES[
    Math.min(WARDROBE_PALETTES.length - 1, Math.floor(rng() * WARDROBE_PALETTES.length))
  ];
}

/** SCENE-TYPE STEERING (Kevin 2026-09-18, item 2): the register the brief asks for follows the scene the night
 *  rolled — an elegant scene dresses for the gala, an active scenario dresses the adventurer, a plain place gets
 *  the statement / resort / cinema registers. Uniform within the subset; every subset is a slice of
 *  WARDROBE_MOODS, so the no-plain-clothes lock covers all of them. */
const WARDROBE_BY_REGISTER: Record<'elegant' | 'active' | 'casual', readonly string[]> = {
  elegant: [
    WARDROBE_MOODS[1],
    WARDROBE_MOODS[6],
    WARDROBE_MOODS[10],
    WARDROBE_MOODS[3],
    WARDROBE_MOODS[4],
  ],
  active: [
    WARDROBE_MOODS[2],
    WARDROBE_MOODS[8],
    WARDROBE_MOODS[9],
    WARDROBE_MOODS[5],
    WARDROBE_MOODS[11],
  ],
  casual: [
    WARDROBE_MOODS[0],
    WARDROBE_MOODS[7],
    WARDROBE_MOODS[5],
    WARDROBE_MOODS[3],
    WARDROBE_MOODS[4],
    WARDROBE_MOODS[10],
  ],
};
export function wardrobeMoodFor(
  register: 'elegant' | 'active' | 'casual' | null | undefined,
  rng: () => number = Math.random
): string {
  const pool = WARDROBE_BY_REGISTER[register ?? 'casual'] ?? WARDROBE_BY_REGISTER.casual;
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
}

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
  eyes: string | null; // eye colour — position-1 lock only; the swap does not repaint the iris
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
  const eyes = extractEyeColor(member.physicalSummary);
  return { gender, castGender, age, build, skin, ethnicity, identity, eyes };
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
  const natural = input.swapGeometry === 'natural';
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
${
  input.wideFraming
    ? `  Hands may be busy with a scene object (lifting, stirring, carving, pouring, strumming, toasting…) OR
  simply natural (resting on something, one hand on a rail, a hand at the hip). A well-composed FULL-FIGURE
  still is welcome and preferred: standing tall with weight on the back foot and one hand on a scene object
  at hip height, one boot up on a step or ledge, a shoulder against a post with ankles crossed, seated on
  steps or a low wall with feet on the ground, paused on the path with the whole figure showing from the
  knees down to the feet. Leave out folded arms and hands-in-pockets stances; they crop the frame to the
  torso. The goal is VARIETY across renders, not constant action.`
    : `  Hands may be busy with a scene object (lifting, stirring, carving, pouring, strumming, toasting…) OR
  simply natural (pockets, folded arms, hands on hips, resting on something). A well-composed still pose
  is welcome — weight on one hip, hands in pockets, leaning on something, arms folded. The goal is VARIETY
  across renders, not constant action.`
} Never merely waiting or contemplating.${
    natural
      ? ` Motion is welcome (walking, a dance step, a slow twirl,
  carrying something together, a toast) and hands may be up to shoulder height; keep it grounded — no jumping,
  no climbing, nothing raised above the head.`
      : ` Hands, props and gestures stay at
  CHEST LEVEL OR LOWER (no running, jumping, climbing).`
  } A held prop ONLY if it obviously belongs here.
  NEVER mention the head, chin, face, or where anyone looks, and no reading / studying / examining /
  consulting (that turns the face down) — faces stay toward the camera by code.
  Refer to people by role, never by pronoun.${
    dual
      ? natural
        ? `
  Give EACH person their own beat ("one …, the other …"). They may touch the way a real couple does — an arm
  around the shoulders, a hand on the back, arms linked, leaning in mid-laugh, a dance hold, seated shoulder to
  shoulder — never a kiss, never cheek to cheek, never one person hidden behind the other.`
        : `
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

/** Cast in slot order, labelled the way the brief names them (LEFT / RIGHT, or the one person). */
function outfitSidesFor(input: CharacterSlotPipelineInput): OutfitSide[] {
  const labels = input.cast.length === 2 ? ['LEFT', 'RIGHT'] : ['THE PERSON'];
  return input.cast.map((m, i) => ({
    role: m.role,
    label: labels[i],
    gender: resolveCastGender(m),
  }));
}

/** The plan is live only when there is no holiday costume lock (the lock decides the whole outfit). */
function activeOutfitPlan(input: CharacterSlotPipelineInput): OutfitPlan | null {
  const locked = !!input.costumeLock && input.costumeLock.length === input.cast.length;
  return !locked && input.outfitPlan ? input.outfitPlan : null;
}

/** WARDROBE section when an outfit plan is set (phase 3). The scene sets the garment TYPE and dress level for
 *  both people (Kevin: "two women in a formal scene and one gets a dress and the other a jacket, that's
 *  weird"); the plan varies colour, silhouette and pattern per person; the user's own words always win. */
function buildOutfitPlanGuidance(
  input: CharacterSlotPipelineInput,
  plan: OutfitPlan,
  location: string,
  travelerRule: string
): string {
  const dual = input.cast.length === 2;
  const dress = input.activityWardrobe
    ? `DRESS THEM FOR WHAT THEY ARE DOING${input.action ? `: "${input.action}"` : ''}. Name the real garment the activity demands, then make it beautiful: cut, materials, one signature detail. Reach for the elevated name, never the basic one (a brushed midlayer not a fleece, a quilted down gilet not a puffer vest, a cable-knit roll-neck not a sweater).`
    : 'Tailor it to this exact place, its climate and its register, and make it STAND OUT: a signature piece, named colours and materials.';
  const level = dual
    ? ' The scene sets ONE garment type and dress level for the pair, dressed per person (a gala: gowns for women, tuxedos for men; a beach: swimwear; the slopes: snow gear). Two women at a gala both wear gowns: never a gown next to a jumpsuit, a suit or a jacket unless the plan below asks for it. Vary colour, silhouette and pattern between them, never the garment type or the dress level.'
    : '';
  const userDressed = planHasUserGarment(plan);
  const basics = plan.people.some((p) => !p.garment)
    ? `\n${userDressed ? "For anyone the plan does not dress in the user's own words: " : ''}NEVER everyday basics: no hoodie, henley, t-shirt, fleece, cargo pants, joggers, sweatpants, puffer vest, generic sneakers, and never the words casual, comfortable, practical or everyday. This is a DREAM, the outfit is part of the story.`
    : '';
  const traveler = travelerRule
    ? `${travelerRule}${userDressed ? ' Clothing the user asked for in the plan always wins over this rule.' : ''}`
    : '';
  return `WARDROBE — you are the COSTUME DESIGNER dressing ${dual ? 'both people' : 'the person'} in a film shot at "${location}". ${dress}${level}
The plan for each person. Follow it exactly:
${renderOutfitPlanLines(plan, outfitSidesFor(input))}${basics}${traveler}`;
}

export function buildSlotBrief(input: CharacterSlotPipelineInput): string {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const wardrobeMood = wardrobeMoodFor(input.sceneRegister ?? null);
  // The authored varying element for Create's activity path — see WARDROBE_PALETTES.
  const wardrobePalette = wardrobePaletteFor();
  const wardrobeCut = wardrobeCutFor();

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
    ? ' The cast are VISITORS/travelers here, NOT locals — dress them as a costume designer would dress visiting film stars — striking, flattering, contemporary-or-timeless — and NEVER in the traditional, national, or ethnic dress of a real-world culture (no kimono, hanfu, mandarin/Mao jacket, sari, kurta, dirndl, lederhosen, keffiyeh, cheongsam, qipao, etc.). A tourist visiting Japan wears their own clothes, not a kimono.'
    : '';
  const costumeLock =
    input.costumeLock && input.costumeLock.length === input.cast.length ? input.costumeLock : null;
  const outfitPlan = activeOutfitPlan(input);
  const climateGuidance = outfitPlan
    ? buildOutfitPlanGuidance(input, outfitPlan, location, travelerRule)
    : costumeLock
      ? `WARDROBE — HOLIDAY COSTUME LOCK: this is a costume party and each character's costume is already DECIDED. ${
          costumeLock.length === 2
            ? `LEFT wears EXACTLY: "${costumeLock[0]}". RIGHT wears EXACTLY: "${costumeLock[1]}".`
            : `The character wears EXACTLY: "${costumeLock[0]}".`
        } The exact costume text is applied by code, so write the wardrobe field(s) as a SHORT reference only (3-6 words, e.g. "the vampire countess costume") and spend your words on the scene and the action. Let the scene, mood, props and action play off the costumes — the cape catching the lantern light, the hat brim in the fog. The costume is clothing, headwear and props only; the face stays fully clear by code.`
      : (input.wardrobeAnchor
          ? `WARDROBE — you are the COSTUME DESIGNER dressing the hero and heroine of a film shot at "${location}". Dress EACH character to look striking and their absolute best: flattering, cool, and distinctive, in pieces true to the period / setting / cultural register of "${location}". One on-location inspiration to draw from: "${input.wardrobeAnchor}". Adapt it into something bold and attractive for each character — flattering silhouette, rich materials, standout details, styled hair — or invent something equally on-location and eye-catching. NEVER plain, dowdy, mundane, frumpy, drab, or merely "historically accurate" — this is a DREAM, so make the outfit sing while staying true to the setting. Avoid generic "linen shirt + chinos" defaults.`
          : `WARDROBE — you are the COSTUME DESIGNER dressing the hero and heroine of a film shot at "${location}". Dress EACH character to look striking and their absolute best: tailored to this exact place, its climate and its register, and built to STAND OUT — a signature piece, a flattering silhouette, named colours and materials, styled hair. A tropical reef, an alpine village, a desert ruin, a modern city and an arctic glacier each call for a different costume. ${
              input.activityWardrobe
                ? // ACTIVITY-ANCHORED (Create). The sentence this replaces named an unrelated
                  // aesthetic ("retro resort glamour") and Sonnet dutifully merged it with the
                  // place, which is how a snowboarder ends up in a cravat. The activity is the
                  // honest anchor, and Create already has it from the prompt splitter.
                  //
                  // The second half is NOT decoration: PLAIN_CLOTHES hard-bans fleece, puffer
                  // vest, sweater, pullover, jeans, chinos and "practical" in a wardrobe field.
                  // Asking for functional dress without naming the designed synonyms sends
                  // Sonnet straight at those words, burns both retries and lands on the generic
                  // couture fallback — strictly worse than the bug. So the ban list stays
                  // untouched and the brief routes around it instead.
                  `DRESS THEM FOR WHAT THEY ARE DOING${input.action ? `: "${input.action}"` : ''}. Name the real garment the activity demands — a snow shell and insulated trousers, a wetsuit, riding boots, chef's whites, a ballgown — and THEN make it beautiful: cut, materials, one signature detail. Reach for the elevated name, never the basic one (a brushed midlayer not a fleece, a quilted down gilet not a puffer vest, a cable-knit roll-neck not a sweater). PALETTE for this render: ${wardrobePalette} — SPLIT it between them, each leading with a DIFFERENT colour from that range so they coordinate without matching. They are a couple on the same outing, not a matching set: never the same colour head to toe on both. CUT for this render: ${wardrobeCut} — vary the SHAPE, not just the colour, and pick a different GARMENT for each of them; most activities have several correct answers (in snow: a shell, a one-piece suit, bib-and-brace, a parka, an anorak, a gilet over a midlayer), so do not default to the most obvious one twice.`
                : `WARDROBE REGISTER for this render: ${wardrobeMood}.`
            } NEVER everyday basics: no hoodie, henley, t-shirt, fleece, cargo pants, joggers, sweatpants, puffer vest, generic sneakers, and never the words casual, comfortable, practical or everyday — this is a DREAM, the outfit is part of the story.`) +
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

${
  input.lookNeutralFraming
    ? `LOOK (the medium this scene will be rendered in): ${input.mediumFluxFragment}
Write scene_description, wardrobe and props as THIS medium would depict them — a print names printed textures and inks, a painting names brushwork and pigment, a comic names its line and color, a film still names its stock. Use no camera, lens, photo, photograph, snapshot, flash or editorial words unless the LOOK itself is photographic.

`
    : ''
}ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT contradict):
- TIME: ${input.timeAxis}
- WEATHER: ${input.weatherAxis}
- PHENOMENON: ${input.phenomenaAxis}

${
  input.vibeFragment
    ? `VIBE — the atmosphere of this dream. It OWNS the light, palette and weather of scene_description: write the place under THIS light (never generic daylight), and give the mood field 1-3 phrases from it: ${input.vibeDirective}`
    : `VIBE (use for the mood field): ${input.vibeDirective}`
}${
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

${
  input.richBrief
    ? `scene_description (55-85 words)
  You are the SET DRESSER. The environment ONLY, dressed like a location a production designer
  prepared for a shoot: name at least SIX concrete, specific things that belong to THIS exact
  place, layered foreground / midground / background — architecture, plants, furnishings,
  props, surface textures, and one or two light sources — with named materials and colors
  (brass, mosaic tile, wet basalt, silk banners, paper lanterns, condensation on glass).
  Concrete nouns; nothing generic ("lush foliage", "beautiful scenery"). Keep it a
  BELIEVABLE, elegant, real version of the place — no whimsical, novelty, oversized, comic,
  or surreal invented oddities unless the location itself is explicitly fantastical.${
    input.frameInterest === 'close'
      ? `
  THIS IS A CLOSER FRAME (waist up): the far scenery will be soft, so put the interest WITHIN
  ARM'S REACH — a dressed surface at hand (a table set, a counter, a rail with objects on it),
  a light source beside them, textures they could touch — and let the costume carry detail.`
      : ''
  }
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.`
    : `scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Keep it a BELIEVABLE, elegant, real version of the place — no whimsical, novelty,
  oversized, comic, or surreal invented oddities (no giant mushrooms, no absurd
  sculptures) unless the location itself is explicitly fantastical.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.`
}

${
  input.richBrief
    ? `wardrobe (18-28 words)
  You are the COSTUME DESIGNER for a ${m.gender}${buildHint} (${m.identity}): ONE complete,
  specific outfit a stylist would choose for this place, this light and this LOOK — garments,
  fabric, color, cut and one accessory (a silk scarf, a brass watch, a wide-brim hat).
  Elevated and photogenic, never plain travel clothes.
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.`
    : `wardrobe (8-15 words)
  Clothing worn by the character — a ${m.gender}${buildHint} (${m.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.`
}

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

${
  input.richBrief
    ? `props (6-15 words)
  ONE or TWO believable, NAMED objects that belong to this exact place, register and action and
  give the shot a story — the hero object in hand or within reach, and one more resting in the
  set (a champagne flute and a brass lantern on the ledge; a paper map and a leather satchel;
  a vintage camera on its strap and a ticket stub). Empty string only if nothing fits.
  NEVER whimsical, novelty, oversized, comic, organic-oddity, or out-of-place objects.`
    : `props (0-10 words — STRONGLY PREFER an empty string "")
  Usually leave EMPTY. Only if a prop genuinely elevates the shot, a single TASTEFUL,
  believable object that naturally belongs in this exact place and register (a champagne
  flute at a gala, a surfboard at a beach, a lantern in an alley). NEVER whimsical,
  novelty, oversized, comic, organic-oddity, or out-of-place objects (never a giant
  mushroom, an absurd sculpture, a random creature). When in doubt, empty string.`
}

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

${
  input.richBrief
    ? `scene_description (55-85 words)
  You are the SET DRESSER. The environment ONLY, dressed like a location a production designer
  prepared for a shoot: name at least SIX concrete, specific things that belong to THIS exact
  place, layered foreground / midground / background — architecture, plants, furnishings,
  props, surface textures, and one or two light sources — with named materials and colors
  (brass, mosaic tile, wet basalt, silk banners, paper lanterns, condensation on glass).
  Concrete nouns; nothing generic ("lush foliage", "beautiful scenery"). Keep it a
  BELIEVABLE, elegant, real version of the place — no whimsical, novelty, oversized, comic,
  or surreal invented oddities unless the location itself is explicitly fantastical.${
    input.frameInterest === 'close'
      ? `
  THIS IS A CLOSER FRAME (waist up): the far scenery will be soft, so put the interest WITHIN
  ARM'S REACH — a dressed surface at hand (a table set, a counter, a rail with objects on it),
  a light source beside them, textures they could touch — and let the costume carry detail.`
      : ''
  }
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.`
    : `scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Keep it a BELIEVABLE, elegant, real version of the place — no whimsical, novelty,
  oversized, comic, or surreal invented oddities (no giant mushrooms, no absurd
  sculptures) unless the location itself is explicitly fantastical.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.`
}

${
  input.richBrief
    ? `left_wardrobe (18-28 words)
  You are the COSTUME DESIGNER for the LEFT character — a ${left.gender}${leftBuildHint} (${left.identity}):
  ONE complete, specific outfit a stylist would choose for this place, this light and this
  LOOK — garments, fabric, color, cut and one accessory. Elevated and photogenic, never plain
  travel clothes.
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

right_wardrobe (18-28 words)
  The RIGHT character — a ${right.gender}${rightBuildHint} (${right.identity}): the same standard,
  ${
    outfitPlan
      ? 'dressed by the RIGHT line of the wardrobe plan above.'
      : `a DIFFERENT complete outfit that pairs with LEFT's (they dressed for the same evening, not in
  the same clothes). Same climate rules.`
  } Do NOT describe body, face, hair (locked) or pose.`
    : `left_wardrobe (8-15 words)
  Clothing worn by the LEFT character — a ${left.gender}${leftBuildHint} (${left.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

right_wardrobe (8-15 words)
  Clothing worn by the RIGHT character — a ${right.gender}${rightBuildHint} (${right.identity}).
  ${
    outfitPlan
      ? 'Follow the RIGHT line of the wardrobe plan above.'
      : 'Same climate rules and wardrobe mood as LEFT. Pick distinctive wardrobe in the chosen mood.'
  }
  Do NOT describe body, face, hair (locked). Do NOT describe pose.`
}

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

${
  input.richBrief
    ? `props (3-12 words)
  ONE tasteful, believable prop that belongs to this exact place, register and action and
  gives the shot a story (a champagne flute at a gala, a brass lantern in an alley, a paper
  map on a harbor wall, a bouquet). Empty string only if nothing fits. NEVER whimsical,
  novelty, oversized, comic, organic-oddity, or out-of-place objects.`
    : `props (0-10 words — STRONGLY PREFER an empty string "")
  Usually leave EMPTY. Only if a prop genuinely elevates the shot, a single TASTEFUL,
  believable object that naturally belongs in this exact place and register (a champagne
  flute at a gala, a surfboard at a beach). NEVER whimsical, novelty, oversized, comic,
  organic-oddity, or out-of-place objects (never a giant mushroom, an absurd sculpture,
  a random creature). When in doubt, empty string.`
}

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
  // Activity NAMES ("whale watching", "bird-watching", "star gazing", "people watching") describe the outing, not
  // where the cast looks; the pose line keeps the faces to camera. Without the exemption a user's "whale watching"
  // failed both attempts and the scene was swapped for the generic fallback (3 of 3, 2026-09-23 outfit harness).
  // "watching the sunset", "gazing at the stars" still fail. Same list as actionSafety.ts DIRECTION_WORDS.
  {
    name: 'gazing',
    regex: /\b(?<!\b(?:whale|dolphin|bird|wildlife|people|storm|star)[-\s])gazing\b/i,
  },
  {
    name: 'watching-staring',
    regex:
      /\b(?<!\b(?:whale|dolphin|bird|wildlife|people|storm|star)[-\s])(watching|observing|staring|peering)\b/i,
  },
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

/** PLAIN CLOTHES (Kevin 2026-09-18): everyday basics in a WARDROBE field are a violation. The scene may
 *  mention a hood or a t-shirt on a passer-by; the cast may not wear one. */
export const PLAIN_CLOTHES =
  /\b(hoodies?|hooded sweatshirts?|henleys?|t-?shirts?|tees?|fleece|cargo (pants|shorts|trousers)|joggers|sweatpants|track ?pants|athleisure|puffer vests?|sweaters?|pullovers?|chinos|jeans|casual|comfortable|practical|everyday|basics?)\b/i;
function wardrobeFields(slots: CharacterSlots): string[] {
  const out: string[] = [];
  if ('wardrobe' in slots) out.push(slots.wardrobe);
  if ('left_wardrobe' in slots) out.push(slots.left_wardrobe, slots.right_wardrobe);
  return out.filter((f) => !!f);
}

/** Wardrobe field names — the keys of a per-field allowlist. */
export type WardrobeField = 'wardrobe' | 'left_wardrobe' | 'right_wardrobe';
/** Words the USER asked each person to wear (outfit plan): exempt from PLAIN_CLOTHES in that field, because
 *  "me and Steph in jeans and t-shirts" is a request to honor, not a lapse to fix. Absent = no exemptions. */
export type WardrobeAllow = Partial<Record<WardrobeField, string[]>>;

function wardrobeEntries(slots: CharacterSlots): [WardrobeField, string][] {
  const out: [WardrobeField, string][] = [];
  if ('wardrobe' in slots) out.push(['wardrobe', slots.wardrobe]);
  if ('left_wardrobe' in slots) {
    out.push(['left_wardrobe', slots.left_wardrobe], ['right_wardrobe', slots.right_wardrobe]);
  }
  return out.filter(([, t]) => !!t);
}

/** Plain-clothes words in a wardrobe field that the user did NOT ask for. */
function disallowedPlain(field: string, text: string, allow?: WardrobeAllow): string[] {
  const words = text.match(new RegExp(PLAIN_CLOTHES.source, 'gi')) ?? [];
  const mine = allow ? (allow[field as WardrobeField] ?? []) : [];
  return words.filter((w) => !mine.length || !allowedByUser(w, mine));
}

export function validateSlots(slots: CharacterSlots, allow?: WardrobeAllow): string[] {
  const violations = new Set<string>();
  const fields: string[] = [
    slots.scene_description,
    slots.mood,
    slots.props ?? '',
    ...wardrobeFields(slots),
  ];
  for (const field of fields) {
    if (!field) continue;
    for (const { name, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(field)) violations.add(name);
    }
  }
  const plain = new Set<string>();
  for (const [field, w] of wardrobeEntries(slots)) {
    for (const m of disallowedPlain(field, w, allow)) plain.add(m.toLowerCase());
  }
  if (plain.size > 0) violations.add(`plain_clothes(${Array.from(plain).join(', ')})`);
  return Array.from(violations);
}
/** The retry brief names the exact phrase that tripped each rule — "occlusion" alone sent Sonnet back with
 *  the same masks twice (nophoto20 #7, 2026-09-18). */
export function describeViolations(slots: CharacterSlots, allow?: WardrobeAllow): string {
  const named: Record<string, string> = {
    scene_description: slots.scene_description,
    mood: slots.mood,
    props: slots.props ?? '',
  };
  if ('wardrobe' in slots) named.wardrobe = slots.wardrobe;
  if ('left_wardrobe' in slots) {
    named.left_wardrobe = slots.left_wardrobe;
    named.right_wardrobe = slots.right_wardrobe;
  }
  const lines: string[] = [];
  for (const [field, text] of Object.entries(named)) {
    if (!text) continue;
    for (const { name, regex } of FORBIDDEN_PATTERNS) {
      const m = text.match(regex);
      if (m) lines.push(`- ${name}: "${m[0]}" in ${field}`);
    }
    if (/wardrobe/.test(field)) {
      const m = disallowedPlain(field, text, allow);
      if (m.length)
        lines.push(`- plain_clothes: "${m[0]}" in ${field} — dress them to stand out instead`);
    }
  }
  return lines.join('\n');
}
/** Keep every field that passes on its own; replace only the offending ones. A props line that mentions a
 *  mask must not cost the wardrobe Sonnet wrote (the snorkel couple shipped in a fleece and a hoodie). */
export function salvageSlots(
  parsed: CharacterSlots,
  fallback: CharacterSlots,
  allow?: WardrobeAllow
): { slots: CharacterSlots; replaced: string[] } {
  const replaced: string[] = [];
  const clean = (field: string, text: string, isWardrobe: boolean): string => {
    const bad =
      FORBIDDEN_PATTERNS.some(({ regex }) => regex.test(text)) ||
      (isWardrobe && disallowedPlain(field, text, allow).length > 0);
    if (!bad) return text;
    replaced.push(field);
    return (fallback as unknown as Record<string, string>)[field] ?? '';
  };
  const out = { ...parsed } as unknown as Record<string, string | null | undefined>;
  out.scene_description = clean('scene_description', parsed.scene_description, false);
  out.mood = clean('mood', parsed.mood, false);
  out.props = clean('props', parsed.props ?? '', false);
  if ('wardrobe' in parsed) out.wardrobe = clean('wardrobe', parsed.wardrobe, true);
  if ('left_wardrobe' in parsed) {
    out.left_wardrobe = clean('left_wardrobe', parsed.left_wardrobe, true);
    out.right_wardrobe = clean('right_wardrobe', parsed.right_wardrobe, true);
  }
  return { slots: out as unknown as CharacterSlots, replaced };
}

// ── Fallback slots when Sonnet fails ───────────────────────────────────

function fallbackSlots(input: CharacterSlotPipelineInput): CharacterSlots {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const sceneFallback = `${location}, ${input.timeAxis.split(' — ')[0]}, ${input.weatherAxis.split(',')[0]}, atmospheric depth`;
  const moodFallback =
    input.vibeDirective.split('.')[0].slice(0, 80) || 'warm cinematic atmosphere';
  const wardrobeFallback =
    'a striking tailored statement outfit chosen for this exact place, in rich colour and texture';
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

/** One wardrobe field's text, or null when the slots have no such field. */
function wardrobeOf(slots: CharacterSlots, field: WardrobeField): string | null {
  if (field === 'wardrobe') return 'wardrobe' in slots ? slots.wardrobe : null;
  if (!('left_wardrobe' in slots)) return null;
  return field === 'left_wardrobe' ? slots.left_wardrobe : slots.right_wardrobe;
}

/** Replace one wardrobe field. */
function withWardrobe(slots: CharacterSlots, field: WardrobeField, text: string): CharacterSlots {
  if ('left_wardrobe' in slots) {
    if (field === 'left_wardrobe') return { ...slots, left_wardrobe: text };
    if (field === 'right_wardrobe') return { ...slots, right_wardrobe: text };
    return slots;
  }
  return field === 'wardrobe' ? { ...slots, wardrobe: text } : slots;
}

/** Overwrite the wardrobe slot(s) with the locked costume text (cast order: LEFT, RIGHT). */
export function applyCostumeLock(slots: CharacterSlots, lock: readonly string[]): CharacterSlots {
  if ('left_wardrobe' in slots) {
    return { ...slots, left_wardrobe: lock[0], right_wardrobe: lock[1] ?? lock[0] };
  }
  return { ...slots, wardrobe: lock[0] };
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
  const vibeFrag = (input.vibeFragment || '').trim();
  const vibeEarly = vibeFrag && input.vibeFragmentPosition === 'early' ? vibeFrag : '';
  const vibeAfterScene = vibeFrag && input.vibeFragmentPosition !== 'early' ? vibeFrag : '';
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

  // HAIR ECHO (round 17, looks path): "<COLOUR>-HAIRED " for cast under 55 with a hair colour and hair (the senior
  // echo below carries the colour for 55+). Position-1 tokens are what flux-1.1-pro obeys most; the mid-prompt
  // "full head of brown hair" anchor alone still let the 43-with-a-beard prior grey him and a stylized prior blonde
  // her. Empty string when off — production prompts stay byte-identical.
  // EYE ECHO (2026-09-14). Position-1 only — the same slot the hair and senior echoes use, where flux-1.1-pro
  // actually obeys a token. Emitted ONLY when the cast description states a colour; never invented.
  // BOTH PEOPLE OR NEITHER on a couple: flux tends to apply one iris colour across the scene, so locking one side
  // and leaving the other free hands it a single cue to spread. Stating both gives each side its own target.
  const eyeEcho = (m: ResolvedIdentity): string => (m.eyes ? `${m.eyes.toUpperCase()}-EYED ` : '');

  const hairEcho = (m: ResolvedIdentity): string => {
    if (!input.hairEcho) return '';
    const a = (m.age || '').match(/\d+/);
    if (a && parseInt(a[0], 10) >= 55) return '';
    if (/\b(bald|balding|shaved head|hairless|receding)\b/i.test(m.identity)) return '';
    const hc = extractHairColor(m.identity);
    return hc ? `${hc.toUpperCase()}-HAIRED ` : '';
  };

  // Cast-count branches
  if (input.cast.length === 1) {
    const m = resolveIdentity(input.cast[0]);
    const wardrobe = (slots as SingleSlots).wardrobe;
    const identityBlock = buildIdentityBlock('CHARACTER', m, wardrobe, hairOpts);

    // Gender lock SHOUTED at position 1 — non-negotiable, mirrors the dual
    // path. This is what stops a male cast photo from rendering on a female
    // body (and vice-versa) on the single-cast nightly path.
    const soloEye = m.castGender && input.eyeLock !== false ? eyeEcho(m) : '';
    const soloEcho = m.castGender ? `${soloEye}${hairEcho(m)}` : '';
    const genderLock = m.castGender
      ? soloEcho
        ? genderLockShout(m.castGender).replace(
            /^a /,
            `${/^[aeiou]/i.test(soloEcho) ? 'an' : 'a'} ${soloEcho}`
          )
        : genderLockShout(m.castGender)
      : '';

    // Single anchor — positive phrasing, no L/R. Relaxed 2026-08-24 (Kevin): the
    // old triple-hammered "frontal portrait, face to camera" was defensive
    // scaffolding from before the swap safety guards existed; it forced a stiff,
    // camera-locked "cardboard cutout" look. The swap only needs a face that is
    // clearly VISIBLE, LARGE and roughly toward camera — a natural three-quarter
    // angle satisfies that (proven by Kevin's hearted Create renders). So frame it
    // as a candid, cinematic subject instead of a posed ID-photo.
    // Round 16 (looks path, 2026-09-13): the DISTANCE line (a rolled framing recipe or the composition's default)
    // rides the anchor, BEFORE the face-visibility clause. Direct fixed-seed probes of r13 #2 on flux-1.1-pro
    // (scratchpad solo-probe): the same clause after the identity block (word ~350), ahead of the scene, or even
    // right AFTER the face clause (word ~171) changed nothing — every seed stayed a waist-up portrait; placed
    // before the face clause (S6/S7) all three seeds opened to knees-up shots at the doorway / bar the recipe
    // named, hair colour intact. The face clause stays (swap safety); only its order vs the distance line moves.
    const distanceLine = input.framingInAnchor
      ? (input.framingClause ??
        (input.soloComposition === 'enviro_wide'
          ? 'full figure visible, standing prominent in the foreground third of a sweeping environment'
          : input.soloComposition === 'waist_up'
            ? "shown from the waist up, the dressed set within arm's reach beside and behind them"
            : 'shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene'))
      : null;
    const singleAnchor = input.lookNeutralFraming
      ? `ONE person alone in the scene, the only person in the image, the clear subject of the scene, ${
          distanceLine ? `${distanceLine}, ` : ''
        }face clearly visible and turned naturally toward the viewer at an easy three-quarter angle`
      : // The distance line rides here too (2026-09-17): with framingInAnchor set the tail block skips it, so a
        // caller without lookNeutralFraming (Create's rebuild twin) used to lose the clause from BOTH places.
        `ONE person alone in the scene, the only person in the image, the clear subject of a candid cinematic photograph, ${
          distanceLine ? `${distanceLine}, ` : ''
        }face clearly visible and turned naturally toward the viewer at an easy three-quarter angle`;

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
    const priorsLite = input.photoPriors ? 'a relaxed warm editorial feel, filmic colour, ' : '';
    const integrationLine = input.lookNeutralFraming
      ? `the subject naturally lit by the scene itself (soft rim light and ambient colour from the environment on them), ${priorsLite}rendered in the same medium and finish as the scene, comfortable and natural — looking toward the camera or gently off into the scene, at ease, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, the wall or sky behind the subject full of specific detail, any visible sky alive with colour, cloud form, or weather`
      : 'the subject naturally lit by the scene itself (soft rim light and ambient colour from the environment on them), a relaxed warm editorial photograph, comfortable and natural — looking toward the camera or gently off into the scene, at ease, photographic realism, filmic colour, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, the wall or sky behind the subject full of specific detail, any visible sky alive with colour, cloud form, or weather';
    const framingBlock = (
      input.soloComposition === 'enviro_wide'
        ? [
            // The distance line already rode the anchor when framingInAnchor is set (round 16).
            ...(distanceLine
              ? []
              : [
                  input.framingClause ??
                    'full figure visible, standing prominent in the foreground third of a sweeping environment',
                ]),
            'the person is the unmistakable subject, face large enough to read clearly',
            integrationLine,
          ]
        : input.soloComposition === 'waist_up'
          ? [
              ...(distanceLine
                ? []
                : [
                    input.framingClause ??
                      "shown from the waist up, the dressed set within arm's reach filling the frame beside and behind them, the costume detail and a prop at hand carrying the shot",
                  ]),
              'face unobstructed and clearly visible to the viewer',
              integrationLine,
            ]
          : [
              ...(distanceLine
                ? []
                : [
                    input.framingClause ??
                      'shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene',
                  ]),
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
      vibeEarly,
      singleAnchor,
      slots.action || input.action || '',
      identityBlock,
      slots.scene_description,
      vibeAfterScene,
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
  // Both-or-neither: a lone colour cue spreads across the couple, so only state eyes when BOTH sides have one.
  const bothEyes = input.eyeLock !== false && !!left.eyes && !!right.eyes;
  const leftEye = bothEyes ? eyeEcho(left) : '';
  const rightEye = bothEyes ? eyeEcho(right) : '';
  const genderLock = `${leftEye}${seniorEcho(left)}${hairEcho(left)}${left.gender.toUpperCase()} on the LEFT, ${rightEye}${seniorEcho(right)}${hairEcho(right)}${right.gender.toUpperCase()} on the RIGHT`;

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
  const seatedStance = !!(input.dualStance && input.dualStance.seated) || !!input.framingSeated;
  // Looks path round 15 (2026-09-13): a rolled framing recipe (pools/nightly_framings.ts) rides the anchor's
  // distance slot — production (no clause) stays byte-identical.
  const dualAnchor = `an ENVIRONMENTAL TWO-SHOT of two people together, ${
    input.framingClause
      ? input.framingClause
      : closer
        ? 'shown from the waist up in a closer two-shot with the setting clearly visible around and above them'
        : 'shown from at least mid-thigh in a three-quarter length composition with the setting sweeping clearly around and above them at a natural editorial distance'
  }, ${
    input.positiveFraming
      ? 'their faces a normal-sized part of the frame with the setting open around them'
      : 'NOT a tight face close-up — their faces are a normal-sized part of the frame, never filling it'
  }; the two ${
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
      : input.dualComposition === 'full_figure'
        ? // Looks path only (a full-figure framing recipe); production never sets full_figure here.
          'both shown in full figure from head to shoes, fully visible, generous open space around them showing the scene'
        : 'both shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene',
    'both faces unobstructed, clearly visible and turned toward the camera, easy to read',
    // Detail-not-size background cue (2026-09-02): the visible setting must be
    // specific and recognizable, never a blank sky/wall. SIZE/dominance cues
    // remain forbidden (2026-06-19 hard rule) — this asks for DETAIL only.
    input.lookNeutralFraming
      ? `naturally lit by the scene with soft rim light and ambient colour from the environment, a natural candid feel rather than a stiff studio couple portrait, ${input.photoPriors ? 'a relaxed warm editorial feel, filmic colour, ' : ''}rendered in the same medium and finish as the scene, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, never a blank wall or featureless sky behind the couple, any visible sky alive with colour, cloud form, or weather — never flat white`
      : input.positiveFraming
        ? 'naturally lit by the scene with soft rim light and ambient colour from the environment, an editorial cinematic photograph feel, relaxed and candid, filmic colour grade, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, a specific detailed wall or a colourful sky behind the couple, any visible sky alive with colour, cloud form, or weather'
        : 'naturally lit by the scene with soft rim light and ambient colour from the environment, an editorial cinematic photograph feel rather than a stiff studio couple portrait, filmic colour grade, the setting sweeping visibly around them from the ground at their feet to the sky above, every part of it rendered with crisp specific recognizable detail, never a blank wall or featureless sky behind the couple, any visible sky alive with colour, cloud form, or weather — never flat white',
    'a clear gap between their two heads, faces apart and not touching, each head on its own side of the frame, not cheek to cheek, heads not leaning together',
    // Omitted for a height-contrast stance (one seated, one standing) — dualStances.ts.
    ...(input.dualStance && input.dualStance.heightContrast
      ? []
      : ['both at the same vertical height, heads at the same level']),
  ].join(', ');

  // 2026-09-02 background-drowning fix: dual gets ONLY the early scene hook in
  // the set-at slot (L1). Part ordering + all framing language stay untouched —
  // the 2026-06-19 hard rule (scene stays behind the framing block on duals).
  // SUBJECT-FIRST couple order (2026-09-07 ablation): the two people and one compact framing line lead;
  // the scene and the medium follow. Keeps every load-bearing swap-safety clause (gender lock first,
  // clear gap between heads, each head on its own side, faces toward camera, same height) and the
  // identity blocks verbatim; drops the long environmental paragraph that flux-1.1-pro reads as
  // "landscape". Inert unless input.promptStyle === 'subject_first' (golden fixture locks legacy).
  if (input.promptStyle === 'subject_first') {
    // v2 (round 3): the MEDIUM stays at position 2 — with it last, 1.1-pro rendered every couple as a
    // catalog photograph (round 1: 10/10 swaps, 0/10 medium-faithful). The PLACE rides inside the people
    // sentence so the scene is never a separate leading clause the model can turn into a landscape.
    const place = location || '';
    const natural = input.swapGeometry === 'natural';
    // NATURAL geometry (2026-09-12): the stance may be walking, dancing or one seated one standing, so the anchor
    // says "together" instead of "standing side by side", and the tail keeps only the face-VISIBILITY clause
    // (large, toward the viewer) — the head-gap / own-side clauses that froze every couple into a two-shot go.
    const compactAnchor = input.anchorStance
      ? `two people${place ? ` at ${place}` : ''}, ${input.anchorStance}, ${
          input.lookNeutralFraming
            ? 'both facing the camera with clearly visible faces at a natural size, natural head-to-body proportions, a clear gap between their heads, each head on its own side of the frame'
            : 'both facing the camera with large clearly visible faces and a clear gap between their heads, each head on its own side of the frame'
        }`
      : `two people ${
          natural ? 'together' : `${seatedStance ? 'seated' : 'standing'} side by side`
        } ${
          input.framingClause
            ? input.framingClause
            : input.dualComposition === 'full_figure'
              ? 'with full figures visible from head to shoes, standing prominent in the foreground of the scene'
              : closer
                ? input.frameInterest === 'close'
                  ? "from the waist up, the dressed set within arm's reach beside and behind them and their costumes carrying the shot"
                  : 'from the waist up'
                : input.wideFraming || input.richBrief
                  ? 'from the knees up in a three-quarter length composition with generous open space around them showing the scene'
                  : 'from mid-thigh up'
        }${place ? ` at ${place}` : ''}, ${
          // Round 3 of the parity loop (2026-09-12): "LARGE clearly visible faces" read literally under illustration
          // looks with a knees-up frame — the model enlarged the HEADS to comply (bobblehead couples r1 #3, r2 #13).
          // The album's legacy anchor said "faces a normal-sized part of the frame". Looks path: natural size +
          // head-to-body proportions; legacy path keeps its text byte-for-byte.
          input.lookNeutralFraming
            ? natural
              ? 'both with clearly visible faces toward the viewer at a natural size, natural head-to-body proportions'
              : 'both facing the camera with clearly visible faces at a natural size, natural head-to-body proportions, a clear gap between their heads, each head on its own side of the frame'
            : natural
              ? 'both with large clearly visible faces toward the viewer'
              : 'both facing the camera with large clearly visible faces and a clear gap between their heads, each head on its own side of the frame'
        }`;
    const gapLine = natural
      ? 'both faces fully visible and unobstructed, neither face hidden behind or pressed against the other'
      : [
          'a clear gap between their two heads, faces apart and not touching, not cheek to cheek',
          ...(input.dualStance && input.dualStance.heightContrast
            ? []
            : ['both at the same vertical height']),
        ].join(', ');
    if (input.coupleSceneAfterAction) {
      return [
        genderLock,
        mediumSignal,
        compactAnchor,
        leftBlock,
        rightBlock,
        slots.action || input.action || '',
        slots.scene_description,
        vibeAfterScene,
        gapLine,
        slots.mood,
        slots.props,
        ...(input.lookNeutralFraming
          ? ['foreground midground background stacked top to bottom, layered depth']
          : []),
        'no text, no words, no letters, no watermarks, ultra detailed',
      ]
        .filter((p) => p && p.trim().length > 0)
        .join(', ');
    }
    return [
      genderLock,
      mediumSignal,
      compactAnchor,
      vibeEarly,
      // v3 (parity batch 1): the FULL scene sits right behind the people line, BEFORE the identity
      // blocks. With it after them (v2, word ~200 of ~280) 1.1-pro rendered a portrait on a blank
      // backdrop: paired blind judge scene 3.9 → 2.0, brief fidelity 3.5 → 1.7, legacy preferred 9/10.
      // The first clause is still the two people, so the landscape failure of legacy (scene FIRST) does
      // not return — the order is a slider between the two, and the people line must stay the lead.
      slots.scene_description,
      vibeAfterScene,
      leftBlock,
      rightBlock,
      slots.action || input.action || '',
      gapLine,
      slots.mood,
      slots.props,
      // 1.2.0-parity (2026-09-12): the album's couples (legacy order) all carried this depth cue; subject-first
      // never had it. Looks path only, so the production prompt stays byte-identical.
      ...(input.lookNeutralFraming
        ? ['foreground midground background stacked top to bottom, layered depth']
        : []),
      'no text, no words, no letters, no watermarks, ultra detailed',
    ]
      .filter((p) => p && p.trim().length > 0)
      .join(', ');
  }

  const parts = [
    genderLock,
    mediumSignal,
    setAt,
    vibeEarly,
    dualAnchor,
    slots.action || input.action || '',
    leftBlock,
    rightBlock,
    framingBlock,
    slots.scene_description,
    vibeAfterScene,
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
    // DISTANCE LINE IN THE ANCHOR (2026-09-17). three_quarter's "shown from the knees up" clause used to land
    // in the tail framing block, ~1,400 characters in, where flux-1.1-pro ignores it — every rebuilt single
    // shipped as a headshot (Kevin hearted three in a row: "another huge face from this batch, completely
    // boring, can't see any background"). The round-16 fixed-seed probe measured the same clause riding the
    // anchor BEFORE the face clause opening all three seeds to knees-up shots with the scene visible, identity
    // intact. The rebuild spreads the COUPLE's input, which never carries this flag, so it is set here
    // explicitly. Solo only by construction (cast is [selfMember]); couples keep their own anchor untouched.
    framingInAnchor: true,
  });
}

// ── Main pipeline entry point ──────────────────────────────────────────

export async function runCharacterSlotPipeline(
  input: CharacterSlotPipelineInput,
  anthropicKey: string,
  /** QA-only (nightly `force_dual_slots`, COUPLE_PROMPT_PARITY_PLAN.md §2): assemble from a
   *  caller-supplied slot set instead of calling Sonnet, so two prompt styles can be compared on
   *  IDENTICAL slots. Ignored unless it matches the cast count. */
  forcedSlots: CharacterSlots | null = null
): Promise<CharacterSlotPipelineResult> {
  if (input.cast.length < 1 || input.cast.length > 2) {
    throw new Error(
      `character slot pipeline requires 1 or 2 cast members, got ${input.cast.length}`
    );
  }
  const castCount = input.cast.length as 1 | 2;
  const slotBrief = buildSlotBrief(input);
  const fallbackReasons: string[] = [];

  // OUTFIT PLAN (phase 3). Everything below is inert without it: no allowlist, no lock checks, no stamps.
  const outfitPlan = activeOutfitPlan(input);
  const outfitSides = outfitPlan ? outfitSidesFor(input) : [];
  const fieldOf = (i: number): WardrobeField =>
    castCount === 1 ? 'wardrobe' : i === 0 ? 'left_wardrobe' : 'right_wardrobe';
  const personFor = (role: string): PersonOutfitPlan | null =>
    outfitPlan ? (outfitPlan.people.find((p) => p.role === role) ?? null) : null;
  const allow: WardrobeAllow | undefined = outfitPlan
    ? Object.fromEntries(
        outfitSides.map((side, i) => {
          const person = personFor(side.role);
          return [fieldOf(i), person ? userOutfitAllowlist(person) : []];
        })
      )
    : undefined;
  /** Sides whose wardrobe dropped what the user asked for. */
  const lockMisses = (parsed: CharacterSlots) =>
    outfitSides
      .map((side, i) => {
        const person = personFor(side.role);
        const field = fieldOf(i);
        const text = wardrobeOf(parsed, field);
        const missing = person && text !== null ? missingUserOutfit(text, person) : [];
        return { side: side.label, field, missing };
      })
      .filter((m) => m.missing.length > 0);
  const missedOnce = new Set<string>();
  let slots: CharacterSlots | null = null;
  let rawResponse = '';
  let lastAttemptBrief = slotBrief;
  let retries = 0;

  if (forcedSlots) {
    const forcedIsDual = 'left_wardrobe' in forcedSlots;
    if ((castCount === 2) === forcedIsDual) {
      slots = forcedSlots;
      rawResponse = JSON.stringify(forcedSlots);
      fallbackReasons.push('qa:force_dual_slots');
    } else {
      fallbackReasons.push('qa:force_dual_slots_ignored:cast_mismatch');
    }
  }

  let lastParsed: CharacterSlots | null = null;
  for (let attempt = 0; slots === null && attempt < 2; attempt++) {
    try {
      // 2026-09-08: 500 → 900 output tokens. Day-of R35: 3 of 12 responses were cut off INSIDE the action
      // field (the last key) once the costume lock lengthened the wardrobe fields → parsed as "action
      // missing" → pool-pose fallback. Output tokens only; the brief is unchanged.
      const sonnet = await callSonnet(lastAttemptBrief, anthropicKey, 900);
      rawResponse = sonnet.rawResponse;
      retries = attempt;
      const parsed = parseSlotsJson(sonnet.text, castCount);
      const misses = lockMisses(parsed);
      for (const m of misses) missedOnce.add(m.side);
      const violations = [
        ...validateSlots(parsed, allow),
        ...misses.map((m) => `outfit_lock(${m.side}:${m.missing.join('+')})`),
      ];
      if (violations.length === 0) {
        slots = parsed;
        break;
      }
      lastParsed = parsed;
      fallbackReasons.push(`slot_violations_attempt_${attempt + 1}:${violations.join('|')}`);
      const lockLines = misses
        .map(
          (m) =>
            `\n- outfit_lock: ${m.field} dropped ${m.missing.join(', ')}, which the user asked for. Keep the user's exact words in ${m.field}.`
        )
        .join('');
      lastAttemptBrief = `${slotBrief}\n\n━━━ YOUR PREVIOUS OUTPUT WAS REJECTED ━━━\nThese exact phrases broke the rules:\n${describeViolations(parsed, allow)}${lockLines}\nRewrite the JSON without them. Keep the same fields; only the content changes. Props must never cover a face (a mask is pushed up on the forehead or held away from the face); wardrobe must be a costume-designer outfit, never everyday basics.`;
    } catch (err) {
      fallbackReasons.push(`slot_parse_error_attempt_${attempt + 1}:${(err as Error).message}`);
      lastAttemptBrief = `${slotBrief}\n\n━━━ RETRY ━━━\nYour previous output was not parseable JSON. Output ONLY a single valid JSON object — no markdown fences, no commentary, no extra text. Start with { and end with }.`;
    }
  }

  // Only the outfit lock failed (every rule passed): keep Sonnet's slots; the lock is written in below.
  if (!slots && outfitPlan && lastParsed && validateSlots(lastParsed, allow).length === 0) {
    slots = lastParsed;
  }
  if (!slots) {
    if (lastParsed) {
      const salvaged = salvageSlots(lastParsed, fallbackSlots(input), allow);
      slots = salvaged.slots;
      fallbackReasons.push(
        `character_slot_fallback_used:partial(${salvaged.replaced.join(',') || 'none'})`
      );
    } else {
      slots = fallbackSlots(input);
      fallbackReasons.push('character_slot_fallback_used');
    }
  }

  // HOLIDAY COSTUME LOCK (holidayCostumes.ts): the wardrobe slot(s) are the locked text verbatim —
  // Sonnet's paraphrase (or the fallback / a forced slot set) never decides what they wear.
  if (input.costumeLock && input.costumeLock.length === castCount) {
    slots = applyCostumeLock(slots, input.costumeLock);
    fallbackReasons.push('costume_lock');
  }

  // OUTFIT PLAN: stamp the rolls, then guarantee the user's own words. A side that still dropped them after
  // the retries (or came from a fallback) is written from the user's request by code: plain, but exactly
  // what they asked for.
  if (outfitPlan) {
    fallbackReasons.push(
      `outfit_colour:${outfitPlan.colourMode}`,
      `outfit_cut:${outfitPlan.cutMode}`
    );
    fallbackReasons.push(
      `outfit_pattern:${outfitSides
        .map((side) => {
          const p = personFor(side.role);
          return !p || !p.pattern
            ? 'solid'
            : p.patternSource === 'user'
              ? 'user'
              : p.patternAsTrim
                ? 'trim'
                : 'roll';
        })
        .join('|')}`
    );
    outfitSides.forEach((side, i) => {
      const person = personFor(side.role);
      const phrase = person ? userOutfitPhrase(person) : null;
      if (!person || !phrase || !slots) return;
      const field = fieldOf(i);
      const text = wardrobeOf(slots, field);
      if (text === null) return;
      if (missingUserOutfit(text, person).length) {
        slots = withWardrobe(slots, field, phrase);
        fallbackReasons.push(`outfit_lock:${side.label}:code_applied`);
      } else {
        fallbackReasons.push(
          `outfit_lock:${side.label}:${missedOnce.has(side.label) ? 'retried' : 'kept'}`
        );
      }
    });
  }

  // Scene-first action (SCENE_FIRST_ACTION_PLAN.md): the authored beat ships ONLY if it passes
  // the swap-safe envelope; otherwise it is dropped and assembly falls back to `input.action`
  // (today's pool pose). Never a retry — a bad beat must not cost a second Sonnet call.
  if (input.authorAction) {
    const beat = slots.action ?? null;
    if (!beat) {
      fallbackReasons.push('scene_action_fallback:missing');
    } else {
      const verdict = validateActionBeat(
        beat,
        castCount,
        input.swapGeometry === 'natural' ? 'natural' : 'strict'
      );
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
