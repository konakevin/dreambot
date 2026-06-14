import { useState, useCallback } from 'react';
import { View, TouchableOpacity, Pressable, Modal, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { BRAND_GRADIENT } from '@/components/GradientTitle';
import { verticalScale, fontScale } from '@/lib/responsive';

// Primary dialog button = the soft purple at the gradient's left end (matches the
// solid Dream button). The full brand gradient is reserved for one-shot
// onboarding/education sheets, not recurring utility dialogs like this.
const PRIMARY_BG = BRAND_GRADIENT[0];

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
}

// Global ref so showAlert can be called from anywhere (no hook required)
let globalShowAlert: ((title: string, message: string, buttons?: AlertButton[]) => void) | null =
  null;

/**
 * Drop-in replacement for showAlert() — uses our dark theme styling.
 * Works from any component or callback without needing a hook.
 */
export function showAlert(title: string, message: string, buttons?: AlertButton[]) {
  if (globalShowAlert) {
    globalShowAlert(title, message, buttons);
  }
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const show = useCallback((title: string, message: string, buttons?: AlertButton[]) => {
    setAlert({
      visible: true,
      title,
      message,
      buttons: buttons ?? [{ text: 'OK' }],
    });
  }, []);

  // Register the global function
  globalShowAlert = show;

  function dismiss() {
    setAlert((prev) => ({ ...prev, visible: false }));
  }

  function handlePress(button: AlertButton) {
    dismiss();
    setTimeout(() => button.onPress?.(), 150);
  }

  const isStacked = alert.buttons.length !== 2;
  // For stacked: cancel at bottom. For row: cancel on left.
  const sortedButtons = [...alert.buttons].sort((a, b) => {
    if (isStacked) {
      if (a.style === 'cancel') return 1;
      if (b.style === 'cancel') return -1;
    } else {
      if (a.style === 'cancel') return -1;
      if (b.style === 'cancel') return 1;
    }
    return 0;
  });

  return (
    <>
      {children}
      <Modal visible={alert.visible} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={dismiss}>
          <Pressable style={styles.card} onPress={() => {}}>
            {alert.title ? <Text style={styles.title}>{alert.title}</Text> : null}
            {alert.message ? <Text style={styles.message}>{alert.message}</Text> : null}
            <View style={isStacked ? styles.buttonCol : styles.buttonRow}>
              {sortedButtons.map((btn, i) => {
                const isDefault = btn.style !== 'cancel' && btn.style !== 'destructive';
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.button, !isStacked && styles.buttonFlex]}
                    onPress={() => handlePress(btn)}
                    activeOpacity={0.85}
                  >
                    {isDefault ? (
                      // Primary action = solid soft-purple (matches the Dream button).
                      <View style={[styles.fill, styles.buttonDefault]}>
                        <Text style={[styles.buttonText, styles.buttonTextDefault]}>
                          {btn.text}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.fill,
                          btn.style === 'destructive'
                            ? styles.buttonDestructive
                            : styles.buttonCancel,
                        ]}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            btn.style === 'cancel' && styles.buttonTextCancel,
                          ]}
                        >
                          {btn.text}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(21),
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: verticalScale(8),
  },
  buttonCol: {
    flexDirection: 'column',
    gap: 8,
    marginTop: verticalScale(8),
  },
  // Touch wrapper — owns the pill shape; clips the gradient/fill child.
  button: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonFlex: {
    flex: 1,
  },
  // Inner fill (gradient or solid) — owns the padding + centering.
  fill: {
    paddingVertical: verticalScale(13),
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDefault: {
    backgroundColor: PRIMARY_BG,
  },
  buttonDestructive: {
    backgroundColor: colors.error,
  },
  buttonCancel: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonTextDefault: {
    color: '#FFFFFF',
  },
  buttonTextCancel: {
    color: colors.textSecondary,
  },
});
