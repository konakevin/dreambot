import { toastForNotification } from '@/lib/notificationToast';

describe('toastForNotification', () => {
  it('toasts a finished dream → opens the photo', () => {
    const spec = toastForNotification({
      id: 'n1',
      type: 'dream_generated',
      subtype: 'manual',
      upload_id: 'u1',
    });
    expect(spec).not.toBeNull();
    expect(spec!.message).toMatch(/ready/i);
    expect(spec!.icon).toBe('sparkles');
    expect(spec!.action).toEqual({
      kind: 'route',
      data: { type: 'dream_generated', uploadId: 'u1' },
    });
  });

  it('toasts a ready HQ download → opens the photo (download variant)', () => {
    const spec = toastForNotification({
      id: 'n2',
      type: 'download_ready',
      subtype: 'download',
      upload_id: 'u2',
    });
    expect(spec).not.toBeNull();
    expect(spec!.icon).toBe('cloud-download');
    expect(spec!.action).toEqual({
      kind: 'route',
      data: { type: 'download_ready', uploadId: 'u2' },
    });
  });

  it('toasts a failed dream → opens the inbox, using the server body when present', () => {
    const spec = toastForNotification({
      id: 'n3',
      type: 'dream_failed',
      subtype: 'failed',
      body: "Your dream couldn't render — sparkle refunded",
    });
    expect(spec).not.toBeNull();
    expect(spec!.message).toMatch(/refunded/i);
    expect(spec!.action).toEqual({ kind: 'inbox' });
  });

  it('falls back to default copy when a failed dream has no body', () => {
    const spec = toastForNotification({ id: 'n4', type: 'dream_failed' });
    expect(spec!.message).toMatch(/couldn.t be finished/i);
  });

  it('does NOT toast passive social events (purple dot only)', () => {
    for (const type of [
      'post_like',
      'post_favorite',
      'post_comment',
      'comment_reply',
      'comment_mention',
      'follow_request',
      'follow_accepted',
      'post_share',
    ]) {
      expect(toastForNotification({ id: 'x', type })).toBeNull();
    }
  });

  it('returns null for an unknown / missing type', () => {
    expect(toastForNotification({ id: 'x' })).toBeNull();
    expect(toastForNotification({ id: 'x', type: 'something_new' })).toBeNull();
  });
});
