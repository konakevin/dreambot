/**
 * dreamOffApi — the thin, typed client for the Dream Off RPCs + the entry edge
 * function. Every read RPC returns jsonb (surfaced as `Json`), so each wrapper
 * parses the result into the hand-authored domain types in types/dreamOff.ts via
 * small guarded coercers (no unsafe casts). Screens/hooks call these, never
 * supabase.rpc directly.
 */

import { supabase } from '@/lib/supabase';
import { invokeEdge } from '@/lib/edgeFunction';
import type {
  ActivityItem,
  Ballot,
  CastMode,
  DreamOffPack,
  DreamOffPhase,
  GalleryEntry,
  GameResults,
  GameRoom,
  InvitePreview,
  MyGame,
  PackCategory,
  PlayerStatus,
  PodiumEntry,
  SuperlativeKey,
} from '@/types/dreamOff';

// ── coercers ──────────────────────────────────────────────────────────────────
const asObj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const asObjArr = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v)
    ? v.filter((x) => x && typeof x === 'object').map((x) => x as Record<string, unknown>)
    : [];
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const strOrNull = (v: unknown): string | null => (typeof v === 'string' ? v : null);
const numOr = (v: unknown, d = 0): number => (typeof v === 'number' ? v : d);
const isTrue = (v: unknown): boolean => v === true;

function fail(rpc: string, error: { message?: string } | null): never {
  throw new Error(`dreamOff:${rpc} ${error?.message ?? 'failed'}`);
}

