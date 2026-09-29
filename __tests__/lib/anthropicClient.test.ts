/**
 * anthropic.ts — the one Edge Anthropic client (LLM_MIGRATION.md, step 0).
 *
 * Step 0's promise is NO BEHAVIOUR CHANGE on Sonnet 4.6 / Haiku: every call site must send the exact request body
 * it sent before the client existed. The "pre-client body" literals below are the JSON.stringify expressions those
 * call sites used at b13c6b97, copied verbatim; the test drives the real module through a mocked fetch and compares
 * the bytes. Then: the 5.5 profile, reply parsing, the fallback chain, the stamps, and routing precedence.
 */
import {
  applyOverlays,
  buildRequestBody,
  callClaude,
  isMetaReply,
  parseLlmOverlays,
  createLlmContext,
  LlmError,
  modelChain,
  parseLlmOverride,
  parseLlmRoutes,
  parseReply,
  parseRouteString,
  resolveRoute,
  slotsJob,
  type LlmContext,
} from '@engine/anthropic';
import { callSonnet } from '@engine/llm';
import { describeWithVision, classifyEthnicity, classifyHairColor } from '@engine/vision';
import { assessRenderQuality, assessSceneFallbackPeople } from '@engine/qualityGate';

const SONNET = 'claude-sonnet-4-6';
const SONNET_5_5 = 'claude-sonnet-5-5';
const HAIKU = 'claude-haiku-4-5-20251001';

type Reply = { status: number; body: unknown };
const ok = (text: string, extra: Record<string, unknown> = {}): Reply => ({
  status: 200,
  body: { content: [{ type: 'text', text }], stop_reason: 'end_turn', ...extra },
});
const fail = (status: number): Reply => ({ status, body: { error: { message: `err ${status}` } } });

let bodies: string[] = [];
function mockFetch(...replies: Reply[]) {
  bodies = [];
  const queue = [...replies];
  global.fetch = jest.fn(async (_url: unknown, init?: { body?: string }) => {
    bodies.push(String(init && init.body));
    const r = queue.shift();
    if (!r) throw new Error('no more mocked replies');
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      json: async () => r.body,
      text: async () => JSON.stringify(r.body),
    };
  }) as unknown as typeof fetch;
}

function ctxWith(opts: Partial<Parameters<typeof createLlmContext>[0]> = {}): {
  llm: LlmContext;
  stamps: string[];
} {
  const stamps: string[] = [];
  const llm = createLlmContext({ surface: 'nightly', stamp: (s) => stamps.push(s), ...opts });
  return { llm, stamps };
}

const realFetch = global.fetch;
beforeAll(() => {
  (globalThis as unknown as { Deno: unknown }).Deno = {
    env: { get: (k: string) => (k === 'ANTHROPIC_API_KEY' ? 'test-key' : undefined) },
  };
});
afterAll(() => {
  delete (globalThis as unknown as { Deno?: unknown }).Deno;
  global.fetch = realFetch;
});

