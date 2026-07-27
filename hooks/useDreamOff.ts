/**
 * useDreamOff — TanStack Query hooks over dreamOffApi, plus the Room's realtime
 * wiring. Only the dream_offs ROW is realtime (entries/votes are never published
 * — that's the blindness guarantee), so phase flips arrive live; player/entry
 * counts (which depend on the un-published tables) are kept fresh with a light
 * refetch interval while a game is live.
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import * as api from '@/lib/dreamOffApi';
import type { CastMode, DreamOffPhase, PackCategory } from '@/types/dreamOff';

const LIVE_PHASES: DreamOffPhase[] = ['setup', 'submission', 'voting'];

const keys = {
  room: (id: string) => ['dreamOff', 'room', id] as const,
  gallery: (id: string) => ['dreamOff', 'gallery', id] as const,
  ballot: (id: string) => ['dreamOff', 'ballot', id] as const,
  results: (id: string) => ['dreamOff', 'results', id] as const,
  activity: (id: string) => ['dreamOff', 'activity', id] as const,
  myGames: ['dreamOff', 'myGames'] as const,
  packs: (c?: PackCategory) => ['dreamOff', 'packs', c ?? 'all'] as const,
};

// ── the Room header + the viewer's own state (realtime) ───────────────────────
export function useGameRoom(gameId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: keys.room(gameId),
    queryFn: () => api.getGameRoom(gameId),
    refetchInterval: (q) =>
      q.state.data && LIVE_PHASES.includes(q.state.data.phase) ? 12_000 : false,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`dream_off:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dream_offs', filter: `id=eq.${gameId}` },
        () => {
          // Phase or topic changed — refetch the room + everything downstream.
          void qc.invalidateQueries({ queryKey: keys.room(gameId) });
          void qc.invalidateQueries({ queryKey: keys.gallery(gameId) });
          void qc.invalidateQueries({ queryKey: keys.results(gameId) });
          void qc.invalidateQueries({ queryKey: keys.activity(gameId) });
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [gameId, qc]);

  return query;
}

export function useGameGallery(gameId: string, enabled = true) {
  return useQuery({
    queryKey: keys.gallery(gameId),
    queryFn: () => api.getGameGallery(gameId),
    enabled,
  });
}

export function useMyBallot(gameId: string, enabled = true) {
  return useQuery({
    queryKey: keys.ballot(gameId),
    queryFn: () => api.getMyBallot(gameId),
    enabled,
  });
}

export function useGameResults(gameId: string, enabled = true) {
  return useQuery({
    queryKey: keys.results(gameId),
    queryFn: () => api.getGameResults(gameId),
    enabled,
  });
}

export function useGameActivity(gameId: string, enabled = true) {
  return useQuery({
    queryKey: keys.activity(gameId),
    queryFn: () => api.getGameActivity(gameId),
    enabled,
  });
}

export function useMyGames() {
  return useQuery({ queryKey: keys.myGames, queryFn: () => api.getMyGames() });
}

export function useDreamOffPacks(category?: PackCategory) {
  return useQuery({
    queryKey: keys.packs(category),
    queryFn: () => api.getDreamOffPacks(category),
    staleTime: 10 * 60 * 1000,
  });
}

// ── mutations ─────────────────────────────────────────────────────────────────
export function useCreateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (a: api.CreateGameArgs) => api.createGame(a),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.myGames }),
  });
}

export function useDealTopic(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pack?: string) => api.dealTopic(gameId, pack),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.room(gameId) }),
  });
}

export function useCastVotes(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryIds: string[]) => api.castVotes(gameId, entryIds),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.ballot(gameId) });
      void qc.invalidateQueries({ queryKey: keys.gallery(gameId) });
      void qc.invalidateQueries({ queryKey: keys.room(gameId) });
    },
  });
}

export function useAdvancePhase(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.advancePhase(gameId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.room(gameId) });
      void qc.invalidateQueries({ queryKey: keys.gallery(gameId) });
      void qc.invalidateQueries({ queryKey: keys.results(gameId) });
    },
  });
}

export function useInvitePlayers(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userIds: string[]) => api.invitePlayers(gameId, userIds),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.room(gameId) }),
  });
}

export function useJoinGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => api.joinGameByCode(code),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.myGames }),
  });
}

export function useLeaveGame(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.leaveGame(gameId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.myGames }),
  });
}

export function useCancelGame(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.cancelGame(gameId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.room(gameId) });
      void qc.invalidateQueries({ queryKey: keys.myGames });
    },
  });
}

export type { CastMode, PackCategory };
