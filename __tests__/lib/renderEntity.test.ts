/**
 * Tests for renderEntity — trait extraction and medium-native entity building.
 */

import { extractTraits, buildRenderEntity } from '@engine/renderEntity';

describe('extractTraits', () => {
  it('extracts full male description', () => {
    const traits = extractTraits(
      '35-year-old man with sandy brown hair, hazel eyes, full beard, athletic build'
    );
    expect(traits.gender).toBe('male');
    expect(traits.age).toBe('35-');
    expect(traits.hairColor).toContain('sandy');
    expect(traits.eyeColor).toBe('hazel');
    expect(traits.facialHair).toBe('beard');
    expect(traits.build).toBe('athletic');
  });

  it('extracts full female description', () => {
    const traits = extractTraits('young woman with long black hair, green eyes, slim build');
    expect(traits.gender).toBe('female');
    expect(traits.hairColor).toContain('black');
    expect(traits.eyeColor).toBe('green');
    expect(traits.build).toBe('slim');
    expect(traits.facialHair).toBe('none');
  });

  it('uses defaults for minimal description', () => {
    const traits = extractTraits('a person');
    expect(traits.gender).toBe('male');
    expect(traits.age).toBe('adult');
    expect(traits.hairColor).toBe('dark');
    expect(traits.eyeColor).toBe('brown');
    expect(traits.build).toBe('average');
    expect(traits.facialHair).toBe('none');
  });

  it('detects stocky build', () => {
    const traits = extractTraits('a heavy-set man with brown hair, brown eyes');
    expect(traits.build).toBe('stocky');
  });

  it('detects mustache as facial hair', () => {
    const traits = extractTraits('man with dark hair, blue eyes, thick mustache');
    expect(traits.facialHair).toBe('beard');
  });

  it('parses age range', () => {
    const traits = extractTraits('25-year-old woman with red hair, brown eyes');
    expect(traits.age).toBe('25-');
    expect(traits.gender).toBe('female');
  });
});

describe('buildRenderEntity', () => {
  const fullDesc = '30-year-old man with brown hair, blue eyes, athletic build';

  it('returns natural mode with unchanged description', () => {
    const entity = buildRenderEntity(fullDesc, 'natural', 'anime');
    expect(entity.mode).toBe('natural');
    expect(entity.description).toBe(fullDesc);
  });

  it('returns natural mode when characterRenderMode is empty', () => {
    const entity = buildRenderEntity(fullDesc, '', 'lego');
    expect(entity.mode).toBe('natural');
    expect(entity.description).toBe(fullDesc);
  });

  it('returns embodied mode with LEGO template', () => {
    const entity = buildRenderEntity(fullDesc, 'embodied', 'lego');
    expect(entity.mode).toBe('embodied');
    expect(entity.description).toContain('LEGO minifigure');
    expect(entity.description).toContain('blue');
  });

  it('returns embodied mode with claymation template', () => {
    const entity = buildRenderEntity(fullDesc, 'embodied', 'claymation');
    expect(entity.mode).toBe('embodied');
    expect(entity.description).toContain('clay');
    expect(entity.description).toContain('fingerprint');
  });

  it('returns generic fallback for unknown medium key', () => {
    const entity = buildRenderEntity(fullDesc, 'embodied', 'unknown_medium');
    expect(entity.mode).toBe('embodied');
    expect(entity.description).toContain('stylized');
    expect(entity.description).toContain('male');
    expect(entity.description).toContain('hair');
  });

  it('fills gender torso for lego male', () => {
    const entity = buildRenderEntity(fullDesc, 'embodied', 'lego');
    expect(entity.description).toContain('masculine');
  });

  it('fills gender torso for lego female', () => {
    const femaleDesc = 'young woman with blonde hair, green eyes';
    const entity = buildRenderEntity(femaleDesc, 'embodied', 'lego');
    expect(entity.description).toContain('feminine');
  });
});
