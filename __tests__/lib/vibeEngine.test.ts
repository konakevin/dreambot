import {
  buildConceptPrompt,
  buildPolisherPrompt,
  buildFallbackConcept,
  buildFallbackFluxPrompt,
  parseConceptJson,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — @engine/ alias resolved by Jest, not tsc (supabase/functions excluded from tsconfig)
} from '@engine/vibeEngine';
import type { VibeProfile } from '@/types/vibeProfile';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';

const TEST_PROFILE: VibeProfile = {
  version: 2,
  aesthetics: ['dark', 'dreamy', 'epic'],
  art_styles: ['anime', 'watercolor'],
  moods: {
    peaceful_chaotic: 0.3,
    cute_terrifying: 0.2,
    minimal_maximal: 0.7,
    realistic_surreal: 0.8,
  },
  dream_seeds: {
    characters: ['a fox', 'astronauts'],
    places: ['a rooftop at sunset', 'underwater cities'],
    things: ['vintage cameras', 'crystals'],
  },
  dream_cast: [],
  avoid: ['text', 'gore'],
};

describe('buildConceptPrompt', () => {
  it('includes user aesthetics', () => {
    const prompt = buildConceptPrompt(TEST_PROFILE);
    expect(prompt).toContain('dark');
    expect(prompt).toContain('dreamy');
    expect(prompt).toContain('epic');
  });

  it('includes art styles', () => {
    const prompt = buildConceptPrompt(TEST_PROFILE);
    expect(prompt).toContain('anime');
    expect(prompt).toContain('watercolor');
  });

  it('includes mood descriptions', () => {
    const prompt = buildConceptPrompt(TEST_PROFILE);
    // peaceful_chaotic=0.3 → "balanced energy" (< 0.3 for "deeply peaceful")
    expect(prompt).toMatch(/balanced energy|peaceful/i);
    // realistic_surreal=0.8 should be "surreal"
    expect(prompt).toMatch(/surreal/i);
  });

  it('includes avoid list', () => {
    const prompt = buildConceptPrompt(TEST_PROFILE);
    expect(prompt).toContain('text, gore');
  });

  it('includes JSON output format instructions', () => {
    const prompt = buildConceptPrompt(TEST_PROFILE);
    expect(prompt).toContain('"subject"');
    expect(prompt).toContain('"environment"');
    expect(prompt).toContain('"twist"');
  });

  it('includes different creative direction per mode', () => {
    const chaos = buildConceptPrompt(TEST_PROFILE, 'chaos');
    const dreamMe = buildConceptPrompt(TEST_PROFILE, 'dream_me');
    // Different modes should produce different creative direction blocks
    expect(chaos).not.toBe(dreamMe);
  });

  it('works with empty profile', () => {
    const prompt = buildConceptPrompt(DEFAULT_VIBE_PROFILE);
    expect(prompt).toContain('dream');
    expect(prompt.length).toBeGreaterThan(100);
  });
});

describe('buildPolisherPrompt', () => {
  const concept = {
    subject: 'a fox astronaut',
    environment: 'floating crystal islands',
    lighting: 'aurora borealis',
    camera: '35mm wide angle',
    style: 'anime watercolor',
    palette: 'teal and amber',
    twist: 'stars are actually tiny jellyfish',
    composition: 'center subject, deep depth',
    mood: 'hauntingly beautiful',
  };

  it('includes the concept JSON', () => {
    const prompt = buildPolisherPrompt(concept);
    expect(prompt).toContain('fox astronaut');
    expect(prompt).toContain('floating crystal islands');
    expect(prompt).toContain('jellyfish');
  });

  it('asks for 50-70 words', () => {
    const prompt = buildPolisherPrompt(concept);
    expect(prompt).toContain('50-70 words');
  });
});

describe('buildFallbackConcept', () => {
  it('returns all required fields', () => {
    const concept = buildFallbackConcept(TEST_PROFILE);
    expect(concept.subject).toBeTruthy();
    expect(concept.environment).toBeTruthy();
    expect(concept.lighting).toBeTruthy();
    expect(concept.camera).toBeTruthy();
    expect(concept.style).toBeTruthy();
    expect(concept.palette).toBeTruthy();
    expect(concept.twist).toBeTruthy();
    expect(concept.composition).toBeTruthy();
    expect(concept.mood).toBeTruthy();
  });

  it('uses profile art styles', () => {
    const concept = buildFallbackConcept(TEST_PROFILE);
    expect(['anime', 'watercolor']).toContain(concept.style);
  });

  it('handles empty profile', () => {
    const concept = buildFallbackConcept(DEFAULT_VIBE_PROFILE);
    expect(concept.subject).toBeTruthy();
    expect(concept.style).toBe('digital painting');
  });
});

describe('buildFallbackFluxPrompt', () => {
  it('concatenates concept fields', () => {
    const concept = buildFallbackConcept(TEST_PROFILE);
    const prompt = buildFallbackFluxPrompt(concept);
    expect(prompt).toContain(concept.style);
    expect(prompt).toContain(concept.mood);
    expect(prompt).toContain('hyper detailed');
  });
});

describe('parseConceptJson', () => {
  it('parses clean JSON', () => {
    const json =
      '{"subject":"a fox","environment":"forest","lighting":"soft","camera":"wide","style":"anime","palette":"blue","twist":"glowing","composition":"center","mood":"calm"}';
    const result = parseConceptJson(json);
    expect(result.subject).toBe('a fox');
    expect(result.mood).toBe('calm');
  });

  it('strips markdown fences', () => {
    const json =
      '```json\n{"subject":"a fox","environment":"forest","lighting":"soft","camera":"wide","style":"anime","palette":"blue","twist":"glowing","composition":"center","mood":"calm"}\n```';
    const result = parseConceptJson(json);
    expect(result.subject).toBe('a fox');
  });

  it('handles surrounding text', () => {
    const json =
      'Here is the concept:\n{"subject":"a fox","environment":"forest","lighting":"soft","camera":"wide","style":"anime","palette":"blue","twist":"glowing","composition":"center","mood":"calm"}\nHope you like it!';
    const result = parseConceptJson(json);
    expect(result.subject).toBe('a fox');
  });

  it('throws on invalid input', () => {
    expect(() => parseConceptJson('no json here')).toThrow();
  });
});
