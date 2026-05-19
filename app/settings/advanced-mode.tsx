/**
 * Settings → Advanced Mode — power-user image model preference.
 *
 * Lets the user choose which model their Create-screen "Advanced Mode"
 * renders use. Reads/writes users.pro_mode_flux_model (column name kept
 * for back-compat — predates the rename Pro Mode → Advanced Mode and
 * predates non-Flux providers). Default is flux-1.1-pro.
 *
 * Advanced Mode itself is FREE to toggle on — but mid/premium models
 * charge more sparkles per render (2 for Mid, 3 for Premium).
 *
 * Models grouped by tier:
 *   • Standard (1 sparkle) — Flux 1 family
 *   • Mid (2 sparkles) — Flux 2 family, Flux Krea, GPT Image 2, Nano Banana 2
 *   • Premium (3 sparkles) — Flux 1.1 Pro Ultra, Flux 2 Max, GPT Image 1, Nano Banana Pro
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import { IMAGE_MODELS, DEFAULT_MODEL_ID, type ImageModel } from '@/constants/imageModels';

const TIER_LABELS: Record<ImageModel['tier'], string> = {
  standard: 'Standard',
  mid: 'Mid',
  premium: 'Premium',
};

const PROVIDER_LABELS: Record<ImageModel['provider'], string> = {
  replicate: 'Replicate',
  openai: 'OpenAI',
  gemini: 'Google',
};

const TIER_ORDER: ImageModel['tier'][] = ['standard', 'mid', 'premium'];

export default function SettingsAdvancedModeScreen() {
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL_ID);
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            When Advanced Mode is on (Create tab), your prompt is sent verbatim to the model — no AI
            enhancement, no medium or vibe directives, no face swap. Pick which model handles those
            renders. Premium models cost more sparkles per render.
          </Text>
        </View>
        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            {TIER_ORDER.map((tier) => {
              const tierModels = IMAGE_MODELS.filter((m) => m.tier === tier);
              if (tierModels.length === 0) return null;
              return (
                <View key={tier} style={{ marginTop: 16 }}>
                  <View style={styles.tierHeader}>
                    <Text style={[styles.tierLabel, { color: colors.textPrimary }]}>
                      {TIER_LABELS[tier]}
                    </Text>
                    <Text style={[styles.tierCost, { color: colors.textSecondary }]}>
                      {tierModels[0].sparkleCost === 1
                        ? '1 sparkle / render'
                        : `${tierModels[0].sparkleCost} sparkles / render`}
                    </Text>
                  </View>
                  {tierModels.map((opt) => {
                    const isSelected = opt.id === selected;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => handleSelect(opt.id)}
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
                          <View style={styles.optionTitleRow}>
                            <Text
                              style={{
                                color: colors.textPrimary,
                                fontSize: 15,
                                fontWeight: '600',
                              }}
                            >
                              {opt.label}
                            </Text>
                            <View
                              style={[
                                styles.providerBadge,
                                { borderColor: colors.border, backgroundColor: colors.background },
                              ]}
                            >
                              <Text
                                style={[styles.providerBadgeText, { color: colors.textSecondary }]}
                              >
                                {PROVIDER_LABELS[opt.provider]}
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={{
                              color: colors.textSecondary,
                              fontSize: 12,
                              marginTop: 4,
                              lineHeight: 17,
                            }}
                          >
                            {opt.description}
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
                          {isSelected && (
                            <Ionicons name="checkmark" size={14} color={colors.accent} />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    lineHeight: 19,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  tierLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  tierCost: {
    fontSize: 12,
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
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  providerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
