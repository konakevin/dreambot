/**
 * Tests for lib/moderation.ts — the client-side slur/hate pre-check + the
 * server-error mapping. (The server trigger in migration 276 is the real
 * enforcement — see textModeration.dbspec.ts; this covers the client matcher.)
 */

import {
  moderateText,
  moderateUpload,
  moderateImage,
  isModerationError,
  MODERATION_BLOCKED_MESSAGE,
} from '@/lib/moderation';

describe('moderateText', () => {
  it('passes clean text', async () => {
    expect((await moderateText('a beautiful sunset over the lake')).passed).toBe(true);
    expect((await moderateText('this dream is amazing')).passed).toBe(true);
  });

  it('allows normal profanity (not the target)', async () => {
    expect((await moderateText('fuck this is cool')).passed).toBe(true);
    expect((await moderateText('holy shit wow')).passed).toBe(true);
  });

  it('blocks slurs (case-insensitive, with a reason)', async () => {
    const r = await moderateText('you faggot');
    expect(r.passed).toBe(false);
    expect(r.reason).toBeTruthy();
    expect((await moderateText('FAGGOT')).passed).toBe(false);
    expect((await moderateText('what a chink')).passed).toBe(false);
    expect((await moderateText('kike!')).passed).toBe(false);
  });

  it('blocks hate phrases with flexible whitespace', async () => {
    expect((await moderateText('just kill yourself')).passed).toBe(false);
    expect((await moderateText('kill   yourself')).passed).toBe(false);
    expect((await moderateText('go die')).passed).toBe(false);
  });

  it('does NOT block a slur substring inside a real word (word boundary)', async () => {
    expect((await moderateText('a raccoon in the yard')).passed).toBe(true); // "coon" in raccoon
  });

  it('passes empty / whitespace', async () => {
    expect((await moderateText('')).passed).toBe(true);
    expect((await moderateText('   ')).passed).toBe(true);
  });
});

describe('moderateUpload', () => {
  it('only checks the caption, not the media url', async () => {
    expect((await moderateUpload('https://x/faggot.jpg', 'lovely sunset')).passed).toBe(true);
    expect((await moderateUpload('https://x/clean.jpg', 'you faggot')).passed).toBe(false);
    expect((await moderateUpload('https://x/clean.jpg', null)).passed).toBe(true);
  });
});

describe('moderateImage', () => {
  it('always passes (Flux has its own NSFW filter)', async () => {
    expect((await moderateImage('https://x/anything.jpg')).passed).toBe(true);
  });
});

describe('isModerationError', () => {
  it('detects the server trigger error from various shapes', () => {
    expect(isModerationError({ message: 'moderation_blocked' })).toBe(true);
    expect(isModerationError(new Error('moderation_blocked'))).toBe(true);
    expect(isModerationError('moderation_blocked: comment')).toBe(true);
    expect(isModerationError({ message: 'duplicate key value' })).toBe(false);
    expect(isModerationError(null)).toBe(false);
    expect(isModerationError(undefined)).toBe(false);
  });

  it('exports the user-facing copy', () => {
    expect(MODERATION_BLOCKED_MESSAGE).toMatch(/don't allow/i);
  });
});
