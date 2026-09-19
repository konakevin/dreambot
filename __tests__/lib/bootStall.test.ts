/**
 * Boot stall — phase boundaries, threshold invariants, and the copy honesty
 * rules (BOOT_STALL_PLAN.md §4). Pure logic; the timers live in the hook.
 */
import { BOOT_STALL, BOOT_STALL_COPY } from '@/constants/bootStall';
import { copyFor, maxPhase, phaseForElapsed, shouldAlarm } from '@/lib/bootStall';

describe('phaseForElapsed — boundaries', () => {
  it('is quiet until SOFT_MS, then escalates at each threshold', () => {
    expect(phaseForElapsed(0)).toBe('quiet');
    expect(phaseForElapsed(BOOT_STALL.SOFT_MS - 1)).toBe('quiet');
    expect(phaseForElapsed(BOOT_STALL.SOFT_MS)).toBe('soft');
    expect(phaseForElapsed(BOOT_STALL.MEDIUM_MS - 1)).toBe('soft');
    expect(phaseForElapsed(BOOT_STALL.MEDIUM_MS)).toBe('medium');
    expect(phaseForElapsed(BOOT_STALL.HARD_MS - 1)).toBe('medium');
    expect(phaseForElapsed(BOOT_STALL.HARD_MS)).toBe('hard');
    expect(phaseForElapsed(BOOT_STALL.HARD_MS * 10)).toBe('hard');
  });

  it('maxPhase never moves backwards', () => {
    expect(maxPhase('hard', 'soft')).toBe('hard');
    expect(maxPhase('soft', 'hard')).toBe('hard');
    expect(maxPhase('quiet', 'quiet')).toBe('quiet');
    expect(maxPhase('medium', 'soft')).toBe('medium');
  });
});

describe('BOOT_STALL — threshold invariants', () => {
  it('escalates strictly: SOFT < MEDIUM < HARD', () => {
    expect(BOOT_STALL.SOFT_MS).toBeLessThan(BOOT_STALL.MEDIUM_MS);
    expect(BOOT_STALL.MEDIUM_MS).toBeLessThan(BOOT_STALL.HARD_MS);
  });

  it('at least one full timed-out read plus a retry fits before HARD', () => {
    // Otherwise the hard state could appear before the read was ever given a
    // fair chance — a false "outage" on a merely slow network.
    const firstBackoff = BOOT_STALL.RECIPE_RETRY_BACKOFF_MS[0];
    expect(BOOT_STALL.HARD_MS).toBeGreaterThan(BOOT_STALL.RECIPE_READ_TIMEOUT_MS + firstBackoff);
  });

  it('the reachability probe finishes before HARD even when started at MEDIUM', () => {
    expect(BOOT_STALL.MEDIUM_MS + BOOT_STALL.PROBE_TIMEOUT_MS).toBeLessThan(BOOT_STALL.HARD_MS);
  });

  it('the soft line never appears on a healthy boot (a few seconds at most)', () => {
    expect(BOOT_STALL.SOFT_MS).toBeGreaterThanOrEqual(5_000);
  });
});

describe('copyFor — honesty rules', () => {
  it('soft and medium are a single line with no CTA', () => {
    expect(copyFor({ phase: 'soft', reachability: 'unknown', alarmSent: false })).toEqual({
      phase: 'soft',
      line: BOOT_STALL_COPY.soft,
    });
    expect(copyFor({ phase: 'medium', reachability: 'unknown', alarmSent: false })).toEqual({
      phase: 'medium',
      line: BOOT_STALL_COPY.medium,
    });
  });

  it('says "notified" ONLY when online AND the alarm was actually sent', () => {
    const notified = copyFor({ phase: 'hard', reachability: 'online', alarmSent: true });
    expect(notified.phase).toBe('hard');
    if (notified.phase !== 'hard') throw new Error('unreachable');
    expect(notified.body).toMatch(/notified/i);

    const silent = copyFor({ phase: 'hard', reachability: 'online', alarmSent: false });
    if (silent.phase !== 'hard') throw new Error('unreachable');
    expect(silent.body).not.toMatch(/notified/i);
    expect(silent.body).not.toMatch(/alerted/i);
  });

  it('offline copy never blames our servers and never claims a notification', () => {
    const offline = copyFor({ phase: 'hard', reachability: 'offline', alarmSent: true });
    if (offline.phase !== 'hard') throw new Error('unreachable');
    expect(offline.title).toMatch(/offline/i);
    expect(offline.body).not.toMatch(/server/i);
    expect(offline.body).not.toMatch(/notified/i);
  });

  it('unknown reachability at hard = not proven online → generic copy, no notified claim', () => {
    const unknown = copyFor({ phase: 'hard', reachability: 'unknown', alarmSent: false });
    if (unknown.phase !== 'hard') throw new Error('unreachable');
    expect(unknown.body).not.toMatch(/notified/i);
    expect(shouldAlarm('unknown')).toBe(false);
  });

  it('alarms only on a proven-online phone', () => {
    expect(shouldAlarm('online')).toBe(true);
    expect(shouldAlarm('offline')).toBe(false);
  });

  it('every hard state has a Try again CTA', () => {
    for (const r of ['online', 'offline', 'unknown'] as const) {
      const s = copyFor({ phase: 'hard', reachability: r, alarmSent: r === 'online' });
      if (s.phase !== 'hard') throw new Error('unreachable');
      expect(s.cta).toBe('Try again');
    }
  });
});

describe('BOOT_STALL_COPY — house style', () => {
  const strings: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string') strings.push(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(BOOT_STALL_COPY);

  it('collected every string', () => {
    expect(strings.length).toBeGreaterThanOrEqual(10);
  });

  it('contains no em dashes (Kevin house rule)', () => {
    for (const s of strings) expect(s).not.toMatch(/—/);
  });

  it('keeps every line short enough for one or two lines on an iPhone', () => {
    for (const s of strings) expect(s.length).toBeLessThanOrEqual(120);
  });
});
