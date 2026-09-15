/**
 * How a Dream Cast member is labelled in the UI.
 *
 * The KEYS are engine contract and must not change: `partner` is what opens the
 * romantic pose pools and the partner-only scenario rows (pickDualAction,
 * scenariosForRelationship, migration 518). Everything else here is display text, so
 * the word can be as warm as we like without touching a single render.
 *
 * Shared because the labels appear on two screens (onboarding's DreamCastStep and the
 * Settings roster) and a reworded copy in one place would silently disagree with the
 * other.
 */

export interface CastRelationshipOption {
  key: 'friend' | 'partner';
  /** The word itself. Also the card's title when the user has not named someone. */
  label: string;
  /** Paired glyphs differ in SILHOUETTE, not hue: colour alone separates nothing for
   *  a colour-blind user, and two hearts both read as romance regardless. */
  emoji: string;
}

export const CAST_RELATIONSHIPS: CastRelationshipOption[] = [
  { key: 'friend', label: 'Friend', emoji: '🤗' },
  { key: 'partner', label: 'Partner', emoji: '❤️' },
];

/** The label for a stored relationship value (anything not `partner` is a friend). */
export function castRelationshipLabel(relationship: string | null | undefined): string {
  return (
    CAST_RELATIONSHIPS.find((r) => r.key === relationship)?.label ?? CAST_RELATIONSHIPS[0].label
  );
}
