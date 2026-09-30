/**
 * The Edge client (_shared/anthropic.ts) and the Node client (scripts/lib/anthropic.js) are two copies of one
 * contract (LLM_MIGRATION.md). If they drift, a job that passed its parity gate on one runtime behaves differently
 * on the other. This locks the parts that must match: the model profiles and the exact request bodies, reply
 * parsing, route parsing, and the retry ladder. Then the Node chain and the bot engine's "Claude exhausted" text,
 * which check-bot-health.js and dispatch-bots.js alarm on.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import * as edge from '@engine/anthropic';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const node = require('../../scripts/lib/anthropic');

const SONNET = 'claude-sonnet-4-6';
const SONNET_5_5 = 'claude-sonnet-5-5';
const SONNET_5 = 'claude-sonnet-5';
const HAIKU = 'claude-haiku-4-5-20251001';

describe('Edge ↔ Node client parity', () => {
  it('the same models have profiles', () => {
    expect(Object.keys(node.MODEL_PROFILES).sort()).toEqual(
      Object.keys(edge.MODEL_PROFILES).sort()
    );
  });

  const requests = [
    { content: 'a brief', maxTokens: 2000 },
    { content: 'a brief', system: 'a system prompt', maxTokens: 150 },
    {
      content: [
        { type: 'image' as const, source: { type: 'url' as const, url: 'https://x/y.jpg' } },
        { type: 'text' as const, text: 'question' },
      ],
      maxTokens: 7,
    },
  ];
  for (const model of [SONNET, HAIKU, SONNET_5_5, SONNET_5]) {
    for (const effort of ['low', 'medium', 'high'] as const) {
      it(`${model} @${effort}: byte-identical request bodies`, () => {
        for (const req of requests) {
          expect(JSON.stringify(node.buildRequestBody(model, req, effort))).toBe(
            JSON.stringify(edge.buildRequestBody(model, req, effort))
          );
        }
      });
    }
  }

  it('reply parsing matches on every shape', () => {
    const payloads = [
      { content: [{ type: 'text', text: 'plain' }], stop_reason: 'end_turn' },
      {
        content: [
          { type: 'thinking', thinking: 'x' },
          { type: 'text', text: 'after thinking' },
        ],
        stop_reason: 'end_turn',
        usage: { input_tokens: 3, output_tokens: 4 },
      },
      { content: [], stop_reason: 'refusal', stop_details: { category: 'general_harms' } },
      { content: [{ type: 'text', text: 'cut' }], stop_reason: 'max_tokens' },
      null,
      { content: 'junk' },
    ];
    for (const p of payloads) expect(node.parseReply(p)).toEqual(edge.parseReply(p));
  });

  it('route strings and overrides parse the same', () => {
    for (const s of [
      'claude-sonnet-5-5',
      'claude-sonnet-5-5@medium',
      ' claude-sonnet-5-5@max ',
      '',
      '@high',
      `${HAIKU}@low`,
    ]) {
      expect(node.parseRouteString(s)).toEqual(edge.parseRouteString(s));
      expect(node.parseLlmOverride(s)).toEqual(edge.parseLlmOverride(s));
    }
  });

  it('the same text-refusal guard', () => {
    for (const t of [
      "I'll pass on this one.",
      "I'm not going to write this one.",
      'I can’t write this as specified.',
      'Unfortunately I cannot help',
      'cinematic photograph of a lighthouse',
      '{"scene_description": "I can see it"}',
    ])
      expect(node.isMetaReply(t)).toBe(edge.isMetaReply(t));
    expect(Object.keys(node.LLM_JOBS).filter((j: string) => node.LLM_JOBS[j].textOut)).toEqual([
      'bot_prompt',
      'bot_polish',
    ]);
  });

  it('the same retry ladder and retryable statuses', () => {
    expect(node.RETRY_DELAYS_MS).toEqual([...edge.RETRY_DELAYS_MS]);
    expect([...node.RETRYABLE_STATUSES].sort()).toEqual([...edge.RETRYABLE_STATUSES].sort());
  });

  it('the Node bot jobs keep today’s chains', () => {
    expect(node.modelChain('bot_prompt', SONNET)).toEqual([SONNET, HAIKU]);
    expect(node.modelChain('bot_polish', HAIKU)).toEqual([HAIKU, SONNET]);
    expect(node.modelChain('bot_prompt', SONNET_5_5)).toEqual([SONNET_5_5, SONNET, HAIKU]);
  });
});

describe('Node client', () => {
  type Reply = { status: number; body: unknown };
  const ok = (text: string, extra = {}): Reply => ({
    status: 200,
    body: { content: [{ type: 'text', text }], stop_reason: 'end_turn', ...extra },
  });
  let bodies: string[] = [];
  const realFetch = global.fetch;
  function mockFetch(...replies: Reply[]) {
    bodies = [];
    const q = [...replies];
    global.fetch = jest.fn(async (_u: unknown, init?: { body?: string }) => {
      bodies.push(String(init && init.body));
      const r = q.shift();
      if (!r) throw new Error('no reply');
      return {
        ok: r.status < 300,
        status: r.status,
        json: async () => r.body,
        text: async () => JSON.stringify(r.body),
      };
    }) as unknown as typeof fetch;
  }
  afterAll(() => {
    global.fetch = realFetch;
  });

  it('bot_prompt on 4.6 sends the pre-client body (botEngine.callModelWithRetry at b13c6b97)', async () => {
    mockFetch(ok('a flux prompt long enough'));
    await node.callClaude({ job: 'bot_prompt', key: 'k', content: 'BRIEF', maxTokens: 2000 });
    expect(bodies[0]).toBe(
      JSON.stringify({
        model: SONNET,
        max_tokens: 2000,
        messages: [{ role: 'user', content: 'BRIEF' }],
      })
    );
  });

  it('config routing + preview for a bot user, with stamps', async () => {
    const stamps: string[] = [];
    const llm = node.createLlmContext({
      routing: {
        models: {},
        previewUserIds: ['alphabot-id'],
        previewModels: { bot_prompt: { model: SONNET_5_5 } },
      },
      userId: 'alphabot-id',
      stamp: (s: string) => stamps.push(s),
    });
    mockFetch(ok('written by five point five'));
    const r = await node.callClaude({
      job: 'bot_prompt',
      llm,
      key: 'k',
      content: 'B',
      maxTokens: 2000,
    });
    expect(r.model).toBe(SONNET_5_5);
    expect(JSON.parse(bodies[0]).max_tokens).toBe(2700);
    expect(llm.stamps()).toEqual(['llm_preview', `llm:bot_prompt:${SONNET_5_5}`]);
    expect(stamps).toEqual(llm.stamps());
  });

  it('a failed chain throws with every model’s failure attached', async () => {
    mockFetch({ status: 400, body: {} }, { status: 401, body: {} });
    await expect(
      node.callClaude({ job: 'bot_prompt', key: 'k', content: 'B', maxTokens: 5 })
    ).rejects.toMatchObject({
      failures: [
        { model: SONNET, kind: 'http' },
        { model: HAIKU, kind: 'http' },
      ],
    });
  });

  it('the --llm-model override moves bot_prompt but leaves the Haiku polish on Haiku', () => {
    const llm = node.createLlmContext({ override: SONNET_5_5 });
    expect(node.resolveRoute('bot_prompt', llm).route.model).toBe(SONNET_5_5);
    expect(node.resolveRoute('bot_polish', llm).route.model).toBe(HAIKU);
  });

  it('an unknown job is a programming error, not a silent default', async () => {
    await expect(
      node.callClaude({ job: 'nope', key: 'k', content: 'B', maxTokens: 5 })
    ).rejects.toThrow(/Unknown LLM job/);
  });

  it('offlineModel swaps only a Sonnet 4.6 call; a pinned Haiku judge is left alone', () => {
    const argv = ['node', 'x.js', '--llm-model', 'claude-sonnet-5-5@medium'];
    expect(node.offlineModel(SONNET, argv, {})).toEqual({ model: SONNET_5_5, effort: 'medium' });
    expect(node.offlineModel(HAIKU, argv, {})).toEqual({ model: HAIKU });
    expect(node.offlineModel(SONNET, ['node', 'x.js'], {})).toEqual({ model: SONNET });
    expect(node.offlineModel(SONNET, ['node'], { LLM_MODEL_OVERRIDE: SONNET_5_5 })).toEqual({
      model: SONNET_5_5,
    });
  });

  it('offlineBody keeps the pre-client body for 4.6 and for a model with no profile', () => {
    expect(node.offlineBody({ model: SONNET }, 'P', 8000)).toEqual({
      model: SONNET,
      max_tokens: 8000,
      messages: [{ role: 'user', content: 'P' }],
    });
    expect(node.offlineBody({ model: 'claude-other' }, 'P', 10)).toEqual({
      model: 'claude-other',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'P' }],
    });
  });
});

describe('bot engine wrapper', () => {
  const src = readFileSync(join(__dirname, '../../scripts/lib/botEngine.js'), 'utf8');
  it('keeps the "Claude exhausted" text the bot monitors alarm on', () => {
    expect(src).toMatch(/Claude exhausted: primary=/);
  });
  it('routes every brief call through the client and writes the stamps to bot_run_log', () => {
    expect(src).not.toMatch(/api\.anthropic\.com/);
    expect(src).toMatch(/anthropic\.callClaude\(/);
    expect((src.match(/llm_models: llm\.stamps\(\)/g) || []).length).toBe(2);
  });
});