describe('4.6 and Haiku bodies are byte-identical to the pre-client call sites', () => {
  const img = { type: 'image', source: { type: 'url', url: 'https://x/y.jpg' } };

  it('callSonnet (llm.ts): {model, max_tokens, messages}', async () => {
    mockFetch(ok('a prompt long enough'));
    await callSonnet('THE BRIEF', 'k', 900, { job: 'nightly_slots' });
    expect(bodies[0]).toBe(
      JSON.stringify({
        model: SONNET,
        max_tokens: 900,
        messages: [{ role: 'user', content: 'THE BRIEF' }],
      })
    );
  });

  it('describeWithVision (vision.ts): {model, max_tokens, system, messages}, Haiku by default', async () => {
    mockFetch(ok('Female, average. A woman.'));
    await describeWithVision('https://x/y.jpg', 'PROMPT', 'r', 40, 'SYS');
    expect(bodies[0]).toBe(
      JSON.stringify({
        model: HAIKU,
        max_tokens: 40,
        system: 'SYS',
        messages: [{ role: 'user', content: [img, { type: 'text', text: 'PROMPT' }] }],
      })
    );
  });

  it('describeWithVision with a base64 data URL keeps the base64 source block', async () => {
    mockFetch(ok('x'));
    await describeWithVision('data:image/jpeg;base64,QUJD', 'P', 'r', 10, 'S');
    expect(JSON.parse(bodies[0]).messages[0].content[0]).toEqual({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: 'QUJD' },
    });
  });

  it('cast_describe runs on Sonnet (was the explicit SONNET model argument)', async () => {
    mockFetch(ok('Male, athletic. A man.'));
    await describeWithVision('https://x/y.jpg', 'P', 'r', 400, 'S', { job: 'cast_describe' });
    expect(JSON.parse(bodies[0]).model).toBe(SONNET);
  });

  it('classifyEthnicity / classifyHairColor: {model: SONNET, max_tokens 30 / 20, messages}', async () => {
    mockFetch(ok('White'), ok('dark brown'));
    await classifyEthnicity('https://x/y.jpg');
    await classifyHairColor('https://x/y.jpg');
    const eth = JSON.parse(bodies[0]);
    expect(Object.keys(eth)).toEqual(['model', 'max_tokens', 'messages']);
    expect(eth.model).toBe(SONNET);
    expect(eth.max_tokens).toBe(30);
    const hair = JSON.parse(bodies[1]);
    expect(Object.keys(hair)).toEqual(['model', 'max_tokens', 'messages']);
    expect(hair.max_tokens).toBe(20);
  });

  it('quality gate + scene people: {model: SONNET, max_tokens 24 / 16, messages}', async () => {
    mockFetch(ok('BROKEN: no\nPROFILE: no'), ok('PEOPLE: no'));
    await assessRenderQuality('https://x/y.jpg');
    await assessSceneFallbackPeople('https://x/y.jpg');
    const gate = JSON.parse(bodies[0]);
    expect(Object.keys(gate)).toEqual(['model', 'max_tokens', 'messages']);
    expect([gate.model, gate.max_tokens]).toEqual([SONNET, 24]);
    expect(gate.messages[0].content[0]).toEqual(img);
    const people = JSON.parse(bodies[1]);
    expect([people.model, people.max_tokens]).toEqual([SONNET, 16]);
  });

  it('no body ever carries thinking, output_config, temperature or an assistant turn on 4.6 / Haiku', () => {
    for (const model of [SONNET, HAIKU]) {
      const b = buildRequestBody(model, { content: 'x', system: 's', maxTokens: 100 });
      expect(Object.keys(b)).toEqual(['model', 'max_tokens', 'system', 'messages']);
    }
  });
});

describe('Sonnet 5.5 profile', () => {
  it('thinking between_tools + effort, max_tokens scaled 1.35x (ceil), nothing else added', () => {
    const b = buildRequestBody(SONNET_5_5, { content: 'x', maxTokens: 900 }, 'medium');
    expect(b).toEqual({
      model: SONNET_5_5,
      max_tokens: 1215,
      messages: [{ role: 'user', content: 'x' }],
      thinking: { type: 'between_tools' },
      output_config: { effort: 'medium' },
    });
  });
  it('never sends a prefill, temperature, top_p or top_k', () => {
    const s = JSON.stringify(buildRequestBody(SONNET_5_5, { content: 'x', maxTokens: 10 }));
    expect(s).not.toMatch(/"role":"assistant"|temperature|top_p|top_k|budget_tokens/);
  });
  it('an unknown model id has no profile', () => {
    expect(() => buildRequestBody('claude-typo', { content: 'x', maxTokens: 1 })).toThrow(
      /No model profile/
    );
  });
});

describe('parseReply joins text blocks (never content[0])', () => {
  it('text only', () => {
    expect(parseReply(ok('hello').body).raw).toBe('hello');
  });
  it('thinking block first, then text', () => {
    const r = parseReply({
      content: [
        { type: 'thinking', thinking: 'hmm' },
        { type: 'text', text: 'the answer' },
      ],
      stop_reason: 'end_turn',
    });
    expect(r.raw).toBe('the answer');
  });
  it('several text blocks are joined in order', () => {
    expect(
      parseReply({
        content: [
          { type: 'text', text: 'a ' },
          { type: 'thinking', thinking: 'x' },
          { type: 'text', text: 'b' },
        ],
      }).raw
    ).toBe('a b');
  });
  it('refusal with its category; garbage input is empty', () => {
    const r = parseReply({
      content: [],
      stop_reason: 'refusal',
      stop_details: { type: 'refusal', category: 'general_harms' },
    });
    expect([r.stopReason, r.refusalCategory]).toEqual(['refusal', 'general_harms']);
    expect(parseReply(null).raw).toBe('');
    expect(parseReply({ content: 'nope' }).raw).toBe('');
  });
  it('usage is read when present', () => {
    expect(parseReply({ content: [], usage: { input_tokens: 5, output_tokens: 7 } }).usage).toEqual(
      { inputTokens: 5, outputTokens: 7 }
    );
  });
});

