/**
 * Locks buildFirstDreamTiers (supabase/functions/_shared/firstDreamTiers.ts) —
 * the SERVER source of truth for whether the onboarding first dream gets a
 * face-swap cascade or falls back to scene-only.
 *
 * This is the invariant the whole "faceless first dream" saga turned on: a cast
 * member is only face-swappable if it carries a usable storage_path (or legacy
 * http thumb_url). If enqueue ever hands this an empty / photoless cast, the user
 * gets a scene-only dream — so the cascade shape per cast must not drift.
 */

import { buildFirstDreamTiers, type CastMemberLike } from '@engine/firstDreamTiers';

const withPath = (role: string): CastMemberLike => ({
  role,
  storage_path: `u/cast-${role}.jpg`,
});
const withHttp = (role: string): CastMemberLike => ({
  role,
  thumb_url: 'https://example.com/x.jpg',
});
const names = (cast: CastMemberLike[], place?: string) =>
  buildFirstDreamTiers(cast, place).map((t) => t.name);

describe('buildFirstDreamTiers — cascade shape by cast', () => {
  it('self + plus_one (both with storage_path) → dual, self, self_retry, scene', () => {
    // One couple attempt, then TWO self attempts before the faceless scene fallback
    // (a solo swap can miss a given composition; landing the user's face beats scene).
    expect(names([withPath('self'), withPath('plus_one')])).toEqual([
      'dual',
      'self',
      'self_retry',
      'scene',
    ]);
  });

  it('self only → self, self_retry, scene', () => {
    expect(names([withPath('self')])).toEqual(['self', 'self_retry', 'scene']);
  });

  it('plus_one only → plus_one, plus_one_retry, scene', () => {
    expect(names([withPath('plus_one')])).toEqual(['plus_one', 'plus_one_retry', 'scene']);
  });

  it('pet only → pet, pet_retry, scene', () => {
    expect(names([withPath('pet')])).toEqual(['pet', 'pet_retry', 'scene']);
  });

  it('EMPTY cast → scene only (intended — no cast uploaded)', () => {
    expect(names([])).toEqual(['scene']);
  });

  it('REGRESSION: members with NO usable source → scene only (no face swap)', () => {
    // The exact failure mode: cast present but photos not landed (no storage_path,
    // no http thumb_url). Must NOT produce a face-swap tier.
    expect(names([{ role: 'self' }, { role: 'plus_one' }])).toEqual(['scene']);
    // A local file:// URI is not fetchable server-side → not usable either.
    expect(names([{ role: 'self', thumb_url: 'file:///tmp/x.jpg' }])).toEqual(['scene']);
  });

  it('legacy public http thumb_url counts as usable', () => {
    expect(names([withHttp('self'), withHttp('plus_one')])).toEqual([
      'dual',
      'self',
      'self_retry',
      'scene',
    ]);
  });

  it('one usable + one not → degrades to the single usable member (with its retry)', () => {
    expect(names([withPath('self'), { role: 'plus_one' }])).toEqual([
      'self',
      'self_retry',
      'scene',
    ]);
  });

  it('face-swap tiers carry the face-swap flags; scene tier is force_cast_role:null', () => {
    const tiers = buildFirstDreamTiers([withPath('self'), withPath('plus_one')]);
    for (const t of tiers.filter((x) => x.name !== 'scene')) {
      expect(t.body.force_face_swap_eligible).toBe(true);
      expect(t.body.strict_face_swap).toBe(true);
    }
    const scene = tiers.find((x) => x.name === 'scene');
    expect(scene?.body.force_cast_role).toBeNull();
  });

  it('a provided place is stamped onto EVERY tier as force_place', () => {
    const tiers = buildFirstDreamTiers(
      [withPath('self'), withPath('plus_one')],
      '  Tokyo at night '
    );
    for (const t of tiers) expect(t.body.force_place).toBe('Tokyo at night');
  });

  it('no place → no force_place on any tier', () => {
    const tiers = buildFirstDreamTiers([withPath('self')]);
    for (const t of tiers) expect(t.body.force_place).toBeUndefined();
  });
});

describe('a partner +1 forces the romantic pose pool on the first dream', () => {
  // Kevin 2026-09-15: "if someone chooses a +1 during onboarding and chooses Partner
  // as relationship type, we force a romantic seed pool/pose."
  //
  // Left to the normal roll a couple lands a partner pose only ~13.5% of the time
  // (DUAL_POOL_MIX_LEGACY: 15% playful, 40% dynamic, then 45% classic x 30%
  // partnerShare), so the single most important render a user ever sees would pose
  // them like acquaintances six times out of seven.
  const pair = (relationship?: string): CastMemberLike[] => [
    { role: 'self', storage_path: 'u/self.jpg' },
    { role: 'plus_one', storage_path: 'u/p1.jpg', ...(relationship ? { relationship } : {}) },
  ];
  const dual = (cast: CastMemberLike[]) =>
    buildFirstDreamTiers(cast).find((t) => t.name === 'dual');

  it('forces it for a partner', () => {
    expect(dual(pair('partner'))?.body.force_dual_pool).toBe('partner');
  });

  it('forces it for the legacy significant_other value', () => {
    expect(dual(pair('significant_other'))?.body.force_dual_pool).toBe('partner');
  });

  it('does NOT force it for a friend, who must never draw the romantic pool', () => {
    expect(dual(pair('friend'))?.body.force_dual_pool).toBeUndefined();
  });

  it('does NOT force it when no relationship was set', () => {
    expect(dual(pair())?.body.force_dual_pool).toBeUndefined();
  });

  it('only the DUAL tier is affected — the fallbacks have no couple to pose', () => {
    const tiers = buildFirstDreamTiers(pair('partner'));
    for (const t of tiers.filter((x) => x.name !== 'dual')) {
      expect(t.body.force_dual_pool).toBeUndefined();
    }
  });

  it('leaves the rest of the dual tier body intact', () => {
    const body = dual(pair('partner'))?.body;
    expect(body?.force_cast_role).toBe('dual');
    expect(body?.force_face_swap_eligible).toBe(true);
    expect(body?.strict_face_swap).toBe(true);
  });
});
