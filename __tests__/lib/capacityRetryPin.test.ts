/**
 * CAPACITY-RETRY PIN (NIGHTLY_ROBUSTNESS_PLAN.md, migration 553).
 *
 * A nightly couple sent back to the queue because the swap service was busy used to re-roll the whole dream on the
 * retry, and came back a solo about half the time (seen live 2026-09-23: couple → busy → retry → solo). These tests
 * lock: the pin is parsed strictly, it holds the couple only when the user can still be a couple and nothing explicit
 * decided the cast, it keeps the same +1, recording it never throws, it is NOT a QA flag, and every hop is wired
 * (render catch → queue row → dispatcher → render pre-roll + +1 roll).
 */
import fs from 'fs';
import path from 'path';
import {
  parseCapacityRetryPin,
  pinnedPartner,
  recordCapacityRetryPin,
  shouldHoldCouple,
} from '@engine/capacityRetryPin';
import { isQaRequest } from '@engine/qaRequest';

const ROOT = path.join(__dirname, '..', '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('parseCapacityRetryPin', () => {
  it('reads the couple pin and its partner', () => {
    expect(
      parseCapacityRetryPin({ capacity_retry: { cast_role: 'dual', partner_id: 'p1' } })
    ).toEqual({ castRole: 'dual', partnerId: 'p1' });
    expect(
      parseCapacityRetryPin({ capacity_retry: { cast_role: 'dual', partner_id: null } })
    ).toEqual({ castRole: 'dual', partnerId: null });
  });

  it.each([
    [{}],
    [{ capacity_retry: null }],
    [{ capacity_retry: 'dual' }],
    [{ capacity_retry: { cast_role: 'self' } }],
    [{ capacity_retry: { cast_role: 'plus_one', partner_id: 'p1' } }],
    [null],
  ])('ignores a malformed pin %o', (body) => {
    expect(parseCapacityRetryPin(body)).toBeNull();
  });

  it('is not a QA flag: a pinned retry is still a real user dream', () => {
    expect(
      isQaRequest({ user_id: 'u', queue_job_id: 'j', capacity_retry: { cast_role: 'dual' } })
    ).toBe(false);
  });
});

describe('shouldHoldCouple', () => {
  const pin = { castRole: 'dual' as const, partnerId: null };
  const ok = { hasSelf: true, hasPlusOne: true, forceMedium: false, forceCastRoleSet: false };

  it('holds the couple for a user who can still be one', () => {
    expect(shouldHoldCouple(pin, ok)).toBe(true);
  });

  it.each([
    ['no pin', null, ok],
    ['no self photo any more', pin, { ...ok, hasSelf: false }],
    ['no +1 any more', pin, { ...ok, hasPlusOne: false }],
    ['a QA force_medium decides', pin, { ...ok, forceMedium: true }],
    ['a force_cast_role decides', pin, { ...ok, forceCastRoleSet: true }],
  ])('does not when %s', (_label, p, s) => {
    expect(shouldHoldCouple(p, s)).toBe(false);
  });
});

describe('pinnedPartner', () => {
  const roster = [{ id: 'a' }, { id: 'b' }];
  it('keeps the partner the failed attempt rolled', () => {
    expect(pinnedPartner({ castRole: 'dual', partnerId: 'b' }, roster)).toEqual({ id: 'b' });
  });
  it('falls back to the normal rotation when that partner is no longer enabled, or none was pinned', () => {
    expect(pinnedPartner({ castRole: 'dual', partnerId: 'gone' }, roster)).toBeNull();
    expect(pinnedPartner({ castRole: 'dual', partnerId: null }, roster)).toBeNull();
    expect(pinnedPartner(null, roster)).toBeNull();
  });
});

describe('recordCapacityRetryPin', () => {
  const client = (impl: () => Promise<{ data: unknown; error: { message: string } | null }>) => ({
    rpc: jest.fn(impl),
  });

  it('merges the pin through record_capacity_retry_pin', async () => {
    const c = client(async () => ({ data: true, error: null }));
    expect(await recordCapacityRetryPin(c, 'job-1', 'p1')).toBe(true);
    expect(c.rpc).toHaveBeenCalledWith('record_capacity_retry_pin', {
      p_job_id: 'job-1',
      p_partner_id: 'p1',
    });
  });

  it('never throws: an error, a rejection or no job id all return false', async () => {
    expect(
      await recordCapacityRetryPin(
        client(async () => ({ data: null, error: { message: 'boom' } })),
        'job-1',
        null
      )
    ).toBe(false);
    expect(
      await recordCapacityRetryPin(
        client(async () => {
          throw new Error('network');
        }),
        'job-1',
        null
      )
    ).toBe(false);
    const c = client(async () => ({ data: true, error: null }));
    expect(await recordCapacityRetryPin(c, null, null)).toBe(false);
    expect(c.rpc).not.toHaveBeenCalled();
  });
});

describe('wiring', () => {
  const render = read('supabase/functions/nightly-dreams/index.ts');
  const dispatcher = read('supabase/functions/dream-queue-worker/dispatchers/nightly.ts');
  const migration = read('supabase/migrations/553_capacity_retry_pin.sql');

  it('the failed attempt records the pin with the partner it rolled', () => {
    expect(render).toMatch(
      /if \(capacityRetry\) \{[\s\S]{0,300}recordCapacityRetryPin\(supabase, queueJobId, rolledPartnerId\)/
    );
  });

  it('the dispatcher forwards payload.capacity_retry to the render', () => {
    expect(dispatcher).toContain('...(capacityRetry ? { capacity_retry: capacityRetry } : {}),');
  });

  it('the render keeps the +1 and forces the couple type the day-of way, not via force_cast_role', () => {
    expect(render).toContain('const capacityPin = parseCapacityRetryPin(body);');
    expect(render).toContain('const keptPartner = pinnedPartner(capacityPin, eligiblePartners);');
    const block = render.slice(
      render.indexOf('shouldHoldCouple(capacityPin'),
      render.indexOf("fallbackReasons.push('capacity_retry_pin:couple_held')")
    );
    expect(block).toContain("preRolledType = 'face_swap_dual';");
    expect(block).toContain('mapDreamTypeToInputs(preRolledType, chaosTier, chaosCfg)');
    expect(block).not.toContain('force_cast_role =');
  });

  it('the pin is applied AFTER the day-of pre-roll (so it never undoes it) and before the pure-scene QA flag', () => {
    const dayOf = render.indexOf('holiday_day_of_preroll:${dayOfHoliday.key}:${preRolledType}');
    const pin = render.indexOf('shouldHoldCouple(capacityPin');
    const pure = render.indexOf('if (force_pure_scene) {\n      preRolledComposition');
    expect(dayOf).toBeGreaterThan(0);
    expect(pin).toBeGreaterThan(dayOf);
    expect(pure).toBeGreaterThan(pin);
  });

  it('the migration merges in one statement, only while the job is in_progress, service role only', () => {
    expect(migration).toContain("coalesce(q.payload, '{}'::jsonb)");
    expect(migration).toContain("AND q.status = 'in_progress'");
    expect(migration).toContain(
      'GRANT EXECUTE ON FUNCTION public.record_capacity_retry_pin(uuid, text) TO service_role;'
    );
    expect(migration).toContain(
      'REVOKE ALL ON FUNCTION public.record_capacity_retry_pin(uuid, text) FROM PUBLIC, anon, authenticated;'
    );
  });
});
