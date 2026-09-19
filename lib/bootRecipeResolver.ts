/**
 * Boot-time `users.has_ai_recipe` resolver (BOOT_STALL_PLAN.md §2.8).
 *
 * Replaces the inline retry loop that app/index.tsx used to carry. Pure and
 * fully injectable (clock, sleep, reader), unit-tested in
 * __tests__/lib/bootRecipeResolver.test.ts.
 *
 * TWO invariants, both locked by tests:
 *
 * 1. NEVER GUESS (the sunnysteph invariant, 2026-07-10). A transient read
 *    failure must never route an established user into onboarding — re-running
 *    onboarding overwrites their Vibe Profile. So this resolves `false` ONLY from
 *    a confirmed successful read, and `null` ("unresolved") on any failure.
 *
 * 2. BOUNDED RETRIES (the thundering-herd guard). Each attempt is aborted at
 *    `timeoutMs` (iOS would otherwise let it hang ~60s), retries use bounded
 *    backoff, and NO attempt starts once `deadlineMs` has passed. A stuck fleet
 *    hammering a saturated PostgREST pool is the incident we must not worsen.
 *    Past the deadline the caller shows the hard state; only the user's manual
 *    "Try again" starts a new resolver.
 *
 * The old loop gave up after 5 quick attempts and stayed on the logo forever,
 * so a user who launched during a 10-second blip stayed stranded until a
 * force-quit. This one keeps trying (bounded) until the deadline, so a backend
 * that comes back 20 seconds later lets the user in without doing anything.
 */
export interface RecipeReadResult {
  data: { has_ai_recipe: boolean | null } | null;
  error: unknown;
}

export interface ResolveHasRecipeOptions {
  /** One read attempt; MUST honour the signal (postgrest `.abortSignal(signal)`). */
  read: (signal: AbortSignal) => Promise<RecipeReadResult>;
  /** The owning effect was cleaned up — stop without resolving anything. */
  isCancelled: () => boolean;
  /** Absolute time (in `now()` units) after which no new attempt starts. */
  deadlineMs: number;
  /** Per-attempt abort. */
  timeoutMs: number;
  /** Backoff schedule; the last value repeats (plus jitter) until the deadline. */
  backoffMs: readonly number[];
  jitterMs?: number;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  /** Injectable for deterministic jitter in tests. */
  random?: () => number;
  /** Diagnostics only (dev log / analytics). Called after each FAILED attempt. */
  onAttempt?: (info: { attempt: number; error: unknown; elapsedMs: number }) => void;
}

/** `true`/`false` = a CONFIRMED read; `null` = never confirmed (stay on the logo). */
export async function resolveHasRecipe(o: ResolveHasRecipeOptions): Promise<boolean | null> {
  const startedAt = o.now();
  const random = o.random ?? Math.random;
  const jitterMs = o.jitterMs ?? 0;

  for (let attempt = 0; ; attempt++) {
    if (o.isCancelled()) return null;
    if (o.now() >= o.deadlineMs) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), o.timeoutMs);
    let result: RecipeReadResult;
    try {
      result = await o.read(controller.signal);
    } catch (error) {
      result = { data: null, error };
    } finally {
      clearTimeout(timer);
    }

    if (o.isCancelled()) return null;
    if (!result.error) return result.data?.has_ai_recipe ?? false;

    o.onAttempt?.({ attempt: attempt + 1, error: result.error, elapsedMs: o.now() - startedAt });

    const lastIdx = o.backoffMs.length - 1;
    const base = lastIdx >= 0 ? (o.backoffMs[Math.min(attempt, lastIdx)] ?? 0) : 0;
    const jitter = attempt >= lastIdx && jitterMs > 0 ? Math.floor(random() * jitterMs) : 0;
    const wait = base + jitter;

    // Sleeping past the deadline only to be refused at the top of the loop is
    // wasted time the user spends staring at the logo — bail now.
    if (o.now() + wait >= o.deadlineMs) return null;
    await o.sleep(wait);
  }
}
