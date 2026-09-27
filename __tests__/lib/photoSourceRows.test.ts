import { photoSourceRows } from '@/lib/photoSourceRows';

const noop = () => {};

describe('photoSourceRows', () => {
  it('keeps the plain photo sheet (Create) as library then camera', () => {
    const rows = photoSourceRows({ onLibrary: noop, onCamera: noop });
    expect(rows.map((r) => r.key)).toEqual(['library', 'camera']);
  });

  it('leads a profile-picture sheet with "Choose from your dreams"', () => {
    const onDreams = jest.fn();
    const rows = photoSourceRows({ onDreams, onLibrary: noop, onCamera: noop, onDelete: noop });
    expect(rows.map((r) => r.key)).toEqual(['dreams', 'library', 'camera', 'delete']);
    expect(rows[0].label).toBe('Choose from your dreams');
    rows[0].onPress?.();
    expect(onDreams).toHaveBeenCalledTimes(1);
  });
});
