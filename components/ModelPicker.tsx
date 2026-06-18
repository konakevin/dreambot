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
 * Built for non-technical users first: every model is simply listed in two
 * cost tiers — Standard (1✦) and Premium (2✦+) — with short plain-English
 * blurbs, so people can freely experiment with any look. No per-medium
 * steering; flux-1.1-pro just carries a small "Default" hint. Each row shows
 * the model's sparkle cost (costs vary 1–5 and the Dream button reflects it).
 *
 * STICKY + cross-device: persists to users.pro_mode_flux_model (the column the
 * engine already reads), so the choice follows the user to a new install.
 * Fires onChange(modelId) after the initial DB load AND on every selection so
 * the Create screen keeps force_model + the cost display in sync.
 */

import { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { TitleText } from '@/components/TitleText';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import {
  DEFAULT_MODEL_ID,
  STANDARD_MODEL_IDS,
  PREMIUM_MODEL_IDS,
  RECOMMENDED_MODEL_ID,
  modelBlurb,
  type ImageModel,
} from '@/constants/imageModels';
import { useImageModels } from '@/hooks/useImageModels';

interface Props {
  /** Fires after the initial DB load and on each selection. */
  onChange?: (modelId: string) => void;
  /**
   * True when the Create screen is in DreamBot mode (the face-swap engine).
   * In that mode models flagged dreamBotEnabled=false (e.g. flux-schnell, which
   * breaks the swap — 2026-06-13 audit) are hidden. Direct mode shows them all.
   */
  dreamBotMode?: boolean;
}

export function ModelPicker({ onChange, dreamBotMode }: Props) {
  const user = useAuthStore((s) => s.user);
  const models = useImageModels();
  // In DreamBot mode, drop models that aren't swap-quality from the picker.
  const visibleModels = dreamBotMode ? models.filter((m) => m.dreamBotEnabled !== false) : models;
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

  // Two tiers in explicit curated order: Standard (1✦) + Premium (2✦+).
  // Draws from visibleModels so DreamBot-hidden models (flux-schnell) drop out.
  // No per-medium steering — every model is listed so people can experiment
  // however they want; flux-1.1-pro just carries a "Default" hint.
  const order = (ids: string[]) =>
    ids.map((id) => visibleModels.find((m) => m.id === id)).filter((m): m is ImageModel => !!m);
  const standard = order(STANDARD_MODEL_IDS);
  const premium = order(PREMIUM_MODEL_IDS);

  // If the saved pick is hidden in DreamBot mode (e.g. a Direct-mode flux-schnell
  // choice), fall back to the default for face-swap dreams WITHOUT overwriting
  // the saved column — so switching back to Direct restores their pick.
  const savedHidden =
    dreamBotMode && models.find((m) => m.id === selected)?.dreamBotEnabled === false;
  const effectiveSelected = savedHidden ? DEFAULT_MODEL_ID : selected;
  useEffect(() => {
    if (savedHidden) onChange?.(effectiveSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedHidden, effectiveSelected]);
  // Tier header is just the label — each row already shows its own cost, so the
  // group-level cost indicator was redundant.
  const renderTierHeader = (title: string) => (
    <View style={styles.groupHeader}>
      <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  const renderRow = (opt: ImageModel) => {
    const isSelected = opt.id === effectiveSelected;
    return (
      <TouchableOpacity
        key={opt.id}
        onPress={() => handleSelect(opt.id)}
        activeOpacity={0.7}
        style={[
          styles.option,
          {
            // Active state matches the Create mode tabs: tonal moon-purple fill +
            // border, purple label. The outline + highlight is the selection cue
            // (no radio needed).
            backgroundColor: isSelected ? 'rgba(167,139,250,0.18)' : colors.surface,
            borderColor: isSelected ? 'rgba(167,139,250,0.55)' : colors.border,
          },
        ]}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={styles.titleRow}>
            <Text
              style={{
                color: isSelected ? '#A78BFA' : colors.textPrimary,
                fontSize: fontScale(15),
                fontWeight: '600',
              }}
            >
              {opt.label}
            </Text>
            {opt.id === RECOMMENDED_MODEL_ID && (
              <Text style={[styles.recLabel, { color: '#A78BFA' }]}>Default</Text>
            )}
          </View>
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
        {/* Sparkle icon + per-model cost number. */}
        <View style={[styles.costBadge, { borderColor: colors.border }]}>
          <Ionicons name="sparkles" size={13} color="#A78BFA" />
          <Text
            style={{
              color: '#A78BFA',
              fontSize: fontScale(12),
              fontWeight: '700',
              marginLeft: 3,
            }}
          >
            {opt.sparkleCost}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const current = models.find((m) => m.id === effectiveSelected);

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
        {/* Sparkle icon + the selected model's cost number. */}
        {current && (
          <View style={styles.pillCost}>
            <Ionicons name="sparkles" size={14} color="#A78BFA" />
            <Text
              style={{
                color: '#A78BFA',
                fontSize: fontScale(13),
                fontWeight: '700',
                marginLeft: 3,
              }}
            >
              {current.sparkleCost}
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
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setModalOpen(false)}
          />
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TitleText>Choose your AI model</TitleText>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalOpen(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Each one gives your dream a slightly different look. The cost varies by model
              depending on compute.
            </Text>
            <ScrollView
              style={{ maxHeight: 460 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: verticalScale(24) }}
            >
              {standard.length > 0 && (
                <View style={{ marginTop: verticalScale(12) }}>
                  {renderTierHeader('Standard')}
                  {standard.map(renderRow)}
                </View>
              )}
              {premium.length > 0 && (
                <View style={{ marginTop: verticalScale(8) }}>
                  {renderTierHeader('Premium')}
                  {premium.map(renderRow)}
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
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: verticalScale(8),
  },
  groupLabel: {
    fontSize: fontScale(13),
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recLabel: { fontSize: fontScale(11), fontWeight: '700' },
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
    // Inline value (sparkle + count), NOT a button — no fill/border, so it
    // doesn't read like the tappable mode tabs. The whole row is the tap target.
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  modalClose: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    lineHeight: fontScale(17),
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
});
