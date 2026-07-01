import * as Haptics from 'expo-haptics';
import { showAlert } from '@/components/CustomAlert';
import { showPremiumGate } from '@/lib/premiumGate';
import { Toast } from '@/components/Toast';
import { UpscaleModal } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { invokeEdge } from '@/lib/edgeFunction';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import { reportContent } from '@/lib/reportContent';
import { trackHdDownloadTapped } from '@/lib/analytics';

interface UpscaleBody {
  status?: 'done' | 'processing';
  image_url_hq?: string;
  error?: string;
  message?: string;
  cap?: number;
  tier?: 'basic' | 'pro';
  resets_on?: string;
}

type UpscaleResult =
  | { kind: 'done'; imageUrlHq: string }
  | { kind: 'processing' }
  | { kind: 'cap'; cap?: number; resetsOn?: string; tier?: 'basic' | 'pro' }
  | { kind: 'subscription' }
  | { kind: 'face_swap' }
  | { kind: 'error' };

/**
 * Disclaimer shown in place of the HD option for Dream-Cast (face-swap) dreams.
 * Upscaling an already-rendered AI face forces it into the uncanny valley, so HD
 * is disabled for these; the native-res "Save to Photos" still works. (310)
 */
const FACE_SWAP_NO_HD_MESSAGE = "HD isn't available for dreams featuring your cast photos.";

/**
 * Ask the server for the HD version. supabase-js delivers any non-2xx as `error`
 * (with data: null) and puts the original Response on `error.context` — so we read
 * the status + body THERE to distinguish a 429 monthly-cap and a 403 lapsed-sub
 * from a generic transport error (these previously all collapsed into "try again",
 * making the cap message unreachable).
 */
async function requestUpscale(uploadId: string): Promise<UpscaleResult> {
  try {
    const { data, error } = await invokeEdge<UpscaleBody>('upscale-image', {
      body: { upload_id: uploadId },
    });
    if (error) {
      const ctx = (error as { context?: Response }).context;
      const status = ctx?.status;
      let body: UpscaleBody = {};
      if (ctx) {
        try {
          body = (await ctx.json()) as UpscaleBody;
        } catch {
          /* non-JSON error body */
        }
      }
      if (status === 429) {
        return { kind: 'cap', cap: body.cap, resetsOn: body.resets_on, tier: body.tier };
      }
      if (status === 403) return { kind: 'subscription' };
      // Cast-photo dream — HD is never available (server guard, migration 310).
      if (status === 422 && body.error === 'hd_unavailable_face_swap') {
        return { kind: 'face_swap' };
      }
      if (__DEV__) console.warn('[requestUpscale] http', status, error.message);
      return { kind: 'error' };
    }
    if (data?.status === 'done' && data.image_url_hq) {
      return { kind: 'done', imageUrlHq: data.image_url_hq };
    }
    if (data?.status === 'processing') return { kind: 'processing' };
    return { kind: 'error' };
  } catch (err) {
    if (__DEV__) console.warn('[requestUpscale] threw', err);
    return { kind: 'error' };
  }
}

/**
 * Paid HD save. Cached → instant. Else request the upscale: a cache hit saves
 * immediately; otherwise the dismissable modal auto-saves the moment the HD
 * lands (or the user gets a `download_ready` notification). On a monthly cap or
 * a lapsed subscription, the modal tears down and the premium gate guides them.
 */
async function saveHd(id: string, cachedHqUrl: string | null) {
  trackHdDownloadTapped({ cached: !!cachedHqUrl });
  if (cachedHqUrl) {
    await saveUrlToPhotos(id, cachedHqUrl, true);
    return;
  }
  // Open the modal IMMEDIATELY so there's no dead gap while the ~1s round-trip
  // resolves; the poll starts now too, so a fast cache-hit still auto-saves.
  UpscaleModal.show(id);
  const res = await requestUpscale(id);
  if (res.kind === 'done') {
    await saveUrlToPhotos(id, res.imageUrlHq, true);
    UpscaleModal.hide();
    return;
  }
  if (res.kind === 'processing') {
    UpscaleModal.setProcessing(id);
    return;
  }
  UpscaleModal.hide();
  if (res.kind === 'cap') {
    const { isBasic } = useAuthStore.getState();
    const tier = res.tier ?? (isBasic ? 'basic' : 'pro');
    showPremiumGate({
      kind: 'hd_cap',
      cap: res.cap ?? (tier === 'basic' ? 20 : 100),
      resetsOn: res.resetsOn,
      tier,
    });
    return;
  }
  if (res.kind === 'subscription') {
    // Subscription lapsed between the client gate and this request — re-offer.
    showPremiumGate({ kind: 'hd_premium' });
    return;
  }
  if (res.kind === 'face_swap') {
    // Reached only via a stale path (the menu hides HD for cast dreams).
    Toast.show(FACE_SWAP_NO_HD_MESSAGE, 'information-circle');
    return;
  }
  Toast.show('Couldn’t prepare your HD download. Try again.', 'close-circle');
}

