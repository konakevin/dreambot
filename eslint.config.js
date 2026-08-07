// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const security = require('eslint-plugin-security');
const noHardcodedResponsiveUnits = require('./eslint-rules/no-hardcoded-responsive-units');
const noTextInputValueWithChildren = require('./eslint-rules/no-textinput-value-with-children');

// Local custom rules. Defined inline so we don't need a separate npm package
// for what's essentially one rule. To add a new rule: require it above,
// then add it to `responsivePlugin.rules` below + the rules section at the
// bottom of this file.
const responsivePlugin = {
  rules: {
    'no-hardcoded-responsive-units': noHardcodedResponsiveUnits,
  },
};

// Local React Native correctness rules (native-behavior traps that jest/RTL can't
// catch). See eslint-rules/no-textinput-value-with-children.js.
const rnPlugin = {
  rules: {
    'no-textinput-value-with-children': noTextInputValueWithChildren,
  },
};

module.exports = defineConfig([
  expoConfig,
  security.configs.recommended,
  {
    // qa-nightly-coherence.ts is a Deno script (https: imports + Deno globals) —
    // it runs under Deno, not the app toolchain, so exclude it from eslint/tsc.
    ignores: ['dist/*', 'scripts/qa-nightly-coherence.ts'],
  },
  {
    plugins: { responsive: responsivePlugin, rn: rnPlugin },
    rules: {
      // Native-behavior trap: a controlled TextInput with children double-applies
      // text on Fabric → repeated characters (the New Post caption bug, 2026-08-07).
      'rn/no-textinput-value-with-children': 'error',
      // Disabled intentionally: this rule flags every dynamic property access
      // (`arr[i]`, `obj[key]`) as a potential injection sink. In a typed
      // TS/RN codebase those keys are type-constrained, so it fires almost
      // exclusively on false positives (array indexing, enum lookups). It's
      // the noisiest rule in eslint-plugin-security and is widely disabled;
      // the rest of the recommended security rules stay active.
      'security/detect-object-injection': 'off',
      // Custom rule — see eslint-rules/no-hardcoded-responsive-units.js.
      'responsive/no-hardcoded-responsive-units': 'error',
    },
  },
  {
    // The rule exempts the file that defines the scalers (it has to use raw
    // numbers — they're the base constants) and tests (mock literals are fine).
    files: ['lib/responsive.ts', '__tests__/**'],
    rules: { 'responsive/no-hardcoded-responsive-units': 'off' },
  },
]);
