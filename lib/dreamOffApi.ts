/**
 * dreamOffApi — the thin, typed client for the Dream Off RPCs + the entry edge
 * function. Does the supabase I/O; the jsonb→domain-type mapping lives in the
 * pure, unit-tested lib/dreamOffParse. Screens/hooks call these, never
 * supabase.rpc directly.
 */

import { supabase } from '@/lib/supabase';
import { invokeEdge } from '@/lib/edgeFunction';
import {
  asObj,
  asObjArr,
  str,
  parseRoom,
  parseGalleryEntry,
  parseMyGame,
  parsePack,
  parseGamePlayer,
  parseActivityItem,
  parseBallot,
  parseResults,
  parseInvitePreview,
} from '@/lib/dreamOffParse';
import type {
  ActivityItem,
  Ballot,
  CastMode,
  DreamOffPack,
  GalleryEntry,
  GamePlayer,
  GameResults,
  GameRoom,
  InvitePreview,
  MyGame,
  PackCategory,
} from '@/types/dreamOff';

function fail(rpc: string, error: { message?: string } | null): never {
  throw new Error(`dreamOff:${rpc} ${error?.message ?? 'failed'}`);
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
  return parseBallot(data);
}

export async function getGameActivity(gameId: string, limit = 40): Promise<ActivityItem[]> {
  const { data, error } = await supabase.rpc('get_game_activity', {
    p_game_id: gameId,
    p_limit: limit,
  });
  if (error) fail('get_game_activity', error);
  return asObjArr(data).map(parseActivityItem);
}

export async function getGameResults(gameId: string): Promise<GameResults | null> {
  const { data, error } = await supabase.rpc('get_game_results', { p_game_id: gameId });
  if (error) fail('get_game_results', error);
  if (!data) return null;
  return parseResults(data);
}

export async function getMyGames(): Promise<MyGame[]> {
  const { data, error } = await supabase.rpc('get_my_games');
  if (error) fail('get_my_games', error);
  return asObjArr(data).map(parseMyGame);
}

export async function getGamePlayers(gameId: string): Promise<GamePlayer[]> {
  const { data, error } = await supabase.rpc('get_game_players', { p_game_id: gameId });
  if (error) fail('get_game_players', error);
  return asObjArr(data).map(parseGamePlayer);
}

export async function getInvitePreview(code: string): Promise<InvitePreview> {
  const { data, error } = await supabase.rpc('get_game_invite_preview', { p_code: code });
  if (error) fail('get_game_invite_preview', error);
  return parseInvitePreview(data);
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

export async function invitePlayers(gameId: string, userIds: string[]): Promise<number> {
  const { data, error } = await supabase.rpc('invite_players', {
    p_game_id: gameId,
    p_user_ids: userIds,
  });
  if (error) fail('invite_players', error);
  const n = asObj(data).invited;
  return typeof n === 'number' ? n : userIds.length;
}

export interface JoinResult {
  status: string;
  gameId: string | null;
}

export async function joinGameByCode(code: string): Promise<JoinResult> {
  const { data, error } = await supabase.rpc('join_game_by_code', { p_code: code });
  if (error) fail('join_game_by_code', error);
  const o = asObj(data);
  return { status: str(o.status), gameId: typeof o.game_id === 'string' ? o.game_id : null };
}

/** Code-less accept for a push-invited friend (mirrors join_game_by_code's status strings). */
export async function acceptInvite(gameId: string): Promise<JoinResult> {
  const { data, error } = await supabase.rpc('accept_invite', { p_game_id: gameId });
  if (error) fail('accept_invite', error);
  const o = asObj(data);
  return { status: str(o.status), gameId: typeof o.game_id === 'string' ? o.game_id : null };
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
