/**
 * AvatarPreviewModal — tap-to-expand a profile photo to a full, centered view
 * (Instagram-style): dark scrim, the avatar enlarged as a circle, an @handle,
 * and a close button. Tap anywhere (or the X) to dismiss. Fades via the Modal.
 */

import { Modal, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';

interface Props {
  visible: boolean;
  avatarUrl: string | null;
  /** Handle shown under the photo (without the leading @). */
  username?: string | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const SIZE = Math.min(width - 64, 340);

export function AvatarPreviewModal({ visible, avatarUrl, username, onClose }: Props) {
  const initial = (username || '?')[0]?.toUpperCase() ?? '?';
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.image}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.fill} contentFit="cover" />
          ) : (
            <View style={[styles.fill, styles.fallback]}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
          )}
        </View>
        {username ? <Text style={styles.username}>@{username}</Text> : null}
        <TouchableOpacity style={styles.close} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: SIZE, height: SIZE, borderRadius: 9999, overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  fallback: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#FFFFFF', fontSize: SIZE * 0.4, fontWeight: '700' },
  username: {
    color: '#FFFFFF',
    fontSize: fontScale(17),
    fontWeight: '700',
    marginTop: verticalScale(20),
  },
  close: { position: 'absolute', top: verticalScale(56), right: 20 },
});
