/**
 * Unit tests for the on-demand HD upscale path (Pro "Download in HD").
 *
 * This is a paid feature on the dream hot path, and its correctness rests on a
 * single invariant: for any one upload there is exactly ONE Replicate run, ONE
 * cached storage object, and every requester resolves to that SAME image — even
 * with concurrent download taps and the recovery paths (stale-reclaim /
 * failed-retry). These tests lock the three layers that enforce it:
 *
 *   1. persistBufferToStorage — a caller-supplied deterministic key makes the
 *      write idempotent (upsert), so a re-run OVERWRITES the one object instead
 *      of orphaning a second timestamped copy. (The HQ-cache fix, 2026-05-26.)
 *   2. upscaleAndCache — writes to the deterministic per-upload key
 *      `${userId}/hq/${uploadId}.png`, caches onto uploads.image_url_hq, and
 *      never throws.
 *   3. claim_upscale_job (migration 182) — the atomic single-flight: PK on
 *      upload_id + conditional ON CONFLICT DO UPDATE ... RETURNING, so only one
 *      concurrent caller is told to kick the Replicate run.
 *
 * Layers 1–2 are behavioural (the _shared fns take `supabase` as a param, so we
 * inject a fake). Layer 3 is a Postgres property unreachable from jest, so it's
 * a source-contract assertion (same precedent as auditFixes/faceSwapOverrides).
 */

import * as fs from 'fs';
import * as path from 'path';
import { persistBufferToStorage } from '@engine/persistence';
import { upscaleAndCache } from '@engine/upscaleClarity';

// ── helpers ──────────────────────────────────────────────────────────────────

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer;
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]).buffer;

interface UploadCall {
  fileName: string;
  opts: { contentType: string; cacheControl: string; upsert?: boolean };
}
interface UpdateCall {
  table: string;
  vals: Record<string, unknown>;
}

/** Minimal fake of the bits of the Supabase client these fns touch. */
function makeFakeSupabase() {
  const uploadCalls: UploadCall[] = [];
  const updateCalls: UpdateCall[] = [];
  const supabase = {
    storage: {
      from: () => ({
        upload: (fileName: string, _buf: ArrayBuffer, opts: UploadCall['opts']) => {
          uploadCalls.push({ fileName, opts });
          return Promise.resolve({ error: null });
        },
        getPublicUrl: (fileName: string) => ({
          data: { publicUrl: `https://cdn.example/${fileName}` },
        }),
      }),
    },
    from: (table: string) => ({
      update: (vals: Record<string, unknown>) => ({
        eq: () => {
          updateCalls.push({ table, vals });
          return Promise.resolve({ error: null });
        },
      }),
    }),
  };
  // The fns are typed against the real SupabaseClient; this fake is structural.
  return { supabase: supabase as never, uploadCalls, updateCalls };
}

// ── 1. persistBufferToStorage — idempotent storage key ───────────────────────

describe('persistBufferToStorage', () => {
  it('uses a caller-supplied deterministic key with upsert:true (idempotent write)', async () => {
    const { supabase, uploadCalls } = makeFakeSupabase();
    const key = 'user-1/hq/upload-9.png';
    const url = await persistBufferToStorage(PNG_BYTES, 'user-1', supabase, key);

    expect(uploadCalls).toHaveLength(1);
    expect(uploadCalls[0].fileName).toBe(key);
    expect(uploadCalls[0].opts.upsert).toBe(true);
    expect(url).toBe('https://cdn.example/user-1/hq/upload-9.png');
  });

  it('defaults to a unique timestamped key with upsert:false (original renders)', async () => {
    const { supabase, uploadCalls } = makeFakeSupabase();
    await persistBufferToStorage(PNG_BYTES, 'user-1', supabase);

    expect(uploadCalls).toHaveLength(1);
    expect(uploadCalls[0].fileName).toMatch(/^user-1\/\d+\.png$/);
    expect(uploadCalls[0].opts.upsert).toBe(false);
  });

  it('two timestamped writes never collide (distinct objects for distinct renders)', async () => {
    const { supabase, uploadCalls } = makeFakeSupabase();
    await persistBufferToStorage(PNG_BYTES, 'u', supabase);
    // advance the clock so Date.now() differs
    const realNow = Date.now;
    Date.now = () => realNow() + 5;
    await persistBufferToStorage(PNG_BYTES, 'u', supabase);
    Date.now = realNow;

    expect(uploadCalls[0].fileName).not.toBe(uploadCalls[1].fileName);
  });

  it('detects PNG vs JPEG from magic bytes for the content type', async () => {
    const { supabase, uploadCalls } = makeFakeSupabase();
    await persistBufferToStorage(PNG_BYTES, 'u', supabase, 'u/a.png');
    await persistBufferToStorage(JPEG_BYTES, 'u', supabase, 'u/b.jpg');

    expect(uploadCalls[0].opts.contentType).toBe('image/png');
    expect(uploadCalls[1].opts.contentType).toBe('image/jpeg');
  });
});

