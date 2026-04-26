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
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'dreambot',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.konakevin.radorbad',
      associatedDomains: ['applinks:dreambotapp.com'],
      infoPlist: {
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
        backgroundColor: '#E6F4FE',
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
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-secure-store',
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
      'expo-build-properties',
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
