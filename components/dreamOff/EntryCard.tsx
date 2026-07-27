/**
 * EntryCard — one dream in the gallery. During VOTING it's a blind tile (image
 * only, no author); tapping slaps a gold foil star on it. At RESULTS it reveals
 * the author + star count and, for the top three, a metal medal badge.
 *
 * TouchableOpacity (not a function-style Pressable) on purpose — the React
 * Compiler silently drops function-form Pressable styles (see memory).
 */

import { StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { GoldStar } from './GoldStar';
import { Medal, type MedalPlace } from './Medal';

interface Props {
  imageUrl: string;
  onPress?: () => void;
  /** The viewer placed a star here (voting) — shows the foil sticker. */
  starred?: boolean;
  /** Animate the star landing (set true on the tap that places it). */
  placing?: boolean;
  /** The viewer's own entry — tagged + non-votable. */
  isMine?: boolean;
  /** Results-only: revealed author + star tally. */
  authorName?: string;
  starCount?: number;
  /** Results-only: 1|2|3 → gold/silver/bronze badge. */
  medal?: MedalPlace;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EntryCard({
  imageUrl,
  onPress,
  starred,
  placing,
  isMine,
  authorName,
  starCount,
  medal,
  disabled,
  style,
}: Props) {
  const revealed = authorName !== undefined || starCount !== undefined;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[styles.wrap, style]}
    >
      <View style={[styles.tile, isMine && styles.mine, starred && styles.starredTile]}>
        <Image source={{ uri: imageUrl }} style={styles.img} contentFit="cover" transition={160} />
        {isMine && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>yours</Text>
          </View>
        )}
        {medal && <Medal place={medal} size={horizontalScale(30)} style={styles.medal} />}
        {starred && (
          <GoldStar size={horizontalScale(26)} tilt={-9} animateIn={placing} style={styles.star} />
        )}
      </View>
      {revealed && (
        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.author}>
            {authorName ?? ''}
          </Text>
          {starCount !== undefined && (
            <View style={styles.count}>
              <GoldStar size={fontScale(13)} tilt={0} />
              <Text style={styles.countText}>{starCount}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  tile: {
    aspectRatio: 4 / 5,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  mine: { opacity: 0.85, borderColor: 'rgba(255,255,255,0.22)' },
  starredTile: { borderColor: 'rgba(255,211,107,0.6)' },
  img: { width: '100%', height: '100%' },
  tag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
  },
  tagText: { color: '#fff', fontSize: fontScale(9), fontWeight: '800', letterSpacing: 0.5 },
  star: { position: 'absolute', top: 7, right: 8 },
  medal: { position: 'absolute', top: 6, left: 6 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
    gap: horizontalScale(6),
  },
  author: { flex: 1, color: colors.bodyOnDark, fontSize: fontScale(12), fontWeight: '600' },
  count: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(3) },
  countText: { color: colors.textPrimary, fontSize: fontScale(12), fontWeight: '800' },
});
