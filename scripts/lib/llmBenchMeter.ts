/**
 * llmBenchMeter.ts — meters every Anthropic call a Deno bench makes (LLM_MIGRATION.md step 1).
 *
 * Wraps globalThis.fetch: each POST to api.anthropic.com records the model (from the request body), the status,
 * the stop reason, the token usage and the latency, tagged with whatever sample is running (AsyncLocalStorage), so
 * a bench can attribute calls, including a chain's fallback calls, to the sample and arm that made them. It reads a
 * clone of the response, so callers are unaffected. No production code knows it exists.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export interface MeterCall {
  tag: string | null;
  model: string;
  status: number;
  stopReason: string | null;
  inputTokens: number;
  outputTokens: number;
  ms: number;
}

/** $ per million tokens (input, output). Thinking tokens bill as output. */
export const PRICES: Record<string, [number, number]> = {
  'claude-sonnet-4-6': [3, 15],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-4-5-20251001': [1, 5],
};

export function costUsd(c: Pick<MeterCall, 'model' | 'inputTokens' | 'outputTokens'>): number {
  const p = PRICES[c.model];
  return p ? (c.inputTokens * p[0] + c.outputTokens * p[1]) / 1e6 : 0;
}

export const calls: MeterCall[] = [];
const store = new AsyncLocalStorage<string>();

export function withTag<T>(tag: string, fn: () => Promise<T>): Promise<T> {
  return store.run(tag, fn);
}

let installed = false;
export function installMeter(): void {
  if (installed) return;
  installed = true;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: Request | URL | string, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (!url.startsWith('https://api.anthropic.com/')) return realFetch(input, init);
    const tag = store.getStore() ?? null;
    let model = '?';
    try {
      model = JSON.parse(String(init && init.body)).model ?? '?';
    } catch {
      /* not JSON */
    }
    const t0 = performance.now();
    const res = await realFetch(input, init);
    const ms = performance.now() - t0;
    let stopReason: string | null = null;
    let inputTokens = 0;
    let outputTokens = 0;
    if (res.ok) {
      try {
        const j = await res.clone().json();
        stopReason = typeof j.stop_reason === 'string' ? j.stop_reason : null;
        inputTokens = Number(j.usage && j.usage.input_tokens) || 0;
        outputTokens = Number(j.usage && j.usage.output_tokens) || 0;
      } catch {
        /* unreadable body */
      }
    }
    calls.push({ tag, model, status: res.status, stopReason, inputTokens, outputTokens, ms });
    return res;
  }) as typeof fetch;
}

export function quantile(xs: number[], q: number): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}
