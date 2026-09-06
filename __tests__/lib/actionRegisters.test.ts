/**
 * actionRegisters.ts — genre action registers. Locks: every entry survives the beat validator for solo AND
 * couple (Sonnet echoes entries verbatim); every Halloween pool, every biome and every alias target has a
 * register (a new pool cannot ship without one); every register offers composed stills (Kevin: "standing in a
 * slight posture is still fine … a nice variety").
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import {
  ACTION_REGISTERS,
  REGISTER_ALIASES,
  getActionRegister,
  sampleRegister,
  KNOWN_SCENARIO_CATEGORIES,
} from '@engine/actionRegisters';
import { validateActionBeat } from '@engine/actionSafety';
import { BIOME_AXES } from '@engine/biomeAxes';
import { HALLOWEEN_POOLS } from '@engine/holidayPools';

const entries: Array<[string, string]> = [];
for (const [key, reg] of Object.entries(ACTION_REGISTERS)) {
  for (const a of reg.actions) entries.push([key, a]);
  for (const s of reg.stills) entries.push([key, s]);
}

describe('action registers — every entry is swap-safe verbatim', () => {
  it.each(entries)('%s: "%s"', (_key, text) => {
    expect(validateActionBeat(text, 1)).toEqual({ ok: true });
    expect(validateActionBeat(text, 2)).toEqual({ ok: true });
  });
});

describe('action registers — coverage parity', () => {
  it('every Halloween pool has a register', () => {
    for (const pool of HALLOWEEN_POOLS) expect(getActionRegister(pool)).not.toBeNull();
  });
  it('every location biome has a register', () => {
    for (const biome of Object.keys(BIOME_AXES)) expect(getActionRegister(biome)).not.toBeNull();
  });
  it('every alias points at a real register', () => {
    for (const [alias, target] of Object.entries(REGISTER_ALIASES)) {
      expect(ACTION_REGISTERS[target]).toBeDefined();
      expect(getActionRegister(alias)).toBe(ACTION_REGISTERS[target]);
    }
  });
  it('the generic seeded kinds and the known scenario categories have registers', () => {
    for (const k of [
      'goofy',
      'elegant',
      'swashbuckler',
      'artifact_hunter',
      'evening_city',
      'gatsby_1920s',
      'modern_blacktie',
      'old_hollywood',
      'regency',
      'renaissance_baroque',
      'romantic_gardens',
      'street_cool',
      'victorian',
      'absurd_everyday',
      'animal_mayhem',
      'fun_activities',
      'party_carnival',
      'time_travel',
      'gardens_f',
      'gatsby_m',
      'modern_f',
      'victorian_m',
      'dapper_m',
      'cute_chic_f',
      'princess_f',
      'decade_eras',
      'adorable_swarm',
      'girly_fun',
      'guy_fun',
    ])
      expect(getActionRegister(k)).not.toBeNull();
  });
  it('every known scenario category (2026-09-06 DB tally) resolves to a register', () => {
    for (const c of KNOWN_SCENARIO_CATEGORIES)
      expect({ c, ok: getActionRegister(c) !== null }).toEqual({ c, ok: true });
  });
  it('every register has ≥ 6 actions and ≥ 2 composed stills', () => {
    for (const [key, reg] of Object.entries(ACTION_REGISTERS)) {
      expect({ key, actions: reg.actions.length >= 6 }).toEqual({ key, actions: true });
      expect({ key, stills: reg.stills.length >= 2 }).toEqual({ key, stills: true });
    }
  });
  it('unknown key → null (caller falls back to generic exemplars)', () => {
    expect(getActionRegister('no_such_pool')).toBeNull();
    expect(getActionRegister(null)).toBeNull();
  });
});

describe('sampleRegister', () => {
  it('returns a handful mixing actions and stills, all from the register', () => {
    const reg = ACTION_REGISTERS.witch_cottage;
    const out = sampleRegister(reg, 6, () => 0.42);
    expect(out.length).toBe(6);
    expect(out.filter((x) => reg.stills.includes(x)).length).toBe(2);
    for (const x of out) expect([...reg.actions, ...reg.stills]).toContain(x);
  });
});
