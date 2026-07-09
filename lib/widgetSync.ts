/**
 * widgetSync — feeds the iOS Home Screen widget (targets/widget).
 *
 * Pushes the user's latest dreams into the App Group container the widget
 * reads: downloads the display-sized images (widgets have a hard memory
 * ceiling — never the HQ originals) into the shared directory, prunes stale
 * files, then commits the state JSON via modules/dreambot-widget (which also
 * reloads the widget timelines).
 *
 * Fire-and-forget from its call sites (app foreground heartbeat + dream
 * reveal): every failure path is swallowed after a dev warn, and every call
 * no-ops on Android / on binaries built before the widget existed.
 */

import { Directory, File } from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import {
  getAppGroupWidgetDir,
  isWidgetSupported,
  setWidgetState,
  type WidgetDreamRef,
} from '@/modules/dreambot-widget';

/** How many dreams the widget rotates through. */
const WIDGET_DREAM_COUNT = 6;

let inFlight = false;

export async function syncDreamWidget(): Promise<void> {
  if (inFlight || !isWidgetSupported()) return;
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return;
  inFlight = true;
  try {
    const dirPath = getAppGroupWidgetDir();
    if (!dirPath) return;

    const { data, error } = await supabase
      .from('uploads')
      .select('id, image_url, image_url_display')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(WIDGET_DREAM_COUNT);
    if (error) throw error;

    const dir = new Directory(`file://${dirPath}`);
    const refs: WidgetDreamRef[] = [];
    for (const row of data ?? []) {
      const url = (row.image_url_display as string | null) ?? (row.image_url as string | null);
      if (!url) continue;
      const file = new File(dir, `${row.id}.jpg`);
      try {
        if (!file.exists) {
          await File.downloadFileAsync(url, file);
        }
        refs.push({ id: row.id as string, file: `${row.id}.jpg` });
      } catch (err) {
        if (__DEV__) console.warn('[widgetSync] image download failed', row.id, err);
      }
    }

    // Prune files from dreams that fell out of the rotation (deletes included).
    const keep = new Set(refs.map((r) => r.file));
    try {
      for (const entry of dir.list()) {
        if (entry instanceof File && !keep.has(entry.name)) entry.delete();
      }
    } catch {
      /* pruning is best-effort */
    }

    setWidgetState(refs);
  } catch (err) {
    if (__DEV__) console.warn('[widgetSync] failed', err);
  } finally {
    inFlight = false;
  }
}
