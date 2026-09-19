/**
 * Boot stall — the state machine behind hooks/useBootStall.ts (BOOT_STALL_PLAN.md).
 *
 * Pure: `step(state, event)` returns the next state plus a list of EFFECTS the
 * hook performs (start the probe, send the alarm, fire analytics). Keeping the
 * decisions here means the behaviour that matters — the alarm fires at most
 * ONCE PER LAUNCH, ONLY on a proven-online phone, and "Try again" starts a
 * clean attempt without re-arming the alarm — is locked by
 * __tests__/lib/bootStallMachine.test.ts, not by hand-testing a hook.
 *
 * Vocabulary:
 *   launch  = one JS process. alarmAttempted / alarmSent live here and are never reset.
 *   boot    = one mount of app/index.tsx holding the logo (a sign-out → sign-in
 *             re-boots). maxPhaseThisBoot + the recovered event are per boot.
 *   attempt = one stretch of the clock; "Try again" starts the next one.
 */
import {
  type BootPhase,
  type BootStatus,
  type Reachability,
  copyFor,
  maxPhase,
  phaseForElapsed,
  phaseRank,
  shouldAlarm,
} from '@/lib/bootStall';

export interface MachineState {
  attempt: number;
  attemptStartedAt: number;
  bootStartedAt: number;
  phase: BootPhase;
  maxPhaseThisBoot: BootPhase;
  reachability: Reachability;
  probeStarted: boolean;
  /** The hard-state copy is final for this attempt (probe + alarm settled). */
  hardDecided: boolean;
  booted: boolean;
  /** Per LAUNCH. */
  alarmAttempted: boolean;
  alarmSent: boolean;
}

export type MachineEvent =
  /** The logo is (re)mounted with a stage active. No-op on the first boot. */
  | { type: 'begin'; now: number }
  /** A timer fired (or a catch-up on mount): recompute the phase from elapsed. */
  | { type: 'elapsed'; now: number }
  | { type: 'probe_done'; now: number; reachability: 'online' | 'offline' }
  | { type: 'alarm_done'; now: number; sent: boolean }
  | { type: 'retry'; now: number }
  /** The logo routed away (stage → null, or unmount). */
  | { type: 'booted'; now: number };

export type MachineEffect =
  | { type: 'start_probe' }
  | { type: 'send_alarm'; elapsedMs: number; attempt: number }
  | {
      type: 'track_stall';
      phase: Exclude<BootPhase, 'quiet'>;
      elapsedMs: number;
      reachability: Reachability;
      attempt: number;
    }
  | { type: 'track_recovered'; elapsedMs: number; maxPhase: BootPhase; attempts: number }
  | { type: 'track_retry'; attempt: number; phaseAtTap: BootPhase };

export interface StepResult {
  state: MachineState;
  effects: MachineEffect[];
}

export function initialState(now: number): MachineState {
  return {
    attempt: 1,
    attemptStartedAt: now,
    bootStartedAt: now,
    phase: 'quiet',
    maxPhaseThisBoot: 'quiet',
    reachability: 'unknown',
    probeStarted: false,
    hardDecided: false,
    booted: false,
    alarmAttempted: false,
    alarmSent: false,
  };
}

function freshAttempt(s: MachineState, now: number, attempt: number): MachineState {
  return {
    ...s,
    attempt,
    attemptStartedAt: now,
    phase: 'quiet',
    reachability: 'unknown',
    probeStarted: false,
    hardDecided: false,
    booted: false,
  };
}

/**
 * Settle the hard state. Runs whenever we are in `hard` and something that
 * could change the answer arrives (the phase itself, or the probe result).
 *   unknown reachability → wait for the probe (the medium line stays up)
 *   offline             → decided, no alarm
 *   online, first time  → send the alarm; decided once alarm_done reports back
 *   online, already did → decided (copy reflects whether it was actually sent)
 */
function decideHard(s: MachineState, now: number): StepResult {
  if (s.hardDecided) return { state: s, effects: [] };
  if (s.reachability === 'unknown') return { state: s, effects: [] };
  if (!shouldAlarm(s.reachability)) return { state: { ...s, hardDecided: true }, effects: [] };
  if (s.alarmAttempted) return { state: { ...s, hardDecided: true }, effects: [] };
  return {
    state: { ...s, alarmAttempted: true },
    effects: [{ type: 'send_alarm', elapsedMs: now - s.attemptStartedAt, attempt: s.attempt }],
  };
}

export function step(s: MachineState, e: MachineEvent): StepResult {
  switch (e.type) {
    case 'begin': {
      if (!s.booted) return { state: s, effects: [] };
      // A later boot in the same launch: fresh clock, alarm state preserved.
      return {
        state: { ...freshAttempt(s, e.now, 1), bootStartedAt: e.now, maxPhaseThisBoot: 'quiet' },
        effects: [],
      };
    }

    case 'elapsed': {
      const next = maxPhase(s.phase, phaseForElapsed(e.now - s.attemptStartedAt));
      if (next === s.phase || next === 'quiet') return { state: s, effects: [] };
      let state: MachineState = {
        ...s,
        phase: next,
        maxPhaseThisBoot: maxPhase(s.maxPhaseThisBoot, next),
      };
      const effects: MachineEffect[] = [
        {
          type: 'track_stall',
          phase: next,
          elapsedMs: e.now - s.attemptStartedAt,
          reachability: state.reachability,
          attempt: state.attempt,
        },
      ];
      if (phaseRank(next) >= phaseRank('medium') && !state.probeStarted) {
        state = { ...state, probeStarted: true };
        effects.push({ type: 'start_probe' });
      }
      if (next === 'hard') {
        const d = decideHard(state, e.now);
        state = d.state;
        effects.push(...d.effects);
      }
      return { state, effects };
    }

    case 'probe_done': {
      const state: MachineState = { ...s, reachability: e.reachability };
      if (state.phase !== 'hard') return { state, effects: [] };
      return decideHard(state, e.now);
    }

    case 'alarm_done':
      return { state: { ...s, alarmSent: e.sent, hardDecided: true }, effects: [] };

    case 'retry':
      return {
        state: freshAttempt(s, e.now, s.attempt + 1),
        effects: [{ type: 'track_retry', attempt: s.attempt, phaseAtTap: s.phase }],
      };

    case 'booted': {
      if (s.booted) return { state: s, effects: [] };
      const state: MachineState = { ...s, booted: true };
      if (s.maxPhaseThisBoot === 'quiet') return { state, effects: [] };
      return {
        state,
        effects: [
          {
            type: 'track_recovered',
            elapsedMs: e.now - s.bootStartedAt,
            maxPhase: s.maxPhaseThisBoot,
            attempts: s.attempt,
          },
        ],
      };
    }
  }
}

/** What StartupLogo should render for this state. */
export function statusFor(s: MachineState): BootStatus {
  // Hard but not yet settled (probe/alarm in flight): keep the medium line up
  // rather than flash the wrong hard copy for a frame.
  if (s.phase === 'hard' && !s.hardDecided) {
    return copyFor({ phase: 'medium', reachability: s.reachability, alarmSent: s.alarmSent });
  }
  return copyFor({ phase: s.phase, reachability: s.reachability, alarmSent: s.alarmSent });
}
