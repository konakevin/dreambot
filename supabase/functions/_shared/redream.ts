/**
 * redream.ts — "MORE LIKE THIS" (Kevin 2026-09-18): re-run a NIGHTLY dream on demand with the SAME look, vibe and
 * cast role and a FRESH scene, charged like a Create dream.
 *
 * Transport shape (enqueue-dream → dream_queue.payload.redream → nightly dispatcher → nightly-dreams body.redream):
 *   { source_upload_id, look_key, vibe_key, cast_role }
 *
 * The pins ride the render's existing pin inputs — `qa_pin_look` (the contract's look, engine untouched),
 * `force_vibe`, `force_cast_role` — but are merged AFTER `isQaRequest(body)` is computed from the raw body, so a
 * redream is a real user render (is_qa = false), never QA spend. Pure module: no I/O, locked by
 * __tests__/lib/redream.test.ts.
 */

export type RedreamCastRole = 'dual' | 'self' | 'plus_one' | null;

/**
 * THE SEQUEL'S WORLD (Kevin 2026-09-18: "force the redream to use the same seed pool that the dream they are on did
 * … that way it really is a sequel"). Derived by enqueue-dream from the source upload's `seed_source`:
 *   location → the same location card (`force_place`; the engine rolls a NEW iconic spot inside it)
 *   goofy / elegant / active → the same scene kind AND the same scenario category (`force_playful` /
 *     `force_elegant` / `force_active` + `force_scene_category`; the place rolls fresh)
 *   holiday → the same holiday (`force_holiday_scene`) and, when known, the same sub-theme
 */
export type RedreamWorldKind = 'location' | 'goofy' | 'elegant' | 'active' | 'holiday';

export interface RedreamWorld {
  kind: RedreamWorldKind;
  placeKey: string | null;
  category: string | null;
  holidayKey: string | null;
  subTheme: string | null;
}

export interface RedreamPins {
  sourceUploadId: string;
  lookKey: string;
  vibeKey: string | null;
  /** null = explicit no-cast (pure scene, like the source); undefined = unknown → the engine's normal roll. */
  castRole: RedreamCastRole | undefined;
  /** null = unknown world → the engine's normal scene roll (same look / vibe / cast only). */
  world: RedreamWorld | null;
}

const WORLD_KINDS: ReadonlySet<string> = new Set([
  'location',
  'goofy',
  'elegant',
  'active',
  'holiday',
]);

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/** `uploads.seed_source` (kind, biome, scene, location, + category / subTheme / placeKey since 2026-09-18) → the
 *  world to pin. Pure; enqueue-dream fills the reverse-lookups for older uploads before calling this. */
export function worldFromSeedSource(seed: unknown): RedreamWorld | null {
  if (!seed || typeof seed !== 'object') return null;
  const s = seed as Record<string, unknown>;
  const kindRaw = str(s.kind);
  if (!kindRaw) return null;
  if (kindRaw.startsWith('holiday:')) {
    const holidayKey = kindRaw.slice('holiday:'.length);
    if (!holidayKey) return null;
    return {
      kind: 'holiday',
      placeKey: null,
      category: null,
      holidayKey,
      subTheme: str(s.subTheme),
    };
  }
  const kind: RedreamWorldKind | null =
    kindRaw === 'scenario'
      ? 'active'
      : WORLD_KINDS.has(kindRaw)
        ? (kindRaw as RedreamWorldKind)
        : null;
  if (!kind || kind === 'holiday') return null;
  if (kind === 'location') {
    const placeKey = str(s.placeKey);
    return placeKey ? { kind, placeKey, category: null, holidayKey: null, subTheme: null } : null;
  }
  return { kind, placeKey: null, category: str(s.category), holidayKey: null, subTheme: null };
}

function parseWorld(raw: unknown): RedreamWorld | null {
  if (!raw || typeof raw !== 'object') return null;
  const w = raw as Record<string, unknown>;
  const kind = str(w.kind);
  if (!kind || !WORLD_KINDS.has(kind)) return null;
  return {
    kind: kind as RedreamWorldKind,
    placeKey: str(w.place_key),
    category: str(w.category),
    holidayKey: str(w.holiday_key),
    subTheme: str(w.sub_theme),
  };
}

/** The transport shape of a world (snake_case, like the rest of the redream payload). */
export function worldToTransport(world: RedreamWorld | null): Record<string, unknown> | null {
  if (!world) return null;
  return {
    kind: world.kind,
    place_key: world.placeKey,
    category: world.category,
    holiday_key: world.holidayKey,
    sub_theme: world.subTheme,
  };
}

