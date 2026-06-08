/**
 * ModelPicker — the single, unified AI-model selector for the Create screen.
 *
 * Replaces the old split (FluxModelPicker for Direct + DreamBotModelPicker for
 * DreamBot). The model is now a TOP-LEVEL choice shared by BOTH routes: the
 * DreamBot engine (mediums/vibes/face-swap) and Direct (raw prompt) both render
 * with whatever model is picked here. Face swap already works on any model's
 * output (faceSwap.ts handles OpenAI/Gemini base64), so any model can run
 * through the engine.
 *
 * Built for non-technical users first: a small "Recommended" group up top
 * (RECOMMENDED_MODEL_IDS) with short plain-English blurbs, and a "More models"
 * group below for everything else. Each row shows the model's sparkle cost
 * (costs now vary 1–5 and the Dream button reflects the pick).
 *
 * STICKY + cross-device: persists to users.pro_mode_flux_model (the column the
 * engine already reads), so the choice follows the user to a new install.
 * Fires onChange(modelId) after the initial DB load AND on every selection so
 * the Create screen keeps force_model + the cost display in sync.
 */

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import {
  DEFAULT_MODEL_ID,
  RECOMMENDED_MODEL_IDS,
  modelBlurb,
  type ImageModel,
} from '@/constants/imageModels';
import { useImageModels } from '@/hooks/useImageModels';

interface Props {
  /** Fires after the initial DB load and on each selection. */
  onChange?: (modelId: string) => void;
}

export function ModelPicker({ onChange }: Props) {
  const user = useAuthStore((s) => s.user);
  const models = useImageModels();
  const [selected, setSelected] = useState<string>(DEFAULT_MODEL_ID);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Load the sticky choice from the DB column (cross-device). Fire onChange so
  // the parent's force_model + cost reflect the restored value immediately.
  useEffect(() => {
    if (!user) return;
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
      onChange?.(loaded);
    })();
    return () => {
      active = false;
    };
    // onChange intentionally omitted — parent passes a stable handler; refire
    // only on user change, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelect = async (modelId: string) => {
    if (!user || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(modelId);
    onChange?.(modelId);
    setModalOpen(false);
    if (modelId === selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({ pro_mode_flux_model: modelId })
      .eq('id', user.id);
    if (error && __DEV__) console.error('[ModelPicker] save failed:', error.message);
    setSaving(false);
  };

  // Split into Recommended (in the curated order) + More (everything else,
  // cheapest first so the cost ladder reads naturally).
  const recommended = RECOMMENDED_MODEL_IDS.map((id) => models.find((m) => m.id === id)).filter(
    (m): m is ImageModel => !!m
  );
  const recommendedIds = new Set(RECOMMENDED_MODEL_IDS);
  const more = models
    .filter((m) => !recommendedIds.has(m.id))
    .sort((a, b) => a.sparkleCost - b.sparkleCost);

  const renderRow = (opt: ImageModel) => {
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
          <Text style={{ color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '600' }}>
            {opt.label}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: fontScale(12),
              marginTop: verticalScale(3),
              lineHeight: fontScale(16),
            }}
          >
            {modelBlurb(opt.id, opt.description)}
          </Text>
        </View>
        <View style={[styles.costBadge, { borderColor: colors.border }]}>
          <Text style={[styles.costBadgeText, { color: colors.textPrimary }]}>
            {opt.sparkleCost}
          </Text>
          <Ionicons name="sparkles" size={11} color={colors.accent} style={{ marginLeft: 3 }} />
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
  };

  const current = models.find((m) => m.id === selected);

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
        <Text
          style={{ color: colors.textPrimary, fontSize: fontScale(14), fontWeight: '600', flex: 1 }}
          numberOfLines={1}
        >
          {current?.label ?? 'Flux 1.1 Pro'}
        </Text>
        {current && (
          <View style={styles.pillCost}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: fontScale(11),
                fontWeight: '600',
                marginRight: 3,
              }}
            >
              {current.sparkleCost}
            </Text>
            <Ionicons name="sparkles" size={11} color={colors.accent} />
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
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setModalOpen(false)}
          />
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text
                style={{ color: colors.textPrimary, fontSize: fontScale(17), fontWeight: '700' }}
              >
                Choose your AI model
              </Text>
              <TouchableOpacity onPress={() => setModalOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: fontScale(12),
                lineHeight: fontScale(17),
                marginBottom: verticalScale(4),
              }}
            >
              Each one gives your dream a slightly different look. Pick one and try it out.
            </Text>
            <ScrollView
              style={{ maxHeight: 460 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: verticalScale(24) }}
            >
              {recommended.length > 0 && (
                <View style={{ marginTop: verticalScale(12) }}>
                  <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
                    Recommended
                  </Text>
                  {recommended.map(renderRow)}
                </View>
              )}
              {more.length > 0 && (
                <View style={{ marginTop: verticalScale(8) }}>
                  <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
                    More models
                  </Text>
                  {more.map(renderRow)}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: fontScale(13),
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginBottom: verticalScale(8),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: verticalScale(3),
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 10,
  },
  costBadgeText: { fontSize: fontScale(12), fontWeight: '700' },
  pillLabel: {
    fontSize: fontScale(12),
    fontWeight: '500',
    marginBottom: verticalScale(6),
    marginLeft: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    borderWidth: 1,
  },
  pillCost: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: verticalScale(2),
    borderRadius: 6,
    marginRight: 8,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(8),
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: verticalScale(12),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
});
