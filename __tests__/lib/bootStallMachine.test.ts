/**
 * bootStallMachine — locks the behaviour that matters:
 *   - the alarm fires at most ONCE PER LAUNCH, ONLY on a proven-online phone
 *   - "Try again" starts a clean attempt and never re-arms the alarm
 *   - a healthy boot produces zero effects
 *   - the hard copy is never shown before the probe/alarm have settled
 */
import { BOOT_STALL } from '@/constants/bootStall';
import {
  initialState,
  statusFor,
  step,
  type MachineEffect,
  type MachineEvent,
  type MachineState,
} from '@/lib/bootStallMachine';

const T0 = 1_000_000;
const { SOFT_MS, MEDIUM_MS, HARD_MS } = BOOT_STALL;

/** Run a sequence of events, collecting every effect. */
function run(events: MachineEvent[], start: MachineState = initialState(T0)) {
  let state = start;
  const effects: MachineEffect[] = [];
  for (const e of events) {
    const r = step(state, e);
    state = r.state;
    effects.push(...r.effects);
  }
  return { state, effects };
}
const at = (ms: number): MachineEvent => ({ type: 'elapsed', now: T0 + ms });
const types = (fx: MachineEffect[]) => fx.map((f) => f.type);
const hardBody = (s: MachineState) => {
  const st = statusFor(s);
  return st.phase === 'hard' ? st.body : null;
};

describe('healthy boot', () => {
  it('produces no effects and stays quiet when the app routes away quickly', () => {
    const { state, effects } = run([at(500), at(2_000), { type: 'booted', now: T0 + 2_100 }]);
    expect(effects).toEqual([]);
    expect(state.phase).toBe('quiet');
    expect(statusFor(state)).toEqual({ phase: 'quiet' });
  });
});

describe('phase escalation', () => {
  it('soft → medium (probe starts exactly once) → hard, each tracked once', () => {
    const { effects } = run([
      at(SOFT_MS),
      at(SOFT_MS + 1_000),
      at(MEDIUM_MS),
      at(MEDIUM_MS + 5_000),
    ]);
    expect(types(effects)).toEqual(['track_stall', 'track_stall', 'start_probe']);
    expect(effects[0]).toMatchObject({ type: 'track_stall', phase: 'soft', elapsedMs: SOFT_MS });
    expect(effects[1]).toMatchObject({ type: 'track_stall', phase: 'medium', attempt: 1 });
  });

  it('never regresses on an out-of-order tick', () => {
    const { state } = run([at(MEDIUM_MS), at(SOFT_MS)]);
    expect(state.phase).toBe('medium');
  });

  it('a single late tick can jump quiet → hard and still starts the probe', () => {
    const { state, effects } = run([at(HARD_MS)]);
    expect(state.phase).toBe('hard');
    expect(types(effects)).toEqual(['track_stall', 'start_probe']);
    // Probe not back yet → no alarm, and the copy stays on the medium line.
    expect(statusFor(state).phase).toBe('medium');
  });
});

