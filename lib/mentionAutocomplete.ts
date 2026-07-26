/**
 * Caret-aware @-mention token detection for comment + caption composers.
 *
 * Pure functions (no React) so the fiddly cursor math is unit-tested in isolation.
 * The composer feeds in the current text + the caret (from onSelectionChange); we
 * find the @token the caret is CURRENTLY inside — not merely the last '@' in the
 * string, which mis-fires when you edit an earlier word or type after a finished
 * mention (the bug in the old lastIndexOf('@') heuristic).
 *
 * Charset is [A-Za-z0-9_] (a subset of the render/notify tokenizer @[A-Za-z0-9_.]+
 * in lib/hashtags.ts + the notify triggers): usernames themselves have no dots, so
 * every handle we insert both links (ExpandableDescription / CommentRow) and
 * notifies (create_*_mention_notifications). Cap 30 = the username length limit.
 */

export interface Selection {
  start: number;
  end: number;
}

export interface MentionMatch {
  /** True when the caret sits inside an @token we should autocomplete. */
  active: boolean;
  /** The characters typed after '@' up to the caret (may be '' right after '@'). */
  query: string;
  /** Index of the '@' in the text, or -1 when inactive. */
  start: number;
}

// '@' must sit at string-start or right after whitespace (never mid-word like an
// email a@b), then 0..30 handle chars, and the token must END at the caret.
const ACTIVE_MENTION_RE = /(?:^|\s)@([A-Za-z0-9_]{0,30})$/;

export function detectMention(text: string, selection: Selection): MentionMatch {
  const inactive: MentionMatch = { active: false, query: '', start: -1 };
  // Only a collapsed caret (no active range selection) triggers suggestions.
  if (selection.start !== selection.end) return inactive;
  const before = text.slice(0, selection.start);
  const m = ACTIVE_MENTION_RE.exec(before);
  if (!m) return inactive;
  const query = m[1];
  // '@' index = caret − query length − 1 (the '@' itself). The optional leading
  // whitespace the regex consumed sits BEFORE the '@', so it doesn't shift this.
  return { active: true, query, start: before.length - query.length - 1 };
}

/**
 * Replace the active @token under the caret with `@username `, returning the new
 * text and where to place the caret (just after the inserted trailing space).
 * No-op (returns the text unchanged) if there's no active token.
 */
export function applyMention(
  text: string,
  selection: Selection,
  username: string
): { text: string; cursor: number } {
  const match = detectMention(text, selection);
  if (!match.active) return { text, cursor: selection.end };
  const insert = `@${username} `;
  const next = text.slice(0, match.start) + insert + text.slice(selection.start);
  return { text: next, cursor: match.start + insert.length };
}
