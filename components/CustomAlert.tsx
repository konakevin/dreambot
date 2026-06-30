import { useState, useCallback } from 'react';
import { View, TouchableOpacity, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { BRAND_GRADIENT } from '@/components/GradientTitle';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';

// Primary dialog button = the soft purple at the gradient's left end (matches the
// solid Dream button). The full brand gradient is reserved for one-shot
// onboarding/education sheets, not recurring utility dialogs like this.
const PRIMARY_BG = BRAND_GRADIENT[0];

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  /** Receives the "don't show again" checkbox state when `options.checkbox` is
   *  set; the arg is undefined for alerts without a checkbox. */
  onPress?: (dontShowAgain?: boolean) => void;
}

interface AlertOptions {
  /** Renders a tappable "don't show again" checkbox above the buttons. Its
   *  checked state is passed to each button's onPress. */
  checkbox?: { label: string };
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  checkbox?: { label: string };
}

// Global ref so showAlert can be called from anywhere (no hook required)
let globalShowAlert:
  | ((title: string, message: string, buttons?: AlertButton[], options?: AlertOptions) => void)
  | null = null;

/**
 * Drop-in replacement for showAlert() — uses our dark theme styling.
 * Works from any component or callback without needing a hook.
 */
export function showAlert(
  title: string,
  message: string,
  buttons?: AlertButton[],
  options?: AlertOptions
) {
  if (globalShowAlert) {
    globalShowAlert(title, message, buttons, options);
  }
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const show = useCallback(
    (title: string, message: string, buttons?: AlertButton[], options?: AlertOptions) => {
      setDontShowAgain(false); // reset each time a dialog opens
      setAlert({
        visible: true,
        title,
        message,
        buttons: buttons ?? [{ text: 'OK' }],
        checkbox: options?.checkbox,
      });
    },
    []
  );

  // Register the global function
  globalShowAlert = show;

  function dismiss() {
    setAlert((prev) => ({ ...prev, visible: false }));
  }

  function handlePress(button: AlertButton) {
    dismiss();
    const checked = dontShowAgain;
    setTimeout(() => button.onPress?.(checked), 150);
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
            {alert.checkbox ? (
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setDontShowAgain((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, dontShowAgain && styles.checkboxChecked]}>
                  {dontShowAgain ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.checkboxLabel}>{alert.checkbox.label}</Text>
              </TouchableOpacity>
            ) : null}
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
    // iPad: cap to a normal alert width so it isn't a ~940px-wide dialog
    // (the overlay centers it; no-op on phone).
    maxWidth: isTabletDevice ? 460 : undefined,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: verticalScale(4),
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_BG,
    borderColor: PRIMARY_BG,
  },
  checkboxLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
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
