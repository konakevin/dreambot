/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Locks the custom ESLint rule that catches the New Post caption bug: a controlled
 * <TextInput> (value/defaultValue) that ALSO has children double-applies text on
 * the RN New Architecture, so every keystroke re-appends the whole value and
 * characters repeat.
 *
 * This is the honest answer to "unit tests should have caught this": a jest render
 * test CAN'T — it mocks TextInput and synthesizes onChangeText, so it never
 * reproduces the native Fabric double-buffer. What catches it is a STATIC rule, and
 * this RuleTester test guards that rule (valid/invalid fixtures) so it can't
 * silently regress. If someone weakens the rule, CI goes red here.
 */
const { RuleTester } = require('eslint');
const rule = require('../../eslint-rules/no-textinput-value-with-children');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-textinput-value-with-children', rule, {
  valid: [
    // Controlled, no children — the correct pattern.
    'const A = () => <TextInput value={x} onChangeText={f} />;',
    'const A = () => <TextInput defaultValue={x} />;',
    // Uncontrolled + children is allowed (no value to conflict with).
    'const A = () => <TextInput>{render(x)}</TextInput>;',
    // Whitespace-only children are not content.
    'const A = () => (\n  <TextInput value={x}>\n  </TextInput>\n);',
    // Comment-only expression container is not content.
    'const A = () => <TextInput value={x}>{/* note */}</TextInput>;',
    // Not a TextInput.
    'const A = () => <View value={x}>{render(x)}</View>;',
  ],
  invalid: [
    {
      code: 'const A = () => <TextInput value={x} onChangeText={f}>{render(x)}</TextInput>;',
      errors: [{ messageId: 'valueAndChildren' }],
    },
    {
      // Multiline with whitespace around a real expression child (the actual bug shape).
      code: 'const A = () => (\n  <TextInput value={x}>\n    {render(x)}\n  </TextInput>\n);',
      errors: [{ messageId: 'valueAndChildren' }],
    },
    {
      code: 'const A = () => <TextInput defaultValue={x}>{c}</TextInput>;',
      errors: [{ messageId: 'valueAndChildren' }],
    },
    {
      // Nested Text children (the exact colored-mention pattern that caused the bug).
      code: 'const A = () => <TextInput value={x}><Text>a</Text><Text>b</Text></TextInput>;',
      errors: [{ messageId: 'valueAndChildren' }],
    },
  ],
});
