/**
 * dualSwapContract — the ONE source of truth for the dual face-swap POSE +
 * face-visibility + gender contract, shared by BOTH dual-brief systems:
 *   • Create   → `buildDualBrief` (dualBriefBuilder.ts) — a SONNET brief
 *   • Nightly  → `runCharacterSlotPipeline` (characterSlotPrompt.ts) — a FLUX prompt
 *   • Nightly fallback freeform brief (nightly-dreams/index.ts) — a SONNET brief
 * so the guarantee can't drift between paths.
 *
 * WHY: the dual swap engine (services/face-swap-dual) now does real in-process
 * face detection + a PER-FACE COMPOSITE — it places each cast member on their OWN
 * detected face for ANY layout (piggyback, dip, lift, dance, different heights).
 * So the old fixed-55/55-crop pose locks (fixed L/R halves, same vertical height,
 * stationary, "side by side", "not facing each other") are OBSOLETE. The ONLY
 * real constraints left are:
 *   1. both faces visible + roughly camera-facing (detection must find them),
 *   2. two distinct heads with a gap — never cheek-to-cheek (engine IoU>0.35 → re-render),
 *   3. no face-bearing decorative objects (statues/busts confuse the detector).
 * Mixed-gender placement is correct by construction (the engine matches each
 * source to its own-gender detected face). Same-sex casts have no gender signal
 * to tell the two people apart, so we keep a SOFT side-lean tiebreaker.
 *
 * Two render formats, ONE contract:
 *   - `dualPoseRules()`      → newline bullet RULES for the Sonnet-brief consumers
 *   - `dualPoseFluxTokens()` → comma-joined Flux PHRASES for the slot pipeline
 *   - `DUAL_FACE_LOCK_PHRASE`→ the literal mandatory phrase both inject verbatim
 */

/** The canonical mandatory phrase — injected verbatim into every dual prompt
 *  (Create's MANDATORY-include, the nightly fallback face lock, the slot anchor). */
export const DUAL_FACE_LOCK_PHRASE =
  'two people together, both faces clearly visible and turned toward the camera, two distinct heads with a clear gap between them, never cheek-to-cheek or overlapping';

/** The no-face-decorations rule — statues/busts/masks are read as extra faces by
 *  the detector and break the swap. Shared so both engines state it identically. */
export const DUAL_NO_FACE_DECOR_RULE =
  'DO NOT include any face-bearing decorative objects in the same frame: NO statues, busts, mannequins, dolls, masks, helmets with visible faceplates, totems, idols, gargoyles, carved figures, painted portraits, sculpted heads, or cartoon/character imagery on signs/billboards. They compete with the real faces during the swap. Substitute face-free decoration (urns, banners, abstract carvings, plants, lanterns).';

export type DualContactClass = { kind: 'ok' } | { kind: 'contact'; verb: string };

