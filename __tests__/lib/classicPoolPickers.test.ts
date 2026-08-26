/**
 * Step 0 of POSE_POOLS_DB_MIGRATION_PLAN.md — pin the classic pickers'
 * DISTRIBUTION + semantics before the arrays become DB-loadable. These tests
 * are the tripwire: if the loader refactor drifts any pick logic, they fail.
 */
import {
  pickDualAction,
  DUAL_ACTIONS_COMPANION,
  DUAL_ACTIONS_PARTNER,
  DUAL_ACTIONS_PLAYFUL,
  DUAL_ACTIONS_DYNAMIC,
} from '@engine/pools/dual_actions';
import {
  pickSingleAction,
  CANDID_ACTIONS,
  PORTRAIT_ACTIONS,
  DYNAMIC_ACTIONS,
} from '@engine/pools/single_actions';
import { pickSceneCluster, SCENE_CLUSTERS_SPOTS } from '@engine/pools/scene_clusters';

const N = 20000;

describe('pickDualAction distribution (locked)', () => {
  it('non-partner: ~15% playful, ~40% dynamic, ~45% companion', () => {
    let playful = 0;
    let dynamic = 0;
    let companion = 0;
    for (let i = 0; i < N; i++) {
      const a = pickDualAction('friend');
      if (DUAL_ACTIONS_PLAYFUL.includes(a)) playful++;
      else if (DUAL_ACTIONS_DYNAMIC.includes(a)) dynamic++;
      else if (DUAL_ACTIONS_COMPANION.includes(a)) companion++;
    }
    expect(playful / N).toBeGreaterThan(0.12);
    expect(playful / N).toBeLessThan(0.18);
    expect(dynamic / N).toBeGreaterThan(0.37);
    expect(dynamic / N).toBeLessThan(0.43);
    expect((playful + dynamic + companion) / N).toBe(1);
  });

  it('partner: ~15% playful, ~40% dynamic, then 30/70 partner/companion of the rest', () => {
    let playful = 0;
    let dynamic = 0;
    let partner = 0;
    let companion = 0;
    for (let i = 0; i < N; i++) {
      const a = pickDualAction('partner');
      if (DUAL_ACTIONS_PLAYFUL.includes(a)) playful++;
      else if (DUAL_ACTIONS_DYNAMIC.includes(a)) dynamic++;
      else if (DUAL_ACTIONS_PARTNER.includes(a)) partner++;
      else if (DUAL_ACTIONS_COMPANION.includes(a)) companion++;
    }
    expect(playful / N).toBeGreaterThan(0.12);
    expect(playful / N).toBeLessThan(0.18);
    expect(dynamic / N).toBeGreaterThan(0.37);
    expect(dynamic / N).toBeLessThan(0.43);
    const classic = partner + companion;
    expect(partner / classic).toBeGreaterThan(0.26);
    expect(partner / classic).toBeLessThan(0.34);
    expect((playful + dynamic + partner + companion) / N).toBe(1);
  });

  it('forcePool overrides the roll', () => {
    for (let i = 0; i < 50; i++) {
      expect(DUAL_ACTIONS_PARTNER).toContain(pickDualAction('friend', 'partner'));
      expect(DUAL_ACTIONS_PLAYFUL).toContain(pickDualAction('partner', 'playful'));
      expect(DUAL_ACTIONS_DYNAMIC).toContain(pickDualAction('friend', 'dynamic'));
    }
  });
});

describe('pickSingleAction distribution (locked)', () => {
  it('~40% dynamic, ~30% portrait, ~30% candid; only candid ⇒ !needsEpicBackdrop', () => {
    let dynamic = 0;
    let portrait = 0;
    let candid = 0;
    for (let i = 0; i < N; i++) {
      const a = pickSingleAction();
      const isDynamic = DYNAMIC_ACTIONS.includes(a.pose);
      const isPortrait = PORTRAIT_ACTIONS.includes(a.pose);
      const isCandid = CANDID_ACTIONS.includes(a.pose);
      expect(isDynamic || isPortrait || isCandid).toBe(true);
      expect(a.needsEpicBackdrop).toBe(!isCandid);
      if (isDynamic) dynamic++;
      else if (isPortrait) portrait++;
      else candid++;
    }
    expect(dynamic / N).toBeGreaterThan(0.37);
    expect(dynamic / N).toBeLessThan(0.43);
    expect(portrait / N).toBeGreaterThan(0.27);
    expect(portrait / N).toBeLessThan(0.33);
    expect(candid / N).toBeGreaterThan(0.27);
    expect(candid / N).toBeLessThan(0.33);
  });

  it('forcePool works', () => {
    for (let i = 0; i < 50; i++) {
      const c = pickSingleAction('candid');
      expect(CANDID_ACTIONS).toContain(c.pose);
      expect(c.needsEpicBackdrop).toBe(false);
      const p = pickSingleAction('portrait');
      expect(PORTRAIT_ACTIONS).toContain(p.pose);
      expect(p.needsEpicBackdrop).toBe(true);
      const d = pickSingleAction('dynamic');
      expect(DYNAMIC_ACTIONS).toContain(d.pose);
      expect(d.needsEpicBackdrop).toBe(true);
    }
  });
});

describe('pickSceneCluster semantics (locked)', () => {
  it('exact lowercase key match, case-insensitive input', () => {
    const got = pickSceneCluster('HAWAII', 'spot');
    expect(got).not.toBeNull();
    expect(SCENE_CLUSTERS_SPOTS['hawaii']).toContain(got as string);
  });
  it('unknown location → null; undefined → null', () => {
    expect(pickSceneCluster('narnia')).toBeNull();
    expect(pickSceneCluster(undefined)).toBeNull();
  });
});
