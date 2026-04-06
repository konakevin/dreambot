/**
 * Create Tab — the entry point for dream creation.
 *
 * Three big options:
 *   Surprise Me → straight to Loading (random medium + vibe)
 *   Upload Photo → photo picker → Configure
 *   Enter Prompt → Configure (with prompt focused)
 */

import { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors } from '@/constants/theme';
import { randomMascot } from '@/constants/mascots';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';

export default function CreateScreen() {
  const mascotUrl = useRef(randomMascot()).current;
  const reset = useDreamStore((s) => s.reset);
  const setMode = useDreamStore((s) => s.setMode);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const { data: sparkleBalance = 0 } = useSparkleBalance();

  async function handlePhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    reset();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const w = asset.width;
    const h = asset.height;

    // Center-crop to 9:16 portrait
    const targetRatio = 9 / 16;
    const currentRatio = w / h;
    let cropAction: ImageManipulator.Action;

    if (currentRatio > targetRatio) {
      // Too wide — crop sides
      const newW = Math.round(h * targetRatio);
      cropAction = {
        crop: { originX: Math.round((w - newW) / 2), originY: 0, width: newW, height: h },
      };
    } else {
      // Too tall — crop top/bottom
      const newH = Math.round(w / targetRatio);
      cropAction = {
        crop: { originX: 0, originY: Math.round((h - newH) / 2), width: w, height: newH },
      };
    }

    const cropped = await ImageManipulator.manipulateAsync(asset.uri, [cropAction], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    if (!cropped.base64) {
      Toast.show('Could not process photo', 'close-circle');
      return;
    }

    setPhoto(cropped.base64, cropped.uri);
    router.push('/dream/configure');
  }

  function handlePrompt() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    reset();
    setMode('prompt');
    router.push('/dream/configure');
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Create</Text>
        <TouchableOpacity onPress={() => router.push('/sparkleStore')} style={s.sparklePill}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={s.sparkleText}>{formatCompact(sparkleBalance)}</Text>
        </TouchableOpacity>
      </View>

      {/* Mascot + title */}
      <View style={s.hero}>
        <Image source={{ uri: mascotUrl }} style={s.mascot} contentFit="cover" />
      </View>

      {/* Option cards */}
      <View style={s.cards}>
        <TouchableOpacity style={s.card} onPress={handlePhoto} activeOpacity={0.8}>
          <View style={[s.cardIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
            <Ionicons name="camera-outline" size={32} color="#3B82F6" />
          </View>
          <Text style={s.cardTitle}>Upload Photo</Text>
          <Text style={s.cardDesc}>Transform a photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.card} onPress={handlePrompt} activeOpacity={0.8}>
          <View style={[s.cardIcon, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
            <Ionicons name="create-outline" size={32} color="#22C55E" />
          </View>
          <Text style={s.cardTitle}>Enter Prompt</Text>
          <Text style={s.cardDesc}>Describe your dream</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  sparklePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sparkleText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  mascot: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  cards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