// TRUE face/cheek contact — the ONLY poses that genuinely IoU-fail the per-face
// crop (faces physically overlapping at the contact plane). Everything else that
// the OLD detector flagged as "breaking" (hug, embrace, cuddle, piggyback, carry,
// slow-dance, back-to-back) is now swap-safe and renders as the user asked.
const FACE_CONTACT_VERBS = [
  'kiss',
  'kissing',
  'kissed',
  'kisses',
  'make out',
  'making out',
  'makeout',
  'kissing on the cheek',
  'nose to nose',
  'nose-to-nose',
  'forehead to forehead',
  'forehead-to-forehead',
  'cheek to cheek',
  'cheek-to-cheek',
  'nuzzle',
  'nuzzling',
  'whispering in',
  'whisper in',
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Classify a user prompt for TRUE face-contact only. Returns `contact` (with the
 * matched verb) for kiss/nuzzle/cheek-to-cheek/etc. — poses where the faces
 * physically overlap and the per-face crop can't separate them, so the brief
 * softens to a near-touch. Everything else returns `ok` and renders as-is.
 *
 * Replaces the old `classifyDualAction` whose `breaking` set wrongly included
 * hug/piggyback/dance/carry — all now swap-safe via the per-face composite.
 */
export function classifyFaceContact(prompt: string | undefined | null): DualContactClass {
  if (!prompt || !prompt.trim()) return { kind: 'ok' };
  for (const verb of FACE_CONTACT_VERBS) {
    const isPhrase = verb.includes(' ') || verb.includes('-');
    const pattern = isPhrase
      ? new RegExp(escapeRegex(verb), 'i')
      : new RegExp(`\\b${escapeRegex(verb)}\\b`, 'i');
    if (pattern.test(prompt)) return { kind: 'contact', verb };
  }
  return { kind: 'ok' };
}

export interface DualPoseOpts {
  /** Role of the first cast member (cast[0]) — used for the same-sex side-lean. */
  leftRole?: string;
  /** Role of the second cast member (cast[1]). */
  rightRole?: string;
  /** true when BOTH cast members are the same gender — there's no gender signal
   *  to tell them apart, so add the soft side-lean tiebreaker. Mixed-gender casts
   *  omit it (the engine resolves identity per-face by gender → full pose freedom). */
  sameSex: boolean;
  /** Set when the user typed a TRUE face-contact verb (classifyFaceContact →
   *  'contact'). Softens to a near-touch with the heads kept slightly apart
   *  instead of suppressing the intent. Carries the relationship for the
   *  partner/platonic gate. */
  softenContact?: { verb: string; relationship?: string | null };
}

/**
 * The canonical COMPOSITION-RULES block for the SONNET-brief consumers (Create +
 * nightly fallback). Newline bullet list. Encodes ONLY the real constraints +
 * pose freedom; the per-engine gender SHOUT + L/R cast labels stay where they are
 * (they double as the soft positional hint).
 */
export function dualPoseRules(opts: DualPoseOpts): string {
  const { leftRole, rightRole, sameSex, softenContact } = opts;
  const lines: string[] = [
    '- TWO people in frame, BOTH faces clearly visible and turned toward the camera (three-quarter or front). The face-swap pipeline must SEE both faces.',
    '- NO back views, NO back-of-head, NO face hidden/obscured/turned fully away, NO heavy profile that hides an eye.',
    '- The two faces must read as TWO DISTINCT heads with a clear gap between them — NOT cheeks pressed together, NOT faces overlapping. If the medium has soft or bleeding edges (watercolor, ink, pastel), widen that head gap so the faces never blur together.',
    '- POSE IS FREE: the two can interact naturally — standing close, an arm around a shoulder, hugging, dancing, one giving a piggyback, a playful lift or dip, leaning together, sitting at different heights. Movement and different heights are GOOD. Both should feel CONNECTED, sharing the same moment.',
    '- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.',
    `- ${DUAL_NO_FACE_DECOR_RULE}`,
  ];
  if (sameSex && leftRole && rightRole) {
    lines.push(
      `- Because both characters are the same gender, keep the ${leftRole} a touch toward the LEFT and the ${rightRole} a touch toward the RIGHT so they don't get mixed up (a soft preference within the free pose, not a rigid lock).`
    );
  }
  if (softenContact) {
    const isPartner =
      softenContact.relationship === 'partner' ||
      softenContact.relationship === 'significant_other';
    const intimacy = isPartner
      ? 'Keep the romantic intimacy in the body language and expressions'
      : 'Keep it warm and PLATONIC — no romantic gaze, no lingering embrace';
    lines.push(
      `- The user asked for "${softenContact.verb}". Render the FEELING of it as a NEAR-touch — faces close and both turned toward the camera, but the two heads kept slightly apart with a small visible gap (never cheeks / lips / foreheads actually pressed together). ${intimacy}.`
    );
  }
  return lines.join('\n');
}

/**
 * The canonical framing tokens for the FLUX-prompt consumer (the nightly slot
 * pipeline assembles a comma-joined Flux prompt, not a Sonnet brief). Returns a
 * comma-joined phrase string. The slot pipeline keeps its own gender SHOUT +
 * per-side wardrobe blocks for the L/R bias, so `sameSex` here only adds a light
 * reinforcement.
 */
export function dualPoseFluxTokens(
  opts: Pick<DualPoseOpts, 'sameSex' | 'leftRole' | 'rightRole'>
): string {
  const phrases = [
    'both faces clearly visible and turned toward the camera',
    'two distinct heads with a clear gap between them, not cheek-to-cheek, not overlapping',
    'both shown from at least the waist up, fully visible',
    'natural interaction welcome — standing close, an arm around a shoulder, a piggyback, a lift, a dip, dancing, sitting at different heights',
    'both feel connected sharing the same moment',
  ];
  if (opts.sameSex && opts.leftRole && opts.rightRole) {
    phrases.push(
      `the ${opts.leftRole} leaning slightly left, the ${opts.rightRole} slightly right`
    );
  }
  return phrases.join(', ');
}
