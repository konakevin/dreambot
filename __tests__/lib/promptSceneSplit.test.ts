/**
 * The Create prompt setting/action split.
 *
 * The bug it fixes (Kevin, 2026-09-21): generate-dream passed the user's WHOLE prompt in
 * as `userPlace`, so "Show me and Steph snowboarding" rendered as `set at a companion
 * snowboarding` and nobody snowboarded — the verb was spent as scenery and could never
 * become anyone's action.
 *
 * The contract that actually matters here is FAIL-OPEN. This sits in the middle of a PAID
 * render with a hard deadline, so every degenerate case must return the whole prompt as
 * the setting with no action, which is byte-for-byte the old behaviour. It may improve a
 * prompt or step aside; it may never block one.
 */

jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import { splitPromptScene } from '@engine/promptSceneSplit';
import { callSonnet } from '@engine/llm';

const mockSonnet = callSonnet as jest.MockedFunction<typeof callSonnet>;
const reply = (text: string) =>
  mockSonnet.mockResolvedValue({ text } as unknown as Awaited<ReturnType<typeof callSonnet>>);

beforeEach(() => mockSonnet.mockReset());

describe('splitPromptScene — the happy path', () => {
  it('splits a prompt into a place and a beat', async () => {
    reply(
      'SETTING: a snow-dusted alpine slope at golden hour\nACTION: carving a turn through fresh powder, knees bent'
    );
    const r = await splitPromptScene('a companion snowboarding', 2, 'key');
    expect(r.setting).toBe('a snow-dusted alpine slope at golden hour');
    expect(r.action).toBe('carving a turn through fresh powder, knees bent');
    expect(r.source).toBe('split');
  });

  it('accepts a scenery-only prompt and leaves the beat to the pose pool', async () => {
    reply('SETTING: a lighthouse on a storm-lashed headland\nACTION: NONE');
    const r = await splitPromptScene('a lighthouse in a storm', 2, 'key');
    expect(r.setting).toBe('a lighthouse on a storm-lashed headland');
    expect(r.action).toBeNull();
    expect(r.source).toBe('split');
  });

  it('tolerates surrounding prose and quoting from the model', async () => {
    reply(
      'Sure!\nSETTING: "a neon-lit Tokyo alley"\nACTION: `sharing takoyaki from a paper tray`\nHope that helps'
    );
    const r = await splitPromptScene('me in tokyo', 1, 'key');
    expect(r.setting).toBe('a neon-lit Tokyo alley');
    expect(r.action).toBe('sharing takoyaki from a paper tray');
  });
});

describe('splitPromptScene — fail-open', () => {
  it('falls back to the whole prompt when the call throws', async () => {
    mockSonnet.mockRejectedValue(new Error('upstream 529'));
    const r = await splitPromptScene('a companion snowboarding', 2, 'key');
    expect(r).toEqual({ setting: 'a companion snowboarding', action: null, source: 'fallback' });
  });

  it('falls back when there is no API key, without calling out', async () => {
    const r = await splitPromptScene('a companion snowboarding', 2, undefined);
    expect(r.source).toBe('fallback');
    expect(mockSonnet).not.toHaveBeenCalled();
  });

  it('falls back on unparseable output rather than guessing', async () => {
    reply('I think they want a snowy scene with two people having fun!');
    const r = await splitPromptScene('a companion snowboarding', 2, 'key');
    expect(r.source).toBe('fallback');
    expect(r.setting).toBe('a companion snowboarding');
  });

  it('takes NEITHER half when the setting is unusable', async () => {
    // A garbled setting means the whole split is untrustworthy; keeping the action from a
    // response we do not otherwise believe would be worse than keeping nothing.
    reply('SETTING: a\nACTION: leaning on the harbour railing, jacket open');
    const r = await splitPromptScene('anything', 2, 'key');
    expect(r.source).toBe('fallback');
    expect(r.action).toBeNull();
  });

  it('an empty or blank prompt never calls out', async () => {
    for (const p of ['', '   ']) {
      const r = await splitPromptScene(p, 2, 'key');
      expect(r.source).toBe('fallback');
      expect(r.action).toBeNull();
    }
    expect(mockSonnet).not.toHaveBeenCalled();
  });
});

describe('splitPromptScene — the beat obeys swap safety', () => {
  // A beat that occludes or turns a face breaks the dual swap, which is the entire point
  // of this work. A rejected beat drops to the pose pool; the SETTING still survives,
  // because it was never the unsafe half.
  it('drops a beat that hides the face', async () => {
    reply('SETTING: a masquerade ballroom\nACTION: holding a feathered mask over the face');
    const r = await splitPromptScene('a masquerade', 2, 'key');
    expect(r.setting).toBe('a masquerade ballroom');
    expect(r.action).toBeNull();
  });

  it('drops a beat that turns away from the camera', async () => {
    reply('SETTING: a clifftop overlook\nACTION: gazing away toward the distant horizon');
    const r = await splitPromptScene('a cliff', 2, 'key');
    expect(r.action).toBeNull();
    expect(r.setting).toBe('a clifftop overlook');
  });

  it('drops an over-energetic beat', async () => {
    reply('SETTING: a festival field\nACTION: leaping into the air with both arms raised overhead');
    const r = await splitPromptScene('a festival', 2, 'key');
    expect(r.action).toBeNull();
  });
});

describe('splitPromptScene — the brief', () => {
  it('asks for couple-safe geometry only when there are two people', async () => {
    reply('SETTING: a rooftop bar\nACTION: NONE');
    await splitPromptScene('a rooftop', 2, 'key');
    expect(String(mockSonnet.mock.calls[0][0])).toContain('clear gap between them');

    mockSonnet.mockReset();
    reply('SETTING: a rooftop bar\nACTION: NONE');
    await splitPromptScene('a rooftop', 1, 'key');
    expect(String(mockSonnet.mock.calls[0][0])).not.toContain('clear gap between them');
  });

  it('carries the user prompt verbatim into the brief', async () => {
    reply('SETTING: a bbq in a backyard\nACTION: NONE');
    await splitPromptScene('me an the wife at a bbq', 2, 'key');
    expect(String(mockSonnet.mock.calls[0][0])).toContain('me an the wife at a bbq');
  });
});
