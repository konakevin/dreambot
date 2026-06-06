import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import * as Haptics from 'expo-haptics';
import { type PurchasesPackage } from 'react-native-purchases';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';
import {
  useSparkleBalance,
  useSparklePackages,
  usePurchaseSparkles,
  useRestorePurchases,
} from '@/hooks/useSparkles';
import { PACK_INFO } from '@/constants/sparklePacks';
import { trackSparkleStoreOpened, trackSparklePurchaseTapped } from '@/lib/analytics';
import { verticalScale, fontScale } from '@/lib/responsive';

/** Flavor copy per sparkle pack — appears under the grid when selected.
 *  Uses the actual sparkle count so the copy never gets out of sync with
 *  the pack lineup. premium-render math uses /3 (3 sparkles per premium
 *  model render — Flux 2 Max / GPT Image 1 / Nano Banana Pro). */
function getPackCopy(sparkles: number): string {
  const premium = Math.floor(sparkles / 3);
  if (sparkles <= 20) {
    return `A quick top-up — ${sparkles} standard renders or ${premium} premium.`;
  }
  if (sparkles <= 50) {
    return `Casual use — ${sparkles} standard renders or ${premium} premium. A couple weeks of dreaming.`;
  }
  if (sparkles <= 100) {
    return `Most popular — about a month of regular renders. ${sparkles} standard or ${premium} premium.`;
  }
  if (sparkles <= 250) {
    return `Best value — months of renders with room for premium models. ${sparkles} standard or ${premium} premium.`;
  }
  return `Power user — half a year of renders, plenty for premium models. ${sparkles} standard or ${premium} premium.`;
}

function PackCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: PurchasesPackage;
  isSelected: boolean;
  onSelect: (pkg: PurchasesPackage) => void;
}) {
  const product = pkg.product;
  const info = PACK_INFO[product.identifier] ?? {
    sparkles: 0,
    icon: 'sparkles-outline',
    label: '',
  };
  const isBestValue = info.label === 'Best Value';
  const isPopular = info.label === 'Popular';
  const badgeLabel = isBestValue ? 'BEST VALUE' : isPopular ? 'POPULAR' : null;

  return (
    <TouchableOpacity
      style={[s.packCard, isSelected && s.packCardSelected]}
      onPress={() => onSelect(pkg)}
      activeOpacity={0.85}
    >
      {/* Left: icon */}
      <View style={s.packIcon}>
        <Ionicons
          name={info.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={colors.accent}
        />
      </View>

      {/* Middle: sparkles count + price */}
      <View style={{ flex: 1 }}>
        <View style={s.packTitleRow}>
          <Text style={s.packSparkles}>{info.sparkles}</Text>
          <Text style={s.packSparklesLabel}> sparkles</Text>
          {badgeLabel && (
            <View
              style={[
                s.inlineBadge,
                { backgroundColor: isBestValue ? colors.accent : colors.warning },
              ]}
            >
              <Text style={[s.inlineBadgeText, !isBestValue && { color: '#000' }]}>
                {badgeLabel}
              </Text>
            </View>
          )}
        </View>
        <Text style={s.packPrice}>{product.priceString}</Text>
      </View>

      {/* Right: radio dot */}
      <View style={[s.packRadio, isSelected && s.packRadioSelected]}>
        {isSelected && <View style={s.packRadioInner} />}
      </View>
    </TouchableOpacity>
  );
}

// Toggle to `true` to render the hardcoded MOCK_PACKAGES below instead of
// fetching from RevenueCat. Useful for App Store Connect review
// screenshots when StoreKit / RC sync hasn't completed yet (e.g., right
// after creating new IAP products on the Apple side). Must be `false`
// for production — mock packages can't actually be purchased through
// StoreKit (they'll error out at purchase time).
const USE_MOCK_PACKS_FOR_SCREENSHOT = false;

const MOCK_PACKAGES: PurchasesPackage[] = [
  {
    identifier: 'pack_15',
    product: { identifier: 'com.konakevin.radorbad.sparkles.15_v2', priceString: '$1.99' },
  },
  {
    identifier: 'pack_40',
    product: { identifier: 'com.konakevin.radorbad.sparkles.40_v2', priceString: '$4.99' },
  },
  {
    identifier: 'pack_90',
    product: { identifier: 'com.konakevin.radorbad.sparkles.90_v2', priceString: '$9.99' },
  },
  {
    identifier: 'pack_200',
    product: { identifier: 'com.konakevin.radorbad.sparkles.200_v2', priceString: '$19.99' },
  },
  {
    identifier: 'pack_500',
    product: { identifier: 'com.konakevin.radorbad.sparkles.500_v2', priceString: '$49.99' },
  },
  // deno-lint-ignore no-explicit-any
] as unknown as PurchasesPackage[];

export default function SparkleStoreScreen() {
  const { data: balance = 0 } = useSparkleBalance();
  const { data: livePackages = [], isLoading: liveIsLoading } = useSparklePackages();
  const { mutate: purchase, isPending: purchasing } = usePurchaseSparkles();
  useEffect(() => {
    trackSparkleStoreOpened();
  }, []);
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Screenshot mode bypasses the live RC data so the new lineup renders
  // even before App Store Connect + RC have synced the new products.
  const packages = USE_MOCK_PACKS_FOR_SCREENSHOT ? MOCK_PACKAGES : livePackages;
  const isLoading = USE_MOCK_PACKS_FOR_SCREENSHOT ? false : liveIsLoading;

  const sorted = [...packages].sort((a, b) => {
    const aInfo = PACK_INFO[a.product.identifier];
    const bInfo = PACK_INFO[b.product.identifier];
    return (aInfo?.sparkles ?? 0) - (bInfo?.sparkles ?? 0);
  });

  // Default selection = "Best Value" pack (or middle pack as fallback).
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  useEffect(() => {
    if (selectedPkgId || sorted.length === 0) return;
    const bestValue = sorted.find((p) => PACK_INFO[p.product.identifier]?.label === 'Best Value');
    setSelectedPkgId((bestValue ?? sorted[Math.floor(sorted.length / 2)]).identifier);
  }, [sorted, selectedPkgId]);

  const selectedPkg = sorted.find((p) => p.identifier === selectedPkgId) ?? null;
  const selectedInfo = selectedPkg ? PACK_INFO[selectedPkg.product.identifier] : null;

  function handleSelect(pkg: PurchasesPackage) {
    Haptics.selectionAsync();
    setSelectedPkgId(pkg.identifier);
  }

  function handlePurchase() {
    if (!selectedPkg) return;
    trackSparklePurchaseTapped({ pack: selectedPkg.product.identifier });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchase(selectedPkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const info = PACK_INFO[selectedPkg.product.identifier];
        Toast.show(`${info?.sparkles ?? ''} sparkles added!`, 'sparkles');
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed — try again', 'close-circle');
      },
    });
  }

  return (
    <ScreenLayout header="back" title="Get Sparkles">
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Balance — compact inline "✨ {N} sparkles" header. The big
              circle-icon + 44pt count was eating ~140px of vertical
              real-estate for no informational gain. */}
          <View style={s.balanceRow}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={s.balanceAmount}>{balance}</Text>
            <Text style={s.balanceLabel}>sparkles available</Text>
          </View>

          {/* Section header */}
          <Text style={s.sectionTitle}>Choose a Pack</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
          ) : sorted.length === 0 ? (
            <View style={s.emptyWrap}>
              <Ionicons name="bag-outline" size={48} color={colors.textSecondary} />
              <Text style={s.emptyText}>Store not available yet</Text>
              <Text style={s.emptySub}>Packs will appear here once the store is configured</Text>
            </View>
          ) : (
            <View style={s.packGrid}>
              {sorted.map((pkg) => (
                <PackCard
                  key={pkg.identifier}
                  pkg={pkg}
                  isSelected={pkg.identifier === selectedPkgId}
                  onSelect={handleSelect}
                />
              ))}
            </View>
          )}

          {/* Restore */}
          <TouchableOpacity
            style={s.restoreButton}
            onPress={() =>
              restore(undefined, {
                onSuccess: () => Toast.show('Purchases restored', 'checkmark-circle'),
                onError: () => Toast.show('Restore failed', 'close-circle'),
              })
            }
            activeOpacity={0.7}
            disabled={restoring}
          >
            <Text style={s.restoreText}>{restoring ? 'Restoring...' : 'Restore Purchases'}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Pinned footer — selection copy + primary CTA, always visible. */}
        {sorted.length > 0 && (
          <View style={s.stickyFooter}>
            {selectedInfo && <Text style={s.packDetail}>{getPackCopy(selectedInfo.sparkles)}</Text>}
            <TouchableOpacity
              style={[s.primaryCta, (!selectedPkg || purchasing) && s.primaryCtaDisabled]}
              activeOpacity={0.85}
              disabled={!selectedPkg || purchasing}
              onPress={handlePurchase}
            >
              {purchasing ? (
                <View style={s.ctaConnecting}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={s.primaryCtaText}>Connecting to App Store…</Text>
                </View>
              ) : (
                <Text style={s.primaryCtaText}>
                  {selectedPkg
                    ? `Buy ${selectedInfo?.sparkles ?? ''} sparkles — ${selectedPkg.product.priceString}`
                    : 'Select a pack'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  // Bottom padding sized for the sticky footer height (helper line +
  // CTA + paddings ≈ 130-150px) plus a buffer so the Restore link
  // can still be scrolled into view above the footer.
  scroll: { paddingHorizontal: 16, paddingBottom: verticalScale(180) },

  // Pinned footer — selection copy + primary CTA, always visible
  // above the keyboard / fold regardless of scroll position.
  // paddingBottom 32 clears the home indicator on notched phones so
  // the CTA's bottom corners don't get truncated.
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(32),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  ctaConnecting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Balance — inline single-line row showing "✨ {N} sparkles available"
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: verticalScale(14),
    marginBottom: 4,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },

  // Section
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: verticalScale(16),
  },

  // Pack list — vertical stack of compact pack cards (matches proStore's
  // tier list pattern). Each card is a single row: icon + sparkle count
  // + price + radio. Fits 4 packs comfortably above the sticky footer.
  packGrid: {
    gap: 10,
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: verticalScale(14),
    paddingHorizontal: 16,
  },
  packCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(139,123,238,0.08)',
  },
  packIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(139,123,238,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 0,
    flexWrap: 'wrap',
  },
  packSparkles: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  packSparklesLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  // Inline badge — replaces the old absolute-positioned overlay badge
  // so it lays out within the row flow.
  inlineBadge: {
    marginLeft: 8,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  inlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  packPrice: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '600',
    marginTop: 2,
  },
  // Right-edge selection radio
  packRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packRadioSelected: {
    borderColor: colors.accent,
  },
  packRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },

  // Selected-pack flavor copy
  packDetail: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    textAlign: 'center',
    marginTop: verticalScale(18),
    marginBottom: verticalScale(14),
    paddingHorizontal: 12,
  },

  // Primary CTA
  primaryCta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  primaryCtaDisabled: {
    opacity: 0.5,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: verticalScale(40) },
  emptyText: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: fontScale(14), textAlign: 'center' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: verticalScale(28) },
  restoreText: { color: colors.textSecondary, fontSize: fontScale(14), fontWeight: '600' },
});
