/**
 * ExpandableDescription — tap-to-expand the truncated caption beneath a
 * DreamCard. Extracted from DreamCard (2026-06-06).
 */

import { useState } from 'react';
import { Text, type TextStyle, type StyleProp } from 'react-native';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
}

export function ExpandableDescription({ text, style }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Text
      style={style}
      numberOfLines={expanded ? undefined : 1}
      onPress={() => setExpanded((v) => !v)}
    >
      {text}
    </Text>
  );
}