// ── 2. upscaleAndCache — deterministic cache + resilience ────────────────────

describe('upscaleAndCache', () => {
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  /** Replicate submit → poll(succeeded) → temp-image download. */
  function mockReplicateSuccess(tempUrl = 'https://replicate.test/out.png') {
    global.fetch = jest.fn(async (url: string | URL | Request, opts?: RequestInit) => {
      const u = String(url);
      if (u === 'https://api.replicate.com/v1/predictions' && opts?.method === 'POST') {
        return { ok: true, json: async () => ({ id: 'pred-1' }), text: async () => '' } as Response;
      }
      if (u.startsWith('https://api.replicate.com/v1/predictions/')) {
        return {
          ok: true,
          json: async () => ({ status: 'succeeded', output: tempUrl }),
        } as Response;
      }
      if (u === tempUrl) {
        return { ok: true, arrayBuffer: async () => PNG_BYTES } as Response;
      }
      throw new Error(`unexpected fetch: ${u}`);
    }) as typeof fetch;
  }

  it('caches to the deterministic per-upload key and writes image_url_hq', async () => {
    jest.useFakeTimers();
    mockReplicateSuccess();
    const { supabase, uploadCalls, updateCalls } = makeFakeSupabase();

    const p = upscaleAndCache(supabase, 'tok', 'upload-42', 'https://src/orig.jpg', 'user-7');
    await jest.runAllTimersAsync();
    const hqUrl = await p;

    // exactly one storage object, at the deterministic HQ key
    expect(uploadCalls).toHaveLength(1);
    expect(uploadCalls[0].fileName).toBe('user-7/hq/upload-42.png');
    expect(uploadCalls[0].opts.upsert).toBe(true);

    // cached onto the upload row
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0].table).toBe('uploads');
    expect(updateCalls[0].vals.image_url_hq).toBe('https://cdn.example/user-7/hq/upload-42.png');
    expect(hqUrl).toBe('https://cdn.example/user-7/hq/upload-42.png');
  });

  it('returns null and does not touch storage/DB when args are missing', async () => {
    global.fetch = jest.fn();
    const { supabase, uploadCalls, updateCalls } = makeFakeSupabase();

    expect(await upscaleAndCache(supabase, 'tok', '', 'https://src', 'u')).toBeNull();
    expect(await upscaleAndCache(supabase, 'tok', 'id', '', 'u')).toBeNull();
    expect(await upscaleAndCache(supabase, 'tok', 'id', 'https://src', '')).toBeNull();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(uploadCalls).toHaveLength(0);
    expect(updateCalls).toHaveLength(0);
  });

  it('returns null without caching when every upscaler is exhausted', async () => {
    jest.useFakeTimers();
    // 400 = non-retryable submit failure → each model bails fast, no caching
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 400,
      text: async () => 'bad request',
    })) as unknown as typeof fetch;
    const { supabase, uploadCalls, updateCalls } = makeFakeSupabase();

    const p = upscaleAndCache(supabase, 'tok', 'upload-1', 'https://src/x.jpg', 'user-1');
    await jest.runAllTimersAsync();
    const res = await p;

    expect(res).toBeNull();
    expect(uploadCalls).toHaveLength(0);
    expect(updateCalls).toHaveLength(0);
  });

  it('never throws — a download failure resolves to null', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn(async (url: string | URL | Request, opts?: RequestInit) => {
      const u = String(url);
      if (u === 'https://api.replicate.com/v1/predictions' && opts?.method === 'POST') {
        return { ok: true, json: async () => ({ id: 'p' }), text: async () => '' } as Response;
      }
      if (u.startsWith('https://api.replicate.com/v1/predictions/')) {
        return {
          ok: true,
          json: async () => ({ status: 'succeeded', output: 'https://t/x.png' }),
        } as Response;
      }
      // temp-image download fails
      return { ok: false, status: 502 } as Response;
    }) as typeof fetch;
    const { supabase, uploadCalls, updateCalls } = makeFakeSupabase();

    const p = upscaleAndCache(supabase, 'tok', 'u1', 'https://src/x.jpg', 'usr');
    await jest.runAllTimersAsync();

    await expect(p).resolves.toBeNull();
    expect(uploadCalls).toHaveLength(0);
    expect(updateCalls).toHaveLength(0);
  });
});

