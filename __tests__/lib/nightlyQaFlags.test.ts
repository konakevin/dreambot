/** parseQaFlags — byte-for-byte the coercions that were inline in nightly-dreams (refactor §11.1). */
import { parseQaFlags } from '@engine/nightlyQaFlags';

describe('parseQaFlags', () => {
  it('empty body → every flag at its documented default', () => {
    const f = parseQaFlags({});
    expect(f.force_cast_role).toBeUndefined();
    expect(f.force_medium).toBeUndefined();
    expect(f.force_moods).toBeUndefined();
    expect(f.force_awe_beat).toBeUndefined();
    expect(f.force_season_month).toBeUndefined();
    expect(f.force_solo_comp).toBeNull();
    expect(f.force_action).toBeNull();
    expect(f.force_scene_category).toBeNull();
    expect(f.force_holiday_scene).toBeNull();
    expect(f.force_hero_register).toBeNull();
    expect(f.persist).toBe(true);
    expect(f.queueJobId).toBeNull();
    for (const k of [
      'isFirstDream',
      'force_face_swap_eligible_raw',
      'force_face_swap_eligible',
      'force_playful',
      'force_elegant',
      'force_active',
      'force_single_active',
      'force_active_pose',
      'force_location_action',
      'force_scene_action',
      'force_dual_closer',
      'force_action_registers',
      'force_plain_location',
      'force_single_playful',
      'force_single_elegant',
      'force_pure_scene',
      'dry_run',
      'strict_face_swap',
    ] as const) {
      expect({ k, v: f[k] }).toEqual({ k, v: false });
    }
  });
  it('force_cast_role preserves an explicit null (scene-only) and stays undefined when absent', () => {
    expect(parseQaFlags({ force_cast_role: null }).force_cast_role).toBeNull();
    expect(parseQaFlags({ force_cast_role: 'dual' }).force_cast_role).toBe('dual');
    expect(parseQaFlags({}).force_cast_role).toBeUndefined();
  });
  it('empty strings collapse to undefined for the `|| undefined` flags', () => {
    const f = parseQaFlags({
      force_medium: '',
      force_vibe: '',
      force_model: '',
      force_place: '',
      force_nightly_path: '',
    });
    expect(f.force_medium).toBeUndefined();
    expect(f.force_vibe).toBeUndefined();
    expect(f.force_model).toBeUndefined();
    expect(f.force_place).toBeUndefined();
    expect(f.force_nightly_path).toBeUndefined();
  });
  it('boolean flags only accept literal true', () => {
    expect(parseQaFlags({ force_playful: 'yes' }).force_playful).toBe(false);
    expect(parseQaFlags({ force_playful: 1 }).force_playful).toBe(false);
    expect(parseQaFlags({ force_playful: true }).force_playful).toBe(true);
  });
  it('force_awe_beat: string → that beat, true → roll on, else undefined', () => {
    expect(parseQaFlags({ force_awe_beat: 'a beat' }).force_awe_beat).toBe('a beat');
    expect(parseQaFlags({ force_awe_beat: true }).force_awe_beat).toBe(true);
    expect(parseQaFlags({ force_awe_beat: false }).force_awe_beat).toBeUndefined();
  });
  it('force_season_month: 1-12 floored, out of range → undefined', () => {
    expect(parseQaFlags({ force_season_month: 10.7 }).force_season_month).toBe(10);
    expect(parseQaFlags({ force_season_month: 0 }).force_season_month).toBeUndefined();
    expect(parseQaFlags({ force_season_month: 13 }).force_season_month).toBeUndefined();
    expect(parseQaFlags({ force_season_month: '5' }).force_season_month).toBeUndefined();
  });
  it('force_solo_comp / force_hero_register are strict enums', () => {
    expect(parseQaFlags({ force_solo_comp: 'enviro_wide' }).force_solo_comp).toBe('enviro_wide');
    expect(parseQaFlags({ force_solo_comp: 'wide' }).force_solo_comp).toBeNull();
    expect(parseQaFlags({ force_hero_register: 'eerie' }).force_hero_register).toBe('eerie');
    expect(parseQaFlags({ force_hero_register: 'spooky' }).force_hero_register).toBeNull();
  });
  it('a forced scenario category implies a face-swap-eligible cast render', () => {
    expect(parseQaFlags({ force_scene_category: 'victorian' }).force_face_swap_eligible).toBe(true);
    expect(parseQaFlags({ force_scene_category: 'victorian' }).force_face_swap_eligible_raw).toBe(
      false
    );
    expect(parseQaFlags({ force_face_swap_eligible: true }).force_face_swap_eligible).toBe(true);
  });
  it('persist is true unless explicitly false; queue_job_id empty → null', () => {
    expect(parseQaFlags({ persist: false }).persist).toBe(false);
    expect(parseQaFlags({ persist: 'no' }).persist).toBe(true);
    expect(parseQaFlags({ queue_job_id: '' }).queueJobId).toBeNull();
    expect(parseQaFlags({ queue_job_id: 'abc' }).queueJobId).toBe('abc');
  });
  it('force_moods must be an object; force_female_hair_pct a number', () => {
    expect(parseQaFlags({ force_moods: 'x' }).force_moods).toBeUndefined();
    expect(parseQaFlags({ force_moods: { calm_wild: 1 } }).force_moods).toEqual({ calm_wild: 1 });
    expect(parseQaFlags({ force_female_hair_pct: 50 }).force_female_hair_pct).toBe(50);
    expect(parseQaFlags({ force_female_hair_pct: '50' }).force_female_hair_pct).toBeUndefined();
  });
});