// ── parsers ─────────────────────────────────────────────────────────────────--
function parseRoom(o: Record<string, unknown>): GameRoom {
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

function parseGalleryEntry(o: Record<string, unknown>): GalleryEntry {
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

function parsePodium(o: Record<string, unknown>): PodiumEntry {
  return {
    key: str(o.key) as SuperlativeKey,
    entry_id: str(o.entry_id),
    rose_count: numOr(o.rose_count),
    image: strOrNull(o.image),
    author_id: str(o.author_id),
    author_name: strOrNull(o.author_name),
  };
}

function parseMyGame(o: Record<string, unknown>): MyGame {
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
    updated_at: str(o.updated_at),
  };
}

function parsePack(o: Record<string, unknown>): DreamOffPack {
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

// ── reads ──────────────────────────────────────────────────────────────────---
export async function getGameRoom(gameId: string): Promise<GameRoom | null> {
  const { data, error } = await supabase.rpc('get_game_room', { p_game_id: gameId });
  if (error) fail('get_game_room', error);
  if (!data) return null;
  return parseRoom(asObj(data));
}

export async function getGameGallery(gameId: string): Promise<GalleryEntry[]> {
  const { data, error } = await supabase.rpc('get_game_gallery', { p_game_id: gameId });
  if (error) fail('get_game_gallery', error);
  return asObjArr(data).map(parseGalleryEntry);
}

export async function getMyBallot(gameId: string): Promise<Ballot> {
  const { data, error } = await supabase.rpc('get_my_ballot', { p_game_id: gameId });
  if (error) fail('get_my_ballot', error);
  const o = asObj(data);
  return {
    roses_max: numOr(o.roses_max, 2),
    entry_ids: Array.isArray(o.entry_ids)
      ? o.entry_ids.filter((x): x is string => typeof x === 'string')
      : [],
  };
}

export async function getGameActivity(gameId: string, limit = 40): Promise<ActivityItem[]> {
  const { data, error } = await supabase.rpc('get_game_activity', {
    p_game_id: gameId,
    p_limit: limit,
  });
  if (error) fail('get_game_activity', error);
  return asObjArr(data).map((o) => ({
    kind: str(o.kind),
    actor_name: strOrNull(o.actor_name),
    at: str(o.at),
  }));
}

export async function getGameResults(gameId: string): Promise<GameResults | null> {
  const { data, error } = await supabase.rpc('get_game_results', { p_game_id: gameId });
  if (error) fail('get_game_results', error);
  if (!data) return null;
  const o = asObj(data);
  return {
    status: str(o.status) === 'ok' ? 'ok' : 'not_ready',
    phase: str(o.phase) as DreamOffPhase,
    topic: typeof o.topic === 'string' ? o.topic : undefined,
    owner_name: 'owner_name' in o ? strOrNull(o.owner_name) : undefined,
    podium: asObjArr(o.podium).map(parsePodium),
  };
}

export async function getMyGames(): Promise<MyGame[]> {
  const { data, error } = await supabase.rpc('get_my_games');
  if (error) fail('get_my_games', error);
  return asObjArr(data).map(parseMyGame);
}

export async function getInvitePreview(code: string): Promise<InvitePreview> {
  const { data, error } = await supabase.rpc('get_game_invite_preview', { p_code: code });
  if (error) fail('get_game_invite_preview', error);
  const o = asObj(data);
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

export async function getDreamOffPacks(category?: PackCategory): Promise<DreamOffPack[]> {
  const { data, error } = await supabase.rpc(
    'get_dream_off_packs',
    category ? { p_category: category } : {}
  );
  if (error) fail('get_dream_off_packs', error);
  return asObjArr(data).map(parsePack);
}

// ── mutations ──────────────────────────────────────────────────────────────---
export interface CreateGameArgs {
  topic: string;
  topicSource: 'pack' | 'surprise' | 'custom';
  packCategory: PackCategory;
  castMode?: CastMode;
  tierKey?: string;
  maxPlayers?: number;
  joinApproval?: boolean;
}

export async function createGame(
  a: CreateGameArgs
): Promise<{ gameId: string; inviteCode: string }> {
  const { data, error } = await supabase.rpc('create_game', {
    p_topic: a.topic,
    p_topic_source: a.topicSource,
    p_pack_category: a.packCategory,
    ...(a.castMode ? { p_cast_mode: a.castMode } : {}),
    ...(a.tierKey ? { p_tier_key: a.tierKey } : {}),
    ...(a.maxPlayers ? { p_max_players: a.maxPlayers } : {}),
    ...(a.joinApproval !== undefined ? { p_join_approval: a.joinApproval } : {}),
  });
  if (error) fail('create_game', error);
  const o = asObj(data);
  return { gameId: str(o.game_id), inviteCode: str(o.invite_code) };
}

export async function dealTopic(gameId: string, pack?: string): Promise<string> {
  const { data, error } = await supabase.rpc('deal_topic', {
    p_game_id: gameId,
    ...(pack ? { p_pack: pack } : {}),
  });
  if (error) fail('deal_topic', error);
  return str(asObj(data).topic);
}

export async function invitePlayers(gameId: string, userIds: string[]): Promise<void> {
  const { error } = await supabase.rpc('invite_players', {
    p_game_id: gameId,
    p_user_ids: userIds,
  });
  if (error) fail('invite_players', error);
}

export async function joinGameByCode(code: string): Promise<{ gameId: string }> {
  const { data, error } = await supabase.rpc('join_game_by_code', { p_code: code });
  if (error) fail('join_game_by_code', error);
  return { gameId: str(asObj(data).game_id) };
}

export async function leaveGame(gameId: string): Promise<void> {
  const { error } = await supabase.rpc('leave_game', { p_game_id: gameId });
  if (error) fail('leave_game', error);
}

export async function cancelGame(gameId: string): Promise<void> {
  const { error } = await supabase.rpc('cancel_game', { p_game_id: gameId });
  if (error) fail('cancel_game', error);
}

export async function castVotes(gameId: string, entryIds: string[]): Promise<void> {
  const { error } = await supabase.rpc('cast_votes', { p_game_id: gameId, p_entry_ids: entryIds });
  if (error) fail('cast_votes', error);
}

/** Owner-only funnel step: setup→submission, submission→voting, voting→results. */
export async function advancePhase(gameId: string): Promise<string> {
  const { data, error } = await supabase.rpc('advance_phase', { p_game_id: gameId });
  if (error) fail('advance_phase', error);
  return typeof data === 'string' ? data : '';
}

// ── entry submit (edge) ───────────────────────────────────────────────────────
export interface SubmitEntryArgs {
  gameId: string;
  jobId: string;
  forceModel?: string | null;
  /** The generate-dream render params (medium/vibe/model/prompt/vibe_profile…). */
  render: Record<string, unknown>;
}

export async function submitDreamOffEntry(
  a: SubmitEntryArgs
): Promise<{ dreamId: string; entryId?: string }> {
  const { data, error } = await invokeEdge<Record<string, unknown>>('dream-off-submit', {
    body: {
      ...a.render,
      game_id: a.gameId,
      job_id: a.jobId,
      ...(a.forceModel ? { force_model: a.forceModel } : {}),
    },
  });
  if (error) throw new Error(`dreamOff:submit ${error.message ?? 'failed'}`);
  const o = asObj(data);
  return {
    dreamId: str(o.dream_id) || a.jobId,
    entryId: typeof o.entry_id === 'string' ? o.entry_id : undefined,
  };
}
