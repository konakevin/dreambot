/**
 * TopicBanner — the dealt topic, front and center. A soft brand-tinted card with
 * a small eyebrow and the worded topic in the Quicksand display face. This is the
 * thing everyone in the game is dreaming to, so it leads every phase of the Room.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { wordTopic } from './topicWording';
import type { CastMode, PackCategory } from '@/types/dreamOff';

interface Props {
  topic: string;
  packCategory: PackCategory;
  castMode: CastMode;
  /** 'full' for the Room hero, 'compact' for shelf/list cards. */
  size?: 'full' | 'compact';
  /** 'card' = soft tinted card; 'bare' = borderless (calm hero, no tap-able look). */
  variant?: 'card' | 'bare';
  eyebrow?: string;
  style?: StyleProp<ViewStyle>;
}

export function TopicBanner({
  topic,
  packCategory,
  castMode,
  size = 'full',
  variant = 'card',
  eyebrow = 'Your topic',
  style,
}: Props) {
  const compact = size === 'compact';
  const worded = wordTopic(topic, packCategory, castMode);
  const inner = (
    <>
      <Text style={[styles.eyebrow, compact && styles.eyebrowCompact]}>
        {eyebrow.toUpperCase()}
      </Text>
      <Text
        style={[
          styles.topic,
          { fontFamily: displayFontFamily(700) },
          compact && styles.topicCompact,
          variant === 'bare' && styles.topicBare,
        ]}
      >
        {worded}
      </Text>
    </>
  );

  if (variant === 'bare') {
    return <View style={[styles.bare, style]}>{inner}</View>;
  }
  return (
    <LinearGradient
      colors={['rgba(167,139,250,0.18)', 'rgba(94,234,212,0.07)']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.95, y: 1 }}
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      {inner}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  cardCompact: {
    borderRadius: 14,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(11),
  },
  bare: { paddingVertical: verticalScale(4) },
  topicBare: { fontSize: fontScale(20), lineHeight: fontScale(26) },
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: verticalScale(7),
  },
  eyebrowCompact: { fontSize: fontScale(9), marginBottom: verticalScale(4) },
  topic: {
    color: colors.textPrimary,
    fontSize: fontScale(21),
    lineHeight: fontScale(26),
  },
  topicCompact: { fontSize: fontScale(13), lineHeight: fontScale(16) },
});
