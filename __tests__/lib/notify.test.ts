/**
 * Unit tests for shouldSendCompletionNotification (_shared/notify.ts).
 *
 * Guards the "your dream is ready" rule that silently regressed once already:
 * we notify ONLY when the user QUEUED the dream (tapped "Queue This" →
 * notify_on_complete=true). A user who WAITED on the loading screen sees the
 * reveal immediately and must NOT get a redundant push. Shared by generate-dream
 * + restyle-photo, so if someone touches the gating this test fails loudly.
 */

import { shouldSendCompletionNotification } from '@engine/notify';

describe('shouldSendCompletionNotification', () => {
  const base = { uploadId: 'up-1', jobId: 'job-1', notifyOnComplete: true };

  it('notifies when the user QUEUED (notify_on_complete=true) and a result exists', () => {
    expect(shouldSendCompletionNotification(base)).toBe(true);
  });

  it('does NOT notify a user who waited on the loading screen (notify_on_complete=false)', () => {
    // THE regression case: waiter saw the reveal — a push would be redundant.
    expect(shouldSendCompletionNotification({ ...base, notifyOnComplete: false })).toBe(false);
  });

  it('does NOT notify without a persisted result (no uploadId)', () => {
    expect(shouldSendCompletionNotification({ ...base, uploadId: null })).toBe(false);
    expect(shouldSendCompletionNotification({ ...base, uploadId: undefined })).toBe(false);
    expect(shouldSendCompletionNotification({ ...base, uploadId: '' })).toBe(false);
  });

  it('does NOT notify without a tracked job (no jobId — e.g. inline path)', () => {
    expect(shouldSendCompletionNotification({ ...base, jobId: null })).toBe(false);
    expect(shouldSendCompletionNotification({ ...base, jobId: undefined })).toBe(false);
    expect(shouldSendCompletionNotification({ ...base, jobId: '' })).toBe(false);
  });

  it('requires ALL three conditions together', () => {
    expect(
      shouldSendCompletionNotification({ uploadId: 'u', jobId: 'j', notifyOnComplete: true })
    ).toBe(true);
    expect(
      shouldSendCompletionNotification({ uploadId: '', jobId: '', notifyOnComplete: false })
    ).toBe(false);
  });
});
