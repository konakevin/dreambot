/**
 * FormLabel — eyebrow-style form row label ("MEDIUM", "VIBE", "AI MODEL").
 *
 * One treatment for every control label on the Create form: uppercase with
 * wide tracking and a bolder weight, so the small size reads as a deliberate
 * system label instead of shrunken body text (Kevin 2026-07-09: the old
 * 12px/500 mixed-case labels felt tiny and hard to read). Pass `style` to
 * override size for compact contexts (the keyboard-collapsed summary row).
 */

import type { StyleProp, TextStyle } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale } from '@/lib/responsive';

export function FormLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          color: colors.textSecondary,
          fontSize: fontScale(11),
          fontWeight: '700',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
