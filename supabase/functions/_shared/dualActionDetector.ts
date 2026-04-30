/**
 * Dual-cast action classifier.
 *
 * Detects whether a user prompt contains an action verb that fundamentally
 * breaks the dual face-swap pipeline. The pipeline crops the rendered frame
 * in half (left 55%, right 55%), runs face swap on each half independently,
 * and stitches at the midpoint. This requires strict left/right body
 * separation. Any action implying face contact, full-body embrace, or
 * center-stacked composition cannot be face-swapped — the model needs each
 * face cleanly inside its own half of the frame.
 *
 * When the user writes a breaking verb ("kissing", "piggyback", "hugging"),
 * dualBriefBuilder.ts must translate the EMOTIONAL VIBE of the verb into a
 * side-by-side composition that satisfies the L/R constraint while
 * preserving the user's intent (intimacy, romance, playfulness).
 *
 * Anything that's not breaking falls through to current behavior — the
 * dual_actions pool provides L/R-compatible body language and Sonnet
 * blends in the user's action verb naturally from the SACRED block.
 */

export type DualActionClass = { kind: 'ok' } | { kind: 'breaking'; verb: string };

const SWAP_BREAKING_VERBS = [
  // Face contact
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
  // Full-body embrace / overlap
  'hug',
  'hugs',
  'hugging',
  'hugged',
  'embrace',
  'embracing',
  'embraced',
  'cuddle',
  'cuddling',
  'cuddled',
  'snuggle',
  'snuggling',
  'snuggled',
  'spoon',
  'spooning',
  'wrapped around',
  'wrapped in',
  'in each other',
  "in each other's arms",
  'holding each other',
  // Carry / piggyback (one body on top of the other)
  'piggyback',
  'piggy back',
  'piggy-back',
  'carry',
  'carrying',
  'carried',
  'carries',
  // Center-coupled dancing (close-hold dance positions)
  'slow dancing',
  'slow dance',
  'waltzing',
  'waltz',
  'ballroom dancing',
  'tango',
  'tangoing',
  // Back-to-back puts both characters in profile, breaks swap
  'back to back',
  'back-to-back',
];

function matchesVerb(prompt: string, verbs: string[]): string | null {
  for (const verb of verbs) {
    const isPhrase = verb.includes(' ') || verb.includes('-');
    const pattern = isPhrase
      ? new RegExp(escapeRegex(verb), 'i')
      : new RegExp(`\\b${escapeRegex(verb)}\\b`, 'i');
    if (pattern.test(prompt)) return verb;
  }
  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function classifyDualAction(prompt: string | undefined | null): DualActionClass {
  if (!prompt || !prompt.trim()) return { kind: 'ok' };
  const breaking = matchesVerb(prompt, SWAP_BREAKING_VERBS);
  if (breaking) return { kind: 'breaking', verb: breaking };
  return { kind: 'ok' };
}
