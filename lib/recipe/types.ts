/**
 * Recipe Engine — shared types.
 */

export interface TaggedOption {
  text: string;
  axes?: Partial<
    Record<'realism' | 'complexity' | 'energy' | 'color_warmth' | 'brightness', 'high' | 'low'>
  >;
}

export interface PromptInput {
  // TECHNIQUE layer
  medium: string;
  colorKeywords: string;
  weirdnessModifier: string;
  scaleModifier: string;
  // SUBJECT layer
  interests: string[];
  action: string;
  sceneType: string;
  spiritCompanion: string | null;
  spiritAppears: boolean;
  dreamSubject: string;
  // WORLD layer
  eraKeywords: string;
  settingKeywords: string;
  // ATMOSPHERE layer
  mood: string;
  lighting: string;
  personalityTags: string[];
  sceneAtmosphere: string;
}
