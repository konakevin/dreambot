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
  it('self + plus_one (both with storage_path) → dual, self, scene', () => {
    expect(names([withPath('self'), withPath('plus_one')])).toEqual(['dual', 'self', 'scene']);
  });

  it('self only → self, scene', () => {
    expect(names([withPath('self')])).toEqual(['self', 'scene']);
  });

  it('plus_one only → plus_one, scene', () => {
    expect(names([withPath('plus_one')])).toEqual(['plus_one', 'scene']);
  });

  it('pet only → pet, scene', () => {
    expect(names([withPath('pet')])).toEqual(['pet', 'scene']);
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
    expect(names([withHttp('self'), withHttp('plus_one')])).toEqual(['dual', 'self', 'scene']);
  });

  it('one usable + one not → degrades to the single usable member', () => {
    expect(names([withPath('self'), { role: 'plus_one' }])).toEqual(['self', 'scene']);
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
