/**
 * Join a Dream Off by code — the "type the room code a friend gave you" screen
 * (Jackbox-style), reachable from the profile. Forgiving input: uppercases,
 * strips spaces/punctuation, paste-friendly, auto-submits at 4 chars. The result
 * runs through the shared interpretJoin mapping so every outcome is a warm line,
 * never a dead-end.
 */

import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, TextInput } from '@/components/AppText';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useJoinGame } from '@/hooks/useDreamOff';
import { interpretJoin } from '@/lib/dreamOffJoinStatus';

const CODE_LEN = 4;
const clean = (s: string) =>
  s
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LEN);

export default function JoinByCodeScreen() {
  const insets = useSafeAreaInsets();
  const join = useJoinGame();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ready = code.length === CODE_LEN;

  const submit = async (value: string) => {
    if (value.length !== CODE_LEN || join.isPending) return;
    setError(null);
    const res = await join.mutateAsync(value).catch(() => null);
    if (!res) {
      setError("Couldn't reach the game — give it another shot?");
      return;
    }
    const outcome = interpretJoin(res.status, res.gameId);
    if (outcome.ok && outcome.gameId) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/game/${outcome.gameId}`);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setError(outcome.message);
      setCode('');
    }
  };

  const onChange = (t: string) => {
    const c = clean(t);
    setCode(c);
    setError(null);
    if (c.length === CODE_LEN) void submit(c); // auto-submit when full
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <GradientTitle size={TITLE_SIZE.nav}>Join a Dream Off</GradientTitle>
        </View>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <Text style={styles.lead}>Got a code from a friend?</Text>
        <Text style={styles.sub}>Enter the 4-character game code.</Text>

        <TextInput
          value={code}
          onChangeText={onChange}
          autoFocus
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          keyboardType="visible-password"
          maxLength={CODE_LEN}
          placeholder="AB12"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          onSubmitEditing={() => void submit(code)}
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.hint}>Tip: it&apos;s not case-sensitive.</Text>
        )}

        <TouchableOpacity
          onPress={() => void submit(code)}
          disabled={!ready || join.isPending}
          activeOpacity={0.9}
          style={[styles.cta, (!ready || join.isPending) && styles.ctaDim]}
        >
          {join.isPending ? (
            <ActivityIndicator color="#08080F" />
          ) : (
            <Text style={styles.ctaLabel}>Join</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(8),
  },
  back: { width: fontScale(30), alignItems: 'flex-start' },
  titleWrap: { flex: 1, alignItems: 'center' },
  body: {
    paddingHorizontal: horizontalScale(24),
    paddingTop: verticalScale(28),
    alignItems: 'center',
  },
  lead: { fontFamily: displayFontFamily(700), fontSize: fontScale(22), color: colors.textPrimary },
  sub: { color: colors.textSecondary, fontSize: fontScale(14), marginTop: verticalScale(6) },
  input: {
    marginTop: verticalScale(28),
    width: '100%',
    textAlign: 'center',
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(34),
    letterSpacing: fontScale(10),
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
    borderRadius: 16,
    paddingVertical: verticalScale(16),
  },
  hint: { color: colors.textTertiary, fontSize: fontScale(12.5), marginTop: verticalScale(12) },
  error: {
    color: colors.error,
    fontSize: fontScale(13.5),
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
  cta: {
    marginTop: verticalScale(28),
    width: '100%',
    borderRadius: 999,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
  },
  ctaDim: { opacity: 0.4 },
  ctaLabel: { fontFamily: displayFontFamily(700), fontSize: fontScale(16), color: '#08080F' },
});
