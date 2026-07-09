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
}

const native =
  Platform.OS === 'ios'
    ? requireOptionalNativeModule<DreamBotWidgetNativeModule>('DreamBotWidget')
    : null;

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
