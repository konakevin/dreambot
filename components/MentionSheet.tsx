/**
 * @-mention floating sheet — the 5-star replacement for the old inline
 * MentionSuggestions placement (FIX_AT_MENTIONS_MENU.md).
 *
 * A self-contained animated sheet: rounded top, soft elevation, fades in, and
 * GROWS UPWARD (its container is anchored by the host at the input's top edge, so
 * added rows extend up, never down into the keyboard). The HOST supplies the
 * absolute placement via `style` — it renders this as an absolute sibling
 * ABOVE its (already keyboard-pinned) input, so the sheet rides the keyboard for
 * free and floats on top of all content (image thumb, rows). Rows persist taps so
 * the FIRST tap while the field is focused selects instead of dismissing the
 * keyboard. The matched prefix is emphasized (@**sun**nysteph).
 *
 * Returns null when there are no candidates — which, combined with the
 * ≥1-char gate in useMentionCandidates, keeps a bare '@' from opening it.
 */

import { memo, Fragment } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale, horizontalScale } from '@/lib/responsive';
import type { MentionCandidate } from '@/hooks/useMentionCandidates';

interface Props {
  candidates: MentionCandidate[];
  onPick: (username: string) => void;
  /** The chars typed after '@' — used to emphasize the matched prefix. */
  query?: string;
  /** Host-supplied ABSOLUTE placement (anchor the sheet above the input). */
  style?: StyleProp<ViewStyle>;
}

function MentionSheetBase({ candidates, onPick, query = '', style }: Props) {
  if (candidates.length === 0) return null;
  const q = query.trim().toLowerCase();
  return (
    <Animated.View
      entering={FadeIn.duration(140)}
      exiting={FadeOut.duration(110)}
      style={[styles.sheet, style]}
      pointerEvents="box-none"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scroll}
      >
        {candidates.map((u) => {
          const uname = u.username || '';
          const matchLen = q && uname.toLowerCase().startsWith(q) ? q.length : 0;
          return (
            <TouchableOpacity
              key={u.id}
              style={styles.row}
              onPress={() => onPick(u.username)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={`Mention ${uname}${u.isFollowing ? ', following' : ''}`}
            >
              {u.avatarUrl ? (
                <Image source={{ uri: u.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text allowFontScaling={false} style={styles.avatarInitial}>
                    {(uname || '?')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.username} numberOfLines={1}>
                {matchLen > 0 ? (
                  <Fragment>
                    {/* Matched prefix = DIM gray (identical on every row → recede
                        it); the REMAINDER = bright white, since that's the part
                        that distinguishes the names and must stay readable (purple
                        on the dark sheet was too low-contrast — Kevin 2026-07-26). */}
                    <Text style={styles.matchPrefix}>{uname.slice(0, matchLen)}</Text>
                    <Text style={styles.remainder}>{uname.slice(matchLen)}</Text>
                  </Fragment>
                ) : (
                  uname
                )}
              </Text>
              {u.isFollowing && <Text style={styles.followingHint}>following</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

export const MentionSheet = memo(MentionSheetBase);

// Max ~5 rows visible; scroll past that. The container is anchored by the host at
// the input's top, so this maxHeight bounds how far UP it grows.
const MAX_SHEET_HEIGHT = verticalScale(240);

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: horizontalScale(16),
    borderTopRightRadius: horizontalScale(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    maxHeight: MAX_SHEET_HEIGHT,
    overflow: 'hidden',
    // Soft elevation so it reads as a floating layer above the input + content.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  scroll: { maxHeight: MAX_SHEET_HEIGHT },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    gap: horizontalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: horizontalScale(30),
    height: horizontalScale(30),
    borderRadius: horizontalScale(15),
  },
  avatarFallback: {
    width: horizontalScale(30),
    height: horizontalScale(30),
    borderRadius: horizontalScale(15),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: colors.textPrimary, fontSize: fontScale(12), fontWeight: '700' },
  username: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
    flexShrink: 1,
  },
  // A tad brighter than textSecondary (#8E8E9E) so the matched prefix is easy to
  // read but still recedes vs the full-white distinguishing remainder.
  matchPrefix: { color: 'rgba(255,255,255,0.72)' },
  remainder: { color: colors.textPrimary },
  followingHint: {
    marginLeft: 'auto',
    color: colors.textSecondary,
    fontSize: fontScale(11),
  },
});
