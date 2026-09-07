import { soloRebuildModelFor, FLUX_11_PRO } from '@engine/soloRebuildModel';

const FLEX = 'black-forest-labs/flux-2-flex';
const GEM = 'google/gemini-2-image';

describe('soloRebuildModelFor — the never-faceless second rebuild attempt', () => {
  it('attempt 1 is the configured rebuild model (unchanged behaviour)', () => {
    expect(
      soloRebuildModelFor({ attempt: 1, configuredModel: FLEX, coupleModel: FLUX_11_PRO })
    ).toBe(FLEX);
    expect(
      soloRebuildModelFor({ attempt: 0, configuredModel: FLEX, coupleModel: FLUX_11_PRO })
    ).toBe(FLEX);
  });
  it("attempt 2 switches to the couple's model when it differs (flex → 1.1-pro)", () => {
    expect(
      soloRebuildModelFor({ attempt: 2, configuredModel: FLEX, coupleModel: FLUX_11_PRO })
    ).toBe(FLUX_11_PRO);
  });
  it('attempt 2 uses the first policy fallback when configured == couple model', () => {
    expect(
      soloRebuildModelFor({
        attempt: 2,
        configuredModel: FLUX_11_PRO,
        coupleModel: FLUX_11_PRO,
        fallbacks: [FLUX_11_PRO, GEM],
      })
    ).toBe(GEM);
  });
  it('attempt 2 falls back to flux-1.1-pro when there is no differing fallback, and never returns undefined', () => {
    expect(soloRebuildModelFor({ attempt: 2, configuredModel: FLEX, coupleModel: FLEX })).toBe(
      FLUX_11_PRO
    );
    expect(
      soloRebuildModelFor({
        attempt: 3,
        configuredModel: FLUX_11_PRO,
        coupleModel: FLUX_11_PRO,
        fallbacks: [],
      })
    ).toBe(FLUX_11_PRO);
  });
});
