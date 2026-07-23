/**
 * DreamSmartSwapSheet — the slide-up notice shown when a style change leaves the
 * user's model outside that style's DreamSmart set, so we're rendering with the
 * first model shown in the picker for that set instead (the pick itself is left
 * untouched underneath). Explains what happened and offers a one-tap escape:
 * "Use [Model] anyway" restores their original model AND flips DreamSmart OFF
 * (the checkbox updates live). NOTE this differs from toggling the DreamSmart
 * switch directly, which just drops the filter and KEEPS the shown model.
 *
 * Controlled by the Create screen (`app/(tabs)/create.tsx`) via `notice`.
 * Mirrors PremiumGateSheet's transparent slide-up Modal + brand styling.
 */

import { View, TouchableOpacity, Pressable, Modal, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

export interface SwapNotice {
  /** The original model id to restore when they tap "Use [it] anyway". */
  fromId: string;
  /** Display label of the model they had picked (now unsupported here). */
  fromLabel: string;
  /** Display label of the first-in-picker model we're rendering with instead. */
  toLabel: string;
  /** The style (medium) label they just switched to. */
  styleLabel: string;
}

export function DreamSmartSwapSheet({
  notice,
  onUseAnyway,
  onDismiss,
}: {
  notice: SwapNotice | null;
  onUseAnyway: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      visible={!!notice}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {notice ? (
            <>
              <View style={styles.handle} />
              <LinearGradient
                colors={gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Ionicons name="sparkles" size={fontScale(26)} color="#FFFFFF" />
              </LinearGradient>

              <View style={styles.titleBlock}>
                <Text style={styles.eyebrow}>DreamSmart</Text>
                <Text style={styles.title}>Switched your model</Text>
              </View>
              <Text style={styles.body}>
                {notice.fromLabel} may struggle with {notice.styleLabel} renders. {notice.toLabel}{' '}
                was selected instead.
              </Text>

              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={onDismiss}
                  activeOpacity={0.7}
                  style={styles.flatPrimary}
                >
                  <Text style={styles.flatPrimaryText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onUseAnyway} activeOpacity={0.7} style={styles.flatOk}>
                  <Text style={styles.flatOkText}>Use {notice.fromLabel} anyway</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: verticalScale(26),
    borderTopRightRadius: verticalScale(26),
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: verticalScale(24),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(36),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  handle: {
    width: verticalScale(40),
    height: verticalScale(4),
    borderRadius: verticalScale(2),
    backgroundColor: colors.border,
    marginBottom: verticalScale(8),
  },
  iconCircle: {
    width: verticalScale(60),
    height: verticalScale(60),
    borderRadius: verticalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    alignItems: 'center',
    gap: verticalScale(3),
  },
  // Purple eyebrow above the title — the app's onboarding cadence, and it brands
  // the moment as DreamSmart (paired with the sparkle icon) so the user connects
  // the swap to the DreamSmart toggle they can see on screen.
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    gap: verticalScale(8),
    marginTop: verticalScale(4),
  },
  // Flat, calm action — a subtle accent-tinted pill, not the loud brand gradient.
  flatPrimary: {
    width: '100%',
    paddingVertical: verticalScale(14),
    borderRadius: verticalScale(14),
    alignItems: 'center',
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  flatPrimaryText: {
    color: colors.accentLight,
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  flatOk: {
    width: '100%',
    paddingVertical: verticalScale(13),
    alignItems: 'center',
  },
  flatOkText: {
    color: colors.textMuted,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
});