interface SaveOpts {
  id: string;
  imageUrl: string;
  /** Cached HD url from the post object — present only when a prior downloader
   *  already upscaled it (then HD is an instant cache hit). */
  imageUrlHq?: string | null;
  /** True when this dream belongs to the current user. Owners can ALWAYS
   *  HD-download their own dreams (nightly or created), free + uncapped —
   *  no subscription required. The server (upscale-image) enforces the same. */
  isOwn?: boolean;
  /** 'single' | 'dual' when this dream was rendered with a Dream-Cast face
   *  swap. HD upscaling is disabled for these (uncanny AI faces); only native
   *  "Save to Photos" is offered. NULL/undefined → plain render, HD allowed.
   *  (migration 310; the server enforces the same.) */
  faceSwapMode?: string | null;
}
interface LongPressOpts extends SaveOpts {
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}
type SheetButton = { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void };

/**
 * The two quality options shared by the Download button and the long-press menu:
 *   - Save to Photos — native-res, free for everyone, any post.
 *   - Save in HD     — Paid (Basic OR Pro): cache hit = instant, else on-demand
 *                       upscale (modal auto-saves when ready). Free: opens the
 *                       premium gate, so the download moment doubles as the upsell.
 *
 * HD is a perk of BOTH paid tiers, so the free-tier label says "(Premium)" — not
 * "(Pro)", which would wrongly imply Basic can't. (An earlier ✨ glyph rendered
 * broken on some iOS fonts and was dropped 2026-06-06.)
 */
/**
 * Show the cast-photo HD disclaimer ONLY to users who would otherwise have a
 * working HD button — i.e. subscribers, or the owner of the post (free + uncapped
 * on their own dreams). A free user looking at someone else's post never had HD
 * here anyway, so the explanation is just noise to them. (migration 310)
 */
function faceSwapNoHdMessage(opts: SaveOpts): string {
  if (!opts.faceSwapMode) return '';
  const { isPro, isBasic } = useAuthStore.getState();
  return isPro || isBasic || opts.isOwn ? FACE_SWAP_NO_HD_MESSAGE : '';
}

function downloadOptionButtons(opts: SaveOpts): SheetButton[] {
  const saveNative: SheetButton = {
    text: 'Save to Photos',
    onPress: () => saveUrlToPhotos(opts.id, opts.imageUrl, false),
  };
  // Dream-Cast (face-swap) dream → HD is never offered; upscaling an already-
  // rendered AI face is uncanny. Just one native save → label it plainly "Save"
  // (no "in HD" sibling to disambiguate against). (migration 310)
  if (opts.faceSwapMode) {
    return [{ text: 'Save', onPress: () => saveUrlToPhotos(opts.id, opts.imageUrl, false) }];
  }
  const { isPro, isBasic } = useAuthStore.getState();
  // HD downloads are a paid perk of BOTH tiers (Pro 100/mo, Basic 20/mo — the
  // server enforces the per-tier cap). Any paid subscriber may HD-save ANY
  // dream; additionally, ANYONE may HD-save their OWN dreams free + uncapped.
  const canHd = isPro || isBasic || !!opts.isOwn;
  const cachedHqUrl = canHd ? (opts.imageUrlHq ?? null) : null;
  return [
    saveNative,
    {
      text: canHd ? 'Save in HD' : 'Save in HD (Premium)',
      onPress: () =>
        canHd ? saveHd(opts.id, cachedHqUrl) : showPremiumGate({ kind: 'hd_premium' }),
    },
  ];
}

/**
 * Visible Download button → the quality sheet. Picking "Save in HD" IS the
 * confirm (the cap-warning dialog is gone); the modal opens instantly.
 */
export function openDownloadSheet(opts: SaveOpts) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  showAlert('Download', faceSwapNoHdMessage(opts), [
    { text: 'Cancel', style: 'cancel' },
    ...downloadOptionButtons(opts),
  ]);
}

/**
 * A single row in the slide-up PostActionSheet (the Instagram-style long-press
 * menu). `group` splits the rows into visual cards: 'primary' (save / create /
 * visibility) vs 'danger' (report / block / delete). `icon` is an Ionicons name.
 */
export type PostActionRow = {
  key: string;
  label: string;
  icon: string;
  group: 'primary' | 'danger';
  destructive?: boolean;
  onPress: () => void;
};

export interface PostActionSheetOpts extends LongPressOpts {
  /** Author display name — for the "Block @name" label. */
  authorName?: string;
  /** Bot authors are curated first-party content: Report is offered, Block is not. */
  isBot?: boolean;
  /** useToggleBlock().mutate wrapper from the caller (hooks can't run in a lib). */
  onBlock?: () => void;
  /** Own-post visibility toggle (album/profile contexts). */
  onToggleVisibility?: () => void;
  /** Current visibility, to label the toggle "Make private" vs "Make public". */
  isPublic?: boolean;
}

const iconForDownload = (label: string): string =>
  label.startsWith('Save in HD') ? 'sparkles-outline' : 'download-outline';

/**
 * Build the ordered rows for the PostActionSheet. Reuses the exact download /
 * HD-gating logic (downloadOptionButtons + saveHd) so the sheet and the legacy
 * alert stay in lockstep. Presentation lives in components/PostActionSheet.tsx.
 */
