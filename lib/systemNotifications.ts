/**
 * System notifications — the concept of a ping sent "from DreamBot" itself.
 *
 * A system notification is one DreamBot authors on its OWN initiative, not one
 * triggered by another human or by the user's own action. These render with the
 * DreamBot mascot avatar (the sign-in robot) and read as an official message
 * from DreamBot, never from the user's own face (their rows carry
 * actor_id = self, so without this they'd wrongly show the user's avatar).
 *
 * What IS a system notification:
 *   - trial_reminder / pro_reminder / basic_reminder  (trial + subscription expiry)
 *   - dream_generated that is a NIGHTLY auto-dream     ("DreamBot dreamed for you")
 *
 * What is NOT:
 *   - dream_generated with subtype 'manual'  — a Create-screen dream the USER
 *     made; it keeps the user's own avatar.
 *   - likes / comments / mentions / shares / follows / sparkle_gift — these are
 *     from another human and keep that actor's avatar.
 *
 * Single source of truth so the "from DreamBot" identity can't drift between
 * the inbox row, the badge, or anywhere else that needs to know.
 */

/** Notification types that are ALWAYS from DreamBot, regardless of subtype. */
export const DREAMBOT_SYSTEM_TYPES: ReadonlySet<string> = new Set([
  'trial_reminder',
  'pro_reminder',
  'basic_reminder',
  'welcome_gift', // the onboarding "Welcome to DreamBot" ping
  'cast_photo', // "your dream face needs a new photo" — authored by DreamBot itself
]);

/**
 * True when a notification is a DreamBot system notification — gets the mascot
 * avatar + "from DreamBot" identity. Pass the row's `type` and `subtype`.
 */
export function isDreamBotSystemNotification(type: string, subtype?: string | null): boolean {
  if (DREAMBOT_SYSTEM_TYPES.has(type)) return true;
  // Nightly auto-dreams are from DreamBot; Create-screen dreams (subtype
  // 'manual') are the user's own creation and keep the user's avatar.
  if (type === 'dream_generated' && subtype !== 'manual') return true;
  return false;
}
