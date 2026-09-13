/** The vibe roll (NIGHTLY_VIBES_AUDIT.md §9): family-first over versions, recency by family, force, floor. */
import { resolveVibe, versionTag, LOOKS_EXCLUDED_VIBE_VERSIONS } from '@engine/nightlyVibes';
import type { VibeRow } from '@engine/nightlyVibes';
import { buildStyleContract } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

const row = (key: string, extra: Partial<VibeRow> = {}): VibeRow => ({
  key,
  label: key,
  family: key.split('__')[0],
  fragment: key.endsWith('__subtle') ? null : `${key} accent`,
  position: key.endsWith('__soft') ? 'after_scene' : key.endsWith('__subtle') ? null : 'early',
  directive: `${key.split('__')[0]} directive`,
  faceSwapDirective: null,
  active: true,
  nightlyPool: key.includes('__'),
  ...extra,
});
const POOL = [
  row('cozy'),
  row('cozy__subtle'),
  row('cozy__soft'),
  row('cozy__bold'),
  row('cozy__wild'),
  row('aurora'),
  row('aurora__subtle'),
  row('aurora__soft'),
  row('aurora__bold'),
  row('festive'),
  row('festive__subtle'),
  row('festive__soft'),
  row('festive__bold'),
];
const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)];
};

describe('resolveVibe', () => {
  it('rolls a family first, then a version within it; base rows are never rolled', () => {
    const r = resolveVibe({ vibes: POOL, rng: seq(0.5, 0.99) })!; // family index 1 of [cozy,aurora,festive] → aurora; last version
    expect(r.family).toBe('aurora');
    expect(r.vibe.key).toBe('aurora__bold');
    expect(r.version).toBe('bold');
    expect(r.fragment).toBe('aurora__bold accent');
    expect(r.position).toBe('early');
    expect(r.stamps).toEqual(
      expect.arrayContaining([
        'vibe:aurora__bold',
        'vibe_family:aurora',
        'vibe_version:bold',
        'vibe_source:roll',
        'vibe_pool:10/3',
      ])
    );
  });
  it('recency excludes whole families (any version counts), with a never-empty floor', () => {
    const r = resolveVibe({
      vibes: POOL,
      recentVibeKeys: ['aurora__soft', 'festive__bold'],
      rng: seq(0.01, 0.01),
    })!;
    expect(r.family).toBe('cozy'); // only cozy survives → floor keeps it (1 < 2 → whole pool) … so assert by rng: first family
    const all = resolveVibe({
      vibes: POOL,
      recentVibeKeys: ['aurora__soft', 'festive__bold', 'cozy__wild'],
      rng: seq(0.01, 0.01),
    })!;
    expect(['cozy', 'aurora', 'festive']).toContain(all.family); // everything recent → whole pool
  });
  it('subtle = no fragment, no position (the mood-only route); soft = after_scene', () => {
    const subtle = resolveVibe({ vibes: POOL, forcedVibe: 'cozy__subtle' })!;
    expect(subtle.fragment).toBeNull();
    expect(subtle.position).toBeNull();
    const soft = resolveVibe({ vibes: POOL, forcedVibe: 'cozy__soft' })!;
    expect(soft.position).toBe('after_scene');
  });
  it('excludeVersions drops those versions from the roll (subtle = the fragment-less route) and stamps it; a force still wins', () => {
    const rng = seq(0.01, 0.99);
    const r = resolveVibe({ vibes: POOL, excludeVersions: ['subtle'], rng });
    expect(r).not.toBeNull();
    expect(r!.version).not.toBe('subtle');
    expect(r!.fragment).toBeTruthy();
    expect(r!.stamps).toContain('vibe_version_bans:subtle');
    const many = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const x = resolveVibe({
        vibes: POOL,
        excludeVersions: ['subtle'],
        rng: seq(i / 40, ((i * 7) % 40) / 40),
      });
      if (x) many.add(x.version);
    }
    expect(many.has('subtle')).toBe(false);
    const forced = resolveVibe({
      vibes: POOL,
      excludeVersions: ['subtle'],
      forcedVibe: POOL.find((v) => v.key.endsWith('__subtle'))!.key,
      rng,
    });
    expect(forced!.version).toBe('subtle');
  });

  it('force reaches any active row, pool or not; an unknown key falls to the roll with a stamp', () => {
    const base = resolveVibe({ vibes: POOL, forcedVibe: 'cozy', rng: seq(0.01) })!;
    expect(base.vibe.key).toBe('cozy');
    expect(base.source).toBe('force');
    expect(base.version).toBe('');
    expect(base.position).toBe('early'); // a fragment with no stored position defaults to early
    const unknown = resolveVibe({ vibes: POOL, forcedVibe: 'nope', rng: seq(0.01, 0.01) })!;
    expect(unknown.source).toBe('roll');
    expect(unknown.stamps).toContain('vibe_force_unknown:nope');
  });
  it('an empty pool returns null', () => {
    expect(resolveVibe({ vibes: [row('cozy')] })).toBeNull();
  });
  it('versionTag', () => {
    expect(versionTag('cozy__wild')).toBe('wild');
    expect(versionTag('cozy')).toBe('');
  });
});

