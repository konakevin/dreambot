/**
 * Custom ESLint rule: flag a CONTROLLED <TextInput> (has `value` or
 * `defaultValue`) that ALSO has children.
 *
 * WHY (New Post caption bug, 2026-08-07): on the React Native New Architecture
 * (Fabric), a controlled TextInput whose `value` is set AND that has text
 * children double-applies the content — every keystroke re-appends the entire
 * value, so all preceding characters "collectively repeat". The composer became
 * unusable. This is a native render-behavior bug that jest/RTL cannot reproduce
 * (they mock TextInput and synthesize onChangeText), so a static rule is the only
 * reliable guard.
 *
 * RN's contract: use `value` (controlled) OR children, never both. For colored
 * inline mentions/highlights, use a separate absolutely-positioned overlay <Text>
 * behind a transparent TextInput — not TextInput children.
 *
 * This matches on the JSX element name `TextInput` (covers both react-native's
 * TextInput and the app's @/components/AppText wrapper, both used as
 * `<TextInput>`). Whitespace-only children and comment-only expression containers
 * are ignored (they aren't content).
 *
 * If you ever genuinely need children on an uncontrolled input, this rule won't
 * fire (no value/defaultValue). To suppress in a rare justified case:
 *   // eslint-disable-next-line rn/no-textinput-value-with-children
 */
'use strict';

const CONTROLLED_PROPS = new Set(['value', 'defaultValue']);

// A child that actually contributes text content to the input (so it conflicts
// with a controlled `value`). Indentation/newlines and comment-only `{/* … */}`
// containers do not count.
function isMeaningfulChild(child) {
  if (child.type === 'JSXText') return child.value.trim().length > 0;
  if (child.type === 'JSXExpressionContainer') {
    return !!child.expression && child.expression.type !== 'JSXEmptyExpression';
  }
  // JSXElement / JSXFragment / JSXSpreadChild → real content.
  return true;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow a controlled TextInput (value/defaultValue) that also has children — on the RN New Architecture this double-applies text and repeats every keystroke.',
    },
    schema: [],
    messages: {
      valueAndChildren:
        'This TextInput is controlled (`{{prop}}`) AND has children. On the New Architecture that double-applies the text — every keystroke re-appends the whole value, so characters repeat (the New Post caption bug). Use `value` OR children, never both; for colored inline mentions use an overlay <Text>, not TextInput children.',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = node.openingElement.name;
        if (name.type !== 'JSXIdentifier' || name.name !== 'TextInput') return;

        const controlledAttr = node.openingElement.attributes.find(
          (a) =>
            a.type === 'JSXAttribute' &&
            a.name &&
            a.name.type === 'JSXIdentifier' &&
            CONTROLLED_PROPS.has(a.name.name)
        );
        if (!controlledAttr) return;

        if (!node.children.some(isMeaningfulChild)) return;

        context.report({
          node: node.openingElement,
          messageId: 'valueAndChildren',
          data: { prop: controlledAttr.name.name },
        });
      },
    };
  },
};
