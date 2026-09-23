/**
 * SWAP CAPACITY GATE — renders wait for a free Fly dual-swap slot instead of piling onto the service
 * (NIGHTLY_ROBUSTNESS_PLAN.md item 1, 2026-09-23).
 *
 * WHY. The Fly `dreambot-face-swap-dual` service runs 2 machines at soft_limit 1 / hard_limit 2. Nothing
 * coordinated it: the queue's heavy cap counts renders, not swaps, and every render fired straight at Fly.
 * Measured over 21 nights: 1-2 couples swapping at once → 0 errors; 3-4 at once → 31% swap errors and 42%
 * of those couples shipped as a solo. The 10:18 UTC Denver burst (4 couple-heavy users in one insert) hit
 * that cliff every night. A Create load test showed the same thing: 10 at once → 10/10 failed, the same 10
 * spread 3 per minute → 0 failed.
 *
 * HOW. A counting semaphore in Postgres (`acquire_swap_slot` / `release_swap_slot`, migration 549): a lease
 * row per swap in flight, taken under an advisory lock, with an expiry so a crashed render frees its slot.
 * `engine_config.fly_dual_swap_slots` is the service's safe concurrency; `fly_dual_swap_interactive_reserve`
 * keeps slots that only INTERACTIVE swaps (Create, a user is watching) may take, so a nightly burst can never
 * starve a live Create. A caller WAITS (short polls) for a slot inside its own deadline; if none frees up it
 * gets `SwapCapacityBusyError` — which nightly turns into "retry this job later" (item 2), never a solo.
 *
 * FAIL-OPEN. Gate disabled, no DB, or the RPC erroring → the swap proceeds exactly as before (un-gated). The
 * gate may only ever make a swap wait; it must never be the reason one fails for a non-capacity cause.
 */

export type SwapPriority = 'interactive' | 'batch';

/** All the gate needs from a Supabase client: one RPC call. */
export interface SwapGateRpc {
  rpc(
    fn: string,
    args: Record<string, unknown>
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
}

export interface SwapGateSettings {
  enabled: boolean;
  /** Longest a swap may wait for a slot (ms). */
  maxWaitMs: number;
}

/** Thrown when no swap slot freed up in time. The message starts with `swap_capacity_busy` so the stamp
 *  (`dual_swap_error:swap_capacity_busy …`) and `isSwapCapacityError` recognise it. */
export class SwapCapacityBusyError extends Error {
  constructor(waitedMs: number) {
    super(`swap_capacity_busy: no Fly swap slot after ${waitedMs}ms`);
    this.name = 'SwapCapacityBusyError';
  }
}

/** Thrown by the dual pipeline when a CAPACITY failure should send a nightly job back to the queue instead of
 *  degrading it to a solo. The worker retries with backoff (1m / 5m / 30m / 2h). */
export class SwapCapacityRetryError extends Error {
  readonly reasons: string[];
  constructor(cause: string, reasons: string[]) {
    super(`nightly_swap_capacity_retry: ${cause.slice(0, 160)}`);
    this.name = 'SwapCapacityRetryError';
    this.reasons = reasons;
  }
}

/**
 * Is this dual-swap error about CAPACITY (a busy or slow service) rather than the image itself? Capacity
 * errors are worth retrying later; content failures (no clean two-face split, identity) are not.
 *   - our own gate timing out: `swap_capacity_busy`
 *   - Fly proxy refusing / bad gateway: `returned 502|503|504`
 *   - the engine giving up on Replicate: `Face swap timed out` (inside a 500)
 *   - the edge aborting the call: `Signal timed out`, `TimeoutError`, `aborted`
 */
export function isSwapCapacityError(message: string): boolean {
  return /swap_capacity_busy|returned 50[234]\b|face swap timed out|signal timed out|timeouterror|\baborted\b|operation was aborted/i.test(
    message
  );
}

const POLL_MS = 1_500;

export interface SlotLease {
  /** Lease id to release, or null when the swap ran un-gated (disabled / fail-open). */
  leaseId: string | null;
  waitedMs: number;
  mode: 'acquired' | 'disabled' | 'gate_error';
}

/**
 * Take a swap slot, waiting up to `min(settings.maxWaitMs, waitUntilMs - now)`. Resolves with the lease, or
 * throws SwapCapacityBusyError when the wait runs out. Never throws for a gate/DB problem (fail-open).
 */
export async function acquireSwapSlot(
  supabase: SwapGateRpc,
  args: {
    priority: SwapPriority;
    holder: string;
    /** Lease lifetime: how long until a crashed holder's slot frees itself. */
    ttlMs: number;
    /** Absolute ms by which the swap must have STARTED to still fit its deadline. */
    waitUntilMs: number;
    settings: SwapGateSettings;
    sleep?: (ms: number) => Promise<void>;
    now?: () => number;
  }
): Promise<SlotLease> {
  const now = args.now ?? Date.now;
  const sleep = args.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  if (!args.settings.enabled) return { leaseId: null, waitedMs: 0, mode: 'disabled' };
  const t0 = now();
  const giveUpAt = Math.min(t0 + Math.max(0, args.settings.maxWaitMs), args.waitUntilMs);
  for (;;) {
    const { data, error } = await supabase.rpc('acquire_swap_slot', {
      p_holder: args.holder.slice(0, 120),
      p_priority: args.priority,
      p_ttl_ms: Math.round(args.ttlMs),
    });
    if (error) {
      console.warn(`[swapGate] acquire failed, proceeding un-gated: ${error.message}`);
      return { leaseId: null, waitedMs: now() - t0, mode: 'gate_error' };
    }
    if (typeof data === 'string' && data)
      return { leaseId: data, waitedMs: now() - t0, mode: 'acquired' };
    if (now() + POLL_MS > giveUpAt) throw new SwapCapacityBusyError(now() - t0);
    await sleep(POLL_MS);
  }
}

/** Give a slot back. Best-effort: an unreleased lease expires on its own. */
export async function releaseSwapSlot(
  supabase: SwapGateRpc,
  leaseId: string | null
): Promise<void> {
  if (!leaseId) return;
  try {
    const { error } = await supabase.rpc('release_swap_slot', { p_id: leaseId });
    if (error) console.warn(`[swapGate] release failed (lease will expire): ${error.message}`);
  } catch (e) {
    console.warn(`[swapGate] release threw (lease will expire): ${(e as Error).message}`);
  }
}
