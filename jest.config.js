module.exports = {
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@engine/(.*)$': '<rootDir>/supabase/functions/_shared/$1',
    // Map Deno-style .ts imports used by _shared files
    '^\\.\\./vibeProfile\\.ts$': '<rootDir>/types/vibeProfile',
    '^\\.\\./recipe\\.ts$': '<rootDir>/types/recipe',
    '^\\./vibeProfile\\.ts$': '<rootDir>/types/vibeProfile',
    '^\\./recipe\\.ts$': '<rootDir>/types/recipe',
    '^\\./castResolver\\.ts$': '<rootDir>/supabase/functions/_shared/castResolver',
    '^\\./genderLock\\.ts$': '<rootDir>/supabase/functions/_shared/genderLock',
    '^\\./llm\\.ts$': '<rootDir>/supabase/functions/_shared/llm',
    '^\\./renderEntity\\.ts$': '<rootDir>/supabase/functions/_shared/renderEntity',
    '^\\./persistence\\.ts$': '<rootDir>/supabase/functions/_shared/persistence',
    // Map Deno URL imports to mocks
    '^https://esm\\.sh/@supabase/supabase-js@2$': '<rootDir>/__tests__/__mocks__/supabase-esm.js',
    '^https://esm\\.sh/@jsquash/.*$': '<rootDir>/__tests__/__mocks__/jsquash-stub.js',
    '^https://esm\\.sh/thumbhash@.*$': '<rootDir>/__tests__/__mocks__/thumbhash-stub.js',
    // Native analytics/crash SDKs — stub so transitive imports don't crash jest.
    '^posthog-react-native$': '<rootDir>/__tests__/__mocks__/posthog-react-native.js',
    '^@sentry/react-native$': '<rootDir>/__tests__/__mocks__/sentry-react-native.js',
  },
  globals: {
    __DEV__: true,
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { caller: { name: 'metro' } }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|nativewind)',
  ],
};
