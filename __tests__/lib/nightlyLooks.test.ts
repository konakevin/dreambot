/**
 * The two-stage nightly look roll (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2): family first with equal shares, then a look
 * inside the family by weight, filtered by the (model × surface) approvals table, with per-user recency and the
 * never-empty floor. Pure resolver, seeded rng.
 */
import { resolveLook, approvedLooks, type LookRow, type LookApproval } from '@engine/nightlyLooks';

const FLUX = 'black-forest-labs/flux-1.1-pro';
const GROK = 'xai/grok-imagine-image';

const look = (key: string, family: string, weight = 1, active = true): LookRow => ({
  key,
  label: key,
  family,
  fragment: `${key} scene`,
  swapFragment: `${key} swap`,
  directive: null,
  weight,
  active,
});
const ok = (
  lookKey: string,
  model: string,
  surface: 'couple' | 'solo',
  approved = true
): LookApproval => ({
  lookKey,
  model,
  surface,
  approved,
});

// Six oil cousins vs one chromolithograph vs one watercolor: equal FAMILY shares, not equal look shares.
const LOOKS = [
  ...['oil1', 'oil2', 'oil3', 'oil4', 'oil5', 'oil6'].map((k) => look(k, 'painted_realism')),
  look('chromo', 'comic_print'),
  look('wc', 'watercolor'),
  look('parked', 'photographic', 1, false),
];
const APPROVALS = [
  ...LOOKS.map((l) => ok(l.key, GROK, 'couple')),
  ...LOOKS.map((l) => ok(l.key, GROK, 'solo')),
  // flux: only the oils pass couples; chromo is solo-only on flux
  ...['oil1', 'oil2'].map((k) => ok(k, FLUX, 'couple')),
  ok('chromo', FLUX, 'couple', false),
  ok('chromo', FLUX, 'solo'),
];

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('approvedLooks — the (model × surface) filter', () => {
  it('returns only active looks approved for exactly that model and surface', () => {
    const fluxCouple = approvedLooks({
      surface: 'couple',
      model: FLUX,
      looks: LOOKS,
      approvals: APPROVALS,
    }).map((l) => l.key);
    expect(fluxCouple.sort()).toEqual(['oil1', 'oil2']);
    const fluxSolo = approvedLooks({
      surface: 'solo',
      model: FLUX,
      looks: LOOKS,
      approvals: APPROVALS,
    }).map((l) => l.key);
    expect(fluxSolo).toEqual(['chromo']);
    const grokCouple = approvedLooks({
      surface: 'couple',
      model: GROK,
      looks: LOOKS,
      approvals: APPROVALS,
    }).map((l) => l.key);
    expect(grokCouple).not.toContain('parked'); // inactive rows never roll even when approved
    expect(grokCouple).toHaveLength(8);
  });
});

