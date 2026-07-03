/**
 * Config plugin: disable Sentry source-map auto-upload in Xcode builds.
 *
 * The @sentry/react-native Xcode build phase tries to upload source maps on
 * every build and HARD-FAILS locally with "An organization ID or slug is
 * required (provide with --org)" — we have no org/project/auth token in the
 * local environment, and never have: uploads have always been skipped here.
 * The `dreambot` zsh fn exports SENTRY_DISABLE_AUTO_UPLOAD=true for CLI
 * builds, but Xcode GUI builds don't inherit shell env, and writing the
 * export into ios/.xcode.env.local by hand dies on every `--clean` (Expo
 * regenerates that file with just NODE_BINARY, which is exactly how the
 * error came back on 2026-07-03).
 *
 * So this plugin appends the export to ios/.xcode.env during prebuild —
 * ios/ is gitignored + regenerated, so this runs on every prebuild and the
 * flag can never be lost again. The Xcode build-phase script sources
 * .xcode.env (then .xcode.env.local) before running sentry-cli.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const EXPORT_LINE = '\n# Local builds never upload source maps (no Sentry org/token here).\nexport SENTRY_DISABLE_AUTO_UPLOAD=true\n';

module.exports = function withSentryNoLocalUpload(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const xcodeEnv = path.join(cfg.modRequest.platformProjectRoot, '.xcode.env');
      let contents = fs.existsSync(xcodeEnv) ? fs.readFileSync(xcodeEnv, 'utf8') : '';
      if (!contents.includes('SENTRY_DISABLE_AUTO_UPLOAD')) {
        fs.writeFileSync(xcodeEnv, contents + EXPORT_LINE);
      }
      return cfg;
    },
  ]);
};
