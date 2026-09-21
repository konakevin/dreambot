/**
 * inboxPages.ts — the FULLSCREEN INBOX (Kevin 2026-09-18: "the ability to swipe up and down in the inbox while in
 * fullscreen … even ones like 'That dream couldn't render' still show up, because it's not an album").
 *
 * One page per inbox row, in inbox order. A row that points at a post is a POST page (the post fills the screen,
 * the pill says why it is in your inbox); every other row is a CARD page (the row's text and its actions,
 * fullscreen). A sender's batch of shares (mig 533) and a day's pooled dreams expand into one post page per
 * member. Nothing is deduped: the fullscreen inbox is the inbox, so a post that appears in two rows appears on
 * two pages, each with its own context. Pure; locked by __tests__/lib/inboxPages.test.ts.
 */

/** Rows whose post fills the page. Every other type is a card. */
export const POST_PAGE_TYPES: ReadonlySet<string> = new Set([
  'post_like',
  'comment_like',
  'post_repost',
  'post_milestone',
  'post_share',
  'post_comment',
  'comment_reply',
  'comment_mention',
  'post_mention',
  'dream_generated',
  'download_ready',
]);

export interface PageGroupInput {
  groupKey: string;
  type: string;
  subtype: string | null;
  /** Member uploads in walk order (a share batch oldest first, a day's dreams newest first); [] for a card row. */
  uploadIds: string[];
  /** First preview actor's username. */
  senderName: string | null;
  actorCount: number;
  body: string | null;
}

export type InboxPage =
  | {
      kind: 'post';
      /** Unique per page (a post can appear on two pages). */
      key: string;
      groupKey: string;
      uploadId: string;
      /** Why this post is in your inbox: "From alice", "bob reposted this", "Nightly dream". */
      context: string;
      /** Comment rows open their thread on arrival. */
      commentId: string | null;
    }
  | { kind: 'card'; key: string; groupKey: string };

function actorsPhrase(g: PageGroupInput): string {
  const name = g.senderName ?? 'Someone';
  const others = Math.max(0, g.actorCount - 1);
  return others === 0 ? name : `${name} and ${others} other${others === 1 ? '' : 's'}`;
}

/** The context line of a post page (the position lives in the top counter, never here — Kevin 2026-09-18). */
export function pageContext(g: PageGroupInput): string {
  const name = g.senderName ?? 'Someone';
  switch (g.type) {
    case 'post_share':
      return `From ${name}`;
    case 'post_like':
      return `${actorsPhrase(g)} liked this`;
    case 'comment_like':
      return `${actorsPhrase(g)} liked your comment`;
    case 'post_repost':
      return `${actorsPhrase(g)} reposted this`;
    case 'post_milestone':
      return g.body ?? 'Milestone';
    case 'post_comment':
      return `${name} commented`;
    case 'comment_reply':
      return `${name} replied`;
    case 'comment_mention':
    case 'post_mention':
      return `${name} mentioned you`;
    case 'download_ready':
      return 'HD download ready';
    case 'dream_generated':
      if (g.subtype === 'nightly') return 'Nightly dream';
      if (g.subtype === 'first_dream') return 'Your first dream';
      if (g.subtype === 'welcome') return 'Welcome dream';
      return 'Your dream';
    default:
      return 'Inbox';
  }
}

export function buildInboxPages(
  groups: readonly PageGroupInput[],
  commentIdsByGroup: Readonly<Record<string, string | null>> = {}
): InboxPage[] {
  const pages: InboxPage[] = [];
  for (const g of groups) {
    const members = g.uploadIds.filter((id) => typeof id === 'string' && id.length > 0);
    if (!POST_PAGE_TYPES.has(g.type) || members.length === 0) {
      pages.push({ kind: 'card', key: `card:${g.groupKey}`, groupKey: g.groupKey });
      continue;
    }
    members.forEach((uploadId) => {
      pages.push({
        kind: 'post',
        key: `post:${g.groupKey}:${uploadId}`,
        groupKey: g.groupKey,
        uploadId,
        context: pageContext(g),
        commentId: commentIdsByGroup[g.groupKey] ?? null,
      });
    });
  }
  return pages;
}

/** The page a tap on this row opens: its first page, else 0. */
export function startIndexFor(pages: readonly InboxPage[], groupKey: string): number {
  const i = pages.findIndex((p) => p.groupKey === groupKey);
  return i < 0 ? 0 : i;
}

/**
 * "Inbox · 5 of 23" — the position line, always over the WHOLE inbox (never restarts inside a batch).
 *
 * NAMED, not just numbered (Kevin, 2026-09-21). Fullscreen inbox pages are the same cards the feed
 * shows, so a bare "1 of 9" floating over one left no clue which stack you were walking — the feed,
 * an album, or the inbox. The word is the whole point; the count follows it.
 */
export function positionLabel(index: number, total: number): string {
  return `Inbox · ${index + 1} of ${total}`;
}
