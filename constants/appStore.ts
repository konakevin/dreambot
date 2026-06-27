/**
 * App Store identity + the deep link used by the update gate (ForceUpdateGate).
 *
 * APP_STORE_ID is the App Store Connect numeric app id (eas.json `ascAppId`).
 * `itms-apps://` opens the native App Store app straight to the listing (where
 * the system "Update" button lives) instead of a web tab — the production
 * behavior we want for real users on real devices.
 *
 * Note: the Simulator has no App Store app, so this link is a no-op there; test
 * the button on a physical device. (To temporarily eyeball the handoff on the
 * Simulator, swap to `https://apps.apple.com/app/id${APP_STORE_ID}`, which opens
 * the web listing in Safari.)
 */

export const APP_STORE_ID = '6761505205';

/** Deep link to the DreamBot App Store listing (opens the native Store app). */
export const APP_STORE_UPDATE_URL = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}`;
