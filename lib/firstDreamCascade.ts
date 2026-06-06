/**
 * First-dream tier cascade. Extracted from RevealStep (2026-06-06) so the
 * onboarding component stays under the 800-line maintainability ceiling.
 *
 * Routes the user's first dream through the NIGHTLY engine with a forced
 * cast face-swap so the result is unmistakably "this is ME" in one of my
 * places. `force_face_swap_eligible` pins the medium to the face-swap-
 * capable pool so the swap lands cleanly.
 *
 * Reliability cascade: server returns 422 on face-swap exhaustion / NSFW
 * guardrail / worker limit instead of a degraded render. The client then
 * tries the next tier on a fresh call:
 *
 *   1. dual swap (if self + plus_one) →
 *   2. single swap (whichever single cast role is available) →
 *   3. scene-only render (no cast, location-anchored personalized scene)
 *
 * The user never sees a face-swap error or an NSFW label — those are
 * shame-free retries that resolve transparently. Only when ALL tiers fail
 * does the caller surface a generic retry UI.
 */

import { supabase } from '@/lib/supabase';
import type { VibeProfile } from '@/types/vibeProfile';

interface FirstDreamResult {
  url: string;
  prompt: string;
  medium?: string;
  vibe?: string;
  uploadId?: string;
}

interface Tier {
  name: string;
  body: Record<string, unknown>;
}

function buildTiers(profile: VibeProfile): Tier[] {
  const cast = profile.dream_cast ?? [];
  const usable = (role: string) =>
    cast.find((m) => m.role === role && !!m.thumb_url && m.thumb_url.startsWith('http'));

  const tiers: Tier[] = [];
  if (usable('self') && usable('plus_one')) {
    tiers.push({
      name: 'dual',
      body: { force_cast_role: 'dual', force_face_swap_eligible: true, strict_face_swap: true },
    });
    tiers.push({
      name: 'self',
      body: { force_cast_role: 'self', force_face_swap_eligible: true, strict_face_swap: true },
    });
  } else if (usable('self')) {
    tiers.push({
      name: 'self',
      body: { force_cast_role: 'self', force_face_swap_eligible: true, strict_face_swap: true },
    });
  } else if (usable('plus_one')) {
    tiers.push({
      name: 'plus_one',
      body: {
        force_cast_role: 'plus_one',
        force_face_swap_eligible: true,
        strict_face_swap: true,
      },
    });
  } else if (usable('pet')) {
    tiers.push({
      name: 'pet',
      body: { force_cast_role: 'pet', force_face_swap_eligible: true, strict_face_swap: true },
    });
  }
  // Final tier — explicit null force_cast_role → server's rollDream lands on
  // includeCharacter=false → pure_scene composition anchored to the user's
  // location. Works even if the user uploaded zero cast photos.
  // strict_face_swap omitted intentionally — scene-only doesn't swap.
  tiers.push({ name: 'scene', body: { force_cast_role: null } });
  return tiers;
}

export async function generateFirstDreamCascade(profile: VibeProfile): Promise<FirstDreamResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');

  const tiers = buildTiers(profile);
  let lastErr: Error | null = null;

  for (const tier of tiers) {
    try {
      if (__DEV__) console.log('[Reveal] tier attempt:', tier.name);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/nightly-dreams`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ vibe_profile: profile, ...tier.body }),
        }
      );

      if (res.status === 422) {
        // Cascadeable failure (face_swap_failed_dual / face_swap_failed_single
        // / render_blocked). Try the next tier silently.
        const errBody = await res.text();
        if (__DEV__) console.log('[Reveal] tier cascade:', tier.name, '→', errBody);
        lastErr = new Error(`cascade:${tier.name}:${errBody}`);
        continue;
      }

      if (!res.ok) {
        // Non-cascadeable error (auth / 500 / network) — bail out so the user
        // sees the retry UI rather than spending budget on more failed renders.
        const errBody = await res.text();
        if (__DEV__) console.warn('[Reveal] tier hard fail:', tier.name, res.status, errBody);
        throw new Error(`Generation failed: ${res.status}`);
      }

      const data = await res.json();
      if (!data.image_url) throw new Error('No image URL in response');
      if (__DEV__) console.log('[Reveal] tier succeeded:', tier.name);
      return {
        url: data.image_url,
        prompt: data.prompt_used ?? '',
        medium: data.resolved_medium ?? undefined,
        vibe: data.resolved_vibe ?? undefined,
        uploadId: data.upload_id ?? undefined,
      };
    } catch (err) {
      lastErr = err as Error;
      // Network-level errors (DNS, connection drop) also cascade — the user
      // shouldn't pay for a single-network-blip first impression.
      if (__DEV__) console.warn('[Reveal] tier exception:', tier.name, lastErr.message);
    }
  }
  throw lastErr ?? new Error('All tiers exhausted');
}
