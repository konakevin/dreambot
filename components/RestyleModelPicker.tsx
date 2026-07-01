/**
 * RestyleModelPicker — the model choice for PHOTO RESTYLE only.
 *
 * Deliberately separate from <ModelPicker>: restyle is img2img, so its model
 * set (Kontext / Nano Banana Pro) doesn't overlap the text/New-Scene catalog
 * (Kontext is meaningless without an input image and never appears there),
 * and its stickiness must not touch the user's saved main-model pick — a
 * Kontext restyle should never leak into their next text dream. Each surface
 * remembers its own last choice.
 *
 * Default = Kontext (1✦, same cost basis the flat restyle price always
 * assumed). Nano Banana Pro (5✦) is the premium option with the strongest
 * subject likeness — restyle charges by model via force_model (enqueue-dream
 * prices getSparkleCost(force_model)), so the 5✦ tier pays for its ~13¢ cost.
 *
 * Context (2026-07-01): the 6 Real Face restyle mediums were pinned to Nano
 * Banana 2, which silently returns a near-copy of the photo instead of
 * restyling (verified via direct API repro across prompt/config variants) —
 * migration 319 moved those pins to Kontext and this picker made the model a
 * user choice.
 */

import { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text } from '@/components/AppText';
import { TitleText } from '@/components/TitleText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';

export interface RestyleModel {
  id: string;
  label: string;
  sparkleCost: number;
  blurb: string;
}

// The restyle catalog. Costs mirror the server's modelPricing.ts SPARKLE map —
// enqueue-dream charges getSparkleCost(force_model), so these numbers are the
// display of that charge, not the source of truth.
export const RESTYLE_MODELS: RestyleModel[] = [
  {
    id: 'black-forest-labs/flux-kontext-pro',
    label: 'Kontext',
    sparkleCost: 1,
    blurb: "Repaints your photo in the medium's style. Artistic and loose.",
  },
  {
    id: 'google/gemini-3-image-preview',
    label: 'Nano Banana Pro',
    sparkleCost: 5,
    blurb: 'Premium restyle — keeps faces, likeness, and composition closest to your photo.',
  },
];

export const DEFAULT_RESTYLE_MODEL_ID = RESTYLE_MODELS[0].id;

export function restyleSparkleCost(modelId: string): number {
  return RESTYLE_MODELS.find((m) => m.id === modelId)?.sparkleCost ?? 1;
}

// Sticky per-device (like the medium/vibe prefs) — restores across launches.
const RESTYLE_MODEL_KEY = 'create.restyleModel.v1';

interface Props {
  /** Fires once after the sticky pick loads and on each selection. */
  onChange?: (modelId: string) => void;
}

export function RestyleModelPicker({ onChange }: Props) {
  const [selected, setSelected] = useState<string>(DEFAULT_RESTYLE_MODEL_ID);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(RESTYLE_MODEL_KEY).then((saved) => {
      if (cancelled) return;
      const valid = saved && RESTYLE_MODELS.some((m) => m.id === saved) ? saved : selected;
      setSelected(valid);
      onChange?.(valid);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (modelId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(modelId);
    void AsyncStorage.setItem(RESTYLE_MODEL_KEY, modelId);
    onChange?.(modelId);
    setModalOpen(false);
  };

  const current = RESTYLE_MODELS.find((m) => m.id === selected) ?? RESTYLE_MODELS[0];

  return (
    <View>
      <Text style={[styles.pillLabel, { color: colors.textSecondary }]}>Restyle Model</Text>
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
          {current.label}
        </Text>
        <View style={styles.pillCost}>
          <Ionicons name="sparkles" size={14} color="#A78BFA" />
          <Text
            style={{ color: '#A78BFA', fontSize: fontScale(13), fontWeight: '700', marginLeft: 3 }}
          >
            {current.sparkleCost}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalRoot}>
          {/* alignSelf stretch is load-bearing: modalRoot centers children for
              the iPad sheet, which otherwise collapses this backdrop to zero
              width (same fix as ModelPicker). */}
          <TouchableOpacity
            style={{ flex: 1, alignSelf: 'stretch' }}
            activeOpacity={1}
            onPress={() => setModalOpen(false)}
          />
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.background, width: '100%' },
              isTabletDevice && { maxWidth: 600 },
            ]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TitleText>Choose your restyle model</TitleText>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalOpen(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Both transform your photo into the chosen medium. The cost varies by model.
            </Text>
            {RESTYLE_MODELS.map((opt) => {
              const isSelected = opt.id === selected;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => handleSelect(opt.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.option,
                    {
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
                      {opt.id === DEFAULT_RESTYLE_MODEL_ID && (
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
                      {opt.blurb}
                    </Text>
                  </View>
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
            })}
            <View style={{ height: verticalScale(24) }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 10,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: verticalScale(10),
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: verticalScale(12),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(6),
  },
  modalClose: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    marginBottom: verticalScale(14),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recLabel: {
    fontSize: fontScale(11),
    fontWeight: '700',
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: verticalScale(3),
    borderRadius: 6,
    borderWidth: 1,
  },
});
