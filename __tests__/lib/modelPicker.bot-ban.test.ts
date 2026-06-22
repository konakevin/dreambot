/**
 * Regression lock: the BOT model picker (scripts/lib/modelPicker.js) must NEVER
 * return Nano Banana (google/gemini-2-image) or GPT Image 2 (openai/gpt-image-2),
 * even when the DB dream_mediums.allowed_models pool still lists them and the bot
 * supplies no allowedModels whitelist. (Kevin 2026-06-22 — "completely removed
 * from bots".) Guards against the failure where editing bot JS didn't help
 * because the model is drawn from the DB pool.
 */

// Mock the supabase client so refreshCache loads a banned-heavy medium pool
// offline (no network), exercising the medium-pool strip path.
const BANNED_HEAVY_POOL = [
  'google/gemini-2-image',
  'openai/gpt-image-2',
  'black-forest-labs/flux-1.1-pro',
];
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => {
        const data =
          table === 'dream_mediums'
            ? [
                {
                  key: 'photography',
                  allowed_models: BANNED_HEAVY_POOL,
                  is_active: true,
                  is_bot_only: false,
                },
              ]
            : [];
        const result = Promise.resolve({ data, error: null }) as Promise<{
          data: unknown;
          error: null;
        }> & { or?: () => Promise<{ data: unknown; error: null }> };
        result.or = () => Promise.resolve({ data, error: null });
        return result;
      },
    }),
  }),
}));

// getSupabase() throws without a key (would skip the mocked DB path) — set one.
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.EXPO_PUBLIC_SUPABASE_URL = 'http://test.local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  pickModel,
  BOT_BANNED_MODELS,
  _resetCacheForTests,
} = require('../../scripts/lib/modelPicker');

const BANNED = ['google/gemini-2-image', 'google/nano-banana', 'openai/gpt-image-2'];

describe('bot modelPicker — hard ban on Nano Banana + GPT Image 2', () => {
  beforeEach(() => _resetCacheForTests && _resetCacheForTests());

  it('exports the banned set', () => {
    for (const m of BANNED) expect(BOT_BANNED_MODELS.has(m)).toBe(true);
  });

  it('never returns a banned model from a banned-heavy DB pool (empty allowedModels)', async () => {
    for (let i = 0; i < 40; i++) {
      const { model } = await pickModel({
        mediumKey: 'photography',
        vibeKey: 'cinematic',
        allowedModels: [],
      });
      expect(BANNED).not.toContain(model);
    }
  });

  it('strips banned models even when the bot allowedModels lists them', async () => {
    for (let i = 0; i < 20; i++) {
      const { model } = await pickModel({
        mediumKey: 'photography',
        vibeKey: 'cinematic',
        allowedModels: [
          'google/gemini-2-image',
          'openai/gpt-image-2',
          'black-forest-labs/flux-1.1-pro-ultra',
        ],
      });
      expect(model).toBe('black-forest-labs/flux-1.1-pro-ultra');
    }
  });

  it('falls back to a non-banned default when only banned models are available', async () => {
    const { model } = await pickModel({ allowedModels: ['google/gemini-2-image'] });
    expect(BANNED).not.toContain(model);
  });
});
