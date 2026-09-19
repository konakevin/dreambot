/**
 * BootStallPreview — admin QA tour of every boot-stall state (BOOT_STALL_PLAN.md
 * §2.7), so the copy and layout can be eyeballed from inside the running app
 * without black-holing the network. Mirrors ForceUpdateGate's imperative
 * `showForceUpdatePreview` pattern: an imperative opener + a host mounted on
 * the Settings screen. Admin-only; never reaches users.
 *
 * Tap the caption (or the hard state's "Try again") to advance; the last step
 * closes. Uses the SAME copyFor() the real hook uses, so what you see is what
 * ships.
 */
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { StartupLogo } from '@/components/StartupLogo';
import { copyFor, type BootStatus } from '@/lib/bootStall';
import { BOOT_STALL } from '@/constants/bootStall';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';

const TOUR: { label: string; status: BootStatus }[] = [
  {
    label: `soft (${BOOT_STALL.SOFT_MS / 1000}s)`,
    status: copyFor({ phase: 'soft', reachability: 'unknown', alarmSent: false }),
  },
  {
    label: `medium (${BOOT_STALL.MEDIUM_MS / 1000}s)`,
    status: copyFor({ phase: 'medium', reachability: 'unknown', alarmSent: false }),
  },
  {
    label: `hard (${BOOT_STALL.HARD_MS / 1000}s) · online · alarm sent`,
    status: copyFor({ phase: 'hard', reachability: 'online', alarmSent: true }),
  },
  {
    label: 'hard · online · alarm NOT sent',
    status: copyFor({ phase: 'hard', reachability: 'online', alarmSent: false }),
  },
  {
    label: 'hard · phone offline',
    status: copyFor({ phase: 'hard', reachability: 'offline', alarmSent: false }),
  },
];

let _open: ((index: number | null) => void) | null = null;

/** Open the tour at the first step. Inert unless BootStallPreviewHost is mounted. */
export function showBootStallPreview() {
  _open?.(0);
}

export function BootStallPreviewHost() {
  const [index, setIndex] = useState<number | null>(null);
  _open = setIndex;
  if (index === null) return null;
  const current = TOUR[index];
  if (!current) return null;
  const advance = () => setIndex(index + 1 < TOUR.length ? index + 1 : null);
  const close = () => setIndex(null);

  return (
    <Modal visible animationType="fade" onRequestClose={close}>
      <View style={s.fill}>
        <StartupLogo status={current.status} onRetry={advance} />
        <View style={s.chrome} pointerEvents="box-none">
          <Pressable onPress={advance} hitSlop={12}>
            <Text style={s.caption}>
              QA preview · {current.label} · tap to advance ({index + 1}/{TOUR.length})
            </Text>
          </Pressable>
          <Pressable onPress={close} hitSlop={12}>
            <Text style={s.close}>Close preview</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000000' },
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(48),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  caption: {
    color: colors.accent,
    fontSize: fontScale(12),
    textAlign: 'center',
  },
  close: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textDecorationLine: 'underline',
  },
});
