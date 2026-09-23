/**
 * capacityRetryPin.ts — a nightly couple that goes back to the queue because the swap service was busy comes back
 * as the SAME couple (NIGHTLY_ROBUSTNESS_PLAN.md, migration 553).
 *
 * Without it a capacity retry (SwapCapacityRetryError → the worker re-queues with backoff) re-rolled the whole dream,
 * so about half the time the retry came back a SOLO: the outcome the retry exists to prevent. Now:
 *   1. the failed attempt records { cast_role: 'dual', partner_id } on dream_queue.payload.capacity_retry
 *      (record_capacity_retry_pin, one atomic merge, only while the job is in_progress);
 *   2. the nightly dispatcher forwards it as body.capacity_retry;
 *   3. the render forces the COUPLE dream type the same way the holiday day-of does (a production path, not the
 *      first-dream showcase cascade that `force_cast_role` would switch on) and keeps the same +1.
 * Look, vibe, scene and model all re-roll. `capacity_retry` has no force_/qa_ prefix, so the render stays a real
 * user dream (isQaRequest). Pure except recordCapacityRetryPin; locked by __tests__/lib/capacityRetryPin.test.ts.
 */
import type { SwapGateRpc } from './swapCapacityGate.ts';

export interface CapacityRetryPin {
  castRole: 'dual';
  /** The +1 the failed attempt rolled; null = the user's only / unknown partner (the normal roll decides). */
  partnerId: string | null;
}

/** Validate body.capacity_retry; anything malformed is ignored (null), never half-applied. */
export function parseCapacityRetryPin(body: unknown): CapacityRetryPin | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as Record<string, unknown>).capacity_retry;
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.cast_role !== 'dual') return null;
  const partnerId =
    typeof r.partner_id === 'string' && r.partner_id.length > 0 ? r.partner_id : null;
  return { castRole: 'dual', partnerId };
}

/**
 * Force this attempt to the couple type? Only when the user can still be cast as a couple and nothing explicit
 * already decided the cast: a QA force_medium / force_cast_role wins, and the holiday day-of already casts the
 * couple for anyone with a +1.
 */
export function shouldHoldCouple(
  pin: CapacityRetryPin | null,
  s: { hasSelf: boolean; hasPlusOne: boolean; forceMedium: boolean; forceCastRoleSet: boolean }
): boolean {
  return !!pin && s.hasSelf && s.hasPlusOne && !s.forceMedium && !s.forceCastRoleSet;
}

/** The +1 to keep: the pinned partner when still enabled on the roster, else null (the normal rotation rolls). */
export function pinnedPartner<P extends { id: string }>(
  pin: CapacityRetryPin | null,
  enabled: P[]
): P | null {
  if (!pin || !pin.partnerId) return null;
  return enabled.find((p) => p.id === pin.partnerId) ?? null;
}

/**
 * Record the pin on the queue row the render is working. Never throws: a missed write only means the retry re-rolls
 * the dream, which is the pre-553 behaviour.
 */
export async function recordCapacityRetryPin(
  supabase: SwapGateRpc,
  queueJobId: string | null | undefined,
  partnerId: string | null
): Promise<boolean> {
  if (!queueJobId) return false;
  try {
    const { data, error } = await supabase.rpc('record_capacity_retry_pin', {
      p_job_id: queueJobId,
      p_partner_id: partnerId,
    });
    if (error) {
      console.warn(`[capacityRetryPin] record failed for ${queueJobId}: ${error.message}`);
      return false;
    }
    return data === true;
  } catch (e) {
    console.warn(`[capacityRetryPin] record threw for ${queueJobId}: ${(e as Error).message}`);
    return false;
  }
}