describe('resolveLook — family first, then look', () => {
  it('gives each family an equal share regardless of how many looks it holds', () => {
    const rng = seeded(42);
    const counts: Record<string, number> = {};
    for (let i = 0; i < 3000; i++) {
      const r = resolveLook({
        surface: 'couple',
        model: GROK,
        looks: LOOKS,
        approvals: APPROVALS,
        rng,
      });
      counts[r!.family] = (counts[r!.family] ?? 0) + 1;
    }
    // three families → ~1000 each; the six oils together get ~1/3, not 6/8
    for (const f of ['painted_realism', 'comic_print', 'watercolor']) {
      expect(counts[f]).toBeGreaterThan(850);
      expect(counts[f]).toBeLessThan(1150);
    }
  });

  it('honors familyMix shares and look weights inside a family', () => {
    const rng = seeded(7);
    const looks = [
      look('a', 'painted_realism', 3),
      look('b', 'painted_realism', 1),
      look('c', 'watercolor'),
    ];
    const approvals = looks.map((l) => ok(l.key, GROK, 'solo'));
    const counts: Record<string, number> = {};
    for (let i = 0; i < 4000; i++) {
      const r = resolveLook({
        surface: 'solo',
        model: GROK,
        looks,
        approvals,
        familyMix: { painted_realism: 3, watercolor: 1 },
        rng,
      });
      counts[r!.look.key] = (counts[r!.look.key] ?? 0) + 1;
    }
    // watercolor family = 1/4 of rolls; inside painted_realism a:b = 3:1 of the remaining 3/4
    expect(counts.c).toBeGreaterThan(850);
    expect(counts.c).toBeLessThan(1150);
    expect(counts.a / counts.b).toBeGreaterThan(2.4);
    expect(counts.a / counts.b).toBeLessThan(3.6);
  });

  it("avoids the user's recent looks, but never empties a family (repeats beat an empty pool)", () => {
    const rng = seeded(3);
    // wc is the only watercolor; it was rendered recently — the family stays rollable and yields wc again
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const r = resolveLook({
        surface: 'solo',
        model: GROK,
        looks: LOOKS,
        approvals: APPROVALS,
        recentLookKeys: ['wc', 'oil1', 'oil2'],
        rng,
      });
      seen.add(r!.look.key);
    }
    expect(seen.has('wc')).toBe(true); // floor kept the family alive
    expect(seen.has('oil1')).toBe(false); // recency held where the family had other looks
    expect(seen.has('oil2')).toBe(false);
  });

  it('respects the recency window size', () => {
    const rng = seeded(9);
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const r = resolveLook({
        surface: 'solo',
        model: GROK,
        looks: LOOKS,
        approvals: APPROVALS,
        recentLookKeys: ['oil1', 'oil2', 'oil3'],
        recencyWindow: 1,
        rng,
      });
      seen.add(r!.look.key);
    }
    expect(seen.has('oil1')).toBe(false);
    expect(seen.has('oil2')).toBe(true); // outside the window of 1
  });

  it('a look reserved for Create (nightly_enabled = false) never rolls even when approved, but can still be forced', () => {
    const reserved = { ...look('bighead', 'comic_print'), nightlyEnabled: false };
    const looks = [...LOOKS, reserved];
    const approvals = [...APPROVALS, ok('bighead', GROK, 'couple'), ok('bighead', GROK, 'solo')];
    const rng = seeded(11);
    for (let i = 0; i < 300; i++) {
      const r = resolveLook({ surface: 'couple', model: GROK, looks, approvals, rng });
      expect(r!.look.key).not.toBe('bighead');
    }
    const forced = resolveLook({
      surface: 'couple',
      model: GROK,
      looks,
      approvals,
      forcedLook: 'bighead',
      rng,
    });
    expect(forced!.look.key).toBe('bighead');
  });

  it('returns null (never invents a look) when nothing is approved for the model × surface', () => {
    const r = resolveLook({
      surface: 'couple',
      model: 'nobody/model',
      looks: LOOKS,
      approvals: APPROVALS,
      rng: seeded(1),
    });
    expect(r).toBeNull();
  });

  it('force_look short-circuits approvals and stamps the source; an unknown key falls through to the roll', () => {
    const forced = resolveLook({
      surface: 'couple',
      model: FLUX,
      looks: LOOKS,
      approvals: APPROVALS,
      forcedLook: 'chromo',
      rng: seeded(1),
    });
    expect(forced!.look.key).toBe('chromo'); // not approved for flux couples, but forced
    expect(forced!.source).toBe('force');
    expect(forced!.stamps).toContain('look_source:force');
    const unknown = resolveLook({
      surface: 'couple',
      model: FLUX,
      looks: LOOKS,
      approvals: APPROVALS,
      forcedLook: 'nope',
      rng: seeded(1),
    });
    expect(unknown!.source).toBe('roll');
    expect(unknown!.stamps).toContain('look_pin_unknown:nope');
  });

  it('hands the cast surfaces the swap fragment and stamps look + family', () => {
    const r = resolveLook({
      surface: 'solo',
      model: FLUX,
      looks: LOOKS,
      approvals: APPROVALS,
      rng: seeded(5),
    });
    expect(r!.look.key).toBe('chromo');
    expect(r!.fragment).toBe('chromo swap');
    expect(r!.stamps).toEqual(
      expect.arrayContaining(['look:chromo', 'look_family:comic_print', 'look_source:roll'])
    );
  });
});
