import {
  buildInboxPages,
  pageContext,
  positionLabel,
  POST_PAGE_TYPES,
  startIndexFor,
  type PageGroupInput,
} from '@/lib/inboxPages';

const g = (over: Partial<PageGroupInput> & { groupKey: string }): PageGroupInput => ({
  type: 'post_like',
  subtype: null,
  uploadIds: [],
  senderName: null,
  actorCount: 1,
  body: null,
  ...over,
});

const INBOX: PageGroupInput[] = [
  g({ groupKey: 'like:post:a', type: 'post_like', uploadIds: ['a'], senderName: 'bob' }),
  g({ groupKey: 'freq:x', type: 'follow_request', senderName: 'eve' }),
  g({
    groupKey: 'share:alice:2026-09-18',
    type: 'post_share',
    uploadIds: ['b', 'c', 'd', 'e'],
    senderName: 'alice',
  }),
  g({ groupKey: 'dreamfail:q', type: 'dream_failed', body: "Your dream couldn't render" }),
  g({ groupKey: 'comment:y', type: 'post_comment', uploadIds: ['a'], senderName: 'carol' }),
  g({ groupKey: 'dream:z', type: 'dream_generated', subtype: 'nightly', uploadIds: ['g', 'h'] }),
];

describe('buildInboxPages', () => {
  it('is the inbox in order: every row is a page, posts fill, everything else is a card', () => {
    const pages = buildInboxPages(INBOX);
    expect(pages.map((p) => p.kind)).toEqual([
      'post',
      'card',
      'post',
      'post',
      'post',
      'post',
      'card',
      'post',
      'post',
      'post',
    ]);
    expect(pages[1]).toEqual({ kind: 'card', key: 'card:freq:x', groupKey: 'freq:x' });
    expect(pages[6].groupKey).toBe('dreamfail:q');
  });

  it('expands a share batch into one page per post, oldest first, each just "From <sender>"', () => {
    const pages = buildInboxPages(INBOX).filter((p) => p.groupKey === 'share:alice:2026-09-18');
    expect(pages.map((p) => (p.kind === 'post' ? p.uploadId : ''))).toEqual(['b', 'c', 'd', 'e']);
    // The position lives in the top counter only (Kevin: no "1 of 2" in the metadata).
    expect(new Set(pages.map((p) => (p.kind === 'post' ? p.context : '')))).toEqual(
      new Set(['From alice'])
    );
  });

  it('does NOT dedupe: a post in two rows is two pages with two contexts', () => {
    const pages = buildInboxPages(INBOX).filter((p) => p.kind === 'post' && p.uploadId === 'a');
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => (p.kind === 'post' ? p.context : ''))).toEqual([
      'bob liked this',
      'carol commented',
    ]);
    expect(new Set(pages.map((p) => p.key)).size).toBe(2);
  });

  it('a post-type row with no post (pruned upload) becomes a card rather than vanishing', () => {
    const pages = buildInboxPages([g({ groupKey: 'like:post:gone', type: 'post_like' })]);
    expect(pages).toEqual([
      { kind: 'card', key: 'card:like:post:gone', groupKey: 'like:post:gone' },
    ]);
  });

  it('carries the comment id so a comment row opens its thread on arrival', () => {
    const pages = buildInboxPages(INBOX, { 'comment:y': 'c-1' });
    const page = pages.find((p) => p.groupKey === 'comment:y');
    expect(page && page.kind === 'post' ? page.commentId : null).toBe('c-1');
  });

  it('opens on the tapped row and counts positions over the whole inbox', () => {
    const pages = buildInboxPages(INBOX);
    expect(startIndexFor(pages, 'dreamfail:q')).toBe(6);
    expect(startIndexFor(pages, 'share:alice:2026-09-18')).toBe(2);
    expect(startIndexFor(pages, 'nope')).toBe(0);
    expect(positionLabel(6, pages.length)).toBe('7 of 10');
  });
});

describe('pageContext', () => {
  it('words each row type', () => {
    expect(pageContext(g({ groupKey: 'k', type: 'post_repost', senderName: 'sunnysteph' }))).toBe(
      'sunnysteph reposted this'
    );
    expect(
      pageContext(g({ groupKey: 'k', type: 'post_like', senderName: 'a', actorCount: 3 }))
    ).toBe('a and 2 others liked this');
    expect(pageContext(g({ groupKey: 'k', type: 'post_milestone', body: '10 likes!' }))).toBe(
      '10 likes!'
    );
    expect(pageContext(g({ groupKey: 'k', type: 'dream_generated', subtype: 'manual' }))).toBe(
      'Your dream'
    );
    expect(pageContext(g({ groupKey: 'k', type: 'download_ready' }))).toBe('HD download ready');
    expect(POST_PAGE_TYPES.has('follow_request')).toBe(false);
  });
});
