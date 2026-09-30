// Locks SCENARIO SCOPE (mig 591, Kevin 2026-09-30): a shared goofy/elegant/active scenario reaches only a dreamer who
// picked a place it is tagged with. Untagged rows reach nobody, and a kind with too few matches gets no share.
import * as fs from 'fs';
import * as path from 'path';
import {
  cardScenarios,
  MIN_SCOPED_POOL,
  placeScope,
  scopeScenarios,
  scopedPct,
} from '@engine/scenarioScope';
import { scopeSinglePools, singleScenarioCandidates } from '@engine/pools/singleScenarioLoader';
import { adaptiveScenePcts, sceneTypeCuts, rollSceneType } from '@engine/sceneTypeRoll';

const CATS = new Map<string, string | null>([
  ['santorini', 'coastal_escapes'],
  ['amalfi coast', 'coastal_escapes'],
  ['tokyo', 'iconic_cities'],
  ['paris', 'iconic_cities'],
  ['dragons keep', 'high_fantasy'],
]);

const row = (scene: string, keys: string[] | null, cats: string[] | null = null) => ({
  scene,
  attire: 'x',
  locationKeys: keys,
  locationCategories: cats,
});

describe('scopeScenarios', () => {
  const rows = [
    row('santorini infinity pool', ['santorini']),
    row('generic neon crosswalk', null, ['iconic_cities']),
    row('dragon rider', ['dragons keep']),
    row('carnival midway', null),
    row('empty tags', [], []),
  ];

  it('keeps rows tagged with a chosen card, or with the category of a chosen card', () => {
    const scope = placeScope(['santorini', 'paris'], CATS);
    expect(scopeScenarios(rows, scope).map((r) => r.scene)).toEqual([
      'santorini infinity pool',
      'generic neon crosswalk', // paris → iconic_cities
    ]);
  });

  it('never passes an untagged row, and fails CLOSED: no picks, no scenarios', () => {
    expect(scopeScenarios(rows, placeScope([], CATS))).toEqual([]);
    expect(scopeScenarios(rows, placeScope(['dragons keep'], CATS)).map((r) => r.scene)).toEqual([
      'dragon rider',
    ]);
  });

  it('a card with no known category contributes only its own key', () => {
    const scope = placeScope(['mystery card'], CATS);
    expect(scope.categories.size).toBe(0);
    expect(scopeScenarios([row('m', ['mystery card'])], scope)).toHaveLength(1);
  });
});

describe('scopedPct + the roll', () => {
  it('a kind needs MIN_SCOPED_POOL matches to keep its share', () => {
    expect(MIN_SCOPED_POOL).toBe(10);
    expect(scopedPct(6, 9)).toBe(0);
    expect(scopedPct(6, 10)).toBe(6);
  });

  it("with no matches anywhere, every non-holiday roll lands on the dreamer's own place", () => {
    const pcts = adaptiveScenePcts(
      { goofy: scopedPct(6, 0), elegant: scopedPct(6, 3), active: scopedPct(8, 0) },
      1 // even a one-pick dreamer, whose scenario window is normally 80%
    );
    const cuts = sceneTypeCuts(pcts, { activeEnabled: false, holidayPct: 0 });
    for (const r of [0, 0.25, 0.5, 0.79, 0.99]) expect(rollSceneType(cuts, r)).toBe('plain');
  });

  it('holidays are untouched by the scope (their share is carved off first)', () => {
    const cuts = sceneTypeCuts({ goofy: 0, elegant: 0, active: 0 }, { holidayPct: 50 });
    expect(rollSceneType(cuts, 0.2)).toBe('holiday');
    expect(rollSceneType(cuts, 0.7)).toBe('plain');
  });
});

