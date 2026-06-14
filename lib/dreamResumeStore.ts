/**
 * Cold-start dream resume — orchestration.
 *
 * The pure decision lives in dreamResume.ts (unit + stress tested); the
 * AsyncStorage marker lives in dreamInFlightMarker.ts (dependency-light). This
 * file is the thin side-effecting runner: read the marker, query dream_jobs,
 * decide, and navigate.
 *
 * Run once on cold start by <DreamResumer /> in app/_layout.tsx.
 */

import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import type { DreamJobSnapshot } from '@/lib/dreamJobRecovery';
import { getDreamInFlight, clearDreamInFlight } from '@/lib/dreamInFlightMarker';
import { decideDreamResume, RESUME_MAX_AGE_MS, type DreamResumeDecision } from '@/lib/dreamResume';

/**
 * Cold-start recovery: if a render the user started is now finished (or still in
 * flight), get them back to it. Run once on app launch after auth + interactions.
 * Returns the action taken (for tests/telemetry).
 */
export async function resumeInFlightDream(): Promise<DreamResumeDecision['action']> {
  const persisted = await getDreamInFlight();
  if (!persisted) return 'ignore';

  const currentUserId = useAuthStore.getState().user?.id ?? null;

  let job: (DreamJobSnapshot & { user_id?: string | null }) | null = null;
  if (currentUserId) {
    try {
      const { data } = await supabase
        .from('dream_jobs')
        .select(
          'status, upload_id, result_image_url, result_prompt, result_medium, result_vibe, error, user_id'
        )
        .eq('id', persisted.jobId)
        .maybeSingle();
      job = (data as (DreamJobSnapshot & { user_id?: string | null }) | null) ?? null;
    } catch (e) {
      // Transient query failure — leave the marker and try again next launch.
      if (__DEV__) console.warn('[dreamResume] dream_jobs query failed', e);
      return 'ignore';
    }
  }

  const decision = decideDreamResume({
    persisted,
    job,
    nowMs: Date.now(),
    maxAgeMs: RESUME_MAX_AGE_MS,
    currentUserId,
  });

  switch (decision.action) {
    case 'reveal':
      useDreamStore.getState().setActiveJobId(persisted.jobId);
      useDreamStore.getState().setResult(decision.result);
      await clearDreamInFlight();
      router.push('/dream/reveal');
      break;
    case 'resumeLoading':
      useDreamStore.getState().setActiveJobId(decision.jobId);
      router.push('/dream/loading?resume=1');
      break;
    case 'clear':
      await clearDreamInFlight();
      break;
    case 'ignore':
      break;
  }
  return decision.action;
}
