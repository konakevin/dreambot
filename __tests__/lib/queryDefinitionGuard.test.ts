/**
 * Guard: a cached query key has ONE definition (key + fetch + shape), exported as
 * `<name>QueryOptions` from its hook and reused by any prefetch. Two definitions of the same
 * key with different shapes or timing is how the Profile tab flashed "Add a header" and jumped
 * (2026-09-28: the boot prefetch cached the raw RPC row), and how the first Home card's heart
 * showed empty then filled red (the liked set only loaded when the feed mounted).
 *
 * Fails CI when any file other than the owner defines a queryFn for one of these keys, when a
 * key that must never be hand-written is written with setQueryData, or when the boot prefetch
 * stops using the shared definitions. Invalidations and the like/save buttons' optimistic
 * setQueryData on likeIds / favoriteIds are fine.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..', '..');
const DIRS = ['app', 'components', 'hooks', 'lib', 'store'];

const KEYS = [
  { key: 'publicProfile', owner: 'hooks/usePublicProfile.ts', noSetQueryData: true },
  { key: 'likeIds', owner: 'hooks/useLikeIds.ts', noSetQueryData: false },
  { key: 'favoriteIds', owner: 'hooks/useFavoriteIds.ts', noSetQueryData: false },
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = DIRS.flatMap((d) => sourceFiles(path.join(ROOT, d))).map((f) => ({
  rel: path.relative(ROOT, f).split(path.sep).join('/'),
  src: fs.readFileSync(f, 'utf-8'),
}));

describe.each(KEYS)("['$key', …] has one definition", ({ key, owner, noSetQueryData }) => {
  it(`only ${owner} defines its queryFn`, () => {
    const def = new RegExp(`queryKey:\\s*\\[\\s*'${key}'[\\s\\S]{0,200}?queryFn\\s*:`);
    const offenders = files.filter((f) => f.rel !== owner && def.test(f.src)).map((f) => f.rel);
    expect(offenders).toEqual([]);
  });

  if (noSetQueryData) {
    it('nothing else writes it with setQueryData', () => {
      const write = new RegExp(`setQueryData[^(]*\\(\\s*\\[\\s*'${key}'`);
      const offenders = files.filter((f) => f.rel !== owner && write.test(f.src)).map((f) => f.rel);
      expect(offenders).toEqual([]);
    });
  }
});

describe('the boot prefetch uses the shared definitions', () => {
  const layout = fs.readFileSync(path.join(ROOT, 'app', '_layout.tsx'), 'utf-8');
  it.each(['publicProfileQueryOptions', 'likeIdsQueryOptions', 'favoriteIdsQueryOptions'])(
    '%s',
    (fn) => {
      expect(layout).toMatch(new RegExp(`${fn}\\(`));
    }
  );
});
