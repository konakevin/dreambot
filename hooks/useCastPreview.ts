/**
 * The user's Dream Cast, as the Create screen needs it.
 *
 * Create resolves a prompt to specific cast members ("me and Steph" → Steph, "me and
 * my partner" → the starred default) and the engine does the SAME resolution
 * server-side. This hook is what lets the client show the answer: the faces that are
 * actually going into the dream, live, while the prompt is still being typed.
 *
 * That preview is the real safety net under name matching. Matching is regex over the
 * roster's names, so it can resolve to the wrong person (two people called Steph, a
 * name that doubles as scenery) and every guard against that is a heuristic. A face on
 * screen BEFORE the sparkles are spent turns a silent wrong-person render into
 * something the user corrects in a second.
 *
 * Names here are display-only: they are compared against the prompt and never sent
 * into one (`partnerToPlusOne` omits the field from the render payload, and the engine
 * scrubs a matched name out of the prompt).
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { castSignedUrl } from '@/lib/castPhoto';
import { useAuthStore } from '@/store/auth';
import { isVibeProfile } from '@/types/vibeProfile';
import { enabledPartners, primaryPartnerOf } from '@/lib/dreamCastRoster';
import type { CastName } from '@/lib/selfInsertDetect';

/** Enough to render a face and label it. */
export interface CastFaceRef {
  id: string;
  name?: string;
  /** 'partner' | 'friend' for a roster member; absent for the user's own photo. */
  relationship?: 'partner' | 'friend';
  storage_path?: string;
  thumb_url?: string;
}

export interface CastPreview {
  /** Feeds the prompt detector. Only members the user actually named. */
  names: CastName[];
  /** The user's own cast photo, or null if they have not added one. */
  self: CastFaceRef | null;
  /** EVERY roster member, switched on or not, in roster order. Backstage members are
   *  included because an explicit name casts them too — the switch governs the
   *  automatic paths (nightly rotation, the default), not a direct request. */
  partners: CastFaceRef[];
  /** Who "my partner" resolves to: the starred member, or the first switched-on one.
   *  Read through the shared rule so the preview cannot disagree with the render. */
  defaultPartnerId: string | null;
}

const EMPTY: CastPreview = { names: [], self: null, partners: [], defaultPartnerId: null };

export function useCastPreview(): CastPreview {
  const user = useAuthStore((s) => s.user);

  const { data } = useQuery({
    queryKey: ['castPreview', user?.id],
    enabled: !!user,
    // The roster changes rarely and only from Settings, so a window keeps this off the
    // critical path of opening Create. Kept SHORT and paired with an explicit
    // invalidation from the Settings roster (DreamCastRoster's persist): a five-minute
    // window with no invalidation meant starring a new default left the Create chip
    // naming the old one until it expired.
    staleTime: 30 * 1000,
    // Coming back to the Create tab after editing the roster is the exact moment this
    // must be right, and it is the cheapest place to catch anything the invalidation
    // missed (a save from another device, a hot reload).
    refetchOnMount: 'always',
    queryFn: async (): Promise<CastPreview> => {
      const { data: row } = await supabase
        .from('user_recipes')
        .select('recipe')
        .eq('user_id', user!.id)
        .single();
      const raw = row?.recipe as unknown;
      if (!isVibeProfile(raw)) return EMPTY;

      // Roster ORDER is load-bearing: matching is first-wins, so two members sharing a
      // name must resolve to the one added first, on the client exactly as on the
      // engine. Filter, never sort.
      const partners: CastFaceRef[] = (raw.partner_library ?? [])
        .filter((p) => p && typeof p.id === 'string' && !!p.id)
        .map((p) => ({
          id: p.id,
          ...(p.name?.trim() ? { name: p.name.trim() } : {}),
          relationship: (p.relationship === 'partner' ? 'partner' : 'friend') as
            | 'partner'
            | 'friend',
          ...(p.storage_path ? { storage_path: p.storage_path } : {}),
          ...(p.thumb_url ? { thumb_url: p.thumb_url } : {}),
        }));

      const selfMember = raw.dream_cast.find((m) => m.role === 'self');
      const self: CastFaceRef | null = selfMember
        ? {
            id: 'self',
            ...(selfMember.storage_path ? { storage_path: selfMember.storage_path } : {}),
            ...(selfMember.thumb_url ? { thumb_url: selfMember.thumb_url } : {}),
          }
        : null;

      return {
        names: partners.filter((p) => !!p.name).map((p) => ({ id: p.id, name: p.name as string })),
        self,
        partners,
        defaultPartnerId: primaryPartnerOf(enabledPartners(raw), raw.active_partner_id)?.id ?? null,
      };
    },
  });

  // WARM THE FACES BEFORE THEY ARE ASKED FOR. A cast avatar mounts the instant a typed
  // name resolves to someone, and cold it costs two round trips in series — mint a
  // signed URL, then download the image at a URL the image cache has never seen. Doing
  // that work here, once, as soon as the roster is known, means the face is already in
  // both caches by the time the user finishes typing it. castSignedUrl dedupes and
  // caches by path, so this races nothing and repeats nothing.
  //
  // Fire-and-forget on purpose: a failed warm-up must never surface: the avatar resolves
  // for itself on mount exactly as before, just slower.
  const partners = data?.partners;
  const self = data?.self;
  useEffect(() => {
    let alive = true;
    const paths = [...(partners ?? []), ...(self ? [self] : [])]
      .map((m) => m.storage_path)
      .filter((p): p is string => !!p);
    if (paths.length === 0) return;
    (async () => {
      const urls = (await Promise.all(paths.map((p) => castSignedUrl(p)))).filter(
        (u): u is string => !!u
      );
      if (alive && urls.length > 0) Image.prefetch(urls).catch(() => {});
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, [partners, self]);

  return data ?? EMPTY;
}