/** `ai_generation_log.rolled_axes.dreamType` of the source dream → the cast role to pin. */
export function castRoleForDreamType(dreamType: unknown): RedreamCastRole | undefined {
  switch (dreamType) {
    case 'face_swap_dual':
    case 'dream_art_dual':
      return 'dual';
    case 'face_swap_self':
    case 'dream_art_self':
      return 'self';
    case 'face_swap_plus_one':
    case 'dream_art_plus_one':
      return 'plus_one';
    case 'pure_scene':
    case 'epic_tiny':
    case 'embodied':
      return null;
    default:
      return undefined;
  }
}

const CAST_ROLES: ReadonlySet<string> = new Set(['dual', 'self', 'plus_one']);

/** `uploads.seed_source.castRole` (recorded since 2026-09-18; the upload keeps it forever) → cast role. */
export function castRoleFromSeedSource(seed: unknown): RedreamCastRole | undefined {
  if (!seed || typeof seed !== 'object') return undefined;
  const v = (seed as Record<string, unknown>).castRole;
  if (v === null) return null;
  return typeof v === 'string' && CAST_ROLES.has(v) ? (v as RedreamCastRole) : undefined;
}

/** The whole `rolled_axes` → cast role. `dreamType` is null on ~30% of rows (forced / QA renders), but
 *  `isDualFaceSwap` + `castRoles` are always stamped, so read those before giving up. */
export function castRoleFromAxes(axes: unknown): RedreamCastRole | undefined {
  if (!axes || typeof axes !== 'object') return undefined;
  const a = axes as Record<string, unknown>;
  const byType = castRoleForDreamType(a.dreamType);
  if (byType !== undefined) return byType;
  if (a.isDualFaceSwap === true) return 'dual';
  const roles = Array.isArray(a.castRoles)
    ? a.castRoles.filter((r): r is string => typeof r === 'string')
    : null;
  if (roles && roles.length > 0) {
    const hasSelf = roles.includes('self');
    const hasPlus = roles.includes('plus_one');
    if (hasSelf && hasPlus) return 'dual';
    if (hasPlus) return 'plus_one';
    if (hasSelf) return 'self';
  }
  if (a.composition === 'pure_scene') return null;
  return undefined;
}

/** Validate `body.redream`; anything malformed is ignored (null) rather than half-applied. */
export function parseRedreamPins(body: unknown): RedreamPins | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as Record<string, unknown>).redream;
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.source_upload_id !== 'string' || r.source_upload_id.length === 0) return null;
  if (typeof r.look_key !== 'string' || r.look_key.length === 0) return null;
  const vibeKey = typeof r.vibe_key === 'string' && r.vibe_key.length > 0 ? r.vibe_key : null;
  let castRole: RedreamCastRole | undefined;
  if (r.cast_role === null) castRole = null;
  else if (typeof r.cast_role === 'string' && CAST_ROLES.has(r.cast_role)) {
    castRole = r.cast_role as RedreamCastRole;
  } else castRole = undefined;
  return {
    sourceUploadId: r.source_upload_id,
    lookKey: r.look_key,
    vibeKey,
    castRole,
    world: parseWorld(r.world),
  };
}

/** The body the QA-flag parser should see: the raw body plus the pins expressed as the render's pin inputs. */
export function applyRedreamPins<T extends Record<string, unknown>>(body: T): T {
  const pins = parseRedreamPins(body);
  if (!pins) return body;
  return {
    ...body,
    qa_pin_look: pins.lookKey,
    ...(pins.vibeKey ? { force_vibe: pins.vibeKey } : {}),
    ...(pins.castRole !== undefined ? { force_cast_role: pins.castRole } : {}),
    ...worldPins(pins.world),
  };
}

/** The world → the render's existing scene pins (see RedreamWorld). `force_place` is a production flag; the kind
 *  and category pins are QA flags, harmless here because isQaRequest already ran on the raw body. */
export function worldPins(world: RedreamWorld | null): Record<string, unknown> {
  if (!world) return {};
  switch (world.kind) {
    case 'location':
      return world.placeKey ? { force_place: world.placeKey } : {};
    // The couple roll and the solo roll read DIFFERENT kind pins (force_* vs force_single_*); a sequel may
    // land on either surface, so both are set.
    case 'goofy':
      return {
        force_playful: true,
        force_single_playful: true,
        ...(world.category ? { force_scene_category: world.category } : {}),
      };
    case 'elegant':
      return {
        force_elegant: true,
        force_single_elegant: true,
        ...(world.category ? { force_scene_category: world.category } : {}),
      };
    case 'active':
      return {
        force_active: true,
        force_single_active: true,
        ...(world.category ? { force_scene_category: world.category } : {}),
      };
    case 'holiday':
      return world.holidayKey
        ? {
            force_holiday_scene: world.holidayKey,
            ...(world.subTheme ? { force_holiday_sub_theme: world.subTheme } : {}),
          }
        : {};
  }
}
