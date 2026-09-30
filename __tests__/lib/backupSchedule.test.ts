/**
 * Locks the CLAUDE.md alarm rule for the off-site backups (BACKUPS.md): the freshness alarm DERIVES from the
 * backup schedule, and backups running exactly on schedule can never trip it.
 *
 * The workflow wakes hourly at :37 and backs up when scripts/backup/lib.js isDue says so. This replays that
 * wake loop for 30 days from every starting hour and checks the gaps between successes against the alarm.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  BACKUP_INTERVAL_HOURS,
  DUE_AFTER_HOURS,
  BLACKOUT_UTC_HOURS,
  STALE_ALARM_HOURS,
  isDue,
} = require('../../scripts/backup/lib');

const HOUR = 3600000;

/** Successes over `days` when every hourly :37 wake fires, starting from a success at `startHour`:37 UTC. */
function simulate(startHour: number, days = 30, fires: (wake: number) => boolean = () => true) {
  const t0 = Date.UTC(2026, 9, 1, startHour, 37);
  const successes = [t0];
  for (let wake = 1; wake <= days * 24; wake++) {
    const now = new Date(t0 + wake * HOUR);
    if (!fires(wake)) continue;
    if (isDue(new Date(successes[successes.length - 1]), now).due) successes.push(now.getTime());
  }
  return successes;
}

function maxGapHours(successes: number[]) {
  let max = 0;
  for (let i = 1; i < successes.length; i++)
    max = Math.max(max, (successes[i] - successes[i - 1]) / HOUR);
  return max;
}

describe('backup schedule: the stale alarm can never fire on an on-schedule backup', () => {
  it('the alarm threshold is derived from the schedule, not a fixed number', () => {
    expect(STALE_ALARM_HOURS).toBe(
      DUE_AFTER_HOURS + BLACKOUT_UTC_HOURS.length + 1 + BACKUP_INTERVAL_HOURS
    );
  });

  it.each(Array.from({ length: 24 }, (_, h) => h))(
    'first success at %i:37 UTC: every gap stays under the alarm, one copy a day',
    (startHour: number) => {
      const successes = simulate(startHour);
      const worst = maxGapHours(successes);
      expect(worst).toBeLessThanOrEqual(DUE_AFTER_HOURS + BLACKOUT_UTC_HOURS.length + 1);
      expect(worst).toBeLessThan(STALE_ALARM_HOURS);
      // Roughly daily: never more than one copy a day on average, never fewer than one per 27 h.
      expect(successes.length).toBeGreaterThanOrEqual(Math.floor((30 * 24) / 27));
      expect(successes.length).toBeLessThanOrEqual(31 + 30 / 2);
    }
  );

  it('settles into the quiet window: after the first week every success is at 09:37 UTC', () => {
    for (let startHour = 0; startHour < 24; startHour++) {
      const late = simulate(startHour).filter((t) => t > Date.UTC(2026, 9, 8));
      expect(new Set(late.map((t) => new Date(t).getUTCHours()))).toEqual(new Set([9]));
    }
  });

  it('never backs up in the busy window', () => {
    for (const h of BLACKOUT_UTC_HOURS) {
      expect(isDue(null, new Date(Date.UTC(2026, 9, 1, h, 37))).due).toBe(false);
    }
  });

  it('a full day of dropped GitHub wakes still stays under the alarm', () => {
    // Drop every wake in the 24 h after each due point: the gap grows by at most a day.
    const successes = simulate(9, 30, (wake) => Math.floor(wake / 24) % 5 !== 1);
    expect(maxGapHours(successes)).toBeLessThan(STALE_ALARM_HOURS);
  });

  it('isDue: due after DUE_AFTER_HOURS, not before', () => {
    const now = new Date(Date.UTC(2026, 9, 1, 12, 37));
    expect(isDue(null, now).due).toBe(true);
    expect(isDue(new Date(now.getTime() - (DUE_AFTER_HOURS - 1) * HOUR), now).due).toBe(false);
    expect(isDue(new Date(now.getTime() - DUE_AFTER_HOURS * HOUR), now).due).toBe(true);
  });
});
