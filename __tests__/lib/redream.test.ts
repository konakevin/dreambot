/**
 * "Redream in a new setting" (Kevin 2026-09-18): a nightly re-run pins the source dream's look / vibe / cast role through the
 * render's existing pin inputs WITHOUT becoming QA spend, and never half-applies a malformed request.
 */
import {
  applyRedreamPins,
  castRoleForDreamType,
  castRoleFromAxes,
  castRoleFromSeedSource,
  parseRedreamPins,
  worldFromSeedSource,
  worldPins,
  worldToTransport,
} from '@engine/redream';
import { isQaRequest } from '@engine/qaRequest';

const GOOD = {
  user_id: 'u',
  redream: {
    source_upload_id: 'up-1',
    look_key: 'nightly_hand_drawn_illustration',
    vibe_key: 'opulent__bold',
    cast_role: 'dual',
  },
};

describe('castRoleForDreamType', () => {
  it('maps every nightly dream type to the cast role to pin', () => {
    expect(castRoleForDreamType('face_swap_dual')).toBe('dual');
    expect(castRoleForDreamType('face_swap_self')).toBe('self');
    expect(castRoleForDreamType('face_swap_plus_one')).toBe('plus_one');
    expect(castRoleForDreamType('dream_art_dual')).toBe('dual');
    expect(castRoleForDreamType('pure_scene')).toBeNull();
    expect(castRoleForDreamType('embodied')).toBeNull();
  });
  it('is undefined (engine rolls) when the source is unknown or pruned', () => {
    expect(castRoleForDreamType(undefined)).toBeUndefined();
    expect(castRoleForDreamType('something_new')).toBeUndefined();
  });
});

describe('parseRedreamPins', () => {
  it('reads a well-formed request', () => {
    expect(parseRedreamPins(GOOD)).toEqual({
      sourceUploadId: 'up-1',
      lookKey: 'nightly_hand_drawn_illustration',
      vibeKey: 'opulent__bold',
      castRole: 'dual',
      world: null,
    });
  });
  it('keeps an explicit no-cast (pure scene) and drops an unknown role', () => {
    expect(
      parseRedreamPins({ redream: { ...GOOD.redream, cast_role: null } })?.castRole
    ).toBeNull();
    expect(
      parseRedreamPins({ redream: { ...GOOD.redream, cast_role: 'everyone' } })?.castRole
    ).toBeUndefined();
  });
  it('ignores a malformed request entirely', () => {
    expect(parseRedreamPins({})).toBeNull();
    expect(parseRedreamPins({ redream: 'yes' })).toBeNull();
    expect(parseRedreamPins({ redream: { look_key: 'x' } })).toBeNull();
    expect(parseRedreamPins({ redream: { source_upload_id: 'up', look_key: '' } })).toBeNull();
  });
});

describe('applyRedreamPins', () => {
  it('expresses the pins as the render pin inputs (contract look pin, vibe, cast role)', () => {
    const merged = applyRedreamPins(GOOD);
    expect(merged.qa_pin_look).toBe('nightly_hand_drawn_illustration');
    expect(merged.force_vibe).toBe('opulent__bold');
    expect(merged.force_cast_role).toBe('dual');
  });
  it('omits a pin it does not have rather than forcing a value', () => {
    const merged = applyRedreamPins({
      redream: { source_upload_id: 'up', look_key: 'nightly_canvas', vibe_key: null },
    });
    expect('force_vibe' in merged).toBe(false);
    expect('force_cast_role' in merged).toBe(false);
    expect(merged.qa_pin_look).toBe('nightly_canvas');
  });
  it('leaves a non-redream body untouched', () => {
    const body = { user_id: 'u', persist: true };
    expect(applyRedreamPins(body)).toBe(body);
  });
  it('the RAW body is not QA spend; only the merged pin view carries force_/qa_ keys', () => {
    expect(isQaRequest(GOOD)).toBe(false);
    expect(isQaRequest(applyRedreamPins(GOOD))).toBe(true);
  });
});

