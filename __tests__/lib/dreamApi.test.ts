/**
 * Tests for the dreamApi client — verifies it correctly calls the Edge Function
 * and handles responses/errors.
 */

const mockUpload = jest.fn().mockResolvedValue({ error: null });
const mockGetPublicUrl = jest.fn().mockReturnValue({
  data: { publicUrl: 'https://storage.example.com/uploads/user1/123.jpg' },
});
const mockStorageFrom = jest.fn().mockReturnValue({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
});
const mockInvoke = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      get invoke() {
        return mockInvoke;
      },
    },
    storage: {
      get from() {
        return mockStorageFrom;
      },
    },
  },
}));

import {
  generateDream,
  generateFromRecipe,
  generateTwin,
  generateFusion,
  persistImage,
} from '@/lib/dreamApi';
import { DEFAULT_RECIPE } from '@/types/recipe';

beforeEach(() => {
  jest.clearAllMocks();
  mockUpload.mockResolvedValue({ error: null });
  mockGetPublicUrl.mockReturnValue({
    data: { publicUrl: 'https://storage.example.com/uploads/user1/123.jpg' },
  });
});

describe('generateDream', () => {
  it('calls Edge Function with correct body', async () => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'https://example.com/dream.jpg', prompt_used: 'test prompt' },
      error: null,
    });

    const result = await generateDream({ mode: 'flux-dev', recipe: DEFAULT_RECIPE });

    expect(mockInvoke).toHaveBeenCalledWith('generate-dream', {
      body: { mode: 'flux-dev', recipe: DEFAULT_RECIPE },
    });
    expect(result.image_url).toBe('https://example.com/dream.jpg');
    expect(result.prompt_used).toBe('test prompt');
  });

  it('throws on Edge Function error', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: 'Server error' },
    });

    await expect(generateDream({ mode: 'flux-dev', recipe: DEFAULT_RECIPE })).rejects.toThrow(
      'Server error'
    );
  });

  it('throws when no image_url in response', async () => {
    mockInvoke.mockResolvedValue({
      data: { error: 'Rate limited' },
      error: null,
    });

    await expect(generateDream({ mode: 'flux-dev', recipe: DEFAULT_RECIPE })).rejects.toThrow(
      'Rate limited'
    );
  });
});

describe('generateFromRecipe', () => {
  it('sends recipe with skip_enhance when requested', async () => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });

    await generateFromRecipe(DEFAULT_RECIPE, { skipEnhance: true });

    expect(mockInvoke).toHaveBeenCalledWith('generate-dream', {
      body: expect.objectContaining({
        mode: 'flux-dev',
        recipe: DEFAULT_RECIPE,
        skip_enhance: true,
      }),
    });
  });

  it('sends hint when provided', async () => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });

    await generateFromRecipe(DEFAULT_RECIPE, { hint: 'a dragon' });

    expect(mockInvoke).toHaveBeenCalledWith('generate-dream', {
      body: expect.objectContaining({ hint: 'a dragon' }),
    });
  });
});

describe('generateTwin', () => {
  it('sends prompt with persist=true (twins cost sparkles)', async () => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });

    await generateTwin('the original prompt');

    expect(mockInvoke).toHaveBeenCalledWith('generate-dream', {
      body: expect.objectContaining({
        mode: 'flux-dev',
        prompt: 'the original prompt',
        persist: true,
      }),
    });
  });
});

describe('generateFusion', () => {
  it('sends merged recipe with epigenetic context and persist=true', async () => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });

    await generateFusion(DEFAULT_RECIPE, 'EPIGENETIC CONTEXT: test');

    expect(mockInvoke).toHaveBeenCalledWith('generate-dream', {
      body: expect.objectContaining({
        mode: 'flux-dev',
        recipe: DEFAULT_RECIPE,
        epigenetic_context: 'EPIGENETIC CONTEXT: test',
        persist: true,
      }),
    });
  });
});

describe('persistImage', () => {
  it('uploads to Supabase Storage and returns public URL', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    }) as jest.Mock;

    const url = await persistImage('https://replicate.temp/image.jpg', 'user1');

    expect(global.fetch).toHaveBeenCalledWith('https://replicate.temp/image.jpg');
    expect(mockStorageFrom).toHaveBeenCalledWith('uploads');
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^user1\/\d+\.jpg$/),
      mockArrayBuffer,
      { contentType: 'image/jpeg' }
    );
    expect(url).toBe('https://storage.example.com/uploads/user1/123.jpg');
  });
});
