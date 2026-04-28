import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const onboardingStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  heroTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

  selectedCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedCountMet: { color: '#4ADE80' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    backgroundColor: colors.background,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerButtons: { flexDirection: 'row', gap: 12 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  backBtnText: { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.accent,
    gap: 6,
  },
  continueBtnDisabled: { backgroundColor: colors.surface },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  continueBtnTextDisabled: { color: colors.textSecondary },
});
