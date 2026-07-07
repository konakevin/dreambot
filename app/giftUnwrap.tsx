/**
 * Gift unwrap — /giftUnwrap?ref=<gift reference uuid>. The celebratory landing
 * for a sparkle_gift notification tap (Gift Sparkles Phase 1, migration 334).
 * Shows who sent it, how much, their message, and a one-tap "Say thanks" that
 * pings the gifter back (once per gift, server-enforced).
 */

import { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from '@/components/AppText';
import { GradientTitle } from '@/components/GradientTitle';
import { Toast } from '@/components/Toast';
import * as nav from '@/lib/navigate';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { useGift, useThankGift } from '@/hooks/useGiftSparkles';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

export default function GiftUnwrapScreen() {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { data: gift, isLoading } = useGift(typeof ref === 'string' ? ref : null);
  const thankGift = useThankGift();

  // Spring the card in — the "unwrap" beat.
  const scale = useSharedValue(0.6);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [scale]);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  async function handleThanks() {
    if (!gift || gift.thanked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await thankGift.mutateAsync(ref as string);
      Toast.show(`Thanks sent to ${gift.sender_username} ✨`, 'heart');
    } catch {
      Toast.show("Couldn't send thanks right now.", 'close-circle');
    }
  }

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <TouchableOpacity onPress={() => nav.back()} hitSlop={12} style={s.back}>
        <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={s.center}>
        {isLoading ? null : !gift ? (
          <Text style={s.missing}>This gift has drifted off into a dream.</Text>
        ) : (
          <Animated.View style={[s.card, cardStyle]}>
            <Text style={s.giftEmoji}>🎁</Text>
            {gift.sender_avatar ? (
              <Image
                source={{ uri: resizeAvatar(gift.sender_avatar) }}
                style={s.avatar}
                cachePolicy="memory-disk"
              />
            ) : null}
            <GradientTitle size={24} align="center">
              {`${gift.sender_username} sent you ${gift.amount} sparkles`}
            </GradientTitle>
            {gift.message ? <Text style={s.message}>&ldquo;{gift.message}&rdquo;</Text> : null}
            <Text style={s.subline}>They&apos;re already in your balance ✨</Text>
            <TouchableOpacity
              style={[s.thanksBtn, gift.thanked && s.thanksBtnDone]}
              activeOpacity={0.8}
              disabled={gift.thanked || thankGift.isPending}
              onPress={handleThanks}
            >
              <Ionicons
                name={gift.thanked ? 'heart' : 'heart-outline'}
                size={16}
                color={gift.thanked ? colors.accent : '#0B0B10'}
              />
              <Text style={[s.thanksText, gift.thanked && s.thanksTextDone]}>
                {gift.thanked ? 'Thanks sent' : 'Say thanks'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { paddingHorizontal: 16, paddingVertical: verticalScale(8), alignSelf: 'flex-start' },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  card: {
    alignItems: 'center',
    gap: verticalScale(14),
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: verticalScale(30),
    paddingHorizontal: 24,
  },
  giftEmoji: { fontSize: fontScale(52) },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  message: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontScale(15),
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: fontScale(22),
  },
  subline: { color: colors.textSecondary, fontSize: fontScale(13) },
  missing: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    textAlign: 'center',
  },
  thanksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#A78BFA',
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: verticalScale(11),
    marginTop: verticalScale(6),
  },
  thanksBtnDone: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  thanksText: { color: '#0B0B10', fontSize: fontScale(14), fontWeight: '800' },
  thanksTextDone: { color: colors.textSecondary },
});
