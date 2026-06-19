/**
 * First-dream tier cascade (server-side).
 *
 * Ported from the old client-side lib/firstDreamCascade.ts (2026-06-15) when the
 * onboarding first dream moved onto the async dream_queue. The cascade used to
 * be the CLIENT looping fresh nightly-dreams calls per tier (each a slow, no-
 * timeout HTTP await — the "loading forever" bug). Now the tier LIST is built
 * here at enqueue time and stored in the queue payload; the `first-dream-render`
 * orchestrator advances `tier_index` and re-queues on a cascadeable failure, so
 * each tier renders in its OWN isolate (bounded < 150s wall-clock).
 *
 * Tiers, in order (each a fresh, safer fallback):
 *   1. dual swap (self + plus_one) →
 *   2. single self swap →
 *   3. single plus_one / pet swap →
 *   4. scene-only render (no cast — works even with zero cast photos)
 *
 * The user never sees a face-swap/NSFW failure — those are shame-free retries
 * that resolve transparently. Only when ALL tiers fail does the client surface
 * the onboarding retry UI.
 */

export interface CastMemberLike {
  role?: string;
  thumb_url?: string;
  /** Object path in the PRIVATE `cast-photos` bucket (migration 292). */
  storage_path?: string;
}

export interface FirstDreamTier {
  name: string;
  /** Merged into the nightly-dreams render body for this tier. */
  body: Record<string, unknown>;
}

function usable(cast: CastMemberLike[], role: string): boolean {
  // A member is usable when it has a PRIVATE storage_path (resolved to a signed
  // URL at render time) OR a legacy public http thumb_url. At enqueue time a
  // freshly-uploaded cast carries only storage_path, so a bare http check would
  // wrongly drop the user from their own first dream.
  return cast.some(
    (m) =>
      m.role === role &&
      (!!m.storage_path || (typeof m.thumb_url === 'string' && m.thumb_url.startsWith('http')))
  );
}

/**
 * Build the ordered tier list from the user's cast (mirrors the old client
 * buildTiers). `place` (one of the user's just-selected onboarding locations,
 * passed from enqueue) is stamped onto EVERY tier as `force_place` so the first
 * dream is set in THEIR place — not a random/generic scene — in every fallback
 * tier, regardless of whether their recipe has persisted yet.
 */
export function buildFirstDreamTiers(cast: CastMemberLike[], place?: string): FirstDreamTier[] {
  const list: CastMemberLike[] = Array.isArray(cast) ? cast : [];
  const tiers: FirstDreamTier[] = [];

  if (usable(list, 'self') && usable(list, 'plus_one')) {
    tiers.push({
      name: 'dual',
      body: { force_cast_role: 'dual', force_face_swap_eligible: true, strict_face_swap: true },
    });
    tiers.push({
      name: 'self',
      body: { force_cast_role: 'self', force_face_swap_eligible: true, strict_face_swap: true },
    });
  } else if (usable(list, 'self')) {
    tiers.push({
      name: 'self',
      body: { force_cast_role: 'self', force_face_swap_eligible: true, strict_face_swap: true },
    });
  } else if (usable(list, 'plus_one')) {
    tiers.push({
      name: 'plus_one',
      body: { force_cast_role: 'plus_one', force_face_swap_eligible: true, strict_face_swap: true },
    });
  } else if (usable(list, 'pet')) {
    tiers.push({
      name: 'pet',
      body: { force_cast_role: 'pet', force_face_swap_eligible: true, strict_face_swap: true },
    });
  }

  // Final tier — explicit null force_cast_role → rollDream lands on
  // includeCharacter=false → pure_scene anchored to the user's location.
  // Works even if the user uploaded zero cast photos. strict_face_swap omitted:
  // scene-only doesn't swap, so there's nothing to cascade past here.
  tiers.push({ name: 'scene', body: { force_cast_role: null } });

  // Mandate the user's chosen location across every tier (cast tiers + the
  // scene fallback), so the first dream always lands in one of their places.
  const trimmed = typeof place === 'string' ? place.trim() : '';
  if (trimmed) {
    for (const t of tiers) t.body.force_place = trimmed;
  }
  return tiers;
}