describe('scopeSinglePools', () => {
  it('scopes every gender list, so candidates are any ∪ own gender of the matching rows', () => {
    const loaded = {
      goofy: {
        any: [row('a-tokyo', ['tokyo']), row('a-none', null)],
        male: [row('m-paris', ['paris'])],
        female: [row('f-santorini', ['santorini'])],
      },
      elegant: { any: [], male: [], female: [] },
      active: { any: [], male: [], female: [] },
    };
    const scoped = scopeSinglePools(loaded, placeScope(['tokyo', 'santorini'], CATS));
    expect(singleScenarioCandidates(scoped, 'goofy', 'female').map((r) => r.scene)).toEqual([
      'a-tokyo',
      'f-santorini',
    ]);
    // paris is not picked, but tokyo's category (iconic_cities) is: a paris-tagged row stays out (keys only).
    expect(singleScenarioCandidates(scoped, 'goofy', 'male').map((r) => r.scene)).toEqual([
      'a-tokyo',
    ]);
  });
});

describe('nightly-dreams wiring', () => {
  const SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
    'utf8'
  );
  it('both rolls read the switch (QA can force it), and scope BEFORE the adaptive share', () => {
    expect(
      SRC.match(/force_scenario_scope \?\? splitCfg\.nightlyScenariosLocationScoped/g)
    ).toHaveLength(2);
    expect(SRC).toMatch(/scopedPct\(dualBasePcts\.goofy, pools\.goofy\.length\)/);
    expect(SRC).toMatch(/scopedPct\(soloBasePcts\.goofy, soloMatches\.goofy\)/);
  });
  it('the scope is built from the places the dreamer CHOSE, before the zero-pick backup', () => {
    const scopeAt = SRC.indexOf('const scenarioPlaceScope = placeScope(');
    const backupAt = SRC.indexOf('if (placePool.length === 0 && includeLocation && !force_place)');
    expect(scopeAt).toBeGreaterThan(0);
    expect(backupAt).toBeGreaterThan(scopeAt);
  });
});

describe('cardScenarios (scenario cards, mig 594)', () => {
  it('collects every row of any kind tagged with the card, with its kind', () => {
    const pools = {
      goofy: [row('duck', ['just for fun']), row('paris picnic', ['paris', 'just for fun'])],
      elegant: [row('gala', ['stage and spotlight'])],
      active: [row('go-karts', ['just for fun']), row('untagged', null)],
    };
    expect(cardScenarios(pools, 'just for fun').map((c) => `${c.kind}:${c.row.scene}`)).toEqual([
      'goofy:duck',
      'goofy:paris picnic',
      'active:go-karts',
    ]);
    expect(cardScenarios(pools, 'nothing here')).toEqual([]);
  });
});

describe('nightly-dreams scenario-card wiring', () => {
  const SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
    'utf8'
  );
  it('a scenario card never gets an essence card, and too few scenarios re-rolls to a real place', () => {
    expect(SRC).toMatch(/userPlace && !scenarioCardPlace \? await fetchLocationCard\(userPlace\)/);
    expect(SRC).toMatch(/scenarioCardCands\.length < MIN_SCOPED_POOL/);
    expect(SRC).toMatch(/scenario_card_replaced:/);
  });
  it('draws on the "stay at the place" outcome of both rolls, and for a forced first-dream place', () => {
    expect(
      SRC.match(
        /\} else if \(scenarioCardPlace\) \{\s*\/\/[^\n]*\n\s*await applyScenarioCard\(\);/g
      )
    ).toHaveLength(2);
    expect(SRC).toMatch(/if \(force_place && scenarioCardPlace\) await applyScenarioCard\(\);/);
  });
  it('a couple never lands on a couples_ok = false card (Surreal Dreams), and that runs before the scenario-card step', () => {
    const coupleAt = SRC.indexOf(
      'if (isDualFaceSwap && userPlace && noCoupleCards.has(userPlace))'
    );
    const cardAt = SRC.indexOf('let scenarioCardCands:');
    expect(coupleAt).toBeGreaterThan(0);
    expect(cardAt).toBeGreaterThan(coupleAt);
    expect(SRC).toMatch(/couple_place_replaced:/);
    expect(SRC).toMatch(
      /\.select\('name, picker_category, content_kind, couples_ok, outfit_mix'\)/
    );
  });
  it('the zero-pick catalogue fallback never hands out a scenario card as a place', () => {
    expect(SRC).toMatch(/\.eq\('admin_only', false\)\s*\.eq\('content_kind', 'place'\);/);
  });
});
