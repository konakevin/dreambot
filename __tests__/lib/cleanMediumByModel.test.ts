/**
 * Unit tests for resolveCleanMedium (scripts/lib/cleanMediumByModel.js).
 *
 * Guards the per-model "clean render" routing (bot.cleanMediumByModel) so the
 * model-specific behavior can't silently drift: which models swap to a clean
 * medium, which paths opt out (skipPaths), and which paths get their painterly
 * prefix replaced/dropped (pathPrefix) vs kept.
 *
 * (Distinct from cleanMedium.test.ts, which covers the DLT lib/cleanMedium.ts.)
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveCleanMedium } = require('../../scripts/lib/cleanMediumByModel');

const GPT = 'openai/gpt-image-2';
const BANANA = 'google/gemini-2-image';
const FLUX = 'black-forest-labs/flux-1.1-pro';

// Representative config: gpt-2 + nano-banana both swap to the clean medium;
// dragon-scene drops its painterly prefix; mermaid opts out; cyborg keeps content.
function bot(overrides: Record<string, unknown> = {}) {
  return {
    promptPrefixByPath: {
      'dragon-scene': 'Frazetta + Brom painted oil tradition, DRAGON anatomy lock',
      'cyborg-woman': 'beautiful woman, cybernetic not robotic chassis',
    },
    cleanMediumByModel: {
      [GPT]: {
        medium: 'dragonbot_gpt_clean',
        pathPrefix: { 'dragon-scene': '', 'artsy-girl': '' },
        skipPaths: ['mystical-mermaid'],
      },
      [BANANA]: { medium: 'dragonbot_gpt_clean' },
    },
    ...overrides,
  };
}

describe('resolveCleanMedium — when it applies', () => {
  it('swaps for a keyed model (gpt-image-2); no normal prefix → empty', () => {
    expect(resolveCleanMedium(bot(), GPT, 'landscape')).toEqual({
      medium: 'dragonbot_gpt_clean',
      pathPrefix: '',
    });
  });

  it('swaps for nano-banana too (both models keyed)', () => {
    const r = resolveCleanMedium(bot(), BANANA, 'landscape');
    expect(r).not.toBeNull();
    expect(r.medium).toBe('dragonbot_gpt_clean');
  });

  it('KEEPS the bot path-prefix when there is no per-path override (content locks survive)', () => {
    expect(resolveCleanMedium(bot(), GPT, 'cyborg-woman')).toEqual({
      medium: 'dragonbot_gpt_clean',
      pathPrefix: 'beautiful woman, cybernetic not robotic chassis',
    });
  });
});

describe('resolveCleanMedium — pathPrefix override', () => {
  it("returns '' for a path explicitly overridden to '' (painterly prefix dropped)", () => {
    expect(resolveCleanMedium(bot(), GPT, 'dragon-scene')).toEqual({
      medium: 'dragonbot_gpt_clean',
      pathPrefix: '',
    });
  });

  it('returns the override string when one is provided', () => {
    const b = bot({
      cleanMediumByModel: { [GPT]: { medium: 'm', pathPrefix: { p: 'clean anatomy only' } } },
    });
    expect(resolveCleanMedium(b, GPT, 'p')).toEqual({
      medium: 'm',
      pathPrefix: 'clean anatomy only',
    });
  });
});

describe('resolveCleanMedium — when it does NOT apply', () => {
  it('returns null for a model not keyed (Flux renders normally)', () => {
    expect(resolveCleanMedium(bot(), FLUX, 'landscape')).toBeNull();
  });

  it('returns null when the path is in skipPaths', () => {
    expect(resolveCleanMedium(bot(), GPT, 'mystical-mermaid')).toBeNull();
  });

  it('a skipPath on one model still swaps under a model that does not list it', () => {
    expect(resolveCleanMedium(bot(), BANANA, 'mystical-mermaid')).not.toBeNull();
  });

  it('returns null when the bot has no cleanMediumByModel', () => {
    expect(resolveCleanMedium({ promptPrefixByPath: {} }, GPT, 'landscape')).toBeNull();
  });

  it('returns null when the config entry has no medium', () => {
    expect(
      resolveCleanMedium({ cleanMediumByModel: { [GPT]: { skipPaths: [] } } }, GPT, 'p')
    ).toBeNull();
  });
});

describe('resolveCleanMedium — defensive', () => {
  it('returns null for a null/empty bot', () => {
    expect(resolveCleanMedium(null, GPT, 'p')).toBeNull();
    expect(resolveCleanMedium({}, GPT, 'p')).toBeNull();
  });

  it("defaults pathPrefix to '' when bot has no promptPrefixByPath", () => {
    const b = { cleanMediumByModel: { [GPT]: { medium: 'm' } } };
    expect(resolveCleanMedium(b, GPT, 'whatever')).toEqual({ medium: 'm', pathPrefix: '' });
  });
});
