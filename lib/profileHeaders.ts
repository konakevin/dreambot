/**
 * Dreamscape profile headers (migration 554) — pure geometry + copy helpers.
 *
 * No React Native imports so fast jest can cover it. The header is a tall banner
 * that runs under the status bar and fades into the page; its crop position is a
 * focal point 0..100 with CSS object-position Y semantics, which is exactly what
 * expo-image's `contentPosition={{ top: 'N%' }}` does (ios/ContentPosition.swift:
 * offset = (container - content) * N/100). The picker and both profile screens
 * use these same functions, so what a member positions is what everyone sees.
 */

/** Header height / width at the iPhone-14 base (390pt wide → 336pt tall). */
export const HEADER_ASPECT = 336 / 390;
/** Never taller than this share of the screen (iPad, landscape). */
export const HEADER_MAX_SCREEN_FRACTION = 0.46;
/** Pictures per random draw in the picker: 2 across × 5 down (the grid scrolls). */
export const HEADER_DRAW_SIZE = 10;

export function headerHeight(width: number, screenHeight: number): number {
  return Math.round(Math.min(width * HEADER_ASPECT, screenHeight * HEADER_MAX_SCREEN_FRACTION));
}

export function clampFocal(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.max(0, Math.min(100, value));
}

/**
 * Focal point after dragging the picture by `dy` points (down = positive).
 * Mirrors contentFit="cover": the image scales to cover the frame, and only the
 * part taller than the frame can move. Dragging down reveals more of the top, so
 * the focal point moves toward 0.
 */
export function focalAfterDrag(
  startFocal: number,
  dy: number,
  frameWidth: number,
  frameHeight: number,
  imageWidth: number,
  imageHeight: number
): number {
  if (!(frameWidth > 0 && frameHeight > 0 && imageWidth > 0 && imageHeight > 0)) {
    return clampFocal(startFocal);
  }
  const scale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  const hidden = imageHeight * scale - frameHeight;
  if (hidden < 1) return clampFocal(startFocal);
  return clampFocal(startFocal - (dy / hidden) * 100);
}

/** expo-image contentPosition for a stored focal point. */
export function headerContentPosition(focalY: number): {
  top: `${number}%`;
  left: `${number}%`;
} {
  return { top: `${Math.round(clampFocal(focalY))}%`, left: '50%' };
}

/**
 * Eased black scrim (smoothstep-cubic), so the fade starts invisibly and is
 * nearly solid where the name and handle sit. A plain two-stop gradient shows a
 * visible start line and stays too light behind small text (concept page, R2).
 */
export function easedScrim(
  steps = 14,
  maxAlpha = 1
): { colors: [string, string, ...string[]]; locations: [number, number, ...number[]] } {
  const n = Math.max(2, Math.floor(steps));
  const colors: string[] = [];
  const locations: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    colors.push(`rgba(0,0,0,${(eased * maxAlpha).toFixed(4)})`);
    locations.push(Number(t.toFixed(4)));
  }
  const [c0, c1, ...cRest] = colors;
  const [l0, l1, ...lRest] = locations;
  return { colors: [c0, c1, ...cRest], locations: [l0, l1, ...lRest] };
}

/** Where the picker draws from: your own dreams, every public bot, or one bot. */
export type HeaderSource = { kind: 'me' } | { kind: 'bots' } | { kind: 'bot'; botId: string };

export function sourceKey(source: HeaderSource): string {
  return source.kind === 'bot' ? `bot:${source.botId}` : source.kind;
}

export function sourceLabel(source: HeaderSource, botName?: string | null): string {
  if (source.kind === 'me') return 'Random from your dreams';
  if (source.kind === 'bots') return 'Random from all bots';
  return `Random from ${botName || 'this bot'}`;
}

/** RPC args for get_header_suggestions. */
export function sourceRpcArgs(source: HeaderSource): { p_source: string; p_bot_id?: string } {
  if (source.kind === 'bot') return { p_source: 'bot', p_bot_id: source.botId };
  return { p_source: source.kind };
}

/**
 * Link into the header picker with a picture already tried on — from a dream's
 * long-press "Use as profile header". Own dreams open on "You"; a bot post
 * opens on that bot, with its credit.
 */
export function headerPickerHref(p: {
  uploadId: string;
  imageUrl: string;
  own: boolean;
  ownerId?: string | null;
  ownerUsername?: string | null;
  ownerAvatarUrl?: string | null;
}): string {
  const q: [string, string][] = [
    ['uploadId', p.uploadId],
    ['imageUrl', p.imageUrl],
  ];
  if (p.own) q.push(['own', '1']);
  else {
    if (p.ownerId) q.push(['ownerId', p.ownerId]);
    if (p.ownerUsername) q.push(['ownerUsername', p.ownerUsername]);
    if (p.ownerAvatarUrl) q.push(['ownerAvatarUrl', p.ownerAvatarUrl]);
  }
  return `/headerPicker?${q.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
}