describe('hard state — the alarm', () => {
  const toHardOnline: MachineEvent[] = [
    at(MEDIUM_MS),
    { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'online' },
    at(HARD_MS),
  ];

  it('online: sends the alarm exactly once, copy says "notified" only after alarm_done(true)', () => {
    const r1 = run(toHardOnline);
    expect(types(r1.effects).filter((t) => t === 'send_alarm')).toHaveLength(1);
    expect(r1.state.alarmAttempted).toBe(true);
    expect(r1.state.hardDecided).toBe(false);
    expect(statusFor(r1.state).phase).toBe('medium'); // still settling

    const r2 = run([{ type: 'alarm_done', now: T0 + HARD_MS + 50, sent: true }], r1.state);
    expect(r2.state.hardDecided).toBe(true);
    expect(hardBody(r2.state)).toMatch(/notified/i);
  });

  it('online but Sentry disabled (alarm_done sent=false): generic copy, no "notified"', () => {
    const r1 = run(toHardOnline);
    const r2 = run([{ type: 'alarm_done', now: T0 + HARD_MS + 50, sent: false }], r1.state);
    expect(hardBody(r2.state)).not.toMatch(/notified/i);
    expect(hardBody(r2.state)).toMatch(/servers/i);
  });

  it('offline: no alarm, offline copy, decided immediately', () => {
    const { state, effects } = run([
      at(MEDIUM_MS),
      { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'offline' },
      at(HARD_MS),
    ]);
    expect(types(effects)).not.toContain('send_alarm');
    expect(state.hardDecided).toBe(true);
    const st = statusFor(state);
    expect(st.phase).toBe('hard');
    if (st.phase === 'hard') expect(st.title).toMatch(/offline/i);
  });

  it('probe resolving AFTER hard settles the state and sends the alarm then', () => {
    const r1 = run([at(MEDIUM_MS), at(HARD_MS)]);
    expect(types(r1.effects)).not.toContain('send_alarm');
    const r2 = run(
      [{ type: 'probe_done', now: T0 + HARD_MS + 10, reachability: 'online' }],
      r1.state
    );
    expect(types(r2.effects)).toEqual(['send_alarm']);
  });

  it('repeated hard ticks never send a second alarm', () => {
    const r1 = run([...toHardOnline, at(HARD_MS + 1_000), at(HARD_MS + 60_000)]);
    expect(types(r1.effects).filter((t) => t === 'send_alarm')).toHaveLength(1);
  });

  it('send_alarm carries the elapsed time and attempt number', () => {
    const { effects } = run(toHardOnline);
    const alarm = effects.find((f) => f.type === 'send_alarm');
    expect(alarm).toEqual({ type: 'send_alarm', elapsedMs: HARD_MS, attempt: 1 });
  });
});

describe('Try again', () => {
  const firstHardNotified: MachineEvent[] = [
    at(MEDIUM_MS),
    { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'online' },
    at(HARD_MS),
    { type: 'alarm_done', now: T0 + HARD_MS + 50, sent: true },
  ];

  it('starts a clean attempt: quiet, fresh clock, probe reset, attempt+1, tracked', () => {
    const r1 = run(firstHardNotified);
    const RETRY_AT = T0 + HARD_MS + 5_000;
    const r2 = run([{ type: 'retry', now: RETRY_AT }], r1.state);
    expect(r2.effects).toEqual([{ type: 'track_retry', attempt: 1, phaseAtTap: 'hard' }]);
    expect(r2.state).toMatchObject({
      attempt: 2,
      attemptStartedAt: RETRY_AT,
      phase: 'quiet',
      reachability: 'unknown',
      probeStarted: false,
      hardDecided: false,
    });
    expect(statusFor(r2.state)).toEqual({ phase: 'quiet' });
    // The new attempt's clock is relative to the tap, not the launch.
    const r3 = run([{ type: 'elapsed', now: RETRY_AT + SOFT_MS - 1 }], r2.state);
    expect(r3.state.phase).toBe('quiet');
    const r4 = run([{ type: 'elapsed', now: RETRY_AT + SOFT_MS }], r3.state);
    expect(r4.state.phase).toBe('soft');
  });

  it('a second hard state after a sent alarm does NOT alarm again, but still says "notified"', () => {
    const r1 = run(firstHardNotified);
    const RETRY_AT = T0 + HARD_MS + 5_000;
    const r2 = run(
      [
        { type: 'retry', now: RETRY_AT },
        { type: 'elapsed', now: RETRY_AT + MEDIUM_MS },
        { type: 'probe_done', now: RETRY_AT + MEDIUM_MS + 300, reachability: 'online' },
        { type: 'elapsed', now: RETRY_AT + HARD_MS },
      ],
      r1.state
    );
    expect(types(r2.effects)).not.toContain('send_alarm');
    expect(r2.state.hardDecided).toBe(true);
    expect(hardBody(r2.state)).toMatch(/notified/i); // truthful: we did notify this launch
  });

  it('an OFFLINE first attempt does not consume the once-per-launch alarm', () => {
    const r1 = run([
      at(MEDIUM_MS),
      { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'offline' },
      at(HARD_MS),
    ]);
    expect(r1.state.alarmAttempted).toBe(false);
    const RETRY_AT = T0 + HARD_MS + 5_000;
    const r2 = run(
      [
        { type: 'retry', now: RETRY_AT },
        { type: 'elapsed', now: RETRY_AT + MEDIUM_MS },
        { type: 'probe_done', now: RETRY_AT + MEDIUM_MS + 300, reachability: 'online' },
        { type: 'elapsed', now: RETRY_AT + HARD_MS },
      ],
      r1.state
    );
    expect(types(r2.effects)).toContain('send_alarm');
  });

  it('after a retry an offline probe shows offline copy even though the launch alarmed earlier', () => {
    const r1 = run(firstHardNotified);
    const RETRY_AT = T0 + HARD_MS + 5_000;
    const r2 = run(
      [
        { type: 'retry', now: RETRY_AT },
        { type: 'elapsed', now: RETRY_AT + MEDIUM_MS },
        { type: 'probe_done', now: RETRY_AT + MEDIUM_MS + 300, reachability: 'offline' },
        { type: 'elapsed', now: RETRY_AT + HARD_MS },
      ],
      r1.state
    );
    const st = statusFor(r2.state);
    if (st.phase !== 'hard') throw new Error('expected hard');
    expect(st.title).toMatch(/offline/i);
    expect(st.body).not.toMatch(/notified/i);
  });
});

