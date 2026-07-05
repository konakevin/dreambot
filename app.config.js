// Dynamic Expo config — reads sensitive values from env at config-time so
// they don't have to live in git. Replaces the previous static app.json.
//
// Local dev: `.env.local` is loaded automatically via dotenv.
// EAS Build: required env vars must be set via `eas secret:create` or
//   eas.json's `build.<profile>.env` block. See README / ROTATION.md.

require('dotenv').config({ path: '.env.local' });

const requiredVars = ['FACEBOOK_APP_ID', 'FACEBOOK_CLIENT_TOKEN'];
for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(
      `Missing required env var: ${v}. Set it in .env.local (local dev) or via EAS secrets (CI).`
    );
  }
}

const FB_APP_ID = process.env.FACEBOOK_APP_ID;
const FB_CLIENT_TOKEN = process.env.FACEBOOK_CLIENT_TOKEN;

module.exports = {
  expo: {
    name: 'DreamBot',
    slug: 'dreambot',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'dreambot',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.konakevin.radorbad',
      associatedDomains: ['applinks:dreambotapp.com'],
      infoPlist: {
        // No non-exempt encryption (standard HTTPS only) — skips the App Store
        // export-compliance prompt on every submission.
        ITSAppUsesNonExemptEncryption: false,
        // Facebook SDK is used for LOGIN ONLY. Disable its default auto-event
        // logging + advertiser-ID collection so the app does no ad "tracking" —
        // keeps the App Privacy "Tracking" answer truthfully "No" (a tracking=yes
        // label with no ATT prompt is an auto-reject).
        FacebookAutoLogAppEventsEnabled: false,
        FacebookAdvertiserIDCollectionEnabled: false,
        NSCameraUsageDescription:
          'DreamBot uses your camera to capture photos for AI dream generation.',
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.523080499421-ct234o3eo93kuakii3df5j29apa61j5h',
            ],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#000000',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.konakevin.radorbad',
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          sounds: ['./assets/sounds/notification.wav'],
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow DreamBot to save photos to your library.',
        },
      ],
      // expo-camera is autolinked; list it explicitly to pass options.
      // microphonePermission:false omits NSMicrophoneUsageDescription (DreamBot
      // captures photos only, never audio/video) — keeps the custom camera string.
      [
        'expo-camera',
        {
          cameraPermission: 'DreamBot uses your camera to capture photos for AI dream generation.',
          microphonePermission: false,
          recordAudioAndroid: false,
        },
      ],
      [
        'expo-splash-screen',
        {
          // The DreamBot gradient wordmark on black. imageWidth is in points +
          // resizeMode 'contain', so 220pt is density-independent and fits even
          // SE-class (320pt) with margin — responsive across every screen.
          image: './assets/images/splash-wordmark.png',
          imageWidth: 220,
          resizeMode: 'contain',
          backgroundColor: '#000000',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      // faceIDPermission:false omits NSFaceIDUsageDescription — SecureStore
      // stores tokens in the Keychain without biometric prompts, so the
      // Face ID usage string is unused and only invites reviewer questions.
      ['expo-secure-store', { faceIDPermission: false }],
      'expo-web-browser',
      'expo-video',
      'react-native-compressor',
      '@react-native-google-signin/google-signin',
      [
        'react-native-fbsdk-next',
        {
          appID: FB_APP_ID,
          clientToken: FB_CLIENT_TOKEN,
          displayName: 'DreamBot',
          scheme: `fb${FB_APP_ID}`,
        },
      ],
      [
        'expo-build-properties',
        {
          // Min iOS 16.0 — aligns the supported floor with the responsive
          // design floor (375pt / iPhone SE 2nd-3rd gen). Drops 2015-2016
          // hardware (iPhone 6s/7/SE-1st-gen = 320pt wide), which is below the
          // scale engine's design base anyway. Default would be 15.1.
          ios: { deploymentTarget: '16.0' },
        },
      ],
      // Generate module maps for GoogleUtilities + RecaptchaInterop so the Swift
      // pod AppCheckCore (pulled in by @react-native-google-signin) integrates as
      // a static library. See plugins/withGoogleModularHeaders.js for the why.
      './plugins/withGoogleModularHeaders',
      // Sentry — sets up the native crash handler + (with SENTRY_AUTH_TOKEN +
      // org/project at build time) symbolicated source-map upload. Runtime
      // capture is no-op until EXPO_PUBLIC_SENTRY_DSN is set (see lib/sentry.ts).
      '@sentry/react-native',
      // Bake SENTRY_DISABLE_AUTO_UPLOAD=true into ios/.xcode.env on every
      // prebuild — Xcode GUI builds don't inherit shell env, and hand-edits to
      // .xcode.env.local are wiped by `--clean`. See the plugin header.
      './plugins/withSentryNoLocalUpload',
      // expo-localization — required peer dep of posthog-react-native (device
      // locale for analytics context). See lib/posthog.ts.
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '014926a1-297b-4abf-9184-a01979a83879',
      },
    },
    owner: 'konakevin',
  },
};
