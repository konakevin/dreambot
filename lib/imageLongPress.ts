import * as Haptics from 'expo-haptics';
import { showAlert } from '@/components/CustomAlert';
import { showPremiumGate } from '@/lib/premiumGate';
import { Toast } from '@/components/Toast';
import { UpscaleModal } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
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
  | { kind: 'error' };

/**
 * Ask the server for the HD version. supabase-js delivers any non-2xx as `error`
 * (with data: null) and puts the original Response on `error.context` — so we read
 * the status + body THERE to distinguish a 429 monthly-cap and a 403 lapsed-sub
 * from a generic transport error (these previously all collapsed into "try again",
 * making the cap message unreachable).
 */
async function requestUpscale(uploadId: string): Promise<UpscaleResult> {
  try {
    const { data, error } = await supabase.functions.invoke<UpscaleBody>('upscale-image', {
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
  Toast.show('Couldn’t prepare your HD download. Try again.', 'close-circle');
}

interface SaveOpts {
  id: string;
  imageUrl: string;
  /** Cached HD url from the post object — present only when a prior downloader
   *  already upscaled it (then HD is an instant cache hit). */
  imageUrlHq?: string | null;
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
function downloadOptionButtons(opts: SaveOpts): SheetButton[] {
  const { isPro, isBasic } = useAuthStore.getState();
  // HD downloads are a paid perk of BOTH tiers (Pro 100/mo, Basic 20/mo — the
  // server enforces the per-tier cap). Any paid subscriber may HD-save.
  const canHd = isPro || isBasic;
  const cachedHqUrl = canHd ? (opts.imageUrlHq ?? null) : null;
  return [
    { text: 'Save to Photos', onPress: () => saveUrlToPhotos(opts.id, opts.imageUrl, false) },
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
  showAlert('Download', '', [{ text: 'Cancel', style: 'cancel' }, ...downloadOptionButtons(opts)]);
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
  showAlert(opts.onDelete ? 'Options' : 'Download', '', buttons);
}

/**
 * Auto-save the HD copy after a `download_ready` notification tap. By now the
 * upscale is cached, so saveHd's first server round-trip returns {done} and
 * saves instantly (the modal flashes 'requesting' → 'Saved in HD'). Idempotent
 * and cap-free — upscale-image's cache-hit branch returns before charging.
 */
export function saveReadyHdDownload(uploadId: string) {
  return saveHd(uploadId, null);
}
