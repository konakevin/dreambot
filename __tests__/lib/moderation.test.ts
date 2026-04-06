/**
 * Tests for the moderation client — verifies it correctly calls the Edge Function.
 */

const mockInvoke = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      get invoke() {
        return mockInvoke;
      },
    },
  },
}));

import { moderateImage, moderateText, moderateUpload } from '@/lib/moderation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('moderateImage', () => {
  it('calls Edge Function with image type', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateImage('https://example.com/photo.jpg');

    expect(mockInvoke).toHaveBeenCalledWith('moderate-content', {
      body: { type: 'image', image_url: 'https://example.com/photo.jpg' },
    });
    expect(result.passed).toBe(true);
  });

  it('returns failed when Edge Function reports failure', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: false, reason: 'Content flagged: nudity' },
      error: null,
    });

    const result = await moderateImage('https://example.com/nsfw.jpg');
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('Content flagged: nudity');
  });

  it('handles Edge Function errors gracefully', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: 'Function timeout' },
    });

    const result = await moderateImage('https://example.com/photo.jpg');
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('Unable to verify');
  });
});

describe('moderateText', () => {
  it('calls Edge Function with text type', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateText('hello world');

    expect(mockInvoke).toHaveBeenCalledWith('moderate-content', {
      body: { type: 'text', text: 'hello world' },
    });
    expect(result.passed).toBe(true);
  });

  it('skips empty text', async () => {
    const result = await moderateText('');
    expect(result.passed).toBe(true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('skips whitespace-only text', async () => {
    const result = await moderateText('   ');
    expect(result.passed).toBe(true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

describe('moderateUpload', () => {
  it('calls Edge Function with upload type combining media + caption', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    await moderateUpload('https://example.com/photo.jpg', 'nice photo');

    expect(mockInvoke).toHaveBeenCalledWith('moderate-content', {
      body: {
        type: 'upload',
        media_url: 'https://example.com/photo.jpg',
        caption: 'nice photo',
      },
    });
  });

  it('handles null caption', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    await moderateUpload('https://example.com/photo.jpg', null);

    expect(mockInvoke).toHaveBeenCalledWith('moderate-content', {
      body: expect.objectContaining({ caption: null }),
    });
  });
});
