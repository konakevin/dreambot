/**
 * Tests for upload moderation flow — verifies images and captions are checked.
 */

const mockInvoke = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      get invoke() {
        return mockInvoke;
      },
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest
          .fn()
          .mockReturnValue({ data: { publicUrl: 'https://example.com/img.jpg' } }),
        remove: jest.fn().mockResolvedValue({ error: null }),
      }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'upload-1' }, error: null }),
    }),
  },
}));

import { moderateImage, moderateText, moderateUpload } from '@/lib/moderation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('upload moderation', () => {
  it('moderateImage calls Edge Function with image type', async () => {
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

  it('moderateImage blocks NSFW content', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: false, reason: 'Content flagged: nudity' },
      error: null,
    });

    const result = await moderateImage('https://example.com/nsfw.jpg');
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('nudity');
  });

  it('moderateUpload checks both media and caption', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateUpload('https://example.com/photo.jpg', 'nice pic');
    expect(mockInvoke).toHaveBeenCalledWith('moderate-content', {
      body: {
        type: 'upload',
        media_url: 'https://example.com/photo.jpg',
        media_type: 'image',
        caption: 'nice pic',
      },
    });
    expect(result.passed).toBe(true);
  });

  it('moderateText blocks hate speech in captions', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: false, reason: 'Content flagged: discriminatory' },
      error: null,
    });

    const result = await moderateText('hateful caption');
    expect(result.passed).toBe(false);
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
