/**
 * RELATIONSHIP GATE — friends never draw romance-between-the-pair (mig 518, 2026-09-14).
 *
 * ASYMMETRIC BY DESIGN (Kevin): "it's ok for partners to pose as friends, just not the other way around. in fact,
 * partners SHOULD show both friends and partners poses." So a partner keeps the WHOLE pool and a friend loses only
 * the romantic slice.
 *
 * This layer exists because the prompt cannot do it. The same-day probe ran 4 arms x 3 seeds with a position-1
 * relationship prefix; "TWO FRIENDS" and "PARTNERS" rendered identically, all reading as lovers. Scene CONTENT has
 * to be gated at selection.
 *
 * Scope check: after hand review only 3 of 7,388 dual rows qualified. Regexes alone matched 138 — nearly all
 * false positives (animals "nuzzling", "intimate" BARS, "romantic" GARDEN styles, a centennial anniversary gala,
 * zombie-bride COSTUMES, a movie kiss on a cinema screen). Keep this set tiny and hand-reviewed.
 */
import { scenariosForRelationship } from '@engine/pools/dualScenarioLoader';
import type { DualScenario } from '@engine/pools/dualScenarioLoader';

const open = (scene: string): DualScenario => ({ scene, attire: 'x', relationshipScope: 'any' });
const gated = (scene: string): DualScenario => ({
  scene,
  attire: 'x',
  relationshipScope: 'partner_only',
});
const legacy = (scene: string): DualScenario => ({ scene, attire: 'x' }); // pre-518 row, no column
const POOL = [
  open('a museum'),
  gated('bride and groom'),
  open('a rose garden'),
  gated('two lovers'),
  legacy('a beach'),
];

describe('scenariosForRelationship', () => {
  it('a FRIEND never sees a partner_only scenario', () => {
    const out = scenariosForRelationship(POOL, 'friend');
    expect(out.map((r) => r.scene)).toEqual(['a museum', 'a rose garden', 'a beach']);
    expect(out.some((r) => r.relationshipScope === 'partner_only')).toBe(false);
  });

  it('a PARTNER keeps the WHOLE pool — both registers, nothing removed', () => {
    for (const rel of ['partner', 'significant_other']) {
      expect(scenariosForRelationship(POOL, rel)).toHaveLength(POOL.length);
    }
  });

  it('the gate is one-way: partners get platonic scenes too', () => {
    const partner = scenariosForRelationship(POOL, 'partner');
    expect(partner.some((r) => r.relationshipScope !== 'partner_only')).toBe(true);
  });

  it('unknown or missing relationship is treated as NOT a partner — the safe guess', () => {
    for (const rel of [null, undefined, '', 'sibling', 'best_friend']) {
      const out = scenariosForRelationship(POOL, rel);
      expect(out.some((r) => r.relationshipScope === 'partner_only')).toBe(false);
    }
  });

  it('pre-518 rows with no column are open to everyone', () => {
    expect(scenariosForRelationship([legacy('a beach')], 'friend')).toHaveLength(1);
  });

  it('FAILS OPEN — a filter must never leave a render with no scenario', () => {
    const allGated = [gated('bride and groom'), gated('two lovers')];
    expect(scenariosForRelationship(allGated, 'friend')).toHaveLength(2);
  });

  it('does not mutate the pool it was handed', () => {
    const before = POOL.length;
    scenariosForRelationship(POOL, 'friend');
    expect(POOL).toHaveLength(before);
  });
});
