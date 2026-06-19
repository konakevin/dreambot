/**
 * OopsScreen — a whimsical "this content isn't here" page.
 *
 * Shown when a dream can't be loaded: a private/unposted upload someone links you
 * to, a deleted post, a blocked author, or any deep-link whose target is gone.
 * Beats a black void — our little bubble-bot is taking it pretty hard. Defaults
 * route the user back to the feed; pass overrides to reuse elsewhere.
 */
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text } from '@/components/AppText';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';

const OOPS_BOT = require('@/assets/images/oops-bot.jpg');
const BOT_SIZE = verticalScaleClamped(220, 170, 250);

interface Props {
  title?: string;
  message?: string;
  buttonLabel?: string;
  onHome?: () => void;
}

export function OopsScreen({ title, message, buttonLabel = 'Take me home', onHome }: Props) {
  const goHome = onHome ?? (() => router.replace('/(tabs)'));
  return (
    <View style={s.root}>
      <Image source={OOPS_BOT} style={s.bot} contentFit="cover" />
      <GradientTitle
        size={26}
        weight={800}
        lineHeight={32}
        maxWidth={320}
        numberOfLines={0}
        style={s.title}
      >
        {title ?? 'This dream floated off'}
      </GradientTitle>
      <Text style={s.body}>
        {message ??
          "It drifted somewhere private, or wandered back into the ether — even our bot can't find it. He's taking it pretty hard."}
      </Text>
      <View style={s.btnWrap}>
        <GradientButton label={buttonLabel} onPress={goHome} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  bot: {
    width: BOT_SIZE,
    height: BOT_SIZE,
    borderRadius: 28,
    marginBottom: verticalScale(24),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: verticalScale(28),
  },
  btnWrap: {
    alignSelf: 'stretch',
    maxWidth: 320,
    width: '100%',
  },
});
