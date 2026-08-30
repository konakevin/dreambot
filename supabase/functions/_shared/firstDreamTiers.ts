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
 * Tiers, in order (each a fresh isolate → a re-rolled medium/model/pose):
 *   1. dual swap (self + plus_one) →
 *   2. single self swap →
 *   3. single self swap, RETRIED (a fresh roll — a solo swap can miss on a given
 *      composition, and the user's own face beats a faceless scene) →
 *   4. scene-only render (no cast — works even with zero cast photos)
 *
 * Single-only casts (self / plus_one / pet, no partner) get the same two swap
 * attempts before the scene fallback.
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

  // A single face-swap tier body: force this cast role on the strict (no-degrade)
  // face-swap path, so a miss cascades to the next tier instead of shipping a
  // wrong/absent face.
  const swapBody = (role: string) => ({
    force_cast_role: role,
    force_face_swap_eligible: true,
    strict_face_swap: true,
  });

  if (usable(list, 'self') && usable(list, 'plus_one')) {
    // ONE dual (couple) attempt, then TWO single-self attempts before the faceless
    // scene fallback (Kevin 2026-08-30). Landing the user's OWN face in their first
    // dream beats a faceless scene, and a solo swap can miss on a given composition
    // (the solo-swap guard rejects an invented 2nd person / wrong gender), so give
    // it a second, fresh-rolled shot. Each tier is its own isolate → a different
    // medium/model/pose, so the retry is a genuine second chance, not a re-run.
    tiers.push({ name: 'dual', body: swapBody('dual') });
    tiers.push({ name: 'self', body: swapBody('self') });
    tiers.push({ name: 'self_retry', body: swapBody('self') });
  } else if (usable(list, 'self')) {
    // No partner — two self attempts before scene (same reasoning).
    tiers.push({ name: 'self', body: swapBody('self') });
    tiers.push({ name: 'self_retry', body: swapBody('self') });
  } else if (usable(list, 'plus_one')) {
    tiers.push({ name: 'plus_one', body: swapBody('plus_one') });
    tiers.push({ name: 'plus_one_retry', body: swapBody('plus_one') });
  } else if (usable(list, 'pet')) {
    tiers.push({ name: 'pet', body: swapBody('pet') });
    tiers.push({ name: 'pet_retry', body: swapBody('pet') });
  }

  // Final tier — explicit null force_cast_role → rollDream lands on
  // includeCharacter=false → pure_scene anchored to the user's location.
  // Works even if the user uploaded zero cast photos. strict_face_swap omitted:
  // scene-only doesn't swap, so there's nothing to cascade past here.
  tiers.push({ name: 'scene', body: { force_cast_role: null } });

  // First-dream renders must NEVER use GPT Image 2 — it's too slow (60-120s) and
  // risks the onboarding loading timeout. Mark every tier so nightly-dreams bans
  // gpt-image-2 for FIRST DREAMS ONLY (nightlies still legitimately pin
  // lego/pixels to it). The face-swap tiers already skip gpt via the Flux-only
  // picker; this also covers the scene-only fallback tier (incl. lego/pixels pins).
  for (const t of tiers) t.body.first_dream = true;

  // Mandate the user's chosen location across every tier (cast tiers + the
  // scene fallback), so the first dream always lands in one of their places.
  const trimmed = typeof place === 'string' ? place.trim() : '';
  if (trimmed) {
    for (const t of tiers) t.body.force_place = trimmed;
  }
  return tiers;
}
