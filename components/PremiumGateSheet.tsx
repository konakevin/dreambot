/**
 * PremiumGateSheet — the single branded bottom-sheet for every "you need sparkles
 * / a subscription" moment. Mirrors the global imperative pattern of CustomAlert:
 * mount <PremiumGateProvider> once at the app root, then call showPremiumGate()
 * from anywhere. Content (copy, CTA, destination) comes from lib/premiumGate.ts.
 */

import { useState, useCallback } from 'react';
import type { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, Pressable, Modal, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import * as nav from '@/lib/navigate';
import {
  type GateReason,
  type GateButton,
  gateContent,
  registerPremiumGate,
} from '@/lib/premiumGate';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export function PremiumGateProvider({ children }: { children: React.ReactNode }) {
  const [reason, setReason] = useState<GateReason | null>(null);

  const show = useCallback((r: GateReason) => setReason(r), []);
  // Register the global imperative entry point.
  registerPremiumGate(show);

  const dismiss = useCallback(() => setReason(null), []);

  const onButton = useCallback(
    (btn: GateButton) => {
      dismiss();
      if (btn.route) setTimeout(() => nav.push(btn.route as string), 150);
    },
    [dismiss]
  );

  const content = reason ? gateContent(reason) : null;

  return (
    <>
      {children}
      <Modal
        visible={!!reason}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={dismiss}
      >
        <Pressable style={styles.overlay} onPress={dismiss}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {content ? (
              <>
                <View style={styles.handle} />
                <LinearGradient
                  colors={gradients.brand}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconCircle}
                >
                  <Ionicons
                    name={content.icon as IoniconName}
                    size={fontScale(28)}
                    color="#FFFFFF"
                  />
                </LinearGradient>

                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.body}>{content.body}</Text>

                {content.balance ? (
                  <View style={styles.balanceRow}>
                    <Ionicons name="sparkles" size={fontScale(15)} color={colors.accentLight} />
                    <Text style={styles.balanceText}>
                      You have {content.balance.have} · need {content.balance.need}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.buttons}>
                  {content.buttons.map((btn, i) =>
                    btn.variant === 'primary' ? (
                      <TouchableOpacity
                        key={i}
                        onPress={() => onButton(btn)}
                        activeOpacity={0.85}
                        style={styles.primaryWrap}
                      >
                        <LinearGradient
                          colors={gradients.accent}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.primaryBtn}
                        >
                          <Text style={styles.primaryText}>{btn.label}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={i}
                        onPress={() => onButton(btn)}
                        activeOpacity={0.7}
                        style={styles.secondaryBtn}
                      >
                        <Text style={styles.secondaryText}>{btn.label}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    width: verticalScale(64),
    height: verticalScale(64),
    borderRadius: verticalScale(32),
    alignItems: 'center',
    justifyContent: 'center',
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
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(6),
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: verticalScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(14),
  },
  balanceText: {
    color: colors.accentLight,
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  buttons: {
    width: '100%',
    gap: verticalScale(10),
    marginTop: verticalScale(6),
  },
  primaryWrap: {
    width: '100%',
  },
  primaryBtn: {
    paddingVertical: verticalScale(15),
    borderRadius: verticalScale(15),
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '800',
  },
  secondaryBtn: {
    paddingVertical: verticalScale(13),
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.textMuted,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
});
