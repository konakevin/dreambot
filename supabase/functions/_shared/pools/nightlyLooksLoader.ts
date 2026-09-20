/**
 * nightlyLooksLoader.ts — loads the nightly LOOKS catalog for the style contract: `dream_mediums` rows with
 * nightly_look = true (migs 494-500) + `nightly_look_approvals` (mig 498) + `nightly_look_model_pins` (mig 536).
 * Cached per isolate with a 60 s TTL like the model policy loader; fails OPEN to an empty catalog (the render then
 * stays on the legacy chain and stamps it). A failed PIN read degrades to "no pins", i.e. today's roll, rather than
 * failing the catalog — routing is a preference, and losing it must never cost a dream.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import type { LookApproval, LookModelPin, LookRow, LookSurface } from '../nightlyLooks.ts';

export interface NightlyLooksCatalog {
  looks: LookRow[];
  approvals: LookApproval[];
  modelPins: LookModelPin[];
}

const TTL_MS = 60_000;

function bannedVibesOf(meta: unknown): string[] {
  if (!meta || typeof meta !== 'object') return [];
  const v = (meta as { banned_vibes?: unknown }).banned_vibes;
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}
let cached: { at: number; catalog: NightlyLooksCatalog } | null = null;

export async function loadNightlyLooks(
  supabase: SupabaseClient,
  bypassCache = false
): Promise<NightlyLooksCatalog> {
  const now = Date.now();
  if (!bypassCache && cached && now - cached.at < TTL_MS) return cached.catalog;
  const empty: NightlyLooksCatalog = { looks: [], approvals: [], modelPins: [] };
  const [rows, appr, pins] = await Promise.all([
    supabase
      .from('dream_mediums')
      .select(
        'key,label,nightly_family,flux_fragment,face_swap_flux_fragment,directive,weight,is_active,nightly_enabled,client_meta'
      )
      .eq('nightly_look', true)
      .returns<Record<string, unknown>[]>(),
    supabase
      .from('nightly_look_approvals')
      .select('look_key,model,surface,approved')
      .returns<Record<string, unknown>[]>(),
    supabase
      .from('nightly_look_model_pins')
      .select('look_key,surface,model,active')
      .eq('active', true)
      .returns<Record<string, unknown>[]>(),
  ]);
  if (rows.error || appr.error) {
    console.warn(
      `[nightlyLooks] load failed (${rows.error ? rows.error.message : ''} ${appr.error ? appr.error.message : ''}) → empty catalog`
    );
    return empty;
  }
  const looks: LookRow[] = (rows.data ?? []).map((r) => ({
    key: String(r.key),
    label: String(r.label ?? r.key),
    family: String(r.nightly_family ?? 'unfiled'),
    fragment: String(r.flux_fragment ?? ''),
    swapFragment: typeof r.face_swap_flux_fragment === 'string' ? r.face_swap_flux_fragment : null,
    directive: typeof r.directive === 'string' ? r.directive : null,
    weight: Number(r.weight ?? 1) || 1,
    active: r.is_active === true,
    nightlyEnabled: r.nightly_enabled !== false,
    bannedVibes: bannedVibesOf(r.client_meta),
  }));
  const approvals: LookApproval[] = (appr.data ?? [])
    .filter((a) => a.surface === 'couple' || a.surface === 'solo')
    .map((a) => ({
      lookKey: String(a.look_key),
      model: String(a.model),
      surface: a.surface as LookSurface,
      approved: a.approved === true,
    }));
  // A pin read that failed is NOT fatal: no pins means the normal roll, which is what ran before mig 536.
  if (pins.error) {
    console.warn(`[nightlyLooks] pin load failed (${pins.error.message}) → no pins, normal roll`);
  }
  const modelPins: LookModelPin[] = (pins.error ? [] : (pins.data ?? []))
    .filter((p) => p.surface === 'couple' || p.surface === 'solo')
    .map((p) => ({
      lookKey: String(p.look_key),
      surface: p.surface as LookSurface,
      model: String(p.model),
      active: p.active !== false,
    }));
  const catalog = { looks, approvals, modelPins };
  cached = { at: now, catalog };
  return catalog;
}
