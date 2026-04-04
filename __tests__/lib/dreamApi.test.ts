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

// ── Style ref & path isolation tests ──────────────────────────────────────

import { generateFromVibeProfile } from '@/lib/dreamApi';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';

describe('generateFromVibeProfile', () => {
  beforeEach(() => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });
  });

  it('sends vibe_profile without hint by default', async () => {
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE);
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.mode).toBe('flux-dev');
    expect(body.vibe_profile).toEqual(DEFAULT_VIBE_PROFILE);
    expect(body.hint).toBeUndefined();
    expect(body.prompt_mode).toBeUndefined();
  });

  it('passes promptMode when provided', async () => {
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE, { promptMode: 'chaos' });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.prompt_mode).toBe('chaos');
  });

  it('passes style hint for Dream Like This', async () => {
    const hint = 'STYLE TO COPY: "pixel art, retro game aesthetic"';
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE, { hint });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.hint).toBe(hint);
  });

  it('passes both promptMode and hint together', async () => {
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE, {
      promptMode: 'minimal_mood',
      hint: 'STYLE TO COPY: "watercolor"',
    });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.prompt_mode).toBe('minimal_mood');
    expect(body.hint).toBe('STYLE TO COPY: "watercolor"');
  });
});

describe('path isolation — no hint leakage between dream types', () => {
  beforeEach(() => {
    mockInvoke.mockResolvedValue({
      data: { image_url: 'url', prompt_used: 'p' },
      error: null,
    });
  });

  it('Normal dream (Dream Me): no hint, no prompt_mode override', async () => {
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE);
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.hint).toBeUndefined();
    expect(body.prompt).toBeUndefined();
    expect(body.vibe_profile).toBeDefined();
  });

  it('Custom prompt: goes through rawPrompt path, no vibe_profile or hint', async () => {
    await generateDream({ mode: 'flux-dev', prompt: 'a blue cat in space' });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.prompt).toBe('a blue cat in space');
    expect(body.vibe_profile).toBeUndefined();
    expect(body.hint).toBeUndefined();
    expect(body.prompt_mode).toBeUndefined();
  });

  it('Photo dream (no style ref): input_image set, no hint', async () => {
    await generateDream({
      mode: 'flux-kontext',
      vibe_profile: DEFAULT_VIBE_PROFILE,
      input_image: 'data:image/jpeg;base64,abc',
    });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.input_image).toBe('data:image/jpeg;base64,abc');
    expect(body.hint).toBeUndefined();
    expect(body.vibe_profile).toBeDefined();
  });

  it('Photo dream (with style ref): input_image + hint both set', async () => {
    const hint = 'STYLE TO COPY: "black and white pencil sketch"';
    await generateDream({
      mode: 'flux-kontext',
      vibe_profile: DEFAULT_VIBE_PROFILE,
      input_image: 'data:image/jpeg;base64,abc',
      hint,
    });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.input_image).toBe('data:image/jpeg;base64,abc');
    expect(body.hint).toBe(hint);
    expect(body.vibe_profile).toBeDefined();
  });

  it('Dream Like This (no photo): hint set, no input_image', async () => {
    const hint = 'STYLE TO COPY: "anime watercolor"';
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE, { hint });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.hint).toBe(hint);
    expect(body.input_image).toBeUndefined();
  });

  it('Twin dream: uses rawPrompt path with persist=true, no hint', async () => {
    await generateTwin('the original prompt text');
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.prompt).toBe('the original prompt text');
    expect(body.persist).toBe(true);
    expect(body.hint).toBeUndefined();
    expect(body.vibe_profile).toBeUndefined();
  });

  it('hint does NOT leak between sequential calls', async () => {
    // Call 1: with style hint
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE, {
      hint: 'STYLE TO COPY: "pixel art"',
    });
    expect(mockInvoke.mock.calls[0][1].body.hint).toBe('STYLE TO COPY: "pixel art"');

    // Call 2: normal dream, no hint
    await generateFromVibeProfile(DEFAULT_VIBE_PROFILE);
    expect(mockInvoke.mock.calls[1][1].body.hint).toBeUndefined();

    // Call 3: custom prompt
    await generateDream({ mode: 'flux-dev', prompt: 'just a cat' });
    expect(mockInvoke.mock.calls[2][1].body.hint).toBeUndefined();
    expect(mockInvoke.mock.calls[2][1].body.vibe_profile).toBeUndefined();
  });

  it('recipe path passes hint when provided', async () => {
    await generateFromRecipe(DEFAULT_RECIPE, { hint: 'STYLE TO COPY: "oil painting"' });
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.recipe).toBeDefined();
    expect(body.hint).toBe('STYLE TO COPY: "oil painting"');
  });

  it('recipe path has no hint by default', async () => {
    await generateFromRecipe(DEFAULT_RECIPE);
    const body = mockInvoke.mock.calls[0][1].body;
    expect(body.hint).toBeUndefined();
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