describe('booted / recovered', () => {
  it('reports recovery once, with the max phase and attempt count, only if it ever stalled', () => {
    const r1 = run([
      at(SOFT_MS),
      at(MEDIUM_MS),
      { type: 'booted', now: T0 + MEDIUM_MS + 2_000 },
      { type: 'booted', now: T0 + MEDIUM_MS + 2_500 }, // unmount after stage→null: no double
    ]);
    const recovered = r1.effects.filter((f) => f.type === 'track_recovered');
    expect(recovered).toEqual([
      { type: 'track_recovered', elapsedMs: MEDIUM_MS + 2_000, maxPhase: 'medium', attempts: 1 },
    ]);
  });

  it('a recovery after Try again reports attempts=2 and elapsed from the boot start', () => {
    const RETRY_AT = T0 + HARD_MS + 5_000;
    const { effects } = run([
      at(MEDIUM_MS),
      { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'online' },
      at(HARD_MS),
      { type: 'alarm_done', now: T0 + HARD_MS + 50, sent: true },
      { type: 'retry', now: RETRY_AT },
      { type: 'booted', now: RETRY_AT + 3_000 },
    ]);
    const recovered = effects.find((f) => f.type === 'track_recovered');
    expect(recovered).toEqual({
      type: 'track_recovered',
      elapsedMs: HARD_MS + 5_000 + 3_000,
      maxPhase: 'hard',
      attempts: 2,
    });
  });

  it('begin is a no-op on the first boot (keeps the JS-start clock)', () => {
    const { state } = run([{ type: 'begin', now: T0 + 3_000 }]);
    expect(state.attemptStartedAt).toBe(T0);
  });

  it('begin after a boot starts a fresh clock but keeps the per-launch alarm state', () => {
    const r1 = run([
      at(MEDIUM_MS),
      { type: 'probe_done', now: T0 + MEDIUM_MS + 400, reachability: 'online' },
      at(HARD_MS),
      { type: 'alarm_done', now: T0 + HARD_MS + 50, sent: true },
      { type: 'booted', now: T0 + HARD_MS + 9_000 },
    ]);
    const AGAIN = T0 + 3_600_000; // an hour later: sign-out → sign-in re-mounts the logo
    const r2 = run(
      [
        { type: 'begin', now: AGAIN },
        { type: 'elapsed', now: AGAIN + 100 },
      ],
      r1.state
    );
    expect(r2.state).toMatchObject({
      phase: 'quiet',
      attempt: 1,
      attemptStartedAt: AGAIN,
      bootStartedAt: AGAIN,
      maxPhaseThisBoot: 'quiet',
      booted: false,
      alarmAttempted: true,
      alarmSent: true,
    });
    expect(r2.effects).toEqual([]);
  });
});
