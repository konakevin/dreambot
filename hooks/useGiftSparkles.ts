/**
 * useGiftSparkles — client side of Gift Sparkles Phase 1 (migration 334,
 * GIFT_SPARKLES_PLAN.md).
 *
 * Provenance rule (server-enforced, surfaced here): only PURCHASED sparkles
 * are giftable. get_giftable_balance powers the sheet header; gift_sparkles
 * returns a status string mapped to friendly copy by the sheet. The mutation
 * carries a client-minted reference id so a double-tap can't double-send
 * (server idempotency).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface GiftableBalance {
  balance: number;
  giftable: number;
  /** Sparkles already gifted today (UTC day) — drives the daily-cap clamp. */
  sentToday: number;
  maxPerSend: number;
  maxPerDay: number;
}

export function useGiftableBalance(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['giftableBalance', user?.id],
    queryFn: async (): Promise<GiftableBalance> => {
      const { data, error } = await supabase.rpc('get_giftable_balance');
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      const r = (row ?? {}) as Record<string, number | null>;
      return {
        balance: r.balance ?? 0,
        giftable: r.giftable ?? 0,
        sentToday: r.sent_today ?? 0,
        maxPerSend: r.max_per_send ?? 100,
        maxPerDay: r.max_per_day ?? 200,
      };
    },
    enabled: !!user && enabled,
    staleTime: 30_000,
  });
}

export type GiftStatus =
  | 'ok'
  | 'disabled'
  | 'invalid_amount'
  | 'invalid_recipient'
  | 'blocked'
  | 'daily_cap'
  | 'insufficient_giftable';

export function useSendGift() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (args: {
      recipientId: string;
      amount: number;
      message?: string;
    }): Promise<GiftStatus> => {
      const { data, error } = await supabase.rpc('gift_sparkles', {
        p_recipient: args.recipientId,
        p_amount: args.amount,
        p_message: args.message || undefined,
        p_reference_id: Crypto.randomUUID(),
      });
      if (error) throw error;
      return data as GiftStatus;
    },
    onSuccess: (status) => {
      if (status === 'ok') {
        qc.invalidateQueries({ queryKey: ['giftableBalance', user?.id] });
        qc.invalidateQueries({ queryKey: ['sparkleBalance', user?.id] });
      }
    },
  });
}

export interface GiftDetails {
  amount: number;
  sender_id: string;
  sender_username: string;
  sender_avatar: string | null;
  message: string | null;
  created_at: string;
  thanked: boolean;
}

/** Unwrap-screen payload — only readable by the gift's recipient. */
export function useGift(referenceId: string | null) {
  return useQuery({
    queryKey: ['gift', referenceId],
    queryFn: async (): Promise<GiftDetails | null> => {
      const { data, error } = await supabase.rpc('get_gift', {
        p_reference_id: referenceId as string,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return (row as GiftDetails) ?? null;
    },
    enabled: !!referenceId,
    staleTime: 60_000,
  });
}

export function useThankGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (referenceId: string) => {
      const { data, error } = await supabase.rpc('thank_gift', { p_reference_id: referenceId });
      if (error) throw error;
      return data as string;
    },
    onSuccess: (_res, referenceId) => {
      qc.invalidateQueries({ queryKey: ['gift', referenceId] });
    },
  });
}
