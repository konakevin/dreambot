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
import { LinearGradient } from 'expo-linear-gradient';
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

/** Flavor copy per sparkle pack — appears under the grid when selected.
 *  Maps the pack's sparkle count to a short marketing line. */
function getPackCopy(sparkles: number): string {
  if (sparkles <= 25) {
    return 'Try it out — enough for a quick burst of dreams. About 25 standard renders.';
  }
  if (sparkles <= 50) {
    return 'Casual use — covers a week or two of regular dreaming. About 50 standard renders.';
  }
  if (sparkles <= 100) {
    return 'Most popular — a month of regular use at the best per-sparkle value.';
  }
  return 'Power user — months of renders with room to spare for premium models.';
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

  return (
    <TouchableOpacity
      style={[s.packCard, isSelected && s.packCardSelected]}
      onPress={() => onSelect(pkg)}
      activeOpacity={0.85}
    >
      {(isBestValue || isPopular) && (
        <View style={[s.badge, { backgroundColor: isBestValue ? colors.accent : colors.warning }]}>
          <Text style={[s.badgeText, !isBestValue && { color: '#000' }]}>
            {isBestValue ? 'BEST VALUE' : 'POPULAR'}
          </Text>
        </View>
      )}

      <View style={s.iconCircle}>
        <Ionicons
          name={info.icon as keyof typeof Ionicons.glyphMap}
          size={26}
          color={colors.accent}
        />
      </View>

      <Text style={s.packSparkles}>{info.sparkles}</Text>
      <Text style={s.packLabel}>sparkles</Text>

      <Text style={s.packPrice}>{product.priceString}</Text>

      {/* Selection indicator — radio dot at the bottom */}
      <View style={[s.packRadio, isSelected && s.packRadioSelected]}>
        {isSelected && <View style={s.packRadioInner} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SparkleStoreScreen() {
  const { data: balance = 0 } = useSparkleBalance();
  const { data: packages = [], isLoading } = useSparklePackages();
  const { mutate: purchase, isPending: purchasing } = usePurchaseSparkles();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

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
          {/* Balance hero */}
          <LinearGradient
            colors={['rgba(139,123,238,0.15)', 'rgba(139,123,238,0.03)', 'transparent']}
            style={s.balanceHero}
          >
            <View style={s.balanceGlow}>
              <Ionicons name="sparkles" size={40} color={colors.accent} />
            </View>
            <Text style={s.balanceAmount}>{balance}</Text>
            <Text style={s.balanceLabel}>sparkles available</Text>
          </LinearGradient>

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
  // Tighter bottom padding because the sticky footer takes up its own
  // ~120px of screen space; need to leave room above it so scrolled
  // content (Restore button) doesn't get hidden behind the footer.
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  // Pinned footer — selection copy + primary CTA, always visible
  // above the keyboard / fold regardless of scroll position.
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  ctaConnecting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Balance hero
  balanceHero: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: -16,
    marginBottom: 4,
  },
  balanceGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139,123,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },

  // Pack grid
  packGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 20,
    justifyContent: 'center',
  },
  packCard: {
    width: '46%',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingTop: 24,
    paddingBottom: 14,
    paddingHorizontal: 12,
  },
  packCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(139,123,238,0.08)',
  },
  badge: {
    position: 'absolute',
    top: -11,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139,123,238,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packSparkles: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  packLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  packPrice: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  // Selection radio at bottom of each card
  packRadio: {
    marginTop: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packRadioSelected: {
    borderColor: colors.accent,
  },
  packRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  // Selected-pack flavor copy
  packDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 14,
    paddingHorizontal: 12,
  },

  // Primary CTA
  primaryCta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  primaryCtaDisabled: {
    opacity: 0.5,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  emptyText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 28 },
  restoreText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
