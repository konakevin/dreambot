/**
 * In-flight dream marker — a tiny AsyncStorage record so an app KILL during a
 * user-initiated render can be recovered on the next cold start.
 *
 * Dependency-light on purpose (only AsyncStorage) so any module — including
 * store/auth.ts on sign-out — can clear it without a circular import. The
 * cold-start recovery decision + orchestration live in dreamResume.ts (pure) and
 * dreamResumeStore.ts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedDreamJob } from '@/lib/dreamResume';

const STORAGE_KEY = 'dreambot.inFlightDream.v1';

export async function markDreamInFlight(jobId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ jobId, ts: Date.now() }));
  } catch (e) {
    if (__DEV__) console.warn('[dreamResume] mark failed', e);
  }
}

export async function clearDreamInFlight(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    if (__DEV__) console.warn('[dreamResume] clear failed', e);
  }
}

export async function getDreamInFlight(): Promise<PersistedDreamJob | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as PersistedDreamJob).jobId === 'string' &&
      typeof (parsed as PersistedDreamJob).ts === 'number'
    ) {
      return { jobId: (parsed as PersistedDreamJob).jobId, ts: (parsed as PersistedDreamJob).ts };
    }
    return null;
  } catch {
    return null;
  }
}
