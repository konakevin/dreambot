// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const security = require('eslint-plugin-security');

module.exports = defineConfig([
  expoConfig,
  security.configs.recommended,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Disabled intentionally: this rule flags every dynamic property access
      // (`arr[i]`, `obj[key]`) as a potential injection sink. In a typed
      // TS/RN codebase those keys are type-constrained, so it fires almost
      // exclusively on false positives (array indexing, enum lookups). It's
      // the noisiest rule in eslint-plugin-security and is widely disabled;
      // the rest of the recommended security rules stay active.
      'security/detect-object-injection': 'off',
    },
  },
]);