export function buildPostActionRows(opts: PostActionSheetOpts): PostActionRow[] {
  const rows: PostActionRow[] = [];

  // Save / Save in HD (or single "Save" for face-swap dreams).
  for (const b of downloadOptionButtons(opts)) {
    rows.push({
      key: `save:${b.text}`,
      label: b.text,
      icon: iconForDownload(b.text),
      group: 'primary',
      onPress: () => b.onPress?.(),
    });
  }

  // Dream like this — re-render from this post's style.
  if (opts.onDreamLikeThis) {
    rows.push({
      key: 'dlt',
      label: 'Dream like this',
      icon: 'color-wand-outline',
      group: 'primary',
      onPress: opts.onDreamLikeThis,
    });
  }

  // Own-post visibility toggle.
  if (opts.onToggleVisibility) {
    rows.push({
      key: 'visibility',
      label: opts.isPublic ? 'Make private' : 'Make public',
      icon: opts.isPublic ? 'eye-off-outline' : 'eye-outline',
      group: 'primary',
      onPress: opts.onToggleVisibility,
    });
  }

  // Report — required flag path; only on posts you don't own.
  if (!opts.isOwn) {
    rows.push({
      key: 'report',
      label: 'Report',
      icon: 'flag-outline',
      group: 'danger',
      onPress: () => reportContent({ uploadId: opts.id }),
    });
  }

  // Block — real users only (not our own bots), not your own post. Confirm first.
  if (!opts.isOwn && !opts.isBot && opts.onBlock) {
    const name = opts.authorName || 'user';
    const block = opts.onBlock;
    rows.push({
      key: 'block',
      label: `Block @${name}`,
      icon: 'remove-circle-outline',
      group: 'danger',
      destructive: true,
      onPress: () =>
        showAlert(`Block @${name}?`, "They won't be able to see your posts or contact you.", [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => {
              block();
              Toast.show(`Blocked @${name}`, 'checkmark-circle');
            },
          },
        ]),
    });
  }

  // Delete — own posts (destructive).
  if (opts.onDelete) {
    rows.push({
      key: 'delete',
      label: 'Delete',
      icon: 'trash-outline',
      group: 'danger',
      destructive: true,
      onPress: opts.onDelete,
    });
  }

  return rows;
}

/**
 * Long-press menu = the quality options plus context actions (Dream like this,
 * Delete) for owners/admins. CustomAlert auto-stacks when there are ≠2 buttons
 * and floats Cancel to the bottom.
 */
export function handleImageLongPress(opts: LongPressOpts) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  const buttons: SheetButton[] = [
    { text: 'Cancel', style: 'cancel' },
    ...downloadOptionButtons(opts),
  ];
  if (opts.onDreamLikeThis) {
    buttons.push({ text: 'Dream like this', onPress: opts.onDreamLikeThis });
  }
  if (opts.onDelete) {
    buttons.push({ text: 'Delete', style: 'destructive', onPress: opts.onDelete });
  }
  // Report — App Store 1.2 requires a way to flag objectionable content. Shown on
  // posts the user does NOT own (you don't report your own dream).
  if (!opts.isOwn) {
    buttons.push({
      text: 'Report',
      style: 'destructive',
      onPress: () => reportContent({ uploadId: opts.id }),
    });
  }
  const hasContextActions = !!opts.onDelete || !opts.isOwn || !!opts.onDreamLikeThis;
  showAlert(hasContextActions ? 'Options' : 'Download', faceSwapNoHdMessage(opts), buttons);
}

/**
 * Save the ready HD copy DIRECTLY to the device — driven by the top-right
 * "Download" badge that appears when the user reaches a post via a
 * `download_ready` notification (push / inbox / foreground banner).
 *
 * By the time that notification fires the upscale is finished and `image_url_hq`
 * is populated, so we read it straight off the row and save it — no UpscaleModal,
 * no re-request, no re-charge (this is just a file download). A simple "Saving to
 * your device…" toast covers the brief download; `saveUrlToPhotos` then shows the
 * final "Saved in HD". Returns true on success so the caller can hide the badge.
 *
 * Rare race fallback: if the HD isn't on the row yet (notification beat the
 * persist, or a stale cache), fall back to the full `saveHd` request path so the
 * download still completes rather than silently failing.
 */
export async function saveReadyHdDownloadDirect(uploadId: string): Promise<boolean> {
  trackHdDownloadTapped({ cached: true });
  Toast.show('Saving to your device…', 'cloud-download');
  try {
    const { data } = await supabase
      .from('uploads')
      .select('image_url_hq')
      .eq('id', uploadId)
      .maybeSingle();
    const hq = (data as { image_url_hq?: string | null } | null)?.image_url_hq ?? null;
    if (hq) {
      return await saveUrlToPhotos(uploadId, hq, true);
    }
  } catch (err) {
    if (__DEV__) console.warn('[saveReadyHdDownloadDirect] hq lookup failed', err);
  }
  // HD not ready on the row — fall back to the request+modal path so it still saves.
  await saveHd(uploadId, null);
  return true;
}
