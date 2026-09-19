/**
 * Boot stall — pure phase + copy logic (BOOT_STALL_PLAN.md). No React, no
 * network, no native modules, so it is fully unit-tested
 * (__tests__/lib/bootStall.test.ts). hooks/useBootStall.ts owns the timers.
 */
import { BOOT_STALL, BOOT_STALL_COPY } from '@/constants/bootStall';

export type BootPhase = 'quiet' | 'soft' | 'medium' | 'hard';
/** Which boot gate is holding the logo on screen (app/index.tsx). */
export type BootStage = 'auth' | 'route';
/** 'unknown' = the probe has not run/finished yet. */
export type Reachability = 'unknown' | 'online' | 'offline';

const PHASE_ORDER: readonly BootPhase[] = ['quiet', 'soft', 'medium', 'hard'];

export function phaseRank(phase: BootPhase): number {
  return PHASE_ORDER.indexOf(phase);
}

/** Phases only ever move forward within an attempt. */
export function maxPhase(a: BootPhase, b: BootPhase): BootPhase {
  return phaseRank(a) >= phaseRank(b) ? a : b;
}

export function phaseForElapsed(elapsedMs: number): BootPhase {
  if (elapsedMs >= BOOT_STALL.HARD_MS) return 'hard';
  if (elapsedMs >= BOOT_STALL.MEDIUM_MS) return 'medium';
  if (elapsedMs >= BOOT_STALL.SOFT_MS) return 'soft';
  return 'quiet';
}

/** What StartupLogo renders. `quiet` is exactly today's logo-only screen. */
export type BootStatus =
  | { phase: 'quiet' }
  | { phase: 'soft' | 'medium'; line: string }
  | { phase: 'hard'; title: string; body: string; cta: string; hint?: string };

export interface CopyInput {
  phase: BootPhase;
  reachability: Reachability;
  /** True only if the Sentry event was actually sent this launch. */
  alarmSent: boolean;
}

/**
 * Pick the copy for a phase. The honesty rules:
 *   - "notified" appears ONLY when alarmSent is true
 *   - offline never blames our servers and never says "notified"
 *   - an unknown reachability at hard (probe never finished — should not happen,
 *     the probe starts at medium with a 5s timeout) is treated as "not proven
 *     online": generic copy, no notified claim. The hook also sends no alarm.
 */
export function copyFor(input: CopyInput): BootStatus {
  switch (input.phase) {
    case 'quiet':
      return { phase: 'quiet' };
    case 'soft':
      return { phase: 'soft', line: BOOT_STALL_COPY.soft };
    case 'medium':
      return { phase: 'medium', line: BOOT_STALL_COPY.medium };
    case 'hard': {
      if (input.reachability === 'offline')
        return { phase: 'hard', ...BOOT_STALL_COPY.hardOffline };
      if (input.reachability === 'online' && input.alarmSent) {
        return { phase: 'hard', ...BOOT_STALL_COPY.hardOnlineNotified };
      }
      return { phase: 'hard', ...BOOT_STALL_COPY.hardOnlineSilent };
    }
  }
}

/** The alarm fires only when we have PROVEN the phone is online. */
export function shouldAlarm(reachability: Reachability): boolean {
  return reachability === 'online';
}

/**
 * Deadline for the has_ai_recipe resolver. Normally it lines up with the hard
 * phase (so the resolver stops retrying the moment the hard state shows — the
 * thundering-herd guard). But when auth itself stalled and the route read only
 * STARTS late, the hard clock may already be nearly up; the resolver still gets
 * a fair minimum window (two timed-out reads plus their first backoffs) so a
 * slow-auth boot is never refused its first read.
 */
export const MIN_RESOLVER_WINDOW_MS =
  2 * (BOOT_STALL.RECIPE_READ_TIMEOUT_MS + BOOT_STALL.RECIPE_RETRY_BACKOFF_MS[0]);

export function recipeDeadline(resolverStartedAt: number, attemptStartedAt: number): number {
  return Math.max(
    resolverStartedAt + MIN_RESOLVER_WINDOW_MS,
    attemptStartedAt + BOOT_STALL.HARD_MS
  );
}
