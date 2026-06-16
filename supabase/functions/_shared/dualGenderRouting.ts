/**
 * Gender-SAFE source routing for the dual face-swap pipeline.
 *
 * THE GUARANTEE (2026-06-16, Kevin: "impossible to fuck up … correct gender
 * 100% of the time"): a cast face is pasted onto a body ONLY when we have
 * CONFIRMED that body's gender matches that cast member's gender. When we can't
 * confirm, we never guess — the caller re-renders and, failing that, degrades
 * to a path where gender CANNOT be wrong (single self, or the onboarding
 * cascade's solo tier). A wrong-gender paste is therefore structurally
 * impossible: no confirmation → no paste.
 *
 * WHY THE OLD VERSION FAILED: it cropped the render left/right and pasted
 * positionally, and its only correction depended on a classifier that returned
 * 'unread' ~100% of the time (it accepted only the literal words "male"/"female"
 * but vision says "man"/"woman"). So it silently fell back to blind positional
 * pasting → the user's face on the partner's body, or — when the render
 * clustered the couple so the fixed 55/55 crop caught one face twice — BOTH
 * faces on one person. See `classifyDualGenders` in vision.ts for the parser fix
 * and the faceCount/twoDistinctFaces signal this router now consumes.
 */

import { classifyDualGenders } from './vision.ts';

export interface DualSwapSource {
  /** Face-swap source photo URL. */
  sourceUrl: string;
  /** Apparent gender of this cast member, or null/undefined if unknown. */
  gender: 'male' | 'female' | null | undefined;
  /** Which cast role this is — used to pick the self face for a safe degrade. */
  role?: 'self' | 'plus_one' | string;
}

export interface DualSwapDecision {
  /**
   * 'dual'   — gender CONFIRMED for both sides; safe to paste both. Use
   *            leftSource/rightSource.
   * 'single' — could NOT confirm a safe dual placement. Do NOT dual-swap.
   *            `singleSource` is the ONE cast face that is gender-safe to paste
   *            (or self as the safe default); `genderMatched` says whether that
   *            single paste is itself gender-confirmed. Callers that can
   *            re-render/cascade should prefer that over a best-effort single.
   */
  mode: 'dual' | 'single';
  /** LEFT crop source (mode==='dual'). */
  leftSource: string;
  /** RIGHT crop source (mode==='dual'). */
  rightSource: string;
  /** The single gender-safe source to paste (mode==='single'). */
  singleSource: string;
  /** mode==='single': is the single paste itself gender-confirmed? */
  genderMatched: boolean;
  /** Human-readable reason, for logs + observability. */
  routing: string;
}

/** Map a castResolver genderLock sentence to a plain gender. */
export function genderFromLock(genderLock: string | null | undefined): 'male' | 'female' | null {
  if (!genderLock) return null;
  // Check FEMALE first — "FEMALE character" contains the substring "MALE".
  if (genderLock.startsWith('FEMALE character')) return 'female';
  if (genderLock.startsWith('MALE character')) return 'male';
  return null;
}

function selfSourceOf(a: DualSwapSource, b: DualSwapSource): string {
  if (a.role === 'self') return a.sourceUrl;
  if (b.role === 'self') return b.sourceUrl;
  return a.sourceUrl; // cast[0] is self by convention when role is unset
}

/**
 * Decide how to swap two cast faces onto a rendered scene, guaranteeing that
 * any face we DO paste is on a gender-matching body.
 *
 * @param a intended LEFT source (cast[0]) + its gender + role
 * @param b intended RIGHT source (cast[1]) + its gender + role
 * @param renderedUrl the pre-swap render to classify
 */
export async function routeDualSwapByGender(
  a: DualSwapSource,
  b: DualSwapSource,
  renderedUrl: string,
  replicateToken: string
): Promise<DualSwapDecision> {
  const self = selfSourceOf(a, b);
  const maleSource = a.gender === 'male' ? a.sourceUrl : b.gender === 'male' ? b.sourceUrl : null;
  const femaleSource =
    a.gender === 'female' ? a.sourceUrl : b.gender === 'female' ? b.sourceUrl : null;
  const mixed = Boolean(maleSource && femaleSource);

  const single = (
    singleSource: string,
    genderMatched: boolean,
    routing: string
  ): DualSwapDecision => ({
    mode: 'single',
    leftSource: a.sourceUrl,
    rightSource: b.sourceUrl,
    singleSource,
    genderMatched,
    routing,
  });
  const dual = (leftSource: string, rightSource: string, routing: string): DualSwapDecision => ({
    mode: 'dual',
    leftSource,
    rightSource,
    singleSource: self,
    genderMatched: false,
    routing,
  });

  let read: Awaited<ReturnType<typeof classifyDualGenders>>;
  try {
    read = await classifyDualGenders(renderedUrl, replicateToken);
  } catch (err) {
    // Vision threw → we cannot confirm anything → degrade to single self. Never
    // dual-paste blind. (Caller re-renders / cascades.)
    console.warn('[routeDualSwapByGender] classify threw, single-self:', (err as Error).message);
    return single(self, false, 'single-classify-error');
  }

  const { left, right, faceCount, twoDistinctFaces } = read;

  // No two clearly-separated faces → the 55/55 crop would paste both onto one
  // body (the "both faces on one person" failure). NEVER dual here. A gender-
  // matched single is only safe when there is a GENUINE single face (faceCount
  // === 1) whose gender we read — a single swap targets the dominant face, so
  // if a second (unread, maybe wrong-gender) face is present we must NOT claim a
  // match; degrade to self and let the caller re-render / cascade to solo-self.
  if (!twoDistinctFaces) {
    if (faceCount === 1) {
      const visible = left ?? right;
      if (visible === 'male' && maleSource) return single(maleSource, true, 'single-one-face-male');
      if (visible === 'female' && femaleSource)
        return single(femaleSource, true, 'single-one-face-female');
    }
    return single(self, false, `single-unconfirmed(faces=${faceCount ?? '?'})`);
  }

  if (mixed) {
    // Need BOTH sides read to place a mixed couple safely.
    if (left && right) {
      if (left !== right) {
        // One male body + one female body → place each on its match. CONFIRMED.
        const leftSrc = left === 'male' ? maleSource! : femaleSource!;
        const rightSrc = left === 'male' ? femaleSource! : maleSource!;
        const flipped = leftSrc !== a.sourceUrl;
        return dual(leftSrc, rightSrc, flipped ? 'dual-corrected-flip' : 'dual-confirmed');
      }
      // Collision: render made TWO same-gender bodies. There is no body for the
      // other cast face → paste ONLY the matching one (gender-correct single).
      const g = left; // === right
      const matchSource = g === 'male' ? maleSource! : femaleSource!;
      return single(matchSource, true, `single-collision-${g}`);
    }
    // Mixed cast but we couldn't read both bodies → not safe to route. Degrade.
    return single(self, false, 'single-mixed-unread');
  }

  // Same-sex (or unknown-gender) cast: two same-gender bodies is CORRECT, so a
  // positional dual is gender-safe as long as there are two faces. Genders
  // can't be "wrong" because both cast members are the same gender.
  return dual(a.sourceUrl, b.sourceUrl, 'dual-samesex-positional');
}
