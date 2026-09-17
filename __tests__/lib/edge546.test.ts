/**
 * The 546 monitor's evaluation (scripts/lib/edge546.js). A FIXED 3% SLO on WORKER_RESOURCE_LIMIT per
 * function; tiny samples are reported, never alarmed. NO_PIXELS_IN_ISOLATE_PLAN.md §5.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  evaluate,
  formatTable,
  deployClampedStart,
  MAX_546_RATE,
  MIN_REQUESTS,
} = require('../../scripts/lib/edge546');

const FNS = [
  { id: 'a', slug: 'nightly-dreams' },
  { id: 'b', slug: 'generate-dream' },
];

describe('edge546.evaluate', () => {
  it('aggregates per function, names ids, sorts by 546 count', () => {
    const { table } = evaluate(
      [
        { fid: 'a', status: 200, c: 90 },
        { fid: 'a', status: 546, c: 10 },
        { fid: 'b', status: 200, c: 50 },
        { fid: 'zzz', status: 200, c: 5 },
      ],
      FNS
    );
    expect(table.map((e: { name: string }) => e.name)).toEqual([
      'nightly-dreams',
      'generate-dream',
      'zzz',
    ]);
    expect(table[0]).toMatchObject({ total: 100, limit: 10, rate: 0.1, alarm: true });
    expect(table[1]).toMatchObject({ total: 50, limit: 0, rate: 0, alarm: false });
  });

  it('alarms above the fixed SLO, not at it', () => {
    const at = evaluate(
      [
        { fid: 'a', status: 200, c: 97 },
        { fid: 'a', status: 546, c: 3 },
      ],
      FNS
    );
    expect(MAX_546_RATE).toBe(0.03);
    expect(at.alarms).toEqual([]);
    const over = evaluate(
      [
        { fid: 'a', status: 200, c: 96 },
        { fid: 'a', status: 546, c: 4 },
      ],
      FNS
    );
    expect(over.alarms).toEqual(['nightly-dreams: 4 of 100 requests hit 546 (4.0% > 3%)']);
  });

  it('a small sample is reported but never alarmed (1 of 5 is not a 20% outage)', () => {
    const r = evaluate(
      [
        { fid: 'a', status: 200, c: 4 },
        { fid: 'a', status: 546, c: 1 },
      ],
      FNS
    );
    expect(MIN_REQUESTS).toBe(20);
    expect(r.table[0]).toMatchObject({ total: 5, limit: 1, alarm: false });
    expect(r.alarms).toEqual([]);
  });

  it('the 2026-09-17 baseline (25 of 319) would have alarmed', () => {
    const r = evaluate(
      [
        { fid: 'a', status: 200, c: 294 },
        { fid: 'a', status: 546, c: 25 },
      ],
      FNS
    );
    expect(r.alarms).toHaveLength(1);
    expect(formatTable(r.table)).toContain('← ALARM');
  });

  it('status codes arrive as numbers or strings — both count', () => {
    const r = evaluate(
      [
        { fid: 'a', status: '546', c: '30' },
        { fid: 'a', status: '200', c: '70' },
      ],
      FNS
    );
    expect(r.table[0]).toMatchObject({ total: 100, limit: 30 });
  });
});

describe('edge546.deployClampedStart — the window never reaches back before the current deploy', () => {
  const start = new Date('2026-09-16T18:00:00Z');
  it('a deploy inside the window clamps the start to it (epoch ms or ISO)', () => {
    expect(deployClampedStart(start, Date.parse('2026-09-17T06:00:00Z'))?.toISOString()).toBe(
      '2026-09-17T06:00:00.000Z'
    );
    expect(deployClampedStart(start, '2026-09-17T06:00:00Z')?.toISOString()).toBe(
      '2026-09-17T06:00:00.000Z'
    );
  });
  it('a deploy older than the window, or an unknown one, leaves the window alone', () => {
    expect(deployClampedStart(start, Date.parse('2026-09-10T00:00:00Z'))).toBeNull();
    expect(deployClampedStart(start, undefined)).toBeNull();
    expect(deployClampedStart(start, 'not a date')).toBeNull();
  });
});
