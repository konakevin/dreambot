/**
 * Loading Screen — shows mascot animation while generating the dream.
 * Triggers generation on mount, navigates to reveal on completion.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { randomMascot } from '@/constants/mascots';
import { useDreamCreate } from '@/hooks/useDreamCreate';

const TIPS = [
  'Dreaming up something special...',
  'Mixing colors and light...',
  'Channeling your vibe...',
  'Painting your imagination...',
  'Almost there...',
];

export default function DreamLoadingScreen() {
  const mascotUrl = useRef(randomMascot()).current;
  const tipIndex = useRef(0);
  const { generate } = useDreamCreate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    generate().then((status) => {
      if (status === 'done') {
        router.replace('/dream/reveal');
      } else {
        // Error — go back to configure (or create if no configure step)
        router.back();
      }
    });
  }, [generate]);

  // Cycle tips every 4 seconds
  const [tip, setTip] = useState(TIPS[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      tipIndex.current = (tipIndex.current + 1) % TIPS.length;
      setTip(TIPS[tipIndex.current]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Image source={{ uri: mascotUrl }} style={s.mascot} contentFit="cover" />
        <ActivityIndicator size="large" color={colors.accent} style={s.spinner} />
        <Text style={s.tip}>{tip}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  mascot: {
    width: 160,
    height: 160,
    borderRadius: 32,
  },
  spinner: {
    marginTop: 8,
  },
  tip: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
