/**
 * ExpandableDescription — tap-to-expand the truncated caption beneath a
 * DreamCard. Extracted from DreamCard (2026-06-06).
 *
 * Hashtags + mentions (2026-07-05): #tags and @mentions render as tappable
 * links (same treatment as CommentRow's comment mentions). Nested Text
 * onPress wins over the parent's expand-toggle, so tapping a link navigates
 * and tapping plain text still expands. PUSH, not replace — see CommentRow's
 * comment-nav lesson (replace destroys the screen underneath, so back lands
 * on the home feed).
 */

import { useState } from 'react';
import { StyleSheet, type TextStyle, type StyleProp } from 'react-native';
import { Text } from '@/components/AppText';
import * as nav from '@/lib/navigate';
import { openMentionProfile } from '@/lib/mentions';
import { splitCaption, isHashtagToken, isMentionToken, normalizeTag } from '@/lib/hashtags';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
}

export function ExpandableDescription({ text, style }: Props) {
  const [expanded, setExpanded] = useState(false);
  // Collapse ALL whitespace runs (newlines/tabs/repeats) to single spaces at the
  // DISPLAY layer, so a caption renders as one paragraph no matter what's stored —
  // a user can't stretch it up the whole screen with return-spam, and this holds
  // for legacy rows + anything that bypassed input scrubbing (Kevin 2026-07-20).
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return (
    <Text
      style={style}
      numberOfLines={expanded ? undefined : 1}
      onPress={() => setExpanded((v) => !v)}
      // No gray press-highlight flash when tapping to expand/collapse — RN's
      // default Text onPress highlight (Kevin 2026-07-20).
      suppressHighlighting
    >
      {splitCaption(oneLine).map((part, i) => {
        if (isHashtagToken(part)) {
          return (
            <Text
              key={i}
              style={styles.link}
              onPress={() => nav.push(`/hashtag/${normalizeTag(part)}`)}
            >
              {part}
            </Text>
          );
        }
        if (isMentionToken(part)) {
          return (
            <Text key={i} style={styles.link} onPress={() => void openMentionProfile(part)}>
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  // Bold white, not link-blue — on the dream card the caption sits over the
  // artwork, where blue reads as clutter; the weight change alone marks it
  // tappable (Kevin 2026-07-05).
  link: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
