/**
 * Client bridge to the native DeviceCheck module (modules/expo-device-check).
 * Returns a base64 device token for the server's trial-farming gate
 * (TRIAL_FARMING_PREVENTION.md, Anchor A), or null wherever it's unavailable —
 * the iOS Simulator, an older build without the native module, or Android.
 *
 * The server treats null as "unattested" and FAILS OPEN, so a missing token
 * never blocks onboarding. This wrapper never throws.
 */

import { requireOptionalNativeModule } from 'expo';

type DeviceCheckNative = { generateToken(): Promise<string | null> };

// requireOptionalNativeModule returns null (instead of throwing) when the native
// module isn't present — exactly the "not built yet / simulator / Android" case.
const native = requireOptionalNativeModule<DeviceCheckNative>('ExpoDeviceCheck');

export async function getDeviceCheckToken(): Promise<string | null> {
  if (!native) return null;
  try {
    const token = await native.generateToken();
    return token ?? null;
  } catch {
    return null;
  }
}
