/**
 * First-dream kickoff (onboarding) — extracted from RevealStep (2026-06-18) so it
 * can run at the "Save & continue" CUTOFF step in the BACKGROUND while the user
 * picks bots, then be awaited at the reveal step.
 *
 * Sequence: describe cast photos → persist the vibe profile → fire-and-forget
 * end-of-onboarding bookkeeping → enqueue the free first dream → return the jobId
 * (the reveal screen polls it via awaitFirstDream). Throws
 * FirstDreamAlreadyClaimedError (from enqueueFirstDream) for a returning user.
 */

import { supabase } from '@/lib/supabase';
import { fetchEdge } from '@/lib/edgeFunction';
import { castSignedUrl } from '@/lib/castPhoto';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { grantWelcomeBonus } from '@/lib/welcomeBonus';
import { enqueueFirstDream } from '@/lib/firstDreamQueue';
import { trackOnboardingCompleted } from '@/lib/analytics';
import type { VibeProfile, DreamCastMember } from '@/types/vibeProfile';

// Race a promise against a timeout so a stalled network call never traps the
// kickoff — the underlying request keeps running, we just stop waiting on it.
function withTimeout<T>(p: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

// AI-vision describe each cast photo once (gender / age / physical summary feed the
// face-swap brief). Best-effort per member — a failed/timed-out describe keeps the
// member unchanged.
async function describeCastPhotos(cast: DreamCastMember[]): Promise<DreamCastMember[]> {
  return Promise.all(
    cast.map(async (member) => {
      if (member.description) return member;
      // Resolve a fetchable URL: a signed URL for a private storage_path, or the
      // legacy public thumb_url. (Normally a no-op — the cast was described at
      // upload time — but this is the kickoff's safety re-describe.)
      const src = member.storage_path ? await castSignedUrl(member.storage_path) : member.thumb_url;
      if (!src || src.startsWith('file://')) return member; // need a public URL
      try {
        const res = await fetchEdge('describe-photo', {
          image_url: src,
          role: member.role,
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        return {
          ...member,
          description: data.description ?? '',
          ...(data.gender ? { gender: data.gender } : {}),
          ...(typeof data.age === 'number' ? { age: data.age } : {}),
          ...(data.physical_summary ? { physical_summary: data.physical_summary } : {}),
          ...(data.ethnicity ? { ethnicity: data.ethnicity } : {}),
        };
      } catch (err) {
        if (__DEV__) console.warn(`[firstDreamKickoff] describe ${member.role} failed:`, err);
        return member;
      }
    })
  );
}

// End-of-onboarding bookkeeping — best-effort, idempotent, timeout-guarded:
//   • welcome sparkles (idempotent per migration 258; missed grant rescued by
//     reconcileWelcomeBonus on the feed)
//   • welcome-gift notification (routes by TYPE; no upload_id needed)
//   • completion analytics
async function finalizeOnboarding(userId: string, welcomeBonus: number): Promise<void> {
  trackOnboardingCompleted();
  try {
    await withTimeout(grantWelcomeBonus(userId, welcomeBonus), 10000);
    await withTimeout(
      supabase.from('notifications').insert({
        recipient_id: userId,
        actor_id: userId,
        type: 'welcome_gift',
      }),
      10000
    );
  } catch (err) {
    if (__DEV__) console.warn('[firstDreamKickoff] finalize failed:', err);
  }
}

/**
 * Run the full kickoff and return the dream jobId. Safe to call detached (not
 * awaited) from the cutoff step — describe + save are timeout-guarded and
 * finalize is fire-and-forget, so it can never hang the UI.
 */
const fdt = () => new Date().toISOString().slice(11, 23);
const fdCast = (cast: DreamCastMember[]) =>
  JSON.stringify(cast.map((c) => ({ role: c.role, storage_path: !!c.storage_path })));

export async function startFirstDream(
  profile: VibeProfile,
  userId: string,
  welcomeBonus: number
): Promise<string> {
  if (__DEV__)
    console.log(`[FD ${fdt()}] startFirstDream CALLED cast=${fdCast(profile.dream_cast)}`);
  // 1. describe cast (proceed with what we have on a stall)
  let describedCast = profile.dream_cast;
  try {
    describedCast = await withTimeout(describeCastPhotos(profile.dream_cast), 45000);
  } catch (err) {
    if (__DEV__) console.warn('[firstDreamKickoff] describe stalled, proceeding:', err);
  }
  const described: VibeProfile = { ...profile, dream_cast: describedCast };

  // 2. persist the profile (idempotent — re-saved on edit anyway)
  try {
    await withTimeout(saveVibeProfile(userId, described), 15000);
  } catch (err) {
    if (__DEV__) console.warn('[firstDreamKickoff] save stalled, proceeding:', err);
  }

  // 3. end-of-onboarding bookkeeping — fire-and-forget (never blocks the dream)
  void finalizeOnboarding(userId, welcomeBonus);

  // 4. enqueue → jobId (throws FirstDreamAlreadyClaimedError on 409)
  if (__DEV__)
    console.log(`[FD ${fdt()}] startFirstDream ENQUEUEING cast=${fdCast(described.dream_cast)}`);
  return enqueueFirstDream(described);
}
