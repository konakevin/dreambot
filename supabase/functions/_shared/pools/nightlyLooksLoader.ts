/**
 * nightlyLooksLoader.ts — loads the nightly LOOKS catalog for the style contract: `dream_mediums` rows with
 * nightly_look = true (migs 494-500) + `nightly_look_approvals` (mig 498). Cached per isolate with a 60 s TTL like
 * the model policy loader; fails OPEN to an empty catalog (the render then stays on the legacy chain and stamps it).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import type { LookApproval, LookRow, LookSurface } from '../nightlyLooks.ts';

export interface NightlyLooksCatalog {
  looks: LookRow[];
  approvals: LookApproval[];
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
  const empty: NightlyLooksCatalog = { looks: [], approvals: [] };
  const [rows, appr] = await Promise.all([
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
  const catalog = { looks, approvals };
  cached = { at: now, catalog };
  return catalog;
}
