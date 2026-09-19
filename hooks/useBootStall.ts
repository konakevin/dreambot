/**
 * useBootStall — the boot clock behind the startup logo (BOOT_STALL_PLAN.md).
 *
 * Thin on purpose: every decision lives in lib/bootStallMachine.ts (pure,
 * tested). This hook only (a) arms three timers per attempt at the SOFT /
 * MEDIUM / HARD thresholds, (b) runs the machine's effects — the reachability
 * probe, the ONE-per-launch Sentry alarm, the analytics events — and (c) keeps
 * the machine state at module level so "once per launch" survives an
 * unmount/remount of app/index.tsx (sign-out → sign-in).
 *
 * `stage` is which gate is holding the logo: 'auth' (session not initialized),
 * 'route' (has_ai_recipe unresolved), or null (routing away / not stalled).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { BOOT_STALL } from '@/constants/bootStall';
import type { BootStage, BootStatus } from '@/lib/bootStall';
import {
  initialState,
  statusFor,
  step,
  type MachineEffect,
  type MachineEvent,
  type MachineState,
} from '@/lib/bootStallMachine';
import { probeReachability } from '@/lib/reachability';
import { captureMessage } from '@/lib/sentry';
import { trackBootRecovered, trackBootRetryTapped, trackBootStall } from '@/lib/analytics';

const APP_VERSION = Constants.expoConfig?.version ?? 'unknown';

// Per JS launch. Initialised at module evaluation ≈ JS start, which is the
// moment the user perceives the (native → JS) splash as "still loading".
let launchState: MachineState = initialState(Date.now());

export interface BootStallHandle {
  status: BootStatus;
  attempt: number;
  attemptStartedAt: number;
  retry: () => void;
}

export function useBootStall(stage: BootStage | null): BootStallHandle {
  const [state, setState] = useState<MachineState>(launchState);
  const stateRef = useRef(state);
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const dispatchRef = useRef<(e: MachineEvent) => void>(() => {});

  const runEffect = useCallback((fx: MachineEffect) => {
    const dispatch = dispatchRef.current;
    switch (fx.type) {
      case 'start_probe':
        void probeReachability().then((reachability) =>
          dispatch({ type: 'probe_done', now: Date.now(), reachability })
        );
        return;
      case 'send_alarm': {
        const stageTag: BootStage = stageRef.current ?? 'route';
        const sent = captureMessage('boot_stall_hard', {
          level: 'error',
          fingerprint: ['boot-stall-hard'],
          tags: {
            boot_stall: 'hard',
            stage: stageTag,
            reachability: 'online',
            app_version: APP_VERSION,
          },
          extra: { elapsed_ms: fx.elapsedMs, attempt: fx.attempt },
        });
        dispatch({ type: 'alarm_done', now: Date.now(), sent });
        return;
      }
      case 'track_stall':
        trackBootStall({
          phase: fx.phase,
          stage: stageRef.current ?? 'route',
          elapsed_ms: fx.elapsedMs,
          reachability: fx.reachability,
          attempt: fx.attempt,
        });
        return;
      case 'track_recovered':
        if (fx.maxPhase === 'quiet') return;
        trackBootRecovered({
          elapsed_ms: fx.elapsedMs,
          max_phase: fx.maxPhase,
          attempts: fx.attempts,
        });
        return;
      case 'track_retry':
        trackBootRetryTapped({ attempt: fx.attempt, phase_at_tap: fx.phaseAtTap });
        return;
    }
  }, []);

  const dispatch = useCallback(
    (event: MachineEvent) => {
      const { state: next, effects } = step(stateRef.current, event);
      if (next !== stateRef.current) {
        stateRef.current = next;
        launchState = next;
        setState(next);
      }
      for (const fx of effects) runEffect(fx);
    },
    [runEffect]
  );
  dispatchRef.current = dispatch;

  // Stage lifecycle: routed away → booted; (re)mounted with a gate → begin.
  useEffect(() => {
    dispatch(
      stage === null ? { type: 'booted', now: Date.now() } : { type: 'begin', now: Date.now() }
    );
  }, [stage, dispatch]);

  // Unmount (Redirect replaces this route) counts as booted; the machine de-dupes.
  useEffect(() => () => dispatch({ type: 'booted', now: Date.now() }), [dispatch]);

  // Timers, re-armed per attempt. Fire an immediate catch-up so a phase we are
  // already past (JS start → mount gap) is applied without waiting.
  const active = stage !== null;
  const { attempt, attemptStartedAt } = state;
  useEffect(() => {
    if (!active) return;
    dispatch({ type: 'elapsed', now: Date.now() });
    const elapsed = Date.now() - attemptStartedAt;
    const timers = [BOOT_STALL.SOFT_MS, BOOT_STALL.MEDIUM_MS, BOOT_STALL.HARD_MS]
      .map((at) => Math.max(0, at - elapsed))
      .map((delay) => setTimeout(() => dispatch({ type: 'elapsed', now: Date.now() }), delay + 1));
    return () => timers.forEach(clearTimeout);
  }, [active, attempt, attemptStartedAt, dispatch]);

  const retry = useCallback(() => dispatch({ type: 'retry', now: Date.now() }), [dispatch]);

  return { status: statusFor(state), attempt, attemptStartedAt, retry };
}
