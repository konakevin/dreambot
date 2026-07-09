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
} from '@engine/pools/dual_actions';
import { pickSingleAction, CANDID_ACTIONS, PORTRAIT_ACTIONS } from '@engine/pools/single_actions';
import { pickSceneCluster, SCENE_CLUSTERS_SPOTS } from '@engine/pools/scene_clusters';

const N = 20000;

describe('pickDualAction distribution (locked)', () => {
  it('non-partner relationship: ~18% playful, remainder companion', () => {
    let playful = 0;
    let companion = 0;
    for (let i = 0; i < N; i++) {
      const a = pickDualAction('friend');
      if (DUAL_ACTIONS_PLAYFUL.includes(a)) playful++;
      else if (DUAL_ACTIONS_COMPANION.includes(a)) companion++;
    }
    expect(playful / N).toBeGreaterThan(0.15);
    expect(playful / N).toBeLessThan(0.21);
    expect((playful + companion) / N).toBe(1);
  });

  it('partner relationship: ~18% playful, then 30/70 partner/companion', () => {
    let playful = 0;
    let partner = 0;
    let companion = 0;
    for (let i = 0; i < N; i++) {
      const a = pickDualAction('partner');
      if (DUAL_ACTIONS_PLAYFUL.includes(a)) playful++;
      else if (DUAL_ACTIONS_PARTNER.includes(a)) partner++;
      else if (DUAL_ACTIONS_COMPANION.includes(a)) companion++;
    }
    expect(playful / N).toBeGreaterThan(0.15);
    expect(playful / N).toBeLessThan(0.21);
    const nonPlayful = partner + companion;
    expect(partner / nonPlayful).toBeGreaterThan(0.26);
    expect(partner / nonPlayful).toBeLessThan(0.34);
    expect((playful + partner + companion) / N).toBe(1);
  });

  it('forcePool overrides the roll', () => {
    for (let i = 0; i < 50; i++) {
      expect(DUAL_ACTIONS_PARTNER).toContain(pickDualAction('friend', 'partner'));
      expect(DUAL_ACTIONS_PLAYFUL).toContain(pickDualAction('partner', 'playful'));
    }
  });
});

describe('pickSingleAction distribution (locked)', () => {
  it('~50/50 candid/portrait; portrait ⇒ needsEpicBackdrop', () => {
    let portrait = 0;
    for (let i = 0; i < N; i++) {
      const a = pickSingleAction();
      const isPortrait = PORTRAIT_ACTIONS.includes(a.pose);
      const isCandid = CANDID_ACTIONS.includes(a.pose);
      expect(isPortrait || isCandid).toBe(true);
      expect(a.needsEpicBackdrop).toBe(isPortrait);
      if (isPortrait) portrait++;
    }
    expect(portrait / N).toBeGreaterThan(0.46);
    expect(portrait / N).toBeLessThan(0.54);
  });

  it('forcePool works', () => {
    for (let i = 0; i < 50; i++) {
      const c = pickSingleAction('candid');
      expect(CANDID_ACTIONS).toContain(c.pose);
      expect(c.needsEpicBackdrop).toBe(false);
      const p = pickSingleAction('portrait');
      expect(PORTRAIT_ACTIONS).toContain(p.pose);
      expect(p.needsEpicBackdrop).toBe(true);
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
