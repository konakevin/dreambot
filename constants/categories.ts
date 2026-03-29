import type { Category } from '@/types/database';

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'people',  label: 'People' },
  { key: 'animals', label: 'Animals' },
  { key: 'food',    label: 'Food' },
  { key: 'nature',  label: 'Nature' },
  { key: 'funny',   label: 'Funny' },
  { key: 'music',   label: 'Music' },
  { key: 'sports',  label: 'Sports' },
  { key: 'art',     label: 'Art' },
  { key: 'memes',   label: 'Memes' },
  { key: 'beauty',  label: 'Beauty' },
  { key: 'quotes',  label: 'Quotes' },
  { key: 'cute',    label: 'Cute' },
  { key: 'science', label: 'Science' },
];

export const CATEGORY_LABELS: Record<string, string> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
