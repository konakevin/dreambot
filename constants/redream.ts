/**
 * "Dream a twin" (Kevin's pick, 2026-09-18: a twin = same DNA, a different scene) — the owner-only long-press action on a NIGHTLY dream (Kevin 2026-09-18). It re-runs the nightly
 * engine on demand with the same look, vibe and cast, in a brand-new setting, for the base dream price. The old
 * "Dream this again" stays for Create dreams (it reloads their prompt + medium into Create); a nightly look is not a
 * Create medium, so a nightly dream gets THIS action instead. Copy lives here so the label is one edit.
 */
export const REDREAM_LABEL = 'Dream a twin';
export const REDREAM_ICON = 'sparkles-outline';

export function redreamSubtitle(cost: number): string {
  return `Same world, new scene · ${cost} sparkle${cost === 1 ? '' : 's'}`;
}

export const REDREAM_CONFIRM_TITLE = 'Dream a twin?';

/** No medium name, no price (the button carries it) — Kevin 2026-09-18: "a new dream in this style". */
export const REDREAM_CONFIRM_BODY = 'Same world, same style, same cast. A brand-new scene.';

export function redreamConfirmButton(cost: number): string {
  return `Dream it · ${cost} sparkle${cost === 1 ? '' : 's'}`;
}

export const REDREAM_CANCEL = 'Not now';

/** Vibe labels carry an internal version suffix ("Opulent · bold"); users see the family. */
export function displayStyleLabel(label: string): string {
  return label.split(' · ')[0].trim();
}