describe('the chain: routed model → job default → fallbacks', () => {
  it('modelChain dedupes and keeps the default as the first fallback', () => {
    expect(modelChain('create_brief', SONNET)).toEqual([SONNET, HAIKU]);
    expect(modelChain('create_brief', SONNET_5_5)).toEqual([SONNET_5_5, SONNET, HAIKU]);
    expect(modelChain('cast_describe', SONNET_5_5)).toEqual([SONNET_5_5, SONNET]);
    expect(modelChain('probe_genders', HAIKU)).toEqual([HAIKU]);
  });

  it('callSonnet: a non-retryable 4.6 error falls back to Haiku (today’s safety net), stamped', async () => {
    const { llm, stamps } = ctxWith();
    mockFetch(fail(400), ok('haiku wrote this prompt'));
    const r = await callSonnet('B', 'k', 300, { job: 'nightly_brief', llm });
    expect(r.modelUsed).toBe(HAIKU);
    expect(r.fellBackToSecondary).toBe(true);
    expect(stamps).toEqual([
      'llm:nightly_brief:' + HAIKU,
      `llm_fallback:nightly_brief:${SONNET}→${HAIKU}:http`,
    ]);
  });

  it('callSonnet: a reply under 10 characters fails the model without a retry', async () => {
    mockFetch(ok('short'), ok('a long enough haiku reply'));
    const r = await callSonnet('B', 'k', 300, { job: 'create_brief' });
    expect(r.modelUsed).toBe(HAIKU);
    expect((global.fetch as jest.Mock).mock.calls).toHaveLength(2);
  });

  it('5.5 refusal → 4.6 answers; the refusal and the fallback are both stamped', async () => {
    const { llm, stamps } = ctxWith({
      routing: {
        models: { create_brief: { model: SONNET_5_5 } },
        previewUserIds: [],
        previewModels: {},
      },
    });
    mockFetch(
      {
        status: 200,
        body: {
          content: [],
          stop_reason: 'refusal',
          stop_details: { type: 'refusal', category: 'general_harms' },
        },
      },
      ok('the 4.6 answer is here')
    );
    const r = await callClaude({
      job: 'create_brief',
      llm,
      key: 'k',
      content: 'x',
      maxTokens: 100,
    });
    expect(r.model).toBe(SONNET);
    expect(r.fellBackFrom).toBe(SONNET_5_5);
    expect(JSON.parse(bodies[0]).thinking).toEqual({ type: 'between_tools' });
    expect(JSON.parse(bodies[1])).toEqual({
      model: SONNET,
      max_tokens: 100,
      messages: [{ role: 'user', content: 'x' }],
    });
    expect(stamps).toEqual([
      `llm_refusal:create_brief:${SONNET_5_5}:general_harms`,
      `llm:create_brief:${SONNET}`,
      `llm_fallback:create_brief:${SONNET_5_5}→${SONNET}:refusal`,
    ]);
  });

  it('5.5 all-thinking reply (no text) is EMPTY → next model, never an empty description', async () => {
    const { llm, stamps } = ctxWith({ override: SONNET_5_5 });
    mockFetch(
      {
        status: 200,
        body: { content: [{ type: 'thinking', thinking: '…' }], stop_reason: 'max_tokens' },
      },
      ok('Female, average. A woman with long hair.')
    );
    const out = await describeWithVision('https://x/y.jpg', 'P', 'r', 400, 'S', {
      job: 'cast_describe',
      llm,
    });
    expect(out).toMatch(/^Female/);
    expect(stamps).toContain(`llm_fallback:cast_describe:${SONNET_5_5}→${SONNET}:empty`);
  });

  it('retries a 529 on the same model on the ladder, then answers', async () => {
    mockFetch(fail(529), ok('fine'));
    const r = await callClaude({
      job: 'quality_gate',
      key: 'k',
      content: 'x',
      maxTokens: 5,
      retryDelaysMs: [0],
    });
    expect([r.model, r.retries]).toEqual([SONNET, 1]);
  });

  it('max_tokens is stamped but still returns the text', async () => {
    const { llm, stamps } = ctxWith();
    mockFetch(ok('cut off mid', { stop_reason: 'max_tokens' }));
    const r = await callClaude({ job: 'nightly_slots', llm, key: 'k', content: 'x', maxTokens: 5 });
    expect(r.stopReason).toBe('max_tokens');
    expect(stamps).toContain(`llm_truncated:nightly_slots:${SONNET}`);
  });

  it('the whole chain failing throws the last error and stamps llm_failed', async () => {
    const { llm, stamps } = ctxWith();
    mockFetch(fail(400), fail(401));
    await expect(
      callClaude({ job: 'create_brief', llm, key: 'k', content: 'x', maxTokens: 5 })
    ).rejects.toThrow(`${HAIKU} 401`);
    expect(stamps).toContain('llm_failed:create_brief:http');
  });

  it('no key → LlmError no_key', async () => {
    await expect(
      callClaude({ job: 'create_brief', key: '', content: 'x', maxTokens: 5 })
    ).rejects.toBeInstanceOf(LlmError);
  });
});

