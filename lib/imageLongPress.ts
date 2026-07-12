import * as Haptics from 'expo-haptics';
import { showAlert } from '@/components/CustomAlert';
import { showPremiumGate } from '@/lib/premiumGate';
import { Toast } from '@/components/Toast';
import { UpscaleModal } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { invokeEdge } from '@/lib/edgeFunction';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos, saveAlbumToPhotos } from '@/lib/savePhoto';
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
   *  (migration 310; the server enforces the same.) For an album slide this is
   *  the ACTIVE slide's face_swap_mode, so the cast rule applies per slide. */
  faceSwapMode?: string | null;
  /** Upload id the on-demand HD upscale should target, when it differs from
   *  `id`. For an album slide `id` is the album HOST, but HD must upscale the
   *  member's SOURCE dream — the caller passes that source id here. Undefined ⇒
   *  upscale `id` (the normal single-post case). */
  hdUploadId?: string;
}
interface LongPressOpts extends SaveOpts {
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
  /** Profile pin state + toggle (migration 330) — provided only for the
   * owner's own posts on the profile grid. */
  isPinned?: boolean;
  onTogglePin?: () => void;
  /** Enter multi-select mode on the hosting grid (bulk delete, 2026-07-10) —
   * provided only by the owner's Dreams grid tiles. Rendered as the sheet's
   * FIRST row (iOS-Photos "Select" pattern; long-press itself keeps opening
   * this sheet, so selection can't hijack the existing gesture). */
  onSelect?: () => void;
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
        canHd
          ? saveHd(opts.hdUploadId ?? opts.id, cachedHqUrl)
          : showPremiumGate({ kind: 'hd_premium' }),
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
  /** Informational, non-interactive row (muted, no press) — e.g. the HD-not-
   *  available placeholder on cast-photo dreams. */
  disabled?: boolean;
  /** Second line under the label (muted), for the disabled placeholder note. */
  subtitle?: string;
  onPress: () => void;
};

export interface PostActionSheetOpts extends LongPressOpts {
  /** Author display name — for the "Block @name" label. */
  authorName?: string;
  /** Bot authors are curated first-party content: Report is offered, Block is not. */
  isBot?: boolean;
  /** useToggleBlock().mutate wrapper from the caller (hooks can't run in a lib). */
  onBlock?: () => void;
  /** Own-post visibility toggle (album/profile contexts). The caller wires the
   *  right action per state: make-private flip, make-public flip, or route to
   *  the New Post compose flow (never-posted). */
  onToggleVisibility?: () => void;
  /** Current visibility, to label the toggle "Make private" vs "Make public". */
  isPublic?: boolean;
  /** Whether this dream was EVER posted (posted_at != null). Splits the private
   *  action: previously-posted → "Make public" (quick re-publish); never-posted
   *  → "Post" (full compose flow). Ignored when isPublic (always "Make private").*/
  wasPosted?: boolean;
  /** Owner-only "Dream this again" — reloads this dream's saved inputs into
   *  Create (from useDreamAgain). Present ⇒ the row shows. */
  onDreamAgain?: () => void;
  /** This post is a multi-image ALBUM (media_count > 1). An album is a
   *  reference GROUPING — single-image actions (Save in HD, Dream this again,
   *  Dream like this) are hidden, and it gets TWO distinct exits: "Dissolve
   *  Album" (keeps the images → Private) and destructive "Delete Album". */
  isGallery?: boolean;
  /** Image count, for the album confirm copy ("… all 10 dreams inside …"). */
  mediaCount?: number;
  /** Album-only: DISSOLVE (ungroup, keep the child dreams). Present ⇒ the row
   *  shows. onDelete is the DESTRUCTIVE path (deletes the children too). */
  onDissolve?: () => void;
  /** Album member image URLs (native res). Present ⇒ a "Save album to Photos"
   *  row that downloads ALL of them at once. Passed by BOTH the grid thumb and
   *  the dream card (Kevin 2026-07-11). */
  albumImageUrls?: string[];
  /** This is a GRID album THUMBNAIL — there's no single slide "in view", so the
   *  per-image save/HD rows are suppressed and only the whole-album save shows.
   *  The dream card (which has an active carousel slide) omits this, so it gets
   *  both the slide-in-view save AND the whole-album save. */
  albumThumb?: boolean;
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

