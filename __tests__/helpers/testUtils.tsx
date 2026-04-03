/**
 * Shared test utilities for hook and component tests.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';

/** Create a fresh QueryClient for each test */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

/** Wrapper component that provides QueryClient */
export function createWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

/** Render a hook with QueryClient provider */
export function renderHookWithClient<T>(hook: () => T, queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient();
  return {
    ...renderHook(hook, { wrapper: createWrapper(client) }),
    queryClient: client,
  };
}

/** Mock Supabase client — override specific methods in individual tests */
export const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
    getSession: jest.fn().mockResolvedValue({
      data: { session: { access_token: 'test-token', user: { id: 'test-user-id' } } },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest
      .fn()
      .mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  functions: {
    invoke: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest
        .fn()
        .mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } }),
    }),
  },
};