describe('a message to the user in place of the output (5.5 on a self-contradicting or intimate brief)', () => {
  // Real 5.5 replies from the parity bench (2026-09-29): on a text-out job this sentence would ship as the prompt.
  const DECLINES = [
    "I'm not going to write this one. The location prompt asks for a scene built around someone in lingerie",
    "I'll pass on this one. The location prompt centers on a person in lingerie lying down",
    "I can't write this one as specified. The scene section asks for a vampire queen",
  ];
  it('isMetaReply catches them and never a real prompt', () => {
    for (const d of DECLINES) expect(isMetaReply(d)).toBe(true);
    for (const p of [
      'cinematic photograph of a lighthouse at dusk, no text, ultra detailed',
      'Illuminated canyon at dawn, two hikers in the foreground',
      '{"scene_description": "I can see the ocean from the cliff"}',
      'leaning a forearm on the harbor railing, jacket open in the wind',
    ])
      expect(isMetaReply(p)).toBe(false);
  });
  it('on a text-out job it fails the model: the chain moves to 4.6, stamped as a text refusal', async () => {
    const { llm, stamps } = ctxWith({ override: SONNET_5_5 });
    mockFetch(
      ok(DECLINES[1]),
      ok('a neon-city street at night, two travelers, no text, ultra detailed')
    );
    const r = await callClaude({
      job: 'create_brief',
      llm,
      key: 'k',
      content: 'x',
      maxTokens: 450,
    });
    expect(r.model).toBe(SONNET);
    expect(stamps).toContain(`llm_refusal:create_brief:${SONNET_5_5}:text`);
    expect(stamps).toContain(`llm_fallback:create_brief:${SONNET_5_5}→${SONNET}:refusal`);
  });
  it('is not applied to jobs whose reply is not the output (a judge may say "Sorry")', async () => {
    mockFetch(ok('Sorry, BROKEN: no'));
    const r = await callClaude({ job: 'quality_gate', key: 'k', content: 'x', maxTokens: 24 });
    expect(r.text).toBe('Sorry, BROKEN: no');
  });
});