describe('the sequel world (same seed pool as the source dream)', () => {
  it('a location dream pins the same location card, never the spot', () => {
    const w = worldFromSeedSource({
      kind: 'location',
      biome: 'wild_west',
      location: 'Main Street facades',
      placeKey: 'Breckenridge',
    });
    expect(w).toEqual({
      kind: 'location',
      placeKey: 'Breckenridge',
      category: null,
      holidayKey: null,
      subTheme: null,
    });
    expect(worldPins(w)).toEqual({ force_place: 'Breckenridge' });
  });
  it('a location dream with no known card pins nothing (the engine rolls)', () => {
    expect(worldFromSeedSource({ kind: 'location', location: 'somewhere' })).toBeNull();
  });
  it('goofy / elegant / active pin the kind (couple AND solo flags) and the scenario category', () => {
    expect(worldPins(worldFromSeedSource({ kind: 'goofy', category: 'time_travel' }))).toEqual({
      force_playful: true,
      force_single_playful: true,
      force_scene_category: 'time_travel',
    });
    expect(worldPins(worldFromSeedSource({ kind: 'elegant', category: 'regency' }))).toEqual({
      force_elegant: true,
      force_single_elegant: true,
      force_scene_category: 'regency',
    });
    expect(worldPins(worldFromSeedSource({ kind: 'active', category: 'cyberpunk' }))).toEqual({
      force_active: true,
      force_single_active: true,
      force_scene_category: 'cyberpunk',
    });
    expect(
      worldPins(worldFromSeedSource({ kind: 'scenario', category: 'superhero' })).force_active
    ).toBe(true);
    expect(worldPins(worldFromSeedSource({ kind: 'active' }))).toEqual({
      force_active: true,
      force_single_active: true,
    });
  });
  it('a holiday dream pins the holiday and, when known, its sub-theme', () => {
    expect(
      worldPins(worldFromSeedSource({ kind: 'holiday:fall', subTheme: 'apple_orchard_afternoon' }))
    ).toEqual({ force_holiday_scene: 'fall', force_holiday_sub_theme: 'apple_orchard_afternoon' });
    expect(worldPins(worldFromSeedSource({ kind: 'holiday:fall' }))).toEqual({
      force_holiday_scene: 'fall',
    });
  });
  it('round-trips through the transport shape and into the merged pin body', () => {
    const world = worldFromSeedSource({ kind: 'elegant', category: 'gatsby_1920s' });
    const body = { redream: { ...GOOD.redream, world: worldToTransport(world) } };
    const merged = applyRedreamPins(body);
    expect(merged.force_elegant).toBe(true);
    expect(merged.force_scene_category).toBe('gatsby_1920s');
    expect(merged.qa_pin_look).toBe('nightly_hand_drawn_illustration');
    expect(isQaRequest(body)).toBe(false);
  });
  it('an unknown or malformed world is ignored', () => {
    expect(worldFromSeedSource(null)).toBeNull();
    expect(worldFromSeedSource({ kind: 'surprise' })).toBeNull();
    expect(worldPins(null)).toEqual({});
    expect(
      applyRedreamPins({ redream: { ...GOOD.redream, world: { kind: 'castle' } } }).force_place
    ).toBeUndefined();
  });
});

describe('castRoleFromAxes (dreamType is null on ~30% of rows)', () => {
  it('prefers dreamType, then isDualFaceSwap, then castRoles', () => {
    expect(castRoleFromAxes({ dreamType: 'face_swap_self', isDualFaceSwap: true })).toBe('self');
    expect(
      castRoleFromAxes({ dreamType: null, isDualFaceSwap: true, castRoles: ['plus_one', 'self'] })
    ).toBe('dual');
    expect(castRoleFromAxes({ isDualFaceSwap: false, castRoles: ['plus_one'] })).toBe('plus_one');
    expect(castRoleFromAxes({ isDualFaceSwap: false, castRoles: ['self'] })).toBe('self');
    expect(castRoleFromAxes({ composition: 'pure_scene' })).toBeNull();
    expect(castRoleFromAxes({})).toBeUndefined();
    expect(castRoleFromAxes(null)).toBeUndefined();
  });
});

describe('castRoleFromSeedSource (the upload keeps the cast role forever)', () => {
  it('reads a recorded role, keeps an explicit no-cast, ignores anything else', () => {
    expect(castRoleFromSeedSource({ kind: 'location', castRole: 'dual' })).toBe('dual');
    expect(castRoleFromSeedSource({ kind: 'location', castRole: 'plus_one' })).toBe('plus_one');
    expect(castRoleFromSeedSource({ kind: 'location', castRole: null })).toBeNull();
    expect(castRoleFromSeedSource({ kind: 'location' })).toBeUndefined();
    expect(castRoleFromSeedSource({ kind: 'location', castRole: 'everyone' })).toBeUndefined();
    expect(castRoleFromSeedSource(null)).toBeUndefined();
  });
});
