import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { dialogText } from '@/constants/dialogText';
import { verticalScale } from '@/lib/responsive';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <Text style={[dialogText.title, styles.title]}>{title}</Text>
          <Text style={[dialogText.body, styles.message]}>{message}</Text>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.accent, colors.accentDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={dialogText.button}>{confirmLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
            <Text style={dialogText.buttonSecondary}>{cancelLabel}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },
  title: { marginBottom: verticalScale(8) },
  message: { marginBottom: verticalScale(24) },
  confirmButton: {
    width: '100%',
    // minHeight so the label grows under OS "Larger Text" (gradient is
    // absoluteFill, so it fills the grown button).
    minHeight: 48,
    paddingVertical: verticalScale(6),
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  cancelButton: {
    width: '100%',
    minHeight: 44,
    paddingVertical: verticalScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
