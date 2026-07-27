/**
 * dreamOffParse — the PURE wire-parsers for Dream Off RPC payloads. Split out of
 * dreamOffApi (which does the supabase I/O) so the jsonb→domain-type mapping is
 * unit-testable with no network/supabase dependency. Every RPC returns jsonb
 * (surfaced as `Json`), so these coerce defensively (missing keys / wrong types /
 * nulls all degrade to safe defaults) — a future migration that renames a field
 * gets caught by dreamOffParse.test.ts rather than crashing a screen.
 */

import type {
  ActivityItem,
  Ballot,
  CastMode,
  DreamOffPack,
  DreamOffPhase,
  GalleryEntry,
  GamePlayer,
  GameResults,
  GameRoom,
  InvitePreview,
  MyGame,
  PlayerStatus,
  PodiumEntry,
  SuperlativeKey,
} from '@/types/dreamOff';

// ── coercers ──────────────────────────────────────────────────────────────────
export const asObj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
export const asObjArr = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v)
    ? v.filter((x) => x && typeof x === 'object').map((x) => x as Record<string, unknown>)
    : [];
export const str = (v: unknown): string => (typeof v === 'string' ? v : '');
export const strOrNull = (v: unknown): string | null => (typeof v === 'string' ? v : null);
export const numOr = (v: unknown, d = 0): number => (typeof v === 'number' ? v : d);
export const isTrue = (v: unknown): boolean => v === true;

// ── parsers ─────────────────────────────────────────────────────────────────--
export function parseRoom(o: Record<string, unknown>): GameRoom {
  return {
    status: str(o.status) === 'not_member' ? 'not_member' : 'ok',
    id: str(o.id),
    topic: str(o.topic),
    pack_category: str(o.pack_category) === 'cast' ? 'cast' : 'scene',
    cast_mode: (o.cast_mode === 'single' || o.cast_mode === 'couple'
      ? o.cast_mode
      : null) as CastMode,
    phase: str(o.phase) as DreamOffPhase,
    phase_expires_at: strOrNull(o.phase_expires_at),
    is_owner: isTrue(o.is_owner),
    owner_name: strOrNull(o.owner_name),
    invite_code: strOrNull(o.invite_code),
    join_approval: isTrue(o.join_approval),
    player_count: numOr(o.player_count),
    entry_count: numOr(o.entry_count),
    my_status: str(o.my_status) as PlayerStatus,
    my_submitted: isTrue(o.my_submitted),
    my_voted: isTrue(o.my_voted),
  };
}

export function parseGalleryEntry(o: Record<string, unknown>): GalleryEntry {
  return {
    entry_id: str(o.entry_id),
    image: strOrNull(o.image),
    is_mine: 'is_mine' in o ? isTrue(o.is_mine) : undefined,
    render_status: typeof o.render_status === 'string' ? o.render_status : undefined,
    roses_by_me: 'roses_by_me' in o ? isTrue(o.roses_by_me) : undefined,
    author_id: typeof o.author_id === 'string' ? o.author_id : undefined,
    author_name: 'author_name' in o ? strOrNull(o.author_name) : undefined,
    rose_count: typeof o.rose_count === 'number' ? o.rose_count : undefined,
    superlative: (o.superlative ?? undefined) as SuperlativeKey | undefined,
  };
}

export function parsePodium(o: Record<string, unknown>): PodiumEntry {
  return {
    key: str(o.key) as SuperlativeKey,
    entry_id: str(o.entry_id),
    rose_count: numOr(o.rose_count),
    image: strOrNull(o.image),
    author_id: str(o.author_id),
    author_name: strOrNull(o.author_name),
  };
}

export function parseMyGame(o: Record<string, unknown>): MyGame {
  return {
    id: str(o.id),
    topic: str(o.topic),
    phase: str(o.phase) as DreamOffPhase,
    phase_expires_at: strOrNull(o.phase_expires_at),
    is_owner: isTrue(o.is_owner),
    my_status: str(o.my_status) as PlayerStatus,
    my_submitted: isTrue(o.my_submitted),
    my_voted: isTrue(o.my_voted),
    player_count: numOr(o.player_count),
    cover_image: strOrNull(o.cover_image),
    updated_at: str(o.updated_at),
  };
}

export function parsePack(o: Record<string, unknown>): DreamOffPack {
  return {
    key: str(o.key),
    display_name: str(o.display_name),
    group_key: strOrNull(o.group_key),
    group_label: strOrNull(o.group_label),
    tone_label: strOrNull(o.tone_label),
    tagline: strOrNull(o.tagline),
    emoji: strOrNull(o.emoji),
    accent: strOrNull(o.accent),
    has_scene: isTrue(o.has_scene),
    has_cast: isTrue(o.has_cast),
    is_holiday: isTrue(o.is_holiday),
    season_start: strOrNull(o.season_start),
    season_end: strOrNull(o.season_end),
    sort_order: numOr(o.sort_order),
  };
}

export function parseGamePlayer(o: Record<string, unknown>): GamePlayer {
  return {
    user_id: str(o.user_id),
    name: str(o.name),
    avatar_url: strOrNull(o.avatar_url),
    submitted: isTrue(o.submitted),
    voted: isTrue(o.voted),
    is_owner: isTrue(o.is_owner),
  };
}

export function parseActivityItem(o: Record<string, unknown>): ActivityItem {
  return { kind: str(o.kind), actor_name: strOrNull(o.actor_name), at: str(o.at) };
}

export function parseBallot(v: unknown): Ballot {
  const o = asObj(v);
  return {
    roses_max: numOr(o.roses_max, 2),
    entry_ids: Array.isArray(o.entry_ids)
      ? o.entry_ids.filter((x): x is string => typeof x === 'string')
      : [],
  };
}

export function parseResults(v: unknown): GameResults {
  const o = asObj(v);
  return {
    status: str(o.status) === 'ok' ? 'ok' : 'not_ready',
    phase: str(o.phase) as DreamOffPhase,
    topic: typeof o.topic === 'string' ? o.topic : undefined,
    owner_name: 'owner_name' in o ? strOrNull(o.owner_name) : undefined,
    podium: asObjArr(o.podium).map(parsePodium),
  };
}

export function parseInvitePreview(v: unknown): InvitePreview {
  const o = asObj(v);
  return {
    status: str(o.status) === 'ok' ? 'ok' : 'not_found',
    topic: typeof o.topic === 'string' ? o.topic : undefined,
    phase: typeof o.phase === 'string' ? (o.phase as DreamOffPhase) : undefined,
    owner_name: 'owner_name' in o ? strOrNull(o.owner_name) : undefined,
    player_count: typeof o.player_count === 'number' ? o.player_count : undefined,
    max_players: typeof o.max_players === 'number' ? o.max_players : undefined,
    joinable: 'joinable' in o ? isTrue(o.joinable) : undefined,
  };
}
