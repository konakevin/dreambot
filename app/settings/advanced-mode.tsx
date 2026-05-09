/**
 * Settings → Advanced Mode — power-user Flux model preference.
 *
 * Lets the user choose which Flux model their Create-screen "Advanced Mode"
 * renders use. Reads/writes users.pro_mode_flux_model (column name kept for
 * back-compat — was named before the user-facing rename Pro Mode → Advanced
 * Mode). Default is flux-1.1-pro (set by migration 149).
 *
 * Advanced Mode is FREE — anyone can use it, costs one sparkle per render
 * same as a normal dream. The Pro subscription (separate, see /proStore) is
 * about unlimited downloads + bonus sparkles + nightly dreams.
 */

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';

const MODEL_OPTIONS: { key: string; label: string; sub: string }[] = [
  {
    key: 'black-forest-labs/flux-dev',
    label: 'Flux 1 Dev',
    sub: 'Cheaper and faster. Good for iterating.',
  },
  {
    key: 'black-forest-labs/flux-1.1-pro',
    label: 'Flux 1.1 Pro',
    sub: 'Default. Sharpest detail and prompt fidelity on Flux 1.',
  },
  {
    key: 'black-forest-labs/flux-2-dev',
    label: 'Flux 2 Dev',
    sub: 'Newer architecture. Different look — try it on prompts that under-render on Flux 1.',
  },
  {
    key: 'black-forest-labs/flux-2-pro',
    label: 'Flux 2 Pro',
    sub: 'Newest, highest-quality Flux 2 tier.',
  },
];

const DEFAULT_MODEL = 'black-forest-labs/flux-1.1-pro';

export default function SettingsProModeScreen() {
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('users')
        .select('pro_mode_flux_model')
        .eq('id', user.id)
        .single();
      if (data?.pro_mode_flux_model) setSelected(data.pro_mode_flux_model);
      setLoading(false);
    })();
  }, [user]);

  const handleSelect = async (modelKey: string) => {
    if (!user || modelKey === selected || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaving(true);
    setSelected(modelKey);
    const { error } = await supabase
      .from('users')
      .update({ pro_mode_flux_model: modelKey })
      .eq('id', user.id);
    if (error) {
      console.error('[settings/advanced-mode] save failed:', error.message);
    }
    setSaving(false);
  };

  return (
    <ScreenLayout title="Advanced Mode">
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          When Advanced Mode is on (Create tab), your prompt is sent verbatim to Flux — no AI
          enhancement, no medium or vibe directives, no face swap. Pick which Flux model handles
          those renders.
        </Text>
      </View>
      {loading ? (
        <View style={{ paddingTop: 40, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {MODEL_OPTIONS.map((opt) => {
            const isSelected = opt.key === selected;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => handleSelect(opt.key)}
                activeOpacity={0.7}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? colors.accent + '22' : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                      lineHeight: 17,
                    }}
                  >
                    {opt.sub}
                  </Text>
                </View>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.accent : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color={colors.accent} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    lineHeight: 19,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
});
