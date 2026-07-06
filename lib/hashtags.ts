/**
 * hashtags — caption tokenizing for tappable #tags and @mentions.
 *
 * The tag charset/length here MUST mirror the server extractor
 * (extract_hashtags, migration 331): 2-30 chars of [a-z0-9_], lowercased.
 * The display regex accepts uppercase so "#DreamBot" renders as a link;
 * normalizeTag lowercases before navigation so it hits the same tag page
 * the server indexed.
 */

// Split-capture: odd-indexed parts of caption.split(CAPTION_TOKEN_RE) are the
// tokens. Mention charset matches CommentRow's mention split.
export const CAPTION_TOKEN_RE = /(#[A-Za-z0-9_]{2,30}|@[a-zA-Z0-9_.]+)/g;

/** Split a caption into plain-text and #tag/@mention token parts. */
export function splitCaption(text: string): string[] {
  return text.split(CAPTION_TOKEN_RE);
}

export function isHashtagToken(part: string): boolean {
  return part.startsWith('#');
}

export function isMentionToken(part: string): boolean {
  return part.startsWith('@');
}

/** "#DreamBot" | "dreambot" → "dreambot" (the server-indexed form). */
export function normalizeTag(raw: string): string {
  return raw.replace(/^#/, '').toLowerCase();
}
