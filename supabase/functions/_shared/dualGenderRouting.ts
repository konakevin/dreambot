/**
 * Gender-aware source routing for the dual face-swap pipeline.
 *
 * THE BUG THIS SOLVES: the dual swap crops the rendered image into left/right
 * halves and pastes each cast member's face onto its half — positionally. But
 * Flux frequently renders the two subjects on the OPPOSITE sides from the
 * prompt, and the face-swap model pastes a face onto whatever body is in the
 * crop (it doesn't look at gender). So on a MIXED-gender couple, a left/right
 * flip becomes a gender swap: the user's face lands on the partner's body.
 *
 * THE FIX: when the two cast genders differ, classify the rendered image and
 * route the male source onto the male body + the female source onto the female
 * body, wherever Flux actually placed them.
 *
 * Scoping: same-sex pairs can't gender-swap (both bodies are the same gender),
 * so we skip the classification entirely — no added vision call, cost, or
 * latency. Any classification failure falls back to positional assignment, so
 * this can never block or break a render.
 */

import { classifyDualGenders } from './vision.ts';

export interface DualSwapSource {
  /** Face-swap source photo URL. */
  sourceUrl: string;
  /** Apparent gender of this cast member, or null/undefined if unknown. */
  gender: 'male' | 'female' | null | undefined;
}

export interface DualSwapRouting {
  /** Source URL to paste onto the LEFT crop. */
  leftSource: string;
  /** Source URL to paste onto the RIGHT crop. */
  rightSource: string;
  /**
   * What happened, for logging:
   *   'positional-samesex' — same/unknown gender, skipped classification
   *   'confirmed'          — mixed gender, Flux honored prompt L/R, kept positional
   *   'corrected-flip'     — mixed gender, Flux flipped L/R, swapped sources
   *   'unread'             — mixed gender, classifier couldn't read → positional
   *   'classify-failed'    — vision call threw → positional
   */
  routing: string;
  /**
   * TRUE only when the cast is mixed-gender but the render produced TWO
   * SAME-gender bodies — i.e. there is no opposite-gender body to route one of
   * the faces onto, so any swap WILL paste a mismatched-gender face (the
   * 2026-06-09 "wife's face on a bearded man" failure). The caller re-renders
   * once and, if it persists, falls back to a single swap. Never true for
   * same-sex casts (two same-gender bodies is correct there).
   */
  collision: boolean;
}

/** Map a castResolver genderLock sentence to a plain gender. */
export function genderFromLock(genderLock: string | null | undefined): 'male' | 'female' | null {
  if (!genderLock) return null;
  // Check FEMALE first — "FEMALE character" contains the substring "MALE".
  if (genderLock.startsWith('FEMALE character')) return 'female';
  if (genderLock.startsWith('MALE character')) return 'male';
  return null;
}

/**
 * Decide which source paints the left crop and which paints the right.
 *
 * @param a intended LEFT source (cast[0]) + its gender
 * @param b intended RIGHT source (cast[1]) + its gender
 * @param renderedUrl the pre-swap Flux render to classify
 */
export async function routeDualSwapByGender(
  a: DualSwapSource,
  b: DualSwapSource,
  renderedUrl: string,
  replicateToken: string
): Promise<DualSwapRouting> {
  const mixed =
    (a.gender === 'male' && b.gender === 'female') ||
    (a.gender === 'female' && b.gender === 'male');

  // Same-sex or unknown gender → can't gender-swap → keep positional, no call.
  if (!mixed) {
    return {
      leftSource: a.sourceUrl,
      rightSource: b.sourceUrl,
      routing: 'positional-samesex',
      collision: false,
    };
  }

  try {
    const maleSource = a.gender === 'male' ? a.sourceUrl : b.sourceUrl;
    const femaleSource = a.gender === 'male' ? b.sourceUrl : a.sourceUrl;
    const { left, right } = await classifyDualGenders(renderedUrl, replicateToken);
    // COLLISION: mixed cast, but both rendered bodies read the SAME gender →
    // there is no opposite-gender body to route one face onto. The caller
    // re-renders / falls back. (Both reads must be present + equal.)
    const collision = left !== null && right !== null && left === right;
    // Trust the left read; if only the right is readable, take its complement.
    const leftBody = left ?? (right === 'male' ? 'female' : right === 'female' ? 'male' : null);

    if (leftBody === 'male') {
      return {
        leftSource: maleSource,
        rightSource: femaleSource,
        routing: maleSource !== a.sourceUrl ? 'corrected-flip' : 'confirmed',
        collision,
      };
    }
    if (leftBody === 'female') {
      return {
        leftSource: femaleSource,
        rightSource: maleSource,
        routing: femaleSource !== a.sourceUrl ? 'corrected-flip' : 'confirmed',
        collision,
      };
    }
    return {
      leftSource: a.sourceUrl,
      rightSource: b.sourceUrl,
      routing: 'unread',
      collision: false,
    };
  } catch (err) {
    console.warn('[routeDualSwapByGender] classify failed, positional:', (err as Error).message);
    return {
      leftSource: a.sourceUrl,
      rightSource: b.sourceUrl,
      routing: 'classify-failed',
      collision: false,
    };
  }
}
