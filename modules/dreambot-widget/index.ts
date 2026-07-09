/**
 * JS API for the DreamBot Home Screen widget bridge (iOS only).
 *
 * The native module only exists in builds made AFTER the widget shipped, and
 * only on iOS — every export here degrades to a no-op when it's absent, so
 * OTA'd JS can call this unconditionally without crashing older binaries.
 */

import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';

interface DreamBotWidgetNativeModule {
  getAppGroupWidgetDir(): string | null;
  setWidgetState(json: string): void;
  countJsLoad(): number;
}

const native =
  Platform.OS === 'ios'
    ? requireOptionalNativeModule<DreamBotWidgetNativeModule>('DreamBotWidget')
    : null;

/**
 * True on the FIRST JS load of this native process, false after a dev/Metro
 * reload. iOS re-reports the launch deep link (e.g. a widget tap's
 * dreambot://photo/<id>) to every reloaded JS context; app/+native-intent.ts
 * uses this to honor the URL exactly once per process. Evaluated at module
 * scope so the native counter ticks exactly once per JS context. Defaults to
 * true when the native module is absent (Android / pre-widget binaries) —
 * never suppress real launches.
 */
export const isFirstJsLoad: boolean = (() => {
  try {
    return (native?.countJsLoad() ?? 1) === 1;
  } catch {
    return true;
  }
})();

/** Whether this binary supports the widget bridge. */
export function isWidgetSupported(): boolean {
  return !!native;
}

/** Shared App Group directory widget images are written into (absolute path,
 *  no file:// prefix), or null when unsupported. */
export function getAppGroupWidgetDir(): string | null {
  return native?.getAppGroupWidgetDir() ?? null;
}

export interface WidgetDreamRef {
  id: string;
  file: string;
}

/** Commit the widget state + reload the widget timelines. */
export function setWidgetState(dreams: WidgetDreamRef[]): void {
  native?.setWidgetState(JSON.stringify({ dreams, updatedAt: Date.now() }));
}