// ── 3. claim_upscale_job — atomic single-flight contract (migration 182) ─────

describe('claim_upscale_job atomicity (migration 182)', () => {
  const sql = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'migrations', '182_upscale_on_demand.sql'),
    'utf-8'
  );

  it('keys the job table on upload_id as PRIMARY KEY (one row per upload)', () => {
    expect(sql).toMatch(/upload_id\s+uuid\s+PRIMARY KEY/);
  });

  it('uses INSERT ... ON CONFLICT (upload_id) DO UPDATE (the atomic claim)', () => {
    expect(sql).toContain('ON CONFLICT (upload_id) DO UPDATE');
  });

  it('only RE-claims a failed OR stale job — a fresh "processing" job is NOT re-kicked', () => {
    // The conditional WHERE on the DO UPDATE is what makes concurrent callers
    // for one upload resolve to a SINGLE kick. Removing it = every caller kicks.
    const claim = sql.slice(sql.indexOf('ON CONFLICT (upload_id) DO UPDATE'));
    expect(claim).toMatch(/WHERE[\s\S]*status IN \('failed'\)/);
    expect(claim).toMatch(/status = 'processing'[\s\S]*updated_at < now\(\) - make_interval/);
  });

  it('RETURNS upload_id so only the claiming caller is told to kick', () => {
    expect(sql).toContain('RETURNING upload_id');
  });
});

// ── 4. upscale-image orchestration wiring ────────────────────────────────────

describe('upscale-image Edge Function wiring', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'upscale-image', 'index.ts'),
    'utf-8'
  );

  it('short-circuits to a cache hit before doing any work', () => {
    expect(src).toContain('if (uploadRow.image_url_hq)');
    expect(src).toContain("status: 'done'");
  });

  it('gates the Replicate kick on the atomic claim (only the winner upscales)', () => {
    expect(src).toContain("supabase.rpc('claim_upscale_job'");
    expect(src).toMatch(/const shouldKick =/);
    // upscaleAndCache must be reached only inside the shouldKick branch
    const kickIdx = src.indexOf('if (shouldKick)');
    expect(kickIdx).toBeGreaterThan(-1);
    expect(src.indexOf('upscaleAndCache(')).toBeGreaterThan(kickIdx);
  });

  it('marks the job completed on success and failed on a null result', () => {
    expect(src).toContain("status: 'completed'");
    expect(src).toContain("status: 'failed'");
  });

  it('runs the kick as a background task so the request acks immediately', () => {
    expect(src).toContain('EdgeRuntime');
    expect(src).toContain('waitUntil');
  });
});
