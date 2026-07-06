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
import { useImageModels } from '@/hooks/useImageModels';
import { sparkleCostFrom } from '@/constants/imageModels';

export interface RestyleModel {
  id: string;
  label: string;
  sparkleCost: number;
  blurb: string;
}

// The restyle catalog. This owns the CLIENT concerns — which models to offer,
// their order, labels, and blurbs. The `sparkleCost` here is a FALLBACK only:
// the live price comes from the DB (image_models, via resolveRestyleCost) so a
// dashboard price change can't leave a stale label. enqueue-dream charges
// getSparkleCost(force_model) off that same DB row, so the shown price and the
// charge always agree.
// Expanded 2026-07-06 after the restyle identity A/B (see the results page /
// session notes): Flux 2 Pro won likeness at the 1-sparkle tier and is the
// new default; Kontext stays for its looser artistic repaint; Seedream is
// the photo-faithful budget pick; Nano Banana Pro remains the premium.
export const RESTYLE_MODELS: RestyleModel[] = [
  {
    id: 'black-forest-labs/flux-2-pro',
    label: 'Flux 2 Pro',
    sparkleCost: 1,
    blurb: 'Keeps your face and composition true while fully committing to the style.',
  },
  {
    id: 'black-forest-labs/flux-kontext-pro',
    label: 'Flux Kontext',
    sparkleCost: 1,
    blurb: "Repaints your photo in the medium's style. Artistic and loose.",
  },
  {
    id: 'bytedance/seedream-4',
    label: 'Seedream',
    sparkleCost: 1,
    blurb: 'Stays closest to your original photo, with a lighter artistic touch.',
  },
  {
    id: 'black-forest-labs/flux-kontext-max',
    label: 'Flux Kontext Max',
    sparkleCost: 2,
    blurb: 'Kontext with stronger prompt adherence and detail.',
  },
  {
    id: 'google/gemini-3-image-preview',
    label: 'Nano Banana Pro',
    sparkleCost: 5,
    blurb: 'Premium restyle: the most beautiful artistic take that still keeps your likeness.',
  },
];

export const DEFAULT_RESTYLE_MODEL_ID = RESTYLE_MODELS[0].id;

/** Catalog fallback price — used only when the DB row is unavailable. */
export function restyleSparkleCost(modelId: string): number {
  return RESTYLE_MODELS.find((m) => m.id === modelId)?.sparkleCost ?? 1;
}

/**
 * Live restyle price: prefer the DB (image_models) so it matches what
 * enqueue-dream will actually charge; fall back to the hardcoded catalog when
 * the model isn't a DB row (restyle-only models may be hidden from the main
 * picker) or the models list hasn't loaded. `models` comes from useImageModels.
 */
export function resolveRestyleCost(
  models: Array<{ id: string; sparkleCost: number }>,
  modelId: string
): number {
  return models.find((m) => m.id === modelId)?.sparkleCost ?? restyleSparkleCost(modelId);
}

// Sticky per-device (like the medium/vibe prefs) — restores across launches.
// v2 (2026-07-06): key bumped so everyone re-defaults to Flux 2 Pro (the old
// v1 pref pinned early users to Kontext, which lost the identity A/B).
const RESTYLE_MODEL_KEY = 'create.restyleModel.v2';

interface Props {
  /** Fires once after the sticky pick loads and on each selection. */
  onChange?: (modelId: string) => void;
}

export function RestyleModelPicker({ onChange }: Props) {
  const [selected, setSelected] = useState<string>(DEFAULT_RESTYLE_MODEL_ID);
  const [modalOpen, setModalOpen] = useState(false);
  const models = useImageModels();

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
            {resolveRestyleCost(models, current.id)}
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
                      {resolveRestyleCost(models, opt.id)}
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