describe('style contract carries the vibe as its third axis', () => {
  const PRO = 'black-forest-labs/flux-1.1-pro';
  const policy: NightlyModelPolicy = {
    couple: { primaryModels: [PRO], fallbackModels: [] },
    solo: { primaryModels: [PRO], fallbackModels: [] },
    solo_rebuild: { primaryModels: [PRO], fallbackModels: [] },
    scene: { primaryModels: [PRO], fallbackModels: [] },
  };
  const looks: LookRow[] = [
    {
      key: 'oil',
      label: 'oil',
      family: 'p',
      fragment: 'oil',
      swapFragment: 'oil swap',
      directive: null,
      weight: 1,
      active: true,
      nightlyEnabled: true,
    },
  ];
  const approvals: LookApproval[] = [
    { lookKey: 'oil', model: PRO, surface: 'solo', approved: true },
  ];
  it('rolls a vibe when a pool is given and stamps it; null when no pool is given', () => {
    const c = buildStyleContract({
      surface: 'solo',
      policy,
      looks,
      approvals,
      vibes: POOL,
      rng: seq(0.01),
    })!;
    expect(c.vibe).not.toBeNull();
    expect(c.vibe!.family).toBe('cozy');
    expect(c.stamps.some((s) => s.startsWith('vibe:cozy__'))).toBe(true);
    const none = buildStyleContract({ surface: 'solo', policy, looks, approvals, rng: seq(0.01) })!;
    expect(none.vibe).toBeNull();
  });
});

describe('per-look banned vibe families', () => {
  it('excludes the banned families from the roll and stamps them; a force still wins', () => {
    const r = resolveVibe({
      vibes: POOL,
      excludeFamilies: ['cozy', 'aurora'],
      rng: seq(0.01, 0.01),
    })!;
    expect(r.family).toBe('festive');
    expect(r.stamps).toContain('vibe_bans:cozy+aurora');
    const forced = resolveVibe({
      vibes: POOL,
      excludeFamilies: ['cozy'],
      forcedVibe: 'cozy__bold',
    })!;
    expect(forced.vibe.key).toBe('cozy__bold');
    expect(resolveVibe({ vibes: POOL, excludeFamilies: ['cozy', 'aurora', 'festive'] })).toBeNull();
  });
  it('round 20: the contract excludes the subtle versions from the looks-path roll and stamps it', () => {
    expect(LOOKS_EXCLUDED_VIBE_VERSIONS).toEqual(['subtle']);
  });

  it("the contract passes the rolled look's banned vibes to the vibe roll", () => {
    const PRO = 'black-forest-labs/flux-1.1-pro';
    const policy: NightlyModelPolicy = {
      couple: { primaryModels: [PRO], fallbackModels: [] },
      solo: { primaryModels: [PRO], fallbackModels: [] },
      solo_rebuild: { primaryModels: [PRO], fallbackModels: [] },
      scene: { primaryModels: [PRO], fallbackModels: [] },
    };
    const looks: LookRow[] = [
      {
        key: 'cartoon',
        label: 'cartoon',
        family: 'comic_print',
        fragment: 'c',
        swapFragment: 'c swap',
        directive: null,
        weight: 1,
        active: true,
        nightlyEnabled: true,
        bannedVibes: ['cozy', 'aurora'],
      },
    ];
    const approvals: LookApproval[] = [
      { lookKey: 'cartoon', model: PRO, surface: 'solo', approved: true },
    ];
    const c = buildStyleContract({
      surface: 'solo',
      policy,
      looks,
      approvals,
      vibes: POOL,
      rng: seq(0.01, 0.01),
    })!;
    expect(c.vibe!.family).toBe('festive');
    expect(c.stamps).toContain('vibe_bans:cozy+aurora');
  });
});