  // Select — enter the grid's multi-select mode (bulk delete). First row so
  // the mode switch is discoverable without scanning the whole sheet.
  if (opts.onSelect) {
    rows.push({
      key: 'select',
      label: 'Select',
      icon: 'checkmark-circle-outline',
      group: 'primary',
      onPress: opts.onSelect,
    });
  }

  // Own-post visibility toggle. Public → "Make private". Private splits on
  // whether it was ever posted: previously-posted → "Make public" (re-publish),
  // never-posted → "Post" (compose flow). The caller wires onPress to match.
  // Placed HERE — right after Select, before the variable save/create block — so
  // it sits at the SAME row on every sheet (Kevin 2026-07-11: it drifted from
  // row 3 on albums to row 5 on singles because Save-in-HD / Dream-this-again
  // shifted it down). Anchoring it above that block keeps it fixed.
  if (opts.onToggleVisibility) {
    const toggle = opts.onToggleVisibility;
    const privateLabel = opts.wasPosted ? 'Make public' : 'Post';
    rows.push({
      key: 'visibility',
      label: opts.isPublic ? 'Make private' : privateLabel,
      icon: opts.isPublic
        ? 'eye-off-outline'
        : opts.wasPosted
          ? 'earth-outline'
          : 'add-circle-outline',
      group: 'primary',
      // Make-private comes off the public feed → confirm first (going public /
      // posting doesn't need one; it's not a takedown).
      onPress: opts.isPublic
        ? () =>
            showAlert(
              'Make this dream private?',
              "It'll come off the public feed. You can post it again anytime.",
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Make Private', onPress: toggle },
              ]
            )
        : toggle,
    });
  }

  // Image-in-view save ("Save to Photos" [+ "Save in HD"]). Shown for single
  // dreams and for the dream card's ACTIVE album slide; suppressed on the grid
  // album THUMB (no single slide there — only the whole-album row applies).
  if (!opts.albumThumb) {
    // Album slide HD is offered only when we can do it RIGHT: the owner's own
    // dream (free + uncapped; the private source is upscalable) AND we know the
    // source id to target. Otherwise (a paid viewer on someone else's album, or
    // the feed's source-less jsonb) native save only. Cast slides are handled
    // per slide by downloadOptionButtons via opts.faceSwapMode.
    const albumSlideNoHd = opts.isGallery && (!opts.isOwn || !opts.hdUploadId);
    for (const b of downloadOptionButtons(opts)) {
      if (albumSlideNoHd && b.text.startsWith('Save in HD')) continue;
      rows.push({
        key: `save:${b.text}`,
        label: b.text,
        icon: iconForDownload(b.text),
        group: 'primary',
        onPress: () => b.onPress?.(),
      });
    }
  }

  // Whole-album download — every member image at once. Any album surface that
  // passes the member URLs (grid thumb + dream card).
  if (opts.albumImageUrls && opts.albumImageUrls.length > 0) {
    const urls = opts.albumImageUrls;
    rows.push({
      key: 'save-album',
      label: 'Save album to Photos',
      icon: 'download-outline',
      group: 'primary',
      onPress: () => saveAlbumToPhotos(opts.id, urls),
    });
  }

  // Cast-photo (face-swap) dream: HD is intentionally omitted (upscaling a
  // swapped face reads uncanny). Rather than silently drop the HD row — which
  // looks like a bug — show a muted, non-interactive placeholder IN the HD slot
  // that explains why. Gated the same as the alert disclaimer (faceSwapNoHdMessage):
  // only for users who'd otherwise have HD here (subscribers / own posts), so it
  // isn't noise to a free user on someone else's post.
  if (!opts.isGallery && faceSwapNoHdMessage(opts)) {
    rows.push({
      key: 'hd-unavailable',
      label: 'Save in HD',
      subtitle: 'Not available for dreams with your cast photos',
      icon: 'sparkles-outline',
      group: 'primary',
      disabled: true,
      onPress: () => {},
    });
  }

  // Dream like this — re-render from this post's style. An album has no single
  // style (it's a mix of N dreams), so it's hidden for galleries.
  if (opts.onDreamLikeThis && !opts.isGallery) {
    rows.push({
      key: 'dlt',
      label: 'Dream like this',
      icon: 'color-wand-outline',
      group: 'primary',
      onPress: opts.onDreamLikeThis,
    });
  }

  // Dream this again — owner-only reload of this dream's saved inputs into
  // Create (original prompt + medium + vibe + model), editable. The caller only
  // passes onDreamAgain for the owner, so no extra isOwn gate needed here.
  // (Hidden for albums — no single recipe to reload.)
  if (opts.onDreamAgain && !opts.isGallery) {
    rows.push({
      key: 'dream-again',
      label: 'Dream this again',
      icon: 'refresh-outline',
      group: 'primary',
      onPress: opts.onDreamAgain,
    });
  }

  // Profile pin toggle — own public posts only (IG model, migration 330).
  if (opts.onTogglePin) {
    rows.push({
      key: 'pin',
      label: opts.isPinned ? 'Unpin from profile' : 'Pin to profile',
      icon: 'pin-outline',
      group: 'primary',
      onPress: opts.onTogglePin,
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

  const n = opts.mediaCount ?? 0;

  // Album DISSOLVE — calm PRIMARY row (an album is a grouping, not content):
  // ungroups it, the child dreams stay safe in Private. Reassuring confirm.
  if (opts.isGallery && opts.onDissolve) {
    const onDissolve = opts.onDissolve;
    rows.push({
      key: 'dissolve',
      label: 'Dissolve Album',
      subtitle: 'Ungroups it, your dreams go back to Private',
      icon: 'albums-outline',
      group: 'primary',
      onPress: () =>
        showAlert(
          'Dissolve this album?',
          `The album leaves your feed (likes and comments included), and ${
            n > 0 ? `all ${n} dreams` : 'the dreams'
          } drift back to your private dreams, safe and sound.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Dissolve', onPress: onDissolve },
          ]
        ),
    });
  }

  // Delete — destructive, ALWAYS behind a confirm (delete is irreversible).
  // Single dream: "Delete this dream?". Album: "Delete Album" deletes the album
  // AND its child images ("the album owns its images — as the album goes, so go
  // its children", Kevin 2026-07-11), with a confirm that spells that out.
  if (opts.onDelete) {
    const onDelete = opts.onDelete;
    rows.push({
      key: 'delete',
      label: opts.isGallery ? 'Delete Album' : 'Delete',
      subtitle: opts.isGallery ? 'Also deletes the images inside' : undefined,
      icon: 'trash-outline',
      group: 'danger',
      destructive: true,
      onPress: opts.isGallery
        ? () =>
            showAlert(
              'Delete this album?',
              `The album and ${
                n > 0 ? `all ${n} images` : 'all the images'
              } inside will be permanently deleted. This can't be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ]
            )
        : () =>
            showAlert('Delete this dream?', "It'll be gone for good. This can't be undone.", [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: onDelete },
            ]),
    });
  }

  return rows;
}

// handleImageLongPress (the CustomAlert stacked-button menu) was retired
// 2026-07-05 — the grid tiles now open the same PostActionSheet as the
// fullscreen card (buildPostActionRows above), so every post surface shares
// one menu UX. (Kevin: "migrate the popup dialog in album/grid view to use
// the popup sheet".)

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
