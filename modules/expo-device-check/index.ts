/**
 * Local Expo native module: DeviceCheck token bridge (iOS only).
 *
 * Exposes Apple's DCDevice.generateToken() to JS for the trial-farming gate
 * (TRIAL_FARMING_PREVENTION.md, Anchor A). Consumed via lib/deviceCheck.ts, which
 * adds the fail-open (null) handling; import that, not this, from app code.
 *
 * Scaffolded to the `create-expo-module --local` layout (autolinked from
 * modules/ via expo-module.config.json). If autolinking ever complains, run
 * `npx create-expo-module@latest --local expo-device-check` and drop in the
 * ios/ Swift below.
 */
import { requireOptionalNativeModule } from 'expo';

export type ExpoDeviceCheckModule = {
  /** Base64 DeviceCheck token, or null if the device is unsupported. */
  generateToken(): Promise<string | null>;
};

export default requireOptionalNativeModule<ExpoDeviceCheckModule>('ExpoDeviceCheck');
