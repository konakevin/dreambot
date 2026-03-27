import type { Category } from '@/types/database';

export const CATEGORIES: { key: Category; label: string; color: string }[] = [
  { key: 'people',  label: 'People',  color: '#6699EE' },
  { key: 'animals', label: 'Animals', color: '#DDAA66' },
  { key: 'food',    label: 'Food',    color: '#DD7766' },
  { key: 'nature',  label: 'Nature',  color: '#77CC88' },
  { key: 'funny',   label: 'Funny',   color: '#CCDD55' },
  { key: 'music',   label: 'Music',   color: '#CC99FF' },
  { key: 'sports',  label: 'Sports',  color: '#44BBCC' },
  { key: 'art',     label: 'Art',     color: '#EECB55' },
];

export const CATEGORY_LABELS: Record<string, string> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

export const CATEGORY_COLORS: Record<string, string> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c.color]));
