/**
 * Unit tests for startHqPoll (lib/upscalePoll.ts) — the "secondary requester
 * waits + resolves" mechanism behind the HD download modal.
 *
 * While an on-demand HD upscale runs, the modal polls uploads.image_url_hq and
 * AUTO-SAVES the instant it lands. Because every requester polls that one shared
 * column, they all resolve to the SAME cached image (no duplicate upscale), it
 * saves exactly once, and if the image never lands it gives up gracefully
 * (timeout phase) rather than hanging.
 */

import { startHqPoll, type HqPollDeps } from '@/lib/upscalePoll';

const POLL_MS = 10;
const MAX_POLLS = 5;

function makeDeps(overrides: Partial<HqPollDeps> = {}) {
  const onSave = jest.fn().mockResolvedValue(undefined);
  const onPhase = jest.fn();
  const fetchHq = jest.fn().mockResolvedValue(null);
  const deps: HqPollDeps = {
    fetchHq,
    onSave,
    onPhase,
    pollMs: POLL_MS,
    maxPolls: MAX_POLLS,
    ...overrides,
  };
  return { onSave, onPhase, fetchHq, deps };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('auto-saves the shared HD image the moment a poll finds it', async () => {
  const { fetchHq, onSave, onPhase, deps } = makeDeps();
  fetchHq
    .mockResolvedValueOnce(null) // tick 1 — not ready
    .mockResolvedValue('https://cdn/hq.png'); // tick 2 — landed

  startHqPoll('upload-1', deps);

  await jest.advanceTimersByTimeAsync(POLL_MS);
  expect(onSave).not.toHaveBeenCalled();

  await jest.advanceTimersByTimeAsync(POLL_MS);
  expect(fetchHq).toHaveBeenCalledWith('upload-1');
  expect(onSave).toHaveBeenCalledWith('https://cdn/hq.png');
  expect(onPhase).toHaveBeenCalledWith('saving');
  expect(onPhase).toHaveBeenCalledWith('done');
});

it('saves exactly once and stops polling after it lands', async () => {
  const { fetchHq, onSave, deps } = makeDeps();
  fetchHq.mockResolvedValue('https://cdn/hq.png');

  startHqPoll('upload-1', deps);
  await jest.advanceTimersByTimeAsync(POLL_MS * 10);

  expect(onSave).toHaveBeenCalledTimes(1);
  // polling stopped once saved — no further fetches after the hit
  expect(fetchHq).toHaveBeenCalledTimes(1);
});

it('gives up after the max poll window without saving (graceful timeout)', async () => {
  const { onSave, onPhase, deps } = makeDeps(); // fetchHq always null
  startHqPoll('upload-1', deps);

  await jest.advanceTimersByTimeAsync(POLL_MS * (MAX_POLLS + 2));

  expect(onSave).not.toHaveBeenCalled();
  expect(onPhase).toHaveBeenCalledWith('timeout');
  expect(onPhase).not.toHaveBeenCalledWith('done');
});

it('cancel() stops polling (unmount cleanup)', async () => {
  const { fetchHq, deps } = makeDeps();
  const cancel = startHqPoll('upload-1', deps);

  await jest.advanceTimersByTimeAsync(POLL_MS); // one tick
  const callsBefore = fetchHq.mock.calls.length;
  cancel();
  await jest.advanceTimersByTimeAsync(POLL_MS * 5);

  expect(fetchHq.mock.calls.length).toBe(callsBefore);
});
