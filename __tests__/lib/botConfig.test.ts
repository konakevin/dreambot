/**
 * Unit tests for the bot_config overlay (scripts/lib/botConfig.js) — Phase 5 of
 * the admin-config plan. Verifies DB dials override code config where set, NULLs
 * leave code untouched, and a missing row is a no-op.
 */

const { applyBotConfigOverlay, _resetBotConfigCache } = require('../../scripts/lib/botConfig');

type Row = Record<string, unknown> | null;
function mockSb(row: Row) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: row, error: null }),
        }),
      }),
    }),
  };
}

const baseBot = () => ({
  username: 'dinobot',
  allowedModels: ['black-forest-labs/flux-dev'],
  mediums: ['render'],
  vibes: ['cinematic'],
  chaos: { allowSubjectChaosPaths: ['x'] },
  twoPassPolish: { enabled: true, polishedWords: '65-90' },
});

describe('applyBotConfigOverlay', () => {
  beforeEach(() => _resetBotConfigCache());

  it('no row → returns the same bot object (no-op)', async () => {
    const bot = baseBot();
    const out = await applyBotConfigOverlay(mockSb(null), bot);
    expect(out).toBe(bot);
  });

  it('overrides arrays where set; NULL columns leave code values', async () => {
    const bot = baseBot();
    const out = await applyBotConfigOverlay(
      mockSb({ allowed_models: ['openai/gpt-image-2'], mediums: null, vibes: ['dark'] }),
      bot
    );
    expect(out.allowedModels).toEqual(['openai/gpt-image-2']);
    expect(out.mediums).toEqual(['render']); // null → unchanged
    expect(out.vibes).toEqual(['dark']);
    expect(out).not.toBe(bot); // a copy, original untouched
    expect(bot.allowedModels).toEqual(['black-forest-labs/flux-dev']);
  });

  it('chaos_enabled=false disables chaos; polish toggle preserves other keys', async () => {
    const out = await applyBotConfigOverlay(
      mockSb({ chaos_enabled: false, two_pass_polish_enabled: false }),
      baseBot()
    );
    expect(out.chaos).toBeNull();
    expect(out.twoPassPolish.enabled).toBe(false);
    expect(out.twoPassPolish.polishedWords).toBe('65-90'); // preserved
  });

  it('chaos_enabled true/undefined leaves the code chaos config intact', async () => {
    const out = await applyBotConfigOverlay(mockSb({ vibes: ['epic'] }), baseBot());
    expect(out.chaos).toEqual({ allowSubjectChaosPaths: ['x'] });
    expect(out.twoPassPolish.enabled).toBe(true);
  });
});
