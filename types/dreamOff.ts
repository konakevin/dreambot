/**
 * Dream Off — client-side domain types for the read-RPC payloads.
 *
 * These are HAND-AUTHORED wire contracts (the RPCs return jsonb, which the
 * generated types/database.ts surfaces only as `Json`). The thin API layer in
 * lib/dreamOffApi.ts parses each RPC result into these; screens code against
 * them. Field names mirror the SQL (migrations 410 / 420 / 421) — note the wire
 * still says "rose" for a vote; the UI renders it as a gold star.
 */

export type DreamOffPhase =
  | 'setup'
  | 'submission'
  | 'voting'
  | 'results'
  | 'cancelled'
  | 'no_contest';

export type PackCategory = 'scene' | 'cast';
export type CastMode = 'single' | 'couple' | null;

export type PlayerStatus = 'active' | 'pending' | 'invited' | 'spectator' | 'left' | 'kicked';

/** Podium slot keys, in rank order → gold / silver / bronze. */
export type SuperlativeKey = 'winner' | 'runner_up' | 'dark_horse';

// ── get_game_room ─────────────────────────────────────────────────────────────
export type TopicSource = 'pack' | 'surprise' | 'custom';

export interface GameRoom {
  status: 'ok' | 'not_member';
  id: string;
  topic: string;
  /** How the seed was chosen — 'custom' seeds can't be re-rolled. */
  topic_source: TopicSource;
  pack_category: PackCategory;
  cast_mode: CastMode;
  phase: DreamOffPhase;
  phase_expires_at: string | null;
  is_owner: boolean;
  owner_name: string | null;
  /** Present only for the owner. */
  invite_code: string | null;
  join_approval: boolean;
  player_count: number;
  entry_count: number;
  my_status: PlayerStatus;
  my_submitted: boolean;
  my_voted: boolean;
}

// ── get_game_gallery ──────────────────────────────────────────────────────────
// One merged shape; which fields are populated depends on the game phase:
//   submission → is_mine, render_status (only the viewer's own entry)
//   voting     → is_mine, roses_by_me (author + tallies hidden)
//   reveal     → author_id, author_name, rose_count, superlative
export interface GalleryEntry {
  entry_id: string;
  image: string | null;
  is_mine?: boolean;
  render_status?: string;
  roses_by_me?: boolean;
  author_id?: string;
  author_name?: string | null;
  rose_count?: number;
  superlative?: SuperlativeKey | null;
}

// ── get_my_ballot ─────────────────────────────────────────────────────────────
export interface Ballot {
  roses_max: number;
  entry_ids: string[];
}

// ── get_game_activity ─────────────────────────────────────────────────────────
export interface ActivityItem {
  kind: string;
  actor_name: string | null;
  at: string;
}

// ── get_game_results ──────────────────────────────────────────────────────────
export interface PodiumEntry {
  key: SuperlativeKey;
  entry_id: string;
  rose_count: number;
  image: string | null;
  author_id: string;
  author_name: string | null;
}
export interface GameResults {
  status: 'ok' | 'not_ready';
  phase: DreamOffPhase;
  topic?: string;
  owner_name?: string | null;
  podium?: PodiumEntry[];
}

// ── get_my_games ──────────────────────────────────────────────────────────────
export interface MyGame {
  id: string;
  topic: string;
  phase: DreamOffPhase;
  phase_expires_at: string | null;
  is_owner: boolean;
  my_status: PlayerStatus;
  my_submitted: boolean;
  my_voted: boolean;
  player_count: number;
  /** Winner's dream image for a finished game; null while in progress. */
  cover_image: string | null;
  updated_at: string;
}

// ── get_game_invite_preview (anon-safe) ───────────────────────────────────────
export interface InvitePreview {
  status: 'ok' | 'not_found';
  topic?: string;
  phase?: DreamOffPhase;
  owner_name?: string | null;
  player_count?: number;
  max_players?: number;
  joinable?: boolean;
}

// ── get_dream_off_packs ───────────────────────────────────────────────────────
export interface DreamOffPack {
  key: string;
  display_name: string;
  group_key: string | null;
  group_label: string | null;
  tone_label: string | null;
  tagline: string | null;
  emoji: string | null;
  accent: string | null;
  has_scene: boolean;
  has_cast: boolean;
  is_holiday: boolean;
  season_start: string | null;
  season_end: string | null;
  sort_order: number;
}

/** Maps a podium slot to a medal place (1/2/3) for the results UI. */
export const SUPERLATIVE_TO_MEDAL: Record<SuperlativeKey, 1 | 2 | 3> = {
  winner: 1,
  runner_up: 2,
  dark_horse: 3,
};

/** Flavor label shown alongside the medal (Kevin: keep "Dark Horse"). */
export const SUPERLATIVE_LABEL: Record<SuperlativeKey, string> = {
  winner: 'Winner',
  runner_up: 'Runner-up',
  dark_horse: 'Dark Horse',
};

// ── get_game_players (lobby / submission roster; members only) ────────────────
export interface GamePlayer {
  user_id: string;
  name: string;
  avatar_url: string | null;
  status: PlayerStatus;
  submitted: boolean;
  voted: boolean;
  is_owner: boolean;
}
