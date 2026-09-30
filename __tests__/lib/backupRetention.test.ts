/**
 * Locks the off-site backup retention (BACKUPS.md, scripts/backup/lib.js RETENTION): the Privacy Policy promises
 * deleted data leaves the backups within 12 months, and the pruning must never delete anything it can't date or
 * the last good copies when backups have stopped.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RETENTION, parseStamp, selectExpired } = require('../../scripts/backup/lib');

const DAY = 86400000;
const NOW = Date.UTC(2027, 5, 15, 12, 0);

function dailyStamp(t: number) {
  return new Date(t).toISOString().slice(0, 16).replace(':', '') + 'Z'; // 2027-06-15T1200Z
}

describe('backup retention', () => {
  it('reads both folder-name shapes and nothing else', () => {
    expect(parseStamp('2026-09-30T0937Z')).toBe(Date.UTC(2026, 8, 30, 9, 37));
    expect(parseStamp('2026-09')).toBe(Date.UTC(2026, 8, 1));
    for (const junk of ['', 'latest', '2026-9-30', '2026-09-30', 'manifest.json', '../2026-09']) {
      expect(parseStamp(junk)).toBeNull();
    }
  });

  it('daily: copies past 35 days go, newer stay', () => {
    const names = Array.from({ length: 50 }, (_, i) => dailyStamp(NOW - i * DAY));
    const gone = selectExpired(names, { ...RETENTION.daily, now: NOW });
    expect(gone).toHaveLength(50 - 36); // days 0..35 kept
    for (const n of gone) expect(NOW - parseStamp(n)).toBeGreaterThan(35 * DAY);
  });

  it('daily: if backups stopped long ago, the newest 7 are never aged out', () => {
    const names = Array.from({ length: 10 }, (_, i) => dailyStamp(NOW - (100 + i) * DAY));
    const gone = selectExpired(names, { ...RETENTION.daily, now: NOW });
    expect(gone).toHaveLength(3);
    expect(gone).toEqual(names.slice(7));
  });

  it('monthly: only the newest 12 stay, so no copy outlives ~12 months', () => {
    const names = Array.from({ length: 15 }, (_, i) => {
      const d = new Date(Date.UTC(2027, 5 - i, 1));
      return d.toISOString().slice(0, 7);
    });
    const gone = selectExpired(names, { ...RETENTION.monthly, now: NOW });
    expect(gone).toEqual(names.slice(12));
  });

  it('trash: runs past 30 days go', () => {
    const names = [dailyStamp(NOW - 29 * DAY), dailyStamp(NOW - 31 * DAY)];
    expect(selectExpired(names, { ...RETENTION.trash, now: NOW })).toEqual([names[1]]);
  });

  it('never selects a name it cannot date', () => {
    expect(
      selectExpired(['latest', 'x', '2020-01'], { maxAgeDays: 1, keepNewest: 0, now: NOW })
    ).toEqual(['2020-01']);
  });
});
