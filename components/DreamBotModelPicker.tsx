/**
 * DreamBotModelPicker — friendly AI-model selector for the DreamBot (engine)
 * route on the Create screen.
 *
 * Unlike <FluxModelPicker> (Advanced/Direct mode — full catalog grouped by
 * family, writes users.pro_mode_flux_model, "prompt sent verbatim"), this is a
 * deliberately SMALL, plain-English picker for normal users: a curated set of
 * models that all cost 1 sparkle, shown by real model name + a one-line "what
 * it's good at". The choice is forced through the full DreamBot engine
 * (styling, polish, face swap) via `force_model` — it only swaps which model
 * renders, so cost + margin are unchanged.
 *
 * STICKY: the selection persists in AsyncStorage (survives screen returns + app
 * reloads), mirroring the existing USE_EXACT_PROMPT toggle pattern. The parent
 * passes the value to the engine as force_model; no DB column / RPC needed.
 *
 * Fires onChange(modelId) once after rehydrate AND on every selection so the
 * Create screen can keep force_model in sync.
 */

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

/** Curated, all-1-sparkle lineup. Real model names + a plain-English strength.
 *  Every id here costs ≤ Flux 1.1 Pro, so margin is equal-or-better and the
 *  user always pays 1 sparkle regardless of pick. */
interface DreamBotModel {
  id: string;
  name: string;
  blurb: string;
  recommended?: boolean;
}

export const DREAMBOT_MODELS: DreamBotModel[] = [
  {
    id: 'black-forest-labs/flux-1.1-pro',
    name: 'Flux 1.1 Pro',
    blurb: 'Balanced and reliable — a great all-rounder',
    recommended: true,
  },
  {
    id: 'black-forest-labs/flux-2-pro',
    name: 'Flux 2 Pro',
    blurb: 'Newest engine — sharper detail and fidelity',
  },
  {
    id: 'google/gemini-2-image',
    name: 'Nano Banana',
    blurb: 'Bold, vivid color and crisp detail',
  },
  {
    id: 'black-forest-labs/flux-dev',
    name: 'Flux Dev',
    blurb: 'Softer, more artistic and painterly',
  },
  {
    id: 'black-forest-labs/flux-schnell',
    name: 'Flux Schnell',
    blurb: 'Fastest — renders in seconds',
  },
];

export const DREAMBOT_DEFAULT_MODEL = 'black-forest-labs/flux-1.1-pro';
const DREAMBOT_MODEL_KEY = 'create.dreambotModel.v1';

const isCurated = (id: string | null | undefined): id is string =>
  !!id && DREAMBOT_MODELS.some((m) => m.id === id);

interface Props {
  /** Fires after rehydrate and on each selection. */
  onChange?: (modelId: string) => void;
}

export function DreamBotModelPicker({ onChange }: Props) {
  const [selected, setSelected] = useState<string>(DREAMBOT_DEFAULT_MODEL);
  const [modalOpen, setModalOpen] = useState(false);

  // Rehydrate the sticky choice on mount. Only accept a curated id (guards
  // against a stale Advanced-mode model id leaking in). Fire onChange so the
  // parent's force_model reflects the restored value immediately.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(DREAMBOT_MODEL_KEY)
      .then((val) => {
        if (!active) return;
        const restored = isCurated(val) ? val : DREAMBOT_DEFAULT_MODEL;
        setSelected(restored);
        onChange?.(restored);
      })
      .catch(() => {
        if (active) onChange?.(DREAMBOT_DEFAULT_MODEL);
      });
    return () => {
      active = false;
    };
    // onChange intentionally omitted — parent passes a stable handler; we only
    // want to fire on mount, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (modelId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(modelId);
    onChange?.(modelId);
    setModalOpen(false);
    AsyncStorage.setItem(DREAMBOT_MODEL_KEY, modelId).catch((e) => {
      if (__DEV__) console.warn('[DreamBotModelPicker] persist failed', e);
    });
  };

  const current = DREAMBOT_MODELS.find((m) => m.id === selected) ?? DREAMBOT_MODELS[0];

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
          {current.name}
        </Text>
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
                marginBottom: verticalScale(8),
              }}
            >
              Each one renders your dream a little differently. Same cost — pick a look and try it
              out.
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: verticalScale(24) }}
            >
              {DREAMBOT_MODELS.map((opt) => {
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
                            fontSize: fontScale(15),
                            fontWeight: '600',
                          }}
                        >
                          {opt.name}
                        </Text>
                        {opt.recommended && (
                          <View style={[styles.recBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.recBadgeText}>RECOMMENDED</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: fontScale(12),
                          marginTop: verticalScale(4),
                          lineHeight: fontScale(17),
                        }}
                      >
                        {opt.blurb}
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recBadge: {
    paddingHorizontal: 7,
    paddingVertical: verticalScale(2),
    borderRadius: 4,
  },
  recBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#FFFFFF',
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
    maxHeight: '80%',
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
