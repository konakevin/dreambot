/**
 * FluxModelPicker — reusable AI image-model selector.
 *
 * Self-contained: reads/writes users.pro_mode_flux_model (the column the
 * generate-dream Edge Function reads at request time for Advanced Mode /
 * direct-pass-through renders). Selecting a model here updates that column,
 * so the change takes effect on the very next dream — no backend change.
 *
 * Two variants:
 *   • variant="list" — full inline tiered list (Settings → Advanced Mode).
 *   • variant="pill" — compact "AI Model" dropdown pill that opens the same
 *     tiered list in a modal (Create screen, when Advanced Mode is on).
 *
 * Fires onChange(modelId) once after the initial load AND on every selection,
 * so a parent (e.g. the Create screen) can reflect the selected model's
 * sparkle cost on the dream button.
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import {
  IMAGE_MODELS,
  DEFAULT_MODEL_ID,
  findModel,
  type ImageModel,
} from '@/constants/imageModels';

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

interface Props {
  /** 'list' = full inline tiered list; 'pill' = dropdown pill + modal. */
  variant?: 'list' | 'pill';
  /** Fires after initial load and on each selection. */
  onChange?: (modelId: string) => void;
}

export function FluxModelPicker({ variant = 'list', onChange }: Props) {
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL_ID);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('users')
        .select('pro_mode_flux_model')
        .eq('id', user.id)
        .single();
      if (!active) return;
      const loaded = data?.pro_mode_flux_model || DEFAULT_MODEL_ID;
      setSelected(loaded);
      setLoading(false);
      onChange?.(loaded);
    })();
    return () => {
      active = false;
    };
    // onChange intentionally omitted — parent passes a stable handler; we only
    // want to refire on user change, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelect = async (modelId: string) => {
    if (!user || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(modelId);
    onChange?.(modelId);
    if (variant === 'pill') setModalOpen(false);
    if (modelId === selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({ pro_mode_flux_model: modelId })
      .eq('id', user.id);
    if (error) console.error('[FluxModelPicker] save failed:', error.message);
    setSaving(false);
  };

  const renderTierList = () => (
    <View>
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
                      <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                        {opt.label}
                      </Text>
                      <View
                        style={[
                          styles.providerBadge,
                          { borderColor: colors.border, backgroundColor: colors.background },
                        ]}
                      >
                        <Text style={[styles.providerBadgeText, { color: colors.textSecondary }]}>
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
                    {isSelected && <Ionicons name="checkmark" size={14} color={colors.accent} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );

  // ── variant: list (inline, e.g. Settings) ──
  if (variant === 'list') {
    if (loading) {
      return (
        <View style={{ paddingTop: 40, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      );
    }
    return renderTierList();
  }

  // ── variant: pill (Create screen dropdown → modal) ──
  const current = findModel(selected);
  return (
    <View>
      <Text style={[styles.pillLabel, { color: colors.textSecondary }]}>AI Model</Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalOpen(true);
        }}
        activeOpacity={0.7}
        style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}
            numberOfLines={1}
          >
            {current?.label ?? 'Flux 1.1 Pro'}
          </Text>
        </View>
        {current && (
          <View style={styles.pillCost}>
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '600' }}>
              {current.sparkleCost} ✦
            </Text>
          </View>
        )}
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={[styles.modalSheet, { backgroundColor: colors.background }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
                Choose AI Model
              </Text>
              <TouchableOpacity onPress={() => setModalOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text
              style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 4 }}
            >
              Your prompt is sent verbatim to this model. Premium models cost more sparkles per
              render.
            </Text>
            <ScrollView
              style={{ maxHeight: 460 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {renderTierList()}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  tierCost: { fontSize: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  providerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  providerBadgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  // pill variant
  pillLabel: { fontSize: 12, fontWeight: '500', marginBottom: 6, marginLeft: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillCost: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
