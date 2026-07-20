/**
 * ExpandableDescription — tap-to-expand the caption beneath a DreamCard.
 * Extracted from DreamCard (2026-06-06).
 *
 * Collapsed: a 2-line preview. Tap to expand into a HEIGHT-CAPPED panel that
 * scrolls internally when the caption is taller than the cap — so a long (up to
 * 500-char) caption never grows up the whole card; the art stays the hero and the
 * text lives in a bounded reading window (Kevin 2026-07-20). Newlines are
 * collapsed to spaces at render (return-spam can't stretch it); the tap toggle
 * suppresses RN's gray press-highlight.
 *
 * Hashtags + mentions (2026-07-05): #tags and @mentions render as tappable links.
 * Nested Text onPress wins over the parent's expand-toggle, so tapping a link
 * navigates and tapping plain text still expands. PUSH, not replace — see
 * CommentRow's comment-nav lesson.
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, type TextStyle, type StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// RNGH ScrollView so the caption's internal scroll arbitrates cleanly with the
// card's gesture system (pan/pinch/double-tap) instead of fighting it.
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '@/components/AppText';
import { verticalScale } from '@/lib/responsive';
import * as nav from '@/lib/navigate';
import { openMentionProfile } from '@/lib/mentions';
import { splitCaption, isHashtagToken, isMentionToken, normalizeTag } from '@/lib/hashtags';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Lines shown before expanding, and the max height the expanded panel may take
// (a comfortable reading window that never covers the focal subject). Tunable.
const COLLAPSED_LINES = 2;
const MAX_EXPANDED_HEIGHT = Math.round(SCREEN_HEIGHT * 0.34);

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
}

export function ExpandableDescription({ text, style }: Props) {
  const [expanded, setExpanded] = useState(false);
  // Collapse ALL whitespace runs (newlines/tabs/repeats) to single spaces at the
  // DISPLAY layer, so a caption renders as one paragraph no matter what's stored —
  // holds for legacy rows + anything that bypassed input scrubbing.
  const oneLine = text.replace(/\s+/g, ' ').trim();

  // Reset to the collapsed preview when the card recycles to a different caption
  // (FlatList reuses this instance across items).
  useEffect(() => setExpanded(false), [text]);

  const body = (
    <Text
      style={style}
      numberOfLines={expanded ? undefined : COLLAPSED_LINES}
      onPress={() => setExpanded((v) => !v)}
      // No gray press-highlight flash when tapping to expand/collapse.
      suppressHighlighting
    >
      {splitCaption(oneLine).map((part, i) => {
        if (isHashtagToken(part)) {
          return (
            <Text
              key={i}
              style={styles.link}
              suppressHighlighting
              onPress={() => nav.push(`/hashtag/${normalizeTag(part)}`)}
            >
              {part}
            </Text>
          );
        }
        if (isMentionToken(part)) {
          return (
            <Text
              key={i}
              style={styles.link}
              suppressHighlighting
              onPress={() => void openMentionProfile(part)}
            >
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );

  // Collapsed: the plain 2-line preview. Expanded: a bounded panel — it sizes to
  // the caption up to MAX_EXPANDED_HEIGHT, then scrolls internally beyond that.
  // A gradient scrim sits behind it (feathered at the TOP so it blends into the
  // art, solid toward the bottom) so a long caption stays legible over bright
  // artwork without a hard box edge.
  if (!expanded) return body;
  return (
    <View>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.18]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <ScrollView
        style={{ maxHeight: MAX_EXPANDED_HEIGHT }}
        contentContainerStyle={styles.expandedContent}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      >
        {body}
      </ScrollView>
    </View>
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
  // A little breathing room so the text isn't flush against the scrim edges.
  expandedContent: {
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(6),
  },
});