describe('prompt overlays (LLM_5_5_TUNING_PLAN.md): 5.5 tuning that can never touch 4.6', () => {
  const OVERLAYS = parseLlmOverlays([
    {
      key: 'a1',
      job: 'create_brief',
      model: SONNET_5_5,
      mode: 'append',
      body: 'EXTRA RULE',
      active: false,
    },
    {
      key: 'a2',
      job: 'create_brief',
      model: SONNET_5_5,
      mode: 'replace',
      find: 'OLD',
      body: 'NEW',
      active: true,
    },
    {
      key: 'a3',
      job: 'quality_gate',
      model: SONNET_5_5,
      mode: 'prepend',
      body: 'PRE',
      active: true,
    },
    {
      key: 'bad',
      job: 'create_brief',
      model: SONNET_5_5,
      mode: 'replace',
      body: 'no find',
      active: true,
    },
  ]);
  it('parses rows; a replace without `find` is dropped', () => {
    expect(OVERLAYS.map((o) => o.key)).toEqual(['a1', 'a2', 'a3']);
  });
  it('applyOverlays: only its job + model, in key order; a replace miss is reported', () => {
    expect(applyOverlays('x OLD y', 'create_brief', SONNET_5_5, OVERLAYS)).toEqual({
      text: 'x NEW y\n\nEXTRA RULE',
      applied: ['a1', 'a2'],
      missed: [],
    });
    expect(applyOverlays('x y', 'create_brief', SONNET_5_5, OVERLAYS).missed).toEqual(['a2']);
    expect(applyOverlays('x OLD y', 'create_brief', SONNET, OVERLAYS).text).toBe('x OLD y');
  });
  it('the context holds active overlays + the QA-picked keys only, and stamps the pick', () => {
    const { llm, stamps } = ctxWith({ overlays: OVERLAYS, overlayKeys: 'a1,zz' });
    expect(llm.overlays.map((o) => o.key)).toEqual(['a1', 'a2', 'a3']);
    expect(stamps).toEqual(['qa:llm_overlay:a1', 'qa:llm_overlay_unknown:zz']);
    expect(ctxWith({ overlays: OVERLAYS }).llm.overlays.map((o) => o.key)).toEqual(['a2', 'a3']);
  });
  it('a 4.6 request is byte-identical with overlays present; the 5.5 request gets them, stamped', async () => {
    const { llm, stamps } = ctxWith({ overlays: OVERLAYS, overlayKeys: 'a1' });
    mockFetch(ok('a long enough four point six reply'));
    await callClaude({
      job: 'create_brief',
      llm,
      key: 'k',
      content: 'brief OLD text',
      maxTokens: 450,
    });
    expect(bodies[0]).toBe(
      JSON.stringify({
        model: SONNET,
        max_tokens: 450,
        messages: [{ role: 'user', content: 'brief OLD text' }],
      })
    );
    const five = ctxWith({ overlays: OVERLAYS, overlayKeys: 'a1', override: SONNET_5_5 });
    mockFetch(ok('a long enough five point five reply'));
    await callClaude({
      job: 'create_brief',
      llm: five.llm,
      key: 'k',
      content: 'brief OLD text',
      maxTokens: 450,
    });
    expect(JSON.parse(bodies[0]).messages[0].content).toBe('brief NEW text\n\nEXTRA RULE');
    expect(five.stamps).toEqual(
      expect.arrayContaining(['llm_overlay:create_brief:a1', 'llm_overlay:create_brief:a2'])
    );
    expect(stamps.some((x) => x.startsWith('llm_overlay:'))).toBe(false);
  });
  it('a 5.5 failure falls back to 4.6 with 4.6 text, not the overlaid text', async () => {
    const { llm } = ctxWith({ overlays: OVERLAYS, override: SONNET_5_5 });
    mockFetch(fail(400), ok('the four point six fallback answered'));
    await callClaude({
      job: 'create_brief',
      llm,
      key: 'k',
      content: 'brief OLD text',
      maxTokens: 450,
    });
    expect(JSON.parse(bodies[0]).messages[0].content).toBe('brief NEW text');
    expect(JSON.parse(bodies[1]).messages[0].content).toBe('brief OLD text');
  });
  it('on image content, the last text block gets the overlay', async () => {
    const { llm } = ctxWith({ overlays: OVERLAYS, override: SONNET_5_5 });
    mockFetch(ok('BROKEN: no'));
    await callClaude({
      job: 'quality_gate',
      llm,
      key: 'k',
      content: [
        { type: 'image', source: { type: 'url', url: 'https://x/y.jpg' } },
        { type: 'text', text: 'Q' },
      ],
      maxTokens: 24,
    });
    expect(JSON.parse(bodies[0]).messages[0].content[1]).toEqual({
      type: 'text',
      text: 'PRE\n\nQ',
    });
  });
});

describe('vision keeps its contract', () => {
  it('a refusal returns "" (read as unread), as before', async () => {
    mockFetch({ status: 200, body: { content: [], stop_reason: 'refusal' } });
    await expect(
      describeWithVision('https://x/y.jpg', 'P', 'r', 40, 'S', { job: 'probe_genders' })
    ).resolves.toBe('');
  });
  it('an API error throws "Vision API failed: <status>"', async () => {
    mockFetch(fail(400));
    await expect(describeWithVision('https://x/y.jpg', 'P', 'r')).rejects.toThrow(
      'Vision API failed: 400'
    );
  });
  it('classifiers and the gate fail SAFE (null) on an API error', async () => {
    mockFetch(fail(500), fail(500), fail(500));
    await expect(classifyEthnicity('https://x/y.jpg')).resolves.toBeNull();
    await expect(classifyHairColor('https://x/y.jpg')).resolves.toBeNull();
    await expect(assessRenderQuality('https://x/y.jpg')).resolves.toBeNull();
  });
});

