/**
 * Config plugin: declare GoogleUtilities + RecaptchaInterop with modular headers.
 *
 * @react-native-google-signin pulls in AppCheckCore (a Swift pod) which depends
 * on GoogleUtilities + RecaptchaInterop. Those two ship WITHOUT module maps, so
 * CocoaPods refuses to integrate the Swift pod as a static library:
 *   "The following Swift pods cannot yet be integrated as static libraries…"
 * The fix CocoaPods itself recommends is `:modular_headers => true` on the
 * offending dependencies, which makes it generate module maps for them.
 *
 * We can't use expo-build-properties `ios.extraPods` for this: that plugin only
 * writes `apple.extraPods` into Podfile.properties.json, and this SDK's generated
 * Podfile template never reads that key — so it's a no-op. Instead we edit the
 * Podfile directly (ios/ is gitignored + regenerated on every EAS build, so this
 * runs every build). Pods resolve fresh each build, which is why a transitive
 * GoogleSignIn bump introduced this after 2026-05-28 with no change on our side.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const POD_LINES = [
  "  pod 'GoogleUtilities', :modular_headers => true",
  "  pod 'RecaptchaInterop', :modular_headers => true",
].join('\n');

module.exports = function withGoogleModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf8');
      if (!contents.includes("pod 'GoogleUtilities', :modular_headers")) {
        // Insert the pod declarations just after `use_expo_modules!`, inside the
        // app target block.
        contents = contents.replace(
          /(\n[ \t]*use_expo_modules!\n)/,
          `$1${POD_LINES}\n`
        );
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
