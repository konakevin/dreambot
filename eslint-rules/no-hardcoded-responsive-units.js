/**
 * Custom ESLint rule: flag hardcoded vertical-axis sizing values that
 * should go through `@/lib/responsive` scaler functions.
 *
 * The responsive convention (see CLAUDE.md → "Responsive sizing"):
 *   - fontSize / lineHeight        → fontScale(N)
 *   - paddingVertical / paddingTop /
 *     paddingBottom / marginTop /
 *     marginBottom                 → verticalScale(N)
 *
 * Without scaling, iPhone SE-class devices (height 667pt vs the iPhone 14
 * base 844pt) truncate content because layouts authored at the base size
 * overflow. This rule prevents regression by failing CI on any new
 * hardcoded numeric literal for the flagged properties.
 *
 * Allowed:
 *   - The value 0 (intentional zero — never a responsive concern)
 *   - Already-scaled values (CallExpressions, MemberExpressions, etc.
 *     that aren't numeric Literals)
 *   - `lib/responsive.ts` itself (defines the helpers)
 *   - Test files (mock literals)
 *
 * If you genuinely need a hardcoded value (rare — visual constant like a
 * 1px hairline, a borderRadius, etc.), suppress with:
 *   // eslint-disable-next-line responsive/no-hardcoded-responsive-units
 */
'use strict';

const FONT_PROPS = new Set(['fontSize', 'lineHeight']);
const SPACE_PROPS = new Set([
  'paddingVertical',
  'paddingTop',
  'paddingBottom',
  'marginTop',
  'marginBottom',
]);
const ALL_PROPS = new Set([...FONT_PROPS, ...SPACE_PROPS]);

function scalerFor(propName) {
  return FONT_PROPS.has(propName) ? 'fontScale' : 'verticalScale';
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hardcoded numeric literals for responsive sizing properties (use lib/responsive scalers).',
    },
    schema: [],
    messages: {
      hardcoded:
        "Hardcoded {{prop}}: {{value}}. Wrap with {{scaler}}({{value}}) from @/lib/responsive so it scales on iPhone SE. (See CLAUDE.md → 'Responsive sizing'.)",
    },
  },
  create(context) {
    return {
      Property(node) {
        // Only consider plain identifier keys (`fontSize: …`), not computed
        // or string keys (those are typically dynamic / generated).
        if (node.computed) return;
        const key = node.key;
        const propName = key.type === 'Identifier' ? key.name : null;
        if (!propName || !ALL_PROPS.has(propName)) return;

        const v = node.value;

        // Numeric literal: `fontSize: 16`
        if (v.type === 'Literal' && typeof v.value === 'number') {
          if (v.value === 0) return; // 0 is fine
          context.report({
            node: v,
            messageId: 'hardcoded',
            data: {
              prop: propName,
              value: String(v.value),
              scaler: scalerFor(propName),
            },
          });
          return;
        }

        // Negative numeric literal: `marginTop: -8` is parsed as
        // UnaryExpression(operator=-, argument=Literal(8)).
        if (
          v.type === 'UnaryExpression' &&
          v.operator === '-' &&
          v.argument.type === 'Literal' &&
          typeof v.argument.value === 'number' &&
          v.argument.value !== 0
        ) {
          context.report({
            node: v,
            messageId: 'hardcoded',
            data: {
              prop: propName,
              value: `-${v.argument.value}`,
              scaler: scalerFor(propName),
            },
          });
        }
      },
    };
  },
};
