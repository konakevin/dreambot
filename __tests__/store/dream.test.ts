import { useDreamStore } from '@/store/dream';

describe('useDreamStore', () => {
  beforeEach(() => {
    useDreamStore.getState().reset();
  });

  it('initializes with default config', () => {
    const { config, result } = useDreamStore.getState();
    expect(config.mode).toBe('surprise');
    expect(config.photoBase64).toBeNull();
    expect(config.photoUri).toBeNull();
    expect(config.photoStyle).toBe('new_scene');
    expect(config.selectedMedium).toBe('surprise_me_face');
    expect(config.selectedVibe).toBe('surprise_me');
    expect(config.userPrompt).toBe('');
    expect(result).toBeNull();
  });

  it('setMode updates mode', () => {
    useDreamStore.getState().setMode('photo');
    expect(useDreamStore.getState().config.mode).toBe('photo');
  });

  it('setPhoto sets base64, uri, and mode', () => {
    useDreamStore.getState().setPhoto('abc123', 'file:///photo.jpg');
    const { config } = useDreamStore.getState();
    expect(config.photoBase64).toBe('abc123');
    expect(config.photoUri).toBe('file:///photo.jpg');
    expect(config.mode).toBe('photo');
  });

  it('setPhotoStyle updates photoStyle', () => {
    useDreamStore.getState().setPhotoStyle('new_scene');
    expect(useDreamStore.getState().config.photoStyle).toBe('new_scene');
  });

  it('setMedium updates selectedMedium', () => {
    useDreamStore.getState().setMedium('watercolor');
    expect(useDreamStore.getState().config.selectedMedium).toBe('watercolor');
  });

  it('setVibe updates selectedVibe', () => {
    useDreamStore.getState().setVibe('cinematic');
    expect(useDreamStore.getState().config.selectedVibe).toBe('cinematic');
  });

  it('setPrompt updates userPrompt', () => {
    useDreamStore.getState().setPrompt('a dragon in the sky');
    expect(useDreamStore.getState().config.userPrompt).toBe('a dragon in the sky');
  });

  it('setResult stores dream result', () => {
    const result = {
      imageUrl: 'https://example.com/dream.jpg',
      prompt: 'test prompt',
      aiConcept: null,
      dreamMode: 'v2',
      archetype: null,
      resolvedMedium: 'watercolor',
      resolvedVibe: 'dreamy',
      uploadId: null,
    };
    useDreamStore.getState().setResult(result);
    expect(useDreamStore.getState().result).toEqual(result);
  });

  it('clearResult clears result but keeps config', () => {
    useDreamStore.getState().setMedium('anime');
    useDreamStore.getState().setVibe('epic');
    useDreamStore.getState().setResult({
      imageUrl: 'url',
      prompt: 'p',
      aiConcept: null,
      dreamMode: null,
      archetype: null,
      resolvedMedium: 'anime',
      resolvedVibe: 'epic',
      uploadId: null,
    });

    useDreamStore.getState().clearResult();

    expect(useDreamStore.getState().result).toBeNull();
    expect(useDreamStore.getState().config.selectedMedium).toBe('anime');
    expect(useDreamStore.getState().config.selectedVibe).toBe('epic');
  });

  it('reset clears everything', () => {
    useDreamStore.getState().setMedium('lego');
    useDreamStore.getState().setPhoto('base64', 'uri');
    useDreamStore.getState().setResult({
      imageUrl: 'url',
      prompt: 'p',
      aiConcept: null,
      dreamMode: null,
      archetype: null,
      resolvedMedium: 'lego',
      resolvedVibe: 'epic',
      uploadId: null,
    });

    useDreamStore.getState().reset();

    const { config, result } = useDreamStore.getState();
    expect(config.selectedMedium).toBe('surprise_me_face');
    expect(config.photoBase64).toBeNull();
    expect(result).toBeNull();
  });
});
