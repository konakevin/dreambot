/**
 * PhaseCountdown — a live "time left in this phase" chip, ticking down to the
 * game's phase_expires_at. Adaptive cadence (per-second in the final two minutes,
 * per-30s otherwise) so it feels alive at the wire without burning cycles early.
 */

import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';

interface Props {
  /** ISO timestamp the current phase closes at (null = no deadline). */
  expiresAt: string | null;
  style?: StyleProp<ViewStyle>;
}

/** Human "time left" from a ms delta: 2d · 6h · 14m · <1m · Ending. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ending';
  const s = Math.floor(ms / 1000);
  if (s < 60) return '<1m';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function PhaseCountdown({ expiresAt, style }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();
    const tick = () => setNow(Date.now());
    const remaining = target - Date.now();
    const period = remaining < 120_000 ? 1000 : 30_000;
    const id = setInterval(tick, period);
    return () => clearInterval(id);
  }, [expiresAt, now]);

  if (!expiresAt) return null;
  const remaining = new Date(expiresAt).getTime() - now;
  const urgent = remaining > 0 && remaining < 60 * 60 * 1000;

  return (
    <View style={[styles.chip, urgent && styles.chipUrgent, style]}>
      <Text style={[styles.text, urgent && styles.textUrgent]}>⏱ {formatCountdown(remaining)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: horizontalScale(11),
    paddingVertical: verticalScale(5),
    borderRadius: 999,
    backgroundColor: colors.overlayWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipUrgent: {
    backgroundColor: 'rgba(232,72,95,0.14)',
    borderColor: 'rgba(232,72,95,0.4)',
  },
  text: { color: colors.bodyOnDark, fontSize: fontScale(12), fontWeight: '800' },
  textUrgent: { color: '#F98BA0' },
});