describe('routing precedence: QA override > preview > config > code default', () => {
  const routing = {
    models: {
      create_brief: { model: SONNET_5_5, effort: 'medium' as const },
      quality_gate: { model: 'claude-typo' },
    },
    previewUserIds: ['kevin'],
    previewModels: { create_slots: { model: SONNET_5_5 } },
  };
  it('default when nothing is configured', () => {
    expect(resolveRoute('create_brief', null)).toEqual({
      route: { model: SONNET },
      source: 'default',
    });
    expect(resolveRoute('probe_genders', ctxWith().llm).route.model).toBe(HAIKU);
  });
  it('config routes a job, with its effort', () => {
    const { llm } = ctxWith({ routing });
    expect(resolveRoute('create_brief', llm)).toEqual({
      route: { model: SONNET_5_5, effort: 'medium' },
      source: 'config',
    });
  });
  it('a configured model with no profile is ignored (default runs) and stamped', async () => {
    const { llm, stamps } = ctxWith({ routing });
    expect(resolveRoute('quality_gate', llm)).toEqual({
      route: { model: SONNET },
      source: 'default',
      invalid: 'claude-typo',
    });
    mockFetch(ok('BROKEN: no'));
    await assessRenderQuality('https://x/y.jpg', llm);
    expect(JSON.parse(bodies[0]).model).toBe(SONNET);
    expect(stamps).toContain('llm_config_invalid:quality_gate:claude-typo');
  });
  it('preview accounts get the preview map on top of the config; others do not', () => {
    expect(
      resolveRoute('create_slots', ctxWith({ routing, userId: 'kevin' }).llm).route.model
    ).toBe(SONNET_5_5);
    expect(
      resolveRoute('create_slots', ctxWith({ routing, userId: 'someone' }).llm).route.model
    ).toBe(SONNET);
    expect(ctxWith({ routing, userId: 'kevin' }).stamps).toContain('llm_preview');
  });
  it('a QA override beats everything, is stamped, and an unknown one is ignored', () => {
    const { llm, stamps } = ctxWith({ routing, override: `${HAIKU}@low` });
    expect(resolveRoute('create_brief', llm).route).toEqual({ model: HAIKU, effort: 'low' });
    expect(stamps).toEqual([`qa:llm_model:${HAIKU}@low`]);
    // Haiku jobs keep Haiku under the override: a parity render moves one variable.
    expect(resolveRoute('probe_genders', llm).route).toEqual({ model: HAIKU });
    const bad = ctxWith({ routing, override: 'gpt-9' });
    expect(bad.llm.override).toBeNull();
    expect(bad.stamps).toEqual(['qa:llm_model_ignored:gpt-9']);
  });
  it('stamps are deduplicated per request', () => {
    const { llm, stamps } = ctxWith();
    llm.stamp('llm:x:y');
    llm.stamp('llm:x:y');
    expect(stamps).toEqual(['llm:x:y']);
  });
});

describe('config parsing', () => {
  it('parseRouteString: model, model@effort, a bad effort is dropped', () => {
    expect(parseRouteString('claude-sonnet-5-5')).toEqual({ model: SONNET_5_5 });
    expect(parseRouteString(' claude-sonnet-5-5@medium ')).toEqual({
      model: SONNET_5_5,
      effort: 'medium',
    });
    expect(parseRouteString('claude-sonnet-5-5@max')).toEqual({ model: SONNET_5_5 });
    expect(parseRouteString('')).toBeNull();
  });
  it('parseLlmRoutes: string or object values; non-job keys and junk dropped', () => {
    expect(
      parseLlmRoutes({
        create_brief: 'claude-sonnet-5-5@high',
        cast_hair: { model: SONNET_5_5, effort: 'low' },
        not_a_job: SONNET_5_5,
        quality_gate: 42,
      })
    ).toEqual({
      create_brief: { model: SONNET_5_5, effort: 'high' },
      cast_hair: { model: SONNET_5_5, effort: 'low' },
    });
    expect(parseLlmRoutes(null)).toEqual({});
    expect(parseLlmRoutes(['create_brief'])).toEqual({});
  });
  it('parseLlmOverride only accepts a model with a profile', () => {
    expect(parseLlmOverride('claude-sonnet-5-5@low')).toEqual({ model: SONNET_5_5, effort: 'low' });
    expect(parseLlmOverride('claude-typo')).toBeNull();
    expect(parseLlmOverride(5)).toBeNull();
  });
  it('slotsJob picks the surface’s slot job', () => {
    expect(slotsJob(createLlmContext({ surface: 'create' }))).toBe('create_slots');
    expect(slotsJob(createLlmContext({ surface: 'nightly' }))).toBe('nightly_slots');
    expect(slotsJob(null)).toBe('nightly_slots');
  });
});
