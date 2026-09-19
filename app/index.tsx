import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { StartupLogo } from '@/components/StartupLogo';
import { BOOT_STALL } from '@/constants/bootStall';
import { recipeDeadline, type BootStage } from '@/lib/bootStall';
import { resolveHasRecipe } from '@/lib/bootRecipeResolver';
import { useBootStall } from '@/hooks/useBootStall';

export default function Index() {
  const { session, user, initialized } = useAuthStore();
  const [hasRecipe, setHasRecipe] = useState<boolean | null>(null);

  // Which gate is holding the logo on screen (null = routing away). Drives the
  // boot-stall clock: soft/medium copy, then an honest error + "Try again" and
  // a one-per-launch outage alarm (BOOT_STALL_PLAN.md).
  const stage: BootStage | null = !initialized
    ? 'auth'
    : !session
      ? null
      : hasRecipe === null
        ? 'route'
        : null;
  const { status, attemptStartedAt, retry } = useBootStall(stage);

  useEffect(() => {
    if (!user) {
      setHasRecipe(null);
      return;
    }
    let cancelled = false;
    const userId = user.id;

    // Resolve onboarding state from users.has_ai_recipe. CRITICAL: a transient
    // read failure (network blip, 5xx, an auth-token refresh mid-request) must
    // NEVER route an established user into onboarding — re-running onboarding
    // can overwrite their Vibe Profile. The old code did `data?.has_ai_recipe ??
    // false` and ignored `error`, so any failed read → data null → false →
    // /(onboarding). A real user (sunnysteph, 2026-07-10) got dumped into
    // onboarding intermittently until an app restart happened to read cleanly.
    //
    // Only a CONFIRMED successful read flips hasRecipe (true → tabs, false →
    // onboarding). lib/bootRecipeResolver.ts owns the loop: each attempt is
    // aborted at RECIPE_READ_TIMEOUT_MS (iOS would otherwise let it hang ~60s),
    // retries use bounded backoff until the hard-state deadline, and then it
    // STOPS (a stuck fleet must not hammer a saturated pool) — only the user's
    // "Try again" (a new attemptStartedAt) starts a fresh resolver. If it never
    // confirms, hasRecipe stays null and the logo (with its stall copy) stays.
    const startedAt = Date.now();
    void resolveHasRecipe({
      read: (signal) =>
        Promise.resolve(
          supabase
            .from('users')
            .select('has_ai_recipe')
            .eq('id', userId)
            .abortSignal(signal)
            .single()
        ),
      isCancelled: () => cancelled,
      deadlineMs: recipeDeadline(startedAt, attemptStartedAt),
      timeoutMs: BOOT_STALL.RECIPE_READ_TIMEOUT_MS,
      backoffMs: BOOT_STALL.RECIPE_RETRY_BACKOFF_MS,
      jitterMs: BOOT_STALL.RECIPE_RETRY_JITTER_MS,
      now: Date.now,
      sleep: (ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
      onAttempt: ({ attempt, error }) => {
        if (__DEV__) console.warn(`[boot] has_ai_recipe read failed (attempt ${attempt})`, error);
      },
    }).then((value) => {
      if (!cancelled && value !== null) setHasRecipe(value);
    });

    return () => {
      cancelled = true;
    };
  }, [user, attemptStartedAt]);

  // Animated wordmark on black while we resolve where to route — hands off from
  // the native splash (static wordmark) instead of flashing a blank screen.
  if (!initialized) return <StartupLogo status={status} onRetry={retry} />;
  if (!session) return <Redirect href="/(auth)" />;
  if (hasRecipe === null) return <StartupLogo status={status} onRetry={retry} />; // loading / unresolved
  if (!hasRecipe) return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(tabs)" />;
}
