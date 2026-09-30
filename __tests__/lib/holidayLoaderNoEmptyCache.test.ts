/**
 * A failed holiday-pool read must not be cached (2026-09-29). The loaders cache per isolate; an
 * errored read used to cache an EMPTY pool, so every later nightly in that isolate silently skipped
 * the holiday roll (Fall rolled ~20% live against a configured 50%).
 */
import { loadHolidayDual, loadHolidayScenes } from '@engine/pools/holidayScenarioLoader';

/** Minimal client for the loader's chain: from().select().eq()….order().range().returns(). */
function fakeClient(responses: { data: unknown[] | null; error: unknown }[]) {
  let call = 0;
  const calls = { count: 0 };
  const builder = {
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    range: () => builder,
    returns: () => {
      calls.count += 1;
      const r = responses[Math.min(call, responses.length - 1)];
      call += 1;
      return Promise.resolve(r);
    },
  };
  return { client: { from: () => builder } as never, calls };
}

const ROW = { scene: 'a hayride through a pumpkin patch', attire: 'cozy flannel' };
const FAIL = { data: null, error: { message: 'canceling statement due to statement timeout' } };

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

it('a failed dual-pool read is not cached: the next render reads again and gets the rows', async () => {
  // 3 failed attempts (the loader tries 3 column sets), then success.
  const { client } = fakeClient([FAIL, FAIL, FAIL, { data: [ROW], error: null }]);
  expect(await loadHolidayDual(client, 'fall_test_a')).toEqual([]);
  const second = await loadHolidayDual(client, 'fall_test_a');
  expect(second).toHaveLength(1);
  expect(second[0].scene).toBe(ROW.scene);
});

it('a successful non-empty read is cached (no second query)', async () => {
  const { client, calls } = fakeClient([{ data: [ROW], error: null }]);
  await loadHolidayDual(client, 'fall_test_b');
  const before = calls.count;
  expect(await loadHolidayDual(client, 'fall_test_b')).toHaveLength(1);
  expect(calls.count).toBe(before);
});

it('an empty successful read is not cached either (retried next time)', async () => {
  const { client, calls } = fakeClient([
    { data: [], error: null },
    { data: [ROW], error: null },
  ]);
  expect(await loadHolidayDual(client, 'fall_test_c')).toEqual([]);
  expect(await loadHolidayDual(client, 'fall_test_c')).toHaveLength(1);
  expect(calls.count).toBe(2);
});

it('the scene-only loader behaves the same way', async () => {
  const { client } = fakeClient([
    FAIL,
    FAIL,
    FAIL,
    { data: [{ scene: 'maple leaves over a covered bridge' }], error: null },
  ]);
  expect(await loadHolidayScenes(client, 'fall_test_d')).toEqual([]);
  expect(await loadHolidayScenes(client, 'fall_test_d')).toHaveLength(1);
});
