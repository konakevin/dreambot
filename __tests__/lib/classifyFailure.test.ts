/**
 * Content-lock for the shared failure classifier (extracted 2026-07-09 from
 * divergent generate-dream/restyle-photo copies). The fixture messages under
 * "provider classes" are VERBATIM failures from the dreamer2927 incident —
 * every one previously classified as 'unknown', which is exactly what this
 * lock prevents regressing to.
 */

// Deno source resolved by the jest moduleNameMapper (@engine/* → _shared/*);
// excluded from tsc like every @engine test.
import { classifyFailure } from '@engine/classifyFailure';

describe('classifyFailure', () => {
  it('classifies provider billing caps', () => {
    expect(
      classifyFailure(
        'OpenAI submit failed (400): {"error":{"message":"Billing hard limit has been reached.","type":"billing_limit_user_error","code":"billing_hard_limit_reached"}}'
      )
    ).toBe('provider_billing');
  });

  it('classifies provider capacity outages', () => {
    expect(
      classifyFailure(
        'Gemini submit failed (503): {"error":{"code":503,"message":"This model is currently experiencing high demand.","status":"UNAVAILABLE"}}'
      )
    ).toBe('provider_unavailable');
  });

  it('classifies generic provider errors', () => {
    expect(
      classifyFailure(
        'Gemini submit failed (500): {"error":{"code":500,"message":"Internal error encountered.","status":"INTERNAL"}}'
      )
    ).toBe('provider_gen');
  });

  it('keeps the pre-existing classes stable', () => {
    expect(classifyFailure('NSFW_CONTENT: flagged')).toBe('nsfw');
    expect(classifyFailure('Flux generation failed')).toBe('flux_gen');
    expect(classifyFailure('Replicate submit failed (500): boom')).toBe('flux_gen');
    expect(classifyFailure('persistToStorage: storage upload failed')).toBe('storage_upload');
    expect(classifyFailure('face_swap: no face detected')).toBe('face_swap');
    expect(classifyFailure('cast source unreachable (410)')).toBe('source_missing');
    expect(classifyFailure('request timed out')).toBe('timeout');
    expect(classifyFailure('Replicate rate-limited (429) after 3 retries')).toBe('rate_limit');
    expect(classifyFailure('something novel exploded')).toBe('unknown');
  });

  it('nsfw wins over provider tokens (safety refusals are content, not outages)', () => {
    expect(classifyFailure('Gemini submit failed (400): blocked by safety settings')).toBe('nsfw');
  });
});
